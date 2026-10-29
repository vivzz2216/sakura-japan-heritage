/* ===================================================================
   SAKURA SANCTUARY & JAPAN CHERRY BLOSSOM GUIDE
   Complete Interactive Experience Engine
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeroMotion();
  initPetalCanvases();
  initParallax();
  initNavigation();
  initForecastFilter();
  initDestinationModals();
  initWebAudioSanctuary();
  initItineraryPlanner();
  initLiveClocks();
  initNewsletter();
});

/* ===================================================================
   1. DAY / NIGHT THEME ENGINE
   =================================================================== */

let isNight = false;

function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const world = document.querySelector('.world');
  const sceneStatus = document.getElementById('scene-status');
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  // Honour explicit HTML class (.world.is-night / body.is-night) or saved preference; default to Day
  const savedTheme = localStorage.getItem('sakura-theme');
  const preSetNight = document.body.classList.contains('is-night') || (world && world.classList.contains('is-night'));
  if (preSetNight || savedTheme === 'night') {
    setNightMode(true, false);
  } else {
    setNightMode(false, false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setNightMode(!isNight, true);
    });
  }

  function setNightMode(night, animateSwitch) {
    isNight = night;
    document.body.classList.toggle('is-night', isNight);
    if (world) {
      world.classList.toggle('is-night', isNight);
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isNight));
      themeToggle.setAttribute('aria-label', isNight ? 'Switch to daylight view' : 'Switch to night view');
    }
    if (sceneStatus) {
      sceneStatus.textContent = isNight ? 'Moonlight · Lantern Glow' : 'Daylight · Mountain Mist';
    }
    const toggleLabel = document.getElementById('toggle-label');
    if (toggleLabel) {
      toggleLabel.textContent = isNight ? 'Day' : 'Night';
    }
    if (metaTheme) {
      metaTheme.content = isNight ? '#080f1d' : '#87b2dc';
    }
    try {
      localStorage.setItem('sakura-theme', isNight ? 'night' : 'day');
    } catch (e) {}

    if (animateSwitch && window.Motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const { animate, spring } = window.Motion;
      const thumb = document.querySelector('.toggle-thumb');
      if (thumb) {
        animate(thumb, { x: isNight ? 32 : 0, scale: [0.9, 1.08, 1] }, { type: spring, stiffness: 380, damping: 24 });
      }
      if (sceneStatus) {
        animate(sceneStatus, { opacity: [0.25, 1], y: [5, 0] }, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
      }
    }
  }
}

/* ===================================================================
   1B. MOTION.DEV ENTRANCE CHOREOGRAPHY & TACTILE BUTTONS
   =================================================================== */

