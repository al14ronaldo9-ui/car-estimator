(() => {
  const page = location.pathname.split('/').pop() || 'index.html';

  const icons = {
    home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.8 12 3l9 7.8v9.2a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>`,
    analyze: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5m0 14h16M7 15l3-4 3 2 5-6"/><circle cx="7" cy="15" r="1"/><circle cx="10" cy="11" r="1"/><circle cx="13" cy="13" r="1"/><circle cx="18" cy="7" r="1"/></svg>`,
    chat: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.7-.8L4 20l1.4-3.6A7.4 7.4 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7z"/></svg>`,
    account: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>`
  };

  const items = [
    { href:'index.html', icon:icons.home, label:'خانه', page:'index.html' },
    { href:'analyze.html', icon:icons.analyze, label:'تحلیل', page:'analyze.html' },
    { href:'chat.html', icon:icons.chat, label:'چت', page:'chat.html' },
    { href:'account.html', icon:icons.account, label:'حساب', page:'account.html' }
  ];

  const nav = document.createElement('nav');
  nav.className = 'app-bottom-nav';
  nav.setAttribute('aria-label','ناوبری اصلی');

  nav.innerHTML = items.map(item => `
    <a href="${item.href}" class="app-nav-item ${page === item.page ? 'active' : ''}">
      <span class="app-nav-icon">${item.icon}</span>
      <span class="app-nav-label">${item.label}</span>
    </a>
  `).join('');

  const style = document.createElement('style');

  style.textContent = `
    .app-bottom-nav{
      position:fixed;
      right:12px;
      bottom:12px;
      left:12px;
      z-index:10000;
      height:66px;
      display:flex;
      direction:rtl;
      align-items:stretch;
      justify-content:space-around;
      padding:6px;
      background:rgba(9,14,21,.88);
      border:1px solid rgba(255,255,255,.09);
      border-radius:18px;
      box-shadow:0 18px 50px rgba(0,0,0,.45);
      backdrop-filter:blur(20px);
      -webkit-backdrop-filter:blur(20px);
    }

    .app-nav-item{
      position:relative;
      flex:1;
      min-width:0;
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;
      gap:4px;
      color:#748294;
      font-size:11px;
      font-weight:600;
      font-family:inherit;
      text-decoration:none;
      border-radius:13px;
      transition:
        color .2s ease,
        background .2s ease,
        transform .2s ease;
    }

    .app-nav-icon{
      width:23px;
      height:23px;
      display:flex;
      align-items:center;
      justify-content:center;
      transition:transform .2s ease;
    }

    .app-nav-icon svg{
      width:22px;
      height:22px;
      fill:none;
      stroke:currentColor;
      stroke-width:1.8;
      stroke-linecap:round;
      stroke-linejoin:round;
    }

    .app-nav-item.active{
      color:#20d3ee;
      background:rgba(32,211,238,.09);
    }

    .app-nav-item.active .app-nav-icon{
      transform:translateY(-1px) scale(1.06);
    }

    .app-nav-item.active::after{
      content:"";
      position:absolute;
      bottom:3px;
      width:18px;
      height:2px;
      border-radius:99px;
      background:#20d3ee;
      box-shadow:0 0 10px rgba(32,211,238,.55);
    }

    .app-nav-item:not(.active):hover{
      color:#b8c4d1;
      background:rgba(255,255,255,.035);
    }

    .app-nav-item:active{
      transform:scale(.96);
    }

    body{
      padding-bottom:94px !important;
    }

    @media(max-width:480px){
      .app-bottom-nav{
        right:8px;
        left:8px;
        bottom:8px;
      }
    }

    @media(prefers-reduced-motion:reduce){
      .app-nav-item,
      .app-nav-icon{
        transition:none;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(nav);
})();
