// Canvas-based 3D dotted ring
console.log("Portfolio Loaded");

(() => {
  const container = document.getElementById('sphere-container');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Animated 3D ring');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = 0, height = 0;
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  let particles = [];
  let particleCount = Number(document.getElementById('particle-count')?.value) || 1200;
  const countSpan = document.getElementById('particle-count-value');

  let dotSize = Number(document.getElementById('dot-size')?.value) || 0.9;
  const dotSizeSpan = document.getElementById('dot-size-value');

  let dotColor = document.getElementById('dot-color')?.value || '#ff66a3';

  let rotation = { x: 0.35, y: 0.4 };
  let targetRot = { x: 0.35, y: 0.4 };

  let isDragging = false, lastX = 0, lastY = 0;

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function generateRing(n, R = 180, thickness = 0.06) {
    const pts = new Array(n);
    for (let i = 0; i < n; i++) {
      const theta = (i / n) * Math.PI * 2;
      // small jitter along the ring
      const jitter = (Math.random() - 0.5) * (Math.PI * 2 / n) * 0.5;
      const phi = Math.random() * Math.PI * 2; // around tube
      const r = (Math.random() - 0.5) * thickness * R; // tube radius
      const x = (R + r * Math.cos(phi)) * Math.cos(theta + jitter);
      const y = r * Math.sin(phi);
      const z = (R + r * Math.cos(phi)) * Math.sin(theta + jitter);
      pts[i] = { x, y, z };
    }
    return pts;
  }

  function setParticleCount(n) {
    particleCount = Math.max(16, Math.min(8000, Math.floor(n)));
    particles = generateRing(particleCount, Math.min(width, height) * 0.22, 0.08);
    if (countSpan) countSpan.textContent = particleCount;
  }

  function rotatePoint(p, ax, ay) {
    const cosX = Math.cos(ax), sinX = Math.sin(ax);
    let y = p.y * cosX - p.z * sinX;
    let z = p.y * sinX + p.z * cosX;
    const cosY = Math.cos(ay), sinY = Math.sin(ay);
    let x = p.x * cosY + z * sinY;
    z = -p.x * sinY + z * cosY;
    return { x, y, z };
  }

  function hexToRgba(hex, a = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth rotation towards target
    rotation.x += (targetRot.x - rotation.x) * 0.08;
    rotation.y += (targetRot.y - rotation.y) * 0.08;

    const cx = width / 2;
    const cy = height / 2;
    const fov = Math.max(width, height) * 1.1;

    // sort back-to-front
    const sorted = particles.slice().sort((a, b) => b.z - a.z);

    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      const rp = rotatePoint(p, rotation.x, rotation.y);
      const scale = fov / (fov + rp.z);
      const x2 = rp.x * scale + cx;
      const y2 = rp.y * scale + cy;
      const size = Math.max(0.12, dotSize * scale * 0.9);
      const alpha = Math.min(0.95, 0.15 + (scale - 0.06));

      ctx.beginPath();
      ctx.fillStyle = hexToRgba(dotColor, alpha);
      ctx.arc(x2, y2, size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  // pointer drag for rotation (works with mouse & touch)
  container.style.touchAction = 'none';
  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    container.setPointerCapture(e.pointerId);
  });
  container.addEventListener('pointermove', (e) => {
    if (isDragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      targetRot.y += dx * 0.007;
      targetRot.x += dy * 0.007;
      lastX = e.clientX;
      lastY = e.clientY;
    } else {
      // hover subtle rotate
      const rect = container.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      targetRot.y = (mx - 0.5) * 2.0;
      targetRot.x = (my - 0.5) * 2.0 * -1;
    }
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => {
    container.addEventListener(ev, (e) => {
      isDragging = false;
      try { container.releasePointerCapture(e.pointerId); } catch (err) {}
    });
  });

  // controls wiring
  const slider = document.getElementById('particle-count');
  if (slider) {
    slider.addEventListener('input', (e) => {
      setParticleCount(Number(e.target.value));
    });
  }

  const sizeInput = document.getElementById('dot-size');
  if (sizeInput) {
    sizeInput.addEventListener('input', (e) => {
      dotSize = Number(e.target.value);
      if (dotSizeSpan) dotSizeSpan.textContent = dotSize.toFixed(1);
    });
  }

  const colorInput = document.getElementById('dot-color');
  if (colorInput) {
    colorInput.addEventListener('input', (e) => {
      dotColor = e.target.value;
    });
  }

  // initialize
  window.addEventListener('resize', () => {
    resize();
    setParticleCount(particleCount);
  });

  resize();
  setParticleCount(particleCount);
  if (dotSizeSpan) dotSizeSpan.textContent = dotSize.toFixed(1);
  requestAnimationFrame(render);
})();
