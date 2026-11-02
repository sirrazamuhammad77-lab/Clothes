
const PRODUCTS = [
  {id:1,name:'Essential Cotton Tee',category:'Clothing',price:29.00,image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80',sizes:'S, M, L, XL',colors:'White, Black',rating:4.8,description:'Thoughtfully selected style, everyday comfort, and a versatile finish. Contact us for availability and sizing.'},
  {id:2,name:'Everyday Overshirt',category:'Clothing',price:58.00,image:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80',sizes:'S, M, L, XL',colors:'Sand, Olive',rating:4.8,description:'Thoughtfully selected style, everyday comfort, and a versatile finish. Contact us for availability and sizing.'},
  {id:3,name:'Modern Denim',category:'Clothing',price:64.00,image:'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80',sizes:'28, 30, 32, 34',colors:'Blue, Black',rating:4.8,description:'Thoughtfully selected style, everyday comfort, and a versatile finish. Contact us for availability and sizing.'},
  {id:4,name:'Weekend Hoodie',category:'Clothing',price:52.00,image:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80',sizes:'S, M, L, XL',colors:'Grey, Black',rating:4.8,description:'Thoughtfully selected style, everyday comfort, and a versatile finish. Contact us for availability and sizing.'},
  {id:5,name:'Classic Runner',category:'Shoes',price:89.00,image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',sizes:'39–45',colors:'Red, White',rating:4.8,description:'Thoughtfully selected style, everyday comfort, and a versatile finish. Contact us for availability and sizing.'},
  {id:6,name:'Studio Sneaker',category:'Shoes',price:95.00,image:'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80',sizes:'39–45',colors:'White, Black',rating:4.8,description:'Thoughtfully selected style, everyday comfort, and a versatile finish. Contact us for availability and sizing.'},
  {id:7,name:'Urban Leather Shoe',category:'Shoes',price:110.00,image:'https://images.unsplash.com/photo-1614252369475-531ief837?auto=format&fit=crop&w=700&q=80',sizes:'40–45',colors:'Brown, Black',rating:4.8,description:'Thoughtfully selected style, everyday comfort, and a versatile finish. Contact us for availability and sizing.'},
  {id:8,name:'Everyday Slides',category:'Shoes',price:35.00,image:'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=700&q=80',sizes:'39–45',colors:'Black, Tan',rating:4.8,description:'Thoughtfully selected style, everyday comfort, and a versatile finish. Contact us for availability and sizing.'}
];
const money = n => '$' + Number(n).toFixed(2);
let cart = JSON.parse(localStorage.getItem('stylehub-cart') || '[]');
let activeProduct = null;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function updateCart(){
  localStorage.setItem('stylehub-cart', JSON.stringify(cart));
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  $$('.cart-count').forEach(el=>el.textContent=count);
  const holder=$('#cartItems');
  if(!holder) return;
  if(!cart.length){holder.innerHTML='<div class="empty">Your bag is waiting for something beautiful.</div>';}
  else holder.innerHTML=cart.map(item=>`<div class="cart-item">
    <img src="${item.image}" alt="${item.name}">
    <div><strong>${item.name}</strong><div>${item.size||'One size'} · ${item.color||'Standard'}</div>
    <div class="qty"><button data-qty="${item.key}" data-step="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${item.key}" data-step="1" aria-label="Increase quantity">+</button></div></div>
    <div><strong>${money(item.price*item.qty)}</strong><br><button data-remove="${item.key}" style="border:0;background:none;color:#999;margin-top:8px">Remove</button></div>
  </div>`).join('');
  const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  $('#cartSubtotal').textContent=money(total);
}
function toast(message){const el=$('#toast');if(!el)return;el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function addToCart(product,size='',color=''){
  const key=[product.id,size,color].join('|');
  const existing=cart.find(x=>x.key===key);
  if(existing) existing.qty++; else cart.push({key,id:product.id,name:product.name,price:product.price,image:product.image,size,color,qty:1});
  updateCart();toast(`${product.name} added to your bag`);
}
function openCart(){ $('#cartDrawer')?.classList.add('open'); $('#cartDrawer')?.setAttribute('aria-hidden','false'); }
function closeCart(){ $('#cartDrawer')?.classList.remove('open'); $('#cartDrawer')?.setAttribute('aria-hidden','true'); }
function productCard(p){return `<article class="product-card reveal">
  <div class="product-image"><img loading="lazy" src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80'"><span class="tag">${p.category}</span>
  <button class="quick-add" data-quick="${p.id}">Quick add +</button></div>
  <div class="product-info"><h3>${p.name}</h3><div class="product-meta"><span class="stars">★★★★★ <span style="color:#999">${p.rating}</span></span><span class="price">${money(p.price)}</span></div><div style="margin-top:7px"><button class="text-link" data-view="${p.id}" style="padding:0;border:0;background:none;text-decoration:underline;font-size:11px">View details</button></div></div></article>`}
function renderFeatured(){const el=$('#featuredProducts');if(el)el.innerHTML=PRODUCTS.slice(0,4).map(productCard).join('');}
function renderShop(){
 const grid=$('#shopProducts');if(!grid)return;
 const query=($('#productSearch')?.value||'').toLowerCase();
 const category=$('#categoryFilter')?.value||'All';
 const sort=$('#sortFilter')?.value||'featured';
 const max=Number($('#priceFilter')?.value||500);
 let list=PRODUCTS.filter(p=>(category==='All'||p.category===category)&&p.price<=max&&(p.name+' '+p.category).toLowerCase().includes(query));
 if(sort==='low')list.sort((a,b)=>a.price-b.price);
 if(sort==='high')list.sort((a,b)=>b.price-a.price);
 if(sort==='new')list=[...list].reverse();
 grid.innerHTML=list.length?list.map(productCard).join(''):'<div class="empty">No products match your search. Try another filter.</div>';
 observeReveals();
}
function openProduct(id){
 const p=PRODUCTS.find(x=>x.id===Number(id));if(!p)return;activeProduct=p;
 $('#modalContent').innerHTML=`<img src="${p.image}" alt="${p.name}"><div class="modal-content"><div class="eyebrow">${p.category} / STYLEHUB EDIT</div><h2 class="page-title">${p.name}</h2><div class="price">${money(p.price)}</div><p>${p.description}</p><label for="sizeSelect">Choose size</label><select id="sizeSelect">${p.sizes.split(',').map(s=>`<option>${s.trim()}</option>`).join('')}</select><label for="colorSelect">Choose color</label><select id="colorSelect">${p.colors.split(',').map(s=>`<option>${s.trim()}</option>`).join('')}</select><button class="btn" id="modalAdd">Add to bag — ${money(p.price)}</button></div>`;
 $('#productModal').classList.add('open');$('#productModal').setAttribute('aria-hidden','false');
}
function observeReveals(){
 const items=$$('.reveal:not(.visible)');
 if(!('IntersectionObserver'in window)){items.forEach(x=>x.classList.add('visible'));return}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
 items.forEach(el=>observer.observe(el));
}
document.addEventListener('click',e=>{
 const quick=e.target.closest('[data-quick]');if(quick){const p=PRODUCTS.find(x=>x.id===Number(quick.dataset.quick));addToCart(p);return}
 const view=e.target.closest('[data-view]');if(view){openProduct(view.dataset.view);return}
 const qty=e.target.closest('[data-qty]');if(qty){const item=cart.find(x=>x.key===qty.dataset.qty);if(item){item.qty+=Number(qty.dataset.step);if(item.qty<=0)cart=cart.filter(x=>x!==item);updateCart()}return}
 const remove=e.target.closest('[data-remove]');if(remove){cart=cart.filter(x=>x.key!==remove.dataset.remove);updateCart();return}
 if(e.target.closest('#cartButton'))openCart();
 if(e.target.closest('#cartClose'))closeCart();
 if(e.target.closest('#menuToggle'))$('#navLinks')?.classList.toggle('open');
 if(e.target.closest('#modalClose')||e.target.id==='productModal'){$('#productModal')?.classList.remove('open');}
 if(e.target.closest('#modalAdd')&&activeProduct){addToCart(activeProduct,$('#sizeSelect').value,$('#colorSelect').value);$('#productModal').classList.remove('open')}
});
['productSearch','categoryFilter','sortFilter','priceFilter'].forEach(id=>document.addEventListener('input',e=>{if(e.target.id===id)renderShop()}));
document.addEventListener('submit',e=>{
 if(e.target.id==='newsletterForm'){e.preventDefault();toast('Thanks for subscribing! Connect a mailing service to receive sign-ups.');e.target.reset()}
 if(e.target.id==='contactForm'){e.preventDefault();const status=$('#contactStatus');status.textContent='Your form is valid. Connect an email or backend service to deliver this message.';e.target.reset()}
});
document.addEventListener('DOMContentLoaded',()=>{
 updateCart();renderFeatured();renderShop();observeReveals();
 const current=location.pathname.split('/').pop()||'index.html';
 $$('[data-page]').forEach(a=>{if(a.dataset.page===current)a.classList.add('active')});
});
