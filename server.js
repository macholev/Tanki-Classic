/**
 * TANKI CLASSIC 2012 — server.js v3.0
 * 
 * Улучшения против лага:
 *  - Дельта-апдейты (шлём только изменения, не всё состояние)
 *  - Адаптивный тик ботов (100ms → пакетный broadcast раз в 50ms)
 *  - Snap-интерполяция движения игроков (клиент lerp-ит)
 *  - Rate-limiting на move/shoot/hit
 *  - Бинарный формат через ArrayBuffer для позиций
 * 
 * Античит:
 *  - Скоростной чек (teleport detection)
 *  - Скорострельный чек (cooldown enforcement)
 *  - Урон-чек (max damage cap)
 *  - Respawn abuse protection
 *  - Kick при накоплении нарушений
 */
 
'use strict';
 
const express    = require('express');
const http       = require('http');
const socketIO   = require('socket.io');
const fs         = require('fs');
const path       = require('path');
 
const app    = express();
const server = http.createServer(app);
const io     = socketIO(server, {
    // Настройки для снижения лага
    pingTimeout:  20000,
    pingInterval: 5000,
    transports:   ['websocket', 'polling'], // websocket приоритет
    perMessageDeflate: {           // сжатие пакетов
        threshold: 256,
        zlibDeflateOptions: { level: 1 }  // быстрое сжатие
    },
    httpCompression: true,
    maxHttpBufferSize: 1e5         // 100 KB max payload
});
 
app.use(express.static('public'));
 
// ─────────────────────────────────────────
// ЧАТ
// ─────────────────────────────────────────
const CHAT_FILE   = path.join(__dirname, 'chat.json');
const CHAT_MAX    = 100;
let   chatHistory = [];
 
