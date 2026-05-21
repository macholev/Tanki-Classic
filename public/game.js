// ==========================================
// TANKI CLASSIC — ПОЛНАЯ ПЕРЕРАБОТКА v2.0
// Стиль: Танки Онлайн 2012 (Alternativa3D)
// ==========================================
 
// ==========================================
// БАЗА ДАННЫХ
// ==========================================
const DB = {
    guns: {
        smoky:   { name: 'Смоки М0',  price: 0,    dmg: 35,  reload: 1.5, rotSpeed: 1.5, type: 'gun', img: '', stat1: 40,  v1: '35',  stat2: 60,  v2: '1.5с', desc: 'Классическая пушка среднего калибра. Hitscan. 25% шанс крита (2.5x урон).', title1: 'Урон', title2: 'Перезарядка',
            inputMode: 'press',    // одиночное нажатие (зажатие = цикл)
            autofire: true,        // при зажатии стреляет циклично после перезарядки
            critChance: 0.25, critMult: 2.5 },
        twins:   { name: 'Твинс М0',  price: 150,  dmg: 12,  reload: 0.3, rotSpeed: 2.0, type: 'gun', img: '', stat1: 20,  v1: '12',  stat2: 90,  v2: '0.3с', desc: 'Два плазменных орудия. Снаряды летят по дуге. Идеал для ближнего боя.', title1: 'Урон', title2: 'Перезарядка',
            inputMode: 'hold',     // зажатие — непрерывный огонь
            autofire: true },
        railgun: { name: 'Рельса М0', price: 800,  dmg: 100, reload: 5.0, rotSpeed: 0.8, type: 'gun', img: '', stat1: 100, v1: '100', stat2: 10,  v2: '5.0с', desc: 'Электромагнитная пушка. 1.1 сек зарядки. Пробивает насквозь.', title1: 'Урон', title2: 'Перезарядка',
            inputMode: 'charge',   // нажатие → зарядка → выстрел при достижении порога
            chargeTime: 1.1,       // секунд до выстрела
            autofire: false,
            recoilForce: -3.5 },   // огромная отдача рельсы
        thunder: { name: 'Гром М0',   price: 1000, dmg: 60,  reload: 2.8, rotSpeed: 1.0, type: 'gun', img: '', stat1: 70,  v1: '60',  stat2: 40,  v2: '2.8с', desc: 'Фугасная пушка. Взрыв наносит урон в радиусе 12 единиц.', title1: 'Урон', title2: 'Перезарядка',
            inputMode: 'press',
            autofire: true,
            selfDmgRadius: 12 },   // самоурон если стреляешь в упор
        freeze:  { name: 'Фриз М0',   price: 600,  dmg: 10,  reload: 0.08, rotSpeed: 1.8, type: 'gun', img: '', stat1: 30,  v1: '10',  stat2: 100, v2: '0.08с', desc: 'Криогенная пушка-луч. Замораживает противника, снижая скорость на 60%.', title1: 'Урон', title2: 'Перезарядка',
            inputMode: 'hold',     // зажатие + баллон энергии
            autofire: false,
            energyMax: 5.0,        // секунд работы на полном баллоне
            energyRegen: 1.8,      // секунд восстановления в секунду (при !стрельбе)
            energyDrain: 1.0,      // единиц баллона в секунду при стрельбе
            slowAmount: 0.45,      // множитель скорости замороженного (0.45 = -55%)
            slowDuration: 2.0 },   // сек заморозки после прекращения огня
        isida:   { name: 'Изида М0',  price: 700,  dmg: 18,  reload: 0.1, rotSpeed: 2.5, type: 'gun', img: '', stat1: 25,  v1: '18',  stat2: 100, v2: '0.1с', desc: 'Наноботы. Электрический луч — лечит союзников, крадёт ХП у врагов (50% вампиризм).', title1: 'Урон', title2: 'Перезарядка',
            inputMode: 'hold',     // зажатие + баллон энергии
            autofire: false,
            energyMax: 4.0,
            energyRegen: 2.2,
            energyDrain: 1.0,
            vampire: 0.5 }
    },
    hulls: {
        hunter: { name: 'Хантер М0', price: 0,   hp: 150, speed: 12, rot: 1.8, type: 'hull', img: '', stat1: 50,  v1: '150 HP', stat2: 50, v2: '12 км/ч', desc: 'Сбалансированный средний корпус. Хорош для любого оружия.', model: {w:1.85, h:0.80, l:3.22, type:'hunter'}, title1: 'Броня', title2: 'Скорость' },
        wasp:   { name: 'Оса М0',    price: 200, hp: 100, speed: 18, rot: 2.5, type: 'hull', img: '', stat1: 20,  v1: '100 HP', stat2: 90, v2: '18 км/ч', desc: 'Самый быстрый корпус. Минимальная броня. Мастер уклонений.', model: {w:1.60, h:0.68, l:2.53, type:'wasp'}, title1: 'Броня', title2: 'Скорость' },
        titan:  { name: 'Титан М0',  price: 500, hp: 250, speed: 7,  rot: 1.2, type: 'hull', img: '', stat1: 100, v1: '250 HP', stat2: 20, v2: '7 км/ч',  desc: 'Тяжёлый бронированный корпус. Живая крепость.', model: {w:2.30, h:0.98, l:3.68, type:'titan'}, title1: 'Броня', title2: 'Скорость' }
    },
    paints: {
        green:  { name: 'Зелёный', price: 0,    hex: 0x4ca800, type: 'paint', img: '', stat1: 0,  v1:'0%',  stat2: 0,   v2:'0%',   desc: 'Стандартная зелёная краска.' },
        black:  { name: 'Карбон',  price: 500,  hex: 0x222222, type: 'paint', img: '', stat1: 10, v1:'10%', stat2: 10,  v2:'10%',  desc: 'Скрытный карбон.' },
        lead:   { name: 'Свинец',  price: 800,  hex: 0x5a5a6a, type: 'paint', img: '', stat1: 15, v1:'15%', stat2: 5,   v2:'5%',   desc: 'Грубый металл.' },
        flora:  { name: 'Флора',   price: 1000, hex: 0x6b8e23, type: 'paint', img: '', stat1: 5,  v1:'5%',  stat2: 20,  v2:'20%',  desc: 'Лесной камуфляж.' },
        marine: { name: 'Морпех',  price: 1500, hex: 0x4169e1, type: 'paint', img: '', stat1: 20, v1:'20%', stat2: 15,  v2:'15%',  desc: 'Синий камуфляж.' },
        spark:  { name: 'Искра',   price: 2000, hex: 0xff4500, type: 'paint', img: '', stat1: 30, v1:'30%', stat2: -10, v2:'-10%', desc: 'Яркая агрессивная краска.' }
    },
    supplies: {
        repair: { name: 'Ремкомплект',    price: 15, type: 'supply', img: '', desc: 'Восстанавливает 100% здоровья.' },
        armor:  { name: 'Двойная защита', price: 15, type: 'supply', img: '', desc: 'Урон снижается в 2 раза на 30 сек.' },
        damage: { name: 'Двойной урон',   price: 15, type: 'supply', img: '', desc: 'Урон умножается в 2 раза на 30 сек.' },
        speed:  { name: 'Ускорение',      price: 15, type: 'supply', img: '', desc: 'Скорость увеличивается в 1.5 раза на 30 сек.' },
        mine:   { name: 'Мина',           price: 15, type: 'supply', img: '', desc: 'Устанавливает мину (150 урона).' }
    }
};
 
// ==========================================
// СОХРАНЕНИЕ
// ==========================================
let saveData = JSON.parse(localStorage.getItem('tanki_offline_v2')) || {
    crystals: 5095, xp: 0,
    unlocked: ['smoky','hunter','green'],
    equipped: { gun: 'smoky', hull: 'hunter', paint: 'green' },
    supplies: { repair: 10, armor: 10, damage: 10, speed: 10, mine: 10 },
    nickname: 'Игрок'
};
 
function saveNickname() {
    const v = document.getElementById('player-nickname').value.trim();
    if(v) saveData.nickname = v;
    saveProgress();
}
 
const RANK_NAMES = ['Новобранец','Рядовой','Ефрейтор','Капрал','Сержант','Старший сержант','Прапорщик','Подпрапорщик','Лейтенант','Капитан','Майор','Подполковник','Полковник','Генерал','Маршал'];
const RANK_XP = [0,1000,5000,15000,30000,60000,100000,150000,220000,300000,390000,500000,650000,850000,999999];
 
function getRank(xp) {
    for(let i = RANK_XP.length-1; i>=0; i--) if(xp >= RANK_XP[i]) return i;
    return 0;
}
 
function saveProgress() {
    document.getElementById('player-nickname').value = saveData.nickname;
    localStorage.setItem('tanki_offline_v2', JSON.stringify(saveData));
    document.getElementById('ui-cryst').innerText = saveData.crystals.toLocaleString();
    const rank = getRank(saveData.xp);
    const nextXP = RANK_XP[Math.min(rank+1, RANK_XP.length-1)];
    const prevXP = RANK_XP[rank];
    const pct = nextXP > prevXP ? Math.min(((saveData.xp - prevXP) / (nextXP - prevXP)) * 100, 100) : 100;
    document.getElementById('xp-fill').style.width = pct + '%';
    document.getElementById('xp-text').innerText = saveData.xp.toLocaleString() + ' / ' + nextXP.toLocaleString();
    document.getElementById('rank-num').innerText = rank + 1;
    ['repair','armor','damage','speed','mine'].forEach(s => {
        const el = document.getElementById('s-num-' + s);
        if(el) el.innerText = saveData.supplies[s] || 0;
    });
}
 
// ==========================================
// СЕТЬ
// ==========================================
let socket = null; let isOffline = true;
let currentTab = 'lobby'; let selectedBattle = null; let cachedBattles = {};
 
window.onload = () => {
    saveProgress();
    document.getElementById('chat-btn').onclick = sendChatMessage;
    document.getElementById('chat-input').addEventListener('keypress', e => { if(e.key==='Enter') sendChatMessage(); });
 
    if(typeof io !== 'undefined') {
        try {
            socket = io();
            socket.on('connect', () => { isOffline = false; showNotif('Подключено к серверу'); });
            socket.on('updateBattles', b => { cachedBattles = b; renderBattles(); });
            socket.on('chatHistory', h => { document.getElementById('chat-box').innerHTML=''; h.forEach(appendChatMessage); });
            socket.on('chatMessage', m => appendChatMessage(m));
            socket.on('initRoom', players => { players.forEach(p => { if(p.id!==socket.id) spawnOnlinePlayer(p); }); });
            socket.on('newPlayer', p => spawnOnlinePlayer(p));
            socket.on('playerMoved', d => {
                if(tanks[d.id] && !tanks[d.id].dead) {
                    tanks[d.id].targetPos = new THREE.Vector3(d.x, d.y||0, d.z);
                    tanks[d.id].targetRot = d.rot;
                    tanks[d.id].targetTRot = d.tRot;
                }
            });

            // Пакетные обновления позиций ботов (экономит трафик)
            socket.on('batchMove', (moves) => {
                for (const d of moves) {
                    if (tanks[d.id] && !tanks[d.id].dead) {
                        tanks[d.id].targetPos  = new THREE.Vector3(d.x, d.y || 0, d.z);
                        tanks[d.id].targetRot  = d.rot;
                        tanks[d.id].targetTRot = d.tRot;
                    }
                }
            });

            // Кик-сообщение от сервера (античит)
            socket.on('kicked', (reason) => {
                alert('Вы кикнуты: ' + reason);
                window.location.reload();
            });
            socket.on('playerShot', d => { if(tanks[d.id] && !tanks[d.id].dead) fireVisually(tanks[d.id]); });
            socket.on('tankHit', d => {
                if(tanks[d.id]) {
                    tanks[d.id].hp = d.hp;
                    if(d.id === myId) updateHUD();
                    if(d.hp <= 0 && !tanks[d.id].dead) { tanks[d.id].dead=true; tanks[d.id].mesh.visible=false; spawnExplosion(tanks[d.id].mesh.position); }
                }
            });
            socket.on('tankKilled', d => {
                if(tanks[d.dead]) { spawnExplosion(tanks[d.dead].mesh.position); tanks[d.dead].dead=true; tanks[d.dead].mesh.visible=false; tanks[d.dead].deaths++; }
                if(tanks[d.killer]) { tanks[d.killer].kills++; tanks[d.killer].score+=15; }
                if(d.killer===myId) { saveData.crystals+=15; saveData.xp+=15; saveProgress(); showKillMsg(tanks[d.dead]?.nickname||'?'); }
                if(d.dead===myId) { setTimeout(()=>respawnTank(myId),3000); }
            });
            socket.on('tankRespawn', id => respawnTank(id));
            socket.on('playerLeft', id => { if(tanks[id]) { sceneBat.remove(tanks[id].mesh); delete tanks[id]; } });
            socket.on('applyFrost', d => { if(d.id===myId) activateFrost(d.duration); });
            socket.on('groundExplosion', d => spawnExplosion(new THREE.Vector3(d.x,d.y,d.z)));
        } catch(e) { console.log('Offline mode'); }
    }
 
    if(isOffline) {
        cachedBattles = {
            'b_silence': { id:'b_silence', name:'Тишина — Каждый за себя', map:'silence', players:0, max:10 },
            'b_sandbox': { id:'b_sandbox', name:'Песочница — Каждый за себя', map:'sandbox', players:0, max:8 },
            'b_kubiki':  { id:'b_kubiki',  name:'Кубики — Каждый за себя',   map:'kubiki',  players:0, max:8 }
        };
    }
 
    renderBattles();
    init3D();
};
 
function sendChatMessage() {
    const inp = document.getElementById('chat-input');
    const text = inp.value.trim(); if(!text) return;
    // Чат-команды
    if(text.startsWith('/')) {
        const parts = text.split(' ');
        if(parts[0]==='/respawn' && myId && tanks[myId] && tanks[myId].dead) respawnTank(myId);
        else if(parts[0]==='/rank') appendChatMessage({sender:'Система',text:`Твой ранг: ${getRank(saveData.xp)+1}, XP: ${saveData.xp}`});
        else if(parts[0]==='/crystals') appendChatMessage({sender:'Система',text:`Кристаллов: ${saveData.crystals}`});
        else appendChatMessage({sender:'Система',text:'Неизвестная команда. /respawn /rank /crystals'});
        inp.value=''; return;
    }
    if(socket && !isOffline) socket.emit('chatMessage',{sender:saveData.nickname,text});
    else appendChatMessage({sender:saveData.nickname,text});
    inp.value='';
}
 
function appendChatMessage(msg) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.style.cssText = 'padding:4px 7px;background:rgba(0,0,0,0.55);border-left:3px solid #5aaa00;border-radius:1px;';
    div.innerHTML = `<b style="color:#6cce00;">${msg.sender}:</b> <span style="color:#ccc;">${msg.text}</span>`;
    box.appendChild(div); box.scrollTop = box.scrollHeight;
}
 
function showNotif(text) {
    const area = document.getElementById('notif-area'); if(!area) return;
    const div = document.createElement('div'); div.className = 'notif'; div.textContent = text;
    area.appendChild(div); setTimeout(()=>div.remove(),3000);
}
 
function showKillMsg(name) {
    const feed = document.getElementById('kill-feed'); if(!feed) return;
    const div = document.createElement('div'); div.className='kill-msg';
    div.innerHTML = `<span style="color:#6cce00;">${saveData.nickname}</span> уничтожил <span style="color:#ff4444;">${name}</span>`;
    feed.appendChild(div); setTimeout(()=>div.remove(),5000);
}
 
// ==========================================
// ЛОББИ
// ==========================================
function renderBattles() {
    const list = document.getElementById('battle-list'); list.innerHTML='';
    for(let key in cachedBattles) {
        const b = cachedBattles[key]; const div = document.createElement('div');
        div.className = `battle-row ${selectedBattle===key?'active':''}`;
        div.innerHTML = `<div>★ ${b.name}</div><div class="battle-players">${b.players} / ${b.max}</div>`;
        div.onclick = () => selectBattle(key, b); list.appendChild(div);
    }
}
 
function selectBattle(id, data) {
    selectedBattle = id;
    document.getElementById('b-info-name').innerText = data.name;
    document.getElementById('btn-play').disabled = false;
    document.getElementById('info-panel-content').style.display='flex';
    document.getElementById('create-panel-content').style.display='none';
    document.getElementById('info-panel-header').innerText='ИНФОРМАЦИЯ О БИТВЕ';
    drawMapPreview(data.map||'sandbox');
    // Заполнение info-полей если есть
    const mn=document.getElementById('b-info-mode'); if(mn) mn.innerText=(data.mode||'DM').toUpperCase();
    const pl=document.getElementById('b-info-players'); if(pl) pl.innerText=`${data.players||0}/${data.max||8}`;
    const tm=document.getElementById('b-info-time'); if(tm) tm.innerText='10 мин';
    renderBattles();
}

