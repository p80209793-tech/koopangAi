
/**
 * UI Effects: Sparkle Trail & Click Sound
 */

// --- 1. Audio Effect (Synthesized Pop Sound) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClickSound() {
    // Resume context if suspended (browser policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Sound Design: A short, high-pitched "pop"
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // Volume (keep it subtle)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

// Add listeners for sound
document.addEventListener('click', playClickSound);
document.addEventListener('touchstart', playClickSound, { passive: true });


// --- 2. Sparkle Particle Effect ---
const style = document.createElement('style');
style.textContent = `
    .sparkle {
        position: absolute;
        pointer-events: none;
        background-color: #00f2ff; /* Default color, can be randomized */
        border-radius: 50%;
        width: 4px;
        height: 4px;
        z-index: 9999;
        box-shadow: 0 0 10px #00f2ff, 0 0 20px #FF00E5;
        animation: fadeOut 0.8s forwards;
    }
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0) translate(var(--tx), var(--ty)); }
    }
`;
document.head.appendChild(style);

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');

    // Position
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    // Randomize movement via CSS var
    const tx = (Math.random() - 0.5) * 100 + 'px';
    const ty = (Math.random() - 0.5) * 100 + 'px';
    sparkle.style.setProperty('--tx', tx);
    sparkle.style.setProperty('--ty', ty);

    // Random Color (Cyberpunk Palette)
    const colors = ['#00f2ff', '#FF00E5', '#ffffff', '#ffd700'];
    sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.boxShadow = `0 0 10px ${sparkle.style.backgroundColor}`;

    document.body.appendChild(sparkle);

    // Cleanup
    setTimeout(() => {
        sparkle.remove();
    }, 800);
}

// Sparkle Throttle
let lastSparkleTime = 0;
const sparkleLimit = 20; // ms

function handleMove(e) {
    const now = Date.now();
    if (now - lastSparkleTime < sparkleLimit) return;

    let x, y;
    if (e.type.includes('touch')) {
        x = e.touches[0].clientX + window.scrollX;
        y = e.touches[0].clientY + window.scrollY;
    } else {
        x = e.clientX + window.scrollX;
        y = e.clientY + window.scrollY;
    }

    createSparkle(x, y);
    lastSparkleTime = now;
}

// Add listeners for sparkles
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove, { passive: true });
