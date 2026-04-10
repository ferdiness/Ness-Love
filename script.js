const noBtn         = document.getElementById("noBtn");
const yesBtn        = document.getElementById("yesBtn");
const mainImage     = document.getElementById("mainImage");
const questionText  = document.getElementById("questionText");
const heartBurst    = document.getElementById("heartBurst");
const shareBtn      = document.getElementById("shareBtn");
const floatingBg    = document.getElementById("floatingBg");
const canvas        = document.getElementById("heartCanvas");
const ctx           = canvas.getContext("2d");

// ============================================================
//  CANVAS SETUP
// ============================================================
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ============================================================
//  TOMBOL NO — KABUR
// ============================================================
noBtn.addEventListener("mouseover", () => {
    noBtn.style.position = "fixed";
    const maxX = window.innerWidth  - noBtn.offsetWidth;
    const maxY = window.innerHeight - noBtn.offsetHeight;
    noBtn.style.left = Math.floor(Math.random() * maxX) + "px";
    noBtn.style.top  = Math.floor(Math.random() * maxY) + "px";
});

// ============================================================
//  TOMBOL YES — ANIMASI LOVE PENUH
// ============================================================
yesBtn.addEventListener("click", () => {

    // 1. Ganti gambar & teks
    mainImage.src = "bear_hug.png";
    mainImage.classList.add("pop");
    questionText.textContent = "Yay! I love you too 💕";
    questionText.classList.add("result");

    // 2. Sembunyikan tombol, tampilkan share
    yesBtn.style.display  = "none";
    noBtn.style.display   = "none";
    setTimeout(() => { shareBtn.style.display = "inline-block"; }, 1500);

    // 3. Ledakan hati besar di tengah
    triggerHeartBurst();

    // 4. Cincin gelombang menyebar (ripple)
    for (let i = 0; i < 4; i++) {
        setTimeout(triggerRing, i * 200);
    }

    // 5. Partikel emoji beterbangan
    setTimeout(spawnParticles, 300);

    // 6. Confetti berwarna-warni
    setTimeout(launchConfetti, 500);

    // 7. Hati canvas jatuh dari atas
    setTimeout(startCanvasHearts, 400);
});

// ============================================================
//  1. LEDAKAN HATI BESAR
// ============================================================
function triggerHeartBurst() {
    heartBurst.classList.remove("hidden");
    setTimeout(() => heartBurst.classList.add("hidden"), 1300);
}

// ============================================================
//  2. CINCIN RIPPLE
// ============================================================
function triggerRing() {
    const ring = document.createElement("div");
    ring.classList.add("ring");
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 1100);
}

// ============================================================
//  3. PARTIKEL EMOJI BETERBANGAN
// ============================================================
function spawnParticles() {
    const emojis = ["❤️", "💕", "💖", "💗", "💘", "🌸", "✨", "💝", "🩷"];
    const count  = 35;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const el = document.createElement("span");
            el.classList.add("love-particle");
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const size = (Math.random() * 1.8 + 1) + "rem";
            const x    = (Math.random() * 90 + 5)  + "vw";
            const dur  = (Math.random() * 1.5 + 1.8) + "s";

            el.style.setProperty("--size", size);
            el.style.setProperty("--x",    x);
            el.style.setProperty("--dur",  dur);

            document.body.appendChild(el);
            setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 200);
        }, i * 60);
    }
}

// ============================================================
//  4. CONFETTI
// ============================================================
function launchConfetti() {
    if (typeof confetti !== "function") return;

    // Ledakan tengah
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#ff5b8a", "#ffc0cb", "#ffffff", "#ff85a1", "#ffb3c6", "#e8194b"]
    });

    // Kiri & kanan
    setTimeout(() => {
        confetti({ particleCount: 70, angle: 60,  spread: 60,
                   origin: { x: 0, y: 0.6 }, colors: ["#ff5b8a","#ffc0cb","#fff"] });
        confetti({ particleCount: 70, angle: 120, spread: 60,
                   origin: { x: 1, y: 0.6 }, colors: ["#ff85a1","#e8194b","#fff"] });
    }, 350);

    // Gelombang ketiga
    setTimeout(() => {
        confetti({ particleCount: 80, spread: 100,
                   origin: { y: 0.4 }, colors: ["#ff5b8a","#ffc0cb","#ffb3c6"] });
    }, 700);
}

// ============================================================
//  5. HATI JATUH DI CANVAS
// ============================================================
let particles = [];
let animating = false;

function startCanvasHearts() {
    animating = true;
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            particles.push(createParticle());
        }, i * 80);
    }
    animateCanvas();

    // Hentikan setelah 6 detik
    setTimeout(() => { animating = false; }, 6000);
}

function createParticle() {
    return {
        x:     Math.random() * canvas.width,
        y:     -20,
        size:  Math.random() * 22 + 10,
        speedY: Math.random() * 2 + 1.5,
        speedX: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        color: ["#ff5b8a","#e8194b","#ff85a1","#ffb3c6","#c9184a"][Math.floor(Math.random()*5)]
    };
}

function drawHeart(x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo( size/2, -size/2,  size,     size/4, 0,     size);
    ctx.bezierCurveTo(-size,    size/4, -size/2, -size/2, 0,    0);
    ctx.fill();
    ctx.restore();
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.y        += p.speedY;
        p.x        += p.speedX;
        p.rotation += p.rotSpeed;
        p.opacity  -= 0.004;
        drawHeart(p.x, p.y, p.size, p.color, Math.max(0, p.opacity), p.rotation);
        if (p.opacity <= 0 || p.y > canvas.height + 30) {
            particles.splice(i, 1);
        }
    });

    if (animating || particles.length > 0) {
        requestAnimationFrame(animateCanvas);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// ============================================================
//  FLOATING HEARTS BACKGROUND (selalu aktif)
// ============================================================
const bgEmojis = ["❤️", "🩷", "💕", "💗"];

function spawnBgHeart() {
    const el = document.createElement("span");
    el.classList.add("bg-heart");
    el.textContent = bgEmojis[Math.floor(Math.random() * bgEmojis.length)];
    const duration = Math.random() * 8 + 8;
    el.style.left              = Math.random() * 100 + "vw";
    el.style.fontSize          = (Math.random() * 1 + 0.9) + "rem";
    el.style.animationDuration = duration + "s";
    el.style.animationDelay    = (Math.random() * 4) + "s";
    floatingBg.appendChild(el);
    setTimeout(() => el.remove(), (duration + 4) * 1000);
}

// Spawn awal & interval terus-menerus
for (let i = 0; i < 12; i++) spawnBgHeart();
setInterval(spawnBgHeart, 1200);

// ============================================================
//  SHARE BUTTON
// ============================================================
function shareWebsite() {
    const text = "Jawab pertanyaan penting ini! 😍❤️\n" + window.location.href;
    if (navigator.share) {
        navigator.share({ title: "Do you love me? 💕", text, url: window.location.href })
            .catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("Link berhasil disalin! Kirim ke gebetanmu 💕");
        }).catch(() => {
            prompt("Salin link ini:", window.location.href);
        });
    }
}