function initHeroMotion() {
  if (!window.Motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { animate, stagger, hover, press, spring } = window.Motion;

  const chars = document.querySelectorAll('.wordmark-char');
  if (chars.length) {
    animate(
      chars,
      { opacity: [0.96, 1], y: [20, 0] },
      { duration: 0.85, delay: stagger(0.055, { startDelay: 0.05 }), ease: [0.16, 1, 0.3, 1] }
    );
  }

  const introItems = document.querySelectorAll('.intro-tag, .intro h1, .intro p, .hero-cta-group');
  if (introItems.length) {
    animate(
      introItems,
      { opacity: [0.96, 1], y: [14, 0] },
      { duration: 0.75, delay: stagger(0.08, { startDelay: 0.12 }), ease: [0.22, 1, 0.36, 1] }
    );
  }

  const chromeItems = document.querySelectorAll('.topbar, .page-indicator, .scroll-cue, .bottom-bar');
  if (chromeItems.length) {
    animate(
      chromeItems,
      { opacity: [0.96, 1] },
      { duration: 0.7, delay: stagger(0.06, { startDelay: 0.18 }), ease: 'easeOut' }
    );
  }

  // Tactile spring micro-interactions on interactive buttons only (never on scene layers)
  const buttons = document.querySelectorAll('.theme-toggle, .btn-explore, .btn-ritual-pill, .breeze-pill');
  if (buttons.length && hover && press) {
    hover(buttons, (el) => {
      animate(el, { scale: 1.03 }, { type: spring, stiffness: 400, damping: 22 });
      return () => animate(el, { scale: 1 }, { type: spring, stiffness: 360, damping: 24 });
    });
    press(buttons, (el) => {
      animate(el, { scale: 0.96 }, { duration: 0.1 });
      return () => animate(el, { scale: 1 }, { type: spring, stiffness: 400, damping: 22 });
    });
  }
}

/* ===================================================================
   2. INTERACTIVE DRIFTING SAKURA PETAL CANVASES
   =================================================================== */

let petalFrontAnimId = null;
let petalBackAnimId = null;
let breezeBoost = 0;

function initPetalCanvases() {
  const canvasFront = document.getElementById('petals-front');
  const canvasBack = document.getElementById('petals-back');
  const breezeBtn = document.getElementById('breeze-btn');

  if (!canvasFront || !canvasBack) return;

  const ctxFront = canvasFront.getContext('2d');
  const ctxBack = canvasBack.getContext('2d');

  function resizeCanvases() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvasFront.width = w;
    canvasFront.height = h;
    canvasBack.width = w;
    canvasBack.height = h;
  }

  window.addEventListener('resize', resizeCanvases, { passive: true });
  resizeCanvases();

  // Create Petal Pools
  const countFront = Math.min(36, Math.floor(window.innerWidth / 35));
  const countBack = Math.min(48, Math.floor(window.innerWidth / 28));

  const petalsFront = Array.from({ length: countFront }, () => createPetal(true));
  const petalsBack = Array.from({ length: countBack }, () => createPetal(false));

  function createPetal(isForeground) {
    const w = canvasFront.width || window.innerWidth;
    const h = canvasFront.height || window.innerHeight;
    return {
      x: Math.random() * (w + 200) - 100,
      y: Math.random() * (h + 100) - 50,
      size: isForeground ? (10 + Math.random() * 12) : (5 + Math.random() * 7),
      speedY: isForeground ? (0.8 + Math.random() * 1.2) : (0.4 + Math.random() * 0.8),
      speedX: isForeground ? (0.6 + Math.random() * 1.0) : (0.3 + Math.random() * 0.6),
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.04,
      oscillation: Math.random() * Math.PI * 2,
      oscillationSpeed: 0.015 + Math.random() * 0.02,
      flip: Math.random() * Math.PI,
      flipSpeed: 0.02 + Math.random() * 0.03,
      alpha: isForeground ? (0.65 + Math.random() * 0.3) : (0.35 + Math.random() * 0.35)
    };
  }

  function drawPetal(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.scale(1, Math.cos(p.flip));

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
    if (isNight) {
      gradient.addColorStop(0, `rgba(255, 230, 240, ${p.alpha * 0.95})`);
      gradient.addColorStop(0.65, `rgba(240, 180, 205, ${p.alpha * 0.8})`);
      gradient.addColorStop(1, `rgba(200, 150, 180, 0)`);
    } else {
      gradient.addColorStop(0, `rgba(255, 245, 248, ${p.alpha})`);
      gradient.addColorStop(0.6, `rgba(250, 205, 220, ${p.alpha * 0.85})`);
      gradient.addColorStop(1, `rgba(235, 160, 185, 0)`);
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size * 0.9, p.size * 0.4, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.8, -p.size * 0.8, 0, -p.size);
    ctx.fill();
    ctx.restore();
  }

  function render() {
    ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);
    ctxBack.clearRect(0, 0, canvasBack.width, canvasBack.height);

    if (breezeBoost > 0) {
      breezeBoost *= 0.985;
      if (breezeBoost < 0.01) breezeBoost = 0;
    }

    const currentBreeze = breezeBoost;

    // Render Back Canvas
    for (const p of petalsBack) {
      p.oscillation += p.oscillationSpeed;
      p.angle += p.spinSpeed;
      p.flip += p.flipSpeed;
      p.y += p.speedY + currentBreeze * 0.8;
      p.x += Math.sin(p.oscillation) * 0.8 + p.speedX + currentBreeze * 2.2;

      if (p.y > canvasBack.height + 20 || p.x > canvasBack.width + 100) {
        p.y = -20;
        p.x = Math.random() * (canvasBack.width + 100) - 100;
      }
      drawPetal(ctxBack, p);
    }

    // Render Front Canvas
    for (const p of petalsFront) {
      p.oscillation += p.oscillationSpeed;
      p.angle += p.spinSpeed;
      p.flip += p.flipSpeed;
      p.y += p.speedY + currentBreeze * 1.2;
      p.x += Math.sin(p.oscillation) * 1.2 + p.speedX + currentBreeze * 3.4;

      if (p.y > canvasFront.height + 30 || p.x > canvasFront.width + 120) {
        p.y = -30;
        p.x = Math.random() * (canvasFront.width + 100) - 100;
      }
      drawPetal(ctxFront, p);
    }

    requestAnimationFrame(render);
  }

  render();

  // "Stir the Breeze" button interaction
  if (breezeBtn) {
    breezeBtn.addEventListener('click', () => {
      breezeBoost = 4.5;
      breezeBtn.classList.add('is-active');
      setTimeout(() => breezeBtn.classList.remove('is-active'), 1800);
    });
  }
}

