const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const locationsDir = path.join(root, 'locations');

const priorityDistricts = [
  'Lucknow', 'Kanpur Nagar', 'Gautam Buddha Nagar', 'Ghaziabad', 'Agra', 'Prayagraj', 'Varanasi',
  'Meerut', 'Gorakhpur', 'Bareilly', 'Aligarh', 'Moradabad', 'Ayodhya', 'Jhansi', 'Mathura',
  'Saharanpur', 'Muzaffarnagar', 'Firozabad', 'Barabanki', 'Unnao', 'Sitapur', 'Hardoi',
  'Lakhimpur Kheri', 'Raebareli', 'Basti', 'Bahraich', 'Mirzapur', 'Sonbhadra'
];

const allDistricts = [
  'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
  'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
  'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
  'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad',
  'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
  'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
  'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri',
  'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit',
  'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
  'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra',
  'Sultanpur', 'Unnao', 'Varanasi'
];

const extraLocationTargets = ['Greater Noida'];
const allLocationTargets = [...allDistricts, ...extraLocationTargets];

const districtAlias = {
  'Gautam Buddha Nagar': 'Noida',
  'Kanpur Nagar': 'Kanpur',
  Kheri: 'Lakhimpur Kheri'
};

const servicePages = [
  {
    slug: 'solar-panel-installation-service',
    title: 'Solar Panel Installation in Lucknow | IM Solar Care',
    h1: 'Solar Panel Installation Services in Lucknow',
    kicker: 'Installation Support',
    description: 'Professional solar panel installation support in Lucknow and Uttar Pradesh for residential rooftops, commercial buildings and factory solar systems.',
    intent: 'solar panel installation Lucknow',
    icon: 'ri-sun-line',
    sections: ['Residential rooftop solar installation', 'Commercial solar installation support', 'Factory and warehouse solar planning', 'Mounting, wiring and site guidance']
  },
  {
    slug: 'commercial-solar-solutions',
    title: 'Commercial Solar Services in Lucknow | IM Solar Care',
    h1: 'Commercial Solar Services in Lucknow',
    kicker: 'Commercial Solar',
    description: 'Commercial solar cleaning, installation support, inspection and maintenance planning in Lucknow for offices, schools, hospitals, warehouses and factories.',
    intent: 'commercial solar services Lucknow',
    icon: 'ri-building-4-line',
    sections: ['Commercial solar panel cleaning', 'Large rooftop inspection support', 'Installation-side coordination', 'Scheduled maintenance enquiry']
  },
  {
    slug: 'residential-solar-solutions',
    title: 'Residential Solar Services in Lucknow | IM Solar Care',
    h1: 'Residential Solar Services in Lucknow',
    kicker: 'Residential Solar',
    description: 'Residential solar cleaning, installation support, maintenance, inspection and health check services for homes across Lucknow and Uttar Pradesh.',
    intent: 'residential solar installation Lucknow',
    icon: 'ri-home-smile-line',
    sections: ['Home solar cleaning', 'Residential solar installation support', 'Basic inspection and health check', 'Before and after cleaning proof']
  },
  {
    slug: 'solar-inspection-service',
    title: 'Solar Inspection Service in Lucknow | IM Solar Care',
    h1: 'Solar Inspection Service in Lucknow',
    kicker: 'Solar Inspection',
    description: 'Basic visual solar inspection support in Lucknow for rooftop access, visible panel condition, dust buildup, bird waste and maintenance planning.',
    intent: 'solar inspection Lucknow',
    icon: 'ri-search-eye-line',
    sections: ['Panel surface condition check', 'Rooftop access review', 'Bird dropping and dust assessment', 'Maintenance recommendation']
  },
  {
    slug: 'bird-mesh-installation',
    title: 'Bird Mesh Installation for Solar Panels in Lucknow | IM Solar Care',
    h1: 'Bird Mesh Installation for Solar Panels in Lucknow',
    kicker: 'Bird Mesh',
    description: 'Bird mesh and pigeon protection support for rooftop solar panels in Lucknow to reduce nesting, droppings and repeated dirt buildup.',
    intent: 'bird mesh installation solar panels Lucknow',
    icon: 'ri-shield-star-line',
    sections: ['Bird mesh planning', 'Under-panel nesting protection', 'Bird dropping cleanup support', 'Residential and commercial rooftops']
  },
  {
    slug: 'performance-testing',
    title: 'Solar Performance Testing in Lucknow | IM Solar Care',
    h1: 'Solar Performance Testing Support in Lucknow',
    kicker: 'Performance Testing',
    description: 'Solar performance testing support in Lucknow for customers noticing output drops, dirty panels, inverter concerns or rooftop maintenance issues.',
    intent: 'solar performance testing Lucknow',
    icon: 'ri-line-chart-line',
    sections: ['Output drop discussion', 'Cleaning impact review', 'Basic visible performance checks', 'Maintenance follow-up guidance']
  },
  {
    slug: 'solar-health-check',
    title: 'Solar Health Check in Lucknow | IM Solar Care',
    h1: 'Solar Health Check Services in Lucknow',
    kicker: 'Solar Health Check',
    description: 'Solar health check support in Lucknow for rooftop solar cleaning, visible inspection, panel condition review and maintenance planning.',
    intent: 'solar health check Lucknow',
    icon: 'ri-heart-pulse-line',
    sections: ['Panel cleanliness review', 'Visible condition check', 'Rooftop access notes', 'Cleaning and maintenance guidance']
  },
  {
    slug: 'solar-consultancy',
    title: 'Solar Consultancy in Lucknow | IM Solar Care',
    h1: 'Solar Consultancy and Rooftop Guidance in Lucknow',
    kicker: 'Solar Consultancy',
    description: 'Practical solar consultancy support in Lucknow for cleaning schedules, installation planning, maintenance decisions and rooftop service needs.',
    intent: 'solar consultancy Lucknow',
    icon: 'ri-customer-service-2-line',
    sections: ['Cleaning frequency guidance', 'Installation planning support', 'AMC enquiry guidance', 'Residential and commercial service advice']
  },
  {
    slug: 'solar-amc-service',
    title: 'Solar AMC Services in Lucknow | IM Solar Care',
    h1: 'Solar AMC Services in Lucknow',
    kicker: 'Solar AMC',
    description: 'Solar AMC enquiry support in Lucknow for selected rooftops needing recurring cleaning, inspection and maintenance planning.',
    intent: 'solar AMC Lucknow',
    icon: 'ri-calendar-check-line',
    sections: ['Recurring cleaning enquiry', 'Inspection support', 'Selected rooftop maintenance', 'Commercial AMC discussion']
  }
];

