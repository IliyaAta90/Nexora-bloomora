const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const header = $('#header');
const cartCount = $('#cartCount');
const productsGrid = $('#productsGrid');
let cart = 0;

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
  $$('.parallax-flower').forEach(el => {
    const speed = Number(el.dataset.speed || 0.1);
    el.style.transform = `translateY(${window.scrollY * speed}px)`;
  });
});

async function loadProducts(){
  try{
    const res = await fetch('data/products.json');
    const products = await res.json();
    productsGrid.innerHTML = products.map(p => `
      <article class="product-card">
        <div class="product-image"><img src="${p.image}" alt="${p.title}"></div>
        <div class="product-info">
          <h3>${p.title}</h3>
          <div class="rating">${p.rating} <span>(${p.reviews})</span></div>
          <p class="price">${p.price}</p>
          <button class="add-cart">افزودن به سبد</button>
        </div>
      </article>
    `).join('');
    $$('.add-cart').forEach(btn => btn.addEventListener('click', addToCart));
  }catch(e){
    productsGrid.innerHTML = '<p class="load-error">محصولات لود نشدند. پروژه را با Live Server باز کن.</p>';
  }
}

function addToCart(e){
  cart++;
  cartCount.textContent = cart;
  const btn = e.currentTarget;
  btn.textContent = 'اضافه شد ✓';
  btn.style.background = '#7f956f';
  btn.style.color = '#fff';
  setTimeout(() => { btn.textContent = 'افزودن به سبد'; btn.removeAttribute('style'); }, 1100);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
}, {threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

function createPetal(){
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.textContent = Math.random() > .5 ? '❀' : '♡';
  petal.style.right = Math.random() * 100 + 'vw';
  petal.style.fontSize = (12 + Math.random() * 18) + 'px';
  petal.style.animationDuration = (7 + Math.random() * 7) + 's';
  petal.style.setProperty('--x', (Math.random() * 180 - 90) + 'px');
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 15000);
}
setInterval(createPetal, 900);

const cursor = $('#cursorDot');
if (matchMedia('(pointer:fine)').matches) {
  cursor.style.display = 'block';
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = $(a.getAttribute('href'));
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth'});
  });
});

loadProducts();