// ── ПРЕВЬЮ КАРТЫ — top-down пиксельная схема ──────────────────────
function drawMapPreview(mapType) {
    const cv=document.getElementById('map-preview-canvas');
    if(!cv) return;
    const ctx=cv.getContext('2d'); const W=cv.width, H=cv.height;
    if(mapType==='kubiki') {
        // Серый бетон + цветные кубы
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#6e6860'); g.addColorStop(1,'#383430');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
        // Плитки пола
        ctx.strokeStyle='rgba(0,0,0,0.25)'; ctx.lineWidth=1;
        for(let i=0;i<W;i+=22){ ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke(); }
        for(let i=0;i<H;i+=22){ ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(W,i);ctx.stroke(); }
        // Рамка-стены
        ctx.strokeStyle='#9a9080'; ctx.lineWidth=8; ctx.strokeRect(8,8,W-16,H-16);
        // Угловые столбы
        ctx.fillStyle='#4a443a'; for(const [x,y] of [[8,8],[W-26,8],[8,H-26],[W-26,H-26]]) ctx.fillRect(x,y,18,18);
        // Центр — круг с эмблемой
        ctx.fillStyle='#444038'; ctx.beginPath(); ctx.arc(W/2,H/2,28,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#ffcc00'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(W/2,H/2,28,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle='#ffcc00'; ctx.font='bold 30px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('★',W/2,H/2);
        // Кубы (большие)
        const kubeCols=['#ccc0a0','#cc6644','#5588cc','#cccc44'];
        const bigK=[[-32,-32,0],[32,-32,1],[-32,32,2],[32,32,3],[-60,0,0],[60,0,0],[0,-60,1],[0,60,2]];
        for(const [bx,by,ci] of bigK) {
            const px=W/2+bx*1.7, py=H/2+by*1.7;
            ctx.fillStyle=kubeCols[ci]; ctx.fillRect(px-10,py-10,20,20);
            ctx.strokeStyle='#000'; ctx.lineWidth=1.5; ctx.strokeRect(px-10,py-10,20,20);
        }
        // Малые кубы
        const smK=[[-18,0,3],[18,0,3],[0,-18,0],[0,18,0],[-22,-50,1],[22,-50,1],[-22,50,2],[22,50,2]];
        for(const [bx,by,ci] of smK) {
            const px=W/2+bx*1.7, py=H/2+by*1.7;
            ctx.fillStyle=kubeCols[ci]; ctx.fillRect(px-6,py-6,12,12);
            ctx.strokeStyle='#000'; ctx.lineWidth=1; ctx.strokeRect(px-6,py-6,12,12);
        }
        // Боковые баррикады
        for(const [bx,by,bw,bh] of [[-78,-15,8,28],[78,-15,8,28],[-78,15,8,28],[78,15,8,28],[-15,-78,28,8],[15,-78,28,8],[-15,78,28,8],[15,78,28,8]]) {
            const px=W/2+bx*1.7, py=H/2+by*1.7;
            ctx.fillStyle='#aaa090'; ctx.fillRect(px-bw/2,py-bh/2,bw,bh);
            ctx.strokeStyle='#000'; ctx.lineWidth=1; ctx.strokeRect(px-bw/2,py-bh/2,bw,bh);
        }
        // Текст
        ctx.font='bold 14px Oswald'; ctx.fillStyle='rgba(255,255,255,0.8)';
        ctx.textAlign='left'; ctx.fillText('АРЕНА: КУБИКИ',12,H-12);
    } else if(mapType==='sandbox') {
        // Зелёный газон + плитчатый двор + крепостные стены
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#3a5a18'); g.addColorStop(1,'#1e3a08');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
        // Двор-плитка
        ctx.fillStyle='#8a8068'; ctx.fillRect(W*0.18,H*0.18,W*0.64,H*0.64);
        ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=0.8;
        for(let x=W*0.18;x<W*0.82;x+=18){ ctx.beginPath();ctx.moveTo(x,H*0.18);ctx.lineTo(x,H*0.82);ctx.stroke(); }
        for(let y=H*0.18;y<H*0.82;y+=18){ ctx.beginPath();ctx.moveTo(W*0.18,y);ctx.lineTo(W*0.82,y);ctx.stroke(); }
        // Дороги
        ctx.fillStyle='#332e22'; ctx.fillRect(0,H/2-5,W,10); ctx.fillRect(W/2-5,0,10,H);
        // Внешние крепостные стены
        ctx.fillStyle='#8a7e60'; ctx.fillRect(8,8,W-16,12); ctx.fillRect(8,H-20,W-16,12);
        ctx.fillRect(8,8,12,H-16); ctx.fillRect(W-20,8,12,H-16);
        // Угловые башни
        ctx.fillStyle='#5a5040'; for(const [x,y] of [[6,6],[W-30,6],[6,H-30],[W-30,H-30]]) ctx.fillRect(x,y,24,24);
        // Ворота (просветы в стенах)
        ctx.fillStyle='#1e3a08';
        ctx.fillRect(W/2-14,8,28,12); ctx.fillRect(W/2-14,H-20,28,12);
        ctx.fillRect(8,H/2-14,12,28); ctx.fillRect(W-20,H/2-14,12,28);
        // Центральное здание
        ctx.fillStyle='#7a6a52'; ctx.fillRect(W/2-30,H/2-30,60,60);
        ctx.strokeStyle='#000'; ctx.lineWidth=1.5; ctx.strokeRect(W/2-30,H/2-30,60,60);
        ctx.fillStyle='#cc2200'; ctx.fillRect(W/2-3,H/2-25,6,12); // флаг
        // Контейнеры по углам
        ctx.fillStyle='#4a7a3a';
        for(const [x,y] of [[W*0.25,H*0.25],[W*0.75,H*0.25],[W*0.25,H*0.75],[W*0.75,H*0.75]]) ctx.fillRect(x-12,y-12,24,24);
        // Деревья
        ctx.fillStyle='#1e4808';
        for(let i=0;i<14;i++){
            const tx=W*0.10+Math.random()*W*0.08, ty=H*0.10+Math.random()*H*0.80;
            ctx.beginPath(); ctx.arc(tx,ty,3,0,Math.PI*2); ctx.fill();
            const tx2=W*0.92-Math.random()*W*0.06; const ty2=H*0.10+Math.random()*H*0.80;
            ctx.beginPath(); ctx.arc(tx2,ty2,3,0,Math.PI*2); ctx.fill();
        }
        ctx.font='bold 14px Oswald'; ctx.fillStyle='rgba(255,255,255,0.85)';
        ctx.textAlign='left'; ctx.fillText('КАРТА: ПЕСОЧНИЦА',12,H-12);
    } else {
        // Тишина — песок
        const g=ctx.createLinearGradient(0,0,0,H);
        g.addColorStop(0,'#d4b87a'); g.addColorStop(1,'#a08850');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
        // Шум
        for(let i=0;i<300;i++){
            ctx.fillStyle=`rgba(${100+Math.random()*50|0},${80+Math.random()*40|0},${40+Math.random()*30|0},0.4)`;
            ctx.fillRect(Math.random()*W,Math.random()*H,2,1);
        }
        // Дороги асфальт
        ctx.fillStyle='#403828'; ctx.fillRect(0,H/2-6,W,12); ctx.fillRect(W/2-6,0,12,H);
        // Внешние стены
        ctx.fillStyle='#9a8e72'; ctx.fillRect(10,10,W-20,8); ctx.fillRect(10,H-18,W-20,8);
        ctx.fillRect(10,10,8,H-20); ctx.fillRect(W-18,10,8,H-20);
        // Угловые башни
        ctx.fillStyle='#6a5e44'; for(const [x,y] of [[6,6],[W-26,6],[6,H-26],[W-26,H-26]]) ctx.fillRect(x,y,20,20);
        // Здания
        ctx.fillStyle='#7a3020';
        ctx.fillRect(W*0.20,H*0.20,30,40); ctx.fillRect(W*0.70,H*0.20,30,40);
        ctx.fillRect(W*0.20,H*0.65,30,30); ctx.fillRect(W*0.70,H*0.65,30,30);
        ctx.strokeStyle='#000'; ctx.lineWidth=1;
        ctx.strokeRect(W*0.20,H*0.20,30,40); ctx.strokeRect(W*0.70,H*0.20,30,40);
        ctx.strokeRect(W*0.20,H*0.65,30,30); ctx.strokeRect(W*0.70,H*0.65,30,30);
        // Центральное здание
        ctx.fillStyle='#8a7050'; ctx.fillRect(W/2-22,H/2-22,44,44);
        ctx.strokeStyle='#000'; ctx.strokeRect(W/2-22,H/2-22,44,44);
        // Бочки и ящики
        ctx.fillStyle='#5a3a20';
        for(let i=0;i<10;i++){ ctx.beginPath();ctx.arc(W*0.25+Math.random()*W*0.5,H*0.40+Math.random()*H*0.20,3,0,Math.PI*2);ctx.fill(); }
        ctx.fillStyle='#7a5a2a';
        for(let i=0;i<8;i++){ ctx.fillRect(W*0.30+Math.random()*W*0.4,H*0.30+Math.random()*H*0.4,6,6); }
        // Деревья
        ctx.fillStyle='#1e4808';
        for(let i=0;i<8;i++){ ctx.beginPath();ctx.arc(20+Math.random()*(W-40),20+Math.random()*40,3,0,Math.PI*2);ctx.fill(); }
        ctx.font='bold 14px Oswald'; ctx.fillStyle='rgba(255,255,255,0.85)';
        ctx.textAlign='left'; ctx.fillText('КАРТА: ТИШИНА',12,H-12);
    }
}
 
let selectedMode='dm';
function showCreatePanel() {
    document.getElementById('info-panel-content').style.display='none';
    document.getElementById('create-panel-content').style.display='flex';
    document.getElementById('info-panel-header').innerText='СОЗДАНИЕ БИТВЫ';
}
function cancelCreate() {
    document.getElementById('info-panel-content').style.display='flex';
    document.getElementById('create-panel-content').style.display='none';
    document.getElementById('info-panel-header').innerText='ИНФОРМАЦИЯ О БИТВЕ';
}
function confirmCreateBattle() {
    const name = document.getElementById('cr-name').value||'Моя Игра';
    const map = document.getElementById('cr-map').value;
    const max = parseInt(document.getElementById('cr-max').value)||10;
    const withBots = document.getElementById('cr-bots').checked;
    const newId='battle_'+Date.now();
    const bData={id:newId,name,map,players:1,max,mode:selectedMode,withBots};
    cachedBattles[newId]=bData; selectedBattle=newId;
    try { if(!isOffline&&socket) socket.emit('createBattle',bData); } catch(e){}
    renderBattles(); joinSelectedBattle();
}
function selectMode(el,mode) {
    selectedMode=mode;
    document.querySelectorAll('.mode-btn').forEach(e=>e.classList.remove('active'));
    el.classList.add('active');
}
function toggleFullscreen() {
    if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
    else document.exitFullscreen().catch(()=>{});
}
function openTab(tab) {
    document.querySelectorAll('.nav-btn').forEach(e=>e.classList.remove('active'));
    document.getElementById('btn-'+tab).classList.add('active');
    ['lobby','garage','shop'].forEach(t=>{
        const el=document.getElementById('view-'+t);
        if(el) el.style.display='none';
    });
    document.getElementById('game-ui').style.display='none';
    currentTab=tab;
    if(tab==='lobby') {
        document.getElementById('main-bg').style.display='block';
        document.getElementById('view-lobby').style.display='flex';
        document.getElementById('canvas-wrap').style.visibility='hidden';
        document.getElementById('canvas-wrap').style.opacity='0';
        sceneType='none';
    } else if(tab==='garage') {
        document.getElementById('main-bg').style.display='none';
        document.getElementById('view-garage').style.display='flex';
        document.getElementById('canvas-wrap').style.visibility='visible';
        document.getElementById('canvas-wrap').style.opacity='1';
        sceneType='garage';
        camera.position.set(0,3.5,8);
        camera.lookAt(0,1,0);
        setGarageTab('guns',null,true);
    } else if(tab==='shop') {
        document.getElementById('main-bg').style.display='block';
        document.getElementById('view-shop').style.display='flex';
        document.getElementById('canvas-wrap').style.visibility='hidden';
        document.getElementById('canvas-wrap').style.opacity='0';
        sceneType='none';
    }
}
 
// ==========================================
// ГАРАЖ
// ==========================================
let gCat='guns', gSel='smoky';
function setGarageTab(cat, event, force=false) {
    gCat=cat;
    if(event) { document.querySelectorAll('.g-tab').forEach(e=>e.classList.remove('active')); event.target.classList.add('active'); }
    const slider=document.getElementById('items-slider'); slider.innerHTML='';
    for(let k in DB[cat]) {
        const item=DB[cat][k]; let label='', extraHtml='';
        if(cat==='supplies') {
            label=`${item.price} кри.`;
            extraHtml=`<div class="supply-badge">${saveData.supplies[k]||0}</div>`;
        } else {
            const isEq=saveData.equipped[item.type]===k;
            label=saveData.unlocked.includes(k)?(isEq?'Установлено':'В гараже'):`${item.price} кри.`;
        }
        slider.innerHTML+=`<div class="item-card ${gSel===k?'selected':''}" onclick="selectGItem('${k}')">
            ${extraHtml}<div class="item-img"><img src="${item.img||''}"></div>
            <div class="item-card-title">${item.name}</div>
            <div class="item-card-price">${label}</div>
        </div>`;
    }
    if(force) selectGItem(saveData.equipped[cat==='guns'?'gun':cat==='hulls'?'hull':'paint']||Object.keys(DB[cat])[0]);
}
 
function selectGItem(k) {
    gSel=k; const item=DB[gCat][k]; setGarageTab(gCat);
    document.getElementById('g-name').innerText=item.name;
    document.getElementById('g-desc').innerText=item.desc;
    const btn=document.getElementById('g-buy-btn');
    if(gCat==='supplies') {
        document.getElementById('g-val-1').parentElement.children[0].innerText='В наличии';
        document.getElementById('g-val-1').innerText=(saveData.supplies[k]||0)+' шт.';
        document.getElementById('g-bar-1').style.width='100%';
        document.getElementById('g-val-2').parentElement.children[0].innerText='Действие';
        document.getElementById('g-val-2').innerText='30 сек';
        document.getElementById('g-bar-2').style.width='100%';
        btn.innerText='КУПИТЬ ЗА '+item.price; btn.className='btn-green'; btn.disabled=false;
        btn.onclick=()=>buySupply(k);
    } else {
        document.getElementById('g-val-1').parentElement.children[0].innerText=item.title1||'';
        document.getElementById('g-val-1').innerText=item.v1||'';
        document.getElementById('g-bar-1').style.width=(item.stat1||0)+'%';
        document.getElementById('g-val-2').parentElement.children[0].innerText=item.title2||'';
        document.getElementById('g-val-2').innerText=item.v2||'';
        document.getElementById('g-bar-2').style.width=(item.stat2||0)+'%';
        if(!saveData.unlocked.includes(k)) { btn.innerText='КУПИТЬ ЗА '+item.price; btn.className='btn-green'; btn.disabled=false; }
        else if(saveData.equipped[item.type]===k) { btn.innerText='УСТАНОВЛЕНО'; btn.className='btn-green'; btn.disabled=true; }
        else { btn.innerText='УСТАНОВИТЬ'; btn.className='btn-green'; btn.disabled=false; }
        btn.onclick=()=>buyOrEquip();
        updateGarageTank(
            gCat==='hulls'?k:saveData.equipped.hull,
            gCat==='guns'?k:saveData.equipped.gun,
            gCat==='paints'?k:saveData.equipped.paint
        );
    }
}
 
function buySupply(k) {
    if(saveData.crystals>=DB.supplies[k].price) {
        saveData.crystals-=DB.supplies[k].price;
        saveData.supplies[k]=(saveData.supplies[k]||0)+1;
        saveProgress(); selectGItem(k);
    } else alert('Мало кристаллов!');
}
function buyOrEquip() {
    const item=DB[gCat][gSel];
    if(!saveData.unlocked.includes(gSel)) {
        if(saveData.crystals>=item.price) { saveData.crystals-=item.price; saveData.unlocked.push(gSel); saveProgress(); selectGItem(gSel); }
        else alert('Мало кристаллов!');
    } else { saveData.equipped[item.type]=gSel; saveProgress(); selectGItem(gSel); }
}
 
// ==========================================
// ЛУТБОКС
// ==========================================
let lbState=0, lbTimer=0, lbRewardText='', lbRewardType='crystals', lbLid=null;
function buyLootbox() {
    if(saveData.crystals<500) return alert('Нужно 500 кристаллов!');
    if(lbState!==0&&sceneType==='lootbox') return;
    saveData.crystals-=500; saveProgress();
    document.getElementById('top-bar').style.display='none';
    document.getElementById('main-container').style.display='none';
    document.getElementById('main-bg').style.display='none';
    document.getElementById('lb-3d-ui').style.display='flex';
    document.getElementById('lb-reward-3d').style.display='none';
    document.getElementById('lb-btn-3d').style.display='none';
    document.getElementById('canvas-wrap').style.visibility='visible';
    document.getElementById('canvas-wrap').style.opacity='1';
    sceneType='lootbox'; lbState=0; lbTimer=0;
    lbGroup.visible=true; lbGroup.position.set(0,18,0); lbGroup.rotation.set(0,0,0);
    // Сбросить крышку (Group) в закрытое положение
    if(lbLid) { lbLid.position.set(0,0.6,-1.45); lbLid.rotation.set(0,0,0); lbLid.visible=true; }
    camera.position.set(0,6,14); camera.lookAt(0,1,0);
    if(Math.random()>0.4) {
        const amt=Math.floor(Math.random()*800)+500;
        saveData.crystals+=amt; lbRewardText='+'+amt+' КРИСТАЛЛОВ!'; lbRewardType='crystals';
    } else {
        const supKeys=Object.keys(DB.supplies);
        const s=supKeys[Math.floor(Math.random()*supKeys.length)];
        const amt=Math.floor(Math.random()*10)+5;
        saveData.supplies[s]=(saveData.supplies[s]||0)+amt;
        lbRewardText='+'+amt+' '+DB.supplies[s].name.toUpperCase()+'!'; lbRewardType='supply';
    }
}
function closeLootbox() {
    document.getElementById('lb-3d-ui').style.display='none';
    document.getElementById('top-bar').style.display='flex';
    document.getElementById('main-container').style.display='flex';
    openTab('shop');
}
 
// ==========================================
// ТЕКСТУРЫ — УЛУЧШЕННЫЕ ПИКСЕЛЬНЫЕ
// ==========================================
function makePixelTexture(cfg) {
    const c=document.createElement('canvas'); c.width=128; c.height=128;
    const ctx=c.getContext('2d');
    ctx.fillStyle=cfg.base; ctx.fillRect(0,0,128,128);
    // Крупные блоки (грубая структура)
    for(let i=0;i<(cfg.blocks||80);i++) {
        ctx.fillStyle=cfg.colors[Math.floor(Math.random()*cfg.colors.length)];
        const s=[8,8,16,16,32][Math.floor(Math.random()*5)];
        ctx.fillRect(Math.floor(Math.random()*(128/s))*s, Math.floor(Math.random()*(128/s))*s, s, s);
    }
    // Детали (мелкие пиксели)
    if(cfg.details) {
        for(let i=0;i<cfg.details;i++) {
            ctx.fillStyle=cfg.detailColors[Math.floor(Math.random()*cfg.detailColors.length)];
            ctx.fillRect(Math.floor(Math.random()*128), Math.floor(Math.random()*128), 2, 2);
        }
    }
    const tex=new THREE.CanvasTexture(c);
    tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
    tex.magFilter=THREE.NearestFilter;
    tex.minFilter=THREE.LinearMipMapLinearFilter;
    return tex;
}
 
// Трава — темно-зеленая, зернистая (точь-в-точь ТО 2012)
const texGrass=makePixelTexture({
    base:'#2d4a10', blocks:200,
    colors:['#1e3408','#364c14','#2a4010','#3a5818','#22380c','#486020','#1a2c06','#406818'],
    details:300, detailColors:['#526a28','#1a2808','#3a5010']
});
 
// Песок — тёплый, зернистый
const texSand=makePixelTexture({
    base:'#b89040', blocks:180,
    colors:['#a07830','#c8a850','#986830','#d0b860','#886020','#c09848'],
    details:250, detailColors:['#786020','#d8c060','#a88030']
});
 
// Бетон — серый, потёртый
const texConcrete=makePixelTexture({
    base:'#6a6a6a', blocks:150,
    colors:['#585858','#787878','#505050','#686868','#808080','#484848'],
    details:200, detailColors:['#404040','#909090','#3a3a3a']
});
 
// Асфальт — тёмный
const texAsphalt=makePixelTexture({
    base:'#282828', blocks:200,
    colors:['#1e1e1e','#323232','#1a1a1a','#2e2e2e','#242424','#383838'],
    details:300, detailColors:['#141414','#3c3c3c']
});
 
// Красный кирпич
const texBrick=makePixelTexture({
    base:'#8a2018', blocks:120,
    colors:['#722010','#9a2820','#6a1810','#a03020','#581808','#b83828'],
    details:150, detailColors:['#c04030','#481408']
});
 
// Металл (для гаража)
const texMetal=makePixelTexture({
    base:'#303030', blocks:200,
    colors:['#282828','#383838','#222222','#404040','#1e1e1e','#484848'],
    details:400, detailColors:['#181818','#504848']
});
 
// Кирпич для зданий
const texWallConcrete=makePixelTexture({
    base:'#5a5a5a', blocks:120,
    colors:['#484848','#626262','#404040','#6a6a6a','#3c3c3c','#747474'],
    details:100, detailColors:['#383838','#848484']
});
 
function makeCamoTexture(hex) {
    // Текстура брони танка в стиле Танки Онлайн 2012 — стальные плиты с заклёпками
    const SZ=256;
    const c=document.createElement('canvas'); c.width=SZ; c.height=SZ;
    const ctx=c.getContext('2d');
    let r=parseInt(hex.slice(1,3),16)||76, g=parseInt(hex.slice(3,5),16)||168, b=parseInt(hex.slice(5,7),16)||0;
    const rgb=(dr=0,dg=0,db=0,a=1)=>`rgba(${Math.max(0,Math.min(255,r+dr))},${Math.max(0,Math.min(255,g+dr+dg))},${Math.max(0,Math.min(255,b+dr+db))},${a})`;

    // 1) Базовый градиент с лёгкой неоднородностью освещения
    const grad=ctx.createLinearGradient(0,0,SZ,SZ);
    grad.addColorStop(0,rgb(20,20,20));
    grad.addColorStop(0.5,hex);
    grad.addColorStop(1,rgb(-25,-25,-25));
    ctx.fillStyle=grad; ctx.fillRect(0,0,SZ,SZ);

    // 2) Камуфляжные пятна (по типу краски)
    const camoSpots=22;
    for(let i=0;i<camoSpots;i++) {
        ctx.fillStyle=rgb(-40-Math.random()*30,-40-Math.random()*30,-40-Math.random()*30,0.45);
        const cx=Math.random()*SZ, cy=Math.random()*SZ, rd=18+Math.random()*30;
        ctx.beginPath();
        ctx.ellipse(cx,cy,rd,rd*(0.5+Math.random()*0.7),Math.random()*Math.PI,0,Math.PI*2);
        ctx.fill();
    }
    for(let i=0;i<14;i++) {
        ctx.fillStyle=rgb(25+Math.random()*20,25+Math.random()*20,25+Math.random()*20,0.35);
        const cx=Math.random()*SZ, cy=Math.random()*SZ, rd=12+Math.random()*22;
        ctx.beginPath();
        ctx.ellipse(cx,cy,rd,rd*(0.5+Math.random()*0.7),Math.random()*Math.PI,0,Math.PI*2);
        ctx.fill();
    }

    // 3) Бронепанели — горизонтальные швы между плитами
    ctx.strokeStyle='rgba(0,0,0,0.65)'; ctx.lineWidth=2;
    const plateRows=[0.32,0.62];
    for(const py of plateRows) {
        const y=Math.floor(py*SZ);
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(SZ,y); ctx.stroke();
        // Подсветка сверху от шва
        ctx.strokeStyle='rgba(255,255,255,0.10)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(0,y-1); ctx.lineTo(SZ,y-1); ctx.stroke();
        ctx.strokeStyle='rgba(0,0,0,0.65)'; ctx.lineWidth=2;
    }
    // Вертикальные швы между секциями
    const plateCols=[0.40,0.78];
    for(const px of plateCols) {
        const x=Math.floor(px*SZ);
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,SZ); ctx.stroke();
    }

    // 4) Заклёпки (rivets) — характерная деталь брони ТО
    const drawRivet=(x,y,size=3)=>{
        // Темный кружок-углубление
        ctx.fillStyle='rgba(0,0,0,0.55)';
        ctx.beginPath(); ctx.arc(x,y,size,0,Math.PI*2); ctx.fill();
        // Светлая заклёпка сверху
        ctx.fillStyle=rgb(40,40,40,0.85);
        ctx.beginPath(); ctx.arc(x-0.5,y-0.5,size*0.65,0,Math.PI*2); ctx.fill();
        // Микро-блик
        ctx.fillStyle='rgba(255,255,255,0.45)';
        ctx.beginPath(); ctx.arc(x-1,y-1,size*0.22,0,Math.PI*2); ctx.fill();
    };
    // Заклёпки по швам
    for(const py of plateRows) {
        const y=Math.floor(py*SZ);
        for(let x=12;x<SZ;x+=18) drawRivet(x+Math.random()*2,y,3);
    }
    // Заклёпки по углам секций
    for(const py of [0.05,0.95]) for(const px of [0.06,0.40,0.78,0.95]) {
        drawRivet(Math.floor(px*SZ),Math.floor(py*SZ),3.2);
    }

    // 5) Царапины и потёртости по краям панелей
    for(let i=0;i<60;i++) {
        const sx=Math.random()*SZ, sy=Math.random()*SZ;
        ctx.strokeStyle=`rgba(${Math.random()<0.5?180:30},${Math.random()<0.5?180:30},${Math.random()<0.5?180:30},${0.10+Math.random()*0.15})`;
        ctx.lineWidth=0.7+Math.random();
        ctx.beginPath(); ctx.moveTo(sx,sy);
        ctx.lineTo(sx+(Math.random()-0.5)*22,sy+(Math.random()-0.5)*8);
        ctx.stroke();
    }
    // 6) Грязные потёки (длинные тёмные полосы вниз)
    for(let i=0;i<5;i++) {
        const sx=Math.random()*SZ;
        const grad2=ctx.createLinearGradient(sx,0,sx,SZ);
        grad2.addColorStop(0,'rgba(0,0,0,0)');
        grad2.addColorStop(0.5,'rgba(40,30,20,0.20)');
        grad2.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=grad2; ctx.fillRect(sx-2,0,3+Math.random()*4,SZ);
    }
    // 7) Тёмная виньетка по краям — добавляет глубины
    const vg=ctx.createRadialGradient(SZ/2,SZ/2,SZ*0.3,SZ/2,SZ/2,SZ*0.72);
    vg.addColorStop(0,'rgba(0,0,0,0)');
    vg.addColorStop(1,'rgba(0,0,0,0.32)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,SZ,SZ);

    const tex=new THREE.CanvasTexture(c);
    tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
    tex.anisotropy=4;
    return tex;
}

// ──── Текстура брони пушек/башен — тёмный металл с щитом, без покраски ────
let _gunMetalTex=null;
function makeGunMetalTexture() {
    if(_gunMetalTex) return _gunMetalTex;
    const SZ=256;
    const c=document.createElement('canvas'); c.width=SZ; c.height=SZ;
    const ctx=c.getContext('2d');
    // Базовый тёмно-стальной градиент
    const grad=ctx.createLinearGradient(0,0,0,SZ);
    grad.addColorStop(0,'#3a3a3a');
    grad.addColorStop(0.45,'#2a2a2a');
    grad.addColorStop(1,'#1e1e1e');
    ctx.fillStyle=grad; ctx.fillRect(0,0,SZ,SZ);
    // Горизонтальные полосы прокатки
    for(let y=0;y<SZ;y+=2) {
        ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.04})`;
        ctx.fillRect(0,y,SZ,1);
    }
    // Несколько швов (как литая броня — мало швов)
    ctx.strokeStyle='rgba(0,0,0,0.7)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,SZ*0.5); ctx.lineTo(SZ,SZ*0.5); ctx.stroke();
    // Заклёпки по линии шва
    for(let x=10;x<SZ;x+=22) {
        ctx.fillStyle='rgba(0,0,0,0.6)';
        ctx.beginPath(); ctx.arc(x,SZ*0.5,3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#666';
        ctx.beginPath(); ctx.arc(x-0.5,SZ*0.5-0.5,2,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.arc(x-1,SZ*0.5-1,0.7,0,Math.PI*2); ctx.fill();
    }
    // Царапины
    for(let i=0;i<80;i++) {
        const sx=Math.random()*SZ, sy=Math.random()*SZ;
        ctx.strokeStyle=`rgba(${Math.random()<0.5?200:50},${Math.random()<0.5?200:50},${Math.random()<0.5?200:50},${0.08+Math.random()*0.1})`;
        ctx.lineWidth=0.6;
        ctx.beginPath(); ctx.moveTo(sx,sy);
        ctx.lineTo(sx+(Math.random()-0.5)*16,sy+(Math.random()-0.5)*4);
        ctx.stroke();
    }
    // Ржавые пятна по краям (немного)
    for(let i=0;i<4;i++) {
        ctx.fillStyle=`rgba(120,60,20,${0.15+Math.random()*0.15})`;
        const cx=Math.random()*SZ, cy=Math.random()*SZ, rd=4+Math.random()*8;
        ctx.beginPath();
        ctx.ellipse(cx,cy,rd,rd*0.5,Math.random()*Math.PI,0,Math.PI*2);
        ctx.fill();
    }
    _gunMetalTex=new THREE.CanvasTexture(c);
    _gunMetalTex.wrapS=_gunMetalTex.wrapT=THREE.RepeatWrapping;
    _gunMetalTex.anisotropy=4;
    return _gunMetalTex;
}
 
// ==========================================
// 3D ИНИЦИАЛИЗАЦИЯ
// ==========================================
let sceneBat, sceneGar, sceneLootbox, camera, renderer, clock;
let mapGroup, mapObjects=[], garageMesh, bullets=[], tanks={}, particles=[], placedMines=[];
let lbGroup, lbMesh;
let myId=null, keys={}, sceneType='none';
let camHeight=6, garageTankRot=-0.5;
let mouseTurretDelta=0, lastMouseX=null, mouseTurretActive=false;
let minimapCtx=null;
let frostTimer=0;
 
function init3D() {
    renderer=new THREE.WebGLRenderer({ canvas:document.getElementById('mainCanvas'), antialias:true, alpha:true, logarithmicDepthBuffer:true });
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
    renderer.shadowMap.enabled=false;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.1;
    clock=new THREE.Clock();
    camera=new THREE.PerspectiveCamera(65,window.innerWidth/window.innerHeight,0.1,800);
 
    minimapCtx=document.getElementById('minimap-canvas').getContext('2d');
 
    // ======= ГАРАЖ — АНГАР ТО 2012 (РАСШИРЕННАЯ ВЕРСИЯ) =======
    sceneGar=new THREE.Scene();
    sceneGar.background=new THREE.Color(0x0e1410);
    sceneGar.fog=new THREE.Fog(0x0e1410,18,46);

    // Освещение — многоуровневое, кинематографичное
    const gAmb=new THREE.AmbientLight(0x90a0b8,0.55);
    sceneGar.add(gAmb);
    // Главный прожектор сверху (KEY)
    const gKey=new THREE.DirectionalLight(0xfff4d8,1.4);
    gKey.position.set(6,14,8); sceneGar.add(gKey);
    // Контровый — зеленоватый, фирменный цвет ТО (RIM)
    const gRim=new THREE.DirectionalLight(0x6cce00,0.55);
    gRim.position.set(-6,8,-12); sceneGar.add(gRim);
    // Подсветка снизу — холодная (FILL)
    const gFill=new THREE.PointLight(0x4488ff,0.6,18);
    gFill.position.set(0,1.0,3); sceneGar.add(gFill);
    // Боковая жёлтая
    const gSide=new THREE.PointLight(0xffaa44,0.45,15);
    gSide.position.set(-7,3,4); sceneGar.add(gSide);

    // ── ПОЛ ─ полированный металл с подсветкой ─────────────────────────
    function makeGarageFloorTex() {
        const c=document.createElement('canvas'); c.width=512; c.height=512;
        const ctx=c.getContext('2d');
        // Базовый тёмный градиент
        const g=ctx.createRadialGradient(256,256,40,256,256,400);
        g.addColorStop(0,'#2a3024'); g.addColorStop(0.4,'#1a1f18'); g.addColorStop(1,'#080a08');
        ctx.fillStyle=g; ctx.fillRect(0,0,512,512);
        // Плиты 128×128
        ctx.strokeStyle='rgba(0,0,0,0.7)'; ctx.lineWidth=4;
        for(let i=0;i<=512;i+=128){
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke();
        }
        // Тонкие швы 64×64
        ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=1.5;
        for(let i=0;i<=512;i+=64){
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke();
        }
        // Заклёпки
        for(let x=64;x<512;x+=128) for(let y=64;y<512;y+=128) {
            ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
            ctx.fillStyle='#555'; ctx.beginPath(); ctx.arc(x-0.7,y-0.7,2,0,Math.PI*2); ctx.fill();
        }
        // Тонкие отражения / блики
        for(let i=0;i<60;i++){
            ctx.fillStyle=`rgba(150,180,150,${Math.random()*0.05})`;
            ctx.fillRect(Math.random()*512,Math.random()*512,3+Math.random()*8,1);
        }
        // Тёмная виньетка
        const vg=ctx.createRadialGradient(256,256,180,256,256,360);
        vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.35)');
        ctx.fillStyle=vg; ctx.fillRect(0,0,512,512);
        return new THREE.CanvasTexture(c);
    }
    const garFloorTex=makeGarageFloorTex();
    garFloorTex.wrapS=garFloorTex.wrapT=THREE.RepeatWrapping;
    garFloorTex.repeat.set(2,2);
    garFloorTex.anisotropy=4;
    const garFloor=new THREE.Mesh(new THREE.PlaneGeometry(60,60), new THREE.MeshPhongMaterial({map:garFloorTex,shininess:35,specular:0x333333}));
    garFloor.rotation.x=-Math.PI/2; sceneGar.add(garFloor);

    // Рельсы (2 параллельные)
    const railMat=new THREE.MeshPhongMaterial({color:0xc8b400,shininess:80,specular:0x999900});
    for(let ox of [-1.4,1.4]) {
        const rail=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.06,20), railMat);
        rail.position.set(ox,0.04,0); sceneGar.add(rail);
    }
    // Шпалы
    const tieMat=new THREE.MeshPhongMaterial({color:0x3a2810,shininess:8});
    for(let z=-8;z<=8;z+=0.9) {
        const tie=new THREE.Mesh(new THREE.BoxGeometry(3.5,0.04,0.22),tieMat);
        tie.position.set(0,0.02,z); sceneGar.add(tie);
    }
    // Жёлто-чёрные предупреждающие полосы вдоль рельс
    const warnTex=document.createElement('canvas'); warnTex.width=64; warnTex.height=16;
    {
        const c2=warnTex.getContext('2d');
        c2.fillStyle='#ffcc00'; c2.fillRect(0,0,64,16);
        c2.fillStyle='#000000';
        for(let i=0;i<64;i+=16){ c2.beginPath(); c2.moveTo(i,0); c2.lineTo(i+16,16); c2.lineTo(i+8,16); c2.lineTo(i,0); c2.fill(); }
    }
    const warnT=new THREE.CanvasTexture(warnTex); warnT.wrapS=warnT.wrapT=THREE.RepeatWrapping; warnT.repeat.set(8,1);
    for(let zx of [-2.2,2.2]) {
        const warn=new THREE.Mesh(new THREE.PlaneGeometry(20,0.4),new THREE.MeshBasicMaterial({map:warnT}));
        warn.rotation.x=-Math.PI/2; warn.position.set(zx,0.05,0); sceneGar.add(warn);
    }

    // ── ПОДИУМ — улучшенный ──────────────────────────────────────────
    const platMat=new THREE.MeshPhongMaterial({color:0x141414,shininess:40,specular:0x444444});
    const platform=new THREE.Mesh(new THREE.CylinderGeometry(3.8,4.3,0.50,48),platMat);
    platform.position.y=0.25; sceneGar.add(platform);
    // Декоративные грани подиума — выступающие сегменты
    for(let s=0;s<8;s++) {
        const ang=s*Math.PI/4;
        const seg=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.6,0.4),new THREE.MeshPhongMaterial({color:0x222222,shininess:30}));
        seg.position.set(Math.cos(ang)*4.0,0.25,Math.sin(ang)*4.0);
        seg.rotation.y=-ang; sceneGar.add(seg);
    }
    // Верхняя плита подиума — тёмный шлифованный металл
    const platTop=new THREE.Mesh(new THREE.CylinderGeometry(3.55,3.85,0.10,48),new THREE.MeshPhongMaterial({color:0x282c28,shininess:55,specular:0x888888}));
    platTop.position.y=0.51; sceneGar.add(platTop);
    // Центральный круг с эмблемой ТО
    function makeTOEmblemTex() {
        const c=document.createElement('canvas'); c.width=256; c.height=256;
        const ctx=c.getContext('2d');
        ctx.fillStyle='#0a0f0a'; ctx.fillRect(0,0,256,256);
        // Внешнее зелёное кольцо
        ctx.strokeStyle='#8eff00'; ctx.lineWidth=8;
        ctx.beginPath(); ctx.arc(128,128,110,0,Math.PI*2); ctx.stroke();
        ctx.strokeStyle='#5aaa00'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(128,128,96,0,Math.PI*2); ctx.stroke();
        // Текст
        ctx.font='bold 38px Oswald,Arial';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillStyle='#8eff00';
        ctx.shadowColor='#6cce00'; ctx.shadowBlur=12;
        ctx.fillText('TANKI',128,98);
        ctx.fillText('ONLINE',128,158);
        ctx.shadowBlur=0;
        // Звезда
        ctx.fillStyle='#ffcc00';
        ctx.font='80px Arial';
        ctx.fillText('★',128,130);
        return new THREE.CanvasTexture(c);
    }
    const emblemPlate=new THREE.Mesh(new THREE.CircleGeometry(2.4,32),new THREE.MeshBasicMaterial({map:makeTOEmblemTex(),transparent:true,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));
    emblemPlate.rotation.x=-Math.PI/2; emblemPlate.position.y=0.561; sceneGar.add(emblemPlate);

    // Светящееся внешнее кольцо платформы (анимируется)
    const ringGeo=new THREE.TorusGeometry(3.95,0.08,8,80);
    const ring=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:0x8eff00}));
    ring.rotation.x=-Math.PI/2; ring.position.y=0.48; ring.userData.isPulseRing=true; sceneGar.add(ring);
    // Второе кольцо ближе к центру
    const innerRing=new THREE.Mesh(new THREE.TorusGeometry(3.55,0.04,6,64),new THREE.MeshBasicMaterial({color:0x5aaa00}));
    innerRing.rotation.x=-Math.PI/2; innerRing.position.y=0.49; sceneGar.add(innerRing);
    // Анимированные сегменты — 12 точек по кольцу
    const ringDots=[];
    for(let i=0;i<24;i++) {
        const ang=i*Math.PI*2/24;
        const dot=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.05,0.13),new THREE.MeshBasicMaterial({color:0x8eff00}));
        dot.position.set(Math.cos(ang)*4.15,0.50,Math.sin(ang)*4.15);
        dot.userData.angle=ang; sceneGar.add(dot); ringDots.push(dot);
    }
    sceneGar.userData.ringDots=ringDots;

    // ── СТЕНЫ — высокие, с панелями и подсветкой ──────────────────────
    const wallPanelMat=new THREE.MeshPhongMaterial({color:0x0e120e,shininess:8,specular:0x222222});
    const wallTrimMat =new THREE.MeshPhongMaterial({color:0x1a1f16,shininess:18});
    const wallStripMat=new THREE.MeshBasicMaterial({color:0x6cce00});
    // Задняя стена
    const bWall=new THREE.Mesh(new THREE.PlaneGeometry(60,18),wallPanelMat);
    bWall.position.set(0,9,-22); sceneGar.add(bWall);
    // Левая стена
    const lWall=new THREE.Mesh(new THREE.PlaneGeometry(48,18),wallPanelMat);
    lWall.rotation.y=Math.PI/2; lWall.position.set(-24,9,0); sceneGar.add(lWall);
    // Правая стена
    const rWall=new THREE.Mesh(new THREE.PlaneGeometry(48,18),wallPanelMat);
    rWall.rotation.y=-Math.PI/2; rWall.position.set(24,9,0); sceneGar.add(rWall);
    // Потолок
    const ceil=new THREE.Mesh(new THREE.PlaneGeometry(60,48),new THREE.MeshPhongMaterial({color:0x080a08,shininess:5}));
    ceil.rotation.x=Math.PI/2; ceil.position.y=18; sceneGar.add(ceil);
    // Балки потолка (горизонтальные)
    for(let z=-18;z<=18;z+=6) {
        const beam=new THREE.Mesh(new THREE.BoxGeometry(48,0.5,0.6),new THREE.MeshPhongMaterial({color:0x1a1f16,shininess:15}));
        beam.position.set(0,17.7,z); sceneGar.add(beam);
    }
    // Балки потолка (продольные)
    for(let x=-20;x<=20;x+=10) {
        const beam=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.5,48),new THREE.MeshPhongMaterial({color:0x1a1f16,shininess:15}));
        beam.position.set(x,17.7,0); sceneGar.add(beam);
    }

    // ── ОГРОМНЫЙ ЛОГО-БАННЕР "TANKI ONLINE" НА ЗАДНЕЙ СТЕНЕ ────────────
    function makeBannerTex() {
        const c=document.createElement('canvas'); c.width=1024; c.height=256;
        const ctx=c.getContext('2d');
        // Чёрный фон
        const g=ctx.createLinearGradient(0,0,0,256);
        g.addColorStop(0,'#0a0f0a'); g.addColorStop(0.5,'#1a2008'); g.addColorStop(1,'#050805');
        ctx.fillStyle=g; ctx.fillRect(0,0,1024,256);
        // Зелёная неоновая рамка
        ctx.strokeStyle='#8eff00'; ctx.lineWidth=8;
        ctx.strokeRect(6,6,1012,244);
        ctx.strokeStyle='#5aaa00'; ctx.lineWidth=2;
        ctx.strokeRect(18,18,988,220);
        // Главный текст с неоновым свечением
        ctx.font='bold 130px Oswald,Arial';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.shadowColor='#8eff00'; ctx.shadowBlur=30;
        ctx.fillStyle='#a4ff4a'; ctx.fillText('TANKI ONLINE',512,116);
        ctx.shadowBlur=0;
        // Под-текст
        ctx.font='bold 36px Oswald,Arial';
        ctx.fillStyle='#ffcc00'; ctx.shadowColor='#cc9900'; ctx.shadowBlur=8;
        ctx.fillText('★ CLASSIC ★ 2012 ★',512,210);
        ctx.shadowBlur=0;
        // Декор — диагональные полосы по углам
        ctx.strokeStyle='rgba(140,255,0,0.4)'; ctx.lineWidth=4;
        for(let i=0;i<5;i++){
            ctx.beginPath(); ctx.moveTo(30+i*15,30); ctx.lineTo(30,30+i*15); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(994-i*15,30); ctx.lineTo(994,30+i*15); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(30+i*15,226); ctx.lineTo(30,226-i*15); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(994-i*15,226); ctx.lineTo(994,226-i*15); ctx.stroke();
        }
        return new THREE.CanvasTexture(c);
    }
    const bannerMat=new THREE.MeshBasicMaterial({map:makeBannerTex(),transparent:true});
    const banner=new THREE.Mesh(new THREE.PlaneGeometry(28,7),bannerMat);
    banner.position.set(0,12.5,-21.85); sceneGar.add(banner);
    // Подсветка баннера снизу
    const bannerGlow=new THREE.PointLight(0x6cce00,0.7,12);
    bannerGlow.position.set(0,9,-19); sceneGar.add(bannerGlow);
    // Боковые маленькие баннеры на задней стене
    function makeSideBanner(color) {
        const c=document.createElement('canvas'); c.width=256; c.height=512;
        const ctx=c.getContext('2d');
        const g=ctx.createLinearGradient(0,0,0,512);
        g.addColorStop(0,'#0a0f0a'); g.addColorStop(1,'#050805');
        ctx.fillStyle=g; ctx.fillRect(0,0,256,512);
        ctx.strokeStyle=color; ctx.lineWidth=4;
        ctx.strokeRect(8,8,240,496);
        // Вертикальная надпись
        ctx.save();
        ctx.translate(128,256); ctx.rotate(-Math.PI/2);
        ctx.font='bold 48px Oswald';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillStyle=color; ctx.shadowColor=color; ctx.shadowBlur=15;
        ctx.fillText('★ ALTERNATIVA ★',0,0);
        ctx.restore();
        // Декор-полоса
        ctx.fillStyle=color; ctx.fillRect(60,40,136,8); ctx.fillRect(60,464,136,8);
        return new THREE.CanvasTexture(c);
    }
    for(let bx of [-12,12]) {
        const sb=new THREE.Mesh(new THREE.PlaneGeometry(3.2,7),new THREE.MeshBasicMaterial({map:makeSideBanner(bx<0?'#ffcc00':'#00ccff'),transparent:true}));
        sb.position.set(bx,8,-21.84); sceneGar.add(sb);
    }

    // ── ДЕКОРАТИВНЫЕ ПАНЕЛИ НА БОКОВЫХ СТЕНАХ ─────────────────────────
    for(let z=-15;z<=15;z+=5) {
        for(let sideX of [-23.84,23.84]) {
            const panel=new THREE.Mesh(new THREE.BoxGeometry(0.16,9,3.8),new THREE.MeshPhongMaterial({color:0x141812,shininess:10}));
            panel.position.set(sideX,5,z); sceneGar.add(panel);
            // Зелёная полоска
            const strip=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.10,3.6),new THREE.MeshBasicMaterial({color:0x6cce00}));
            strip.position.set(sideX,9.0,z); sceneGar.add(strip);
        }
    }

    // ── ПОТОЛОЧНЫЕ ЛАМПЫ ─ улучшенные ─────────────────────────────────
    const lampHsg=new THREE.MeshPhongMaterial({color:0x222222,shininess:30});
    for(let x of [-10,0,10]) {
        // Корпус лампы
        const housing=new THREE.Mesh(new THREE.BoxGeometry(4,0.5,2),lampHsg);
        housing.position.set(x,17.4,0); sceneGar.add(housing);
        // Светящаяся часть
        const lamp=new THREE.Mesh(new THREE.BoxGeometry(3.6,0.18,1.6),new THREE.MeshBasicMaterial({color:0xfff8d0}));
        lamp.position.set(x,17.15,0); sceneGar.add(lamp);
        // Источник света
        const lSpot=new THREE.PointLight(0xfff8d0,0.7,24);
        lSpot.position.set(x,15.5,0); sceneGar.add(lSpot);
        // Подвес
        for(let zi of [-3,3]) {
            const wire=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,0.6,6),lampHsg);
            wire.position.set(x,17.85,zi*0.3); sceneGar.add(wire);
        }
    }

    // ── ВОЗДУХОВОДЫ НА ПОТОЛКЕ (декор) ────────────────────────────────
    const ductMat=new THREE.MeshPhongMaterial({color:0x4a4a4a,shininess:30,specular:0x666666});
    for(let z of [-12,12]) {
        const duct=new THREE.Mesh(new THREE.BoxGeometry(40,1.0,1.2),ductMat);
        duct.position.set(0,16.5,z); sceneGar.add(duct);
        // Соединительные хомуты
        for(let x=-18;x<=18;x+=6) {
            const clamp=new THREE.Mesh(new THREE.BoxGeometry(0.4,1.1,1.3),new THREE.MeshPhongMaterial({color:0x222222,shininess:25}));
            clamp.position.set(x,16.5,z); sceneGar.add(clamp);
        }
    }

    // ── ЯЩИКИ-ДЕКОРАЦИИ (улучшенные) ──────────────────────────────────
    for(let ox of [-1,1]) {
        // Основной ящик
        const boxMain=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.4,3.2),new THREE.MeshPhongMaterial({color:0x2a2a2a,shininess:15}));
        boxMain.position.set(ox*16,1.2,-12); sceneGar.add(boxMain);
        // Усиливающие планки — крест
        const planeMat=new THREE.MeshPhongMaterial({color:0xc8a800,shininess:25});
        const stripeH=new THREE.Mesh(new THREE.BoxGeometry(2.25,0.22,3.25),planeMat);
        stripeH.position.set(ox*16,1.6,-12); sceneGar.add(stripeH);
        const stripeV=new THREE.Mesh(new THREE.BoxGeometry(0.22,2.45,3.25),planeMat);
        stripeV.position.set(ox*16,1.2,-12); sceneGar.add(stripeV);
        // Крышка ящика
        const boxLid=new THREE.Mesh(new THREE.BoxGeometry(2.3,0.18,3.3),new THREE.MeshPhongMaterial({color:0x1a1a1a,shininess:20}));
        boxLid.position.set(ox*16,2.5,-12); sceneGar.add(boxLid);
        // Эмблема "★" сверху
        const embC=document.createElement('canvas'); embC.width=128; embC.height=128;
        const eCtx=embC.getContext('2d');
        eCtx.fillStyle='#c8a800'; eCtx.fillRect(0,0,128,128);
        eCtx.fillStyle='#000'; eCtx.font='bold 88px Arial';
        eCtx.textAlign='center'; eCtx.textBaseline='middle';
        eCtx.fillText('★',64,68);
        const embTex=new THREE.CanvasTexture(embC);
        const embSpr=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),new THREE.MeshBasicMaterial({map:embTex,transparent:true}));
        embSpr.rotation.x=-Math.PI/2; embSpr.position.set(ox*16,2.61,-12); sceneGar.add(embSpr);
    }

    // ── СТЕЛЛАЖИ С ЗАПЧАСТЯМИ ПО СТОРОНАМ ─────────────────────────────
    for(let sxz of [-1,1]) {
        // Стойка
        const rack=new THREE.Mesh(new THREE.BoxGeometry(0.4,5,3),new THREE.MeshPhongMaterial({color:0x383838,shininess:25}));
        rack.position.set(sxz*19,2.5,8); sceneGar.add(rack);
        // 3 полки
        for(let py of [1.0,2.5,4.0]) {
            const shelf=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.12,2.8),new THREE.MeshPhongMaterial({color:0x222222,shininess:20}));
            shelf.position.set(sxz*19.1,py,8); sceneGar.add(shelf);
            // Предметы на полках
            for(let oz of [-0.9,0,0.9]) {
                const item=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.45,0.6),new THREE.MeshPhongMaterial({color:Math.random()<0.5?0x4a4a4a:0x8a6020,shininess:30}));
                item.position.set(sxz*19.1,py+0.3,8+oz); sceneGar.add(item);
            }
        }
    }

    // ── ВРАЩАЮЩИЕСЯ ПРОЖЕКТОРЫ НА ПОТОЛКЕ ─────────────────────────────
    const spotlightGroup=new THREE.Group();
    for(let i=0;i<2;i++) {
        const arm=new THREE.Mesh(new THREE.BoxGeometry(0.3,1.5,0.3),new THREE.MeshPhongMaterial({color:0x222222,shininess:25}));
        arm.position.set(0,16.5,0); spotlightGroup.add(arm);
        const head=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.4,1.2,12),new THREE.MeshPhongMaterial({color:0x444444,shininess:40}));
        head.position.set(i===0?-2.5:2.5,15.6,0); head.rotation.x=Math.PI/2; head.rotation.z=Math.PI/2;
        spotlightGroup.add(head);
        // Лампа спереди
        const headLamp=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.18,12),new THREE.MeshBasicMaterial({color:0xffeeaa}));
        headLamp.position.set(i===0?-3.05:3.05,15.6,0); headLamp.rotation.z=Math.PI/2;
        spotlightGroup.add(headLamp);
    }
    sceneGar.add(spotlightGroup);
    sceneGar.userData.spotlightGroup=spotlightGroup;

    // ── ГОЛОГРАФИЧЕСКИЙ ИНФО-ДИСПЛЕЙ (декор сбоку платформы) ──────────
    function makeHoloTex() {
        const c=document.createElement('canvas'); c.width=256; c.height=128;
        const ctx=c.getContext('2d');
        ctx.fillStyle='rgba(0,30,60,0.85)'; ctx.fillRect(0,0,256,128);
        // Сетка
        ctx.strokeStyle='#00ccff'; ctx.lineWidth=0.8;
        for(let i=0;i<256;i+=16){ ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,128);ctx.stroke(); }
        for(let i=0;i<128;i+=16){ ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(256,i);ctx.stroke(); }
        // Контур танка (силуэт)
        ctx.fillStyle='#88ccff'; ctx.shadowColor='#00ccff'; ctx.shadowBlur=15;
        // Корпус
        ctx.fillRect(50,76,160,24);
        // Гусеницы
        ctx.fillRect(40,86,180,14);
        // Башня
        ctx.fillRect(95,52,70,28);
        // Ствол
        ctx.fillRect(155,62,60,8);
        ctx.shadowBlur=0;
        // Текст
        ctx.font='bold 14px Courier New';
        ctx.fillStyle='#00ffff'; ctx.fillText('TANK STATUS',10,16);
        ctx.fillStyle='#88ff88'; ctx.fillText('READY',180,16);
        return new THREE.CanvasTexture(c);
    }
    for(let hx of [-1,1]) {
        const holo=new THREE.Mesh(new THREE.PlaneGeometry(3.2,1.6),new THREE.MeshBasicMaterial({map:makeHoloTex(),transparent:true,opacity:0.85,side:THREE.DoubleSide}));
        holo.position.set(hx*5.5,2.2,0); holo.rotation.y=-hx*0.6; sceneGar.add(holo);
        // Стойка под голограммой
        const stand=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.18,1.4,8),new THREE.MeshPhongMaterial({color:0x222222,shininess:30}));
        stand.position.set(hx*5.5,0.7,0); sceneGar.add(stand);
        const standBase=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.5,0.18,12),new THREE.MeshPhongMaterial({color:0x111111,shininess:25}));
        standBase.position.set(hx*5.5,0.09,0); sceneGar.add(standBase);
    }

    // ── ЛЕНТОЧНЫЕ СВЕТОДИОДЫ ВДОЛЬ ПОЛА ────────────────────────────────
    const ledStripMat=new THREE.MeshBasicMaterial({color:0x44ff44});
    for(let zs of [-19,19]) {
        const ledStrip=new THREE.Mesh(new THREE.BoxGeometry(40,0.06,0.18),ledStripMat);
        ledStrip.position.set(0,0.08,zs); sceneGar.add(ledStrip);
    }
    for(let xs of [-19.5,19.5]) {
        const ledStrip=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.06,38),ledStripMat);
        ledStrip.position.set(xs,0.08,0); sceneGar.add(ledStrip);
    }

    // ======= СЦЕНА БИТВЫ =======
    sceneBat=new THREE.Scene();
    mapGroup=new THREE.Group(); sceneBat.add(mapGroup);
    const batAmb=new THREE.AmbientLight(0xffffff,0.9); sceneBat.add(batAmb);
    const batDir=new THREE.DirectionalLight(0xfff0d0,0.7);
    batDir.position.set(100,200,80); sceneBat.add(batDir);
 
    // ======= ЛУТБОКС — ДЕТАЛЬНАЯ 3D МОДЕЛЬ =======
    sceneLootbox=new THREE.Scene();
    sceneLootbox.background=new THREE.Color(0x060a06);

    // Освещение — красивое, как в магазине Танков Онлайн
    sceneLootbox.add(new THREE.AmbientLight(0xffffff, 0.55));
    const lbKeyLight=new THREE.DirectionalLight(0xfff4e0, 1.4);
    lbKeyLight.position.set(6,14,8); sceneLootbox.add(lbKeyLight);
    const lbFillLight=new THREE.DirectionalLight(0x88ccff, 0.5);
    lbFillLight.position.set(-8,8,-6); sceneLootbox.add(lbFillLight);
    const lbRimLight=new THREE.DirectionalLight(0xffffff, 0.35);
    lbRimLight.position.set(0,4,-10); sceneLootbox.add(lbRimLight);
    // Точечный свет снизу — глянцевый отблеск
    const lbUnderLight=new THREE.PointLight(0x4488ff, 0.8, 18);
    lbUnderLight.position.set(0,-2,0); sceneLootbox.add(lbUnderLight);

    const lbFloor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshBasicMaterial({color:0x0d0d0d}));
    lbFloor.rotation.x=-Math.PI/2; sceneLootbox.add(lbFloor);

    // Отражающая платформа под ящиком
    const lbPlatform=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.6,0.18,32),new THREE.MeshLambertMaterial({color:0x181c18}));
    lbPlatform.position.y=0.09; sceneLootbox.add(lbPlatform);
    // Светящееся кольцо платформы
    const lbRingGeo=new THREE.TorusGeometry(3.3,0.06,8,48);
    const lbRing=new THREE.Mesh(lbRingGeo,new THREE.MeshBasicMaterial({color:0x22ff44}));
    lbRing.rotation.x=-Math.PI/2; lbRing.position.y=0.2; sceneLootbox.add(lbRing);

    lbGroup=new THREE.Group();

    // ── НИЖНЯЯ ЧАСТЬ ЯЩИКА (синяя — как нижний слой на фото) ──────────────
    const blueBodyMat=new THREE.MeshLambertMaterial({color:0x1a3a6a});
    const blueBase=new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.0, 2.9), blueBodyMat);
    blueBase.position.y=-0.45; lbGroup.add(blueBase);

    // Синяя сетчатая текстура (canvas)
    const blueGridCv=document.createElement('canvas'); blueGridCv.width=128; blueGridCv.height=128;
    const blueCtx=blueGridCv.getContext('2d');
    blueCtx.fillStyle='#1a3a6a'; blueCtx.fillRect(0,0,128,128);
    blueCtx.strokeStyle='#2255aa'; blueCtx.lineWidth=2;
    for(let i=0;i<128;i+=16){blueCtx.beginPath();blueCtx.moveTo(i,0);blueCtx.lineTo(i,128);blueCtx.stroke();}
    for(let i=0;i<128;i+=16){blueCtx.beginPath();blueCtx.moveTo(0,i);blueCtx.lineTo(128,i);blueCtx.stroke();}
    const blueGridTex=new THREE.CanvasTexture(blueGridCv);
    blueGridTex.wrapS=blueGridTex.wrapT=THREE.RepeatWrapping;
    blueGridTex.repeat.set(3,2);
    const bluePanelMat=new THREE.MeshLambertMaterial({map:blueGridTex});
    const bluePanel=new THREE.Mesh(new THREE.BoxGeometry(4.22,1.02,2.92),bluePanelMat);
    bluePanel.position.y=-0.45; lbGroup.add(bluePanel);

    // ── ВЕРХНЯЯ ЧАСТЬ КОРПУСА (оливковая / хаки — как на фото) ──────────
    const oliveCv=document.createElement('canvas'); oliveCv.width=128; oliveCv.height=128;
    const oliveCtx=oliveCv.getContext('2d');
    oliveCtx.fillStyle='#4a5a28'; oliveCtx.fillRect(0,0,128,128);
    // Камуфляжные пятна
    for(let i=0;i<20;i++){
        oliveCtx.fillStyle=i%2===0?'#3a4a1e':'#5a6a32';
        const s=12+Math.floor(Math.random()*20);
        oliveCtx.fillRect(Math.floor(Math.random()*112),Math.floor(Math.random()*112),s,s);
    }
    oliveCtx.strokeStyle='#2a3614'; oliveCtx.lineWidth=1.5;
    for(let i=0;i<128;i+=20){oliveCtx.beginPath();oliveCtx.moveTo(i,0);oliveCtx.lineTo(i,128);oliveCtx.stroke();}
    for(let i=0;i<128;i+=20){oliveCtx.beginPath();oliveCtx.moveTo(0,i);oliveCtx.lineTo(128,i);oliveCtx.stroke();}
    const oliveTex=new THREE.CanvasTexture(oliveCv);
    oliveTex.wrapS=oliveTex.wrapT=THREE.RepeatWrapping; oliveTex.repeat.set(2,1);
    const oliveBodyMat=new THREE.MeshLambertMaterial({map:oliveTex});

    // Основа верхней части
    const upperBody=new THREE.Mesh(new THREE.BoxGeometry(4.2,0.7,2.9), oliveBodyMat);
    upperBody.position.y=0.25; lbGroup.add(upperBody);

    // ── ОРАНЖЕВАЯ КРЫШКА С СЕТКОЙ ────────────────────────────────────────
    // Оранжевая сетчатая текстура
    const orangeCv=document.createElement('canvas'); orangeCv.width=128; orangeCv.height=128;
    const orangeCtx=orangeCv.getContext('2d');
    orangeCtx.fillStyle='#c84800'; orangeCtx.fillRect(0,0,128,128);
    orangeCtx.strokeStyle='#ff6600'; orangeCtx.lineWidth=2.5;
    // Диагональная сетка как на фото
    for(let i=-128;i<256;i+=18){
        orangeCtx.beginPath();orangeCtx.moveTo(i,0);orangeCtx.lineTo(i+128,128);orangeCtx.stroke();
        orangeCtx.beginPath();orangeCtx.moveTo(i,128);orangeCtx.lineTo(i+128,0);orangeCtx.stroke();
    }
    orangeCtx.strokeStyle='rgba(255,120,0,0.3)'; orangeCtx.lineWidth=1;
    for(let i=0;i<128;i+=9){
        orangeCtx.beginPath();orangeCtx.moveTo(i,0);orangeCtx.lineTo(i,128);orangeCtx.stroke();
        orangeCtx.beginPath();orangeCtx.moveTo(0,i);orangeCtx.lineTo(128,i);orangeCtx.stroke();
    }
    const orangeTex=new THREE.CanvasTexture(orangeCv);
    orangeTex.wrapS=orangeTex.wrapT=THREE.RepeatWrapping; orangeTex.repeat.set(2,1.2);
    const orangeMat=new THREE.MeshLambertMaterial({map:orangeTex});

    // Крышка — отдельная группа для анимации открытия
    lbLid=new THREE.Group();
    const lidBase=new THREE.Mesh(new THREE.BoxGeometry(4.3,0.22,3.0), orangeMat);
    lidBase.position.y=0.11; lbLid.add(lidBase);
    // Рамка крышки (тёмный металл)
    const lidFrameMat=new THREE.MeshLambertMaterial({color:0x222222});
    const lidFrame=new THREE.Mesh(new THREE.BoxGeometry(4.36,0.28,3.06), lidFrameMat);
    lidFrame.position.y=0.06; lbLid.add(lidFrame);
    // Оранжевая панель поверх рамки
    const lidTop=new THREE.Mesh(new THREE.BoxGeometry(4.22,0.12,2.86), orangeMat);
    lidTop.position.y=0.22; lbLid.add(lidTop);
    // Центральный выступ (как бугор на крышке)
    const lidBump=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.15,1.5), orangeMat);
    lidBump.position.y=0.29; lbLid.add(lidBump);
    // Ребро жёсткости по центру
    const ridgeMat=new THREE.MeshLambertMaterial({color:0x1a1a1a});
    const ridge=new THREE.Mesh(new THREE.BoxGeometry(4.4,0.08,0.2), ridgeMat);
    ridge.position.y=0.22; lbLid.add(ridge);

    // Позиция крышки — ось вращения на задней грани
    lbLid.position.set(0, 0.6, -1.45); // ось — задняя стенка
    lbGroup.add(lbLid);

    // ── МЕТАЛЛИЧЕСКИЕ УСИЛЕННЫЕ УГОЛКИ ───────────────────────────────────
    const steelMat=new THREE.MeshLambertMaterial({color:0x888888});
    const boltMat=new THREE.MeshLambertMaterial({color:0xaaaaaa});
    // Угловые стойки (8 штук — все углы)
    const cornerPositions=[[-2.0,-1.4],[-2.0,1.4],[2.0,-1.4],[2.0,1.4]];
    for(const [cx,cz] of cornerPositions) {
        // Вертикальная стойка
        const vstake=new THREE.Mesh(new THREE.BoxGeometry(0.28,1.55,0.28),steelMat);
        vstake.position.set(cx,0,cz); lbGroup.add(vstake);
        // Горизонтальный усилитель сверху
        const hTop=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.15,0.32),new THREE.MeshLambertMaterial({color:0x999999}));
        hTop.position.set(cx,0.75,cz); lbGroup.add(hTop);
        // Болты на стойках
        for(const by of [-0.3,0.3]) {
            const bolt=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.1,8),boltMat);
            bolt.position.set(cx,by,cz); bolt.rotation.z=Math.PI/2; lbGroup.add(bolt);
        }
    }

    // ── МЕТАЛЛИЧЕСКИЕ ПОЛОСЫ — ГОРИЗОНТАЛЬНЫЕ ОБРУЧИ ─────────────────────
    const bandMat=new THREE.MeshLambertMaterial({color:0x555566});
    // Нижний обруч
    for(const [gw,gh,gd,px,py,pz] of [
        [4.32,0.14,0.14, 0, -0.05, 1.46],  // перед
        [4.32,0.14,0.14, 0, -0.05,-1.46],  // зад
        [0.14,0.14,2.92,-2.12,-0.05, 0],   // лево
        [0.14,0.14,2.92, 2.12,-0.05, 0],   // право
    ]) { const b=new THREE.Mesh(new THREE.BoxGeometry(gw,gh,gd),bandMat); b.position.set(px,py,pz); lbGroup.add(b); }
    // Верхний обруч (у стыка крышки)
    for(const [gw,gh,gd,px,py,pz] of [
        [4.32,0.12,0.12, 0, 0.62, 1.46],
        [4.32,0.12,0.12, 0, 0.62,-1.46],
        [0.12,0.12,2.92,-2.12,0.62, 0],
        [0.12,0.12,2.92, 2.12,0.62, 0],
    ]) { const b=new THREE.Mesh(new THREE.BoxGeometry(gw,gh,gd),bandMat); b.position.set(px,py,pz); lbGroup.add(b); }

    // ── ЗАМКИ / ЗАЩЁЛКИ ───────────────────────────────────────────────────
    const claspMat=new THREE.MeshLambertMaterial({color:0xddbb44});
    for(const px of [-1.2,1.2]) {
        // Корпус замка
        const claspBody=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.38,0.2),claspMat);
        claspBody.position.set(px,0.58,1.5); lbGroup.add(claspBody);
        // Дужка замка
        const claspLatch=new THREE.Mesh(new THREE.BoxGeometry(0.36,0.15,0.14),new THREE.MeshLambertMaterial({color:0xbb9922}));
        claspLatch.position.set(px,0.4,1.5); lbGroup.add(claspLatch);
    }

    // ── ЭМБЛЕМА — ЗНАК КРИСТАЛЛА ПОСЕРЕДИНЕ КРЫШКИ ───────────────────────
    const emblemGeo=new THREE.OctahedronGeometry(0.28,0);
    const emblemMesh=new THREE.Mesh(emblemGeo,new THREE.MeshLambertMaterial({color:0x00ccff,emissive:0x0066aa,emissiveIntensity:0.6}));
    emblemMesh.position.set(0,0.38,0); emblemMesh.rotation.y=Math.PI/4;
    lbLid.add(emblemMesh); // прикреплён к крышке

    // ── РУЧКИ ПО БОКАМ ────────────────────────────────────────────────────
    const handleMat=new THREE.MeshLambertMaterial({color:0x444444});
    for(const px of [-2.25,2.25]) {
        const handleBar=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.55,0.12),handleMat);
        handleBar.position.set(px,0.15,0); lbGroup.add(handleBar);
        // Дуга ручки (2 горизонтальных перемычки)
        const hTop=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.1,0.12),handleMat);
        hTop.position.set(px,0.41,0); lbGroup.add(hTop);
        const hBot=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.1,0.12),handleMat);
        hBot.position.set(px,-0.11,0); lbGroup.add(hBot);
    }

    // ── НАКЛЕЙКА С ИКОНКОЙ КРИСТАЛЛА ─────────────────────────────────────
    const stickerCv=document.createElement('canvas'); stickerCv.width=64; stickerCv.height=64;
    const stickerCtx=stickerCv.getContext('2d');
    stickerCtx.fillStyle='#cc2200'; stickerCtx.fillRect(0,0,64,64);
    stickerCtx.strokeStyle='#ffaa00'; stickerCtx.lineWidth=3; stickerCtx.strokeRect(3,3,58,58);
    stickerCtx.fillStyle='#ffdd00'; stickerCtx.font='bold 38px Arial'; stickerCtx.textAlign='center'; stickerCtx.textBaseline='middle';
    stickerCtx.fillText('★',32,32);
    const stickerTex=new THREE.CanvasTexture(stickerCv);
    const sticker=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.7),new THREE.MeshBasicMaterial({map:stickerTex,transparent:true}));
    sticker.position.set(0,0.05,1.46); lbGroup.add(sticker);

    sceneLootbox.add(lbGroup);
 
    // События
    window.addEventListener('resize', ()=>{
        renderer.setSize(window.innerWidth,window.innerHeight);
        camera.aspect=window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
    });
 
    let isDragging=false, prevMX=0;
    document.getElementById('garage-drag-area').addEventListener('mousedown', e=>{ isDragging=true; prevMX=e.clientX; });
    window.addEventListener('mouseup',()=>isDragging=false);
 
    // Pointer Lock — захват мыши в битве для поворота башни
    const canvas=document.getElementById('mainCanvas');
    canvas.addEventListener('click', ()=>{
        if(sceneType==='battle') canvas.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', ()=>{
        if(document.pointerLockElement===canvas) {
            canvas.style.cursor='none';
        } else {
            canvas.style.cursor='default';
        }
    });
    // Мышь — поворот башни (работает через movementX — точно, без накопления)
    window.addEventListener('mousemove', e=>{
        if(sceneType==='battle'&&document.pointerLockElement===canvas) {
            if(myId&&tanks[myId]&&!tanks[myId].dead) {
                const gData=DB.guns[tanks[myId].gun||saveData.equipped.gun];
                tanks[myId].tRot-=e.movementX*0.003*(gData.rotSpeed||2)/2;
            }
        }
        // Гараж — вращение мышью
        if(isDragging&&sceneType==='garage') {
            garageTankRot+=(e.clientX-prevMX)*0.012; prevMX=e.clientX;
        }
    });
    // Выход из Pointer Lock по Escape
    document.addEventListener('keydown', e=>{
        if(e.code==='Escape'&&document.pointerLockElement===canvas) document.exitPointerLock();
    });

    window.addEventListener('keydown', e=>{
        keys[e.code]=true;
        if(e.code==='Tab') { e.preventDefault(); if(sceneType==='battle') document.getElementById('scoreboard').style.display='block'; }
        if(e.code==='KeyF'&&sceneType==='battle'&&myId&&tanks[myId]) {
            // Снайперский режим для рельсы
            const showSniper = tanks[myId].gun==='railgun';
            document.getElementById('sniper-overlay').style.display=showSniper?'block':'none';
        }
    });
    window.addEventListener('keyup', e=>{
        keys[e.code]=false;
        if(e.code==='Tab') { document.getElementById('scoreboard').style.display='none'; }
        if(e.code==='KeyF') document.getElementById('sniper-overlay').style.display='none';
    });
    window.addEventListener('keypress', e=>{
        if(sceneType==='battle'&&myId&&tanks[myId]&&!tanks[myId].dead) {
            if(e.code==='Digit1') useSupply('repair');
            if(e.code==='Digit2') useSupply('armor');
            if(e.code==='Digit3') useSupply('damage');
            if(e.code==='Digit4') useSupply('speed');
            if(e.code==='Digit5') useSupply('mine');
        }
    });
 
    updateGarageTank(saveData.equipped.hull,saveData.equipped.gun,saveData.equipped.paint);
    requestAnimationFrame(renderLoop);
    setTimeout(generate3DIcons, 300);
}
 
// ==========================================
// ИКОНКИ ДЛЯ ГАРАЖА
// ==========================================
function generate3DIcons() {
    // Используем основной renderer — без второго WebGL контекста
    const W=256, H=256;
    renderer.setSize(W,H);
    renderer.preserveDrawingBuffer=true;

    const is=new THREE.Scene();
    is.background=new THREE.Color(0x1a1a1a);
    is.add(new THREE.AmbientLight(0xffffff,0.9));
    const iDir=new THREE.DirectionalLight(0xffffee,1.2); iDir.position.set(5,8,5); is.add(iDir);
    const iCam=new THREE.PerspectiveCamera(35,1,0.1,100);
    iCam.position.set(4,3,4); iCam.lookAt(0,0.5,0);

    function snap() {
        renderer.render(is,iCam);
        return renderer.domElement.toDataURL();
    }

    for(let k in DB.hulls) {
        const obj=buildTankMesh(k,'smoky','green');
        obj.turret.visible=false; is.add(obj.mesh);
        DB.hulls[k].img=snap(); is.remove(obj.mesh);
    }
    for(let k in DB.guns) {
        const obj=buildTankMesh('hunter',k,'green');
        obj.body.visible=false; obj.mesh.position.y=-0.5; is.add(obj.mesh);
        DB.guns[k].img=snap(); is.remove(obj.mesh);
    }
    for(let k in DB.paints) {
        const hex='#'+DB.paints[k].hex.toString(16).padStart(6,'0');
        const sph=new THREE.Mesh(new THREE.SphereGeometry(1.2,16,16),new THREE.MeshLambertMaterial({map:makeCamoTexture(hex)}));
        sph.position.y=0.5; is.add(sph);
        DB.paints[k].img=snap(); is.remove(sph);
    }
    // Припасы — простой 2D canvas, 3D не нужен
    const supColors={repair:'#ff3333',armor:'#3377ff',damage:'#ffaa00',speed:'#00ccff',mine:'#888888'};
    for(let k in DB.supplies) {
        const sc=document.createElement('canvas'); sc.width=128; sc.height=128;
        const ctx=sc.getContext('2d');
        ctx.fillStyle='#2a2a2a'; ctx.fillRect(0,0,128,128);
        ctx.fillStyle=supColors[k]; ctx.fillRect(16,16,96,96);
        ctx.strokeStyle='#000'; ctx.lineWidth=4; ctx.strokeRect(16,16,96,96);
        DB.supplies[k].img=sc.toDataURL();
    }

    // Возвращаем нормальный размер renderer
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.preserveDrawingBuffer=false;
    setGarageTab(gCat,null,true);
}
 
// ==========================================
// ПОСТРОЕНИЕ 3D МОДЕЛЕЙ ТАНКОВ — ТО 2012
// ==========================================
function buildTankMesh(hId,gId,pId) {
    const g=new THREE.Group();
    const hc=DB.hulls[hId].model;
    const pData=DB.paints[pId]||DB.paints['green'];
    const hexColor='#'+pData.hex.toString(16).padStart(6,'0');
    const camoTex=makeCamoTexture(hexColor);
    const gunMetalTex=makeGunMetalTexture();
    // Материалы — Phong даёт металлический блик, важный для стиля ТО
    const bodyMat   = new THREE.MeshPhongMaterial({map:camoTex,shininess:18,specular:0x333333});
    const trackMat  = new THREE.MeshPhongMaterial({color:0x0c0c0c,shininess:30,specular:0x222222});
    const darkMat   = new THREE.MeshPhongMaterial({color:0x1c1c1c,shininess:22,specular:0x2a2a2a});
    const metalMat  = new THREE.MeshPhongMaterial({map:gunMetalTex,color:0x6a6a6a,shininess:60,specular:0x555555});
    const lightMat  = new THREE.MeshPhongMaterial({color:0x8a8a8a,shininess:50,specular:0x666666});
    const bodyGroup=new THREE.Group();
 
    // ── Z-FIGHTING FIX: helper ─────────────────────────────────────────────
    // Любая деталь, лежащая поверх другой плоскости, должна иметь polygonOffset
    function noZFight(mat, units=2) {
        mat.polygonOffset=true; mat.polygonOffsetFactor=1; mat.polygonOffsetUnits=units; return mat;
    }
    const darkMatNZ  = noZFight(new THREE.MeshPhongMaterial({color:0x1c1c1c,shininess:22,specular:0x2a2a2a}));
    const metalMatNZ = noZFight(new THREE.MeshPhongMaterial({map:gunMetalTex,color:0x6a6a6a,shininess:60,specular:0x555555}));
    const lightMatNZ = noZFight(new THREE.MeshPhongMaterial({color:0x8a8a8a,shininess:50,specular:0x666666}));
    const bodyMatNZ  = noZFight(new THREE.MeshPhongMaterial({map:camoTex,shininess:18,specular:0x333333}));

    if(hc.type==='wasp') {
        // ── ОСА М0 — низкий обтекаемый скоростной корпус (Викинг-стиль) ──
        // Основание-платформа (самая нижняя широкая часть)
        const base=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.90,hc.h*0.18,hc.l*0.92),bodyMat);
        base.position.set(0,hc.h*0.12,0); bodyGroup.add(base);

        // Центральный корпус — приземистый, вытянутый
        const main=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.74,hc.h*0.46,hc.l*0.72),bodyMat);
        main.position.set(0,hc.h*0.43,hc.l*0.04); bodyGroup.add(main);

        // Передний клин — резко скошенная носовая плита (агрессивный силуэт)
        const noseSlope=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.74,hc.h*0.40,hc.l*0.30),bodyMat);
        noseSlope.position.set(0,hc.h*0.30,-hc.l*0.48); noseSlope.rotation.x=-0.70; bodyGroup.add(noseSlope);

        // Нижний клин носа (бульдозерный скос)
        const noseLow=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.74,hc.h*0.14,hc.l*0.18),bodyMat);
        noseLow.position.set(0,hc.h*0.09,-hc.l*0.54); noseLow.rotation.x=-0.30; bodyGroup.add(noseLow);

        // Корма — пологий скос назад
        const rearSlope=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.74,hc.h*0.28,hc.l*0.20),bodyMat);
        rearSlope.position.set(0,hc.h*0.34,hc.l*0.44); rearSlope.rotation.x=0.42; bodyGroup.add(rearSlope);

        // Верхняя плоская крышка корпуса (со скосом у носа)
        const topMain=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.70,0.07,hc.l*0.60),bodyMatNZ);
        topMain.position.set(0,hc.h*0.88,hc.l*0.02); bodyGroup.add(topMain);

        // Центральный выступающий гребень/горб (характерная деталь осы)
        const hump=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.36,hc.h*0.18,hc.l*0.42),bodyMat);
        hump.position.set(0,hc.h*0.72,hc.l*0.04); bodyGroup.add(hump);

        // Верхняя грань горба — тёмная панель
        const humpTop=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.34,0.06,hc.l*0.40),darkMatNZ);
        humpTop.position.set(0,hc.h*0.82,hc.l*0.04); bodyGroup.add(humpTop);

        // Носовая бронепластина — выступающий бампер
        const nosePlate=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.76,hc.h*0.28,0.10),metalMat);
        nosePlate.position.set(0,hc.h*0.32,-hc.l*0.63); bodyGroup.add(nosePlate);

        // Боковые угловые ребра жёсткости
        for(let sx of [-1,1]) {
            const sideRib=new THREE.Mesh(new THREE.BoxGeometry(0.09,hc.h*0.44,hc.l*0.58),metalMat);
            sideRib.position.set(sx*hc.w*0.40,hc.h*0.40,hc.l*0.04); bodyGroup.add(sideRib);

            // Угловой скос на боку (сглаживание между боковиной и верхом)
            const sideBevel=new THREE.Mesh(new THREE.BoxGeometry(0.12,hc.h*0.16,hc.l*0.50),metalMatNZ);
            sideBevel.position.set(sx*hc.w*0.39,hc.h*0.64,hc.l*0.04); sideBevel.rotation.z=sx*0.55; bodyGroup.add(sideBevel);

            // Боковые вентиляционные панели (3 прорези)
            for(let vz of [-hc.l*0.14,0,hc.l*0.14]) {
                const vent=new THREE.Mesh(new THREE.BoxGeometry(0.06,hc.h*0.18,0.20),new THREE.MeshLambertMaterial({color:0x111111}));
                vent.position.set(sx*hc.w*0.42,hc.h*0.35,vz); bodyGroup.add(vent);
            }

            // Крыло над гусеницей
            const fender=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.07,hc.l*0.78),darkMatNZ);
            fender.position.set(sx*(hc.w*0.44+0.14),hc.h*0.62,0); bodyGroup.add(fender);

            // Передний мыс крыла (скошен)
            const fenderNose=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.07,hc.l*0.14),darkMatNZ);
            fenderNose.position.set(sx*(hc.w*0.44+0.14),hc.h*0.55,-hc.l*0.45); fenderNose.rotation.x=-0.45; bodyGroup.add(fenderNose);
        }

        // Фары — прямоугольные (2 спереди)
        for(let fx of [-hc.w*0.22,hc.w*0.22]) {
            const headlight=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.10,0.06),new THREE.MeshBasicMaterial({color:0xffffaa}));
            headlight.position.set(fx,hc.h*0.30,-hc.l*0.66); bodyGroup.add(headlight);
            const hlRim=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.14,0.05),darkMat);
            hlRim.position.set(fx,hc.h*0.30,-hc.l*0.655); bodyGroup.add(hlRim);
        }

        // Выхлопные трубы (2 сзади)
        for(let ex of [-hc.w*0.16,hc.w*0.16]) {
            const exhaust=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,0.30,8),darkMat);
            exhaust.rotation.x=Math.PI/2; exhaust.position.set(ex,hc.h*0.52,hc.l*0.53); bodyGroup.add(exhaust);
            const exhaustTip=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.06,0.08,8),metalMat);
            exhaustTip.rotation.x=Math.PI/2; exhaustTip.position.set(ex,hc.h*0.52,hc.l*0.57); bodyGroup.add(exhaustTip);
        }

        // Задний люк (прямоугольная панель)
        const rearHatch=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.38,hc.h*0.28,0.07),darkMatNZ);
        rearHatch.position.set(0,hc.h*0.42,hc.l*0.49); bodyGroup.add(rearHatch);

        // Болты по периметру люка
        for(let [bx,by] of [[-hc.w*0.15,hc.h*0.30],[hc.w*0.15,hc.h*0.30],[-hc.w*0.15,hc.h*0.52],[hc.w*0.15,hc.h*0.52]]) {
            const bolt=new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.022,0.08,6),metalMat);
            bolt.rotation.x=Math.PI/2; bolt.position.set(bx,by,hc.l*0.504); bodyGroup.add(bolt);
        }

    } else if(hc.type==='titan') {
        // ── ТИТАН М0 — тяжёлая крепость с массивной бронёй ──
        // Нижнее широкое основание (подножие)
        const baseBot=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.88,hc.h*0.14,hc.l*0.96),bodyMat);
        baseBot.position.set(0,hc.h*0.10,0); bodyGroup.add(baseBot);

        // Главный бронекорпус — высокий, прямоугольный, монолитный
        const main=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.72,hc.h*0.72,hc.l*0.84),bodyMat);
        main.position.set(0,hc.h*0.60,hc.l*0.02); bodyGroup.add(main);

        // Верхняя броня — плоская тяжёлая плита
        const topArmor=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.70,hc.h*0.08,hc.l*0.82),darkMatNZ);
        topArmor.position.set(0,hc.h*0.99,hc.l*0.02); bodyGroup.add(topArmor);

        // Передняя лобовая плита (вертикальная, мощная)
        const frontPlate=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.72,hc.h*0.72,0.14),bodyMat);
        frontPlate.position.set(0,hc.h*0.60,-hc.l*0.44); bodyGroup.add(frontPlate);

        // Верхний скос лобовой плиты
        const frontBevel=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.72,hc.h*0.20,hc.l*0.10),bodyMat);
        frontBevel.position.set(0,hc.h*0.90,-hc.l*0.46); frontBevel.rotation.x=0.55; bodyGroup.add(frontBevel);

        // Нижний глацис (скошенная нижняя лобовая деталь)
        const glacis=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.72,hc.h*0.22,hc.l*0.16),bodyMat);
        glacis.position.set(0,hc.h*0.22,-hc.l*0.48); glacis.rotation.x=-0.35; bodyGroup.add(glacis);

        // Корма — вертикальная плита
        const rearPlate=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.72,hc.h*0.68,0.12),bodyMat);
        rearPlate.position.set(0,hc.h*0.58,hc.l*0.45); bodyGroup.add(rearPlate);

        // Боковые навесные бронеэкраны — толстые, с рёбрами
        for(let sx of [-1,1]) {
            const skirt=new THREE.Mesh(new THREE.BoxGeometry(0.22,hc.h*0.68,hc.l*0.98),bodyMat);
            skirt.position.set(sx*(hc.w*0.47),hc.h*0.52,0); bodyGroup.add(skirt);

            // Вертикальные рёбра жёсткости на экране (3 штуки)
            for(let rz of [-hc.l*0.28,-hc.l*0.02,hc.l*0.24]) {
                const rib=new THREE.Mesh(new THREE.BoxGeometry(0.30,hc.h*0.68,0.10),metalMat);
                rib.position.set(sx*(hc.w*0.47),hc.h*0.52,rz); bodyGroup.add(rib);
            }

            // Горизонтальные бронепояса (2 полосы)
            for(let ry of [hc.h*0.35,hc.h*0.70]) {
                const belt=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.10,hc.l*0.96),metalMatNZ);
                belt.position.set(sx*(hc.w*0.47),ry,0); bodyGroup.add(belt);
            }

            // Крыло над гусеницей — широкое, угловатое
            const fender=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.09,hc.l*0.88),darkMatNZ);
            fender.position.set(sx*(hc.w*0.52+0.18),hc.h*0.86,0); bodyGroup.add(fender);

            // Передний скос крыла
            const fNose=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.09,hc.l*0.10),darkMatNZ);
            fNose.position.set(sx*(hc.w*0.52+0.18),hc.h*0.78,-hc.l*0.47); fNose.rotation.x=-0.50; bodyGroup.add(fNose);
        }

        // Центральная полоса на крыше (характерная деталь Титана)
        const centerStripe=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.30,0.10,hc.l*0.70),metalMatNZ);
        centerStripe.position.set(0,hc.h*1.06,0); bodyGroup.add(centerStripe);

        // Боковые металлические полосы на крыше
        for(let sx of [-hc.w*0.24,hc.w*0.24]) {
            const sStripe=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.10,hc.l*0.72),metalMatNZ);
            sStripe.position.set(sx,hc.h*1.06,0); bodyGroup.add(sStripe);
        }

        // Передние фары (квадратные, пара)
        for(let fx of [-hc.w*0.24,hc.w*0.24]) {
            const hl=new THREE.Mesh(new THREE.BoxGeometry(0.20,0.16,0.08),new THREE.MeshBasicMaterial({color:0xffffaa}));
            hl.position.set(fx,hc.h*0.55,-hc.l*0.47); bodyGroup.add(hl);
            const hlRim=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.21,0.07),darkMat);
            hlRim.position.set(fx,hc.h*0.55,-hc.l*0.465); bodyGroup.add(hlRim);
        }

        // Буксировочные крюки (спереди)
        for(let fx of [-hc.w*0.28,hc.w*0.28]) {
            const hook=new THREE.Mesh(new THREE.BoxGeometry(0.10,0.20,0.12),metalMat);
            hook.position.set(fx,hc.h*0.15,-hc.l*0.48); bodyGroup.add(hook);
        }

        // Задние выхлопы — два толстых патрубка
        for(let ex of [-hc.w*0.18,hc.w*0.18]) {
            const exhaust=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.11,0.50,10),darkMat);
            exhaust.rotation.x=Math.PI/2; exhaust.position.set(ex,hc.h*0.72,hc.l*0.50); bodyGroup.add(exhaust);
            const exTip=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,0.10,10),metalMat);
            exTip.rotation.x=Math.PI/2; exTip.position.set(ex,hc.h*0.72,hc.l*0.555); bodyGroup.add(exTip);
        }

        // Антенна
        const antenna=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.9,5),darkMat);
        antenna.position.set(hc.w*0.28,hc.h*1.50,-hc.l*0.14); bodyGroup.add(antenna);
        const antennaBase=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.12,8),metalMat);
        antennaBase.position.set(hc.w*0.28,hc.h*1.10,-hc.l*0.14); bodyGroup.add(antennaBase);

        // Болты по углам лобовой плиты
        for(let [bx,by] of [[-hc.w*0.30,hc.h*0.82],[hc.w*0.30,hc.h*0.82],[-hc.w*0.30,hc.h*0.36],[hc.w*0.30,hc.h*0.36]]) {
            const bolt=new THREE.Mesh(new THREE.CylinderGeometry(0.030,0.030,0.10,6),metalMat);
            bolt.rotation.x=Math.PI/2; bolt.position.set(bx,by,-hc.l*0.449); bodyGroup.add(bolt);
        }

    } else {
        // ── ХАНТЕР М0 — сбалансированный средний корпус ──
        // Нижнее основание-платформа
        const base=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.86,hc.h*0.14,hc.l*0.90),bodyMat);
        base.position.set(0,hc.h*0.10,0); bodyGroup.add(base);

        // Главный прямоугольный корпус
        const main=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.74,hc.h*0.62,hc.l*0.68),bodyMat);
        main.position.set(0,hc.h*0.53,hc.l*0.04); bodyGroup.add(main);

        // Верхняя плита — чуть темнее
        const topPlate=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.72,0.07,hc.l*0.66),bodyMatNZ);
        topPlate.position.set(0,hc.h*0.99,hc.l*0.04); bodyGroup.add(topPlate);

        // Передняя скошенная лобовая плита (характерный угол Хантера)
        const frontSlope=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.74,hc.h*0.48,hc.l*0.26),bodyMat);
        frontSlope.position.set(0,hc.h*0.44,-hc.l*0.42); frontSlope.rotation.x=-0.50; bodyGroup.add(frontSlope);

        // Нижний глацис
        const lowGlacis=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.74,hc.h*0.14,hc.l*0.14),bodyMat);
        lowGlacis.position.set(0,hc.h*0.14,-hc.l*0.50); lowGlacis.rotation.x=-0.22; bodyGroup.add(lowGlacis);

        // Корма — пологий скос
        const rearSlope=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.74,hc.h*0.38,hc.l*0.18),bodyMat);
        rearSlope.position.set(0,hc.h*0.44,hc.l*0.42); rearSlope.rotation.x=0.38; bodyGroup.add(rearSlope);

        // Верхняя задняя возвышенность (моторный отсек)
        const engineDeck=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.60,hc.h*0.16,hc.l*0.28),bodyMat);
        engineDeck.position.set(0,hc.h*0.94,hc.l*0.28); bodyGroup.add(engineDeck);

        // Крышка моторного отсека
        const engineTop=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.58,0.07,hc.l*0.26),darkMatNZ);
        engineTop.position.set(0,hc.h*1.03,hc.l*0.28); bodyGroup.add(engineTop);

        // Решётка радиатора — вентиляционные жалюзи на корме
        for(let rv=0;rv<4;rv++) {
            const vane=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.44,0.04,hc.l*0.04),new THREE.MeshLambertMaterial({color:0x141414}));
            vane.position.set(0,hc.h*0.68+rv*0.11,hc.l*0.49); bodyGroup.add(vane);
        }

        // Боковые рёбра жёсткости
        for(let sx of [-1,1]) {
            const rib=new THREE.Mesh(new THREE.BoxGeometry(0.10,hc.h*0.54,hc.l*0.62),metalMat);
            rib.position.set(sx*hc.w*0.40,hc.h*0.50,hc.l*0.04); bodyGroup.add(rib);

            // Верхний скос ребра
            const ribBevel=new THREE.Mesh(new THREE.BoxGeometry(0.14,hc.h*0.14,hc.l*0.56),metalMatNZ);
            ribBevel.position.set(sx*hc.w*0.40,hc.h*0.78,hc.l*0.04); ribBevel.rotation.z=sx*0.52; bodyGroup.add(ribBevel);

            // Боковые панели-секции (2 панели, разделённые зазором)
            for(let [pz,pw] of [[hc.l*0.18,hc.l*0.40],[-hc.l*0.20,hc.l*0.24]]) {
                const sPanel=new THREE.Mesh(new THREE.BoxGeometry(0.08,hc.h*0.40,pw),new THREE.MeshLambertMaterial({color:0x2a2a2a}));
                sPanel.position.set(sx*hc.w*0.395,hc.h*0.45,pz); bodyGroup.add(sPanel);
            }

            // Крыло над гусеницей
            const fender=new THREE.Mesh(new THREE.BoxGeometry(0.30,0.07,hc.l*0.80),darkMatNZ);
            fender.position.set(sx*(hc.w*0.46+0.14),hc.h*0.72,0); bodyGroup.add(fender);
            const fNose=new THREE.Mesh(new THREE.BoxGeometry(0.30,0.07,hc.l*0.12),darkMatNZ);
            fNose.position.set(sx*(hc.w*0.46+0.14),hc.h*0.65,-hc.l*0.44); fNose.rotation.x=-0.48; bodyGroup.add(fNose);
        }

        // Передние фары (прямоугольные)
        for(let fx of [-hc.w*0.22,hc.w*0.22]) {
            const hl=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.12,0.07),new THREE.MeshBasicMaterial({color:0xffffaa}));
            hl.position.set(fx,hc.h*0.46,-hc.l*0.60); bodyGroup.add(hl);
            const hlRim=new THREE.Mesh(new THREE.BoxGeometry(0.20,0.16,0.06),darkMat);
            hlRim.position.set(fx,hc.h*0.46,-hc.l*0.595); bodyGroup.add(hlRim);
        }

        // Выхлопные трубы
        for(let ex of [-hc.w*0.16,hc.w*0.16]) {
            const exhaust=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,0.35,8),darkMat);
            exhaust.rotation.x=Math.PI/2; exhaust.position.set(ex,hc.h*0.56,hc.l*0.55); bodyGroup.add(exhaust);
            const exTip=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.07,0.08,8),metalMat);
            exTip.rotation.x=Math.PI/2; exTip.position.set(ex,hc.h*0.56,hc.l*0.59); bodyGroup.add(exTip);
        }

        // Задний буксировочный крюк
        const tow=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.20,0.12,0.14),metalMat);
        tow.position.set(0,hc.h*0.20,hc.l*0.47); bodyGroup.add(tow);

        // Болты на лобовой плите
        for(let [bx,by] of [[-hc.w*0.28,hc.h*0.72],[hc.w*0.28,hc.h*0.72],[-hc.w*0.28,hc.h*0.36],[hc.w*0.28,hc.h*0.36]]) {
            const bolt=new THREE.Mesh(new THREE.CylinderGeometry(0.026,0.026,0.08,6),metalMat);
            bolt.rotation.x=Math.PI/2; bolt.position.set(bx,by,-hc.l*0.579); bodyGroup.add(bolt);
        }

        // Центральный верхний люк башни (кольцо посадочного места)
        const hatchRing=new THREE.Mesh(new THREE.CylinderGeometry(hc.w*0.20,hc.w*0.23,0.08,14),metalMatNZ);
        hatchRing.position.set(0,hc.h*0.90,hc.l*0.04); bodyGroup.add(hatchRing);
    }
 
    // ======= ГУСЕНИЦЫ =======
    const trackW={wasp:0.24,hunter:0.28,titan:0.34};
    const wRad={wasp:0.14,hunter:0.17,titan:0.21};
    const wCount={wasp:4,hunter:5,titan:6};
    for(let side of [-1,1]) {
        const tw=trackW[hc.type];
        const tx=hc.type==='titan'?side*(hc.w/2-0.02):side*(hc.w/2+0.04);
        // Гусеничная лента
        const track=new THREE.Mesh(new THREE.BoxGeometry(tw,hc.h*0.52,hc.l+0.12),trackMat);
        track.position.set(tx,hc.h*0.32,0); bodyGroup.add(track);
        // Звенья — polygonOffset чтобы не мигали поверх ленты
        const linkMat=new THREE.MeshBasicMaterial({color:0x090909,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:2});
        for(let z=-hc.l*0.44;z<=hc.l*0.44;z+=0.14) {
            const link=new THREE.Mesh(new THREE.BoxGeometry(tw+0.03,0.042,0.075),linkMat);
            link.position.set(tx,hc.h*0.07,z); bodyGroup.add(link);
        }
        // Крыло
        const fenderW=hc.type==='titan'?0.38:0.28;
        const fenderX=hc.type==='titan'?side*(hc.w*0.52+0.18):side*(hc.w*0.46+0.14);
        const fenderY=hc.type==='titan'?hc.h*0.86:hc.h*0.68;
        const fender=new THREE.Mesh(new THREE.BoxGeometry(fenderW,0.07,hc.l*0.82),darkMat);
        fender.position.set(fenderX,fenderY,0); bodyGroup.add(fender);
        const fNose=new THREE.Mesh(new THREE.BoxGeometry(fenderW,0.07,hc.l*0.10),darkMat);
        fNose.position.set(fenderX,fenderY-hc.h*0.07,-hc.l*0.45); fNose.rotation.x=-0.48; bodyGroup.add(fNose);
        // Катки
        for(let w=0;w<wCount[hc.type];w++) {
            const zp=-hc.l*0.38+(hc.l*0.76/(wCount[hc.type]-1))*w;
            const wheel=new THREE.Mesh(new THREE.CylinderGeometry(wRad[hc.type],wRad[hc.type],tw*0.8,8),darkMat);
            wheel.rotation.z=Math.PI/2; wheel.position.set(tx,hc.h*0.2,zp); bodyGroup.add(wheel);
            const discMat=new THREE.MeshLambertMaterial({color:0x4a4a4a,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
            const disc=new THREE.Mesh(new THREE.CylinderGeometry(wRad[hc.type]*0.52,wRad[hc.type]*0.52,tw*0.83,8),discMat);
            disc.rotation.z=Math.PI/2; disc.position.set(tx,hc.h*0.2,zp); bodyGroup.add(disc);
        }
        const drive=new THREE.Mesh(new THREE.CylinderGeometry(wRad[hc.type]*1.12,wRad[hc.type]*1.12,tw*0.65,10),metalMat);
        drive.rotation.z=Math.PI/2; drive.position.set(tx,hc.h*0.3,hc.l*0.48); bodyGroup.add(drive);
        const idler=new THREE.Mesh(new THREE.CylinderGeometry(wRad[hc.type]*1.04,wRad[hc.type]*1.04,tw*0.65,10),metalMat);
        idler.rotation.z=Math.PI/2; idler.position.set(tx,hc.h*0.26,-hc.l*0.48); bodyGroup.add(idler);
    }
    g.add(bodyGroup);
 
    // ======= БАШНЯ + ПУШКИ =======
    const turret=new THREE.Group();
    turret.position.set(0,hc.h+0.08,-hc.l*0.04);
    const tBase=new THREE.Mesh(new THREE.CylinderGeometry(hc.w*0.32,hc.w*0.38,0.15,16),metalMat);
    turret.add(tBase);
    const barrels=new THREE.Group();
    const muzzlePoint=new THREE.Object3D();
 
    if(gId==='smoky') {
        // ── СМОКИ М0 — квадратная башня с одним длинным стволом ──
        // Основа башни — прямоугольный бронекорпус
        const tBase2=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.54,0.12,hc.w*0.58),metalMat);
        tBase2.position.y=0.08; turret.add(tBase2);
        // Главный корпус башни — почти кубической формы
        const tMain=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.52,0.46,hc.w*0.56),bodyMat);
        tMain.position.y=0.32; turret.add(tMain);
        // Фронтальная бронеплита (чуть выступает)
        const frontPlate=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.52,0.42,0.1),new THREE.MeshLambertMaterial({color:0x2a2a2a}));
        frontPlate.position.set(0,0.30,-hc.w*0.28+0.05); turret.add(frontPlate);
        // Крышка башни — плоская тёмная панель
        const tRoof=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.50,0.07,hc.w*0.54),darkMat);
        tRoof.position.y=0.595; turret.add(tRoof);
        // Выступающий наблюдательный купол (сверху, немного сбоку) — фирменная деталь Смоки
        const hatch=new THREE.Mesh(new THREE.CylinderGeometry(0.125,0.155,0.09,10),metalMat);
        hatch.position.set(hc.w*0.12,0.62,0.05); turret.add(hatch);
        const hatchRim=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.13,0.04,10),darkMat);
        hatchRim.position.set(hc.w*0.12,0.67,0.05); turret.add(hatchRim);
        // Болты по углам башни
        for(let [bx,bz] of [[-hc.w*0.22,-hc.w*0.24],[hc.w*0.22,-hc.w*0.24],[-hc.w*0.22,hc.w*0.24],[hc.w*0.22,hc.w*0.24]]) {
            const bolt=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.07,6),lightMat);
            bolt.position.set(bx,0.6,bz); turret.add(bolt);
        }
        // Защитный кожух орудия — маска пушки
        const mantlet=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.36,0.22),metalMat);
        mantlet.position.set(0,0.30,-hc.w*0.27); barrels.add(mantlet);
        // Скосы маски
        const mantletTop=new THREE.Mesh(new THREE.BoxGeometry(0.36,0.08,0.18),darkMat);
        mantletTop.position.set(0,0.49,-hc.w*0.27); barrels.add(mantletTop);
        // Ствол — конусообразный, слегка сужается к дульному тормозу
        const barrelBack=new THREE.Mesh(new THREE.CylinderGeometry(0.105,0.12,0.7,12),darkMat);
        barrelBack.rotation.x=Math.PI/2; barrelBack.position.set(0,0.30,-hc.w*0.27-0.35); barrels.add(barrelBack);
        const barrelMid=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.105,0.9,12),darkMat);
        barrelMid.rotation.x=Math.PI/2; barrelMid.position.set(0,0.30,-hc.w*0.27-1.15); barrels.add(barrelMid);
        const barrelFront=new THREE.Mesh(new THREE.CylinderGeometry(0.082,0.09,0.65,12),darkMat);
        barrelFront.rotation.x=Math.PI/2; barrelFront.position.set(0,0.30,-hc.w*0.27-1.875); barrels.add(barrelFront);
        // Кольцо-усилитель посередине ствола
        const midRing=new THREE.Mesh(new THREE.CylinderGeometry(0.115,0.115,0.12,12),metalMat);
        midRing.rotation.x=Math.PI/2; midRing.position.set(0,0.30,-hc.w*0.27-0.88); barrels.add(midRing);
        // Дульный тормоз — перфорированный цилиндр
        const brake=new THREE.Mesh(new THREE.CylinderGeometry(0.155,0.145,0.30,12),metalMat);
        brake.rotation.x=Math.PI/2; brake.position.set(0,0.30,-hc.w*0.27-2.36); barrels.add(brake);
        // Прорези дульного тормоза (4 щели)
        for(let [sy,sz] of [[0.055,0],[-0.055,0],[0,0.055],[0,-0.055]]) {
            const slit=new THREE.Mesh(new THREE.BoxGeometry(sy===0?0.31:0.08,sy===0?0.08:0.31,0.06),new THREE.MeshBasicMaterial({color:0x000000}));
            slit.position.set(0,0.30+sy,-hc.w*0.27-2.36+sz*0.5); barrels.add(slit);
        }
        // Дульный срез
        const muzzleCap=new THREE.Mesh(new THREE.CylinderGeometry(0.072,0.08,0.07,10),darkMat);
        muzzleCap.rotation.x=Math.PI/2; muzzleCap.position.set(0,0.30,-hc.w*0.27-2.54); barrels.add(muzzleCap);
        muzzlePoint.position.set(0,0.30,-hc.w*0.27-2.60);

    } else if(gId==='twins') {
        // ── ТВИНС М0 — широкая приземистая башня с ДВУМЯ стволами ──
        // Широкое основание башни
        const tBase2=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.65,0.10,hc.w*0.55),metalMat);
        tBase2.position.y=0.08; turret.add(tBase2);
        // Основной корпус — широкий и плоский
        const tMain=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.63,0.38,hc.w*0.50),bodyMat);
        tMain.position.y=0.27; turret.add(tMain);
        // Задняя высокая часть башни
        const tBack=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.63,0.52,hc.w*0.20),bodyMat);
        tBack.position.set(0,0.30,hc.w*0.155); turret.add(tBack);
        // Крышка
        const tRoof=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.61,0.07,hc.w*0.48),darkMat);
        tRoof.position.y=0.505; turret.add(tRoof);
        // Центральный гребень (характерная деталь Твинс)
        const ridge=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.18,0.10,hc.w*0.44),darkMat);
        ridge.position.set(0,0.555,0); turret.add(ridge);
        // Вентиляционные решётки по бокам
        for(let sx of [-1,1]) {
            const vent=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.18,hc.w*0.28),new THREE.MeshLambertMaterial({color:0x1a1a1a}));
            vent.position.set(sx*hc.w*0.33,0.30,0); turret.add(vent);
            for(let vz=-hc.w*0.10;vz<=hc.w*0.10;vz+=hc.w*0.07) {
                const vSlot=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.05,0.04),new THREE.MeshBasicMaterial({color:0x000000}));
                vSlot.position.set(sx*hc.w*0.34,0.30,vz); turret.add(vSlot);
            }
        }
        // Пара стволов (характерные широко расставленные)
        for(let offset of [-0.22,0.22]) {
            // Основание ствола — прямоугольный кожух
            const bCase=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.15,0.30),metalMat);
            bCase.position.set(offset,0.28,-hc.w*0.26); barrels.add(bCase);
            // Ствол — задняя часть толще
            const bBack=new THREE.Mesh(new THREE.CylinderGeometry(0.10,0.115,0.55,10),darkMat);
            bBack.rotation.x=Math.PI/2; bBack.position.set(offset,0.28,-hc.w*0.26-0.275); barrels.add(bBack);
            // Ствол — передняя часть
            const bFront=new THREE.Mesh(new THREE.CylinderGeometry(0.088,0.10,0.72,10),darkMat);
            bFront.rotation.x=Math.PI/2; bFront.position.set(offset,0.28,-hc.w*0.26-0.91); barrels.add(bFront);
            // Кольцо по центру
            const bRing=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.09,10),metalMat);
            bRing.rotation.x=Math.PI/2; bRing.position.set(offset,0.28,-hc.w*0.26-0.48); barrels.add(bRing);
            // Дульный срез с углублением
            const bMuz=new THREE.Mesh(new THREE.CylinderGeometry(0.095,0.088,0.18,10),new THREE.MeshLambertMaterial({color:0x1a1a1a}));
            bMuz.rotation.x=Math.PI/2; bMuz.position.set(offset,0.28,-hc.w*0.26-1.38); barrels.add(bMuz);
            // Тёмное жерло
            const bore=new THREE.Mesh(new THREE.CylinderGeometry(0.052,0.052,0.06,8),new THREE.MeshBasicMaterial({color:0x000000}));
            bore.rotation.x=Math.PI/2; bore.position.set(offset,0.28,-hc.w*0.26-1.49); barrels.add(bore);
        }
        // Перемычка между стволами
        const bridge=new THREE.Mesh(new THREE.BoxGeometry(0.50,0.10,0.22),metalMat);
        bridge.position.set(0,0.28,-hc.w*0.26-0.12); barrels.add(bridge);
        muzzlePoint.position.set(0,0.28,-hc.w*0.26-1.55);

    } else if(gId==='railgun') {
        // ── РЕЛЬСА М0 — длинная обтекаемая башня с массивной пушкой ──
        // Широкое плоское основание
        const tBase2=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.55,0.10,hc.w*0.78),metalMat);
        tBase2.position.y=0.08; turret.add(tBase2);
        // Корпус башни — вытянутый вперёд, обтекаемый
        const tMain=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.46,0.36,hc.w*0.72),bodyMat);
        tMain.position.y=0.26; turret.add(tMain);
        // Передний скошенный нос башни
        const tNose=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.44,0.28,hc.w*0.22),bodyMat);
        tNose.rotation.x=0.28; tNose.position.set(0,0.20,-hc.w*0.46); turret.add(tNose);
        // Задняя возвышенность
        const tRear=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.44,0.50,hc.w*0.20),bodyMat);
        tRear.position.set(0,0.29,hc.w*0.30); turret.add(tRear);
        // Крыша
        const tRoof=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.44,0.07,hc.w*0.70),darkMat);
        tRoof.position.y=0.485; turret.add(tRoof);
        // Боковые стабилизаторы (характерные рёбра рельсы)
        for(let sx of [-1,1]) {
            const fin=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.30,hc.w*0.62),metalMat);
            fin.position.set(sx*hc.w*0.255,0.26,0); turret.add(fin);
            // Скос переднего ребра
            const finNose=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.22,hc.w*0.16),metalMat);
            finNose.rotation.x=0.28; finNose.position.set(sx*hc.w*0.255,0.18,-hc.w*0.38); turret.add(finNose);
        }
        // Электромагнитные катушки (видимые сбоку)
        for(let sx of [-1,1]) {
            for(let cz of [-hc.w*0.18,0,hc.w*0.18]) {
                const coil=new THREE.Mesh(new THREE.BoxGeometry(0.10,0.22,0.12),new THREE.MeshLambertMaterial({color:0x1a1a2a}));
                coil.position.set(sx*hc.w*0.255,0.26,cz); turret.add(coil);
            }
        }
        // Рейлган — длинный прямоугольный ствол (это рельса)
        const railHousing=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.26,2.85),darkMat);
        railHousing.position.set(0,0.28,-hc.w*0.35-1.425); barrels.add(railHousing);
        // Направляющие рельсы (верх и низ)
        for(let dy of [0.165,-0.165]) {
            const rail=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.06,2.85),metalMat);
            rail.position.set(0,0.28+dy,-hc.w*0.35-1.425); barrels.add(rail);
        }
        // Боковые рельсы
        for(let dx of [0.17,-0.17]) {
            const railSide=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.28,2.85),new THREE.MeshLambertMaterial({color:0x3a3a4a}));
            railSide.position.set(dx,0.28,-hc.w*0.35-1.425); barrels.add(railSide);
        }
        // Ускорительные кольца (5 штук по длине)
        for(let i=0;i<5;i++){
            const ring=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.38,0.12),darkMat);
            ring.position.set(0,0.28,-hc.w*0.35-0.36-i*0.52); barrels.add(ring);
            const ringGlow=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.28,0.08),new THREE.MeshBasicMaterial({color:0x0055aa}));
            ringGlow.position.set(0,0.28,-hc.w*0.35-0.36-i*0.52); barrels.add(ringGlow);
            // Центральный заряд (голубоватый)
            const charge=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,0.06),new THREE.MeshBasicMaterial({color:0x88ccff}));
            charge.position.set(0,0.28,-hc.w*0.35-0.36-i*0.52); barrels.add(charge);
        }
        // Дульный компенсатор
        const comp=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.34,0.22),metalMat);
        comp.position.set(0,0.28,-hc.w*0.35-2.96); barrels.add(comp);
        const muzzleGlow=new THREE.Mesh(new THREE.BoxGeometry(0.20,0.20,0.10),new THREE.MeshBasicMaterial({color:0x0099ff}));
        muzzleGlow.position.set(0,0.28,-hc.w*0.35-3.02); barrels.add(muzzleGlow);
        muzzlePoint.position.set(0,0.28,-hc.w*0.35-3.10);

    } else if(gId==='thunder') {
        // ── ГРОМ М0 — массивная приземистая башня с толстым коротким стволом ──
        // Широкое тяжёлое основание
        const tBase2=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.60,0.12,hc.w*0.66),metalMat);
        tBase2.position.y=0.08; turret.add(tBase2);
        // Основной массивный корпус
        const tMain=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.58,0.52,hc.w*0.62),bodyMat);
        tMain.position.y=0.34; turret.add(tMain);
        // Фронтальный скос башни (характерная форма Грома)
        const tFront=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.56,0.44,hc.w*0.16),bodyMat);
        tFront.rotation.x=-0.22; tFront.position.set(0,0.30,-hc.w*0.38); turret.add(tFront);
        // Крыша — с выступом под командирский люк
        const tRoof=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.56,0.08,hc.w*0.60),darkMat);
        tRoof.position.y=0.650; turret.add(tRoof);
        // Командирский купол
        const hatchCup=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.17,0.10,10),metalMat);
        hatchCup.position.set(-hc.w*0.13,0.705,-0.08); turret.add(hatchCup);
        // Болты по периметру крыши (как в оригинале)
        for(let [bx,bz] of [[-hc.w*0.24,-hc.w*0.26],[hc.w*0.24,-hc.w*0.26],[-hc.w*0.24,hc.w*0.26],[hc.w*0.24,hc.w*0.26],[-hc.w*0.24,0],[hc.w*0.24,0]]) {
            const bolt=new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.022,0.06,6),lightMat);
            bolt.position.set(bx,0.67,bz); turret.add(bolt);
        }
        // Защитная маска ствола — толстая прямоугольная
        const mantlet=new THREE.Mesh(new THREE.BoxGeometry(0.52,0.52,0.28),metalMat);
        mantlet.position.set(0,0.32,-hc.w*0.30); barrels.add(mantlet);
        // Скос маски сверху
        const mantTop=new THREE.Mesh(new THREE.BoxGeometry(0.50,0.12,0.24),darkMat);
        mantTop.position.set(0,0.60,-hc.w*0.30); barrels.add(mantTop);
        // Толстый ствол — задняя часть
        const bBack=new THREE.Mesh(new THREE.CylinderGeometry(0.185,0.21,0.85,12),darkMat);
        bBack.rotation.x=Math.PI/2; bBack.position.set(0,0.32,-hc.w*0.30-0.425); barrels.add(bBack);
        // Кольцо-усилитель
        const midRing=new THREE.Mesh(new THREE.CylinderGeometry(0.235,0.235,0.14,12),metalMat);
        midRing.rotation.x=Math.PI/2; midRing.position.set(0,0.32,-hc.w*0.30-0.75); barrels.add(midRing);
        // Передняя часть ствола (сужается)
        const bMid=new THREE.Mesh(new THREE.CylinderGeometry(0.165,0.185,0.90,12),darkMat);
        bMid.rotation.x=Math.PI/2; bMid.position.set(0,0.32,-hc.w*0.30-1.30); barrels.add(bMid);
        // Второе кольцо
        const ring2=new THREE.Mesh(new THREE.CylinderGeometry(0.210,0.210,0.12,12),metalMat);
        ring2.rotation.x=Math.PI/2; ring2.position.set(0,0.32,-hc.w*0.30-1.80); barrels.add(ring2);
        const bFront=new THREE.Mesh(new THREE.CylinderGeometry(0.148,0.165,0.55,12),darkMat);
        bFront.rotation.x=Math.PI/2; bFront.position.set(0,0.32,-hc.w*0.30-2.075); barrels.add(bFront);
        // Массивный дульный тормоз Грома — перфорированный цилиндр с крестообразными прорезями
        const brake=new THREE.Mesh(new THREE.CylinderGeometry(0.30,0.28,0.58,12),metalMat);
        brake.rotation.x=Math.PI/2; brake.position.set(0,0.32,-hc.w*0.30-2.65); barrels.add(brake);
        // Прорези дульника (крест + диагональ)
        for(let [sy,sx,sw,sh] of [[0.16,0,0.62,0.10],[-0.16,0,0.62,0.10],[0,0.16,0.10,0.62],[0,-0.16,0.10,0.62]]) {
            const sl=new THREE.Mesh(new THREE.BoxGeometry(sw,sh,0.62),new THREE.MeshBasicMaterial({color:0x000000}));
            sl.position.set(sx,0.32+sy,-hc.w*0.30-2.65); barrels.add(sl);
        }
        // Дульный срез
        const mCap=new THREE.Mesh(new THREE.CylinderGeometry(0.135,0.148,0.08,10),darkMat);
        mCap.rotation.x=Math.PI/2; mCap.position.set(0,0.32,-hc.w*0.30-2.99); barrels.add(mCap);
        muzzlePoint.position.set(0,0.32,-hc.w*0.30-3.06);

    } else if(gId==='freeze') {
        // ── ФРИЗ М0 — вытянутая узкая башня с криогенным оружием ──
        // Основание
        const tBase2=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.50,0.10,hc.w*0.62),metalMat);
        tBase2.position.y=0.08; turret.add(tBase2);
        // Корпус — узкий и вытянутый, нарост сзади
        const tMain=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.44,0.38,hc.w*0.52),bodyMat);
        tMain.position.y=0.27; turret.add(tMain);
        // Задний нарост с баллонами хладагента
        const tRear=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.46,0.55,hc.w*0.24),bodyMat);
        tRear.position.set(0,0.315,hc.w*0.23); turret.add(tRear);
        // Крышка
        const tRoof=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.42,0.07,hc.w*0.50),darkMat);
        tRoof.position.y=0.505; turret.add(tRoof);
        // Два характерных криогенных баллона по бокам — главная визуальная черта Фриза
        for(let sx of [-1,1]) {
            // Баллон
            const tank=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.72,12),new THREE.MeshLambertMaterial({color:0x0077cc}));
            tank.rotation.x=Math.PI/2; tank.position.set(sx*hc.w*0.20,0.35,0.05); turret.add(tank);
            // Задняя крышка баллона
            const tankCap=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.09,0.10,12),new THREE.MeshLambertMaterial({color:0x005599}));
            tankCap.rotation.x=Math.PI/2; tankCap.position.set(sx*hc.w*0.20,0.35,0.45); turret.add(tankCap);
            // Передняя крышка
            const tankCapF=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.12,0.10,12),new THREE.MeshLambertMaterial({color:0x005599}));
            tankCapF.rotation.x=Math.PI/2; tankCapF.position.set(sx*hc.w*0.20,0.35,-0.40); turret.add(tankCapF);
            // Обручи-хомуты
            for(let bz of [0.25,-0.18]) {
                const clamp=new THREE.Mesh(new THREE.CylinderGeometry(0.135,0.135,0.07,12),new THREE.MeshLambertMaterial({color:0x2a2a2a}));
                clamp.rotation.x=Math.PI/2; clamp.position.set(sx*hc.w*0.20,0.35,bz); turret.add(clamp);
            }
            // Трубка подачи хладагента к стволу
            const tube=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.55,6),new THREE.MeshLambertMaterial({color:0x004488}));
            tube.rotation.x=Math.PI/2; tube.position.set(sx*hc.w*0.20,0.35,-0.65); turret.add(tube);
        }
        // Ствол-сопло — центральный, от него идут обе трубки
        const nozzleBase=new THREE.Mesh(new THREE.BoxGeometry(0.24,0.20,0.28),metalMat);
        nozzleBase.position.set(0,0.35,-hc.w*0.26); barrels.add(nozzleBase);
        // Ствол — длинный конический
        const bBack=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.11,0.85,10),darkMat);
        bBack.rotation.x=Math.PI/2; bBack.position.set(0,0.35,-hc.w*0.26-0.425); barrels.add(bBack);
        // Передняя часть уже
        const bFront=new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.09,0.65,10),darkMat);
        bFront.rotation.x=Math.PI/2; bFront.position.set(0,0.35,-hc.w*0.26-1.175); barrels.add(bFront);
        // Криогенное сопло — воронкообразное расширение
        const nozzle=new THREE.Mesh(new THREE.CylinderGeometry(0.155,0.075,0.22,12),new THREE.MeshLambertMaterial({color:0x2a4a6a}));
        nozzle.rotation.x=Math.PI/2; nozzle.position.set(0,0.35,-hc.w*0.26-1.61); barrels.add(nozzle);
        // Ободок сопла
        const nozzleRim=new THREE.Mesh(new THREE.CylinderGeometry(0.165,0.165,0.05,12),metalMat);
        nozzleRim.rotation.x=Math.PI/2; nozzleRim.position.set(0,0.35,-hc.w*0.26-1.74); barrels.add(nozzleRim);
        // Линза криогенной камеры
        const lens=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.06,12),new THREE.MeshBasicMaterial({color:0x44bbff}));
        lens.rotation.x=Math.PI/2; lens.position.set(0,0.35,-hc.w*0.26-1.79); barrels.add(lens);
        // Центр линзы ярче
        const lensCore=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.07,10),new THREE.MeshBasicMaterial({color:0xaaeeff}));
        lensCore.rotation.x=Math.PI/2; lensCore.position.set(0,0.35,-hc.w*0.26-1.80); barrels.add(lensCore);
        muzzlePoint.position.set(0,0.35,-hc.w*0.26-1.88);

    } else if(gId==='isida') {
        // ── ИЗИДА М0 — низкий обтекаемый корпус с двумя вилкообразными излучателями ──
        // Основание
        const tBase2=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.50,0.10,hc.w*0.60),metalMat);
        tBase2.position.y=0.08; turret.add(tBase2);
        // Основной корпус — очень плоский, обтекаемый
        const tMain=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.46,0.28,hc.w*0.54),bodyMat);
        tMain.position.y=0.22; turret.add(tMain);
        // Задний купол — возвышение с генератором
        const tDome=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.44,0.40,hc.w*0.24),bodyMat);
        tDome.position.set(0,0.22,hc.w*0.17); turret.add(tDome);
        // Характерный аэродинамический горб спереди
        const tHump=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.30,0.20,hc.w*0.30),bodyMat);
        tHump.position.set(0,0.36,-hc.w*0.07); turret.add(tHump);
        // Крышка
        const tRoof=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.44,0.06,hc.w*0.52),darkMat);
        tRoof.position.y=0.400; turret.add(tRoof);
        // Красный индикатор заряда сверху
        const indicator=new THREE.Mesh(new THREE.BoxGeometry(hc.w*0.14,0.06,hc.w*0.08),new THREE.MeshBasicMaterial({color:0xff2200}));
        indicator.position.set(0,0.40,0.08); turret.add(indicator);
        // Боковые вентиляционные панели
        for(let sx of [-1,1]) {
            const ventP=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.24,hc.w*0.38),new THREE.MeshLambertMaterial({color:0x1a1a1a}));
            ventP.position.set(sx*hc.w*0.245,0.20,0); turret.add(ventP);
            for(let vz=-hc.w*0.14;vz<=hc.w*0.14;vz+=hc.w*0.08) {
                const vsl=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.04,0.04),new THREE.MeshBasicMaterial({color:0x000000}));
                vsl.position.set(sx*hc.w*0.255,0.22,vz); turret.add(vsl);
            }
        }
        // Центральный энергетический блок (основание вилки)
        const energyBlock=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.26,0.32),new THREE.MeshLambertMaterial({color:0x1a1a2a}));
        energyBlock.position.set(0,0.22,-hc.w*0.18); barrels.add(energyBlock);
        const energyGlow=new THREE.Mesh(new THREE.BoxGeometry(0.20,0.18,0.28),new THREE.MeshBasicMaterial({color:0xff3300}));
        energyGlow.position.set(0,0.22,-hc.w*0.18); barrels.add(energyGlow);
        // Два вилкообразных излучателя (характерная деталь Изиды)
        for(let offset of [-0.18,0.18]) {
            // Основание рожка
            const prongBase=new THREE.Mesh(new THREE.BoxGeometry(0.10,0.12,0.32),darkMat);
            prongBase.position.set(offset,0.28,-hc.w*0.20); barrels.add(prongBase);
            // Стержень рожка (длинный, тонкий)
            const prong=new THREE.Mesh(new THREE.BoxGeometry(0.075,0.10,1.50),darkMat);
            prong.position.set(offset,0.28,-hc.w*0.20-0.91); barrels.add(prong);
            // Металлическая оплётка вдоль стержня
            for(let pz of [-0.38,-0.78,-1.18,-1.58]) {
                const wrap=new THREE.Mesh(new THREE.BoxGeometry(0.095,0.12,0.08),metalMat);
                wrap.position.set(offset,0.28,-hc.w*0.20+pz); barrels.add(wrap);
            }
            // Диодные огни (красные) — по 3 на рожок
            for(let pz of [-0.50,-0.95,-1.40]) {
                const diode=new THREE.Mesh(new THREE.BoxGeometry(0.085,0.085,0.06),new THREE.MeshBasicMaterial({color:0xff0000}));
                diode.position.set(offset,0.34,-hc.w*0.20+pz); barrels.add(diode);
            }
            // Наконечник излучателя — раздвоённый (вилка)
            const tip1=new THREE.Mesh(new THREE.BoxGeometry(0.065,0.065,0.22),new THREE.MeshBasicMaterial({color:0xff3300}));
            tip1.position.set(offset+0.04,0.28,-hc.w*0.20-1.78); barrels.add(tip1);
            const tip2=tip1.clone(); tip2.position.x=offset-0.04; barrels.add(tip2);
            // Соединительная перемычка у наконечника
            const tipBridge=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.05,0.10),metalMat);
            tipBridge.position.set(offset,0.28,-hc.w*0.20-1.70); barrels.add(tipBridge);
        }
        // Горизонтальный перемычка между излучателями
        const crossBar=new THREE.Mesh(new THREE.BoxGeometry(0.44,0.08,0.12),metalMat);
        crossBar.position.set(0,0.28,-hc.w*0.20-0.58); barrels.add(crossBar);
        muzzlePoint.position.set(0,0.28,-hc.w*0.20-1.95);
    }
 
    barrels.add(muzzlePoint);
    turret.add(barrels);
    g.add(turret);
    // Z-FIGHTING FIX — все детали башни и корпуса
    g.traverse(o=>{if(!o.isMesh)return;[].concat(o.material).forEach(m=>{if(!m)return;m.polygonOffset=true;m.polygonOffsetFactor=1;m.polygonOffsetUnits=2;});});
    return {mesh:g, turret, barrels, muzzlePoint, body:bodyGroup};
}
 
// ==========================================
// ГАРАЖ — ОБНОВЛЕНИЕ ТАНКА
// ==========================================
function updateGarageTank(h,g,p) {
    if(garageMesh) sceneGar.remove(garageMesh);
    const obj=buildTankMesh(h,g,p);
    garageMesh=obj.mesh; garageMesh.position.y=0.55; sceneGar.add(garageMesh);
}
 
// ==========================================
// КАРТЫ — УЛУЧШЕННЫЕ, ДЕТАЛИЗИРОВАННЫЕ
// ==========================================
function buildMap(mapType) {
    while(mapGroup.children.length>0) mapGroup.remove(mapGroup.children[0]);
    mapObjects=[];
 
    function addBox(w,h,d,x,y,z,mat,noCol) {
        const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
        m.position.set(x,y+h/2,z); mapGroup.add(m);
        if(!noCol) mapObjects.push(new THREE.Box3().setFromObject(m));
        return m;
    }
 
    function addBuilding(x,z,w,h,d,wallMat,roofMat) {
        addBox(w,h,d,x,0,z,wallMat);
        // Крыша
        const roof=new THREE.Mesh(new THREE.BoxGeometry(w+0.8,0.8,d+0.8),roofMat);
        roof.position.set(x,h+0.4,z); roof.material.polygonOffset=true; roof.material.polygonOffsetFactor=1; mapGroup.add(roof);
        // Окна
        const winMat=new THREE.MeshBasicMaterial({color:0x88aacc,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:2});
        if(w>4) {
            for(let wz=-d*0.3;wz<=d*0.3;wz+=d*0.3) {
                const win=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.2,0.15),winMat);
                win.position.set(x-w/2-0.05,h*0.55,z+wz); mapGroup.add(win);
                const win2=win.clone(); win2.position.x=x+w/2+0.05; mapGroup.add(win2);
            }
        }
    }
 
    if(mapType==='sandbox') {
        // ======= ПЕСОЧНИЦА v3 — СТИЛЬ ТАНКИ ОНЛАЙН 2012 =======
        // Небо — тёплое дневное, лёгкая дымка
        sceneBat.background=new THREE.Color(0xb8cce0);
        sceneBat.fog=new THREE.FogExp2(0xc0ccda,0.0028);

        // Дополнительный тёплый свет (солнце сбоку)
        const sunLight=new THREE.DirectionalLight(0xfff5d0,0.85);
        sunLight.position.set(80,160,60); sceneBat.add(sunLight);
        const fillLight=new THREE.DirectionalLight(0xd0e8ff,0.3);
        fillLight.position.set(-60,80,-80); sceneBat.add(fillLight);

        // ─── ТЕКСТУРЫ ───────────────────────────────────────────────────────
        // Земля — выжженная трава / суглинок, как в оригинале
        function makeDirtTex() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle='#8a7850'; ctx.fillRect(0,0,256,256);
            for(let i=0;i<1200;i++){
                const v=Math.random();
                ctx.fillStyle=v<0.33?`rgba(70,55,28,0.5)`:v<0.66?`rgba(140,120,70,0.4)`:`rgba(100,85,45,0.35)`;
                const s=1+Math.random()*4;
                ctx.fillRect(Math.random()*256,Math.random()*256,s,s*0.5);
            }
            // Трещины
            for(let i=0;i<18;i++){
                ctx.strokeStyle='rgba(60,45,20,0.18)'; ctx.lineWidth=1;
                ctx.beginPath(); const sx=Math.random()*256,sy=Math.random()*256;
                ctx.moveTo(sx,sy); ctx.lineTo(sx+Math.random()*24-12,sy+Math.random()*24-12); ctx.stroke();
            }
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(40,40); t.anisotropy=4; return t;
        }
        // Плитка / бетон — прямоугольные блоки
        function makeTileTex(r=130,g=125,b=110) {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(0,0,256,256);
            ctx.strokeStyle='rgba(0,0,0,0.22)'; ctx.lineWidth=2;
            for(let y=0;y<256;y+=32){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke(); }
            for(let row=0;row<8;row++){
                const off=row%2===0?0:64;
                for(let x=off-64;x<256+64;x+=128){ ctx.beginPath();ctx.moveTo(x,row*32);ctx.lineTo(x,row*32+32);ctx.stroke(); }
            }
            for(let i=0;i<40;i++){ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(Math.random()*256,Math.random()*256,Math.random()*8,1);}
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(4,4); t.anisotropy=4; return t;
        }
        // Бетонная стена с кирпичной кладкой
        function makeWallTex(r=155,g=148,b=130) {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(0,0,256,256);
            ctx.strokeStyle='rgba(0,0,0,0.28)'; ctx.lineWidth=2;
            for(let y=0;y<256;y+=20){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke(); }
            for(let row=0;row<13;row++){
                const off=row%2===0?0:48;
                for(let x=off-48;x<256+48;x+=96){ ctx.beginPath();ctx.moveTo(x,row*20);ctx.lineTo(x,row*20+20);ctx.stroke(); }
            }
            for(let i=0;i<60;i++){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(Math.random()*256,Math.random()*256,3,3);}
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(3,3); t.anisotropy=4; return t;
        }
        // Металл с горизонтальными полосами (ворота/башня)
        function makeMetalPanelTex() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            for(let y=0;y<256;y+=8){
                ctx.fillStyle=y%16<8?'#4a4a4a':'#3a3a3a';
                ctx.fillRect(0,y,256,8);
            }
            for(let i=0;i<30;i++){ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fillRect(0,Math.random()*256,256,1);}
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(2,4); t.anisotropy=4; return t;
        }
        // Крыша
        function makeRoofTex2() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle='#4a3e2a'; ctx.fillRect(0,0,256,256);
            for(let y=0;y<256;y+=10){ctx.fillStyle=y%20<10?'#3e3320':'#544530';ctx.fillRect(0,y,256,10);}
            for(let i=0;i<50;i++){ctx.fillStyle='rgba(0,0,0,0.12)';ctx.fillRect(Math.random()*256,Math.random()*256,6,2);}
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(3,3); t.anisotropy=4; return t;
        }
        // Асфальт дорожки
        function makeAspTex2() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle='#2a2820'; ctx.fillRect(0,0,256,256);
            for(let i=0;i<400;i++){ctx.fillStyle='rgba(255,255,255,0.03)';ctx.fillRect(Math.random()*256,Math.random()*256,2,1);}
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(2,20); t.anisotropy=4; return t;
        }

        const matDirt  = new THREE.MeshLambertMaterial({map:makeDirtTex()});
        const matTile  = new THREE.MeshLambertMaterial({map:makeTileTex()});
        const matWall  = new THREE.MeshLambertMaterial({map:makeWallTex()});
        const matWall2 = new THREE.MeshLambertMaterial({map:makeWallTex(140,132,115)});
        const matMPan  = new THREE.MeshLambertMaterial({map:makeMetalPanelTex()});
        const matRoof2 = new THREE.MeshLambertMaterial({map:makeRoofTex2()});
        const matAsp2  = new THREE.MeshLambertMaterial({map:makeAspTex2()});
        const matGrass2= new THREE.MeshLambertMaterial({map:(()=>{const t=texGrass.clone();t.repeat.set(8,8);t.needsUpdate=true;return t;})(),color:0x8faf50});
        const matDark2 = new THREE.MeshLambertMaterial({color:0x2a2520});
        const matWood2 = new THREE.MeshLambertMaterial({color:0x7a5a2a});
        const matRust2 = new THREE.MeshLambertMaterial({color:0x7a3a18});
        const matWin2  = new THREE.MeshLambertMaterial({color:0x88aacc,transparent:true,opacity:0.85});
        const matGreen2= new THREE.MeshLambertMaterial({color:0x2d6010});

        // ─── ПОЛ ────────────────────────────────────────────────────────────
        // Вспомогательная функция: применяет polygonOffset ко всем плоскостям
        function noFloorFight(mat,factor=1,units=4){mat.polygonOffset=true;mat.polygonOffsetFactor=-factor;mat.polygonOffsetUnits=-units;return mat;}
        noFloorFight(matDirt,0,0);

        // Основная земля — самый нижний слой
        const floor=new THREE.Mesh(new THREE.PlaneGeometry(600,600),matDirt);
        floor.rotation.x=-Math.PI/2; floor.position.y=-0.5; mapGroup.add(floor);

        // Внутренний двор — плиточный настил (большой центральный квадрат)
        noFloorFight(matTile,1,4);
        const court=new THREE.Mesh(new THREE.PlaneGeometry(160,160),matTile);
        court.rotation.x=-Math.PI/2; court.position.set(0,0.05,0); mapGroup.add(court);

        // Угловые газоны
        noFloorFight(matGrass2,1,4);
        for(let [gx,gz] of [[-70,-70],[70,-70],[-70,70],[70,70]]) {
            const gr=new THREE.Mesh(new THREE.PlaneGeometry(30,30),matGrass2);
            gr.rotation.x=-Math.PI/2; gr.position.set(gx,0.05,gz); mapGroup.add(gr);
        }

        // Крестообразные дорожки
        noFloorFight(matAsp2,2,8);
        const asp1=new THREE.Mesh(new THREE.PlaneGeometry(180,9),matAsp2);
        asp1.rotation.x=-Math.PI/2; asp1.position.set(0,0.10,0); mapGroup.add(asp1);
        const asp2=new THREE.Mesh(new THREE.PlaneGeometry(9,180),matAsp2);
        asp2.rotation.x=-Math.PI/2; asp2.position.set(0,0.10,0); mapGroup.add(asp2);
        // Дорожки к воротам
        const matAspGate=new THREE.MeshLambertMaterial({color:0x333028,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-8});
        for(let [gx,gz,gw,gh] of [[0,-97,9,30],[0,97,9,30],[-97,0,30,9],[97,0,30,9]]) {
            const rd=new THREE.Mesh(new THREE.PlaneGeometry(gw,gh),matAspGate);
            rd.rotation.x=-Math.PI/2; rd.position.set(gx,0.10,gz); mapGroup.add(rd);
        }

        // ─── ВНЕШНИЙ ПЕРИМЕТР — СТЕНЫ С ЗУБЦАМИ ────────────────────────────
        const WALL_H=13, WALL_T=5.5, WALL_R=110;
        // 4 стены
        addBox(WALL_R*2,WALL_H,WALL_T, 0,0,-WALL_R, matWall);
        addBox(WALL_R*2,WALL_H,WALL_T, 0,0, WALL_R, matWall);
        addBox(WALL_T,WALL_H,WALL_R*2,-WALL_R,0,0, matWall);
        addBox(WALL_T,WALL_H,WALL_R*2, WALL_R,0,0, matWall);
        // Верхний бордюр (чуть темнее)
        addBox(WALL_R*2+WALL_T,1.8,WALL_T+1.2, 0,WALL_H,-WALL_R, matWall2,true);
        addBox(WALL_R*2+WALL_T,1.8,WALL_T+1.2, 0,WALL_H, WALL_R, matWall2,true);
        addBox(WALL_T+1.2,1.8,WALL_R*2,-WALL_R,WALL_H,0, matWall2,true);
        addBox(WALL_T+1.2,1.8,WALL_R*2, WALL_R,WALL_H,0, matWall2,true);
        // Зубцы (мерлоны) — верхушки стен
        function addMerlons(axis,side,count=14,step=15) {
            for(let i=-count;i<=count;i++) {
                const ox=axis==='x'?i*step:side;
                const oz=axis==='z'?i*step:side;
                const m=new THREE.Mesh(new THREE.BoxGeometry(axis==='x'?4.5:WALL_T+1,2.5,axis==='z'?4.5:WALL_T+1),matWall2);
                m.position.set(ox,WALL_H+1.8+1.25,axis==='x'?-side:side); mapGroup.add(m);
                if(axis==='z') m.position.set(axis==='z'?-side:side,WALL_H+1.8+1.25,oz);
            }
        }
        addMerlons('x',WALL_R,13,16); addMerlons('x',-WALL_R,13,16);
        addMerlons('z',WALL_R,13,16); addMerlons('z',-WALL_R,13,16);

        // ─── ВОРОТА (4 штуки — N/S/W/E) ────────────────────────────────────
        function addGate2(x,z,rotY=0) {
            const gW=12,gH=10;
            // Арочный проём — боковые столбы
            const pilMat=matWall2;
            if(rotY===0){
                addBox(4,gH,WALL_T+2,x-gW/2-2,0,z,pilMat);
                addBox(4,gH,WALL_T+2,x+gW/2+2,0,z,pilMat);
                addBox(gW+8,3,WALL_T+2,x,gH+1.5,z,matDark2);
                // Металлическая решётка ворот (только декор)
                const gateG=new THREE.Mesh(new THREE.BoxGeometry(gW,gH-1,0.4),matMPan);
                gateG.position.set(x,gH/2-0.5,z); mapGroup.add(gateG);
            } else {
                addBox(WALL_T+2,gH,4,x,0,z-gW/2-2,pilMat);
                addBox(WALL_T+2,gH,4,x,0,z+gW/2+2,pilMat);
                addBox(WALL_T+2,3,gW+8,x,gH+1.5,z,matDark2);
                const gateG=new THREE.Mesh(new THREE.BoxGeometry(0.4,gH-1,gW),matMPan);
                gateG.position.set(x,gH/2-0.5,z); mapGroup.add(gateG);
            }
        }
        addGate2(0,-WALL_R,0); addGate2(0,WALL_R,0);
        addGate2(-WALL_R,0,1); addGate2(WALL_R,0,1);

        // ─── УГЛОВЫЕ БАШНИ (4 штуки) ────────────────────────────────────────
        const matTowerPlat=new THREE.MeshLambertMaterial({color:0x9a9280,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4});
        function addCornerTower(x,z) {
            // Основание башни
            addBox(16,WALL_H+6,16,x,0,z,matWall);
            // Верхняя платформа — polygonOffset чтобы не мерцала поверх основания
            const plat=new THREE.Mesh(new THREE.BoxGeometry(22,2,22),matTowerPlat);
            plat.position.set(x,WALL_H+6+1,z); mapGroup.add(plat);
            // Зубцы башни
            for(let dx of [-8,-4,0,4,8]) {
                const m1=new THREE.Mesh(new THREE.BoxGeometry(3.2,3,3.2),matWall2);
                m1.position.set(x+dx,WALL_H+6+2+1.5,z+10); mapGroup.add(m1);
                const m2=m1.clone(); m2.position.z=z-10; mapGroup.add(m2);
            }
            for(let dz of [-8,-4,0,4,8]) {
                const m3=new THREE.Mesh(new THREE.BoxGeometry(3.2,3,3.2),matWall2);
                m3.position.set(x+10,WALL_H+6+2+1.5,z+dz); mapGroup.add(m3);
                const m4=m3.clone(); m4.position.x=x-10; mapGroup.add(m4);
            }
            // Узкое окно-бойница
            const win=new THREE.Mesh(new THREE.BoxGeometry(2,3,0.5),matWin2);
            for(let [wdx,wdz] of [[0,-8],[0,8],[-8,0],[8,0]]) {
                const w2=win.clone(); w2.position.set(x+wdx,WALL_H*0.6,z+wdz); mapGroup.add(w2);
            }
            // Лестница на башню
            const stepMat=new THREE.MeshLambertMaterial({color:0x5a5040});
            for(let i=0;i<10;i++){
                const step=new THREE.Mesh(new THREE.BoxGeometry(2.5,0.35,0.9),stepMat);
                const sx=x+(x>0?-6:6), sdx=x>0?-i*0.22:i*0.22;
                step.position.set(sx+sdx,i*2,z); mapGroup.add(step);
            }
        }
        addCornerTower(-WALL_R,-WALL_R); addCornerTower(WALL_R,-WALL_R);
        addCornerTower(-WALL_R, WALL_R); addCornerTower(WALL_R, WALL_R);

        // ─── ЦЕНТРАЛЬНОЕ КОМАНДНОЕ ЗДАНИЕ (как в ТО 2012) ───────────────────
        // Приподнятая платформа
        addBox(28,3,28,0,0,0,matTile);
        // Пандусы к платформе (4 стороны)
        for(let [rx,rz,rotZ,rotX] of [
            [0,-20,0,0.22],[0,20,0,-0.22],[-20,0,-0.22,0],[20,0,0.22,0]
        ]) {
            const ramp=new THREE.Mesh(new THREE.BoxGeometry(9,0.4,14),matTile);
            ramp.position.set(rx,1.5,rz); ramp.rotation.z=rotZ; ramp.rotation.x=rotX; mapGroup.add(ramp);
        }
        // Само здание на платформе
        addBox(18,10,18,0,3,0,matWall);
        // Крыша здания
        const cRoof=new THREE.Mesh(new THREE.BoxGeometry(20,1.5,20),matRoof2);
        cRoof.position.set(0,13+0.75,0); mapGroup.add(cRoof);
        // Декоративная крышная надстройка
        addBox(10,4,10,0,14.5,0,matWall2);
        const cRoof2=new THREE.Mesh(new THREE.BoxGeometry(12,1.2,12),matRoof2);
        cRoof2.position.set(0,18.6+0.6,0); mapGroup.add(cRoof2);
        // Антенна / флагшток
        const flagpole=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,9,8),new THREE.MeshLambertMaterial({color:0x4a4a4a}));
        flagpole.position.set(0,19.2+4.5,0); mapGroup.add(flagpole);
        const flag=new THREE.Mesh(new THREE.BoxGeometry(4,2.5,0.12),new THREE.MeshLambertMaterial({color:0xcc2200}));
        flag.position.set(2,19.2+8,0); mapGroup.add(flag);
        // Окна центрального здания
        for(let [wx,wz] of [[0,-9.05],[0,9.05],[-9.05,0],[9.05,0]]) {
            const win=new THREE.Mesh(new THREE.BoxGeometry(wx===0?4:0.3,3.5,wz===0?4:0.3),matWin2);
            win.position.set(wx,7,wz); mapGroup.add(win);
        }
        // Декоративная полоса
        const stripe=new THREE.Mesh(new THREE.BoxGeometry(20,0.5,20),new THREE.MeshLambertMaterial({color:0x888070}));
        stripe.position.set(0,5,0); mapGroup.add(stripe);

        // ─── 4 УГЛОВЫХ ЗДАНИЯ ──────────────────────────────────────────────
        function addCornerBuilding(x,z,w,h,d) {
            addBox(w,h,d,x,0,z,matWall);
            const roof=new THREE.Mesh(new THREE.BoxGeometry(w+1.2,1.5,d+1.2),matRoof2);
            roof.position.set(x,h+0.75,z); roof.material.polygonOffset=true; roof.material.polygonOffsetFactor=-1; roof.material.polygonOffsetUnits=-4; mapGroup.add(roof);
            // Окна
            for(let fl=0;fl<Math.floor(h/5);fl++){
                const wy=3+fl*5;
                for(let [wo,wa] of [[x,-w/2-0.15],[x,w/2+0.15]]) {
                    const win=new THREE.Mesh(new THREE.BoxGeometry(0.25,2.2,2.5),matWin2);
                    win.position.set(wa,wy,z); mapGroup.add(win);
                }
            }
            // Корнизы этажей
            const cornice=new THREE.Mesh(new THREE.BoxGeometry(w+0.4,0.5,d+0.4),matWall2);
            cornice.position.set(x,h*0.5,z); mapGroup.add(cornice);
        }
        addCornerBuilding(-65,-65,14,10,14);
        addCornerBuilding( 65,-65,14,10,14);
        addCornerBuilding(-65, 65,14,10,14);
        addCornerBuilding( 65, 65,14,10,14);

        // ─── УКРЫТИЯ / СТЕНЫ ПОСЕРЕДИНЕ (L-образные + прямые) ───────────────
        // Крестовые стены между зданиями и центром
        for(let [cx,cz,cw,cd] of [
            [0,-58,22,4],[0,58,22,4],[-58,0,4,22],[58,0,4,22]
        ]) {
            addBox(cw,5,cd,cx,0,cz,matWall);
            // Верхний бордюр укрытия
            addBox(cw+0.5,0.9,cd+0.5,cx,5,cz,matWall2,true);
        }

        // L-образные укрытия (4 штуки по диагонали)
        for(let [lx,lz,flip] of [[-38,-38,1],[38,-38,-1],[-38,38,-1],[38,38,1]]) {
            addBox(16,4,4,lx,0,lz,matWall);
            addBox(4,4,12,lx+flip*6,0,lz+flip*4,matWall);
            addBox(16.5,0.9,4.5,lx,4,lz,matWall2,true);
            addBox(4.5,0.9,12.5,lx+flip*6,4,lz+flip*4,matWall2,true);
        }

        // Одиночные низкие стены рядом с центром (для укрытия)
        for(let [wx,wz,ww,wd] of [
            [-25,-12,4,10],[-25,12,4,10],[25,-12,4,10],[25,12,4,10],
            [-12,-25,10,4],[12,-25,10,4],[-12,25,10,4],[12,25,10,4]
        ]) {
            addBox(ww,3.5,wd,wx,0,wz,matWall2);
        }

        // ─── КОНТЕЙНЕРЫ ─────────────────────────────────────────────────────
        const contColors=[0x4a7a3a,0x8b4513,0x3a4a6a,0x7a6a2a,0x6a4a3a];
        function addCont2(x,z,ry=0) {
            const col=contColors[Math.floor(Math.random()*contColors.length)];
            const cMat=new THREE.MeshLambertMaterial({color:col});
            const cont=new THREE.Mesh(new THREE.BoxGeometry(6,3,2.5),cMat);
            cont.position.set(x,1.5,z); cont.rotation.y=ry; mapGroup.add(cont);
            mapObjects.push(new THREE.Box3().setFromObject(cont));
            const ribMat2=new THREE.MeshLambertMaterial({color:0x1e1e1e});
            for(let rx of [-2.4,-1.2,0,1.2,2.4]){
                const rib=new THREE.Mesh(new THREE.BoxGeometry(0.1,3.05,2.55),ribMat2);
                rib.position.set(x+rx,1.5,z); rib.rotation.y=ry; mapGroup.add(rib);
            }
        }
        addCont2(-42,0,Math.PI/2); addCont2(-42,5,Math.PI/2); addCont2(-42,-5,Math.PI/2);
        addCont2(42,0,Math.PI/2);  addCont2(42,5,Math.PI/2);
        addCont2(0,42);  addCont2(5,42);
        addCont2(0,-42); addCont2(-5,-42);
        addCont2(-80,30); addCont2(80,-30);
        addCont2(-80,-30,Math.PI/4); addCont2(80,30,Math.PI/4);

        // ─── ДЕРЕВЯННЫЕ ЯЩИКИ ───────────────────────────────────────────────
        function addCrate2(x,z,s=2.2) {
            const cr=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),matWood2);
            cr.position.set(x,s/2,z); mapGroup.add(cr);
            mapObjects.push(new THREE.Box3().setFromObject(cr));
            const sm=new THREE.MeshLambertMaterial({color:0x3a2800});
            for(let ax of ['x','z']){
                const st=new THREE.Mesh(new THREE.BoxGeometry(ax==='x'?s+0.06:0.16,0.16,ax==='z'?s+0.06:0.16),sm);
                st.position.set(x,s*0.55,z); mapGroup.add(st);
                const st2=st.clone(); st2.position.y=s*0.82; mapGroup.add(st2);
            }
        }
        for(let [cx,cz] of [
            [20,20],[-20,20],[20,-20],[-20,-20],
            [50,10],[50,-10],[-50,10],[-50,-10],
            [10,50],[-10,50],[10,-50],[-10,-50],
            [75,75],[-75,75],[75,-75],[-75,-75],
            [35,60],[60,35],[-35,60],[-60,35],[-35,-60],[-60,-35],[35,-60],[60,-35]
        ]) addCrate2(cx,cz);

        // ─── БОЧКИ ──────────────────────────────────────────────────────────
        function addBarrel2(x,z,col=0x4a3a20) {
            const bm=new THREE.MeshLambertMaterial({color:col});
            const body=new THREE.Mesh(new THREE.CylinderGeometry(0.72,0.72,1.8,12),bm);
            body.position.set(x,0.9,z); mapGroup.add(body);
            const rim=new THREE.MeshLambertMaterial({color:0x2a2a2a});
            for(let ry of [0.3,0.9,1.5]){
                const r=new THREE.Mesh(new THREE.CylinderGeometry(0.77,0.77,0.1,12),rim);
                r.position.set(x,ry,z); mapGroup.add(r);
            }
            mapObjects.push(new THREE.Box3().setFromObject(body));
        }
        for(let [bx,bz,bc] of [
            [-30,18,0x4a3a20],[-30,22,0x4a3a20],[-30,26,0x3a5a20],
            [30,-18,0x5a3a18],[30,-22,0x4a3a20],
            [-18,30,0x3a4a5a],[-22,30,0x4a3a20],
            [18,-30,0x5a4a20],[22,-30,0x4a3a20],[26,-30,0x3a3a5a],
            [88,20,0x4a3a20],[88,25,0x5a3a18],[-88,-20,0x4a3a20],[-88,-25,0x3a4a5a],
            [20,88,0x4a3a20],[25,88,0x4a3a20],[-20,-88,0x4a3a20]
        ]) addBarrel2(bx,bz,bc);

        // ─── ДЕРЕВЬЯ ────────────────────────────────────────────────────────
        function addTree2(x,z,h=8) {
            const trk=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.52,h*0.45,8),new THREE.MeshLambertMaterial({color:0x3a2008}));
            trk.position.set(x,h*0.225,z); mapGroup.add(trk);
            const lc1=new THREE.MeshLambertMaterial({color:0x28580c});
            const lc2=new THREE.MeshLambertMaterial({color:0x347014});
            const lc3=new THREE.MeshLambertMaterial({color:0x1e4808});
            const l1=new THREE.Mesh(new THREE.ConeGeometry(h*0.44,h*0.62,9),lc1);
            l1.position.set(x,h*0.58,z); mapGroup.add(l1);
            const l2=new THREE.Mesh(new THREE.ConeGeometry(h*0.34,h*0.5,9),lc2);
            l2.position.set(x,h*0.86,z); mapGroup.add(l2);
            const l3=new THREE.Mesh(new THREE.ConeGeometry(h*0.2,h*0.36,9),lc3);
            l3.position.set(x,h*1.1,z); mapGroup.add(l3);
        }
        // Деревья вдоль стен и по углам газонов
        for(let [tx,tz,th] of [
            // Вдоль стен
            [-95,50,9],[-95,20,11],[-95,-20,10],[-95,-50,9],[-95,80,8],[-95,-80,10],
            [95,50,10],[95,20,9],[95,-20,11],[95,-50,9],[95,80,10],[95,-80,8],
            [50,-95,9],[20,-95,10],[-20,-95,11],[-50,-95,9],[80,-95,8],[-80,-95,10],
            [50,95,10],[20,95,9],[-20,95,10],[-50,95,9],[80,95,9],[-80,95,11],
            // На угловых газонах
            [-68,-68,7],[-72,-64,6],[68,-68,7],[72,-64,6],
            [-68,68,7],[72,64,6],[68,68,7],[-72,64,6]
        ]) addTree2(tx,tz,th);

        // ─── КУСТЫ / МЕЛКАЯ РАСТИТЕЛЬНОСТЬ ──────────────────────────────────
        const bushMat=new THREE.MeshLambertMaterial({color:0x3a5a14});
        for(let [bx,bz] of [
            [-100,40],[-100,60],[-100,-40],[-100,-60],
            [100,40],[100,60],[100,-40],[100,-60],
            [40,-100],[60,-100],[-40,-100],[-60,-100],
            [40,100],[60,100],[-40,100],[-60,100]
        ]) {
            const bush=new THREE.Mesh(new THREE.SphereGeometry(1.8+Math.random(),7,5),bushMat);
            bush.scale.y=0.65; bush.position.set(bx,1.0,bz); mapGroup.add(bush);
        }

        // ─── БЕТОННЫЕ СТОЛБИКИ / ТУМБЫ (чтоб укрываться) ───────────────────
        const pillarMat=new THREE.MeshLambertMaterial({color:0x8a8070});
        for(let [px,pz] of [
            [-8,-35],[8,-35],[-8,35],[8,35],
            [-35,-8],[-35,8],[35,-8],[35,8]
        ]) {
            const pil=new THREE.Mesh(new THREE.BoxGeometry(2,3.5,2),pillarMat);
            pil.position.set(px,1.75,pz); mapGroup.add(pil);
            mapObjects.push(new THREE.Box3().setFromObject(pil));
            const cap=new THREE.Mesh(new THREE.BoxGeometry(2.6,0.6,2.6),matWall2);
            cap.position.set(px,3.8,pz); mapGroup.add(cap);
        }

        // ─── МЕТАЛЛИЧЕСКИЕ ТРУБЫ (лежачие укрытия) ──────────────────────────
        function addPipe2(x,z,ry=0) {
            const pm=new THREE.MeshLambertMaterial({color:0x5a5248});
            const pipe=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,10,10),pm);
            pipe.rotation.z=Math.PI/2; pipe.rotation.y=ry;
            pipe.position.set(x,1.1,z); mapGroup.add(pipe);
            mapObjects.push(new THREE.Box3().setFromObject(pipe));
            const rim2=new THREE.MeshLambertMaterial({color:0x3a3a3a});
            for(let rp of [-4.5,4.5]) {
                const r=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,0.3,10),rim2);
                r.rotation.z=Math.PI/2; r.rotation.y=ry;
                r.position.set(ry===0?x+rp:x,1.1,ry===0?z:z+rp); mapGroup.add(r);
            }
        }
        addPipe2(-15,48); addPipe2(15,-48); addPipe2(48,-15,Math.PI/2); addPipe2(-48,15,Math.PI/2);
        addPipe2(-85,0,Math.PI/4); addPipe2(85,0,Math.PI/4);

        // ─── НЕФТЯНЫЕ ВЫШКИ (2 штуки у краёв) ──────────────────────────────
        function addDerrick2(x,z,h=22) {
            for(let [dx,dz] of [[-2,-2],[2,-2],[-2,2],[2,2]]){
                const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.22,h,6),matRust2);
                leg.position.set(x+dx,h/2,z+dz);
                leg.rotation.z=(dx>0?-1:1)*0.1; leg.rotation.x=(dz>0?-1:1)*0.1;
                mapGroup.add(leg);
            }
            for(let y=5;y<h;y+=5){
                for(let [ax,az,bx2,bz2] of [[-2,-2,2,-2],[-2,2,2,2],[-2,-2,-2,2],[2,-2,2,2]]){
                    const cross=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,4.1,4),matRust2);
                    cross.position.set(x+(ax+bx2)/2,y,z+(az+bz2)/2);
                    if(ax===bx2) cross.rotation.z=Math.PI/2; else cross.rotation.x=Math.PI/2;
                    mapGroup.add(cross);
                }
            }
            const topPlat=new THREE.Mesh(new THREE.BoxGeometry(5,0.6,5),matRust2);
            topPlat.position.set(x,h+0.3,z); mapGroup.add(topPlat);
            // Мигающий красный огонь (сигнал) — просто красная лампочка
            const lamp=new THREE.Mesh(new THREE.SphereGeometry(0.3,8,8),new THREE.MeshBasicMaterial({color:0xff2200}));
            lamp.position.set(x,h+1,z); mapGroup.add(lamp);
        }
        addDerrick2(-88,85,24); addDerrick2(88,-85,26);

        // ─── СВЕТОВЫЕ СТОЛБЫ / ФОНАРИ ───────────────────────────────────────
        function addLamp2(x,z) {
            const pm2=new THREE.MeshLambertMaterial({color:0x3a3830});
            const post=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,7,8),pm2);
            post.position.set(x,3.5,z); mapGroup.add(post);
            const arm=new THREE.Mesh(new THREE.BoxGeometry(2.5,0.2,0.2),pm2);
            arm.position.set(x+1.2,7,z); mapGroup.add(arm);
            const globe=new THREE.Mesh(new THREE.SphereGeometry(0.5,8,8),new THREE.MeshBasicMaterial({color:0xffffcc}));
            globe.position.set(x+2.4,7,z); mapGroup.add(globe);
        }
        for(let [lx,lz] of [
            [-55,-5],[-55,5],[55,-5],[55,5],
            [-5,-55],[5,-55],[-5,55],[5,55],
            [-90,0],[90,0],[0,-90],[0,90]
        ]) addLamp2(lx,lz);

        // ─── ЗНАК / ТАБЛИЧКА НА ВХОДЕ ────────────────────────────────────────
        // Два опорных столба + щит
        function addSign(x,z,ry=0) {
            const pm3=new THREE.MeshLambertMaterial({color:0x3a2808});
            for(let ox of [-2,2]) {
                const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,5,6),pm3);
                sp.position.set(x+Math.cos(ry)*ox,2.5,z+Math.sin(ry)*ox); mapGroup.add(sp);
            }
            const board=new THREE.Mesh(new THREE.BoxGeometry(ry===0?5:0.3,2,ry===0?0.3:5),new THREE.MeshLambertMaterial({color:0x6a4820}));
            board.position.set(x,4,z); mapGroup.add(board);
        }
        addSign(0,-102,0); addSign(0,102,0); addSign(-102,0,Math.PI/2); addSign(102,0,Math.PI/2);

    } else if(mapType==='kubiki') {
        // ======= КУБИКИ — классическая арена ТО 2012 =======
        sceneBat.background=new THREE.Color(0x8aabd0);
        sceneBat.fog=new THREE.FogExp2(0x9ab8d8,0.004);

        const sunLight=new THREE.DirectionalLight(0xfff0d0,1.15);
        sunLight.position.set(60,140,40); sceneBat.add(sunLight);
        const ambK=new THREE.AmbientLight(0xddeeff,0.7); sceneBat.add(ambK);
        const rimK=new THREE.DirectionalLight(0x88aacc,0.45);
        rimK.position.set(-80,60,-100); sceneBat.add(rimK);

        // ── ТЕКСТУРЫ ──────────────────────────────────────────────────────
        function makeArenaFloorTex() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle='#7a7268'; ctx.fillRect(0,0,256,256);
            // Большие плиты 64×64
            ctx.strokeStyle='rgba(0,0,0,0.45)'; ctx.lineWidth=2.5;
            for(let i=0;i<=256;i+=64){
                ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,256); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(256,i); ctx.stroke();
            }
            // Мини-плитки внутри 32×32
            ctx.strokeStyle='rgba(0,0,0,0.18)'; ctx.lineWidth=1;
            for(let i=0;i<=256;i+=32){
                ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,256); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(256,i); ctx.stroke();
            }
            // Шум / зернистость
            for(let i=0;i<300;i++){
                ctx.fillStyle=`rgba(0,0,0,${Math.random()*0.06})`;
                ctx.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*2,1);
            }
            // Светлые блики на плитках
            for(let i=0;i<60;i++){
                ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.04})`;
                ctx.fillRect(Math.random()*256,Math.random()*256,3,1);
            }
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(20,20); t.anisotropy=4; return t;
        }
        function makeKubeTex(baseR=210,baseG=200,baseB=180) {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            // Бетонная основа с градиентом
            const grad=ctx.createLinearGradient(0,0,0,256);
            grad.addColorStop(0,`rgb(${baseR},${baseG},${baseB})`);
            grad.addColorStop(0.5,`rgb(${baseR-15},${baseG-15},${baseB-15})`);
            grad.addColorStop(1,`rgb(${baseR-30},${baseG-30},${baseB-30})`);
            ctx.fillStyle=grad; ctx.fillRect(0,0,256,256);
            // Пятна разного оттенка
            for(let i=0;i<40;i++){
                ctx.fillStyle=`rgba(${baseR-30+Math.random()*50},${baseG-30+Math.random()*50},${baseB-30+Math.random()*50},${0.15+Math.random()*0.15})`;
                const rd=8+Math.random()*22;
                ctx.beginPath();
                ctx.ellipse(Math.random()*256,Math.random()*256,rd,rd*0.7,Math.random()*Math.PI,0,Math.PI*2);
                ctx.fill();
            }
            // Швы (большая граница плит на кубе)
            ctx.strokeStyle='rgba(0,0,0,0.45)'; ctx.lineWidth=3;
            ctx.strokeRect(2,2,252,252);
            // Чёрные полосы по краям — рамка
            ctx.fillStyle='rgba(0,0,0,0.55)';
            ctx.fillRect(0,0,256,4); ctx.fillRect(0,252,256,4);
            ctx.fillRect(0,0,4,256); ctx.fillRect(252,0,4,256);
            // Зернистый шум
            for(let i=0;i<250;i++){
                ctx.fillStyle=`rgba(0,0,0,${Math.random()*0.08})`;
                ctx.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*2,1);
            }
            // Светлые царапины
            for(let i=0;i<40;i++){
                ctx.strokeStyle=`rgba(255,255,255,${0.04+Math.random()*0.06})`;
                ctx.lineWidth=0.7;
                const sx=Math.random()*256, sy=Math.random()*256;
                ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sx+(Math.random()-0.5)*30,sy+(Math.random()-0.5)*6); ctx.stroke();
            }
            // Потёки
            for(let i=0;i<6;i++){
                const sx=Math.random()*256;
                const g2=ctx.createLinearGradient(sx,0,sx,256);
                g2.addColorStop(0,'rgba(0,0,0,0)');
                g2.addColorStop(0.5,'rgba(40,30,20,0.25)');
                g2.addColorStop(1,'rgba(0,0,0,0)');
                ctx.fillStyle=g2; ctx.fillRect(sx-1,0,2+Math.random()*3,256);
            }
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.anisotropy=4; return t;
        }
        function makeArenaWallTex() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle='#a8a090'; ctx.fillRect(0,0,256,256);
            // Большие панели — горизонтальные плиты
            ctx.strokeStyle='rgba(0,0,0,0.45)'; ctx.lineWidth=2.5;
            for(let y=0;y<=256;y+=42){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke(); }
            ctx.strokeStyle='rgba(0,0,0,0.30)'; ctx.lineWidth=1.5;
            for(let row=0;row<7;row++){
                const off=row%2===0?0:64;
                for(let x=off-64;x<256+64;x+=128){ ctx.beginPath();ctx.moveTo(x,row*42);ctx.lineTo(x,row*42+42);ctx.stroke(); }
            }
            // Грязь / потёки
            for(let i=0;i<10;i++){
                const sx=Math.random()*256;
                const g2=ctx.createLinearGradient(sx,0,sx,256);
                g2.addColorStop(0,'rgba(0,0,0,0)');
                g2.addColorStop(0.4,'rgba(50,40,30,0.25)');
                g2.addColorStop(1,'rgba(0,0,0,0)');
                ctx.fillStyle=g2; ctx.fillRect(sx,0,3+Math.random()*4,256);
            }
            // Зерно
            for(let i=0;i<180;i++){
                ctx.fillStyle=`rgba(0,0,0,${Math.random()*0.06})`;
                ctx.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*2,1);
            }
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(4,3); t.anisotropy=4; return t;
        }

        const matFloor=new THREE.MeshPhongMaterial({map:makeArenaFloorTex(),shininess:8,specular:0x222222});
        const matKubeGray=new THREE.MeshPhongMaterial({map:makeKubeTex(210,200,180),shininess:10,specular:0x333333});
        const matKubeRed =new THREE.MeshPhongMaterial({map:makeKubeTex(170,90,60), shininess:10,specular:0x333333});
        const matKubeBlue=new THREE.MeshPhongMaterial({map:makeKubeTex(80,110,170), shininess:10,specular:0x333333});
        const matKubeYel =new THREE.MeshPhongMaterial({map:makeKubeTex(200,170,70), shininess:10,specular:0x333333});
        const matWall    =new THREE.MeshPhongMaterial({map:makeArenaWallTex(),shininess:6,specular:0x222222});
        const matWallTop =new THREE.MeshPhongMaterial({color:0x4a443a,shininess:8,specular:0x222222});
        const matMetal   =new THREE.MeshPhongMaterial({color:0x4a4a4a,shininess:50,specular:0x444444});
        const matStripe  =new THREE.MeshBasicMaterial({color:0xffcc00});
        const matStripeRed=new THREE.MeshBasicMaterial({color:0xcc2200});

        // ── ПОЛ — большая плитчатая площадка ─────────────────────────────
        const floor=new THREE.Mesh(new THREE.PlaneGeometry(600,600),matFloor);
        floor.rotation.x=-Math.PI/2; floor.position.y=-0.5; mapGroup.add(floor);

        // Центральный круг (декор)
        const centerCircle=new THREE.Mesh(new THREE.CircleGeometry(8,32),new THREE.MeshPhongMaterial({color:0x444038,shininess:6,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-8}));
        centerCircle.rotation.x=-Math.PI/2; centerCircle.position.y=-0.48; mapGroup.add(centerCircle);
        const centerRing=new THREE.Mesh(new THREE.RingGeometry(7.6,8.2,32),new THREE.MeshBasicMaterial({color:0xffcc00,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-9}));
        centerRing.rotation.x=-Math.PI/2; centerRing.position.y=-0.47; mapGroup.add(centerRing);
        // Эмблема — звезда в центре
        const starShape=new THREE.Shape();
        const starPts=10, sOut=4.5, sIn=1.9;
        for(let i=0;i<starPts;i++){
            const ang=i*Math.PI/starPts - Math.PI/2;
            const rr=i%2===0?sOut:sIn;
            const sx=Math.cos(ang)*rr, sz=Math.sin(ang)*rr;
            if(i===0) starShape.moveTo(sx,sz); else starShape.lineTo(sx,sz);
        }
        starShape.closePath();
        const starGeo=new THREE.ShapeGeometry(starShape);
        const star=new THREE.Mesh(starGeo,new THREE.MeshBasicMaterial({color:0xffcc00,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-10}));
        star.rotation.x=-Math.PI/2; star.position.y=-0.46; mapGroup.add(star);

        // Линии «дорожек» от спавнов к центру (4 направления)
        const matLine=new THREE.MeshBasicMaterial({color:0xeec040,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-8});
        for(let r=0;r<4;r++) {
            const lane=new THREE.Mesh(new THREE.PlaneGeometry(160,0.5),matLine);
            lane.rotation.x=-Math.PI/2; lane.rotation.z=r*Math.PI/4;
            lane.position.y=-0.48; mapGroup.add(lane);
        }

        // ── ПЕРИМЕТР — НИЗКИЕ СТЕНЫ С ЯРКОЙ ПОЛОСОЙ ──────────────────────
        const WALL_H=8, WALL_T=4, WALL_R=95;
        for(const [w,d,x,z] of [
            [WALL_R*2+WALL_T*2, WALL_T, 0,-WALL_R],
            [WALL_R*2+WALL_T*2, WALL_T, 0, WALL_R],
            [WALL_T, WALL_R*2-WALL_T*2,-WALL_R,0],
            [WALL_T, WALL_R*2-WALL_T*2, WALL_R,0],
        ]) {
            addBox(w,WALL_H,d,x,0,z,matWall);
            // Верхняя кромка — тёмный бордюр
            addBox(w+0.4,0.8,d+0.4,x,WALL_H,z,matWallTop,true);
            // Жёлтая полоса безопасности на высоте 4
            const stripe=new THREE.Mesh(
                w>d ? new THREE.BoxGeometry(w*0.96,0.5,d+0.06)
                    : new THREE.BoxGeometry(w+0.06,0.5,d*0.96),
                matStripe);
            stripe.position.set(x,3.0,z); mapGroup.add(stripe);
        }

        // Угловые столбы периметра — массивнее, как в ТО
        for(let [cx,cz] of [[-WALL_R,-WALL_R],[WALL_R,-WALL_R],[-WALL_R,WALL_R],[WALL_R,WALL_R]]) {
            addBox(7,WALL_H+2,7,cx,0,cz,matWallTop);
            // Колпачок-кубик сверху
            addBox(7.6,1.5,7.6,cx,WALL_H+2,cz,matKubeYel,true);
            // Сигнальная лампочка
            const lamp=new THREE.Mesh(new THREE.SphereGeometry(0.45,8,8),new THREE.MeshBasicMaterial({color:0xff3300}));
            lamp.position.set(cx,WALL_H+4.2,cz); mapGroup.add(lamp);
        }

        // Прожекторы по углам (декорация наверху)
        for(let [cx,cz,tx,tz] of [[-WALL_R,-WALL_R, 0,0],[WALL_R,-WALL_R,0,0],[-WALL_R,WALL_R,0,0],[WALL_R,WALL_R,0,0]]) {
            const proj=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.0,1.8),matMetal);
            proj.position.set(cx*0.95,WALL_H+3,cz*0.95);
            proj.lookAt(new THREE.Vector3(0,WALL_H+2,0));
            mapGroup.add(proj);
            const beam=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.4,0.5),new THREE.MeshBasicMaterial({color:0xffffcc}));
            beam.position.copy(proj.position).add(new THREE.Vector3(0,0,-0.9).applyEuler(proj.rotation));
            mapGroup.add(beam);
        }

        // ── КУБЫ — основной геймплейный элемент карты ────────────────────
        // Большие кубы (3×3×3) — основные укрытия
        function addBigKube(x,z,mat,rot=0) {
            const k=new THREE.Mesh(new THREE.BoxGeometry(6,6,6),mat);
            k.position.set(x,3.0,z); k.rotation.y=rot; mapGroup.add(k);
            mapObjects.push(new THREE.Box3().setFromObject(k));
            // Чёрная окантовка сверху
            const cap=new THREE.Mesh(new THREE.BoxGeometry(6.2,0.25,6.2),new THREE.MeshPhongMaterial({color:0x222222,shininess:30}));
            cap.position.set(x,6.13,z); cap.rotation.y=rot; mapGroup.add(cap);
            // Болты по верхним углам
            for(const [bx,bz] of [[-2.5,-2.5],[2.5,-2.5],[-2.5,2.5],[2.5,2.5]]) {
                const bolt=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.18,0.18,8),new THREE.MeshPhongMaterial({color:0x555555,shininess:60}));
                bolt.position.set(x+bx,6.25,z+bz); bolt.rotation.y=rot; mapGroup.add(bolt);
            }
        }
        function addSmallKube(x,z,mat) {
            const k=new THREE.Mesh(new THREE.BoxGeometry(3.5,3.5,3.5),mat);
            k.position.set(x,1.75,z); mapGroup.add(k);
            mapObjects.push(new THREE.Box3().setFromObject(k));
            const cap=new THREE.Mesh(new THREE.BoxGeometry(3.6,0.18,3.6),new THREE.MeshPhongMaterial({color:0x222222,shininess:30}));
            cap.position.set(x,3.59,z); mapGroup.add(cap);
        }
        function addStackedKubes(x,z,m1,m2) {
            const k=new THREE.Mesh(new THREE.BoxGeometry(5,5,5),m1);
            k.position.set(x,2.5,z); mapGroup.add(k);
            mapObjects.push(new THREE.Box3().setFromObject(k));
            const k2=new THREE.Mesh(new THREE.BoxGeometry(3.2,3.2,3.2),m2);
            k2.position.set(x,5.0+1.6,z); k2.rotation.y=Math.PI/6; mapGroup.add(k2);
        }

        // Симметричная расстановка кубов — стиль арен ТО
        const kubeMats=[matKubeGray,matKubeRed,matKubeBlue,matKubeYel];
        const pickMat=()=>kubeMats[Math.floor(Math.random()*kubeMats.length)];
        // Большие кубы по ромбу
        addBigKube(-32,-32,matKubeGray); addBigKube(32,-32,matKubeRed);
        addBigKube(-32, 32,matKubeBlue); addBigKube(32, 32,matKubeYel);
        addBigKube(-60,  0,matKubeGray,Math.PI/4); addBigKube(60,  0,matKubeGray,Math.PI/4);
        addBigKube(  0,-60,matKubeRed,Math.PI/4);  addBigKube(  0, 60,matKubeBlue,Math.PI/4);
        // Малые кубы — внутри
        addSmallKube(-18, 0,matKubeYel); addSmallKube(18, 0,matKubeYel);
        addSmallKube( 0,-18,matKubeGray); addSmallKube(0, 18,matKubeGray);
        addSmallKube(-22,-50,matKubeRed); addSmallKube(22,-50,matKubeRed);
        addSmallKube(-22, 50,matKubeBlue); addSmallKube(22, 50,matKubeBlue);
        // Сложные конструкции из 2 кубов
        addStackedKubes(-52,-52,matKubeGray,matKubeRed);
        addStackedKubes( 52,-52,matKubeRed,matKubeYel);
        addStackedKubes(-52, 52,matKubeBlue,matKubeGray);
        addStackedKubes( 52, 52,matKubeYel,matKubeBlue);
        // Боковые длинные кубы-баррикады
        for(let [x,z,w,d] of [
            [-78,-15, 5,16], [78,-15, 5,16], [-78,15, 5,16], [78,15, 5,16],
            [-15,-78,16, 5], [15,-78,16, 5], [-15,78,16, 5], [15,78,16, 5]
        ]) {
            const m=new THREE.Mesh(new THREE.BoxGeometry(w,4,d),matKubeGray);
            m.position.set(x,2,z); mapGroup.add(m);
            mapObjects.push(new THREE.Box3().setFromObject(m));
            const cap=new THREE.Mesh(new THREE.BoxGeometry(w+0.2,0.2,d+0.2),new THREE.MeshPhongMaterial({color:0x222222,shininess:30}));
            cap.position.set(x,4.11,z); mapGroup.add(cap);
        }
        // Низкие плиты для пристрелки — посередине каждой четверти
        for(let [x,z] of [[-45,0],[45,0],[0,-45],[0,45]]) {
            const slab=new THREE.Mesh(new THREE.BoxGeometry(7,1.5,2.5),matKubeYel);
            slab.position.set(x,0.75,z); mapGroup.add(slab);
            mapObjects.push(new THREE.Box3().setFromObject(slab));
        }

        // ── ВЫШКА В ЦЕНТРЕ (декор + укрытие) ─────────────────────────────
        // Постамент звезды
        const podiumBase=new THREE.Mesh(new THREE.CylinderGeometry(9,10,1.6,16),matKubeGray);
        podiumBase.position.set(0,0.8,0); mapGroup.add(podiumBase);
        mapObjects.push(new THREE.Box3().setFromObject(podiumBase));
        const podiumRing=new THREE.Mesh(new THREE.TorusGeometry(9.2,0.18,8,32),new THREE.MeshBasicMaterial({color:0xffcc00}));
        podiumRing.rotation.x=-Math.PI/2; podiumRing.position.y=1.6; mapGroup.add(podiumRing);

        // ── СТРОИТЕЛЬНАЯ ТЕХНИКА — декор ──────────────────────────────────
        // Бочки группами
        const barrelMat=new THREE.MeshPhongMaterial({color:0x3a5a18,shininess:20});
        const barrelRingMat=new THREE.MeshPhongMaterial({color:0x222222,shininess:30});
        function addArenaBarrel(x,z,col=0x3a5a18) {
            const m=new THREE.MeshPhongMaterial({color:col,shininess:20});
            const body=new THREE.Mesh(new THREE.CylinderGeometry(0.78,0.78,1.85,12),m);
            body.position.set(x,0.93,z); mapGroup.add(body);
            for(let ry of [0.3,0.95,1.6]){
                const r=new THREE.Mesh(new THREE.CylinderGeometry(0.82,0.82,0.08,12),barrelRingMat);
                r.position.set(x,ry,z); mapGroup.add(r);
            }
            mapObjects.push(new THREE.Box3().setFromObject(body));
        }
        for(let [bx,bz,bc] of [
            [-72,-72,0x4a3a20],[-70,-74,0x3a5a18],[-74,-70,0x5a3a18],
            [ 72,-72,0x3a5a18],[ 74,-70,0x4a3a20],[ 70,-74,0x5a3a18],
            [-72, 72,0x5a3a18],[-70, 74,0x3a5a18],[-74, 70,0x4a3a20],
            [ 72, 72,0x4a3a20],[ 74, 70,0x5a3a18],[ 70, 74,0x3a5a18]
        ]) addArenaBarrel(bx,bz,bc);

        // ── РЕКЛАМНЫЕ ЩИТЫ С НАДПИСЯМИ TANKI ONLINE ──────────────────────
        function makeBillboardTex(text='TANKI ONLINE',sub='КУБИКИ') {
            const c=document.createElement('canvas'); c.width=512; c.height=128;
            const ctx=c.getContext('2d');
            // Чёрный фон с градиентом
            const g2=ctx.createLinearGradient(0,0,0,128);
            g2.addColorStop(0,'#0a0a0a'); g2.addColorStop(0.5,'#1a1a1a'); g2.addColorStop(1,'#000000');
            ctx.fillStyle=g2; ctx.fillRect(0,0,512,128);
            // Жёлтая рамка
            ctx.strokeStyle='#ffcc00'; ctx.lineWidth=6; ctx.strokeRect(4,4,504,120);
            ctx.strokeStyle='#cc9900'; ctx.lineWidth=2; ctx.strokeRect(10,10,492,108);
            // Главный текст — зелёный неон
            ctx.font='bold 56px Oswald, Arial';
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.shadowColor='#6cce00'; ctx.shadowBlur=18;
            ctx.fillStyle='#8eff00'; ctx.fillText(text,256,52);
            ctx.shadowBlur=0;
            // Под-текст
            ctx.font='bold 22px Oswald, Arial';
            ctx.fillStyle='#ffcc00'; ctx.fillText(sub,256,98);
            const t=new THREE.CanvasTexture(c);
            return t;
        }
        for(let [bx,bz,ry] of [[0,-94,0],[0,94,Math.PI],[-94,0,Math.PI/2],[94,0,-Math.PI/2]]) {
            const board=new THREE.Mesh(new THREE.PlaneGeometry(16,4),new THREE.MeshBasicMaterial({map:makeBillboardTex('TANKI ONLINE','КУБИКИ'),side:THREE.DoubleSide}));
            board.position.set(bx,WALL_H-1.5,bz); board.rotation.y=ry; mapGroup.add(board);
            // Опоры под щитом
            for(let oxs of [-7,7]) {
                const pst=new THREE.Mesh(new THREE.BoxGeometry(0.4,3.5,0.4),matMetal);
                pst.position.set(bx+(ry===0||ry===Math.PI?oxs:0),WALL_H-3.5,bz+(ry===0||ry===Math.PI?0:oxs));
                mapGroup.add(pst);
            }
        }

        // ── ДЕРЕВЯННЫЕ ЯЩИКИ ВДОЛЬ КРАЁВ ──────────────────────────────────
        const matWood=new THREE.MeshPhongMaterial({color:0x7a5a2a,shininess:8});
        const matWoodDark=new THREE.MeshPhongMaterial({color:0x3a2800,shininess:8});
        function addWoodCrate(x,z,s=2.2) {
            const cr=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),matWood);
            cr.position.set(x,s/2,z); mapGroup.add(cr);
            mapObjects.push(new THREE.Box3().setFromObject(cr));
            for(let ax of ['x','z']){
                const st=new THREE.Mesh(new THREE.BoxGeometry(ax==='x'?s+0.06:0.16,0.16,ax==='z'?s+0.06:0.16),matWoodDark);
                st.position.set(x,s*0.55,z); mapGroup.add(st);
                const st2=st.clone(); st2.position.y=s*0.82; mapGroup.add(st2);
            }
        }
        for(let [cx,cz] of [
            [-80,-50],[-82,-46],[80,50],[82,46],[80,-50],[-80,50]
        ]) addWoodCrate(cx,cz);

        // ── ФОНАРНЫЕ СТОЛБЫ ──────────────────────────────────────────────
        function addArenaLamp(x,z) {
            const post=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.22,9,8),new THREE.MeshPhongMaterial({color:0x3a3830,shininess:30}));
            post.position.set(x,4.5,z); mapGroup.add(post);
            const head=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.4,1.6),matMetal);
            head.position.set(x,9.0,z); mapGroup.add(head);
            const globe=new THREE.Mesh(new THREE.SphereGeometry(0.55,12,10),new THREE.MeshBasicMaterial({color:0xffffcc}));
            globe.position.set(x,8.85,z); mapGroup.add(globe);
            // Лёгкий точечный свет
            const pt=new THREE.PointLight(0xffeecc,0.45,28);
            pt.position.set(x,8.5,z); mapGroup.add(pt);
        }
        for(let [lx,lz] of [
            [-WALL_R+8,-WALL_R+8],[WALL_R-8,-WALL_R+8],[-WALL_R+8,WALL_R-8],[WALL_R-8,WALL_R-8],
            [0,-WALL_R+8],[0,WALL_R-8],[-WALL_R+8,0],[WALL_R-8,0]
        ]) addArenaLamp(lx,lz);

    } else {
        // ======= ТИШИНА (Silence) — стиль Танки Онлайн 2012 =======
        sceneBat.background=new THREE.Color(0xc8b87a);
        sceneBat.fog=new THREE.FogExp2(0xd4c48a,0.005);

        // Дополнительный свет для глубины
        const sunLight=new THREE.DirectionalLight(0xfff5d0,1.1);
        sunLight.position.set(80,120,60); sceneBat.add(sunLight);
        const ambSil=new THREE.AmbientLight(0xffeebb,0.6); sceneBat.add(ambSil);

        // --- ТЕКСТУРЫ ---
        function makeSandTex() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle='#c8a84a'; ctx.fillRect(0,0,256,256);
            for(let i=0;i<800;i++){
                ctx.fillStyle=`rgba(${140+Math.random()*60|0},${100+Math.random()*40|0},${30+Math.random()*30|0},0.3)`;
                ctx.fillRect(Math.random()*256,Math.random()*256,2+Math.random()*4,1+Math.random()*2);
            }
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(30,30); return t;
        }
        function makeConcWallTex(r,g,b) {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(0,0,256,256);
            // Горизонтальные швы
            ctx.strokeStyle=`rgba(0,0,0,0.25)`; ctx.lineWidth=2;
            for(let y=0;y<256;y+=32){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke(); }
            // Вертикальные блоки (кладка)
            for(let row=0;row<8;row++){
                const offset=row%2===0?0:64;
                for(let x=offset;x<256+64;x+=128){ ctx.beginPath();ctx.moveTo(x,row*32);ctx.lineTo(x,row*32+32);ctx.stroke(); }
            }
            // Царапины
            for(let i=0;i<30;i++){
                ctx.strokeStyle=`rgba(0,0,0,0.08)`; ctx.lineWidth=1;
                ctx.beginPath(); const sx=Math.random()*256; ctx.moveTo(sx,Math.random()*256); ctx.lineTo(sx+Math.random()*20-10,Math.random()*256); ctx.stroke();
            }
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(3,3); return t;
        }
        function makeRoofTex() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle='#4a3a2a'; ctx.fillRect(0,0,256,256);
            for(let y=0;y<256;y+=12){
                ctx.fillStyle=y%24<12?'#3a2e1e':'#5a4632';
                ctx.fillRect(0,y,256,12);
            }
            for(let i=0;i<50;i++){ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(Math.random()*256,Math.random()*256,8,3);}
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(4,4); return t;
        }
        function makeBrickTex() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle='#7a3020'; ctx.fillRect(0,0,256,256);
            for(let row=0;row<16;row++){
                const by=row*16; const offset=row%2===0?0:32;
                for(let bx=offset-32;bx<256;bx+=64){
                    const br=110+Math.random()*20|0, bg=40+Math.random()*15|0, bb=20+Math.random()*10|0;
                    ctx.fillStyle=`rgb(${br},${bg},${bb})`;
                    ctx.fillRect(bx+1,by+1,62,14);
                }
            }
            ctx.strokeStyle='#3a1808'; ctx.lineWidth=2;
            for(let row=0;row<16;row++){const by=row*16;ctx.beginPath();ctx.moveTo(0,by);ctx.lineTo(256,by);ctx.stroke();}
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(3,4); return t;
        }
        function makeMetalTex() {
            const c=document.createElement('canvas'); c.width=256; c.height=256;
            const ctx=c.getContext('2d');
            ctx.fillStyle='#5a5a5a'; ctx.fillRect(0,0,256,256);
            for(let i=0;i<256;i+=8){ctx.fillStyle=i%16<8?'#525252':'#626262';ctx.fillRect(0,i,256,8);}
            for(let i=0;i<40;i++){ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fillRect(Math.random()*256,Math.random()*256,Math.random()*40,2);}
            const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(4,4); return t;
        }
        function makeWinTex() {
            const c=document.createElement('canvas'); c.width=64; c.height=64;
            const ctx=c.getContext('2d');
            const g=ctx.createLinearGradient(0,0,64,64);
            g.addColorStop(0,'#8ab4cc'); g.addColorStop(0.5,'#c0d8e8'); g.addColorStop(1,'#7090a8');
            ctx.fillStyle=g; ctx.fillRect(0,0,64,64);
            ctx.strokeStyle='#4a6070'; ctx.lineWidth=3;
            ctx.beginPath();ctx.moveTo(32,0);ctx.lineTo(32,64);ctx.stroke();
            ctx.beginPath();ctx.moveTo(0,32);ctx.lineTo(64,32);ctx.stroke();
            ctx.strokeRect(1,1,62,62);
            return new THREE.CanvasTexture(c);
        }

        const matSand=new THREE.MeshLambertMaterial({map:makeSandTex()});
        const matConc=new THREE.MeshLambertMaterial({map:makeConcWallTex(155,148,130)});
        const matConc2=new THREE.MeshLambertMaterial({map:makeConcWallTex(140,132,115)});
        const matBrick=new THREE.MeshLambertMaterial({map:makeBrickTex()});
        const matRoof=new THREE.MeshLambertMaterial({map:makeRoofTex()});
        const matRoofFlat=new THREE.MeshLambertMaterial({color:0x3a3020});
        const matMetal=new THREE.MeshLambertMaterial({map:makeMetalTex()});
        const matDark=new THREE.MeshLambertMaterial({color:0x2a2520});
        const matWin=new THREE.MeshLambertMaterial({map:makeWinTex(),transparent:true,opacity:0.9});
        const matRust=new THREE.MeshLambertMaterial({color:0x8b4513});
        const matWood=new THREE.MeshLambertMaterial({color:0x7a5a2a});
        const matGate=new THREE.MeshLambertMaterial({color:0x3a3520});

        // --- ПОЛ ---
        const floor=new THREE.Mesh(new THREE.PlaneGeometry(600,600),matSand);
        floor.rotation.x=-Math.PI/2; floor.position.y=-0.5; mapGroup.add(floor);

        // Асфальтовая дорога через центр — лежит прямо на земле
        const aspTex=texAsphalt.clone(); aspTex.repeat.set(2,20); aspTex.needsUpdate=true;
        const matAsp=new THREE.MeshLambertMaterial({map:aspTex,color:0x888070,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4});
        const road=new THREE.Mesh(new THREE.PlaneGeometry(14,220),matAsp);
        road.rotation.x=-Math.PI/2; road.position.set(0,-0.48,0); mapGroup.add(road);
        // Поперечная дорога
        const road2=new THREE.Mesh(new THREE.PlaneGeometry(220,14),matAsp);
        road2.rotation.x=-Math.PI/2; road2.position.set(0,-0.48,0); mapGroup.add(road2);

        // --- ПЕРИМЕТР — ВЫСОКИЕ БЕТОННЫЕ СТЕНЫ (как в ТО) ---
        const WALL_H=16, WALL_T=6;
        // Внешние стены
        addBox(240,WALL_H,WALL_T, 0,0,-118,matConc);
        addBox(240,WALL_H,WALL_T, 0,0, 118,matConc);
        addBox(WALL_T,WALL_H,240,-118,0,0,matConc);
        addBox(WALL_T,WALL_H,240, 118,0,0,matConc);
        // Верхний бордюр стен
        addBox(240,2,WALL_T+2, 0,WALL_H,-118,matConc2);
        addBox(240,2,WALL_T+2, 0,WALL_H, 118,matConc2);
        addBox(WALL_T+2,2,240,-118,WALL_H,0,matConc2);
        addBox(WALL_T+2,2,240, 118,WALL_H,0,matConc2);

        // Ворота (проёмы) — арочные
        function addGate(x,z,rot) {
            const gW=14, gH=12;
            const pMat=matConc;
            if(rot===0) {
                // Верхняя перемычка ворот
                addBox(gW,4,WALL_T+1, x,gH,z,matGate);
                // Боковые столбы
                addBox(3,gH,WALL_T+1, x-gW/2-1.5,0,z,pMat);
                addBox(3,gH,WALL_T+1, x+gW/2+1.5,0,z,pMat);
            } else {
                addBox(WALL_T+1,4,gW, x,gH,z,matGate);
                addBox(WALL_T+1,gH,3, x,0,z-gW/2-1.5,pMat);
                addBox(WALL_T+1,gH,3, x,0,z+gW/2+1.5,pMat);
            }
        }
        addGate(0,118,0); addGate(0,-118,0);
        addGate(118,0,1); addGate(-118,0,1);

        // --- СТОРОЖЕВЫЕ БАШНИ ПО УГЛАМ ---
        function addTower(x,z) {
            const tMat=matConc2;
            addBox(8,20,8,x,0,z,tMat);
            // Платформа наверху
            const platform=new THREE.Mesh(new THREE.BoxGeometry(12,1.5,12),tMat);
            platform.position.set(x,20.75,z); mapGroup.add(platform);
            // Бойницы
            const battleMat=matDark;
            for(let dx of [-4,0,4]) {addBox(2,2,1,x+dx,21.5,z+6.5,battleMat,true);addBox(2,2,1,x+dx,21.5,z-6.5,battleMat,true);}
            for(let dz of [-4,0,4]) {addBox(1,2,2,x+6.5,21.5,z+dz,battleMat,true);addBox(1,2,2,x-6.5,21.5,z+dz,battleMat,true);}
            // Лестница
            for(let i=0;i<8;i++){const step=new THREE.Mesh(new THREE.BoxGeometry(2,0.4,1),matMetal);step.position.set(x+3.5,i*2.4+1,z+2.5);mapGroup.add(step);}
        }
        addTower(-104,-104); addTower(104,-104); addTower(-104,104); addTower(104,104);

        // --- ГЛАВНОЕ ЗДАНИЕ (3-этажное, центр-лево) ---
        function addDetailedBuilding(x,z,w,h,d,wallM,roofM,windows=true) {
            addBox(w,h,d,x,0,z,wallM);
            // Крыша
            const roof=new THREE.Mesh(new THREE.BoxGeometry(w+1,1.2,d+1),roofM);
            roof.position.set(x,h+0.6,z); mapGroup.add(roof);
            if(!windows) return;
            // Окна по фасаду
            const floors=Math.max(1,Math.floor(h/4));
            for(let fl=0;fl<floors;fl++){
                const wy=3+fl*4;
                const cols=Math.max(1,Math.floor(w/6));
                for(let col=0;col<cols;col++){
                    const wx=x-w/2+3+col*6;
                    const wf=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.4,0.2),matWin);
                    wf.position.set(wx,wy,z+d/2+0.11); mapGroup.add(wf);
                    const wb=wf.clone(); wb.position.z=z-d/2-0.11; mapGroup.add(wb);
                }
            }
            // Этажные карнизы
            for(let fl=1;fl<floors;fl++){
                const ledge=new THREE.Mesh(new THREE.BoxGeometry(w+0.6,0.5,d+0.6),matConc2);
                ledge.position.set(x,fl*4+0.25,z); mapGroup.add(ledge);
            }
        }

        // Большое 3-этажное здание (центр-лево)
        addDetailedBuilding(-45,-30,22,18,18,matConc,matRoof);
        // Кирпичный завод (справа)
        addDetailedBuilding(50,40,20,14,16,matBrick,matRoofFlat);
        addDetailedBuilding(50,-40,18,12,14,matBrick,matRoofFlat);
        // Склады (малые)
        addDetailedBuilding(-60,60,16,8,20,matConc2,matRoof,false);
        addDetailedBuilding(-60,-60,16,8,20,matConc2,matRoof,false);
        addDetailedBuilding(70,0,12,9,14,matBrick,matRoofFlat,true);

        // --- МЕТАЛЛИЧЕСКИЕ ВЫШКИ (нефтяные) ---
        function addDerrick(x,z,h=28) {
            const mats=matRust;
            // 4 ноги
            for(let [dx,dz] of [[-2,-2],[2,-2],[-2,2],[2,2]]){
                const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.25,h,6),mats);
                leg.position.set(x+dx,h/2,z+dz);
                leg.rotation.z=(dx>0?-1:1)*0.12; leg.rotation.x=(dz>0?-1:1)*0.12;
                mapGroup.add(leg);
            }
            // Горизонтальные распорки
            for(let y=4;y<h;y+=6){
                for(let [ax,az,bx,bz] of [[-2,-2,2,-2],[-2,2,2,2],[-2,-2,-2,2],[2,-2,2,2]]){
                    const cross=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,4.1,4),mats);
                    cross.position.set(x+(ax+bx)/2,y,z+(az+bz)/2);
                    if(ax===bx) cross.rotation.z=Math.PI/2; else cross.rotation.x=Math.PI/2;
                    mapGroup.add(cross);
                }
            }
            // Верхняя площадка
            const top=new THREE.Mesh(new THREE.BoxGeometry(1,h,1),mats);
            top.position.set(x,h/2,z); mapGroup.add(top);
        }
        addDerrick(-80,-20,30); addDerrick(-80,20,28); addDerrick(20,-80,26);
        addDerrick(80,20,30); addDerrick(-20,80,24); addDerrick(60,-80,26);

        // --- КОНТЕЙНЕРЫ / ЯЩИКИ ---
        function addContainer(x,z,ry=0) {
            const colors=[0x4a7a3a,0x8b4513,0x3a4a6a,0x7a6a2a];
            const col=colors[Math.floor(Math.random()*colors.length)];
            const mat=new THREE.MeshLambertMaterial({color:col});
            const cont=new THREE.Mesh(new THREE.BoxGeometry(6,3,2.5),mat);
            cont.position.set(x,1.5,z); cont.rotation.y=ry; mapGroup.add(cont);
            mapObjects.push(new THREE.Box3().setFromObject(cont));
            // Рёбра контейнера
            const ribMat=new THREE.MeshLambertMaterial({color:0x222222});
            for(let rx=-2.5;rx<=2.5;rx+=1.25){
                const rib=new THREE.Mesh(new THREE.BoxGeometry(0.12,3.1,2.6),ribMat);
                rib.position.set(x+rx,1.5,z); rib.rotation.y=ry; mapGroup.add(rib);
            }
        }
        addContainer(-30,70); addContainer(-30,74.5); addContainer(-30,79);
        addContainer(30,-70); addContainer(30,-74.5);
        addContainer(-75,0,Math.PI/2); addContainer(-75,5,Math.PI/2);
        addContainer(0,55); addContainer(5,55);
        addContainer(-50,0);

        // Деревянные ящики
        function addCrate(x,z,s=2.2) {
            const cr=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),matWood);
            cr.position.set(x,s/2,z); mapGroup.add(cr);
            mapObjects.push(new THREE.Box3().setFromObject(cr));
            const strMat=new THREE.MeshLambertMaterial({color:0x3a2800});
            for(let ax of ['x','z']){
                const st=new THREE.Mesh(new THREE.BoxGeometry(ax==='x'?s+0.05:0.15,0.15,ax==='z'?s+0.05:0.15),strMat);
                st.position.set(x,s*0.6,z); mapGroup.add(st);
            }
        }
        for(let [cx,cz] of [[15,25],[-15,25],[15,-25],[-15,-25],[35,0],[-35,0],[0,35],[0,-35],[55,55],[-55,55],[55,-55],[-55,-55]])
            addCrate(cx,cz);

        // --- БОЧКИ ---
        function addBarrel(x,z) {
            const mat=new THREE.MeshLambertMaterial({color:0x4a3a20});
            const body=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.7,1.8,10),mat);
            body.position.set(x,0.9,z); mapGroup.add(body);
            const rimMat=new THREE.MeshLambertMaterial({color:0x2a2a2a});
            for(let ry of [0.4,0.9,1.4]){const rim=new THREE.Mesh(new THREE.CylinderGeometry(0.75,0.75,0.1,10),rimMat);rim.position.set(x,ry,z);mapGroup.add(rim);}
            mapObjects.push(new THREE.Box3().setFromObject(body));
        }
        for(let [bx,bz] of [[-20,15],[-20,18],[-20,21],[20,15],[20,18],[60,25],[60,28],[-60,-25],[-60,-28]])
            addBarrel(bx,bz);

        // --- БОЛЬШИЕ ТРУБЫ (лежачие) ---
        function addPipe(x,z,ry=0) {
            const mat=new THREE.MeshLambertMaterial({color:0x6a5a3a});
            const pipe=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,12,12),mat);
            pipe.rotation.z=Math.PI/2; pipe.rotation.y=ry;
            pipe.position.set(x,1.2,z); mapGroup.add(pipe);
            mapObjects.push(new THREE.Box3().setFromObject(pipe));
        }
        addPipe(-5,50); addPipe(-5,30,Math.PI/4); addPipe(40,10,Math.PI/2);

        // --- ДЕРЕВЬЯ ---
        function addTree(x,z,h=8) {
            const trunkMat=new THREE.MeshLambertMaterial({color:0x4a2e0a});
            const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.55,h*0.45,8),trunkMat);
            trunk.position.set(x,h*0.225,z); mapGroup.add(trunk);
            const leafMat=new THREE.MeshLambertMaterial({color:0x2d6010});
            const leafMat2=new THREE.MeshLambertMaterial({color:0x3a7a18});
            const l1=new THREE.Mesh(new THREE.ConeGeometry(h*0.45,h*0.6,10),leafMat);
            l1.position.set(x,h*0.6,z); mapGroup.add(l1);
            const l2=new THREE.Mesh(new THREE.ConeGeometry(h*0.35,h*0.5,10),leafMat2);
            l2.position.set(x,h*0.88,z); mapGroup.add(l2);
            const l3=new THREE.Mesh(new THREE.ConeGeometry(h*0.22,h*0.38,10),leafMat);
            l3.position.set(x,h*1.1,z); mapGroup.add(l3);
        }
        for(let [tx,tz,th] of [
            [-90,30,9],[-90,-30,11],[-90,60,8],[-90,-60,10],
            [90,30,10],[90,-30,9],[90,60,11],[90,-60,8],
            [-30,90,9],[30,90,10],[-30,-90,10],[30,-90,9],
            [-65,0,7],[-65,10,8]
        ]) addTree(tx,tz,th);

        // --- БЕТОННЫЕ УКРЫТИЯ / БАРРИКАДЫ ---
        function addBarricade(x,z,w,ry=0) {
            const bar=new THREE.Mesh(new THREE.BoxGeometry(w,2.5,0.8),matConc2);
            bar.position.set(x,1.25,z); bar.rotation.y=ry; mapGroup.add(bar);
            mapObjects.push(new THREE.Box3().setFromObject(bar));
        }
        addBarricade(-5,-55,16); addBarricade(-5,55,16);
        addBarricade(40,30,10,Math.PI/6); addBarricade(40,-30,10,-Math.PI/6);
        addBarricade(-40,30,10,-Math.PI/6); addBarricade(-40,-30,10,Math.PI/6);
        addBarricade(0,15,8,Math.PI/2); addBarricade(0,-15,8,Math.PI/2);

        // --- ЦЕНТРАЛЬНЫЙ ДВОРИК (приподнятая платформа) ---
        // addBox ставит центр на y+h/2, т.е. y=0 → нижняя грань на земле (Y=0)
        const courtMat=new THREE.MeshLambertMaterial({map:makeConcWallTex(130,120,100)});
        addBox(30,1.5,30,-50,0,0,courtMat);  // платформа: нижняя грань на Y=0, верхняя на Y=1.5

        // Пандус к платформе с востока — плавный въезд, угол ≈ 8.5°
        const rampGeom=new THREE.BoxGeometry(10,0.4,8);
        const ramp=new THREE.Mesh(rampGeom,courtMat);
        ramp.position.set(-35.2,0.38,0);
        ramp.rotation.z=0.148;   // подъём 1.5ед на 10ед длины = atan(1.5/10)
        mapGroup.add(ramp);
        mapObjects.push(new THREE.Box3().setFromObject(ramp));

        // Пандус с запада (симметричный)
        const rampW=ramp.clone();
        rampW.position.set(-64.8,0.38,0);
        rampW.rotation.z=-0.148;
        mapGroup.add(rampW);
        mapObjects.push(new THREE.Box3().setFromObject(rampW));

        // --- АРКИ / ТУННЕЛЬ (ворота по центральной дороге) ---
        // addBox(w,h,d,x,y,z) ставит центр на y+h/2, y=0 → столб стоит на земле
        addBox(4,10,4, -7,0,-20,matConc);  // левый столб северной арки
        addBox(4,10,4,  7,0,-20,matConc);  // правый столб
        addBox(4,10,4, -7,0, 20,matConc);  // левый столб южной арки
        addBox(4,10,4,  7,0, 20,matConc);  // правый столб
        // Перекладины: верх столбов на Y=10, перекладина (h=2) → нижняя грань на Y=10 → y=10
        addBox(18,2,4,  0,10,-20,matConc); // перекладина северной арки
        addBox(18,2,4,  0,10, 20,matConc); // перекладина южной арки

        // --- МУСОР / ДЕТАЛИ ---
        // Сломанный столб — наклонён и стоит на земле (Y = half-height * cos(tilt))
        const poleM=new THREE.MeshLambertMaterial({color:0x5a5040});
        const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.25,6,8),poleM);
        pole.position.set(25,2.4,-45); pole.rotation.z=0.4; mapGroup.add(pole); // Y=2.4 ≈ cos(0.4)*3
        // Вертикальные столбы — стоят точно на земле (высота 5 → Y=2.5)
        for(let [px,pz] of [[-45,45],[45,-45],[45,45],[-45,-45]]) {
            const p2=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.2,5,6),poleM);
            p2.position.set(px,2.5,pz); mapGroup.add(p2);
        }
    }
    // Z-FIGHTING FIX — все меши карты
    mapGroup.traverse(o=>{if(!o.isMesh)return;[].concat(o.material).forEach(m=>{if(!m)return;m.polygonOffset=true;m.polygonOffsetFactor=1;m.polygonOffsetUnits=2;});});
}
 
