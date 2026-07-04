(() => {
  const initialPathParts = window.location.pathname.split('/').filter(Boolean);
  const initialRootPrefix = initialPathParts.includes('locations') ? '../' : '';

  if (!document.querySelector('link[href*="remixicon"]')) {
    const iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css';
    document.head.appendChild(iconLink);
  }

  if (!document.querySelector('link[href$="site-chrome.css"]')) {
    const chromeLink = document.createElement('link');
    chromeLink.rel = 'stylesheet';
    chromeLink.href = `${initialRootPrefix}site-chrome.css`;
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

  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || 'index.html';
  const isLocationPage = pathParts.includes('locations');
  const rootPrefix = isLocationPage ? '../' : '';
  const rootHref = (href) => {
    if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) {
      return href;
    }
    return `${rootPrefix}${href}`;
  };
  const primaryNavItems = [
    { href: 'index.html', label: 'Home', icon: 'ri-home-5-line', match: ['index.html', ''] },
    { href: 'about-solarcare.html', label: 'About', icon: 'ri-information-line', match: ['about-solarcare.html'] },
    { href: 'services.html', label: 'Services', icon: 'ri-brush-line', match: ['services.html', 'solar-panel-cleaning-service.html', 'solar-panel-maintenance-service.html', 'solar-panel-repair-service.html', 'amc-plans.html'] },
    { href: 'contact-solarcare.html', label: 'Contact', icon: 'ri-phone-line', match: ['contact-solarcare.html'] }
  ];

  const locationNavItems = [
    { href: 'locations/solar-panel-cleaning-lucknow.html', label: 'Lucknow', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-lucknow.html'] },
    { href: 'locations/solar-panel-cleaning-kanpur.html', label: 'Kanpur', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-kanpur.html'] },
    { href: 'locations/solar-panel-cleaning-noida.html', label: 'Noida', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-noida.html'] },
    { href: 'locations/solar-panel-cleaning-greater-noida.html', label: 'Greater Noida', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-greater-noida.html'] },
    { href: 'locations/solar-panel-cleaning-ghaziabad.html', label: 'Ghaziabad', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-ghaziabad.html'] },
    { href: 'locations/solar-panel-cleaning-agra.html', label: 'Agra', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-agra.html'] },
    { href: 'locations/solar-panel-cleaning-prayagraj.html', label: 'Prayagraj', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-prayagraj.html'] },
    { href: 'locations/solar-panel-cleaning-varanasi.html', label: 'Varanasi', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-varanasi.html'] },
    { href: 'locations/solar-panel-cleaning-meerut.html', label: 'Meerut', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-meerut.html'] },
    { href: 'locations/solar-panel-cleaning-gorakhpur.html', label: 'Gorakhpur', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-gorakhpur.html'] },
    { href: 'locations/solar-panel-cleaning-unnao.html', label: 'Unnao', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-unnao.html'] },
    { href: 'locations/solar-panel-cleaning-basti.html', label: 'Basti', icon: 'ri-map-pin-line', match: ['solar-panel-cleaning-basti.html'] },
    { href: 'locations/solar-panel-cleaning-uttar-pradesh.html', label: 'All Uttar Pradesh', icon: 'ri-road-map-line', match: ['solar-panel-cleaning-uttar-pradesh.html'] }
  ];

  const secondaryNavItems = [
    { href: 'pricing.html', label: 'Pricing', icon: 'ri-price-tag-3-line', match: ['pricing.html'] },
    { href: 'solar-panel-installation-service.html', label: 'Installation', icon: 'ri-sun-line', match: ['solar-panel-installation-service.html'] },
    { href: 'commercial-solar-solutions.html', label: 'Commercial Solar', icon: 'ri-building-4-line', match: ['commercial-solar-solutions.html'] },
    { href: 'before-after-gallery.html', label: 'Gallery', icon: 'ri-gallery-line', match: ['before-after-gallery.html'] },
    { href: 'index.html#reviews', label: 'Reviews', icon: 'ri-star-smile-line', match: [] },
    { href: 'blog.html', label: 'Blogs', icon: 'ri-article-line', match: ['blog.html', 'why-solar-panel-cleaning-is-important.html', 'how-dust-affects-solar-panel-performance.html', 'best-time-to-clean-solar-panels-india.html', 'solar-panel-cleaning-guide.html', 'solar-panel-cleaning-cost-lucknow.html', 'solar-maintenance-guide-lucknow.html', 'solar-amc-guide.html', 'solar-maintenance-tips-homeowners.html', 'solar-maintenance-myths.html', 'common-mistakes-in-solar-panel-cleaning.html'] },
    { href: 'service-areas.html', label: 'Areas', icon: 'ri-map-pin-line', match: ['service-areas.html', 'lucknow-solar-panel-cleaning.html', 'aliganj-solar-panel-cleaning.html', 'aminabad-solar-panel-cleaning.html', 'ashiyana-solar-panel-cleaning.html', 'gomti-nagar-solar-panel-cleaning.html', 'indira-nagar-solar-panel-cleaning.html', 'jankipuram-solar-panel-cleaning.html', 'kadra-solar-panel-cleaning.html', 'kamta-chauraha-solar-panel-cleaning.html', 'mehndi-tola-solar-maintenance.html', 'rajajipuram-solar-panel-cleaning.html', 'vikas-nagar-solar-panel-cleaning.html', 'solar-panel-cleaning-near-me-lucknow.html'] }
  ];

  const navLinks = primaryNavItems.map((item) => {
    const activeClass = item.match.includes(currentPage) ? ' is-active' : '';
    return `<a class="site-nav-link${activeClass}" href="${rootHref(item.href)}"><i class="${item.icon}" aria-hidden="true"></i><span>${item.label}</span></a>`;
  }).join('');

  const locationActive = locationNavItems.some((item) => item.match.includes(currentPage)) ? ' is-active' : '';
  const locationLinks = locationNavItems.map((item) => {
    const activeClass = item.match.includes(currentPage) ? ' is-active' : '';
    return `<a class="site-nav-dropdown-link${activeClass}" href="${rootHref(item.href)}"><i class="${item.icon}" aria-hidden="true"></i><span>${item.label}</span></a>`;
  }).join('');

  const dropdownActive = secondaryNavItems.some((item) => item.match.includes(currentPage)) ? ' is-active' : '';
  const dropdownLinks = secondaryNavItems.map((item) => {
    const activeClass = item.match.includes(currentPage) ? ' is-active' : '';
    return `<a class="site-nav-dropdown-link${activeClass}" href="${rootHref(item.href)}"><i class="${item.icon}" aria-hidden="true"></i><span>${item.label}</span></a>`;
  }).join('');

  const header = document.createElement('header');
  header.className = 'site-chrome-header';
  header.innerHTML = `
    <div class="site-chrome-bar">
      <a class="site-brand" href="index.html" aria-label="IMSOLARCARE home">
        <img class="site-brand-image" src="${rootHref('assets/imsolarcare-navbar-logo.png')}" alt="IM Solar Care logo">
      </a>
      <button class="site-theme-toggle site-theme-toggle-mobile" type="button" aria-label="Switch to dark mode" title="Switch to dark mode">
        <i class="ri-contrast-2-line" aria-hidden="true"></i>
      </button>
      <button class="site-nav-toggle" type="button" aria-expanded="false" aria-controls="siteNavMenu">Menu</button>
      <nav class="site-nav" id="siteNavMenu" data-site-nav>
        ${navLinks}
        <details class="site-nav-dropdown site-nav-locations${locationActive}">
          <summary class="site-nav-link site-nav-dropdown-trigger">
            <i class="ri-map-pin-2-line" aria-hidden="true"></i>
            <span>Locations</span>
            <i class="ri-arrow-down-s-line" aria-hidden="true"></i>
          </summary>
          <div class="site-nav-dropdown-menu">
            ${locationLinks}
          </div>
        </details>
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
        <button class="site-theme-toggle site-theme-toggle-desktop" type="button" aria-label="Switch to dark mode" title="Switch to dark mode">
          <i class="ri-contrast-2-line" aria-hidden="true"></i>
        </button>
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
          <img class="site-footer-brand-image" src="${rootHref('assets/imsolarcare-navbar-logo.png')}" alt="IM Solar Care logo">
          <p class="site-footer-tagline">Care Today, Power Tomorrow</p>
        </section>
        <nav class="site-footer-column" aria-label="Services footer links">
          <a href="${rootHref('services.html')}">Services</a>
          <a href="${rootHref('solar-panel-installation-service.html')}">Installation</a>
          <a href="${rootHref('commercial-solar-solutions.html')}">Commercial Solar</a>
          <a href="${rootHref('solar-amc-service.html')}">Solar AMC</a>
        </nav>
        <nav class="site-footer-column" aria-label="Support footer links">
          <a href="${rootHref('why-choose-us.html')}">Why Choose Us</a>
          <a href="${rootHref('faq.html')}">FAQ</a>
          <a href="${rootHref('blog.html')}">Blog</a>
        </nav>
        <nav class="site-footer-column" aria-label="Local footer links">
          <a href="${rootHref('service-areas.html')}">Service Areas</a>
          <a href="${rootHref('locations/solar-panel-cleaning-uttar-pradesh.html')}">All Uttar Pradesh</a>
          <a href="https://maps.app.goo.gl/DCYgXagkDjTen2yq8?g_st=ac" target="_blank" rel="noopener noreferrer">Google Review</a>
        </nav>
        <nav class="site-footer-column" aria-label="Company footer links">
          <a href="${rootHref('about-solarcare.html')}">About Us</a>
          <a href="${rootHref('contact-solarcare.html')}">Contact Us</a>
          <a href="${rootHref('privacy.html')}">Privacy Policy</a>
          <a href="${rootHref('terms.html')}">Terms & Conditions</a>
        </nav>
      </div>
      <div class="site-footer-area-links" aria-label="Solar panel cleaning service areas in Uttar Pradesh">
        <strong>Solar Panel Cleaning Service Areas in Uttar Pradesh</strong>
        <div>
          <a href="${rootHref('locations/solar-panel-cleaning-lucknow.html')}">Lucknow</a>
          <a href="${rootHref('locations/solar-panel-cleaning-kanpur.html')}">Kanpur</a>
          <a href="${rootHref('locations/solar-panel-cleaning-noida.html')}">Noida</a>
          <a href="${rootHref('locations/solar-panel-cleaning-greater-noida.html')}">Greater Noida</a>
          <a href="${rootHref('locations/solar-panel-cleaning-ghaziabad.html')}">Ghaziabad</a>
          <a href="${rootHref('locations/solar-panel-cleaning-agra.html')}">Agra</a>
          <a href="${rootHref('locations/solar-panel-cleaning-prayagraj.html')}">Prayagraj</a>
          <a href="${rootHref('locations/solar-panel-cleaning-varanasi.html')}">Varanasi</a>
          <a href="${rootHref('locations/solar-panel-cleaning-meerut.html')}">Meerut</a>
          <a href="${rootHref('locations/solar-panel-cleaning-gorakhpur.html')}">Gorakhpur</a>
          <a href="${rootHref('locations/solar-panel-cleaning-bareilly.html')}">Bareilly</a>
          <a href="${rootHref('locations/solar-panel-cleaning-aligarh.html')}">Aligarh</a>
          <a href="${rootHref('locations/solar-panel-cleaning-moradabad.html')}">Moradabad</a>
          <a href="${rootHref('locations/solar-panel-cleaning-ayodhya.html')}">Ayodhya</a>
          <a href="${rootHref('locations/solar-panel-cleaning-jhansi.html')}">Jhansi</a>
          <a href="${rootHref('locations/solar-panel-cleaning-mathura.html')}">Mathura</a>
          <a href="${rootHref('locations/solar-panel-cleaning-saharanpur.html')}">Saharanpur</a>
          <a href="${rootHref('locations/solar-panel-cleaning-unnao.html')}">Unnao</a>
          <a href="${rootHref('locations/solar-panel-cleaning-basti.html')}">Basti</a>
        </div>
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
  const themeToggles = [...header.querySelectorAll('.site-theme-toggle')];
  const navDropdowns = [...header.querySelectorAll('.site-nav-dropdown')];

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
    const isDark = theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggles.forEach((themeToggle) => {
      themeToggle.innerHTML = isDark
        ? '<i class="ri-sun-line" aria-hidden="true"></i>'
        : '<i class="ri-contrast-2-line" aria-hidden="true"></i>';
      themeToggle.setAttribute('aria-label', label);
      themeToggle.setAttribute('title', label);
    });
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

  navDropdowns.forEach((dropdown) => {
    dropdown.addEventListener('toggle', () => {
      if (!dropdown.open) {
        return;
      }

      navDropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.open = false;
        }
      });
    });
  });

  document.addEventListener('click', (event) => {
    if (header.contains(event.target)) {
      return;
    }

    navDropdowns.forEach((dropdown) => {
      dropdown.open = false;
    });
  });

  applyTheme(getInitialTheme(), false);

  themeToggles.forEach((themeToggle) => {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });

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
      navDropdowns.forEach((dropdown) => {
        dropdown.open = false;
      });
    }
  });
})();