/* ===================================================================
   3. MOUSE & TOUCH PARALLAX INTERACTION
   =================================================================== */

function initParallax() {
  // Pointer-driven (hover) parallax is switched off: the scene stays still while the cursor moves.
  const ENABLE_POINTER_PARALLAX = false;
  if (!ENABLE_POINTER_PARALLAX) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let isTicking = false;

  function onPointerMove(e) {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetX = x * 2;
    targetY = y * 2;

    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  function updateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    root.style.setProperty('--px', currentX.toFixed(4));
    root.style.setProperty('--py', currentY.toFixed(4));

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      requestAnimationFrame(updateParallax);
    } else {
      isTicking = false;
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
}

/* ===================================================================
   4. NAVIGATION, SCROLL SPY & MOBILE DRAWER
   =================================================================== */

function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const siteNavLinks = document.querySelectorAll('.site-nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  // Mobile Menu Toggle
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileDrawer.hidden = isExpanded;
    });

    // Close drawer when clicking mobile links
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.hidden = true;
      });
    });
  }

  // Scroll Spy for Desktop Navigation
  window.addEventListener('scroll', () => {
    let currentId = 'hero';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    siteNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }, { passive: true });
}

/* ===================================================================
   5. REGIONAL FORECAST FILTER TABS
   =================================================================== */

function initForecastFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.forecast-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const targetRegion = tab.dataset.region;

      cards.forEach(card => {
        const cardRegion = card.dataset.region;
        if (targetRegion === 'all' || cardRegion === targetRegion) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   6. DESTINATION DETAIL MODALS & BREATHING RITUAL
   =================================================================== */

function initDestinationModals() {
  const panel = document.getElementById('panel');
  const panelTitle = document.getElementById('panel-title');
  const panelCopy = document.getElementById('panel-copy');
  const panelClose = document.getElementById('panel-close');
  const panelDone = document.getElementById('panel-done');
  const breathStage = document.getElementById('breath-stage');
  const breathPhase = document.getElementById('breath-phase');

  if (!panel) return;

  const destinationDetails = {
    yoshino: {
      title: 'Mount Yoshino (吉野山) · Nara Sanctuary',
      copy: 'For over 1,300 years, Mount Yoshino has reigned as Japan’s supreme mountain sakura sanctuary. Over 30,000 mountain cherry trees (yamazakura) carpet the sacred slopes. Because the mountain spans over 800 vertical meters, the blooms unfold sequentially across four elevation tiers (Shimo, Naka, Kami, and Oku Senbon) through most of April. Pilgrims hike to Kinpusen-ji temple to view the pink mist curling through primeval cedar forests.'
    },
    kyoto: {
      title: 'The Philosopher’s Path (哲学の道) · Kyoto',
      copy: 'Running alongside an ancient stone aqueduct canal from Ginkaku-ji (Silver Pavilion) to Nanzen-ji, this two-kilometer pathway is completely canopied by hundreds of arching Somei Yoshino and weeping cherry trees. When the breeze stirs, millions of petals float along the clear water surface creating the famous "Hanaikada" (flower rafts).'
    },
    meguro: {
      title: 'Meguro River Yozakura (目黒川) · Tokyo',
      copy: 'Tokyo’s definitive evening sakura experience. Along 3.8 kilometers of canal, 800 cherry blossom trees drape their boughs over the river. At dusk, thousands of pink paper bonbori lanterns illuminate, reflecting on the water while visitors enjoy seasonal rosé and grilled skewers from riverside wooden stalls.'
    },
    fuji: {
      title: 'Chureito Pagoda & Lake Kawaguchi · Mount Fuji',
      copy: 'Perched in Arakurayama Sengen Park, 398 stone steps lead to a view of the five-story crimson pagoda framed by blooming cherry branches and the snow-capped peak of Mount Fuji. In early-to-mid April, morning sunlight casts a golden glow on the mountain peak and the blossoms.'
    },
    yozakura: {
      title: 'The Living Ritual of Yozakura (夜桜)',
      copy: 'In traditional Japanese aesthetics, evening cherry blossom viewing is a sacred communion with nature. As natural light fades, paper lanterns illuminate the blossoms against the twilight sky. The delicate petals glow like lantern-lit clouds, mirroring the transient nature of life.'
    },
    ritual: {
      title: 'Breathe with the Falling Bloom',
      copy: 'Allow your mind to still and your breath to match the rhythm of spring. Follow the expanding blossom ring below: inhale the mountain air for four counts, pause in quiet stillness, and release softly.'
    }
  };

  let breathInterval = null;

  function startBreathing() {
    clearInterval(breathInterval);
    const steps = [
      'Inhale slowly through the nose · 4s',
      'Hold gently in quiet presence · 4s',
      'Exhale softly across the water · 4s'
    ];
    let idx = 0;
    if (breathPhase) breathPhase.textContent = steps[0];
    breathInterval = setInterval(() => {
      idx = (idx + 1) % steps.length;
      if (breathPhase) breathPhase.textContent = steps[idx];
    }, 4000);
  }

  function stopBreathing() {
    clearInterval(breathInterval);
    breathInterval = null;
  }

  document.querySelectorAll('[data-open], [data-detail]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.open || btn.dataset.detail;
      const data = destinationDetails[key];
      if (!data) return;

      panelTitle.textContent = data.title;
      panelCopy.textContent = data.copy;

      const isRitual = key === 'ritual';
      if (breathStage) breathStage.hidden = !isRitual;

      if (isRitual) {
        startBreathing();
      } else {
        stopBreathing();
      }

      panel.showModal();
    });
  });

  const closeDialog = () => {
    stopBreathing();
    panel.close();
  };

  if (panelClose) panelClose.addEventListener('click', closeDialog);
  if (panelDone) panelDone.addEventListener('click', closeDialog);
  panel.addEventListener('click', (e) => {
    if (e.target === panel) closeDialog();
  });
}

/* ===================================================================
   7. GENERATIVE WEB AUDIO ACOUSTIC SANCTUARY
   =================================================================== */