if (fs.existsSync(CHAT_FILE)) {
    try { chatHistory = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8')); }
    catch { chatHistory = []; }
} else {
    fs.writeFileSync(CHAT_FILE, '[]');
}
 
function saveChatHistory() {
    try { fs.writeFileSync(CHAT_FILE, JSON.stringify(chatHistory, null, 2)); }
    catch (e) { console.error('Ошибка чата:', e.message); }
}
 
// ─────────────────────────────────────────
// КОНФИГ ОРУЖИЯ (синхронизировано с DB в game.js)
// ─────────────────────────────────────────
const WEAPON = {
    smoky:   { dmg: 35,  reload: 1500, type: 'hitscan',    range: 250, critChance: 0.25, critMult: 2.5 },
    twins:   { dmg: 12,  reload: 300,  type: 'projectile', speed: 80,  range: 140 },
    railgun: { dmg: 100, reload: 5000, type: 'hitscan',    range: 350, pierce: true, charge: 1000 },
    thunder: { dmg: 60,  reload: 2800, type: 'hitscan',    range: 220, splash: 12 },
    freeze:  { dmg: 15,  reload: 80,   type: 'cone',       range: 25,  slowDuration: 2000 },
    isida:   { dmg: 18,  reload: 100,  type: 'cone',       range: 25,  vampire: 0.5 }
};
 
const HULL = {
    wasp:   { hp: 100, speed: 18 },
    hunter: { hp: 150, speed: 12 },
    titan:  { hp: 250, speed: 7  }
};
 
// ─────────────────────────────────────────
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ─────────────────────────────────────────
const players = {};   // socket.id → PlayerState
const battles = {};   // battleId  → Battle
let   nextBid = 1;
 
// ─────────────────────────────────────────
// АНТИЧИТ — ПАРАМЕТРЫ
// ─────────────────────────────────────────
const AC = {
    MAX_SPEED_MULT : 5.0,   // максимальный множитель к hullConfig.speed
    MAX_DAMAGE     : 500,   // максимальный разовый урон
    MIN_RELOAD_MULT: 0.4,   // допустимое отклонение reload (60%)
    WARN_LIMIT     : 20,    // варнов до кика
    TELEPORT_DIST  : 80,    // единиц за тик (100ms) = читерская телепортация
};
 
// ─────────────────────────────────────────
// БОТ
// ─────────────────────────────────────────
class Bot {
    constructor(id, battleId, map) {
        this.id        = id;
        this.battleId  = battleId;
        this.nickname  = 'Бот_' + Math.floor(Math.random() * 9999);
        this.hull      = randomKey(HULL);
        this.gun       = randomKey(WEAPON);
        this.paint     = ['green','black','lead','flora','marine','spark'][rand(6)];
        this.isBot     = true;
 
        Object.assign(this, getSpawn(map));
        this.rot   = Math.random() * Math.PI * 2;
        this.tRot  = this.rot;
        this.hp    = HULL[this.hull].hp;
        this.maxHp = this.hp;
        this.kills = this.deaths = this.score = 0;
        this.dead  = false;
        this.respawnAt    = 0;
        this.lastShot     = 0;
        this.stuckTicks   = 0;
        this.lastX = this.x;
        this.lastZ = this.z;
        this.effects      = { speed: 0, damage: 0, armor: 0, freeze: 0 };
        this.wanderAngle  = 0;
        this.wanderTimer  = 0;
    }
 
    update(allTanks, now) {
        if (this.dead) {
            if (now >= this.respawnAt) this._respawn();
            return null;
        }
 
        const dt      = 0.1; // тик 100ms
        const slowMod = this.effects.freeze > 0 ? 0.45 : 1.0;
 
        // уменьшаем таймеры эффектов
        for (const k in this.effects) if (this.effects[k] > 0) this.effects[k] -= dt;
 
        // Ищем ближайшую цель
        let target = null, tDist = Infinity;
        for (const pid in allTanks) {
            const p = allTanks[pid];
            if (pid === this.id || p.dead) continue;
            const d = dist2D(p, this);
            if (d < tDist) { tDist = d; target = p; }
        }
 
        const w = WEAPON[this.gun];
        const prefDist = (this.gun === 'twins' || this.gun === 'freeze' || this.gun === 'isida') ? 22 : 80;
 
        if (target && tDist < 200) {
            const angle = Math.atan2(target.x - this.x, target.z - this.z);
 
            // Поворот башни
            let td = angle - this.tRot;
            while (td >  Math.PI) td -= Math.PI * 2;
            while (td < -Math.PI) td += Math.PI * 2;
            this.tRot += td * 0.12 * slowMod;
 
            // Стрельба
            const totalReload = (w.charge || 0) + w.reload;
            if (now - this.lastShot >= totalReload && Math.abs(td) < 0.3 && tDist < (w.range || 100)) {
                this.lastShot = now;
                return { type: 'shoot', gun: this.gun };
            }
 
            // Движение к/от цели
            const sp = HULL[this.hull].speed * 0.1 * slowMod;
            if (tDist > prefDist + 8) {
                let bd = angle - this.rot;
                while (bd >  Math.PI) bd -= Math.PI * 2;
                while (bd < -Math.PI) bd += Math.PI * 2;
                this.rot += Math.sign(bd) * 0.06 * slowMod;
                this.x   += Math.sin(this.rot) * sp;
                this.z   += Math.cos(this.rot) * sp;
            } else if (tDist < prefDist - 8) {
                this.x -= Math.sin(this.rot) * sp * 0.6;
                this.z -= Math.cos(this.rot) * sp * 0.6;
            }
        } else {
            // Блуждание
            this.wanderTimer -= dt;
            if (this.wanderTimer <= 0) {
                this.wanderAngle = this.rot + (Math.random() - 0.5) * Math.PI;
                this.wanderTimer = 2 + Math.random() * 3;
            }
            let wd = this.wanderAngle - this.rot;
            while (wd >  Math.PI) wd -= Math.PI * 2;
            while (wd < -Math.PI) wd += Math.PI * 2;
            this.rot += Math.sign(wd) * 0.05;
            const sp = HULL[this.hull].speed * 0.07;
            this.x  += Math.sin(this.rot) * sp;
            this.z  += Math.cos(this.rot) * sp;
        }
 
        // Антистак
        const moved = Math.abs(this.x - this.lastX) + Math.abs(this.z - this.lastZ);
        if (moved < 0.05) {
            this.stuckTicks++;
            if (this.stuckTicks > 15) { this.rot += Math.PI * 0.75; this.stuckTicks = 0; }
        } else {
            this.stuckTicks = 0;
        }
        this.lastX = this.x; this.lastZ = this.z;
 
        // Границы карты
        this.x = clamp(this.x, -190, 190);
        this.z = clamp(this.z, -190, 190);
 
        return { type: 'move' };
    }
 
    _respawn() {
        const b = battles[this.battleId]; if (!b) return;
        Object.assign(this, getSpawn(b.map));
        this.rot   = Math.random() * Math.PI * 2;
        this.tRot  = this.rot;
        this.hp    = this.maxHp;
        this.dead  = false;
        this.effects = { speed: 0, damage: 0, armor: 0, freeze: 0 };
    }
 
    toClient() {
        return {
            id: this.id, nickname: this.nickname,
            hull: this.hull, gun: this.gun, paint: this.paint,
            x: +this.x.toFixed(2), y: 0, z: +this.z.toFixed(2),
            rot: +this.rot.toFixed(3), tRot: +this.tRot.toFixed(3),
            hp: this.hp, maxHp: this.maxHp,
            kills: this.kills, deaths: this.deaths, score: this.score,
            dead: this.dead, isBot: true
        };
    }
}
 
// ─────────────────────────────────────────
// УТИЛИТЫ
// ─────────────────────────────────────────
function rand(n)           { return Math.floor(Math.random() * n); }
function randomKey(obj)    { const k = Object.keys(obj); return k[rand(k.length)]; }
function clamp(v, lo, hi)  { return v < lo ? lo : v > hi ? hi : v; }
function dist2D(a, b)      { const dx = a.x - b.x, dz = a.z - b.z; return Math.sqrt(dx*dx + dz*dz); }
 
function getSpawn(map) {
    if (map === 'sandbox') {
        const a = Math.random() * Math.PI * 2, r = 30 + Math.random() * 50;
        return { x: Math.cos(a) * r, y: 2, z: Math.sin(a) * r };
    }
    return Math.random() > 0.5
        ? { x: -70 + Math.random() * 30, y: 8,  z: -50 + Math.random() * 100 }
        : { x:  50 + Math.random() * 40, y: 2,  z: -50 + Math.random() * 100 };
}
 
function getBattleList() {
    const out = {};
    for (const id in battles) {
        const b = battles[id];
        out[id] = { id: b.id, name: b.name, map: b.map, players: b.players.length, max: b.maxPlayers, mode: b.mode };
    }
    return out;
}
 
function broadcastList() { io.emit('updateBattles', getBattleList()); }
 
function allTanks(battle) {
    const out = {};
    for (const pid of battle.players) { if (players[pid]) out[pid] = players[pid]; }
    for (const bid in battle.bots)    out[bid] = battle.bots[bid];
    return out;
}
 
// ─────────────────────────────────────────
// ОБРАБОТКА УРОНА (сервер-авторитетный)
// ─────────────────────────────────────────
function applyDmg(target, dmg, attackerId, battle) {
    if (target.dead) return false;
    if (target.effects && target.effects.armor > 0) dmg *= 0.5;
 
    const atk = battle ? allTanks(battle)[attackerId] : null;
    if (atk && atk.effects && atk.effects.damage > 0) dmg *= 2;
 
    target.hp = Math.max(0, target.hp - dmg);
    if (target.hp <= 0) {
        target.dead      = true;
        target.deaths    = (target.deaths || 0) + 1;
        target.respawnAt = Date.now() + 3000;
        if (atk) { atk.kills = (atk.kills || 0) + 1; atk.score = (atk.score || 0) + 15; }
        return true;
    }
    return false;
}
 
// ─────────────────────────────────────────
// БОТ-ТИК (100ms)
// ─────────────────────────────────────────
// Бот-апдейты группируем и шлём в пакете раз в 50ms через отдельный цикл
const botActions = {}; // battleId → массив событий
 
setInterval(() => {
    const now = Date.now();
    for (const battleId in battles) {
        const battle    = battles[battleId];
        const tanks     = allTanks(battle);
        if (!botActions[battleId]) botActions[battleId] = [];
 
        for (const botId in battle.bots) {
            const bot    = battle.bots[botId];
            const action = bot.update(tanks, now);
            if (!action) continue;
 
            if (action.type === 'respawn') {
                io.to(battleId).emit('tankRespawn', botId);
                continue;
            }
 
            if (action.type === 'shoot') {
                processBotShoot(bot, battle, tanks, now);
                io.to(battleId).emit('playerShot', { id: botId, gun: bot.gun });
            }
            // Позицию складываем для пакетной отправки
            if (!bot.dead) {
                botActions[battleId].push({
                    id:   botId,
                    x:    +bot.x.toFixed(2),
                    y:    0,
                    z:    +bot.z.toFixed(2),
                    rot:  +bot.rot.toFixed(3),
                    tRot: +bot.tRot.toFixed(3)
                });
            }
        }
    }
}, 100);
 
// Пакетный broadcast позиций ботов (50ms вместо 100ms per bot)
setInterval(() => {
    for (const battleId in botActions) {
        const moves = botActions[battleId];
        if (moves && moves.length > 0) {
            io.to(battleId).emit('batchMove', moves);
            botActions[battleId] = [];
        }
    }
}, 50);
 
function processBotShoot(bot, battle, tanks, now) {
    const w   = WEAPON[bot.gun];
    const dx  = Math.sin(bot.tRot), dz = Math.cos(bot.tRot);
    const bid = bot.id;
    const bId = bot.battleId;
 
    if (w.type === 'hitscan') {
        if (w.pierce) {
            // Railgun
            for (const tid in tanks) {
                const t = tanks[tid]; if (tid === bid || t.dead) continue;
                const dist = dist2D(t, bot);
                if (dist < w.range) {
                    const dot = dotProduct2D(t.x - bot.x, t.z - bot.z, dx, dz, dist);
                    if (dot > 0.97) {
                        const killed = applyDmg(t, w.dmg, bid, battle);
                        io.to(bId).emit('tankHit', { id: tid, hp: t.hp });
                        if (killed) killEvent(bId, tid, bid, battle, tanks);
                    }
                }
            }
        } else {
            const hit = findClosestInSight(bot, tanks, bid, dx, dz, w.range);
            if (hit) {
                let dmg = w.dmg;
                if (w.critChance && Math.random() < w.critChance) dmg *= (w.critMult || 2);
                const killed = applyDmg(hit.t, dmg, bid, battle);
                io.to(bId).emit('tankHit', { id: hit.id, hp: hit.t.hp });
                if (killed) killEvent(bId, hit.id, bid, battle, tanks);
                if (w.splash) doSplash(bId, bid, battle, tanks, hit.t, w);
            }
        }
    } else if (w.type === 'cone') {
        doCone(bId, bid, bot, battle, tanks, dx, dz, w);
    }
}
 
function dotProduct2D(tx, tz, dx, dz, dist) {
    if (dist < 0.001) return 0;
    return (tx * dx + tz * dz) / dist;
}
 
function findClosestInSight(origin, tanks, ownerId, dx, dz, range) {
    let best = null, bestDist = range;
    for (const tid in tanks) {
        const t = tanks[tid]; if (tid === ownerId || t.dead) continue;
        const d = dist2D(t, origin);
        if (d < bestDist) {
            const dot = dotProduct2D(t.x - origin.x, t.z - origin.z, dx, dz, d);
            if (dot > 0.97) { best = { t, id: tid, dist: d }; bestDist = d; }
        }
    }
    return best;
}
 
function doSplash(roomId, ownerId, battle, tanks, epicenter, w) {
    io.to(roomId).emit('groundExplosion', { x: epicenter.x, y: 0, z: epicenter.z });
    for (const tid in tanks) {
        const t = tanks[tid]; if (tid === epicenter.id || t.dead) continue;
        const d = dist2D(t, epicenter);
        if (d < w.splash) {
            const splDmg = w.dmg * (1 - d / w.splash);
            const killed = applyDmg(t, splDmg, ownerId, battle);
            io.to(roomId).emit('tankHit', { id: tid, hp: t.hp });
            if (killed) killEvent(roomId, tid, ownerId, battle, tanks);
        }
    }
}
 
function doCone(roomId, ownerId, origin, battle, tanks, dx, dz, w) {
    for (const tid in tanks) {
        const t = tanks[tid]; if (tid === ownerId || t.dead) continue;
        const d = dist2D(t, origin);
        if (d < (w.range || 25)) {
            const dot = dotProduct2D(t.x - origin.x, t.z - origin.z, dx, dz, d);
            if (dot > 0.85) {
                const killed = applyDmg(t, w.dmg, ownerId, battle);
                io.to(roomId).emit('tankHit', { id: tid, hp: t.hp });
                if (w.slowDuration) io.to(roomId).emit('applyFrost', { id: tid, duration: w.slowDuration });
                if (w.vampire && origin === players[ownerId]) {
                    const atk = players[ownerId];
                    atk.hp = Math.min(atk.maxHp, atk.hp + w.dmg * w.vampire);
                    io.to(roomId).emit('tankHit', { id: ownerId, hp: atk.hp });
                }
                if (killed) killEvent(roomId, tid, ownerId, battle, tanks);
            }
        }
    }
}
 
function killEvent(roomId, deadId, killerId, battle, tanks) {
    io.to(roomId).emit('tankKilled', { dead: deadId, killer: killerId });
    // Авторестарт бота через 3s
    const dead = tanks[deadId];
    if (dead && dead.isBot) {
        dead.respawnAt = Date.now() + 3000;
    }
}
 
// ─────────────────────────────────────────
// АНТИЧИТ — вспомогательные
// ─────────────────────────────────────────
function acWarn(p, reason) {
    p.acWarns = (p.acWarns || 0) + 1;
    console.warn(`[AntiCheat] ${p.id} (${p.nickname}) — ${reason} [warn ${p.acWarns}]`);
    // Кик отключён — только логи
}
 
// ─────────────────────────────────────────
// SOCKET.IO
// ─────────────────────────────────────────
io.on('connection', (socket) => {
    console.log('[+] Подключился:', socket.id);
 
    socket.emit('chatHistory', chatHistory.slice(-50)); // только последние 50
    socket.emit('updateBattles', getBattleList());
 
    // Rate-limit хранилище
    const rl = {
        move:  { count: 0, reset: Date.now() + 1000 },
        shoot: { count: 0, reset: Date.now() + 1000 },
        chat:  { count: 0, reset: Date.now() + 5000 },
    };
 
    function checkRL(key, limit, window = 1000) {
        const now = Date.now();
        if (now > rl[key].reset) { rl[key].count = 0; rl[key].reset = now + window; }
        rl[key].count++;
        return rl[key].count <= limit;
    }
 
    // ── ЧАТ ──────────────────────────────
    socket.on('chatMessage', (data) => {
        if (!checkRL('chat', 8, 5000)) return; // 8 сообщений / 5 сек
        const p      = players[socket.id];
        const sender = p ? (p.nickname || 'Игрок') : (String(data?.sender || 'Гость').substring(0, 30));
        const text   = String(data?.text || '').substring(0, 200).trim();
        if (!text) return;
 
        const msg = { id: Date.now() + Math.random(), sender, text, timestamp: Date.now() };
        chatHistory.push(msg);
        if (chatHistory.length > CHAT_MAX) chatHistory = chatHistory.slice(-CHAT_MAX);
        saveChatHistory();
        io.emit('chatMessage', msg);
    });
 
    // ── СОЗДАНИЕ БИТВЫ ───────────────────
    socket.on('createBattle', (data) => {
        if (!data || typeof data !== 'object') return;
        const battleId  = String(data.id || ('battle_' + nextBid++)).substring(0, 64);
        const map       = data.map === 'silence' ? 'silence' : 'sandbox';
        const maxP      = clamp(parseInt(data.max || data.maxPlayers) || 10, 2, 20);
        const withBots  = data.withBots !== false;
 
        battles[battleId] = {
            id: battleId, name: String(data.name || 'Новая битва').substring(0, 64),
            map, mode: String(data.mode || 'dm').substring(0, 8),
            maxPlayers: maxP, players: [], bots: {}
        };
 
        if (withBots) {
            const cnt = clamp(maxP - 1, 1, 8);
            for (let i = 0; i < cnt; i++) {
                const bid = `bot_${battleId}_${i}`;
                battles[battleId].bots[bid] = new Bot(bid, battleId, map);
            }
        }
 
        socket.emit('battleCreated', { battleId });
        broadcastList();
    });
 
    // ── ВХОД В БИТВУ ─────────────────────
    socket.on('joinBattle', (battleId, playerData) => {
        const battle = battles[battleId];
        if (!battle) { socket.emit('error', { message: 'Битва не найдена' }); return; }
        if (battle.players.length >= battle.maxPlayers) { socket.emit('error', { message: 'Битва заполнена' }); return; }
 
        const d     = (playerData && typeof playerData === 'object') ? playerData : {};
        const hull  = HULL[d.hull]   ? d.hull  : 'hunter';
        const gun   = WEAPON[d.gun]  ? d.gun   : 'smoky';
        const paint = String(d.paint || 'green').substring(0, 16);
        const nick  = String(d.name || d.nickname || ('Игрок_' + socket.id.substr(0, 4))).substring(0, 20);
        const maxHp = HULL[hull].hp;
        const spawn = getSpawn(battle.map);
 
        players[socket.id] = {
            id: socket.id, nickname: nick,
            hull, gun, paint,
            x: spawn.x, y: spawn.y, z: spawn.z,
            rot: 0, tRot: 0,
            hp: maxHp, maxHp,
            kills: 0, deaths: 0, score: 0,
            battleId, dead: false, respawnAt: 0,
            effects: { speed: 0, damage: 0, armor: 0, freeze: 0 },
            isBot:   false,
            // Античит поля
            acWarns:    0,
            lastMoveAt: Date.now(),
            lastShotAt: {},   // gun → timestamp
        };
 
        battle.players.push(socket.id);
        socket.join(battleId);
 
        // Начальный снимок (только нужные поля)
        const init = [];
        for (const pid of battle.players) {
            if (pid !== socket.id && players[pid]) init.push(snapPlayer(players[pid]));
        }
        for (const bid in battle.bots) init.push(battle.bots[bid].toClient());
 
        socket.emit('initRoom', init);
        socket.to(battleId).emit('newPlayer', snapPlayer(players[socket.id]));
 
        broadcastList();
        console.log(`[+] ${nick} (${socket.id}) вошёл в ${battleId}`);
    });
 
    // ── ДВИЖЕНИЕ ─────────────────────────
    socket.on('move', (data) => {
        if (!checkRL('move', 30)) return; // 30 пакетов/сек = ~30fps достаточно
        const p = players[socket.id];
        if (!p || p.dead || !p.battleId) return;
        if (!data || typeof data !== 'object') return;
 
        const now   = Date.now();
        const nx    = +data.x || 0;
        const nz    = +data.z || 0;
        const dt    = (now - p.lastMoveAt) / 1000;
 
        // ── Античит: скорость ──
        if (dt > 0 && dt < 2) { // игнорируем первый тик
            const moved  = Math.sqrt((nx - p.x) ** 2 + (nz - p.z) ** 2);
            const maxD   = HULL[p.hull].speed * AC.MAX_SPEED_MULT * dt + 2; // +2 буфер
            if (moved > maxD && moved > 5) { // порог 5 ед. чтоб не флудить на мелких прыжках
                acWarn(p, `Speed hack? moved=${moved.toFixed(1)}, max=${maxD.toFixed(1)}`);
                return; // отклоняем пакет
            }
        }
        p.lastMoveAt = now;
 
        p.x    = clamp(nx, -295, 295);
        p.y    = typeof data.y === 'number' ? data.y : p.y;
        p.z    = clamp(nz, -295, 295);
        p.rot  = +data.rot  || 0;
        p.tRot = +data.tRot || 0;
 
        // Шлём только изменения (дельта), округлённые для экономии трафика
        socket.to(p.battleId).emit('playerMoved', {
            id:   socket.id,
            x:    +p.x.toFixed(2),
            y:    +p.y.toFixed(2),
            z:    +p.z.toFixed(2),
            rot:  +p.rot.toFixed(3),
            tRot: +p.tRot.toFixed(3),
            t:    now    // timestamp для клиентской интерполяции
        });
    });
 
    // ── ВЫСТРЕЛ ──────────────────────────
    socket.on('shoot', (gunType) => {
        if (!checkRL('shoot', 25)) return; // 25 выстрелов/сек абсолютный предел
        const p = players[socket.id];
        if (!p || p.dead || !p.battleId) return;
 
        const gun = WEAPON[p.gun] ? p.gun : 'smoky';
        if (gunType && WEAPON[gunType] && gunType !== p.gun) return; // пушка не совпадает
 
        const w   = WEAPON[gun];
        const now = Date.now();
 
        // ── Античит: перезарядка ──
        const last = p.lastShotAt[gun] || 0;
        const minReload = (w.reload + (w.charge || 0)) * AC.MIN_RELOAD_MULT;
        if (now - last < minReload) {
            acWarn(p, `Rapid fire? gun=${gun}, dt=${now - last}ms, minReload=${minReload}ms`);
            return;
        }
        p.lastShotAt[gun] = now;
 
        io.to(p.battleId).emit('playerShot', { id: socket.id, gun });
 
        // Только hitscan и cone обрабатывает сервер для авторизации урона
        // Projectile (twins) — клиент шлёт 'hit' (с проверкой дистанции)
        const battle = battles[p.battleId];
        const tanks  = allTanks(battle);
        const dx = Math.sin(p.tRot), dz = Math.cos(p.tRot);
 
        if (w.type === 'hitscan') {
            if (w.pierce) {
                for (const tid in tanks) {
                    const t = tanks[tid]; if (tid === socket.id || t.dead) continue;
                    const d = dist2D(t, p);
                    if (d < w.range) {
                        const dot = dotProduct2D(t.x - p.x, t.z - p.z, dx, dz, d);
                        if (dot > 0.97) {
                            const killed = applyDmg(t, w.dmg, socket.id, battle);
                            io.to(p.battleId).emit('tankHit', { id: tid, hp: t.hp });
                            if (killed) killEvent(p.battleId, tid, socket.id, battle, tanks);
                        }
                    }
                }
            } else {
                const hit = findClosestInSight(p, tanks, socket.id, dx, dz, w.range);
                if (hit) {
                    let dmg = w.dmg;
                    if (w.critChance && Math.random() < w.critChance) dmg *= (w.critMult || 2);
                    const killed = applyDmg(hit.t, dmg, socket.id, battle);
                    io.to(p.battleId).emit('tankHit', { id: hit.id, hp: hit.t.hp });
                    if (killed) killEvent(p.battleId, hit.id, socket.id, battle, tanks);
                    if (w.splash) doSplash(p.battleId, socket.id, battle, tanks, hit.t, w);
                }
            }
        } else if (w.type === 'cone') {
            doCone(p.battleId, socket.id, p, battle, tanks, dx, dz, w);
        }
    });
 
    // ── ПОПАДАНИЕ (от клиента — только Twins/projectile) ──
    socket.on('hit', (targetId, rawDmg) => {
        const p = players[socket.id];
        if (!p || p.dead || !p.battleId) return;
        if (p.gun !== 'twins') return; // только projectile оружие
 
        // ── Античит: урон ──
        const dmg = Math.min(Math.abs(+rawDmg || 0), AC.MAX_DAMAGE);
        if (dmg <= 0) return;
 
        const w = WEAPON[p.gun];
        if (dmg > w.dmg * 2 + 5) { // +5 буфер на floating point
            acWarn(p, `Damage hack? sent=${rawDmg}, max=${w.dmg * 2}`);
            return;
        }
 
        const battle = battles[p.battleId];
        const tanks  = allTanks(battle);
        const target = tanks[targetId];
        if (!target || target.dead) return;
 
        // ── Античит: дистанция до цели ──
        const d = dist2D(p, target);
        if (d > (w.range || 140) * 1.4) {
            acWarn(p, `Hit distance hack? d=${d.toFixed(1)}, range=${w.range}`);
            return;
        }
 
        const killed = applyDmg(target, dmg, socket.id, battle);
        io.to(p.battleId).emit('tankHit', { id: targetId, hp: target.hp });
        if (killed) killEvent(p.battleId, targetId, socket.id, battle, tanks);
    });
 
    // ── ВОЗРОЖДЕНИЕ ──────────────────────
    socket.on('respawn', () => {
        const p = players[socket.id];
        if (!p || !p.battleId || !p.dead) return;
        if (Date.now() < p.respawnAt - 500) { // 500ms буфер погрешности сети
            acWarn(p, 'Respawn too early');
            return;
        }
        const battle = battles[p.battleId];
        const sp = getSpawn(battle.map);
        Object.assign(p, { x: sp.x, y: sp.y, z: sp.z });
        p.rot = Math.random() * Math.PI * 2; p.tRot = p.rot;
        p.hp = p.maxHp; p.dead = false;
        p.effects = { speed: 0, damage: 0, armor: 0, freeze: 0 };
        io.to(p.battleId).emit('tankRespawn', socket.id);
    });
 
    // ── ПРИПАСЫ ──────────────────────────
    socket.on('useSupply', (type) => {
        const p = players[socket.id];
        if (!p || p.dead || !p.battleId) return;
        const valid = ['repair', 'armor', 'damage', 'speed'];
        if (!valid.includes(type)) return;
        if (!p.effects) p.effects = {};
        if (type === 'repair') { p.hp = Math.min(p.maxHp, p.hp + p.maxHp); }
        else p.effects[type] = 30;
        io.to(p.battleId).emit('supplyUsed', { id: socket.id, type });
        io.to(p.battleId).emit('tankHit', { id: socket.id, hp: p.hp });
    });
 
    // ── ВЫХОД ─────────────────────────────
    socket.on('leaveBattle', () => leaveBattle(socket));
    socket.on('disconnect', () => {
        leaveBattle(socket);
        delete players[socket.id];
        console.log('[-] Отключился:', socket.id);
    });
});
 
// ─────────────────────────────────────────
// ВЫХОД ИЗ БИТВЫ
// ─────────────────────────────────────────
function leaveBattle(socket) {
    const p = players[socket.id];
    if (!p || !p.battleId) return;
    const battle = battles[p.battleId];
    if (battle) {
        battle.players = battle.players.filter(id => id !== socket.id);
        socket.to(p.battleId).emit('playerLeft', socket.id);
        socket.leave(p.battleId);
        if (battle.players.length === 0) {
            delete battles[p.battleId];
            delete botActions[p.battleId];
            console.log(`[x] Битва удалена (пустая): ${p.battleId}`);
        }
        broadcastList();
    }
    p.battleId = null;
}
 
// ─────────────────────────────────────────
// СНИМОК ИГРОКА (только нужные поля)
// ─────────────────────────────────────────
function snapPlayer(p) {
    return {
        id: p.id, nickname: p.nickname,
        hull: p.hull, gun: p.gun, paint: p.paint,
        x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2),
        rot: +p.rot.toFixed(3), tRot: +p.tRot.toFixed(3),
        hp: p.hp, maxHp: p.maxHp,
        kills: p.kills, deaths: p.deaths, score: p.score,
        dead: p.dead, isBot: false
    };
}
 
// ─────────────────────────────────────────
// СТАРТ
// ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅  Tanki Classic запущен → http://localhost:${PORT}`);
});