// ==========================================
// СПАВН / КОЛЛИЗИИ
// ==========================================
function getGroundHeight(pos, startY) {
    const rc=new THREE.Raycaster(new THREE.Vector3(pos.x,(startY||0)+40,pos.z),new THREE.Vector3(0,-1,0),0,120);
    const hits=rc.intersectObjects(mapGroup.children,true);
    if(hits.length>0) {
        let maxY=-200;
        for(let h of hits) if(h.point.y>maxY&&h.point.y<(startY||0)+35) maxY=h.point.y;
        return maxY>-200?maxY:0;
    }
    return 0;
}
 
function checkCollision(pos) {
    const pBox=new THREE.Box3().setFromCenterAndSize(pos.clone().add(new THREE.Vector3(0,1.2,0)),new THREE.Vector3(1.9,2.0,2.8));
    for(let b of mapObjects) if(pBox.intersectsBox(b)) return true;
    return false;
}
 
function getSafeSpawnPos() {
    for(let i=0;i<60;i++) {
        const x=(Math.random()-0.5)*140;
        const z=(Math.random()-0.5)*140;
        const y=getGroundHeight({x,z},40);
        const pos=new THREE.Vector3(x,y,z);
        if(!checkCollision(pos)) return pos;
    }
    return new THREE.Vector3(0,2,0);
}
 