function initWebAudioSanctuary() {
  let audioCtx = null;
  let isPlaying = false;
  let currentPreset = 'breeze';
  let activeNodes = [];
  let masterGain = null;
  let animId = null;

  const quickBtn = document.getElementById('audio-quick-btn');
  const mainPlayBtn = document.getElementById('audio-main-play');
  const volumeSlider = document.getElementById('audio-volume');
  const statusDot = document.getElementById('audio-status-dot');
  const statusText = document.getElementById('audio-status-text');
  const canvas = document.getElementById('audio-canvas');
  const presetChips = document.querySelectorAll('.sound-chip');

  function ensureAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = volumeSlider ? parseFloat(volumeSlider.value) : 0.6;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function stopAllSounds() {
    activeNodes.forEach(item => {
      try {
        if (item.stop) item.stop();
        if (item.disconnect) item.disconnect();
      } catch (e) {}
    });
    activeNodes = [];
  }

  function startSoundscape(preset) {
    ensureAudioContext();
    stopAllSounds();

    const t = audioCtx.currentTime;

    if (preset === 'breeze') {
      // Pink Noise Breeze Generator
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass sweep for swaying trees
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(380, t);
      filter.Q.setValueAtTime(1.8, t);

      // Low frequency oscillator to modulate wind
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, t);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(180, t);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const breezeGain = audioCtx.createGain();
      breezeGain.gain.setValueAtTime(0.5, t);

      whiteNoise.connect(filter);
      filter.connect(breezeGain);
      breezeGain.connect(masterGain);

      whiteNoise.start();
      lfo.start();
      activeNodes.push(whiteNoise, lfo, filter, lfoGain, breezeGain);
    } 
    else if (preset === 'suikinkutsu') {
      // Resonant Garden Water Droplets (Pentatonic pitches: D, E, G, A, B)
      const freqs = [587.33, 659.25, 783.99, 880.00, 987.77, 1174.66];
      let dropletTimer = null;

      function spawnDrop() {
        if (!isPlaying || currentPreset !== 'suikinkutsu') return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const dropGain = audioCtx.createGain();
        const freq = freqs[Math.floor(Math.random() * freqs.length)];

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.35);

        dropGain.gain.setValueAtTime(0, now);
        dropGain.gain.linearRampToValueAtTime(0.35, now + 0.015);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(dropGain);
        dropGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.85);

        const nextInterval = 700 + Math.random() * 1400;
        dropletTimer = setTimeout(spawnDrop, nextInterval);
      }

      spawnDrop();
      activeNodes.push({ stop: () => clearTimeout(dropletTimer) });
    }
    else if (preset === 'bell') {
      // Deep Zen Temple Bonsho Bell (110Hz fundamental with overtone stack)
      const harmonics = [110, 220, 310, 440, 560, 880];
      const gains = [0.45, 0.25, 0.15, 0.08, 0.04, 0.02];

      harmonics.forEach((hFreq, i) => {
        const osc = audioCtx.createOscillator();
        const hGain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(hFreq, t);

        hGain.gain.setValueAtTime(0, t);
        hGain.gain.linearRampToValueAtTime(gains[i], t + 0.04);
        hGain.gain.exponentialRampToValueAtTime(0.0001, t + 9.0);

        osc.connect(hGain);
        hGain.connect(masterGain);

        osc.start(t);
        osc.stop(t + 9.5);
        activeNodes.push(osc, hGain);
      });

      // Repeat bell stroke every 10 seconds
      let bellTimer = setInterval(() => {
        if (!isPlaying || currentPreset !== 'bell') {
          clearInterval(bellTimer);
          return;
        }
        startSoundscape('bell');
      }, 10000);
      activeNodes.push({ stop: () => clearInterval(bellTimer) });
    }
    else if (preset === 'night') {
      // Yozakura Night Crickets & Ambient Drone
      const drone = audioCtx.createOscillator();
      const droneGain = audioCtx.createGain();
      drone.type = 'triangle';
      drone.frequency.setValueAtTime(146.83, t); // D3
      droneGain.gain.setValueAtTime(0.12, t);
      drone.connect(droneGain);
      droneGain.connect(masterGain);
      drone.start();
      activeNodes.push(drone, droneGain);

      // Night Crickets Chirp Pulses
      let cricketTimer = null;
      function chirp() {
        if (!isPlaying || currentPreset !== 'night') return;
        const now = audioCtx.currentTime;
        const cOsc = audioCtx.createOscillator();
        const cGain = audioCtx.createGain();
        cOsc.type = 'sine';
        cOsc.frequency.setValueAtTime(4600 + Math.random() * 200, now);

        cGain.gain.setValueAtTime(0, now);
        cGain.gain.linearRampToValueAtTime(0.06, now + 0.02);
        cGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        cOsc.connect(cGain);
        cGain.connect(masterGain);

        cOsc.start(now);
        cOsc.stop(now + 0.16);

        cricketTimer = setTimeout(chirp, 300 + Math.random() * 600);
      }
      chirp();
      activeNodes.push({ stop: () => clearTimeout(cricketTimer) });
    }

    startVisualizer();
  }

  function togglePlayState() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startSoundscape(currentPreset);
      if (quickBtn) quickBtn.setAttribute('aria-pressed', 'true');
      if (mainPlayBtn) {
        mainPlayBtn.setAttribute('aria-pressed', 'true');
        mainPlayBtn.querySelector('.play-state-icon').textContent = '❚❚';
        mainPlayBtn.querySelector('.play-state-text').textContent = 'Pause Soundscape';
      }
      if (statusDot) statusDot.classList.add('is-playing');
      if (statusText) statusText.textContent = `Playing ${currentPreset.toUpperCase()} atmosphere`;
    } else {
      stopAllSounds();
      if (quickBtn) quickBtn.setAttribute('aria-pressed', 'false');
      if (mainPlayBtn) {
        mainPlayBtn.setAttribute('aria-pressed', 'false');
        mainPlayBtn.querySelector('.play-state-icon').textContent = '▶';
        mainPlayBtn.querySelector('.play-state-text').textContent = 'Play Soundscape';
      }
      if (statusDot) statusDot.classList.remove('is-playing');
      if (statusText) statusText.textContent = 'Audio soundscape paused';
      stopVisualizer();
    }
  }

  if (quickBtn) quickBtn.addEventListener('click', togglePlayState);
  if (mainPlayBtn) mainPlayBtn.addEventListener('click', togglePlayState);

  // Volume Slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(val, audioCtx.currentTime);
      }
    });
  }

  // Preset Selection Chips
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentPreset = chip.dataset.sound;
      if (isPlaying) {
        startSoundscape(currentPreset);
        if (statusText) statusText.textContent = `Playing ${currentPreset.toUpperCase()} atmosphere`;
      }
    });
  });

  // Visualizer Animation
  function startVisualizer() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    cancelAnimationFrame(animId);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 28;
      const barWidth = (canvas.width / bars) - 4;

      for (let i = 0; i < bars; i++) {
        const height = isPlaying 
          ? Math.sin(Date.now() * 0.005 + i * 0.4) * 45 + Math.random() * 35 + 20
          : 6;

        const x = i * (barWidth + 4) + 6;
        const y = canvas.height - height - 15;

        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        if (isNight) {
          grad.addColorStop(0, '#f4a6bc');
          grad.addColorStop(1, '#94a3b8');
        } else {
          grad.addColorStop(0, '#e27d97');
          grad.addColorStop(1, '#c8414b');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 4);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }
    draw();
  }

  function stopVisualizer() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* ===================================================================
   8. INTERACTIVE SAKURA EXPEDITION PLANNER
   =================================================================== */

