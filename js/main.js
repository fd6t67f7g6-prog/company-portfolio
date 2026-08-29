/* optimizedinvision — interactions */

/* ---------- nav ---------- */
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
}, { passive:true });

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const expanded = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', expanded);
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---------- reveal on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .process-step');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });
revealEls.forEach(el => io.observe(el));

/* ---------- animated counters ---------- */
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = val.toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => counterIO.observe(el));

/* ---------- 3D tilt on service cards ---------- */
document.querySelectorAll('.service-card').forEach(card => {
  const strength = 8;
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(0)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
});

/* ---------- testimonial carousel ---------- */
const track = document.querySelector('.testi-track');
const prevBtn = document.querySelector('.testi-prev');
const nextBtn = document.querySelector('.testi-next');
if (track) {
  const scrollAmount = () => track.querySelector('.testi-card').offsetWidth + 22;
  nextBtn?.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  prevBtn?.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
}

/* ---------- year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- three.js hero scene ---------- */
(function heroScene(){
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = canvas.clientWidth, height = canvas.clientHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 100);
  camera.position.set(0, 0, 9);

  // wireframe icosahedron — the "lens" geometry
  const geo = new THREE.IcosahedronGeometry(3.1, 1);
  const wire = new THREE.WireframeGeometry(geo);
  const mat = new THREE.LineBasicMaterial({ color: 0xFFB238, transparent:true, opacity:0.35 });
  const lens = new THREE.LineSegments(wire, mat);
  lens.position.set(2.1, 0, 0);
  scene.add(lens);

  const geo2 = new THREE.IcosahedronGeometry(1.5, 0);
  const wire2 = new THREE.WireframeGeometry(geo2);
  const mat2 = new THREE.LineBasicMaterial({ color: 0x5EEAD4, transparent:true, opacity:0.28 });
  const lens2 = new THREE.LineSegments(wire2, mat2);
  lens2.position.set(2.1, 0, 0);
  scene.add(lens2);

  // particle field — data points being optimized
  const particleCount = 140;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++){
    positions[i*3]   = (Math.random() - 0.5) * 16;
    positions[i*3+1] = (Math.random() - 0.5) * 9;
    positions[i*3+2] = (Math.random() - 0.5) * 6;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({ color:0xF5F3EE, size:0.035, transparent:true, opacity:0.5 });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  }, { passive:true });

  function resize(){
    width = canvas.clientWidth; height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let raf;
  function animate(t){
    raf = requestAnimationFrame(animate);
    lens.rotation.y = t * 0.00012;
    lens.rotation.x = t * 0.00008;
    lens2.rotation.y = -t * 0.00018;
    lens2.rotation.x = t * 0.00010;
    points.rotation.y = t * 0.00003;
    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  if (!reduceMotion) {
    requestAnimationFrame(animate);
  } else {
    renderer.render(scene, camera);
  }
})();