// ==========================================
// НИКНЕЙМЫ НАД ТАНКОМ
// ==========================================
function addNameSprite(tankMesh,name,isMe) {
    const old=tankMesh.getObjectByName('nameTag');
    if(old) tankMesh.remove(old);
    const c=document.createElement('canvas'); c.width=256; c.height=64;
    const ctx=c.getContext('2d');
    ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(28,10,200,44);
    ctx.strokeStyle=isMe?'#6cce00':'#cc2222'; ctx.lineWidth=2; ctx.strokeRect(28,10,200,44);
    ctx.font='bold 22px Tahoma'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowColor=isMe?'#6cce00':'#ff3333'; ctx.shadowBlur=8;
    ctx.fillStyle=isMe?'#8eff00':'#ff4444';
    ctx.fillText(name,128,32);
    const tex=new THREE.CanvasTexture(c);
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false}));
    sprite.name='nameTag'; sprite.scale.set(8,2,1); sprite.position.set(0,4.5,0);
    tankMesh.add(sprite);
}
 
// ==========================================
// СПАВН ТАНКОВ
// ==========================================
function spawnMyTank() {
    if(tanks[myId]) sceneBat.remove(tanks[myId].mesh);
    const obj=buildTankMesh(saveData.equipped.hull,saveData.equipped.gun,saveData.equipped.paint);
    const pos=getSafeSpawnPos(); obj.mesh.position.copy(pos);
    sceneBat.add(obj.mesh);
    addNameSprite(obj.mesh,saveData.nickname||'Игрок',true);
    tanks[myId]={
        ...obj, charge:0, reload:0, speed:0, vy:0, recoilForce:0,
        hp:DB.hulls[saveData.equipped.hull].hp, maxHp:DB.hulls[saveData.equipped.hull].hp,
        rot:0, tRot:0, id:myId, gun:saveData.equipped.gun, hull:saveData.equipped.hull,
        isBot:false, dead:false, twinsBarrel:0, charging:false, chargeTime:0, spacePressed:false,
        nickname:saveData.nickname||'Игрок', score:0, kills:0, deaths:0, tiltZ:0, tiltX:0,
        effects:{ speed:0, damage:0, armor:0, repair:0 },
        cooldowns:{ repair:0, armor:0, damage:0, speed:0, mine:0 },
        frozen:0, beamTarget:null,
        // Баллон энергии (Фриз/Изида) — полный при спавне
        energy:(()=>{const g=DB.guns[saveData.equipped.gun];return g&&g.energyMax?g.energyMax:1;})(),
        isFiring:false  // держит ли игрок Space в данный момент
    };
    updateHUD();
}
 