function slugify(value) {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function displayName(district) {
  return districtAlias[district] || district;
}

function citySlug(district) {
  return slugify(displayName(district));
}

function rootPageHref(slug) {
  return `${slug}.html`;
}

function pageShell({ title, description, canonical, body, schema }) {
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="../assets/favicon-solarcare.svg">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../legal-pages.css">
  <script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>
  <script src="../site-chrome.js" defer></script>
</head>
<body>
${body}
</body>
</html>
`;
}

function locationPage(district) {
  const name = displayName(district);
  const slug = citySlug(district);
  const isLucknow = slug === 'lucknow';
  const title = isLucknow
    ? 'Solar Panel Cleaning Lucknow | Installation, Maintenance & AMC | IM Solar Care'
    : `Solar Panel Cleaning in ${name} | Installation & Maintenance | IM Solar Care`;
  const description = isLucknow
    ? 'Professional solar panel cleaning, installation, maintenance, AMC, inspection and commercial solar services in Lucknow. IM Solar Care is the Lucknow hub serving Uttar Pradesh.'
    : `Professional solar panel cleaning, installation, maintenance, AMC and inspection services in ${name}, Uttar Pradesh for residential, commercial and industrial solar sites.`;
  const canonical = `https://imsolarcare.in/locations/solar-panel-cleaning-${slug}.html`;
  const intro = isLucknow
    ? 'Lucknow is the primary service hub for IM Solar Care. This page targets solar panel cleaning Lucknow, solar panel installation Lucknow, solar maintenance Lucknow, solar AMC Lucknow and commercial solar panel cleaning Lucknow while connecting customers to Uttar Pradesh-wide service coverage.'
    : `IM Solar Care provides solar panel cleaning, installation support, maintenance, AMC enquiry, inspection and commercial solar service support in ${name}. Customers can request help for homes, offices, schools, hospitals, factories, warehouses and rooftop solar plants.`;
  const nearby = allLocationTargets
    .filter((item) => item !== district)
    .slice(0, 8)
    .map((item) => `<a href="solar-panel-cleaning-${citySlug(item)}.html">${displayName(item)}</a>`)
    .join(' ');
  const body = `  <main class="content-shell">
    <section class="page-hero page-hero-about">
      <div class="hero-copy-block">
        <p class="page-kicker">${name} Solar Services</p>
        <h1>Solar Panel Cleaning Services in ${name}</h1>
        <p class="page-lead">${intro}</p>
        <p class="page-lead">Book professional solar cleaning, installation guidance, maintenance support, solar health check, bird dropping removal and performance inspection for residential and commercial rooftops.</p>
        <div class="page-cta-row">
          <a class="primary-link" href="tel:+918112780010">Call Now</a>
          <a class="secondary-link" href="https://wa.me/918112780010?text=Hi%2C%20mujhe%20${encodeURIComponent(name)}%20me%20solar%20service%20chahiye." target="_blank" rel="noopener noreferrer">WhatsApp Now</a>
        </div>
      </div>
      <div class="hero-side-card">
        <h2>Lucknow-based, Uttar Pradesh-wide</h2>
        <p>IM Solar Care keeps Lucknow as the primary hub while serving customers across Uttar Pradesh for cleaning, installation, AMC and maintenance needs.</p>
      </div>
    </section>

    <section class="info-grid">
      <article class="info-card"><p class="card-label">Cleaning</p><h2>Why solar panel cleaning is important in ${name}</h2><p>Dust, pollution, leaves, hard water marks and bird droppings can block sunlight on panel glass. Regular cleaning keeps panels clearer, supports better sunlight exposure and makes visible inspection easier.</p></article>
      <article class="info-card accent-card"><p class="card-label">Installation Offer</p><h2>Exclusive installation offer</h2><p>Install your solar system with IM Solar Care and receive <strong>3 FREE professional solar panel cleaning visits within 1 year</strong>. Offer applies after installation confirmation and service scheduling.</p></article>
    </section>

    <section class="three-up-grid">
      <article class="info-card"><p class="card-label">Residential</p><h2>Residential Solar Services in ${name}</h2><p>Home rooftops can book solar panel cleaning, installation support, inspection, health check and maintenance guidance with before-and-after proof.</p></article>
      <article class="info-card"><p class="card-label">Commercial</p><h2>Commercial Solar Services in ${name}</h2><p>Schools, hospitals, offices, shops, warehouses and factories can request large rooftop cleaning, performance checks and commercial solar maintenance discussion.</p></article>
      <article class="info-card"><p class="card-label">AMC</p><h2>Solar AMC Support in ${name}</h2><p>Selected rooftops can enquire for AMC-style recurring cleaning, basic visible inspection and repeat maintenance planning based on availability.</p></article>
    </section>

    <section class="split-panel">
      <div class="panel-block"><p class="card-label">Services</p><h2>Solar services available in ${name}</h2><p>Solar Panel Cleaning, Solar Panel Installation Support, Solar Panel Maintenance, Solar AMC, Commercial Solar Cleaning, Residential Rooftop Cleaning, Solar Inspection, Bird Mesh Installation, Performance Testing, Solar Health Check and Solar Consultancy.</p></div>
      <div class="panel-block checklist-panel"><p class="card-label">Included</p><ul class="check-list"><li><i class="ri-check-line"></i><span>Dust and bird dropping removal</span></li><li><i class="ri-check-line"></i><span>Before and after photos</span></li><li><i class="ri-check-line"></i><span>Basic visual inspection</span></li><li><i class="ri-check-line"></i><span>Residential and commercial support</span></li></ul></div>
    </section>

    <section class="info-grid faq-grid">
      <article class="info-card"><p class="card-label">FAQ</p><h2>How much does solar panel cleaning cost in ${name}?</h2><p>Pricing depends on system capacity, panel count, rooftop height, access, heavy dust and bird dropping condition. Contact IM Solar Care for an estimate.</p></article>
      <article class="info-card"><p class="card-label">FAQ</p><h2>Do you provide solar installation in ${name}?</h2><p>Yes, installation support and installation quote requests are available. Customers can also ask about the 3 free cleaning visits offer with installation.</p></article>
      <article class="info-card"><p class="card-label">FAQ</p><h2>Do you handle commercial solar sites?</h2><p>Yes, commercial solar cleaning and maintenance enquiries are available for offices, schools, hospitals, factories, warehouses and solar plants.</p></article>
    </section>

    <section class="info-grid">
      <article class="info-card strong-card"><p class="card-label">Nearby Districts</p><h2>Explore nearby Uttar Pradesh service pages</h2><p>${nearby}</p></article>
      <article class="info-card"><p class="card-label">Internal Links</p><h2>Useful solar service pages</h2><p><a href="../index.html">Homepage</a> <a href="solar-panel-cleaning-lucknow.html">Lucknow hub</a> <a href="solar-panel-cleaning-uttar-pradesh.html">All Uttar Pradesh</a> <a href="../solar-panel-installation-service.html">Installation</a> <a href="../commercial-solar-solutions.html">Commercial Solar</a> <a href="../solar-amc-service.html">Solar AMC</a></p></article>
    </section>

    <section class="cta-banner">
      <div><p class="card-label">Book Now</p><h2>Book Professional Solar Panel Cleaning in ${name}</h2></div>
      <div class="page-cta-row"><a class="primary-link" href="tel:+918112780010">Call Now</a><a class="secondary-link" href="https://wa.me/918112780010?text=Hi%2C%20mujhe%20${encodeURIComponent(name)}%20me%20solar%20service%20book%20karni%20hai." target="_blank" rel="noopener noreferrer">WhatsApp Now</a></div>
    </section>
  </main>`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      '@id': 'https://imsolarcare.in/#business',
      name: 'IM Solar Care',
      url: 'https://imsolarcare.in/',
      telephone: '+91 8112780010',
      email: 'imsolarcare@gmail.com',
      priceRange: '₹799 onwards',
      address: { '@type': 'PostalAddress', addressLocality: 'Lucknow', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
      areaServed: [`${name}, Uttar Pradesh`],
      serviceType: ['Solar Panel Cleaning', 'Solar Panel Installation Support', 'Solar Panel Maintenance', 'Solar AMC', 'Commercial Solar Services'],
      description
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: `How much does solar panel cleaning cost in ${name}?`, acceptedAnswer: { '@type': 'Answer', text: 'Pricing depends on system capacity, panel count, roof access and panel condition.' } },
        { '@type': 'Question', name: `Do you provide solar installation in ${name}?`, acceptedAnswer: { '@type': 'Answer', text: 'Yes, installation quote support is available, including an offer of 3 free cleaning visits within 1 year after installation.' } },
        { '@type': 'Question', name: `Do you provide commercial solar services in ${name}?`, acceptedAnswer: { '@type': 'Answer', text: 'Yes, commercial solar cleaning and maintenance enquiries are available for larger rooftops and institutions.' } }
      ]
    }
  ];
  return pageShell({ title, description, canonical, body, schema });
}

