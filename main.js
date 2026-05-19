/* ═══════════════════════════════════════════════════════════
   INSTITUTO KENNEDY — Interactions
═══════════════════════════════════════════════════════════ */

/* ─── 1. Nav glass + scroll progress + floating CTA ─── */
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
const floating = document.getElementById('floating');
let lastY = 0;
function onScroll(){
  const y = window.scrollY;
  nav.classList.toggle('glass', y > 60);
  const max = document.body.scrollHeight - window.innerHeight;
  const pct = Math.max(0, Math.min(1, y / max));
  progress.style.width = (pct*100) + '%';
  floating.classList.toggle('show', y > 600);
  lastY = y;
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* ─── 2. Reveal on scroll ─── */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:.14, rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('.reveal, .split-line').forEach(el=>io.observe(el));

/* ─── 3. Hero text staged reveal ─── */
window.addEventListener('load', ()=>{
  // stage out the text lines
  document.querySelectorAll('.hero .split-line').forEach((el,i)=>{
    setTimeout(()=> el.classList.add('in'), 120 + i*120);
  });
  document.querySelectorAll('.hero .reveal').forEach((el,i)=>{
    setTimeout(()=> el.classList.add('in'), 200 + i*120);
  });
});

/* ─── 4. Build marquees ─── */
function buildMarquee(elId, items){
  const track = document.getElementById(elId);
  if(!track) return;
  let html = '';
  for(let i=0;i<3;i++){
    items.forEach(t=>{
      html += `<div class="marquee-item">${t}<span class="marquee-dot"></span></div>`;
    });
  }
  track.innerHTML = html;
}
buildMarquee('marquee-1', [
  'English desde día uno',
  '<em>Bicultural</em> de verdad',
  'Cambridge integrado',
  'STEAM',
  'Kínder · Primaria · Secundaria · Prepa',
  '<em>+40 años</em> formando líderes',
]);
buildMarquee('marquee-2', [
  'Maternal',
  '<em>Kínder</em>',
  'Primaria',
  '<em>Secundaria</em>',
  'Prepa',
  '<em>Universidad</em>',
]);

/* Build universities marquee */
const univs = [
  'ITAM','Tec de Monterrey','UNAM','Anáhuac','Iberoamericana','La Salle',
  'UDLAP','UNITEC','Westhill','UVM','Stanford','MIT','Harvard','UCLA',
  'University of Toronto','Universidad de Texas','NYU','Boston University'
];
const univTrack = document.getElementById('univ-track');
if(univTrack){
  let html = '';
  for(let i=0;i<3;i++){
    univs.forEach(u=>{
      html += `<div class="univ-pill"><span class="dot"></span>${u}</div>`;
    });
  }
  univTrack.innerHTML = html;
}

/* ─── 5. Counter animation ─── */
function animateCount(el){
  const t = parseFloat(el.dataset.target);
  const dec = (el.dataset.decimals|0);
  const dur = 1600;
  const start = performance.now();
  function tick(now){
    const p = Math.min(1, (now-start)/dur);
    const eased = 1 - Math.pow(1-p, 3);
    const val = t * eased;
    el.textContent = dec ? val.toFixed(dec) : Math.floor(val);
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countIo = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !e.target.dataset.done){
      e.target.dataset.done = 1;
      animateCount(e.target);
      countIo.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('.counter').forEach(el=>countIo.observe(el));

/* ─── 6. Manifesto word emphasis on scroll ─── */
const manifesto = document.getElementById('manifesto-text');
if(manifesto){
  const words = manifesto.querySelectorAll('.w');
  let prog = 0;
  function tickManifesto(){
    const rect = manifesto.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh*.5;
    const passed = vh*.6 - rect.top;
    prog = Math.max(0, Math.min(1, passed/total));
    const n = Math.floor(prog * words.length);
    words.forEach((w,i)=> w.classList.toggle('on', i <= n));
  }
  window.addEventListener('scroll', tickManifesto, {passive:true});
  tickManifesto();
}

/* ─── 7. Levels tabs ─── */
document.querySelectorAll('.lvl-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    const target = tab.dataset.target;
    document.querySelectorAll('.lvl-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.lvl-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

/* ─── 8. Day-in-life drag scroll ─── */
const dayTrack = document.getElementById('day-track');
if(dayTrack){
  let isDown=false, startX=0, scrollLeft=0;
  dayTrack.addEventListener('mousedown', e=>{
    isDown=true; dayTrack.classList.add('dragging');
    startX = e.pageX - dayTrack.offsetLeft;
    scrollLeft = dayTrack.scrollLeft;
  });
  dayTrack.addEventListener('mouseleave', ()=>{isDown=false;dayTrack.classList.remove('dragging')});
  dayTrack.addEventListener('mouseup', ()=>{isDown=false;dayTrack.classList.remove('dragging')});
  dayTrack.addEventListener('mousemove', e=>{
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - dayTrack.offsetLeft;
    dayTrack.scrollLeft = scrollLeft - (x - startX) * 1.4;
  });
}

/* ─── 9. FAQ accordion ─── */
window.toggleFaq = function(btn){
  const item = btn.closest('.faq-item');
  const ans = item.querySelector('.faq-a');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>{
    i.classList.remove('open');
    i.querySelector('.faq-a').style.maxHeight = '0';
  });
  if(!isOpen){
    item.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
  }
};

/* ─── 10. AGENDA TU VISITA — global modal ─── */
const modal = document.getElementById('agenda-modal');
const modalForm = document.getElementById('agenda-form');
const tyOverlay = document.getElementById('ty-overlay');

window.openAgenda = function(source){
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  // optional: tag source
  if(source && modalForm) modalForm.dataset.source = source;
  // focus first field
  setTimeout(()=>{ const f = modal.querySelector('input'); if(f) f.focus(); }, 320);
};
window.closeAgenda = function(){
  modal.classList.remove('show');
  document.body.style.overflow = '';
};
window.closeTy = function(){
  tyOverlay.classList.remove('show');
  document.body.style.overflow = '';
  // also reset
  if(modalForm) modalForm.reset();
};

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    if(modal.classList.contains('show')) closeAgenda();
    if(tyOverlay.classList.contains('show')) closeTy();
  }
});

window.submitAgenda = function(e){
  e && e.preventDefault();
  const f = modalForm;
  const required = ['nombre','email','tel','hijo','nivel'];
  for(const k of required){
    const el = f.querySelector(`[name="${k}"]`);
    if(!el || !el.value.trim()){
      el.focus();
      el.style.borderColor = 'var(--red)';
      setTimeout(()=>{ el.style.borderColor = ''; }, 2000);
      return false;
    }
  }
  modal.classList.remove('show');
  setTimeout(()=>{
    tyOverlay.classList.add('show');
  }, 250);
  return false;
};

/* Wire any [data-agenda] CTA */
document.querySelectorAll('[data-agenda]').forEach(el=>{
  el.addEventListener('click', e=>{
    e.preventDefault();
    openAgenda(el.dataset.agenda || 'cta');
  });
});

/* Click-out closes modal */
modal.addEventListener('click', e=>{
  if(e.target === modal) closeAgenda();
});
tyOverlay.addEventListener('click', e=>{
  if(e.target === tyOverlay) closeTy();
});

/* ─── 11. Auto-prompt modal once per scroll session at 70% ─── */
let promptShown = false;
window.addEventListener('scroll', ()=>{
  if(promptShown) return;
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  if(pct > .55){
    promptShown = true;
    // small, non-aggressive — show after 1.2s
    setTimeout(()=>{
      if(!modal.classList.contains('show') && !tyOverlay.classList.contains('show')){
        openAgenda('auto');
      }
    }, 800);
  }
}, {passive:true});

/* ─── 12. Magnetic CTAs (subtle) ─── */
document.querySelectorAll('.btn-red, .btn-navy, .nav-cta').forEach(btn=>{
  btn.addEventListener('mousemove', (e)=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*.18}px, ${y*.18}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
});

/* ─── 13. Tilt on bento heroes ─── */
document.querySelectorAll('.tilt').forEach(el=>{
  el.addEventListener('mousemove', (e)=>{
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(800px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateZ(0)`;
  });
  el.addEventListener('mouseleave', ()=>{ el.style.transform = ''; });
});


/* ─── 14. Custom eagle cursor ─── */
(function(){
  // Inject cursor elements
  const cursorEl = document.createElement('div');
  cursorEl.id = 'ik-cursor';
  cursorEl.innerHTML = `<svg viewBox="0 0 372 330" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M153.09 141.02C153.464 141.41 156.145 139.42 156.674 139.059C177.244 125.099 231.362 87.463 231.362 87.463C231.362 87.463 232.056 105.162 230.314 113.823C227.674 126.94 221.488 135.18 211.046 143.042C196.354 154.108 179.393 163.685 165.024 174.98C164.492 175.398 163.998 175.839 163.551 176.352C163.551 176.704 168.422 180.057 169.147 180.573C183.598 190.863 200.223 200.9 213.904 211.874C230.218 224.959 232.846 243.559 231.375 263.517C231.331 264.129 231.195 264.665 231.039 265.244L230.101 265.08L153.86 212.001L153.083 212.483V256.057H119.174L118.886 189.076C118.613 188.626 117.022 188.582 116.506 188.553C101.098 187.748 90.0536 190.626 75.8556 181.961C65.6796 175.75 58.8756 164.291 51.7106 155.075L52.1486 154.33H118.224L104.606 136.416C97.1836 128.166 85.4966 122.12 74.3286 121.375C53.2956 119.971 37.3996 125.584 19.1996 110.905C13.4726 106.287 5.00158 95.3 0.840579 89.016C0.454579 88.433 -0.103427 87.948 0.0165734 87.146H152.608L153.083 87.621V141.02H153.09Z" fill="#C12423"/>
    <path d="M141.682 70.667C141.349 70.363 143.9 66.972 144.274 66.446C154.143 52.575 166.737 39.819 182.877 33.583C182.949 32.987 182.249 33.361 181.916 33.415C174.136 34.613 165.434 38.441 158.82 42.646L151.506 47.847C154.048 41.787 156.415 35.002 159.806 29.371C161.752 26.1448 164.303 23.7553 167.031 21.2328C157.984 17.2746 151.68 9.8241 149.918 0C153.873 1.4261 157.689 3.3402 161.824 4.4113C177.971 8.5913 193.648 5.2733 209.665 6.6424C216.751 7.2477 222.046 12.3847 224.376 18.8401C231.74 19.0683 240.763 20.3074 245.244 26.8357C248.815 32.036 248.882 37.319 248.153 43.413C247.877 43.743 245.855 41.236 245.453 40.887C238.335 34.758 225.545 38.089 220.449 45.337C216.069 51.567 216.586 57.693 218.915 64.573C219.917 67.527 221.584 70.242 222.446 73.155L193.335 93.481C193.062 84.709 193.914 75.928 196.342 67.495L199.828 56.72C190.419 69.048 186.613 84.37 184.284 99.487L169.563 109.96V77.477C173.55 68.094 178.567 59.338 185.101 51.501C187.133 49.064 189.586 46.953 191.43 44.364C187.852 45.99 184.483 48.547 181.454 51.022C174.776 56.479 168.416 63.34 163.859 70.664H141.676L141.682 70.667ZM223.444 19.0112H202.211C203.054 22.2215 206.962 25.6061 210.292 25.6916C214.2 25.793 216.535 22.7698 219.546 20.9729L223.447 19.0112H223.444Z" fill="#02214D"/>
    <path d="M248.32 87.146H371.438C371.676 87.349 369.623 89.913 369.347 90.283C357.818 105.536 347.702 119.528 326.612 121.071L245.63 121.055C246.802 117.417 247.895 113.066 248.551 108.1C249.654 99.756 249.15 92.546 248.323 87.149L248.32 87.146Z" fill="#02214D"/>
    <path d="M319.783 154.647L308.051 170.328C298.506 181.708 286.802 187.853 271.787 188.572C251.562 189.539 230.583 187.809 210.279 188.572C208.431 188.401 203.652 184.697 201.795 183.429C199.276 181.705 194.551 178.793 192.554 176.825C192.25 176.524 191.952 176.416 192.076 175.887L222.971 154.647H319.786H319.783Z" fill="#02214D"/>
    <path d="M169.569 243.064L223.449 280.307L185.421 329.58L142.318 273.009L169.569 272.378V243.064Z" fill="#02214D"/>
  </svg>`;
  const dotEl = document.createElement('div');
  dotEl.id = 'ik-cursor-dot';
  document.body.appendChild(cursorEl);
  document.body.appendChild(dotEl);

  let mx=0, my=0, cx=0, cy=0, raf;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dotEl.style.left = mx+'px';
    dotEl.style.top  = my+'px';
    if(!raf) raf = requestAnimationFrame(loop);
  });
  document.addEventListener('mouseenter', () => { cursorEl.style.opacity='1'; dotEl.style.opacity='1'; });
  document.addEventListener('mouseleave', () => { cursorEl.style.opacity='0'; dotEl.style.opacity='0'; });
  cursorEl.style.opacity = dotEl.style.opacity = '0';

  function loop(){
    raf = null;
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursorEl.style.left = cx+'px';
    cursorEl.style.top  = cy+'px';
    if(Math.abs(mx-cx)>.3 || Math.abs(my-cy)>.3) raf = requestAnimationFrame(loop);
  }

  document.querySelectorAll('a,button,.btn,.lvl-tab,.event,.cg,.tc,.fc,.bento-cell,.faq-question').forEach(el=>{
    el.addEventListener('mouseenter', () => { cursorEl.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', () => { cursorEl.classList.remove('cursor-hover'); });
  });
})();

/* ─── 15. Hero typewriter cycling words ─── */
(function(){
  const el = document.getElementById('hero-typed-word');
  if(!el) return;
  const words = ['inglés','dos idiomas','el mundo','el futuro'];
  let idx = 0;
  function typeWord(word){
    const chars = word.split('');
    let i = 0;
    el.textContent = '';
    const t = setInterval(()=>{
      el.textContent += chars[i++];
      if(i >= chars.length) clearInterval(t);
    }, 80);
  }
  // Start cycling after hero loads
  setTimeout(()=>{
    setInterval(()=>{
      // Erase
      let t2 = setInterval(()=>{
        el.textContent = el.textContent.slice(0,-1);
        if(!el.textContent.length){
          clearInterval(t2);
          idx = (idx+1) % words.length;
          typeWord(words[idx]);
        }
      }, 50);
    }, 3200);
  }, 2800);
})();

/* ─── 16. Footer h2 word-pop animation ─── */
(function(){
  const h2 = document.getElementById('footer-h2');
  if(!h2) return;
  const footerIo = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !h2.dataset.animated){
        h2.dataset.animated = 1;
        // Split each word into animated spans
        const walker = document.createTreeWalker(h2, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        let node;
        while(node = walker.nextNode()) textNodes.push(node);
        textNodes.forEach(tn=>{
          const words = tn.textContent.split(' ');
          const frag = document.createDocumentFragment();
          words.forEach((w,i)=>{
            const span = document.createElement('span');
            span.textContent = w + (i < words.length-1 ? ' ' : '');
            span.style.cssText = 'display:inline-block;opacity:0;transform:translateY(20px);transition:opacity .5s '+(i*.1)+'s,transform .5s '+(i*.1)+'s cubic-bezier(.19,1,.22,1)';
            frag.appendChild(span);
          });
          tn.replaceWith(frag);
        });
        // Trigger
        setTimeout(()=>{
          h2.querySelectorAll('span[style]').forEach(s=>{
            s.style.opacity='1';
            s.style.transform='none';
          });
        }, 100);
      }
    });
  },{threshold:.3});
  footerIo.observe(h2);
})();