function spawnOnlinePlayer(p) {
    if(tanks[p.id]) sceneBat.remove(tanks[p.id].mesh);
    const obj=buildTankMesh(p.hull||'hunter',p.gun||'smoky',p.paint||'green');
    const gy=getGroundHeight({x:p.x||0,z:p.z||0},40);
    obj.mesh.position.set(p.x||0,gy,p.z||0);
    obj.mesh.rotation.y=p.rot||0; obj.turret.rotation.y=p.tRot||0;
    if(p.dead) obj.mesh.visible=false;
    sceneBat.add(obj.mesh);
    addNameSprite(obj.mesh,p.nickname||'Игрок',false);
    tanks[p.id]={...obj,id:p.id,gun:p.gun||'smoky',hp:p.hp||150,maxHp:p.maxHp||150,isBot:false,dead:p.dead||false,nickname:p.nickname||'Игрок',score:p.score||0,kills:p.kills||0,deaths:p.deaths||0,targetPos:null,targetRot:null,targetTRot:null,vy:0,tiltZ:0,effects:{speed:0,damage:0,armor:0},frozen:0};
}
 
function spawnBot(id) {
    const hulls=Object.keys(DB.hulls), guns=Object.keys(DB.guns), paints=Object.keys(DB.paints);
    const rh=hulls[Math.floor(Math.random()*hulls.length)];
    const rg=guns[Math.floor(Math.random()*guns.length)];
    const rp=paints[Math.floor(Math.random()*paints.length)];
    const obj=buildTankMesh(rh,rg,rp);
    obj.mesh.position.copy(getSafeSpawnPos());
    sceneBat.add(obj.mesh);
    const bName='Бот_'+Math.floor(Math.random()*9999);
    addNameSprite(obj.mesh,bName,false);
    tanks[id]={
        ...obj, charge:0, reload:Math.random()*2, speed:0, vy:0, recoilForce:0,
        hp:DB.hulls[rh].hp, maxHp:DB.hulls[rh].hp,
        rot:Math.random()*Math.PI*2, tRot:0, id, gun:rg, hull:rh, isBot:true,
        stuckTimer:0, dead:false, twinsBarrel:0, tiltZ:0, tiltX:0,
        nickname:bName, score:0, kills:0, deaths:0,
        effects:{speed:0,damage:0,armor:0}, frozen:0,
        wanderTimer:Math.random()*3, wanderTarget:null
    };
}
 