function upPage() {
  const links = allLocationTargets.map((district) => `<a href="solar-panel-cleaning-${citySlug(district)}.html">${displayName(district)}</a>`).join(' ');
  return pageShell({
    title: 'Solar Panel Cleaning in Uttar Pradesh | IM Solar Care',
    description: 'IM Solar Care provides solar panel cleaning, installation support, maintenance, AMC, inspection and commercial solar services across all districts of Uttar Pradesh.',
    canonical: 'https://imsolarcare.in/locations/solar-panel-cleaning-uttar-pradesh.html',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      name: 'IM Solar Care',
      url: 'https://imsolarcare.in/',
      telephone: '+91 8112780010',
      areaServed: ['Lucknow', 'Uttar Pradesh', ...allLocationTargets.map(displayName)],
      serviceType: ['Solar Panel Cleaning', 'Solar Installation Support', 'Solar Maintenance', 'Solar AMC']
    },
    body: `  <main class="content-shell">
    <section class="page-hero page-hero-about">
      <div class="hero-copy-block"><p class="page-kicker">Uttar Pradesh Service Hub</p><h1>Solar Panel Cleaning Services Across Uttar Pradesh</h1><p class="page-lead">IM Solar Care is a Lucknow-based professional solar services company serving customers across all 75 districts of Uttar Pradesh for cleaning, installation support, maintenance, AMC and commercial solar enquiries.</p><div class="page-cta-row"><a class="primary-link" href="tel:+918112780010">Call Now</a><a class="secondary-link" href="https://wa.me/918112780010?text=Hi%2C%20mujhe%20Uttar%20Pradesh%20me%20solar%20service%20chahiye." target="_blank" rel="noopener noreferrer">WhatsApp Now</a></div></div>
      <div class="hero-side-card"><h2>Lucknow-first, UP-wide</h2><p>Lucknow remains the main SEO and service hub while the website now gives every UP district a dedicated landing page.</p></div>
    </section>
    <section class="info-card strong-card"><p class="card-label">All Districts</p><h2>Choose your Uttar Pradesh district</h2><p>${links}</p></section>
    <section class="cta-banner"><div><p class="card-label">Book Across UP</p><h2>Book solar cleaning, installation or maintenance support.</h2></div><div class="page-cta-row"><a class="primary-link" href="tel:+918112780010">Call Now</a><a class="secondary-link" href="solar-panel-cleaning-lucknow.html">Open Lucknow Hub</a></div></section>
  </main>`
  });
}

