(() => {
  const page = location.pathname.split('/').pop() || 'index.html';

  const items = [
    { href: 'index.html', icon: '⌂', label: 'خانه', page: 'index.html' },
    { href: 'analyze.html', icon: '◉', label: 'تحلیل', page: 'analyze.html' },
    { href: 'chat.html', icon: '◌', label: 'چت', page: 'chat.html' },
    { href: 'account.html', icon: '♙', label: 'حساب', page: 'account.html' }
  ];

  const nav = document.createElement('nav');
  nav.className = 'app-bottom-nav';
  nav.setAttribute('aria-label', 'ناوبری اصلی');

  nav.innerHTML = items.map(item => `
    <a href="${item.href}" class="app-nav-item ${page === item.page ? 'active' : ''}">
      <span class="app-nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `).join('');

  const style = document.createElement('style');
  style.textContent = `
    .app-bottom-nav {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 10000;
      height: 68px;
      display: flex;
      direction: rtl;
      align-items: stretch;
      justify-content: space-around;
      background: rgba(17, 24, 39, .97);
      border-top: 1px solid rgba(255,255,255,.14);
      box-shadow: 0 -8px 24px rgba(0,0,0,.28);
      backdrop-filter: blur(12px);
    }
    .app-nav-item {
      flex: 1;
      display: flex;
      gap: 3px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #aeb8c7;
      font-size: 11px;
      font-family: inherit;
      text-decoration: none;
      transition: color .2s, background .2s;
    }
    .app-nav-icon {
      font-size: 24px;
      line-height: 22px;
    }
    .app-nav-item.active {
      color: #ff4b55;
      background: rgba(255, 75, 85, .09);
      font-weight: 700;
    }
    body { padding-bottom: 82px !important; }
  `;

  document.head.appendChild(style);
  document.body.appendChild(nav);
})();