// ==========================================
// ВХОД В БИТВУ
// ==========================================
function joinSelectedBattle() {
    if(!selectedBattle) return;
    const bData=cachedBattles[selectedBattle]||{map:'sandbox',withBots:true};
    ['top-bar','main-container','main-bg'].forEach(id=>document.getElementById(id).style.display='none');
    document.getElementById('game-ui').style.display='block';
    document.getElementById('canvas-wrap').style.visibility='visible';
    document.getElementById('canvas-wrap').style.opacity='1';
    sceneType='battle'; camHeight=5;
    particles=[]; bullets=[]; placedMines=[]; tanks={};
    buildMap(bData.map);
    myId=(socket&&!isOffline)?socket.id:'player_'+Date.now();
    spawnMyTank();
    const bots=bData.withBots!==false?6:0;
    for(let i=0;i<bots;i++) spawnBot('bot_'+myId+'_'+i);
    try {
        if(socket&&!isOffline) socket.emit('joinBattle',selectedBattle,{hull:saveData.equipped.hull,gun:saveData.equipped.gun,paint:saveData.equipped.paint,hp:tanks[myId].maxHp,name:saveData.nickname});
    } catch(e){}
    showNotif('Бой начался! Удачи!');
}
 
function exitBattle() { window.location.reload(); }
 
// ==========================================
// ЭФФЕКТЫ — УЛУЧШЕННЫЕ ЧАСТИЦЫ
// ==========================================
function spawnFX(pos,color=0xffaa00,scale=1,count=6) {
    for(let i=0;i<count;i++) {
        const m=new THREE.Mesh(new THREE.SphereGeometry(0.12*scale+Math.random()*0.12*scale,4,4),new THREE.MeshBasicMaterial({color,transparent:true,opacity:1}));
        m.position.copy(pos); sceneBat.add(m);
        const spd=12*scale+Math.random()*10*scale;
        const theta=Math.random()*Math.PI*2, phi=Math.random()*Math.PI;
        particles.push({mesh:m,vel:new THREE.Vector3(Math.sin(phi)*Math.cos(theta)*spd,Math.cos(phi)*spd*0.8+4,Math.sin(phi)*Math.sin(theta)*spd),life:0.35,type:'spark',scene:'bat'});
    }
}
 
// ==========================================
// ЗВУК — Web Audio API (без внешних файлов)
// ==========================================
let audioCtx=null;
function getAudioCtx() {
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended') audioCtx.resume();
    return audioCtx;
}

function playSound(bufferFn, volume=1.0, pitchMult=1.0) {
    try {
        const ctx=getAudioCtx();
        const buf=bufferFn(ctx, pitchMult);
        const src=ctx.createBufferSource();
        src.buffer=buf;
        const gain=ctx.createGain();
        gain.gain.value=Math.min(1.0,volume);
        src.connect(gain); gain.connect(ctx.destination);
        src.start(0);
    } catch(e) {}
}

// ── СМОКИ: резкий одиночный выстрел (бум + хлёсткий хвост) ──────
function makeSmokyShot(ctx) {
    const sr=ctx.sampleRate, dur=0.55, buf=ctx.createBuffer(1,sr*dur,sr), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) {
        const t=i/sr;
        const env=t<0.01?t/0.01:Math.exp(-t*9);
        const boom=Math.sin(2*Math.PI*(80-70*t)*t)*env;
        const crack=(Math.random()*2-1)*Math.exp(-t*28)*0.6;
        d[i]=(boom+crack)*0.9;
    }
    return buf;
}

// ── ТВИНС: быстрый плазменный щелчок ────────────────────────────
function makeTwinsShot(ctx) {
    const sr=ctx.sampleRate, dur=0.28, buf=ctx.createBuffer(1,sr*dur,sr), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) {
        const t=i/sr;
        const env=Math.exp(-t*18);
        const plasma=Math.sin(2*Math.PI*(300+600*Math.exp(-t*20))*t)*env;
        const zap=(Math.random()*2-1)*Math.exp(-t*35)*0.3;
        d[i]=(plasma+zap)*0.75;
    }
    return buf;
}