function servicePage(service) {
  const body = `  <main class="content-shell">
    <section class="page-hero page-hero-about">
      <div class="hero-copy-block"><p class="page-kicker">${service.kicker}</p><h1>${service.h1}</h1><p class="page-lead">${service.description}</p><p class="page-lead">IM Solar Care keeps Lucknow as the primary service hub and serves customers across Uttar Pradesh for cleaning, installation, AMC and maintenance needs.</p><div class="page-cta-row"><a class="primary-link" href="tel:+918112780010">Call Now</a><a class="secondary-link" href="https://wa.me/918112780010?text=Hi%2C%20mujhe%20${encodeURIComponent(service.h1)}%20ke%20liye%20quote%20chahiye." target="_blank" rel="noopener noreferrer">WhatsApp Quote</a></div></div>
      <div class="hero-side-card"><h2>FREE 3 Cleaning Visits</h2><p>Install your solar system with IM Solar Care and receive 3 free professional cleaning visits within 1 year.</p></div>
    </section>
    <section class="three-up-grid">${service.sections.map((section) => `<article class="info-card"><p class="card-label">Service</p><h2>${section}</h2><p>${section} is planned with safe rooftop handling, clear communication, residential and commercial support, and direct call or WhatsApp booking.</p></article>`).join('')}</section>
    <section class="split-panel"><div class="panel-block"><p class="card-label">Why Choose</p><h2>Why choose IM Solar Care?</h2><p>Professional equipment, safe cleaning process, fast response, transparent pricing, real before/after proof, and Lucknow-first local support across Uttar Pradesh.</p></div><div class="panel-block checklist-panel"><p class="card-label">Related Links</p><ul class="check-list"><li><i class="ri-check-line"></i><span><a href="solar-panel-cleaning-service.html">Solar Panel Cleaning</a></span></li><li><i class="ri-check-line"></i><span><a href="solar-panel-maintenance-service.html">Solar Maintenance</a></span></li><li><i class="ri-check-line"></i><span><a href="locations/solar-panel-cleaning-lucknow.html">Lucknow Hub</a></span></li><li><i class="ri-check-line"></i><span><a href="locations/solar-panel-cleaning-uttar-pradesh.html">All Uttar Pradesh</a></span></li></ul></div></section>
    <section class="info-grid faq-grid"><article class="info-card"><p class="card-label">FAQ</p><h2>Is ${service.kicker.toLowerCase()} available in Lucknow?</h2><p>Yes. Lucknow is the primary service hub for IM Solar Care.</p></article><article class="info-card"><p class="card-label">FAQ</p><h2>Do you serve commercial customers?</h2><p>Yes. Commercial solar enquiries are accepted for offices, schools, hospitals, factories and warehouses.</p></article><article class="info-card"><p class="card-label">FAQ</p><h2>Can I book on WhatsApp?</h2><p>Yes. Send your city, solar capacity and service need on WhatsApp for faster support.</p></article></section>
  </main>`;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.h1,
      serviceType: service.intent,
      provider: { '@type': 'LocalBusiness', name: 'IM Solar Care', telephone: '+91 8112780010' },
      areaServed: ['Lucknow', 'Uttar Pradesh'],
      url: `https://imsolarcare.in/${service.slug}.html`,
      description: service.description
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: `Is ${service.kicker.toLowerCase()} available in Lucknow?`, acceptedAnswer: { '@type': 'Answer', text: 'Yes. Lucknow is the primary hub for IM Solar Care.' } },
        { '@type': 'Question', name: 'Can commercial customers enquire?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Commercial solar service enquiries are available for offices, schools, hospitals, warehouses and factories.' } }
      ]
    }
  ];
  return pageShell({
    title: service.title,
    description: service.description,
    canonical: `https://imsolarcare.in/${service.slug}.html`,
    body,
    schema
  }).replaceAll('../legal-pages.css', 'legal-pages.css').replaceAll('../site-chrome.js', 'site-chrome.js').replaceAll('../assets/favicon-solarcare.svg', 'assets/favicon-solarcare.svg');
}

function collectHtmlUrls() {
  const urls = ['https://imsolarcare.in/'];
  fs.readdirSync(root)
    .filter((file) => file.endsWith('.html') && file !== 'admin.html' && file !== 'index.html')
    .sort()
    .forEach((file) => urls.push(`https://imsolarcare.in/${file}`));
  fs.readdirSync(locationsDir)
    .filter((file) => file.endsWith('.html'))
    .sort()
    .forEach((file) => urls.push(`https://imsolarcare.in/locations/${file}`));
  return urls;
}

fs.mkdirSync(locationsDir, { recursive: true });
allLocationTargets.forEach((district) => {
  fs.writeFileSync(path.join(locationsDir, `solar-panel-cleaning-${citySlug(district)}.html`), locationPage(district), 'utf8');
});
fs.writeFileSync(path.join(locationsDir, 'solar-panel-cleaning-uttar-pradesh.html'), upPage(), 'utf8');
servicePages.forEach((service) => {
  fs.writeFileSync(path.join(root, rootPageHref(service.slug)), servicePage(service), 'utf8');
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${collectHtmlUrls().map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Generated ${allDistricts.length} district pages, ${extraLocationTargets.length} extra location page, ${servicePages.length} service pages, and sitemap.xml`);
