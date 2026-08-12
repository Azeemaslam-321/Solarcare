(() => {
  const APP_VERSION = '1.0.1';

  // Determine root path prefix for subdirectories like /locations/
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const isLocationPage = pathParts.includes('locations');
  const rootPrefix = isLocationPage ? '../' : '';

  const rootHref = (href) => {
    if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) {
      return href;
    }
    return `${rootPrefix}${href}`;
  };

  // Ensure remixicon and site-chrome.css (versioned) are loaded
  if (!document.querySelector('link[href*="remixicon"]')) {
    const iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css';
    document.head.appendChild(iconLink);
  }

  if (!document.querySelector('link[href*="site-chrome.css"]')) {
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = `${rootPrefix}site-chrome.css?v=${APP_VERSION}`;
    document.head.appendChild(cssLink);
  }

  // Inject Global Multi-City Structured Data (Schema.org)
  if (!document.querySelector('script[id="sp-global-schema"]')) {
    const schemaScript = document.createElement('script');
    schemaScript.id = 'sp-global-schema';
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "IMSOLARCARE",
      "image": "https://imsolarcare.in/assets/commercial-rooftop-cleaning-evening.jpg",
      "@id": "https://imsolarcare.in/",
      "url": "https://imsolarcare.in/",
      "telephone": "+91 8112780010",
      "email": "imsolarcare@gmail.com",
      "priceRange": "₹799 - ₹10,000",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Lucknow",
        "addressLocality": "Lucknow",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "226024",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 26.8467,
        "longitude": 80.9462
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "19:00"
      },
      "areaServed": [
        "Lucknow", "Gomti Nagar", "Aliganj", "Indira Nagar", "Jankipuram", "Ashiyana", "Vikas Nagar", "Rajajipuram", "Hazratganj", "Aminabad",
        "Kanpur", "Ayodhya", "Varanasi", "Prayagraj", "Noida", "Greater Noida", "Ghaziabad", "Gorakhpur", "Bareilly", "Agra", "Aligarh", "Meerut", "Mathura", "Jhansi", "Barabanki", "Unnao", "Sitapur", "Sultanpur"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "520"
      }
    });
    document.head.appendChild(schemaScript);
  }

  // Pure Static Client-Side Application Version Tracking & Single Reload Strategy
  function checkForAppUpdates() {
    try {
      const storedVersion = localStorage.getItem('solarcare_app_version');
      const reloadedVersion = sessionStorage.getItem('solarcare_reloaded_version');

      if (!storedVersion) {
        localStorage.setItem('solarcare_app_version', APP_VERSION);
        return;
      }

      if (storedVersion !== APP_VERSION) {
        localStorage.setItem('solarcare_app_version', APP_VERSION);
        if (reloadedVersion !== APP_VERSION) {
          sessionStorage.setItem('solarcare_reloaded_version', APP_VERSION);
          window.location.reload(true);
        }
      }
    } catch (e) {
      // Non-blocking client storage check
    }
  }

  const currentPage = pathParts[pathParts.length - 1] || 'index.html';

  // Services Navigation Configuration
  const servicesNavItems = [
    { href: 'solar-panel-cleaning-service.html', label: 'Solar Panel Cleaning', icon: 'ri-brush-line' },
    { href: 'solar-panel-installation-service.html', label: 'Installation Support', icon: 'ri-sun-line' },
    { href: 'amc-plans.html', label: 'Solar AMC Plans', icon: 'ri-calendar-check-line' },
    { href: 'solar-panel-repair-service.html', label: 'Repair & Inverter Check', icon: 'ri-tools-line' },
    { href: 'bird-mesh-installation.html', label: 'Bird Mesh & Pest Proofing', icon: 'ri-shield-star-line' },
    { href: 'performance-testing.html', label: 'Performance Monitoring', icon: 'ri-line-chart-line' },
    { href: 'commercial-solar-solutions.html', label: 'Commercial Solar Solutions', icon: 'ri-building-4-line' },
    { href: 'residential-solar-solutions.html', label: 'Residential Solar Care', icon: 'ri-home-4-line' },
    { href: 'solar-inspection-service.html', label: 'Solar Health Check', icon: 'ri-search-eye-line' }
  ];

  // Render Mega Menu Dropdown Links
  const servicesDropdownLinks = servicesNavItems.map(item => `
    <a class="site-nav-dropdown-link" href="${rootHref(item.href)}">
      <i class="${item.icon}" aria-hidden="true"></i>
      <span>${item.label}</span>
    </a>
  `).join('');

  // Render Glassmorphic Site Header (Perfectly Aligned Single Pill Bar)
  function renderHeader() {
    const header = document.createElement('header');
    header.className = 'site-chrome-header';
    header.innerHTML = `
      <div class="site-chrome-bar">
        <a class="site-brand" href="${rootHref('index.html')}" aria-label="IMSOLARCARE Home">
          <img class="site-brand-image" src="${rootHref('assets/imsolarcare-navbar-lockup.png')}" alt="IM Solar Care logo" />
        </a>

        <button class="site-nav-toggle" type="button" aria-expanded="false" id="siteNavToggle">
          <i class="ri-menu-3-line"></i> Menu
        </button>

        <nav class="site-nav" id="siteNavMenu">
          <a class="site-nav-link${['index.html', ''].includes(currentPage) ? ' is-active' : ''}" href="${rootHref('index.html')}">
            <i class="ri-home-5-line"></i><span>Home</span>
          </a>

          <details class="site-nav-dropdown">
            <summary class="site-nav-link">
              <i class="ri-brush-line"></i>
              <span>Services</span>
              <i class="ri-arrow-down-s-line"></i>
            </summary>
            <div class="site-nav-dropdown-menu">
              ${servicesDropdownLinks}
            </div>
          </details>

          <a class="site-nav-link${currentPage === 'pricing.html' ? ' is-active' : ''}" href="${rootHref('pricing.html')}">
            <i class="ri-price-tag-3-line"></i><span>Pricing</span>
          </a>

          <a class="site-nav-link${currentPage === 'amc-plans.html' ? ' is-active' : ''}" href="${rootHref('amc-plans.html')}">
            <i class="ri-calendar-check-line"></i><span>AMC Plans</span>
          </a>

          <a class="site-nav-link${currentPage === 'before-after-gallery.html' ? ' is-active' : ''}" href="${rootHref('before-after-gallery.html')}">
            <i class="ri-gallery-line"></i><span>Gallery</span>
          </a>

          <a class="site-nav-link${currentPage === 'about-solarcare.html' ? ' is-active' : ''}" href="${rootHref('about-solarcare.html')}">
            <i class="ri-information-line"></i><span>About</span>
          </a>

          <a class="site-nav-link${currentPage === 'contact-solarcare.html' ? ' is-active' : ''}" href="${rootHref('contact-solarcare.html')}">
            <i class="ri-phone-line"></i><span>Contact</span>
          </a>
        </nav>

        <div class="site-header-actions">
          <button class="site-theme-toggle" id="themeToggleBtn" type="button" aria-label="Toggle theme mode">
            <i class="ri-sun-line"></i>
          </button>
          <button type="button" class="site-btn-nav sp-open-booking">
            <i class="ri-calendar-check-line"></i> Book Now
          </button>
        </div>
      </div>
    `;

    const existingHeader = document.querySelector('.site-chrome-header');
    if (existingHeader) {
      existingHeader.replaceWith(header);
    } else {
      document.body.prepend(header);
    }
  }

  // Render Footer Shell
  function renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-chrome-footer';
    footer.innerHTML = `
      <div class="site-footer-shell">
        <div class="site-footer-grid">
          <div class="site-footer-brand">
            <a href="${rootHref('index.html')}">
              <img src="${rootHref('assets/imsolarcare-navbar-lockup.png')}" alt="IM Solar Care" style="height: 48px; filter: brightness(0) invert(1);" />
            </a>
            <p>Lucknow's premier professional solar panel cleaning, maintenance, AMC, bird mesh installation, and efficiency monitoring service.</p>
            <div style="display: flex; gap: 12px; font-size: 1.4rem; color: var(--solar-gold);">
              <a href="https://www.instagram.com/imsolarcare" target="_blank" aria-label="Instagram"><i class="ri-instagram-line"></i></a>
              <a href="https://www.facebook.com/share/17XE6ewVoq/" target="_blank" aria-label="Facebook"><i class="ri-facebook-fill"></i></a>
              <a href="https://www.youtube.com/@imsolarcare" target="_blank" aria-label="YouTube"><i class="ri-youtube-line"></i></a>
              <a href="https://wa.me/918112780010" target="_blank" aria-label="WhatsApp"><i class="ri-whatsapp-line"></i></a>
            </div>
          </div>

          <div class="site-footer-col">
            <h4>Our Services</h4>
            <ul class="site-footer-links">
              <li><a href="${rootHref('solar-panel-cleaning-service.html')}">Solar Panel Cleaning</a></li>
              <li><a href="${rootHref('amc-plans.html')}">Solar AMC Contracts</a></li>
              <li><a href="${rootHref('solar-panel-repair-service.html')}">Solar Repair & Diagnostics</a></li>
              <li><a href="${rootHref('bird-mesh-installation.html')}">Bird Mesh Installation</a></li>
              <li><a href="${rootHref('commercial-solar-solutions.html')}">Commercial Solar Cleaning</a></li>
            </ul>
          </div>

          <div class="site-footer-col">
            <h4>Quick Links</h4>
            <ul class="site-footer-links">
              <li><a href="${rootHref('about-solarcare.html')}">About IMSolarCare</a></li>
              <li><a href="${rootHref('pricing.html')}">Pricing & Calculator</a></li>
              <li><a href="${rootHref('before-after-gallery.html')}">Before & After Gallery</a></li>
              <li><a href="${rootHref('faq.html')}">Frequently Asked Questions</a></li>
              <li><a href="${rootHref('service-areas.html')}">Service Areas Network</a></li>
            </ul>
          </div>

          <div class="site-footer-col">
            <h4>Contact Info</h4>
            <ul class="site-footer-links">
              <li><i class="ri-phone-fill" style="color: var(--solar-gold);"></i> <a href="tel:+918112780010" style="color:inherit; text-decoration:none;">+91 8112780010</a></li>
              <li><i class="ri-mail-send-fill" style="color: var(--solar-gold);"></i> imsolarcare@gmail.com</li>
              <li><i class="ri-map-pin-2-fill" style="color: var(--solar-gold);"></i> Lucknow & Uttar Pradesh</li>
              <li><i class="ri-time-fill" style="color: var(--solar-gold);"></i> Mon-Sun: 8:00 AM - 7:00 PM</li>
            </ul>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 24px; margin-top: 24px;">
          <h5 style="color: var(--solar-gold); font-size: 0.92rem; margin-bottom: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
            <i class="ri-map-pin-user-line"></i> Service Network & Top Search Locations Across UP & India
          </h5>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.78rem; color: #cbd5e1;">
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Solar Panel Cleaning Lucknow</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Solar Panel Washer Near Me</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Gomti Nagar Solar Care</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Aliganj Solar Panel Wash</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Indira Nagar Solar AMC</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Jankipuram Solar Cleaning</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Kanpur Commercial Solar Wash</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Ayodhya Solar Panel Cleaning</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Varanasi Rooftop Solar Care</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Prayagraj Solar AMC Contract</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Noida Solar Bird Mesh</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Gorakhpur Solar Plant Care</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">De-Ionized RO Water Solar Wash</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">Solar Inverter Repair Technician</span>
            <span style="background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 999px;">PM Surya Ghar Solar Maintenance</span>
          </div>
        </div>

        <div class="site-footer-bottom">
          <div>&copy; ${new Date().getFullYear()} IMSolarCare. All Rights Reserved. Clean Energy for a Brighter Future.</div>
          <div style="display: flex; gap: 16px;">
            <a href="${rootHref('privacy.html')}">Privacy Policy</a>
            <a href="${rootHref('terms.html')}">Terms of Service</a>
            <a href="${rootHref('disclaimer.html')}">Disclaimer</a>
          </div>
        </div>
      </div>
    `;

    const existingFooter = document.querySelector('.site-chrome-footer');
    if (existingFooter) {
      existingFooter.replaceWith(footer);
    } else {
      document.body.appendChild(footer);
    }
  }

  // Pure Static Client-Side WhatsApp Dispatch Helper
  function sendBookingToWhatsApp(data) {
    const lines = [
      'SolarCare Booking Request',
      '----------------------------------------',
      `Name: ${data.name || 'Not provided'}`,
      `Phone: ${data.phone || 'Not provided'}`,
      `Service: ${data.service || 'Solar Panel Cleaning'}`,
      `Preferred Date: ${data.pref_date || data.date || 'Flexible'}`,
      `Address: ${data.address || 'Not provided'}`,
      `Message: ${data.notes || 'None'}`,
      '----------------------------------------',
      'Sent via imsolarcare.in'
    ];

    const waMessage = encodeURIComponent(lines.join('\n'));
    const waUrl = `https://wa.me/918112780010?text=${waMessage}`;

    const win = window.open(waUrl, '_blank');
    if (!win) {
      window.location.href = waUrl;
    }
  }

  // Render Quick Booking Modal
  function renderBookingModal() {
    if (document.getElementById('spBookingModal')) return;

    const modal = document.createElement('div');
    modal.className = 'sp-modal-overlay';
    modal.id = 'spBookingModal';
    modal.innerHTML = `
      <div class="sp-modal-card">
        <button class="sp-modal-close" id="spModalCloseBtn" type="button" aria-label="Close modal">&times;</button>
        <div style="text-align: center; margin-bottom: 24px;">
          <span class="sp-badge sp-badge-emerald" style="margin-bottom: 8px;">Instant Service Booking</span>
          <h3 style="font-size: 1.5rem;">Book Solar Cleaning & AMC</h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem;">Get 25-35% efficiency boost for your rooftop solar installation!</p>
        </div>

        <form id="spBookingForm">
          <div class="sp-form-group">
            <label for="spBookName">Full Name *</label>
            <input type="text" id="spBookName" name="name" class="sp-form-control" placeholder="e.g. Rahul Sharma" required />
          </div>

          <div class="sp-form-group">
            <label for="spBookPhone">Phone Number *</label>
            <input type="tel" id="spBookPhone" name="phone" class="sp-form-control" placeholder="e.g. 9876543210" required />
          </div>

          <div class="sp-form-group">
            <label for="spBookService">Select Required Service *</label>
            <select id="spBookService" name="service" class="sp-form-control" required>
              <option value="Solar Panel Cleaning (1-3 kW)">Solar Panel Cleaning (1-3 kW) - ₹799</option>
              <option value="Solar Panel Cleaning (4-5 kW)">Solar Panel Cleaning (4-5 kW) - ₹999</option>
              <option value="Solar Panel Cleaning (6-10 kW)">Solar Panel Cleaning (6-10 kW) - ₹1499</option>
              <option value="Solar AMC Plan Basic">Solar AMC Plan Basic - ₹1999/yr</option>
              <option value="Solar AMC Plan Standard">Solar AMC Plan Standard - ₹2999/yr</option>
              <option value="Bird Mesh Installation">Bird Mesh Netting Installation</option>
              <option value="Solar Repair & Diagnostics">Solar Inverter Repair & Diagnostics</option>
              <option value="Commercial Solar Plant (10kW+)">Commercial Solar Plant (10kW+)</option>
            </select>
          </div>

          <div class="sp-form-group">
            <label for="spBookDate">Preferred Date</label>
            <input type="date" id="spBookDate" name="pref_date" class="sp-form-control" />
          </div>

          <div class="sp-form-group">
            <label for="spBookAddress">Full Rooftop Address & Locality</label>
            <textarea id="spBookAddress" name="address" class="sp-form-control" rows="2" placeholder="e.g. Plot 45, Sector 5, Gomti Nagar, Lucknow"></textarea>
          </div>

          <button type="submit" class="sp-btn sp-btn-primary" style="width: 100%;">
            <i class="ri-whatsapp-line" style="font-size: 1.2rem; color: #25d366;"></i> Confirm & Send via WhatsApp
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Render Mobile Floating Action Bar
  function renderMobileBar() {
    if (document.getElementById('spMobileBar')) return;

    const bar = document.createElement('div');
    bar.className = 'sp-mobile-bar';
    bar.id = 'spMobileBar';
    bar.innerHTML = `
      <div class="sp-mobile-bar-flex">
        <a class="sp-mobile-btn sp-mobile-whatsapp" href="https://wa.me/918112780010?text=Hi%20IMSolarCare,%20I%20want%20to%20book%20solar%20cleaning" target="_blank" aria-label="WhatsApp Us">
          <i class="ri-whatsapp-line"></i> WhatsApp
        </a>
        <a class="sp-mobile-btn sp-mobile-call" href="tel:+918112780010" aria-label="Call Us">
          <i class="ri-phone-line"></i> Call Now
        </a>
        <button type="button" class="sp-mobile-btn sp-mobile-book sp-open-booking" aria-label="Book Service">
          <i class="ri-calendar-check-line"></i> Book Slot
        </button>
      </div>
    `;
    document.body.appendChild(bar);
  }

  // Render Interactive AI Chatbot Widget
  function renderChatbotWidget() {
    if (document.getElementById('spChatbotWidget')) return;

    const widget = document.createElement('div');
    widget.className = 'sp-chatbot-widget';
    widget.id = 'spChatbotWidget';
    widget.innerHTML = `
      <div class="sp-chatbot-box" id="spChatbotBox">
        <div class="sp-chat-header">
          <div class="sp-chat-header-info">
            <div class="sp-chat-avatar"><i class="ri-robot-2-line"></i></div>
            <div>
              <strong style="display: block; font-size: 0.95rem; color: #ffffff;">SolarCare AI Assistant</strong>
              <span style="font-size: 0.75rem; color: #34d399;">● Online | 24/7 Solar Expert</span>
            </div>
          </div>
          <button type="button" id="spChatCloseBtn" style="background: transparent; border: none; color: #ffffff; font-size: 1.3rem; cursor: pointer;">&times;</button>
        </div>

        <div class="sp-chat-messages" id="spChatMessages">
          <div class="sp-chat-msg sp-chat-msg-bot">
            👋 Namaste! Welcome to <b>IMSolarCare</b>! I am your AI Solar Assistant.<br><br>How can I assist you with your rooftop solar plant today?
          </div>
          <div class="sp-chat-chips" id="spChatChips">
            <span class="sp-chat-chip" data-query="cleaning rates">💰 Solar Wash Rates</span>
            <span class="sp-chat-chip" data-query="amc plans">📅 AMC Contract Tiers</span>
            <span class="sp-chat-chip" data-query="bird mesh">🛡️ Bird Netting</span>
            <span class="sp-chat-chip" data-query="calculate roi">⚡ Calculate ROI</span>
          </div>
        </div>

        <form class="sp-chat-input-row" id="spChatForm">
          <input type="text" id="spChatInput" class="sp-chat-input" placeholder="Type your solar question or kW size..." required />
          <button type="submit" class="sp-chat-send" aria-label="Send message"><i class="ri-send-plane-fill"></i></button>
        </form>
      </div>

      <button type="button" class="sp-chatbot-toggle" id="spChatbotToggle" aria-label="Open solar assistant chatbot">
        <i class="ri-chat-3-line"></i>
        <span class="sp-chatbot-ping"></span>
      </button>
    `;
    document.body.appendChild(widget);

    // Chatbot Event Handlers
    const toggleBtn = document.getElementById('spChatbotToggle');
    const box = document.getElementById('spChatbotBox');
    const closeBtn = document.getElementById('spChatCloseBtn');
    const chatMessages = document.getElementById('spChatMessages');
    const chatForm = document.getElementById('spChatForm');
    const chatInput = document.getElementById('spChatInput');
    const chatChips = document.getElementById('spChatChips');

    if (toggleBtn && box) {
      toggleBtn.addEventListener('click', () => {
        box.classList.toggle('is-open');
      });
    }

    if (closeBtn && box) {
      closeBtn.addEventListener('click', () => {
        box.classList.remove('is-open');
      });
    }

    const appendMessage = (content, sender = 'bot') => {
      const msg = document.createElement('div');
      msg.className = `sp-chat-msg sp-chat-msg-${sender}`;
      msg.innerHTML = content;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const showTypingIndicator = () => {
      const typing = document.createElement('div');
      typing.id = 'spChatTyping';
      typing.className = 'sp-chat-typing';
      typing.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> SolarCare Bot is typing...`;
      chatMessages.appendChild(typing);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const removeTypingIndicator = () => {
      const typing = document.getElementById('spChatTyping');
      if (typing) typing.remove();
    };

    const renderInChatBookingForm = () => {
      appendMessage(`
        <div class="sp-chat-inline-form">
          <strong style="color: var(--text-primary); font-size: 0.88rem;">Quick Service Slot Booking:</strong>
          <input type="text" id="spChatFormName" placeholder="Your Full Name *" required />
          <input type="tel" id="spChatFormPhone" placeholder="Your Phone Number *" required />
          <select id="spChatFormService" style="padding: 8px; border-radius: 6px; border: 1px solid var(--border-medium); font-size: 0.85rem;">
            <option value="Solar Cleaning 1-3 kW">Solar Cleaning (1-3 kW) - ₹799</option>
            <option value="Solar Cleaning 4-5 kW">Solar Cleaning (4-5 kW) - ₹999</option>
            <option value="Solar AMC Plan ₹1999">Basic AMC Plan (₹1999)</option>
            <option value="Solar AMC Plan ₹2999">Annual AMC Plan (₹2999)</option>
            <option value="Bird Mesh Netting">Bird Mesh Netting</option>
            <option value="Commercial 10kW+">Commercial Plant (10kW+)</option>
          </select>
          <button type="button" id="spChatInlineSubmit" class="sp-btn sp-btn-primary sp-btn-sm" style="margin-top: 4px;">
            <i class="ri-whatsapp-line" style="color: #25d366;"></i> Send via WhatsApp
          </button>
        </div>
      `);

      setTimeout(() => {
        const btn = document.getElementById('spChatInlineSubmit');
        if (btn) {
          btn.addEventListener('click', () => {
            const name = document.getElementById('spChatFormName').value.trim();
            const phone = document.getElementById('spChatFormPhone').value.trim();
            const service = document.getElementById('spChatFormService').value;

            if (!name || !phone) {
              alert('Please enter your name and phone number.');
              return;
            }

            const data = { name, phone, service, address: 'In-Chat Booking' };
            sendBookingToWhatsApp(data);

            appendMessage(`✅ Your booking details are ready. Please send the WhatsApp message to confirm your request. (Or call us directly at <a href="tel:+918112780010">+91 8112780010</a>)`, 'bot');
          });
        }
      }, 200);
    };

    const handleBotResponse = (query) => {
      const q = query.toLowerCase();
      showTypingIndicator();

      setTimeout(() => {
        removeTypingIndicator();

        const kwMatch = q.match(/(\d+)\s*kw/);
        if (kwMatch) {
          const kw = parseInt(kwMatch[1]);
          const boostUnits = Math.round(kw * 1.2 * 30);
          const rupeeSavings = Math.round(boostUnits * 12 * 7.5);
          appendMessage(`⚡ <b>${kw} kW System ROI Calculation:</b><br>
            • Extra Monthly Generation: <b>+${boostUnits} kWh/mo</b><br>
            • Estimated Annual Savings: <b style="color: var(--solar-amber)">₹${rupeeSavings.toLocaleString('en-IN')}/year</b><br><br>
            Would you like to schedule a de-ionized wash to unlock this extra power?`);
          renderInChatBookingForm();
          return;
        }

        if (q.includes('book') || q.includes('wash') || q.includes('clean') || q.includes('price')) {
          appendMessage(`Our <b>Single Visit De-ionized Solar Wash</b> starts at ₹799 (Up to 3kW). Fill below to book your slot:`);
          renderInChatBookingForm();
        } else if (q.includes('roi') || q.includes('save') || q.includes('power') || q.includes('calculate')) {
          appendMessage(`Dust film reduces solar generation by <b>20% to 35%</b>! <br><br>Type your plant size in kW (e.g. <b>5 kW</b> or <b>10 kW</b>) and I will calculate your exact money savings!`);
        } else if (q.includes('amc') || q.includes('plan') || q.includes('year') || q.includes('contract')) {
          appendMessage(`Our <b>Annual Maintenance Contracts (AMC)</b>:<br>
            • <b>Basic (4 Visits):</b> ₹1,999/yr<br>
            • <b>Standard (6 Visits + Inverter Check):</b> ₹2,999/yr<br>
            • <b>Premium (12 Monthly Visits):</b> ₹4,999/yr<br><br>
            Which AMC plan would you like to enroll in?`);
          renderInChatBookingForm();
        } else if (q.includes('location') || q.includes('area') || q.includes('city') || q.includes('lucknow') || q.includes('kanpur') || q.includes('ayodhya') || q.includes('noida') || q.includes('varanasi')) {
          appendMessage(`📍 <b>Service Network Active!</b><br>
            We cover all Lucknow localities (Gomti Nagar, Aliganj, Indira Nagar, Jankipuram, Aminabad, etc.) & major UP cities (Kanpur, Ayodhya, Varanasi, Prayagraj, Noida, Gorakhpur). <br><br>Standard technician arrival time: <b>Within 24 Hours</b>.`);
        } else if (q.includes('call') || q.includes('phone') || q.includes('contact') || q.includes('number')) {
          appendMessage(`📞 You can speak directly with our team:<br>
            • Hotline: <a href="tel:+918112780010" style="color: var(--solar-emerald); font-weight:700;">+91 8112780010</a><br>
            • WhatsApp: <a href="https://wa.me/918112780010" target="_blank" style="color: #25d366; font-weight:700;">Chat on WhatsApp</a>`);
        } else {
          appendMessage(`I can help you with <b>Solar Panel Cleaning</b>, <b>AMC Contracts</b>, <b>Bird Mesh Netting</b>, and <b>ROI Calculations</b> across Lucknow & UP. <br><br>What service are you looking for today?`);
        }
      }, 400);
    };

    // Chip Click Listener
    if (chatChips) {
      chatChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.sp-chat-chip');
        if (chip) {
          const type = chip.getAttribute('data-query');
          appendMessage(chip.textContent, 'user');
          handleBotResponse(type);
        }
      });
    }

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        chatInput.value = '';
        handleBotResponse(text);
      });
    }
  }

  // Interactive Theme Logic
  function setupTheme() {
    const savedTheme = localStorage.getItem('solarcare-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('solarcare-theme', nextTheme);
      });
    }
  }

  // Mobile Navigation Drawer Handler
  function setupMobileNav() {
    const toggleBtn = document.getElementById('siteNavToggle');
    const navMenu = document.getElementById('siteNavMenu');
    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', isOpen);
      });
    }
  }

  // Booking Modal & Contact Page Event Listeners
  function setupBookingModalEvents() {
    const modal = document.getElementById('spBookingModal');
    const closeBtn = document.getElementById('spModalCloseBtn');
    const form = document.getElementById('spBookingForm');

    document.addEventListener('click', (e) => {
      if (e.target.closest('.sp-open-booking')) {
        if (modal) modal.classList.add('is-open');
      }
    });

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('is-open');
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('is-open');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!data.name || !data.phone) {
          alert('Please fill in your name and phone number.');
          return;
        }

        sendBookingToWhatsApp(data);

        alert('Your booking details are ready. Please send the WhatsApp message to confirm your request. (If WhatsApp does not open, please call us directly at +91 8112780010)');
        form.reset();
        if (modal) modal.classList.remove('is-open');
      });
    }

    // Contact Page Form Handler (#spContactPageForm)
    const contactForm = document.getElementById('spContactPageForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('cName')?.value.trim() || '';
        const phone = document.getElementById('cPhone')?.value.trim() || '';
        const message = document.getElementById('cMessage')?.value.trim() || '';

        if (!name || !phone) {
          alert('Please enter your name and phone number.');
          return;
        }

        const data = { name, phone, service: 'Contact Form Inquiry', notes: message };
        sendBookingToWhatsApp(data);

        alert('Your message details are ready. Please send the WhatsApp message to connect with our support team. (If WhatsApp does not open, please call us directly at +91 8112780010)');
        contactForm.reset();
      });
    }
  }

  // Global Before/After Slider Initializer Helper
  window.initBeforeAfterSliders = function() {
    document.querySelectorAll('.sp-before-after-container').forEach(container => {
      const slider = container.querySelector('.sp-ba-slider-range');
      const afterImg = container.querySelector('.sp-ba-after');
      if (slider && afterImg) {
        slider.addEventListener('input', (e) => {
          afterImg.style.width = `${e.target.value}%`;
        });
      }
    });
  };

  // Global Solar Calculator Initializer Helper
  window.initSolarCalculators = function() {
    const kwSlider = document.getElementById('spKwSlider');
    const kwVal = document.getElementById('spKwVal');
    const kwhBoostVal = document.getElementById('spKwhBoostVal');
    const rupeesSavedVal = document.getElementById('spRupeesSavedVal');
    const co2SavedVal = document.getElementById('spCo2SavedVal');
    const presetsContainer = document.getElementById('spCalcPresets');

    if (kwSlider && kwVal && kwhBoostVal && rupeesSavedVal) {
      const updateCalc = (val) => {
        const kw = parseFloat(val !== undefined ? val : kwSlider.value);
        kwSlider.value = kw;
        kwVal.textContent = `${kw} kW`;
        const monthlyUnitsBoost = Math.round(kw * 1.2 * 30);
        const annualRupeesSaved = Math.round(monthlyUnitsBoost * 12 * 7.5);
        const co2Tons = (monthlyUnitsBoost * 12 * 0.82 / 1000).toFixed(1);

        kwhBoostVal.textContent = `+${monthlyUnitsBoost} kWh/mo`;
        rupeesSavedVal.textContent = `₹${annualRupeesSaved.toLocaleString('en-IN')}`;
        if (co2SavedVal) co2SavedVal.textContent = `${co2Tons} Tons`;

        if (presetsContainer) {
          presetsContainer.querySelectorAll('.sp-calc-preset-btn').forEach(btn => {
            if (parseInt(btn.getAttribute('data-kw')) === kw) {
              btn.classList.add('is-active');
            } else {
              btn.classList.remove('is-active');
            }
          });
        }
      };

      kwSlider.addEventListener('input', (e) => updateCalc(e.target.value));

      if (presetsContainer) {
        presetsContainer.querySelectorAll('.sp-calc-preset-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const kw = parseInt(btn.getAttribute('data-kw'));
            updateCalc(kw);
          });
        });
      }

      updateCalc();
    }
  };

  // Run DOM Injections and Version Check on Load
  document.addEventListener('DOMContentLoaded', () => {
    checkForAppUpdates();
    renderHeader();
    renderFooter();
    renderBookingModal();
    renderMobileBar();
    renderChatbotWidget();
    setupTheme();
    setupMobileNav();
    setupBookingModalEvents();

    if (typeof window.initBeforeAfterSliders === 'function') window.initBeforeAfterSliders();
    if (typeof window.initSolarCalculators === 'function') window.initSolarCalculators();
  });
})();