// ── РЕЛЬСА: мощный электрический разряд ─────────────────────────
function makeRailgunShot(ctx) {
    const sr=ctx.sampleRate, dur=0.9, buf=ctx.createBuffer(1,sr*dur,sr), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) {
        const t=i/sr;
        const crack=(Math.random()*2-1)*Math.exp(-t*2)*Math.exp(-t*t*3)*1.0;
        const hum=Math.sin(2*Math.PI*60*t)*Math.exp(-t*3)*0.4;
        const zap=Math.sin(2*Math.PI*(400-300*t)*t)*Math.exp(-t*5)*0.5;
        d[i]=Math.max(-1,Math.min(1,(crack+hum+zap)*0.85));
    }
    return buf;
}

// ── ГРОМ: тяжёлый взрывной бах ──────────────────────────────────
function makeThunderShot(ctx) {
    const sr=ctx.sampleRate, dur=1.1, buf=ctx.createBuffer(1,sr*dur,sr), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) {
        const t=i/sr;
        const env=t<0.005?t/0.005:Math.exp(-t*4.5);
        const bass=Math.sin(2*Math.PI*(55-40*t)*t)*env;
        const rumble=(Math.random()*2-1)*Math.exp(-t*3)*0.5;
        const crack=(Math.random()*2-1)*Math.exp(-t*30)*0.4;
        d[i]=Math.max(-1,Math.min(1,(bass+rumble+crack)*0.9));
    }
    return buf;
}

// ── ФРИЗ: шипящая криогенная струя ──────────────────────────────
function makeFreezeShot(ctx) {
    const sr=ctx.sampleRate, dur=0.22, buf=ctx.createBuffer(1,sr*dur,sr), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) {
        const t=i/sr;
        const env=t<0.02?t/0.02:Math.exp(-t*6);
        const hiss=(Math.random()*2-1)*env*0.8;
        const tone=Math.sin(2*Math.PI*800*t)*env*0.2;
        d[i]=(hiss+tone)*0.6;
    }
    return buf;
}

// ── ИСИДА: электрический треск нанобота ─────────────────────────
function makeIsidaShot(ctx) {
    const sr=ctx.sampleRate, dur=0.18, buf=ctx.createBuffer(1,sr*dur,sr), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) {
        const t=i/sr;
        const env=Math.exp(-t*14);
        const buzz=Math.sin(2*Math.PI*(220+Math.sin(t*80)*180)*t)*env*0.5;
        const spark=(Math.random()*2-1)*Math.exp(-t*20)*0.5;
        d[i]=(buzz+spark)*0.65;
    }
    return buf;
}

// ── ВЗРЫВ ТАНКА: мощный, долгий грохот ──────────────────────────
function makeExplosion(ctx) {
    const sr=ctx.sampleRate, dur=2.2, buf=ctx.createBuffer(1,sr*dur,sr), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) {
        const t=i/sr;
        const env=t<0.01?t/0.01:Math.exp(-t*1.8);
        const bass=Math.sin(2*Math.PI*(40+20*Math.exp(-t*2))*t)*env*1.0;
        const mid=Math.sin(2*Math.PI*(90+50*Math.exp(-t*4))*t)*Math.exp(-t*2.5)*0.6;
        const rumble=(Math.random()*2-1)*Math.exp(-t*2.2)*0.7;
        const debris=(Math.random()*2-1)*Math.exp(-t*5)*0.3;
        d[i]=Math.max(-1,Math.min(1,(bass+mid+rumble+debris)*0.85));
    }
    return buf;
}

// Публичные функции вызова звуков
function playShotSound(gun) {
    const sounds={smoky:makeSmokyShot,twins:makeTwinsShot,railgun:makeRailgunShot,thunder:makeThunderShot,freeze:makeFreezeShot,isida:makeIsidaShot};
    if(sounds[gun]) playSound(sounds[gun],0.7);
}
function playExplosionSound() {
    playSound(makeExplosion,0.85);
}

function spawnExplosion(pos) {
    playExplosionSound();
    // Огненные шары
    for(let i=0;i<14;i++) {
        const sz=Math.random()*1.0+0.3;
        const m=new THREE.Mesh(new THREE.SphereGeometry(sz,5,5),new THREE.MeshBasicMaterial({color:i<7?0xff5500:0xff2200,transparent:true,opacity:0.9}));
        m.position.copy(pos).add(new THREE.Vector3((Math.random()-0.5)*2.5,(Math.random()-0.5)*2.5,(Math.random()-0.5)*2.5));
        sceneBat.add(m);
        const spd=8+Math.random()*8;
        const a=Math.random()*Math.PI*2;
        particles.push({mesh:m,vel:new THREE.Vector3(Math.cos(a)*spd,Math.random()*12+3,Math.sin(a)*spd),life:0.6,type:'fire',scene:'bat'});
    }
    // Дым
    for(let i=0;i<8;i++) {
        const m=new THREE.Mesh(new THREE.SphereGeometry(Math.random()*1.5+0.8,5,5),new THREE.MeshBasicMaterial({color:0x2a2a2a,transparent:true,opacity:0.6}));
        m.position.copy(pos);
        sceneBat.add(m);
        particles.push({mesh:m,vel:new THREE.Vector3((Math.random()-0.5)*4,5+Math.random()*5,(Math.random()-0.5)*4),life:1.4,type:'smoke',scene:'bat'});
    }
    // Искры
    spawnFX(pos,0xffcc00,1.8,8);
}
 
function spawnMuzzleFlash(pos,color=0xffaa00) {
    // Универсальная вспышка (используется для networked shots без детали пушки)
    const flash=new THREE.Mesh(new THREE.SphereGeometry(0.7,5,5),new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.95}));
    flash.position.copy(pos); sceneBat.add(flash);
    particles.push({mesh:flash,vel:new THREE.Vector3(0,0,0),life:0.1,type:'flash',scene:'bat'});
    for(let i=0;i<3;i++) {
        const fp=new THREE.Mesh(new THREE.SphereGeometry(0.3,4,4),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.8}));
        fp.position.copy(pos).add(new THREE.Vector3((Math.random()-0.5)*0.5,(Math.random()-0.5)*0.5,(Math.random()-0.5)*0.5));
        sceneBat.add(fp);
        particles.push({mesh:fp,vel:new THREE.Vector3(0,0,0),life:0.07,type:'flash',scene:'bat'});
    }
}

// ── СМОКИ: вспышка + серый дым ────────────────────────────────────
function spawnSmokyMuzzle(pos) {
    // Яркая оранжево-белая вспышка
    const flash=new THREE.Mesh(new THREE.SphereGeometry(0.85,6,6),new THREE.MeshBasicMaterial({color:0xffdd88,transparent:true,opacity:1.0}));
    flash.position.copy(pos); sceneBat.add(flash);
    particles.push({mesh:flash,vel:new THREE.Vector3(0,0,0),life:0.09,type:'flash',scene:'bat'});
    const core=new THREE.Mesh(new THREE.SphereGeometry(0.4,5,5),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1.0}));
    core.position.copy(pos); sceneBat.add(core);
    particles.push({mesh:core,vel:new THREE.Vector3(0,0,0),life:0.06,type:'flash',scene:'bat'});
    // Серые облачка дыма (3 шт, медленно поднимаются)
    for(let i=0;i<3;i++) {
        const sz=0.5+Math.random()*0.6;
        const sm=new THREE.Mesh(new THREE.SphereGeometry(sz,5,5),new THREE.MeshBasicMaterial({color:0x888888,transparent:true,opacity:0.55}));
        sm.position.copy(pos).add(new THREE.Vector3((Math.random()-0.5)*0.6,(Math.random()-0.5)*0.3,(Math.random()-0.5)*0.6));
        sceneBat.add(sm);
        particles.push({mesh:sm,vel:new THREE.Vector3((Math.random()-0.5)*1.5,1.8+Math.random()*1.5,(Math.random()-0.5)*1.5),life:0.9+Math.random()*0.5,type:'smoke',scene:'bat'});
    }
}

// ── ТВИНС: зеленоватая плазменная вспышка ─────────────────────────
function spawnTwinsMuzzle(pos) {
    const flash=new THREE.Mesh(new THREE.SphereGeometry(0.45,5,5),new THREE.MeshBasicMaterial({color:0x88ff44,transparent:true,opacity:0.95}));
    flash.position.copy(pos); sceneBat.add(flash);
    particles.push({mesh:flash,vel:new THREE.Vector3(0,0,0),life:0.07,type:'flash',scene:'bat'});
    // Искры плазмы
    for(let i=0;i<5;i++) {
        const sp=new THREE.Mesh(new THREE.SphereGeometry(0.1,4,4),new THREE.MeshBasicMaterial({color:0xaaffaa,transparent:true,opacity:0.9}));
        sp.position.copy(pos);
        const a=Math.random()*Math.PI*2;
        sceneBat.add(sp);
        particles.push({mesh:sp,vel:new THREE.Vector3(Math.cos(a)*5,Math.random()*3,Math.sin(a)*5),life:0.12,type:'spark',scene:'bat'});
    }
}

// ── РЕЛЬСА: зарядка (орб на конце ствола) ─────────────────────────
function spawnRailgunChargeFX(pos,progress) { // progress 0..1
    const sz=0.12+progress*0.55;
    const orb=new THREE.Mesh(new THREE.SphereGeometry(sz,7,7),new THREE.MeshBasicMaterial({color:0xaaddff,transparent:true,opacity:0.7+progress*0.3}));
    orb.position.copy(pos); sceneBat.add(orb);
    particles.push({mesh:orb,vel:new THREE.Vector3(0,0,0),life:0.06,type:'flash',scene:'bat'});
    // Кольцо энергии вокруг орба
    if(progress>0.5) {
        for(let i=0;i<4;i++) {
            const a=Math.random()*Math.PI*2;
            const sp=new THREE.Mesh(new THREE.SphereGeometry(0.07,4,4),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.8}));
            const r=sz*0.9;
            sp.position.copy(pos).add(new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r*0.3,Math.sin(a)*r));
            sceneBat.add(sp);
            particles.push({mesh:sp,vel:new THREE.Vector3(0,0,0),life:0.05,type:'flash',scene:'bat'});
        }
    }
}

// ── РЕЛЬСА: луч (Trail) с fade-out и расширением ──────────────────
function spawnRailgunBeam(startPos,dir,dist) {
    // Внешний широкий полупрозрачный луч (дымчато-белый с синевой)
    const beamOuter=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.55,dist),new THREE.MeshBasicMaterial({color:0xcceeff,transparent:true,opacity:0.55}));
    beamOuter.position.copy(startPos).add(dir.clone().multiplyScalar(dist/2));
    beamOuter.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),dir.clone());
    sceneBat.add(beamOuter);
    particles.push({mesh:beamOuter,vel:new THREE.Vector3(0,0,0),life:0.45,type:'railbeam',scene:'bat'});
    // Средний голубой луч
    const beamMid=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.22,dist),new THREE.MeshBasicMaterial({color:0x66ccff,transparent:true,opacity:0.85}));
    beamMid.position.copy(beamOuter.position); beamMid.quaternion.copy(beamOuter.quaternion);
    sceneBat.add(beamMid);
    particles.push({mesh:beamMid,vel:new THREE.Vector3(0,0,0),life:0.35,type:'railbeam',scene:'bat'});
    // Яркий белый сердечник
    const beamCore=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.07,dist),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1.0}));
    beamCore.position.copy(beamOuter.position); beamCore.quaternion.copy(beamOuter.quaternion);
    sceneBat.add(beamCore);
    particles.push({mesh:beamCore,vel:new THREE.Vector3(0,0,0),life:0.22,type:'glow',scene:'bat'});
}

// ── РЕЛЬСА: impact (белая вспышка + пучок искр) ──────────────────
function spawnRailgunImpact(pos) {
    const flash=new THREE.Mesh(new THREE.SphereGeometry(1.6,6,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1.0}));
    flash.position.copy(pos); sceneBat.add(flash);
    particles.push({mesh:flash,vel:new THREE.Vector3(0,0,0),life:0.14,type:'flash',scene:'bat'});
    // Голубоватый ореол
    const halo=new THREE.Mesh(new THREE.SphereGeometry(2.5,6,6),new THREE.MeshBasicMaterial({color:0x88ccff,transparent:true,opacity:0.5}));
    halo.position.copy(pos); sceneBat.add(halo);
    particles.push({mesh:halo,vel:new THREE.Vector3(0,0,0),life:0.18,type:'flash',scene:'bat'});
    // Искры (много, разлетаются во все стороны)
    for(let i=0;i<18;i++) {
        const sp=new THREE.Mesh(new THREE.SphereGeometry(0.1,4,4),new THREE.MeshBasicMaterial({color:i%3===0?0x88ccff:0xffffff,transparent:true,opacity:0.95}));
        sp.position.copy(pos);
        const a=Math.random()*Math.PI*2; const el=(Math.random()-0.5)*Math.PI;
        const spd=10+Math.random()*14;
        sceneBat.add(sp);
        particles.push({mesh:sp,vel:new THREE.Vector3(Math.cos(a)*Math.cos(el)*spd,Math.sin(el)*spd,Math.sin(a)*Math.cos(el)*spd),life:0.4,type:'spark',scene:'bat'});
    }
}

// ── ГРОМ: огромная вспышка-звезда + густой дым ───────────────────
function spawnThunderMuzzle(pos,dir) {
    // Большая оранжевая вспышка
    const flash=new THREE.Mesh(new THREE.SphereGeometry(1.8,6,6),new THREE.MeshBasicMaterial({color:0xff8800,transparent:true,opacity:0.95}));
    flash.position.copy(pos); sceneBat.add(flash);
    particles.push({mesh:flash,vel:new THREE.Vector3(0,0,0),life:0.13,type:'flash',scene:'bat'});
    // Белый сердечник
    const core=new THREE.Mesh(new THREE.SphereGeometry(0.9,5,5),new THREE.MeshBasicMaterial({color:0xffeecc,transparent:true,opacity:1.0}));
    core.position.copy(pos); sceneBat.add(core);
    particles.push({mesh:core,vel:new THREE.Vector3(0,0,0),life:0.08,type:'flash',scene:'bat'});
    // Лучи-крестики из дульного тормоза (4 луча)
    for(let a=0;a<4;a++) {
        const angle=a*Math.PI/2;
        const ray=new THREE.Mesh(new THREE.BoxGeometry(0.1,2.2,0.1),new THREE.MeshBasicMaterial({color:0xffcc44,transparent:true,opacity:0.9}));
        ray.position.copy(pos);
        ray.rotation.z=angle;
        sceneBat.add(ray);
        particles.push({mesh:ray,vel:new THREE.Vector3(0,0,0),life:0.12,type:'flash',scene:'bat'});
    }
    // Густой серо-чёрный дым (7 шаров)
    for(let i=0;i<7;i++) {
        const sz=0.8+Math.random()*1.1;
        const sm=new THREE.Mesh(new THREE.SphereGeometry(sz,5,5),new THREE.MeshBasicMaterial({color:i%2===0?0x333333:0x1a1a1a,transparent:true,opacity:0.65}));
        const offset=dir.clone().multiplyScalar(1.0+Math.random()*1.5);
        sm.position.copy(pos).add(offset).add(new THREE.Vector3((Math.random()-0.5)*1.2,(Math.random()-0.5)*0.8,(Math.random()-0.5)*1.2));
        sceneBat.add(sm);
        particles.push({mesh:sm,vel:new THREE.Vector3((Math.random()-0.5)*2,2.5+Math.random()*2,(Math.random()-0.5)*2),life:1.8+Math.random()*0.8,type:'smoke',scene:'bat'});
    }
}

// ── ГРОМ: взрыв при попадании (3D сплеш) ─────────────────────────
function spawnThunderImpact(pos) {
    // Огненная сфера взрыва
    for(let i=0;i<20;i++) {
        const sz=0.5+Math.random()*1.4;
        const m=new THREE.Mesh(new THREE.SphereGeometry(sz,5,5),new THREE.MeshBasicMaterial({color:i<10?0xff6600:0xffaa00,transparent:true,opacity:0.95}));
        m.position.copy(pos).add(new THREE.Vector3((Math.random()-0.5)*3,(Math.random()-0.5)*2,(Math.random()-0.5)*3));
        sceneBat.add(m);
        const a=Math.random()*Math.PI*2;
        particles.push({mesh:m,vel:new THREE.Vector3(Math.cos(a)*(6+Math.random()*8),Math.random()*12+4,Math.sin(a)*(6+Math.random()*8)),life:0.7,type:'fire',scene:'bat'});
    }
    // Внешнее кольцо взрыва (shockwave)
    const ring=new THREE.Mesh(new THREE.SphereGeometry(2.5,8,8),new THREE.MeshBasicMaterial({color:0xff4400,transparent:true,opacity:0.5,wireframe:false}));
    ring.position.copy(pos); sceneBat.add(ring);
    particles.push({mesh:ring,vel:new THREE.Vector3(0,0,0),life:0.25,type:'shockwave',scene:'bat'});
    // Густой дым взрыва
    for(let i=0;i<10;i++) {
        const sz=1.0+Math.random()*1.8;
        const sm=new THREE.Mesh(new THREE.SphereGeometry(sz,5,5),new THREE.MeshBasicMaterial({color:i%3===0?0x1a1a1a:0x333333,transparent:true,opacity:0.7}));
        sm.position.copy(pos).add(new THREE.Vector3((Math.random()-0.5)*4,(Math.random()-0.5)*2,(Math.random()-0.5)*4));
        sceneBat.add(sm);
        particles.push({mesh:sm,vel:new THREE.Vector3((Math.random()-0.5)*5,3+Math.random()*4,(Math.random()-0.5)*5),life:2.0+Math.random()*0.8,type:'smoke',scene:'bat'});
    }
    // Куски земли/обломки
    for(let i=0;i<12;i++) {
        const d=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.18,0.18),new THREE.MeshBasicMaterial({color:0x554422,transparent:true,opacity:0.9}));
        d.position.copy(pos);
        const a=Math.random()*Math.PI*2;
        sceneBat.add(d);
        particles.push({mesh:d,vel:new THREE.Vector3(Math.cos(a)*(4+Math.random()*10),8+Math.random()*12,Math.sin(a)*(4+Math.random()*10)),life:0.9,type:'spark',scene:'bat'});
    }
    // Яркая вспышка
    const flash=new THREE.Mesh(new THREE.SphereGeometry(3.5,6,6),new THREE.MeshBasicMaterial({color:0xffdd88,transparent:true,opacity:0.85}));
    flash.position.copy(pos); sceneBat.add(flash);
    particles.push({mesh:flash,vel:new THREE.Vector3(0,0,0),life:0.15,type:'flash',scene:'bat'});
}

// ── ФРИЗ: конусный поток снежинок (расширяется от дула к концу) ──
function spawnFreezeStream(fromPos,toPos) {
    const dir=toPos.clone().sub(fromPos);
    const totalDist=dir.length();
    const dirN=dir.clone().normalize();
    for(let i=0;i<12;i++) {
        const t=Math.random(); // 0=у дула, 1=конец
        const coneRadius=0.05+t*1.1; // расширение конуса
        const dist=t*totalDist;
        const p=fromPos.clone().add(dirN.clone().multiplyScalar(dist));
        // Перпендикулярное смещение (конус)
        const perp1=new THREE.Vector3(dirN.z,0,-dirN.x).normalize();
        const perp2=new THREE.Vector3(0,1,0);
        const angle=Math.random()*Math.PI*2;
        const r=(Math.random()*coneRadius);
        p.add(perp1.clone().multiplyScalar(Math.cos(angle)*r)).add(perp2.clone().multiplyScalar(Math.sin(angle)*r*0.5));
        // Цвет: смесь синего и белого
        const isWhite=Math.random()>0.45;
        const snowflake=new THREE.Mesh(new THREE.SphereGeometry(0.1+Math.random()*0.12,4,4),new THREE.MeshBasicMaterial({color:isWhite?0xeef8ff:0x66ccff,transparent:true,opacity:0.85}));
        snowflake.position.copy(p); sceneBat.add(snowflake);
        const speed=12+Math.random()*6;
        particles.push({mesh:snowflake,vel:dirN.clone().multiplyScalar(speed).add(new THREE.Vector3((Math.random()-0.5)*1.5,(Math.random()-0.5)*1.0,(Math.random()-0.5)*1.5)),life:0.18+t*0.12,type:'freeze_particle',scene:'bat'});
    }
}

// ── ФРИЗ: иней на танке (белые точки на корпусе) ─────────────────
function spawnFreezeImpact(tankPos) {
    for(let i=0;i<8;i++) {
        const frost=new THREE.Mesh(new THREE.SphereGeometry(0.15,4,4),new THREE.MeshBasicMaterial({color:0xddf4ff,transparent:true,opacity:0.75}));
        frost.position.copy(tankPos).add(new THREE.Vector3((Math.random()-0.5)*2.5,Math.random()*2.2,(Math.random()-0.5)*2.5));
        sceneBat.add(frost);
        particles.push({mesh:frost,vel:new THREE.Vector3(0,0.3,0),life:0.6,type:'smoke',scene:'bat'});
    }
    // Пар из-под гусениц
    for(let i=0;i<3;i++) {
        const steam=new THREE.Mesh(new THREE.SphereGeometry(0.4+Math.random()*0.3,4,4),new THREE.MeshBasicMaterial({color:0xccf0ff,transparent:true,opacity:0.4}));
        steam.position.copy(tankPos).add(new THREE.Vector3((Math.random()-0.5)*1.8,-0.3,(Math.random()-0.5)*1.8));
        sceneBat.add(steam);
        particles.push({mesh:steam,vel:new THREE.Vector3((Math.random()-0.5)*0.5,1.2,(Math.random()-0.5)*0.5),life:0.55,type:'smoke',scene:'bat'});
    }
}

// ── ИСИДА: молния (ломаная линия из сегментов) ────────────────────
function spawnBeamEffect(fromPos,toPos,color=0xff0000) {
    const dir=toPos.clone().sub(fromPos);
    const len=dir.length();
    if(len<0.1) return;
    const segments=Math.max(4,Math.floor(len/3));
    let prev=fromPos.clone();
    for(let i=1;i<=segments;i++) {
        const t=i/segments;
        const mid=fromPos.clone().lerp(toPos,t);
        // Случайное отклонение (молния ломаная) — меньше у концов
        const jitter=Math.sin(t*Math.PI)*1.8;
        mid.add(new THREE.Vector3((Math.random()-0.5)*jitter,(Math.random()-0.5)*jitter*0.5,(Math.random()-0.5)*jitter));
        const segDir=mid.clone().sub(prev);
        const segLen=segDir.length();
        if(segLen<0.01){prev=mid.clone();continue;}
        // Основной луч-сегмент
        const seg=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,segLen),new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.85}));
        seg.position.copy(prev).add(segDir.clone().multiplyScalar(0.5));
        seg.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),segDir.clone().normalize());
        sceneBat.add(seg);
        particles.push({mesh:seg,vel:new THREE.Vector3(0,0,0),life:0.13,type:'glow',scene:'bat'});
        // Тонкий белый сердечник молнии
        const core=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.03,segLen),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.9}));
        core.position.copy(seg.position); core.quaternion.copy(seg.quaternion);
        sceneBat.add(core);
        particles.push({mesh:core,vel:new THREE.Vector3(0,0,0),life:0.08,type:'glow',scene:'bat'});
        prev=mid.clone();
    }
    // Искры в точке попадания
    for(let i=0;i<5;i++) {
        const sp=new THREE.Mesh(new THREE.SphereGeometry(0.08,3,3),new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.9}));
        sp.position.copy(toPos).add(new THREE.Vector3((Math.random()-0.5)*0.8,(Math.random()-0.5)*0.8,(Math.random()-0.5)*0.8));
        const a=Math.random()*Math.PI*2;
        sceneBat.add(sp);
        particles.push({mesh:sp,vel:new THREE.Vector3(Math.cos(a)*3,1+Math.random()*2,Math.sin(a)*3),life:0.18,type:'spark',scene:'bat'});
    }
}

// ── ИСИДА: искры простоя между антеннами ──────────────────────────
function spawnIsidaIdleSpark(t) {
    if(!t.muzzlePoint) return;
    const pos=new THREE.Vector3(); t.muzzlePoint.getWorldPosition(pos);
    const sp=new THREE.Mesh(new THREE.SphereGeometry(0.07,3,3),new THREE.MeshBasicMaterial({color:0xcc88ff,transparent:true,opacity:0.8}));
    sp.position.copy(pos).add(new THREE.Vector3((Math.random()-0.5)*0.7,(Math.random()-0.5)*0.4,(Math.random()-0.5)*0.7));
    sceneBat.add(sp);
    particles.push({mesh:sp,vel:new THREE.Vector3((Math.random()-0.5)*2,0.5+Math.random(),(Math.random()-0.5)*2),life:0.14,type:'spark',scene:'bat'});
}

// ── СМОКИ: impact (искры + дым, крит — красно-оранжевый) ─────────
function spawnSmokyImpact(pos,isCrit) {
    const flashColor=isCrit?0xff2200:0xffaa44;
    const flashSz=isCrit?2.2:1.1;
    const flash=new THREE.Mesh(new THREE.SphereGeometry(flashSz,6,6),new THREE.MeshBasicMaterial({color:flashColor,transparent:true,opacity:1.0}));
    flash.position.copy(pos); sceneBat.add(flash);
    particles.push({mesh:flash,vel:new THREE.Vector3(0,0,0),life:isCrit?0.18:0.1,type:'flash',scene:'bat'});
    const sparks=isCrit?14:6;
    for(let i=0;i<sparks;i++) {
        const sp=new THREE.Mesh(new THREE.SphereGeometry(0.1,3,3),new THREE.MeshBasicMaterial({color:isCrit?0xff4400:0xffcc44,transparent:true,opacity:0.9}));
        sp.position.copy(pos);
        const a=Math.random()*Math.PI*2; const el=(Math.random()-0.5)*Math.PI;
        const spd=isCrit?12+Math.random()*8:5+Math.random()*6;
        sceneBat.add(sp);
        particles.push({mesh:sp,vel:new THREE.Vector3(Math.cos(a)*Math.cos(el)*spd,Math.sin(el)*spd,Math.sin(a)*Math.cos(el)*spd),life:0.35,type:'spark',scene:'bat'});
    }
    // Маленький дымок
    const sm=new THREE.Mesh(new THREE.SphereGeometry(isCrit?1.0:0.5,5,5),new THREE.MeshBasicMaterial({color:0x888888,transparent:true,opacity:0.5}));
    sm.position.copy(pos); sceneBat.add(sm);
    particles.push({mesh:sm,vel:new THREE.Vector3(0,2.0,0),life:0.7,type:'smoke',scene:'bat'});
}

// ── ТВИНС: плазменный взрыв при попадании ─────────────────────────
function spawnTwinsImpact(pos) {
    const flash=new THREE.Mesh(new THREE.SphereGeometry(0.9,6,6),new THREE.MeshBasicMaterial({color:0x44ff44,transparent:true,opacity:0.95}));
    flash.position.copy(pos); sceneBat.add(flash);
    particles.push({mesh:flash,vel:new THREE.Vector3(0,0,0),life:0.1,type:'flash',scene:'bat'});
    // Брызги плазмы
    for(let i=0;i<10;i++) {
        const sp=new THREE.Mesh(new THREE.SphereGeometry(0.12+Math.random()*0.1,4,4),new THREE.MeshBasicMaterial({color:i%2===0?0x44ff44:0xaaffaa,transparent:true,opacity:0.9}));
        sp.position.copy(pos);
        const a=Math.random()*Math.PI*2; const el=(Math.random()-0.5)*Math.PI;
        const spd=6+Math.random()*8;
        sceneBat.add(sp);
        particles.push({mesh:sp,vel:new THREE.Vector3(Math.cos(a)*Math.cos(el)*spd,Math.sin(el)*spd,Math.sin(a)*Math.cos(el)*spd),life:0.28,type:'spark',scene:'bat'});
    }
}
 

 
// ==========================================
// ЭФФЕКТ ЗАМОРОЗКИ НА ЭКРАНЕ
// ==========================================
function activateFrost(duration) {
    frostTimer=duration;
    const fo=document.getElementById('frost-overlay');
    fo.style.display='block'; fo.style.opacity='1';
}
 
// ==========================================
// ВЫСТРЕЛ — ВИЗУАЛИЗАЦИЯ (УЛУЧШЕННЫЙ VFX)
// ==========================================
function fireVisually(t) {
    const worldAngle=t.mesh.rotation.y+t.turret.rotation.y;
    const dir=new THREE.Vector3(-Math.sin(worldAngle),-0.04,-Math.cos(worldAngle)).normalize();
    const spawnPos=new THREE.Vector3();
    t.muzzlePoint.getWorldPosition(spawnPos);
    if(!t.recoilForce) t.recoilForce=0;

    if(t.gun==='smoky') {
        // ── СМОКИ ──────────────────────────────────────────────────
        if(t.barrels) { t.barrels.position.z=0.32; t.barrelReturnSpeed=4.5; }
        t.recoilForce += -0.9;
        spawnSmokyMuzzle(spawnPos);
        playShotSound('smoky');
        bullets.push({mesh:null,pos:spawnPos.clone(),dir:dir.clone(),owner:t.id,gun:t.gun,dist:0});

    } else if(t.gun==='twins') {
        // ── ТВИНС ──────────────────────────────────────────────────
        if(!t.twinsBarrel) t.twinsBarrel=0;
        const side=t.twinsBarrel===0?-1:1;
        t.twinsBarrel=1-t.twinsBarrel;
        if(t.barrels) {
            t.barrelSide=side;
            t.barrels.position.z=0.18; t.barrelReturnSpeed=6.0;
        }
        t.recoilForce += -0.22;
        const perp=new THREE.Vector3(Math.cos(worldAngle),0,-Math.sin(worldAngle));
        const bp=spawnPos.clone().add(perp.clone().multiplyScalar(side*0.45));
        spawnTwinsMuzzle(bp);
        playShotSound('twins');
        const plasma=new THREE.Mesh(
            new THREE.SphereGeometry(0.3,8,8),
            new THREE.MeshBasicMaterial({color:0x44ff44,transparent:true,opacity:0.95})
        );
        plasma.position.copy(bp); sceneBat.add(plasma);
        const glow=new THREE.Mesh(new THREE.SphereGeometry(0.48,6,6),new THREE.MeshBasicMaterial({color:0x22aa22,transparent:true,opacity:0.35}));
        glow.position.copy(bp); sceneBat.add(glow);
        bullets.push({mesh:plasma,glowMesh:glow,pos:bp.clone(),dir:dir.clone(),owner:t.id,gun:t.gun,dist:0,vy:0,pulseT:0});

    } else if(t.gun==='railgun') {
        // ── РЕЛЬСА ─────────────────────────────────────────────────
        if(t.barrels) { t.barrels.position.z=0.08; t.barrelReturnSpeed=1.5; }
        const mFlash=new THREE.Mesh(new THREE.SphereGeometry(1.2,7,7),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1.0}));
        mFlash.position.copy(spawnPos); sceneBat.add(mFlash);
        particles.push({mesh:mFlash,vel:new THREE.Vector3(0,0,0),life:0.1,type:'flash',scene:'bat'});
        const mBlue=new THREE.Mesh(new THREE.SphereGeometry(0.7,6,6),new THREE.MeshBasicMaterial({color:0x88ddff,transparent:true,opacity:0.9}));
        mBlue.position.copy(spawnPos); sceneBat.add(mBlue);
        particles.push({mesh:mBlue,vel:new THREE.Vector3(0,0,0),life:0.14,type:'flash',scene:'bat'});
        playShotSound('railgun');
        bullets.push({mesh:null,pos:spawnPos.clone(),dir:dir.clone(),owner:t.id,gun:t.gun,dist:0});

    } else if(t.gun==='thunder') {
        // ── ГРОМ ───────────────────────────────────────────────────
        if(t.barrels) { t.barrels.position.z=0.42; t.barrelReturnSpeed=1.6; }
        t.recoilForce += -1.4;
        spawnThunderMuzzle(spawnPos,dir);
        playShotSound('thunder');
        bullets.push({mesh:null,pos:spawnPos.clone(),dir:dir.clone(),owner:t.id,gun:t.gun,dist:0});

    } else if(t.gun==='freeze') {
        // ── ФРИЗ ───────────────────────────────────────────────────
        playShotSound('freeze');
        bullets.push({mesh:null,pos:spawnPos.clone(),dir:dir.clone(),owner:t.id,gun:t.gun,dist:0,beamActive:true,beamTimer:0.22});

    } else if(t.gun==='isida') {
        // ── ИСИДА ──────────────────────────────────────────────────
        if(t.barrels) { t.barrels.position.x=(Math.random()-0.5)*0.04; }
        playShotSound('isida');
        bullets.push({mesh:null,pos:spawnPos.clone(),dir:dir.clone(),owner:t.id,gun:t.gun,dist:0,beamActive:true,beamTimer:0.18});

    } else {
        bullets.push({mesh:null,pos:spawnPos.clone(),dir:dir.clone(),owner:t.id,gun:t.gun,dist:0});
    }
}
 
// ==========================================
// ПРИПАСЫ
// ==========================================
function useSupply(type) {
    const t=tanks[myId];
    if(!t||t.dead||saveData.supplies[type]<=0||t.cooldowns[type]>0) return;
    saveData.supplies[type]--; saveProgress();
    if(type==='repair') {
        t.hp=Math.min(t.maxHp,t.hp+t.maxHp); t.effects.repair=0; updateHUD();
        t.cooldowns.repair=30; showNotif('Ремкомплект активирован!');
    } else if(type==='mine') {
        const m=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.22,8),new THREE.MeshLambertMaterial({color:0x444444}));
        m.position.copy(t.mesh.position); m.position.y+=0.12; sceneBat.add(m);
        // Красный огонёк на мине
        const light=new THREE.Mesh(new THREE.SphereGeometry(0.1,4,4),new THREE.MeshBasicMaterial({color:0xff0000}));
        light.position.set(0,0.15,0); m.add(light);
        placedMines.push({mesh:m,pos:m.position.clone(),owner:myId});
        t.cooldowns.mine=30; showNotif('Мина установлена!');
    } else {
        t.effects[type]=30; t.cooldowns[type]=60;
        const msgs={armor:'Двойная защита активирована!',damage:'Двойной урон активирован!',speed:'Ускорение активировано!'};
        showNotif(msgs[type]||'');
        document.getElementById('sup-'+(type==='armor'?2:type==='damage'?3:4)).classList.add('active-fx');
    }
    try { if(socket&&!isOffline) socket.emit('useSupply',type); } catch(e){}
}
 
// ==========================================
// ИИ БОТОВ — УЛУЧШЕННЫЙ
// ==========================================
function updateBot(bot,dt) {
    const hData=DB.hulls[bot.hull||'hunter'];
    const gData=DB.guns[bot.gun||'smoky'];
    const speedMod=bot.effects&&bot.effects.speed>0?1.5:1;
    const slowMod=bot.frozen>0?0.4:1;
    const maxSpeed=hData.speed*speedMod*slowMod;
    bot.speed+=(maxSpeed-bot.speed)*dt*1.5;
 
    let target=null, targetDist=999;
    for(let id in tanks) {
        if(id===bot.id||tanks[id].dead) continue;
        const d=bot.mesh.position.distanceTo(tanks[id].mesh.position);
        if(d<targetDist) { targetDist=d; target=tanks[id]; }
    }
 
    const prefDist=(bot.gun==='twins'||bot.gun==='freeze'||bot.gun==='isida')?22:90;
 
    if(target&&targetDist<180) {
        const dx=target.mesh.position.x-bot.mesh.position.x;
        const dz=target.mesh.position.z-bot.mesh.position.z;
        let targetBodyRot=Math.atan2(-dx,-dz);
        if(targetDist<prefDist-8) targetBodyRot+=Math.PI+(Math.random()-0.5)*0.4;
        else if(targetDist>prefDist+8) {}
        else targetBodyRot+=Math.PI/2*(bot.id.charCodeAt(5)%2===0?1:-1);
        let diff=targetBodyRot-bot.rot;
        while(diff>Math.PI)diff-=Math.PI*2; while(diff<-Math.PI)diff+=Math.PI*2;
        bot.rot+=diff*dt*hData.rot*0.8*slowMod;
 
        // Аим башни
        let tAngle=Math.atan2(-dx,-dz);
        let tdiff=tAngle-(bot.rot+bot.tRot);
        while(tdiff>Math.PI)tdiff-=Math.PI*2; while(tdiff<-Math.PI)tdiff+=Math.PI*2;
        bot.tRot+=tdiff*dt*(gData.rotSpeed||2)*slowMod;
        bot.turret.rotation.y=bot.tRot;
 
        // Стрельба
        if(bot.reload>0) bot.reload-=dt;
        if(bot.reload<=0&&targetDist<prefDist*1.6&&Math.abs(tdiff)<0.35) {
            fireVisually(bot);
            bot.reload=gData.reload+(Math.random()*0.5);
        }
    } else {
        // Патрулирование
        bot.wanderTimer=(bot.wanderTimer||0)-dt;
        if(bot.wanderTimer<0) {
            bot.rot+=(Math.random()-0.5)*2;
            bot.wanderTimer=2+Math.random()*3;
        }
    }
 
    // Движение
    const move=new THREE.Vector3(-Math.sin(bot.rot),0,-Math.cos(bot.rot)).multiplyScalar(bot.speed*dt);
    const nextPos=bot.mesh.position.clone().add(move);
    const groundY=getGroundHeight(nextPos,bot.mesh.position.y);
    if(bot.vy===undefined) bot.vy=0;
    if(bot.mesh.position.y>groundY+0.25) { bot.vy-=30*dt; nextPos.y=bot.mesh.position.y+bot.vy*dt; if(nextPos.y<=groundY){nextPos.y=groundY;bot.vy=0;} }
    else { nextPos.y=groundY; bot.vy=0; }
    bot.stuckTimer-=dt;
    if(checkCollision(nextPos)||Math.abs(nextPos.x)>195||Math.abs(nextPos.z)>195) {
        bot.rot+=(Math.random()>0.5?1:-1)*(Math.PI/3+Math.random()*Math.PI/3);
        bot.stuckTimer=1.5+Math.random();
    } else { bot.mesh.position.copy(nextPos); }
    bot.mesh.rotation.y=bot.rot;
    if(bot.frozen>0) bot.frozen-=dt;
}
 
// ==========================================
// HUD
// ==========================================
function updateHUD() {
    if(myId&&tanks[myId]) {
        const pct=Math.max(0,(tanks[myId].hp/tanks[myId].maxHp)*100);
        const fill=document.getElementById('hp-fill');
        fill.style.width=pct+'%';
        fill.className=pct<30?'low':'';
    }
}
 
