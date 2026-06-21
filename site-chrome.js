(() => {
  if (!document.querySelector('link[href*="remixicon"]')) {
    const iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css';
    document.head.appendChild(iconLink);
  }

  if (!document.querySelector('link[href$="site-chrome.css"]')) {
    const chromeLink = document.createElement('link');
    chromeLink.rel = 'stylesheet';
    chromeLink.href = 'site-chrome.css';
    document.head.appendChild(chromeLink);
  }

  const contentRoot = document.querySelector('main.shell, main.content-shell, .legal-page');
  if (!contentRoot) {
    return;
  }

  const rootEl = document.documentElement;
  const themeStorageKey = 'solarcare-theme';
  const lightThemeColor = '#f4efe6';
  const darkThemeColor = '#0d1511';

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const primaryNavItems = [
    { href: 'index.html', label: 'Home', icon: 'ri-home-5-line', match: ['index.html', ''] },
    { href: 'about-solarcare.html', label: 'About', icon: 'ri-information-line', match: ['about-solarcare.html'] },
    { href: 'services.html', label: 'Services', icon: 'ri-brush-line', match: ['services.html', 'solar-panel-cleaning-service.html', 'solar-panel-maintenance-service.html', 'solar-panel-repair-service.html', 'amc-plans.html'] },
    { href: 'pricing.html', label: 'Pricing', icon: 'ri-price-tag-3-line', match: ['pricing.html'] },
    { href: 'contact-solarcare.html', label: 'Contact', icon: 'ri-phone-line', match: ['contact-solarcare.html'] }
  ];

  const secondaryNavItems = [
    { href: 'before-after-gallery.html', label: 'Gallery', icon: 'ri-gallery-line', match: ['before-after-gallery.html'] },
    { href: 'blog.html', label: 'Blog', icon: 'ri-article-line', match: ['blog.html', 'why-solar-panel-cleaning-is-important.html', 'how-dust-affects-solar-panel-performance.html', 'best-time-to-clean-solar-panels-india.html', 'solar-panel-cleaning-guide.html', 'solar-panel-cleaning-cost-lucknow.html', 'solar-maintenance-guide-lucknow.html', 'solar-amc-guide.html', 'solar-maintenance-tips-homeowners.html', 'solar-maintenance-myths.html', 'common-mistakes-in-solar-panel-cleaning.html'] },
    { href: 'service-areas.html', label: 'Areas', icon: 'ri-map-pin-line', match: ['service-areas.html', 'lucknow-solar-panel-cleaning.html', 'aliganj-solar-panel-cleaning.html', 'aminabad-solar-panel-cleaning.html', 'ashiyana-solar-panel-cleaning.html', 'gomti-nagar-solar-panel-cleaning.html', 'indira-nagar-solar-panel-cleaning.html', 'jankipuram-solar-panel-cleaning.html', 'kadra-solar-panel-cleaning.html', 'kamta-chauraha-solar-panel-cleaning.html', 'mehndi-tola-solar-maintenance.html', 'rajajipuram-solar-panel-cleaning.html', 'vikas-nagar-solar-panel-cleaning.html', 'solar-panel-cleaning-near-me-lucknow.html'] }
  ];

  const navLinks = primaryNavItems.map((item) => {
    const activeClass = item.match.includes(currentPage) ? ' is-active' : '';
    return `<a class="site-nav-link${activeClass}" href="${item.href}"><i class="${item.icon}" aria-hidden="true"></i><span>${item.label}</span></a>`;
  }).join('');

  const dropdownActive = secondaryNavItems.some((item) => item.match.includes(currentPage)) ? ' is-active' : '';
  const dropdownLinks = secondaryNavItems.map((item) => {
    const activeClass = item.match.includes(currentPage) ? ' is-active' : '';
    return `<a class="site-nav-dropdown-link${activeClass}" href="${item.href}"><i class="${item.icon}" aria-hidden="true"></i><span>${item.label}</span></a>`;
  }).join('');

  const header = document.createElement('header');
  header.className = 'site-chrome-header';
  header.innerHTML = `
    <div class="site-chrome-bar">
      <a class="site-brand" href="index.html" aria-label="IMSOLARCARE home">
        <img class="site-brand-image" src="assets/imsolarcare-navbar-logo.png" alt="IM Solar Care logo">
      </a>
      <button class="site-theme-toggle" type="button" aria-label="Switch to dark mode" title="Switch to dark mode">
        <i class="ri-contrast-2-line" aria-hidden="true"></i>
      </button>
      <button class="site-nav-toggle" type="button" aria-expanded="false" aria-controls="siteNavMenu">Menu</button>
      <nav class="site-nav" id="siteNavMenu" data-site-nav>
        ${navLinks}
        <details class="site-nav-dropdown${dropdownActive}">
          <summary class="site-nav-link site-nav-dropdown-trigger">
            <i class="ri-more-2-fill" aria-hidden="true"></i>
            <span>More</span>
            <i class="ri-arrow-down-s-line" aria-hidden="true"></i>
          </summary>
          <div class="site-nav-dropdown-menu">
            ${dropdownLinks}
          </div>
        </details>
      </nav>
      <div class="site-header-actions">
        <a class="site-action-link site-action-link-call" href="tel:+918112780010">Call Now</a>
        <a class="site-action-link site-action-link-strong" href="https://wa.me/918112780010?text=Hello%20IMSOLARCARE%2C%20I%20want%20to%20book%20a%20service" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    </div>
  `;

  const footer = document.createElement('footer');
  footer.className = 'site-chrome-footer';
  footer.innerHTML = `
    <div class="site-footer-shell">
      <div class="site-footer-top">
        <section class="site-footer-brand-block">
          <img class="site-footer-brand-image" src="assets/imsolarcare-navbar-logo.png" alt="IM Solar Care logo">
          <p class="site-footer-tagline">Care Today, Power Tomorrow</p>
        </section>
        <nav class="site-footer-column" aria-label="Services footer links">
          <a href="services.html">Services</a>
          <a href="pricing.html">Pricing</a>
          <a href="before-after-gallery.html">Gallery</a>
        </nav>
        <nav class="site-footer-column" aria-label="Support footer links">
          <a href="why-choose-us.html">Why Choose Us</a>
          <a href="faq.html">FAQ</a>
          <a href="blog.html">Blog</a>
        </nav>
        <nav class="site-footer-column" aria-label="Local footer links">
          <a href="service-areas.html">Service Areas</a>
          <a href="https://maps.app.goo.gl/DCYgXagkDjTen2yq8?g_st=ac" target="_blank" rel="noopener noreferrer">Google Review</a>
          <a href="https://www.youtube.com/@imsolarcare" target="_blank" rel="noopener noreferrer">YouTube</a>
        </nav>
        <nav class="site-footer-column" aria-label="Company footer links">
          <a href="about-solarcare.html">About Us</a>
          <a href="contact-solarcare.html">Contact Us</a>
          <a href="privacy.html">Privacy Policy</a>
          <a href="terms.html">Terms & Conditions</a>
        </nav>
      </div>
      <div class="site-footer-divider" aria-hidden="true"></div>
      <div class="site-footer-social-row">
        <a class="site-footer-social-circle" href="https://www.instagram.com/imsolarcare?igsh=MTA2ODZ4ZmtseHlvcg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="ri-instagram-line"></i></a>
        <a class="site-footer-social-circle" href="https://www.facebook.com/share/17XE6ewVoq/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="ri-facebook-circle-line"></i></a>
        <a class="site-footer-social-circle" href="https://www.youtube.com/@imsolarcare" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="ri-youtube-line"></i></a>
        <a class="site-footer-social-circle" href="https://wa.me/918112780010?text=Hello%20IMSOLARCARE%2C%20I%20want%20to%20book%20a%20service" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="ri-whatsapp-line"></i></a>
        <a class="site-footer-social-circle" href="https://maps.app.goo.gl/DCYgXagkDjTen2yq8?g_st=ac" target="_blank" rel="noopener noreferrer" aria-label="Google Review"><i class="ri-star-smile-line"></i></a>
      </div>
      <p class="site-footer-copyright">&copy; <span data-year></span> IMSOLARCARE. All rights reserved.</p>
    </div>
  `;

  document.body.classList.add('with-site-chrome');
  contentRoot.before(header);
  contentRoot.after(footer);

  if (currentPage === 'index.html' || currentPage === '') {
    const oldTopbar = document.querySelector('.topbar');
    if (oldTopbar) {
      oldTopbar.hidden = true;
    }

    const oldFooter = document.querySelector('.footer-box');
    if (oldFooter) {
      const maybeLegal = oldFooter.previousElementSibling;
      oldFooter.hidden = true;
      if (maybeLegal && maybeLegal.classList.contains('legal-box')) {
        maybeLegal.hidden = true;
      }
    }
  }

  const nav = header.querySelector('[data-site-nav]');
  const toggle = header.querySelector('.site-nav-toggle');
  const bar = header.querySelector('.site-chrome-bar');
  const themeToggle = header.querySelector('.site-theme-toggle');

  function ensureThemeMeta() {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    return meta;
  }

  function setThemeIcon(theme) {
    if (!themeToggle) return;
    const isDark = theme === 'dark';
    themeToggle.innerHTML = isDark
      ? '<i class="ri-sun-line" aria-hidden="true"></i>'
      : '<i class="ri-contrast-2-line" aria-hidden="true"></i>';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
  }

  function getInitialTheme() {
    try {
      const savedTheme = localStorage.getItem(themeStorageKey);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch (error) {
      // Ignore localStorage access issues and continue with fallback logic.
    }

    if (rootEl.getAttribute('data-theme') === 'dark') {
      return 'dark';
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  function applyTheme(theme, persist = true) {
    const resolved = theme === 'dark' ? 'dark' : 'light';
    rootEl.setAttribute('data-theme', resolved);
    ensureThemeMeta().setAttribute('content', resolved === 'dark' ? darkThemeColor : lightThemeColor);
    setThemeIcon(resolved);

    if (persist) {
      try {
        localStorage.setItem(themeStorageKey, resolved);
      } catch (error) {
        // Ignore localStorage write issues and continue using the in-memory theme.
      }
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const nextState = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', nextState);
      document.body.classList.toggle('site-menu-open', nextState);
      if (bar) {
        bar.classList.toggle('is-menu-open', nextState);
      }
      toggle.setAttribute('aria-expanded', String(nextState));
    });
  }

  applyTheme(getInitialTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  const yearNode = footer.querySelector('[data-year]');
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) {
      document.body.classList.remove('site-menu-open');
      if (nav) {
        nav.classList.remove('is-open');
      }
      if (bar) {
        bar.classList.remove('is-menu-open');
      }
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
})();
