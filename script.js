const DATABASE = {
    intellij: [
        { label: "Search everywhere", doubleShift: true, key: "shift" },
        { label: "Smart code completion", ctrl: true, shift: true, key: " " },
        { label: "Generate code", alt: true, key: "insert" },
        { label: "Recent files popup", ctrl: true, key: "e" },
        { label: "Reformat code", ctrl: true, alt: true, key: "l" },
        { label: "Extract Method", ctrl: true, alt: true, key: "m" },
        { label: "Rename Refactor", shift: true, key: "f6" },
        { label: "Find Action", ctrl: true, shift: true, key: "a" },
        { label: "Go to class", ctrl: true, key: "n" },
        { label: "Show intention actions", alt: true, key: "enter" },
        { label: "Duplicate line", ctrl: true, key: "d" },
        { label: "Delete line", ctrl: true, key: "y" },
        { label: "Navigate to declaration", ctrl: true, key: "b" },
        { label: "Find usages", alt: true, key: "f7" },
        { label: "Quick documentation", ctrl: true, key: "q" }
    ],
    windows: [
        { label: "File Explorer", win: true, key: "e" },
        { label: "Close Window", alt: true, key: "f4" },
        { label: "Task Manager", ctrl: true, shift: true, key: "escape" },
        { label: "Minimize all windows", win: true, key: "d" },
        { label: "Screenshot", win: true, shift: true, key: "s" }
    ],
    vscode: [
        { label: "Command Palette", ctrl: true, shift: true, key: "p" },
        { label: "Toggle Terminal", ctrl: true, key: "`" },
        { label: "Quick Open File", ctrl: true, key: "p" },
        { label: "Go to Symbol", ctrl: true, shift: true, key: "o" },
        { label: "Format Document", shift: true, alt: true, key: "f" },
        { label: "Toggle Sidebar", ctrl: true, key: "b" },
        { label: "New File", ctrl: true, key: "n" },
        { label: "Find in Files", ctrl: true, shift: true, key: "f" }
    ]
};
const POWERUPS = [
    { name: "⚡ TURBO MODE", effect: "speed", value: 0.5 },
    { name: "⏱️ EXTRA TIME", effect: "time", value: 2000 },
    { name: "🎯 PRECISION BOOST", effect: "forgive", value: true }
];
let state = {
    active: false,
    list: [],
    idx: 0,
    hits: 0,
    combo: 0,
    times: [],
    lastShift: 0,
    level: 1,
    baseSpeed: 6000,
    currentSpeed: 6000,
    powerupActive: null
};
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'success') {
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    } else if (type === 'error') {
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    } else if (type === 'levelup') {
        osc.frequency.value = 1200;
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    }
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.3);
}
function createParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = color;
        particle.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--y', (Math.random() - 0.5) * 200 + 'px');
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}
function showPowerup(text) {
    const overlay = document.getElementById('powerup-msg');
    overlay.textContent = text;
    overlay.style.display = 'block';
    setTimeout(() => overlay.style.display = 'none', 1500);
}
function updateLevel() {
    const newLevel = Math.floor(state.hits / 5) + 1;
    if (newLevel > state.level) {
        state.level = newLevel;
        state.currentSpeed = Math.max(2000, state.baseSpeed - (state.level * 400));
        playSound('levelup');
        
        if (state.level % 3 === 0 && Math.random() > 0.5) {
            const pu = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
            activatePowerup(pu);
        }
    }
    document.getElementById('level-display').textContent = 
        `LEVEL ${state.level} • SPEED: ${(state.currentSpeed/1000).toFixed(1)}s`;
}
function activatePowerup(powerup) {
    showPowerup(powerup.name);
    state.powerupActive = powerup;
    
    if (powerup.effect === 'speed') {
        state.currentSpeed *= powerup.value;
    }
    
    setTimeout(() => {
        state.powerupActive = null;
        state.currentSpeed = Math.max(2000, state.baseSpeed - (state.level * 400));
    }, 10000);
}
function highlightPressedKey(e) {
    if (!state.isPractice) return;
    
    const keys = document.querySelectorAll('.key');
    
    if (e.ctrlKey) {
        keys.forEach(k => {
            if (k.getAttribute('data-key') === 'ctrl') k.classList.add('pressed');
        });
    }
    if (e.shiftKey) {
        keys.forEach(k => {
            if (k.getAttribute('data-key') === 'shift') k.classList.add('pressed');
        });
    }
    if (e.altKey) {
        keys.forEach(k => {
            if (k.getAttribute('data-key') === 'alt') k.classList.add('pressed');
        });
    }
    if (e.metaKey) {
        keys.forEach(k => {
            if (k.getAttribute('data-key') === 'win') k.classList.add('pressed');
        });
    }
    
    const mainKey = e.key.toLowerCase();
    if (!['control', 'shift', 'alt', 'meta'].includes(mainKey)) {
        keys.forEach(k => {
            if (k.getAttribute('data-key') === mainKey) k.classList.add('pressed');
        });
    }
    
    setTimeout(() => {
        keys.forEach(k => k.classList.remove('pressed'));
    }, 200);
}
window.addEventListener('keydown', (e) => {
    if (!state.active) return;
    
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.returnValue) e.returnValue = false;
    highlightPressedKey(e);
    if (e.key === 'Escape') { 
        exitGame(); 
        return false; 
    }
    if (e.key === 'Shift') {
        const now = Date.now();
        if (now - state.lastShift < 300) {
            processInput('doubleShift');
        }
        state.lastShift = now;
        return false;
    }
    if (!state.list[state.idx]) return false;
    
    if (state.list[state.idx].doubleShift) return false;
    const cur = state.list[state.idx];
    const k = e.key.toLowerCase();
    
    if (['control', 'shift', 'alt', 'meta'].includes(k)) return false;
    
    const keyMatch = (k === cur.key.toLowerCase());
    const ctrlMatch = (e.ctrlKey === !!cur.ctrl);
    const shiftMatch = (e.shiftKey === !!cur.shift);
    const altMatch = (e.altKey === !!cur.alt);
    const winMatch = (e.metaKey === !!cur.win);
    
    const modMatch = ctrlMatch && shiftMatch && altMatch && winMatch;
    const forgive = state.powerupActive?.effect === 'forgive';
    if (keyMatch && (modMatch || forgive)) {
        resolveTask(true);
    } else {
        resolveTask(false);
    }
    
    return false;
}, true);
function startEngine() {
    const prog = document.getElementById('prog-select').value;
    state.baseSpeed = parseInt(document.getElementById('speed-select').value);
    state.currentSpeed = state.baseSpeed;
    state.isPractice = document.getElementById('practice-check').checked;
    state.list = [...DATABASE[prog]].sort(() => Math.random() - 0.5);
    
    state.active = true;
    state.idx = 0; state.hits = 0; state.combo = 0; state.times = [];
    state.level = 1;
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('game-view').classList.remove('hidden');
    
    runTask();
}
function exitGame() {
    state.active = false;
    clearTimeout(state.timer);
    document.getElementById('game-view').classList.add('hidden');
    document.getElementById('home-view').classList.remove('hidden');
}
function runTask() {
    if (state.idx >= state.list.length) { finishSession(); return; }
    const cur = state.list[state.idx];
    const cmdText = document.getElementById('command-text');
    cmdText.innerText = cur.label;
    cmdText.style.color = "#fff";
    cmdText.style.animation = 'none';
    setTimeout(() => cmdText.style.animation = 'slideIn 0.4s ease-out', 10);
    const kbd = document.getElementById('kbd-helper');
    kbd.innerHTML = '';
    if (state.isPractice) {
        if (cur.doubleShift) {
            kbd.innerHTML = '<div class="key">2x SHIFT</div>';
        } else {
            if(cur.ctrl) kbd.innerHTML += '<div class="key" data-key="ctrl">CTRL</div>';
            if(cur.shift) kbd.innerHTML += '<div class="key" data-key="shift">SHIFT</div>';
            if(cur.alt) kbd.innerHTML += '<div class="key" data-key="alt">ALT</div>';
            if(cur.win) kbd.innerHTML += '<div class="key" data-key="win">WIN</div>';
            kbd.innerHTML += `<div class="key" data-key="${cur.key.toLowerCase()}">${cur.key.toUpperCase()}</div>`;
        }
    }
    const fill = document.getElementById('timer-fill');
    const speed = state.powerupActive?.effect === 'time' ? 
        state.currentSpeed + state.powerupActive.value : state.currentSpeed;
    
    fill.style.transition = 'none'; 
    fill.style.width = '100%';
    fill.style.background = 'var(--primary)';
    
    setTimeout(() => { 
        fill.style.transition = `width ${speed}ms linear`; 
        fill.style.width = '0%'; 
    }, 50);
    state.startT = Date.now();
    clearTimeout(state.timer);
    state.timer = setTimeout(() => resolveTask(false), speed);
}
function resolveTask(ok) {
    clearTimeout(state.timer);
    const txt = document.getElementById('command-text');
    const gameView = document.getElementById('game-view');
    
    if (ok) {
        state.hits++; 
        state.combo++;
        state.times.push((Date.now() - state.startT)/1000);
        txt.style.color = "var(--success)";
        
        playSound('success');
        createParticles(window.innerWidth/2, window.innerHeight/2, '#10b981');
        updateLevel();
    } else {
        state.combo = 0;
        txt.style.color = "var(--error)";
        gameView.style.animation = 'shake 0.3s';
        setTimeout(() => gameView.style.animation = '', 300);
        playSound('error');
        
        if (!state.powerupActive) {
            const penalty = Math.min(state.currentSpeed * 0.2, 1000);
            state.currentSpeed += penalty;
            setTimeout(() => {
                state.currentSpeed = Math.max(2000, state.baseSpeed - (state.level * 400));
            }, 5000);
        }
    }
    const accuracy = Math.round((state.hits / (state.idx + 1)) * 100);
    document.getElementById('acc-val').innerText = accuracy + "%";
    document.getElementById('acc-val').style.color = accuracy > 80 ? 'var(--success)' : 'var(--error)';
    
    state.idx++;
    setTimeout(() => { if(state.active) runTask(); }, 600);
}
function processInput(type) {
    const cur = state.list[state.idx];
    if (type === 'doubleShift' && cur.doubleShift) resolveTask(true);
}
function finishSession() {
    state.active = false;
    document.getElementById('game-view').classList.add('hidden');
    document.getElementById('result-view').classList.remove('hidden');
    
    const avg = state.times.length ? (state.times.reduce((a,b)=>a+b,0)/state.times.length).toFixed(2) : "0.00";
    document.getElementById('final-stats').innerHTML = `
        Accuracy: ${Math.round((state.hits/state.list.length)*100)}% <br>
        Average Speed: ${avg}s <br>
        Total Hits: ${state.hits} <br>
        Level Reached: ${state.level}
    `;
}
window.addEventListener('keyup', (e) => {
    if (state.active) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.returnValue) e.returnValue = false;
        return false;
    }
}, true);
window.addEventListener('keypress', (e) => {
    if (state.active) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (e.returnValue) e.returnValue = false;
        return false;
    }
}, true);
window.addEventListener('beforeunload', (e) => {
    if (state.active) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});