function updateScoreboard() {
    const sorted=Object.values(tanks).sort((a,b)=>b.score-a.score);
    let html='';
    for(let t of sorted) {
        html+=`<tr><td style="color:${t.id===myId?'#6cce00':t.isBot?'#ffaa00':'#fff'}">${t.nickname}</td><td>${t.score}</td><td>${t.kills}</td><td>${t.deaths}</td></tr>`;
    }
    document.getElementById('sb-body').innerHTML=html;
}
 
function respawnTank(id) {
    if(!tanks[id]) return;
    tanks[id].hp=tanks[id].maxHp;
    tanks[id].dead=false;
    tanks[id].mesh.visible=true;
    tanks[id].mesh.position.copy(getSafeSpawnPos());
    tanks[id].vy=0; tanks[id].speed=0;
    if(id===myId) { updateHUD(); showNotif('Возрождение!'); }
}
 
// ==========================================
// МИНИ-КАРТА — отключена
// ==========================================
function updateMinimap() {
    // Миникарта скрыта
}
 
// ==========================================
// ГЛАВНЫЙ ЦИКЛ
// ==========================================
function renderLoop() {
    requestAnimationFrame(renderLoop);
    const dt=Math.min(clock.getDelta(),0.08);
    if(sceneType==='none') return;
 
    if(sceneType==='garage'&&garageMesh) {
        garageMesh.rotation.y=garageTankRot;
        // Плавное вращение если не тащат
        if(!document.getElementById('garage-drag-area').style.cursor.includes('grabbing')) {
            garageTankRot+=dt*0.4;
        }
        // Анимация прожекторов — медленно вращаются на потолке
        if(sceneGar.userData.spotlightGroup) {
            sceneGar.userData.spotlightGroup.rotation.y+=dt*0.25;
        }
        // Анимация точек на кольце — бегущая волна
        if(sceneGar.userData.ringDots) {
            const tNow=clock.elapsedTime||(performance.now()/1000);
            sceneGar.userData.ringDots.forEach((d,i)=>{
                const phase=(tNow*2 - i*0.3)%6.28;
                const br=0.4+0.6*Math.max(0,Math.cos(phase));
                d.material.color.setRGB(0.55*br, 1.0*br, 0.0);
                d.scale.y=0.6+0.8*br;
            });
        }
        renderer.render(sceneGar,camera);
    }
    else if(sceneType==='lootbox') {
        lbTimer+=dt;

        // Медленное вращение всей группы в idle / во время падения
        if(lbState<=1) lbGroup.rotation.y+=dt*0.6;

        // ── СТЕЙТ 0: ящик падает с неба ────────────────────────────────
        if(lbState===0) {
            // Падение с замедлением (easing)
            const targetY=0.3;
            lbGroup.position.y+=(targetY-lbGroup.position.y)*dt*7 - (lbGroup.position.y>targetY?18*dt:0);
            if(lbGroup.position.y<=targetY+0.05) {
                lbGroup.position.y=targetY;
                lbState=1; lbTimer=0;
                // Вспышка при приземлении
                const flash=new THREE.Mesh(new THREE.SphereGeometry(2.5,12,8),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.7}));
                flash.position.set(0,0.3,0); sceneLootbox.add(flash);
                particles.push({mesh:flash,vel:new THREE.Vector3(0,0,0),life:0.18,type:'lbflash',scene:'lb'});
            }
        }

        // ── СТЕЙТ 1: ящик стоит, слегка покачивается ───────────────────
        else if(lbState===1) {
            // Лёгкий bounce-эффект (как ждёт открытия)
            lbGroup.position.y=0.3+Math.sin(lbTimer*3.5)*0.04;
            // Пульсация эмблемы (кристалл на крышке)
            if(lbLid) {
                const embPulse=1.0+0.15*Math.sin(lbTimer*5);
                if(lbLid.children[3]) lbLid.children[3].scale.setScalar(embPulse); // OctahedronGeometry — 4-й child
            }

            if(lbTimer>2.2) {
                lbState=2; lbTimer=0;
                // Остановить вращение — теперь ящик смотрит на камеру
                lbGroup.rotation.y=0;
            }
        }

        // ── СТЕЙТ 2: крышка открывается ────────────────────────────────
        else if(lbState===2) {
            lbGroup.position.y=0.3;
            lbGroup.rotation.y=0; // зафиксировать поворот

            if(lbLid && lbTimer<1.0) {
                // Крышка откидывается назад (pivot — задняя грань)
                // Ось Z — местные координаты lbLid
                const targetRot=-(Math.PI*0.75); // ~135° назад
                // Easing: быстро в начале, замедление в конце
                const t=lbTimer/1.0;
                const ease=1-Math.pow(1-t,3);
                lbLid.rotation.x=targetRot*ease;
                // Небольшой bounce-боковой люфт
                lbLid.rotation.z=Math.sin(lbTimer*12)*0.04*(1-ease);

                // Частицы вылетают из ящика при открытии
                if(lbTimer>0.3 && Math.random()<dt*30) {
                    const sparkColor=lbRewardType==='crystals'?0x00ccff:0xffaa00;
                    const sp2=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,6),new THREE.MeshBasicMaterial({color:sparkColor}));
                    sp2.position.set((Math.random()-0.5)*2,1.2,(Math.random()-0.5)*2); sceneLootbox.add(sp2);
                    particles.push({mesh:sp2,vel:new THREE.Vector3((Math.random()-0.5)*6,5+Math.random()*6,(Math.random()-0.5)*6),life:0.8,type:'lbspark',scene:'lb'});
                }
            }

            if(lbTimer>=1.0 && lbState===2) {
                lbState=3; lbTimer=0;
                // Взрыв наград!
                const sparkColor=lbRewardType==='crystals'?0x00ccff:0xffaa00;
                for(let i=0;i<28;i++) {
                    const angle=Math.random()*Math.PI*2;
                    const speed=5+Math.random()*8;
                    const sp=new THREE.Mesh(
                        lbRewardType==='crystals'
                            ? new THREE.OctahedronGeometry(0.22,0)
                            : new THREE.BoxGeometry(0.3,0.3,0.3),
                        new THREE.MeshLambertMaterial({color:sparkColor,emissive:sparkColor,emissiveIntensity:0.4})
                    );
                    sp.position.set((Math.random()-0.5)*1.5,1.5,(Math.random()-0.5)*1.5);
                    sceneLootbox.add(sp);
                    particles.push({mesh:sp,vel:new THREE.Vector3(Math.cos(angle)*speed,10+Math.random()*8,Math.sin(angle)*speed),life:3.5,type:'crystal',scene:'lb'});
                }
                // Большая вспышка
                const bigFlash=new THREE.Mesh(new THREE.SphereGeometry(4,12,8),new THREE.MeshBasicMaterial({color:sparkColor,transparent:true,opacity:0.6}));
                bigFlash.position.set(0,1.5,0); sceneLootbox.add(bigFlash);
                particles.push({mesh:bigFlash,vel:new THREE.Vector3(0,0,0),life:0.3,type:'lbflash',scene:'lb'});

                document.getElementById('lb-reward-3d').innerText=lbRewardText;
                document.getElementById('lb-reward-3d').style.display='block';
                document.getElementById('lb-btn-3d').style.display='block';
                saveProgress();
            }
        }

        // ── СТЕЙТ 3: награда показана, ящик стоит открытый ─────────────
        else if(lbState===3) {
            lbGroup.rotation.y+=dt*0.3; // медленное вращение
            // Ящик слегка поднимается и опускается
            lbGroup.position.y=0.3+Math.sin(lbTimer*1.5)*0.06;
        }

        // Камера: плавно зумится
        const camTargetZ = lbState<=1 ? 10 : 8;
        camera.position.x+=(0-camera.position.x)*dt*2;
        camera.position.y+=(3.5-camera.position.y)*dt*2;
        camera.position.z+=(camTargetZ-camera.position.z)*dt*2;
        camera.lookAt(0,1,0);

        // Частицы лутбокса
        for(let i=particles.length-1;i>=0;i--) {
            let p=particles[i]; if(p.scene!=='lb') continue; p.life-=dt;
            p.mesh.position.add(p.vel.clone().multiplyScalar(dt));
            if(p.type==='crystal') {
                p.vel.y-=15*dt; p.mesh.rotation.x+=dt*4; p.mesh.rotation.y+=dt*3;
                if(p.mesh.position.y<0.4){p.mesh.position.y=0.4;p.vel.y*=-0.25;}
                if(p.mesh.material) p.mesh.material.opacity=Math.max(0,Math.min(1,p.life*0.8));
            }
            if(p.type==='lbspark') {
                p.vel.y-=20*dt; p.vel.multiplyScalar(0.96);
                if(p.mesh.material) p.mesh.material.opacity=Math.max(0,p.life*1.5);
            }
            if(p.type==='lbflash') {
                p.mesh.scale.multiplyScalar(1+dt*20);
                if(p.mesh.material) p.mesh.material.opacity=Math.max(0,p.life*4);
            }
            if(p.life<=0) { sceneLootbox.remove(p.mesh); particles.splice(i,1); }
        }
        renderer.render(sceneLootbox,camera);
    }
    else if(sceneType==='battle') {
        const myT=tanks[myId];
        if(myT&&!myT.dead) {
            const hData=DB.hulls[myT.hull||saveData.equipped.hull];
            const gData=DB.guns[myT.gun||saveData.equipped.gun];
            const speedMod=myT.effects.speed>0?1.6:1;
            const maxSpeed=hData.speed*speedMod;
            const accel=maxSpeed*1.8;
 
            let moved=false, turning=0;
            if(keys['ArrowUp']||keys['KeyW']) { myT.speed+=accel*dt; moved=true; }
            else if(keys['ArrowDown']||keys['KeyS']) { myT.speed-=accel*dt; moved=true; }
            else { myT.speed*=0.9; if(Math.abs(myT.speed)<0.05) myT.speed=0; }
            myT.speed=Math.max(-maxSpeed*0.65,Math.min(myT.speed,maxSpeed));
 
            if(myT.recoilForce!==0) {
                myT.speed+=myT.recoilForce;
                myT.recoilForce*=0.88;
                if(Math.abs(myT.recoilForce)<0.08) myT.recoilForce=0;
            }
 
            if(Math.abs(myT.speed)>0.3) {
                if(keys['ArrowLeft']||keys['KeyA']) { myT.rot+=hData.rot*speedMod*dt; moved=true; turning=1; }
                if(keys['ArrowRight']||keys['KeyD']) { myT.rot-=hData.rot*speedMod*dt; moved=true; turning=-1; }
            }
 
            // Башня
            if(keys['KeyZ']) myT.tRot+=(gData.rotSpeed||2)*dt;
            if(keys['KeyX']) myT.tRot-=(gData.rotSpeed||2)*dt;
            // KeyC — плавный возврат башни на место
            if(keys['KeyC']) {
                myT.turretReturning=true;
            } else {
                myT.turretReturning=false;
            }
            if(myT.turretReturning) {
                // C: return turret at same speed as rotation (rotSpeed)
                var retSpd=(gData.rotSpeed||2);
                if(Math.abs(myT.tRot)>0.01) {
                    myT.tRot-=Math.sign(myT.tRot)*Math.min(retSpd*dt, Math.abs(myT.tRot));
                } else {
                    myT.tRot=0; myT.turretReturning=false;
                }
            }
            if(keys['KeyQ']) camHeight=Math.min(22,camHeight+8*dt);
            if(keys['KeyE']) camHeight=Math.max(2,camHeight-8*dt);
 
            // Наклон корпуса при повороте
            const tiltMax={wasp:0.14,hunter:0.08,titan:0.035};
            const tm=tiltMax[hData.model.type]||0.08;
            const targetTiltZ=turning*tm*(Math.abs(myT.speed)/maxSpeed);
            myT.tiltZ+=( targetTiltZ-myT.tiltZ)*dt*6;
            myT.mesh.rotation.y=myT.rot;
            myT.mesh.rotation.z=myT.tiltZ;
            myT.turret.rotation.y=myT.tRot;
 
            // Движение
            const moveVec=new THREE.Vector3(-Math.sin(myT.rot),0,-Math.cos(myT.rot)).multiplyScalar(myT.speed*dt);
            const nextPos=myT.mesh.position.clone().add(moveVec);
            nextPos.x=Math.max(-290,Math.min(290,nextPos.x));
            nextPos.z=Math.max(-290,Math.min(290,nextPos.z));
 
            const groundY=getGroundHeight(nextPos,myT.mesh.position.y);
            if(myT.vy===undefined) myT.vy=0;
            if(myT.mesh.position.y>groundY+0.3) {
                myT.vy-=35*dt;
                nextPos.y=myT.mesh.position.y+myT.vy*dt;
                if(nextPos.y<=groundY){nextPos.y=groundY;myT.vy=0;}
            } else { nextPos.y=groundY; myT.vy=0; }
 
            // Наклон по рельефу (pitch)
            const frontH=getGroundHeight({x:nextPos.x-Math.sin(myT.rot)*1.5,z:nextPos.z-Math.cos(myT.rot)*1.5},nextPos.y);
            const backH=getGroundHeight({x:nextPos.x+Math.sin(myT.rot)*1.5,z:nextPos.z+Math.cos(myT.rot)*1.5},nextPos.y);
            const targetPitch=Math.atan2(backH-frontH,3.0);
            myT.tiltX=(myT.tiltX||0)+(targetPitch-( myT.tiltX||0))*dt*4;
            myT.mesh.rotation.x=myT.tiltX;
 
            // slide collision
            if(!checkCollision(nextPos)) {
                myT.mesh.position.copy(nextPos);
            } else {
                var sX=new THREE.Vector3(nextPos.x,nextPos.y,myT.mesh.position.z);
                var sZ=new THREE.Vector3(myT.mesh.position.x,nextPos.y,nextPos.z);
                if(!checkCollision(sX)){myT.mesh.position.copy(sX);myT.speed*=0.85;}
                else if(!checkCollision(sZ)){myT.mesh.position.copy(sZ);myT.speed*=0.85;}
                else{myT.speed*=0.15;}
            }
 
            // Камера — полностью следует за башней
            const totalRot=myT.rot+myT.tRot; // 1.0 = камера смотрит туда же куда башня
            const camDist=7;
            const camOff=new THREE.Vector3(0,camHeight,camDist).applyAxisAngle(new THREE.Vector3(0,1,0),totalRot);
            const camTarget=myT.mesh.position.clone().add(camOff);
            const camAlpha=1.0-Math.pow(0.04,dt); // экспоненциальное сглаживание — не зависит от FPS
            camera.position.lerp(camTarget,camAlpha);
            // Округляем позицию камеры до 4 знаков — убирает субпиксельное мерцание
            camera.position.x=Math.round(camera.position.x*10000)/10000;
            camera.position.y=Math.round(camera.position.y*10000)/10000;
            camera.position.z=Math.round(camera.position.z*10000)/10000;
            const lookY=Math.round((myT.mesh.position.y+2.2)*10000)/10000;
            camera.lookAt(Math.round(myT.mesh.position.x*10000)/10000,lookY,Math.round(myT.mesh.position.z*10000)/10000);
 
            // ── ПЕРЕЗАРЯДКА И БАЛЛОН ЭНЕРГИИ ──────────────────────────────
            if(myT.reload>0) myT.reload-=dt;
            const gMode=gData.inputMode||'press';

            // Баллон (Фриз/Изида): восстанавливается когда НЕ стреляем
            if(gData.energyMax) {
                if(!myT.isFiring && myT.energy < gData.energyMax) {
                    myT.energy = Math.min(gData.energyMax, myT.energy + gData.energyRegen*dt);
                }
                // Полоска баллона
                const ePct = (myT.energy / gData.energyMax)*100;
                const energyEl = document.getElementById('energy-fill');
                if(energyEl) energyEl.style.width = ePct+'%';
                document.getElementById('energy-bar') && (document.getElementById('energy-bar').style.display='block');
            } else {
                document.getElementById('energy-bar') && (document.getElementById('energy-bar').style.display='none');
            }

            // Полоска перезарядки
            let rPct;
            if(gMode==='charge') {
                rPct = myT.charging ? (myT.chargeTime/gData.chargeTime)*100 : (myT.reload>0?(1-myT.reload/gData.reload)*100:100);
            } else if(gData.energyMax) {
                rPct = (myT.energy / gData.energyMax)*100;
            } else {
                rPct = myT.reload>0 ? (1-myT.reload/gData.reload)*100 : 100;
            }
            document.getElementById('reload-fill').style.width=rPct+'%';

            // ── ЛОГИКА СТРЕЛЬБЫ ПО РЕЖИМУ ─────────────────────────────────
            const spaceNow = !!keys['Space'];
            myT.isFiring = false;  // сбросим флаг, установим если стреляем

            if(gMode==='charge') {
                // ─── РЕЛЬСА: одно нажатие → автозарядка → выстрел ────────
                if(spaceNow && myT.reload<=0 && !myT.charging && !myT.spacePressed) {
                    myT.charging=true; myT.chargeTime=0;
                    myT.spacePressed=true;
                    document.getElementById('charge-indicator').style.display='block';
                }
                if(!spaceNow) myT.spacePressed=false;
                if(myT.charging) {
                    myT.chargeTime+=dt;
                    document.getElementById('charge-fill').style.width=(myT.chargeTime/gData.chargeTime*100)+'%';
                    if(Math.random()<dt*18) {
                        const mPos=new THREE.Vector3(); myT.muzzlePoint.getWorldPosition(mPos);
                        spawnRailgunChargeFX(mPos,myT.chargeTime/gData.chargeTime);
                    }
                    if(myT.chargeTime>=gData.chargeTime) {
                        myT.recoilForce = gData.recoilForce || -2.5;
                        fireVisually(myT); myT.reload=gData.reload;
                        myT.charging=false; myT.chargeTime=0;
                        document.getElementById('charge-indicator').style.display='none';
                        try{if(socket&&!isOffline)socket.emit('shoot',myT.gun);}catch(e){}
                    }
                }

            } else if(gMode==='hold' && gData.energyMax) {
                // ─── ФРИЗ / ИЗИДА: зажатие + баллон ───────────────────────
                if(spaceNow && myT.energy > 0) {
                    myT.isFiring=true;
                    myT.energy = Math.max(0, myT.energy - gData.energyDrain*dt);
                    if(myT.reload<=0) {
                        fireVisually(myT); myT.reload=gData.reload;
                        try{if(socket&&!isOffline)socket.emit('shoot',myT.gun);}catch(e){}
                    }
                }
                // Если баллон кончился — визуальная пульсация (TODO: мигание UI)

            } else if(gMode==='hold') {
                // ─── ТВИНС: зажатие, непрерывный огонь ────────────────────
                if(spaceNow && myT.reload<=0) {
                    myT.isFiring=true;
                    fireVisually(myT); myT.reload=gData.reload;
                    try{if(socket&&!isOffline)socket.emit('shoot',myT.gun);}catch(e){}
                }

            } else {
                // ─── СМОКИ / ГРОМ: нажатие (+ зажатие = цикл) ─────────────
                // Первый выстрел — при нажатии
                if(spaceNow && myT.reload<=0 && !myT.spacePressed) {
                    myT.spacePressed=true;
                    fireVisually(myT); myT.reload=gData.reload;
                    try{if(socket&&!isOffline)socket.emit('shoot',myT.gun);}catch(e){}
                }
                // Авто-огонь при зажатии (если autofire=true)
                if(spaceNow && myT.reload<=0 && myT.spacePressed && gData.autofire) {
                    fireVisually(myT); myT.reload=gData.reload;
                    try{if(socket&&!isOffline)socket.emit('shoot',myT.gun);}catch(e){}
                }
                if(!spaceNow) myT.spacePressed=false;
            }
 
            // Откат ствола — плавный возврат с индивидуальной скоростью (easing)
            if(myT.barrels&&myT.barrels.position.z>0) {
                const retSpeed=myT.barrelReturnSpeed||3.0;
                myT.barrels.position.z=Math.max(0,myT.barrels.position.z-dt*retSpeed);
            }
            // Исида: вибрация антенн спадает
            if(myT.gun==='isida'&&myT.barrels&&Math.abs(myT.barrels.position.x)>0.001) {
                myT.barrels.position.x*=(1-dt*12);
            }
            // Исида: периодические idle-искры между антеннами
            if(myT.gun==='isida'&&Math.random()<dt*8) spawnIsidaIdleSpark(myT);
 
            // Эффекты припасов
            ['armor','damage','speed'].forEach(eff=>{
                if(myT.effects[eff]>0) {
                    myT.effects[eff]-=dt;
                    if(myT.effects[eff]<=0) document.getElementById('sup-'+(eff==='armor'?2:eff==='damage'?3:4)).classList.remove('active-fx');
                }
            });
            // Кулдауны
            const maxCDs={repair:30,armor:60,damage:60,speed:60,mine:30};
            const supsMap={repair:1,armor:2,damage:3,speed:4,mine:5};
            for(let eff in myT.cooldowns) {
                if(myT.cooldowns[eff]>0) { myT.cooldowns[eff]-=dt; document.getElementById('cd-'+supsMap[eff]).style.height=((myT.cooldowns[eff]/maxCDs[eff])*100)+'%'; }
                else document.getElementById('cd-'+supsMap[eff]).style.height='0%';
            }
 
            // Заморозка
            if(frostTimer>0) {
                frostTimer-=dt;
                const fo=document.getElementById('frost-overlay');
                fo.style.opacity=Math.min(1,frostTimer/2).toFixed(2);
                if(frostTimer<=0) fo.style.display='none';
            }
 
            if(moved) { try{if(socket&&!isOffline)socket.emit('move',{x:myT.mesh.position.x,y:myT.mesh.position.y,z:myT.mesh.position.z,rot:myT.rot,tRot:myT.tRot});}catch(e){} }
        }
 
        // Обновление всех танков
        for(let id in tanks) {
            const t=tanks[id];
            if(t.barrels&&t.barrels.position.z>0) t.barrels.position.z=Math.max(0,t.barrels.position.z-dt*(t.barrelReturnSpeed||3.0));
            if(t.isBot&&!t.dead) updateBot(t,dt);
            if(!t.isBot&&id!==myId&&t.targetPos) {
                t.mesh.position.lerp(t.targetPos,0.18);
                if(t.targetRot!==null) {
                    let rd=t.targetRot-t.rot; while(rd>Math.PI)rd-=Math.PI*2; while(rd<-Math.PI)rd+=Math.PI*2;
                    t.rot+=rd*0.18; t.mesh.rotation.y=t.rot;
                }
                if(t.targetTRot!==null) {
                    let td=t.targetTRot-t.tRot; while(td>Math.PI)td-=Math.PI*2; while(td<-Math.PI)td+=Math.PI*2;
                    t.tRot+=td*0.18; t.turret.rotation.y=t.tRot;
                }
            }
        }
 
        // ======= ОБРАБОТКА СНАРЯДОВ =======
        for(let i=bullets.length-1;i>=0;i--) {
            const b=bullets[i];
            const isHitscan=(b.gun==='smoky'||b.gun==='railgun'||b.gun==='thunder');
            const isBeam=(b.gun==='freeze'||b.gun==='isida');
 
            if(isBeam) {
                // Beam пушки — непрерывный луч/поток
                if(b.beamTimer>0) {
                    b.beamTimer-=dt;
                    const beamDir=b.dir.clone();
                    let beamEndPos=b.pos.clone().add(beamDir.multiplyScalar(22));
                    let beamHit=false;
 
                    for(let id in tanks) {
                        if(id===b.owner||tanks[id].dead) continue;
                        const tPos=tanks[id].mesh.position.clone().add(new THREE.Vector3(0,1.5,0));
                        if(b.pos.distanceTo(tPos)<22) {
                            const toTarget=tPos.clone().sub(b.pos).normalize();
                            const dot=toTarget.dot(b.dir);
                            if(dot>0.8) {
                                beamEndPos=tPos.clone();
                                if(b.gun==='freeze') {
                                    spawnFreezeStream(b.pos,beamEndPos);
                                    spawnFreezeImpact(tanks[id].mesh.position);
                                    let dmg=DB.guns.freeze.dmg;
                                    if(tanks[b.owner]&&tanks[b.owner].effects&&tanks[b.owner].effects.damage>0) dmg*=2;
                                    if(tanks[id].effects&&tanks[id].effects.armor>0) dmg/=2;
                                    tanks[id].hp-=dmg*dt*10;
                                    tanks[id].frozen=1.5;
                                    try{if(socket&&!isOffline)socket.emit('hit',id,dmg*dt*10);}catch(e){}
                                } else if(b.gun==='isida') {
                                    const isEnemy=tanks[id].isBot||(id!==myId);
                                    spawnBeamEffect(b.pos,beamEndPos,isEnemy?0xff2222:0x33ff33);
                                    let dmg=DB.guns.isida.dmg;
                                    if(isEnemy) {
                                        if(tanks[b.owner]&&tanks[b.owner].effects&&tanks[b.owner].effects.damage>0) dmg*=2;
                                        if(tanks[id].effects&&tanks[id].effects.armor>0) dmg/=2;
                                        tanks[id].hp-=dmg*dt*10;
                                        if(b.owner===myId) { tanks[myId].hp=Math.min(tanks[myId].maxHp,tanks[myId].hp+dmg*0.5*dt*10); }
                                        try{if(socket&&!isOffline)socket.emit('hit',id,dmg*dt*10);}catch(e){}
                                    } else {
                                        tanks[id].hp=Math.min(tanks[id].maxHp,tanks[id].hp+dmg*0.6*dt*10);
                                    }
                                }
                                if(tanks[id].hp<=0) {
                                    tanks[id].hp=0; tanks[id].dead=true; tanks[id].mesh.visible=false; tanks[id].deaths++;
                                    if(tanks[b.owner]) { tanks[b.owner].kills++; tanks[b.owner].score+=15; }
                                    spawnExplosion(tanks[id].mesh.position);
                                    if(id===myId) setTimeout(()=>respawnTank(id),3000);
                                    else if(tanks[id].isBot) { if(b.owner===myId){saveData.crystals+=10;saveData.xp+=15;saveProgress();} setTimeout(()=>respawnTank(id),3000); }
                                } else if(id===myId) updateHUD();
                                beamHit=true; break;
                            }
                        }
                    }
                    if(b.gun==='freeze'&&!beamHit) spawnFreezeStream(b.pos,beamEndPos);
                    else if(b.gun==='isida'&&!beamHit) spawnBeamEffect(b.pos,beamEndPos,0xffaa00);
                } else {
                    bullets.splice(i,1);
                }
                continue;
            }
 
            if(isHitscan&&b.dist===0) {
                // Лучевое попадание (мгновенное)
                let hitPos=null; let stepDist=0.5; let piercedTanks={};
                for(let step=0;step<700;step++) {
                    b.pos.add(b.dir.clone().multiplyScalar(stepDist)); b.dist+=stepDist;
                    const inWall=mapObjects.some(box=>box.containsPoint(b.pos));
                    if(inWall||Math.abs(b.pos.x)>310||Math.abs(b.pos.z)>310) {
                        hitPos=b.pos.clone();
                        if(b.gun==='smoky') spawnSmokyImpact(b.pos,false);
                        else spawnFX(b.pos,0xddaa44,1.2);
                        break;
                    }
                    for(let id in tanks) {
                        if(id===b.owner||tanks[id].dead||piercedTanks[id]) continue;
                        const tPos=tanks[id].mesh.position.clone().add(new THREE.Vector3(0,1.5,0));
                        if(new THREE.Box3().setFromCenterAndSize(tPos,new THREE.Vector3(2.6,3.2,3.8)).containsPoint(b.pos)) {
                            piercedTanks[id]=true;
                            let dmg=DB.guns[b.gun].dmg;
                            let isCrit=false;
                            if(b.gun==='smoky'&&Math.random()<0.25){dmg*=2.5;isCrit=true;}
                            if(tanks[b.owner]&&tanks[b.owner].effects&&tanks[b.owner].effects.damage>0) dmg*=2;
                            if(tanks[id].effects&&tanks[id].effects.armor>0) dmg/=2;
                            tanks[id].hp-=dmg;
                            // Крит Смоки: физический импульс на цель (сбивает прицел/переворачивает)
                            if(isCrit&&tanks[id]) {
                                if(!tanks[id].recoilForce) tanks[id].recoilForce=0;
                                tanks[id].recoilForce += (Math.random()>0.5?1:-1)*2.2; // боковой толчок
                                spawnSmokyImpact(b.pos,true); // яркая красная вспышка при крите
                                if(id===myId) { // экранный эффект крита по игроку
                                    const fo=document.getElementById('frost-overlay');
                                    if(fo){fo.style.display='block';fo.style.background='rgba(255,180,0,0.35)';fo.style.opacity='1';setTimeout(()=>{fo.style.display='none';fo.style.background='';},200);}
                                }
                            } else {
                                spawnSmokyImpact(b.pos,false);
                            }
                            try{if(socket&&!isOffline)socket.emit('hit',id,dmg);}catch(e){}
                            if(tanks[id].hp<=0) {
                                tanks[id].hp=0; tanks[id].dead=true; tanks[id].mesh.visible=false; tanks[id].deaths++;
                                if(tanks[b.owner]) { tanks[b.owner].kills++; tanks[b.owner].score+=15; }
                                spawnExplosion(tanks[id].mesh.position);
                                if(id===myId) { updateHUD(); setTimeout(()=>respawnTank(id),3000); }
                                else if(tanks[id].isBot) { if(b.owner===myId){saveData.crystals+=10;saveData.xp+=15;saveProgress();} setTimeout(()=>respawnTank(id),3000); }
                            } else if(id===myId) updateHUD();
                            if(b.gun!=='railgun') { hitPos=b.pos.clone(); break; }
                        }
                    }
                    if(hitPos&&b.gun!=='railgun') break;
                }
                // Эффекты конкретных пушек
                if(b.gun==='railgun') {
                    const startPos=b.pos.clone().sub(b.dir.clone().multiplyScalar(b.dist));
                    spawnRailgunBeam(startPos,b.dir.clone(),b.dist);
                    if(hitPos) spawnRailgunImpact(hitPos);
                }
                if(b.gun==='thunder'&&hitPos) {
                    spawnThunderImpact(hitPos);
                    // Сплеш урон — все в радиусе 12 единиц, ВКЛЮЧАЯ владельца (самоурон!)
                    for(let id in tanks) {
                        if(tanks[id].dead) continue;
                        const dist=tanks[id].mesh.position.distanceTo(b.pos);
                        if(dist<12) {
                            let splDmg=DB.guns.thunder.dmg*(1-dist/12);
                            if(tanks[b.owner]&&tanks[b.owner].effects&&tanks[b.owner].effects.damage>0) splDmg*=2;
                            if(tanks[id].effects&&tanks[id].effects.armor>0) splDmg/=2;
                            // Самоурон: если стрелял близко к себе — получает урон
                            // dist===0 когда попал в себя через отрикошет, dist<4 — в упор
                            tanks[id].hp-=splDmg;
                            if(tanks[id].hp<=0) {
                                tanks[id].hp=0; tanks[id].dead=true; tanks[id].mesh.visible=false; tanks[id].deaths++;
                                if(id!==b.owner&&tanks[b.owner]) { tanks[b.owner].kills++; tanks[b.owner].score+=15; }
                                spawnExplosion(tanks[id].mesh.position);
                                if(id===myId){updateHUD();setTimeout(()=>respawnTank(id),3000);}
                                else if(tanks[id].isBot){if(b.owner===myId&&id!==b.owner){saveData.crystals+=10;saveData.xp+=15;saveProgress();}setTimeout(()=>respawnTank(id),3000);}
                            } else if(id===myId) updateHUD();
                        }
                    }
                }
                bullets.splice(i,1); continue;
            }
 
            if(!isHitscan&&!isBeam) {
                // Projectile (Twins) — летящий снаряд с гравитацией
                const speed=75;
                if(b.vy===undefined) b.vy=0;
                b.vy-=28*dt; // гравитация
                b.dir.y=0; // горизонт (реальная физика Твинса)
                b.pos.add(b.dir.clone().multiplyScalar(speed*dt));
                b.pos.y+=b.vy*dt;
                b.dist+=speed*dt;
                if(b.mesh) b.mesh.position.copy(b.pos);
                // Пульсация шара (scale sine wave)
                if(b.pulseT!==undefined) b.pulseT+=dt*12;
                if(b.mesh) {
                    const pulse=1.0+0.18*Math.sin(b.pulseT||0);
                    b.mesh.scale.setScalar(pulse);
                    b.mesh.rotation.x+=dt*8;
                }
                // Glow-меш синхронизируем с шаром
                if(b.glowMesh) {
                    b.glowMesh.position.copy(b.pos);
                    const gPulse=1.0+0.22*Math.sin((b.pulseT||0)+0.5);
                    b.glowMesh.scale.setScalar(gPulse);
                }
 
                const inWall=mapObjects.some(box=>box.containsPoint(b.pos));
                if(inWall||b.pos.y<-5||Math.abs(b.pos.x)>310||Math.abs(b.pos.z)>310) {
                    spawnTwinsImpact(b.pos);
                    if(b.glowMesh) sceneBat.remove(b.glowMesh);
                    if(b.mesh) sceneBat.remove(b.mesh);
                    bullets.splice(i,1); continue;
                }
                let hitTarget=false;
                for(let id in tanks) {
                    if(id===b.owner||tanks[id].dead) continue;
                    const tPos=tanks[id].mesh.position.clone().add(new THREE.Vector3(0,1.5,0));
                    if(new THREE.Box3().setFromCenterAndSize(tPos,new THREE.Vector3(2.6,3.2,3.8)).containsPoint(b.pos)) {
                        hitTarget=true;
                        let dmg=DB.guns[b.gun].dmg;
                        if(tanks[b.owner]&&tanks[b.owner].effects&&tanks[b.owner].effects.damage>0) dmg*=2;
                        if(tanks[id].effects&&tanks[id].effects.armor>0) dmg/=2;
                        tanks[id].hp-=dmg;
                        spawnTwinsImpact(b.pos);
                        // Glow-меш снаряда убираем
                        if(b.glowMesh) sceneBat.remove(b.glowMesh);
                        try{if(socket&&!isOffline)socket.emit('hit',id,dmg);}catch(e){}
                        if(tanks[id].hp<=0) {
                            tanks[id].hp=0; tanks[id].dead=true; tanks[id].mesh.visible=false; tanks[id].deaths++;
                            if(tanks[b.owner]) { tanks[b.owner].kills++; tanks[b.owner].score+=15; }
                            spawnExplosion(tanks[id].mesh.position);
                            if(id===myId){updateHUD();setTimeout(()=>respawnTank(id),3000);}
                            else if(tanks[id].isBot){if(b.owner===myId){saveData.crystals+=10;saveData.xp+=15;saveProgress();}setTimeout(()=>respawnTank(id),3000);}
                        } else if(id===myId) updateHUD();
                        break;
                    }
                }
                if(hitTarget||b.dist>130) {
                    if(b.mesh) sceneBat.remove(b.mesh);
                    bullets.splice(i,1);
                }
            }
        }
 
        // Мины
        for(let i=placedMines.length-1;i>=0;i--) {
            const m=placedMines[i];
            for(let id in tanks) {
                if(id===m.owner||tanks[id].dead) continue;
                if(tanks[id].mesh.position.distanceTo(m.pos)<2.2) {
                    spawnExplosion(m.pos); sceneBat.remove(m.mesh); placedMines.splice(i,1);
                    if(m.owner===myId) {
                        let dmg=150;
                        if(tanks[id].effects&&tanks[id].effects.armor>0) dmg/=2;
                        tanks[id].hp-=dmg;
                        try{if(socket&&!isOffline)socket.emit('hit',id,dmg);}catch(e){}
                        if(tanks[id].hp<=0) {
                            tanks[id].hp=0; tanks[id].dead=true; tanks[id].mesh.visible=false; tanks[id].deaths++;
                            if(tanks[myId]) { tanks[myId].kills++; tanks[myId].score+=15; }
                            if(tanks[id].isBot) { saveData.crystals+=10;saveData.xp+=15;saveProgress(); setTimeout(()=>respawnTank(id),3000); }
                        }
                    }
                    break;
                }
            }
        }
 
        // Частицы
        for(let i=particles.length-1;i>=0;i--) {
            const p=particles[i]; if(p.scene!=='bat') continue; p.life-=dt;
            p.mesh.position.add(p.vel.clone().multiplyScalar(dt));
            if(p.type==='spark') { p.vel.y-=28*dt; p.vel.multiplyScalar(0.98); if(p.mesh.material) p.mesh.material.opacity=Math.max(0,p.life*3); }
            if(p.type==='fire') { p.mesh.scale.multiplyScalar(1-dt*2.5); if(p.mesh.material) p.mesh.material.opacity=Math.max(0,p.life/0.6); }
            if(p.type==='smoke') { p.mesh.scale.multiplyScalar(1+dt*0.8); if(p.mesh.material) p.mesh.material.opacity=Math.max(0,(p.life/1.4)*0.55); }
            if(p.type==='flash') { p.mesh.scale.multiplyScalar(1+dt*12); if(p.mesh.material) p.mesh.material.opacity=Math.max(0,p.life*9); }
            if(p.type==='glow') { if(p.mesh.material) p.mesh.material.opacity=Math.max(0,p.life*1.5); }
            // Рельса: луч расширяется и растворяется (fade out + expand)
            if(p.type==='railbeam') {
                const fade=Math.max(0,p.life/0.45);
                if(p.mesh.material) p.mesh.material.opacity=fade*0.85;
                p.mesh.scale.x=1+( 1-fade)*3.5; p.mesh.scale.y=1+(1-fade)*3.5;
            }
            // Гром: shockwave — расширяется быстро
            if(p.type==='shockwave') {
                p.mesh.scale.multiplyScalar(1+dt*14);
                if(p.mesh.material) p.mesh.material.opacity=Math.max(0,p.life/0.25*0.5);
            }
            // Фриз: частицы затухают на конце дистанции
            if(p.type==='freeze_particle') {
                if(p.mesh.material) p.mesh.material.opacity=Math.max(0,p.life*4.5);
                p.vel.multiplyScalar(0.94);
            }
            if(p.life<=0) {
                sceneBat.remove(p.mesh);
                // Удаляем glow-меш Твинса если есть
                if(p.glowMesh) sceneBat.remove(p.glowMesh);
                particles.splice(i,1);
            }
        }
 
        updateScoreboard();
        updateMinimap();
        renderer.render(sceneBat,camera);
    }
}
 