function initItineraryPlanner() {
  const form = document.getElementById('planner-form');
  const titleEl = document.getElementById('itinerary-title');
  const metaEl = document.getElementById('itinerary-meta');
  const daysEl = document.getElementById('itinerary-days');
  const copyBtn = document.getElementById('btn-copy-itinerary');

  if (!form || !titleEl || !daysEl) return;

  const routes = {
    'early-zen': {
      title: 'Ancient Zen Courtyards & Southern Temple Sanctuary',
      meta: 'Late March First Bloom · Kansai & Kyushu Regional Shinkansen Route',
      days: [
        { day: 'Day 1', title: 'Fukuoka Maizuru Castle Ruins', desc: 'Arrive in Kyushu for Japan’s earliest mainland blooms. Walk among 1,000 cherry trees framing ancient stone fortress walls.' },
        { day: 'Day 2', title: 'Dazaifu Tenmangu Shrine Gardens', desc: 'Stroll across the arched drum bridges over the sacred pond under blooming early sakura and ancient camphor trees.' },
        { day: 'Day 3', title: 'Shinkansen to Hiroshima & Miyajima Island', desc: 'Visit Itsukushima Shrine’s floating torii gate framed by coastal cherry blossoms, followed by an evening tea service.' },
        { day: 'Day 4', title: 'Kyoto Nanzen-ji & Philosopher’s Path', desc: 'Arrive in Kyoto at the start of Kaika (first bloom). Stroll the quiet stone canal before sunset crowds gather.' },
        { day: 'Day 5', title: 'Maruyama Park Evening Weeping Cherry', desc: 'Conclude with a nighttime visit to Kyoto’s legendary Gion weeping sakura tree, lit by flaming bonfire braziers.' }
      ]
    },
    'peak-zen': {
      title: 'Kyoto, Nara & Mount Fuji Sanctuary Route',
      meta: 'Peak Early April Bloom · JR Shinkansen & Kintetsu Pass Recommended',
      days: [
        { day: 'Day 1', title: 'Dawn at the Philosopher’s Path & Nanzen-ji', desc: 'Walk the quiet stone canal at 7:00 AM before the city stirs. Continue through Nanzen-ji’s ancient wooden Sanmon gate for weeping blossoms.' },
        { day: 'Day 2', title: 'Sacred Ridgelines of Mount Yoshino (Nara)', desc: 'Ride the Kintetsu Express to Mount Yoshino. Ascend through Naka Senbon to Kinpusen-ji temple surrounded by 30,000 mountain sakura.' },
        { day: 'Day 3', title: 'Arashiyama Bamboo & Sagano Scenic Railway', desc: 'Catch the Sagano Romantic Train carving through Hozu River ravine lined with wild cherry trees. Enjoy matcha beside Tenryu-ji pond.' },
        { day: 'Day 4', title: 'Chureito Pagoda & Lake Kawaguchi Sunrise', desc: 'Ascend 398 stone steps at dawn for the quintessential view of the crimson pagoda framed by blossoms and snow-capped Mount Fuji.' },
        { day: 'Day 5', title: 'Meguro River Twilight Yozakura (Tokyo)', desc: 'Conclude your journey in Tokyo. Stroll under 800 illuminated cherry trees along the Meguro River canal lit by glowing pink paper lanterns.' }
      ]
    },
    'late-mountain': {
      title: 'Alpine Passes, Aomori Moats & Hokkaido Frontier',
      meta: 'Late April & Early May Late Bloom · JR East & South Hokkaido Rail Pass',
      days: [
        { day: 'Day 1', title: 'Nagano Matsumoto Castle & Alps Backdrop', desc: 'View 300 cherry trees framing Japan’s premier original wooden black fortress against the snow-covered Northern Japan Alps.' },
        { day: 'Day 2', title: 'Kakunodate Samurai District (Akita)', desc: 'Walk through 300-year-old samurai estates whose black cedar walls contrast against cascading pink weeping shidarezakura.' },
        { day: 'Day 3', title: 'Hirosaki Castle Petal Carpet (Aomori)', desc: 'Experience the world-renowned Hanaikada: millions of fallen petals transforming the castle moats into solid floating pink rivers.' },
        { day: 'Day 4', title: 'Hakodate Goryokaku Star Fort (Hokkaido)', desc: 'Cross the Tsugaru Strait to Hokkaido. Climb Goryokaku Tower to gaze down upon 1,600 sakura trees illuminating a five-pointed star fortress.' },
        { day: 'Day 5', title: 'Sapporo Maruyama Park & Hokkaido Shrine', desc: 'Celebrate the final chapter of Japan’s sakura front with a traditional outdoor Genghis Khan barbecue picnic under wild mountain trees.' }
      ]
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const windowVal = document.getElementById('plan-window').value;
    const styleVal = document.getElementById('plan-style').value;
    const key = `${windowVal}-${styleVal}`;
    const selected = routes[key] || routes['peak-zen'];

    titleEl.textContent = selected.title;
    metaEl.textContent = selected.meta;

    daysEl.innerHTML = selected.days.map(d => `
      <div class="day-block">
        <span class="day-num">${d.day}</span>
        <div class="day-content">
          <h4>${d.title}</h4>
          <p>${d.desc}</p>
        </div>
      </div>
    `).join('');
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = `${titleEl.textContent}\n${metaEl.textContent}\n\n` + 
        Array.from(document.querySelectorAll('.day-block'))
          .map(b => `${b.querySelector('.day-num').textContent}: ${b.querySelector('h4').textContent} - ${b.querySelector('p').textContent}`)
          .join('\n\n');

      navigator.clipboard.writeText(text).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✓ Copied to Clipboard</span>';
        setTimeout(() => copyBtn.innerHTML = orig, 2500);
      });
    });
  }
}

/* ===================================================================
   9. LIVE TOKYO & KYOTO CLOCKS (JST)
   =================================================================== */

function initLiveClocks() {
  const clockEl = document.getElementById('clock-jst');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    clockEl.textContent = `${now.toLocaleTimeString('en-GB', options)} JST`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ===================================================================
   10. NEWSLETTER DISPATCH VALIDATION
   =================================================================== */

function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  const statusEl = document.getElementById('newsletter-status');

  if (!form || !emailInput || !statusEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (email && email.includes('@')) {
      statusEl.style.color = 'var(--accent-rose)';
      statusEl.textContent = 'Arigatou gozaimasu. You are subscribed to The Spring Chronicle.';
      emailInput.value = '';
    } else {
      statusEl.style.color = '#ef4444';
      statusEl.textContent = 'Please enter a valid email address.';
    }
  });
}
