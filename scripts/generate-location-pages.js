const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'locations');

const cities = [
  {
    name: 'Lucknow',
    slug: 'lucknow',
    introNote: 'As the main service hub for IM Solar Care, Lucknow receives the strongest local coverage with city-wide booking support and deeper locality targeting.',
    areas: ['Aliganj', 'Gomti Nagar', 'Indira Nagar', 'Jankipuram', 'Hazratganj', 'Ashiyana', 'Rajajipuram', 'Vikas Nagar', 'Chinhat', 'Mahanagar', 'Alambagh', 'Aminabad', 'Kamta', 'Dubagga', 'Telibagh'],
    costNote: 'Most Lucknow residential bookings start from the published capacity-based pricing, while commercial rooftops are quoted after checking access, panel count and dust condition.',
    commercialNote: 'Lucknow has many schools, offices, apartment blocks, shops and mixed-use rooftops where planned cleaning is useful because panel rows are often exposed to traffic dust and bird activity.',
    residentialNote: 'Home rooftops in Lucknow often need periodic dust cleaning, bird dropping removal and basic visual checks, especially around busy roads and construction zones.',
    keywords: ['Solar Panel Cleaning Lucknow', 'Solar Panel Cleaning Service Lucknow', 'Solar Panel Cleaning Near Me Lucknow', 'Solar Panel Maintenance Lucknow', 'Solar Panel Cleaning Cost Lucknow', 'Commercial Solar Panel Cleaning Lucknow', 'Residential Solar Panel Cleaning Lucknow']
  },
  {
    name: 'Kanpur',
    slug: 'kanpur',
    introNote: 'Kanpur rooftops often deal with industrial dust, road pollution and heavy surface buildup, so cleaning plans should be practical and access-aware.',
    areas: ['Swaroop Nagar', 'Kakadeo', 'Kidwai Nagar', 'Govind Nagar', 'Kalyanpur', 'Civil Lines', 'Panki', 'Ratan Lal Nagar'],
    costNote: 'Pricing in Kanpur depends on rooftop access, system size and whether the site is residential, commercial or industrial.',
    commercialNote: 'Commercial and industrial solar systems in Kanpur may need broader cleaning coverage due to dust exposure around workshops, warehouses and factories.',
    residentialNote: 'Residential solar owners in Kanpur can book one-time cleaning or ask for repeat support based on dust level and panel visibility.'
  },
  {
    name: 'Noida',
    slug: 'noida',
    introNote: 'Noida has apartments, offices, schools and commercial rooftops where regular cleaning helps keep solar panels visible and easier to monitor.',
    areas: ['Sector 62', 'Sector 63', 'Sector 18', 'Sector 75', 'Sector 137', 'Noida Extension', 'Greater Noida West', 'Pari Chowk'],
    costNote: 'Noida pricing varies by tower access, roof permission, panel count and whether the work is for a society, office or home rooftop.',
    commercialNote: 'Office buildings, schools and society rooftops in Noida often need scheduled cleaning and clear access coordination.',
    residentialNote: 'Residential rooftop and society solar cleaning in Noida is planned around access timing, water availability and panel condition.'
  },
  {
    name: 'Ghaziabad',
    slug: 'ghaziabad',
    introNote: 'Ghaziabad rooftop systems can collect road dust and construction residue quickly, especially in dense residential and commercial belts.',
    areas: ['Indirapuram', 'Vaishali', 'Vasundhara', 'Raj Nagar Extension', 'Kavi Nagar', 'Crossings Republik', 'Sahibabad', 'Loni Road'],
    costNote: 'Ghaziabad cleaning cost depends on access, height, panel count and whether bird waste or heavy dirt needs extra effort.',
    commercialNote: 'Commercial solar cleaning in Ghaziabad is useful for offices, warehouses, schools and multi-panel rooftop systems.',
    residentialNote: 'Home and society rooftops in Ghaziabad can request cleaning, inspection and repeat maintenance discussion.'
  },
  {
    name: 'Agra',
    slug: 'agra',
    introNote: 'Agra solar panels can face dry dust, pollution and seasonal dirt buildup, so periodic cleaning is useful for rooftop visibility.',
    areas: ['Sikandra', 'Kamla Nagar', 'Dayal Bagh', 'Tajganj', 'Fatehabad Road', 'Shahganj', 'Bodla', 'Sanjay Place'],
    costNote: 'Agra pricing is based on system size, roof access, stains, dust load and whether the site needs one-time cleaning or repeat care.',
    commercialNote: 'Hotels, schools, shops and commercial rooftops in Agra can book cleaning support for larger panel areas.',
    residentialNote: 'Residential customers in Agra can book rooftop cleaning for dust removal, bird droppings and basic panel condition checks.'
  },
  {
    name: 'Prayagraj',
    slug: 'prayagraj',
    introNote: 'Prayagraj rooftops often need solar cleaning after dry weather, nearby construction work and seasonal dust movement.',
    areas: ['Civil Lines', 'Naini', 'Jhunsi', 'George Town', 'Kareli', 'Katra', 'Dhoomanganj', 'Phaphamau'],
    costNote: 'Solar panel cleaning cost in Prayagraj depends on capacity, access, roof height and panel condition.',
    commercialNote: 'Schools, hospitals, offices and larger rooftops in Prayagraj can request commercial cleaning and inspection support.',
    residentialNote: 'Home solar systems in Prayagraj can be cleaned safely with a visit plan based on rooftop access and dust level.'
  },
  {
    name: 'Varanasi',
    slug: 'varanasi',
    introNote: 'Varanasi rooftops can be compact and access-sensitive, so cleaning should be planned carefully around safe entry and panel layout.',
    areas: ['Sigra', 'Lanka', 'Bhelupur', 'Sarnath', 'Mahmoorganj', 'Ramnagar', 'Pandeypur', 'Cantt'],
    costNote: 'Varanasi pricing depends on panel count, roof approach, water availability and the level of dust or bird waste.',
    commercialNote: 'Hotels, institutions, shops and commercial buildings in Varanasi can use solar cleaning support for bigger rooftop systems.',
    residentialNote: 'Residential solar cleaning in Varanasi focuses on dust removal, safe handling and simple booking support.'
  },
  {
    name: 'Meerut',
    slug: 'meerut',
    introNote: 'Meerut solar systems can collect road dust and dry-season dirt, especially around busy market and residential areas.',
    areas: ['Shastri Nagar', 'Saket', 'Pallavpuram', 'Modipuram', 'Kanker Khera', 'Ganga Nagar', 'Begum Bridge', 'Delhi Road'],
    costNote: 'Meerut service cost is estimated from rooftop size, system capacity and cleaning effort required.',
    commercialNote: 'Commercial rooftops, schools, shops and warehouses in Meerut can enquire for larger solar cleaning visits.',
    residentialNote: 'Homeowners in Meerut can book panel cleaning and basic inspection support for rooftop systems.'
  },
  {
    name: 'Gorakhpur',
    slug: 'gorakhpur',
    introNote: 'Gorakhpur rooftops may need cleaning around seasonal dust, rain marks and bird activity on exposed panel surfaces.',
    areas: ['Golghar', 'Taramandal', 'Mohaddipur', 'Betiahata', 'Rapti Nagar', 'Kunraghat', 'Rustampur', 'Medical Road'],
    costNote: 'Gorakhpur pricing depends on access, panel count, rooftop height and cleaning frequency.',
    commercialNote: 'Schools, hospitals, commercial rooftops and institutions in Gorakhpur can request solar cleaning and maintenance support.',
    residentialNote: 'Residential solar cleaning in Gorakhpur is suitable for homes that need dust, stains and bird dropping removal.'
  },
  {
    name: 'Bareilly',
    slug: 'bareilly',
    introNote: 'Bareilly rooftop solar systems can benefit from cleaning when dust, pollen and bird waste reduce panel clarity.',
    areas: ['Civil Lines', 'Rajendra Nagar', 'Model Town', 'Izatnagar', 'DD Puram', 'Subhash Nagar', 'Prem Nagar', 'Pilibhit Bypass'],
    costNote: 'Bareilly cleaning estimates are based on capacity, access and whether the visit is residential or commercial.',
    commercialNote: 'Commercial buildings, schools and larger rooftops in Bareilly can book planned solar cleaning support.',
    residentialNote: 'Homes in Bareilly can request safe rooftop cleaning, basic inspection and future maintenance discussion.'
  },
  {
    name: 'Aligarh',
    slug: 'aligarh',
    introNote: 'Aligarh rooftops often need dust removal and basic panel care where road exposure and bird activity are common.',
    areas: ['Ramghat Road', 'Swarn Jayanti Nagar', 'Marris Road', 'Sasni Gate', 'Quarsi', 'Dodhpur', 'Civil Lines', 'Tala Nagri'],
    costNote: 'Aligarh pricing depends on rooftop approach, dust level, panel count and cleaning time.',
    commercialNote: 'Commercial and institutional rooftops in Aligarh can enquire for larger cleaning visits and inspection support.',
    residentialNote: 'Residential systems in Aligarh can be cleaned safely with attention to roof access and panel surface condition.'
  },
  {
    name: 'Moradabad',
    slug: 'moradabad',
    introNote: 'Moradabad solar panels can collect dust and pollution residue, especially around busy industrial and market areas.',
    areas: ['Civil Lines', 'Ram Ganga Vihar', 'Delhi Road', 'Majhola', 'Line Par', 'Kanth Road', 'Budhi Vihar', 'Katghar'],
    costNote: 'Moradabad service cost depends on system size, rooftop height and cleaning difficulty.',
    commercialNote: 'Factories, warehouses, offices and shops in Moradabad can request commercial rooftop solar cleaning.',
    residentialNote: 'Home solar systems in Moradabad can use routine cleaning for dust, stains and bird waste removal.'
  },
  {
    name: 'Ayodhya',
    slug: 'ayodhya',
    introNote: 'Ayodhya rooftop solar systems can need cleaning support around dust, seasonal weather and growing commercial activity.',
    areas: ['Faizabad', 'Naka', 'Civil Lines', 'Sahadatganj', 'Devkali', 'Rekabganj', 'Ayodhya Dham', 'Rudauli Road'],
    costNote: 'Ayodhya pricing is estimated from capacity, access, roof height and panel condition.',
    commercialNote: 'Hotels, shops, schools and public-facing buildings in Ayodhya can enquire for commercial solar cleaning support.',
    residentialNote: 'Residential customers in Ayodhya can book cleaning for rooftop panels with visible dust or bird waste.'
  },
  {
    name: 'Jhansi',
    slug: 'jhansi',
    introNote: 'Jhansi rooftops can face dry heat and dust buildup, making periodic solar panel cleaning useful for better panel visibility.',
    areas: ['Sipri Bazar', 'Civil Lines', 'Nagra', 'Prem Nagar', 'Elite Crossing', 'Gwalior Road', 'Kanpur Road', 'Medical College Road'],
    costNote: 'Jhansi cleaning cost depends on capacity, dust load, roof access and commercial or residential use.',
    commercialNote: 'Commercial rooftops and institutions in Jhansi can plan larger cleaning visits for broader panel coverage.',
    residentialNote: 'Home solar cleaning in Jhansi focuses on safe panel handling, dust removal and basic visual inspection.'
  },
  {
    name: 'Mathura',
    slug: 'mathura',
    introNote: 'Mathura solar rooftops may need regular cleaning where dust, temple-area activity, traffic and bird droppings affect panels.',
    areas: ['Krishna Nagar', 'Dampier Nagar', 'Vrindavan', 'Govardhan Road', 'Masani', 'Chandanvan', 'Refinery Township', 'BSA Road'],
    costNote: 'Mathura pricing depends on panel count, access, stains and cleaning frequency.',
    commercialNote: 'Hotels, schools, shops and commercial rooftops around Mathura and Vrindavan can request solar cleaning support.',
    residentialNote: 'Residential rooftops in Mathura can book cleaning and bird waste removal for better panel clarity.'
  },
  {
    name: 'Saharanpur',
    slug: 'saharanpur',
    introNote: 'Saharanpur rooftops can collect dust, pollen and bird activity marks, so periodic panel cleaning helps keep systems easier to monitor.',
    areas: ['Court Road', 'Delhi Road', 'Mission Compound', 'Sharda Nagar', 'Awas Vikas', 'Paper Mill Road', 'Numaish Camp', 'Chilkana Road'],
    costNote: 'Saharanpur cost depends on roof access, panel count, dirt level and whether commercial support is needed.',
    commercialNote: 'Commercial rooftops, schools and warehouses in Saharanpur can enquire for solar cleaning and inspection support.',
    residentialNote: 'Homeowners in Saharanpur can book cleaning for dust, stains and regular rooftop care.'
  },
  {
    name: 'Unnao',
    slug: 'unnao',
    introNote: 'Unnao rooftops near Lucknow and Kanpur often face road dust, open-area dirt and bird activity, making planned solar panel cleaning useful for homes and businesses.',
    areas: ['Civil Lines', 'Shuklaganj', 'Awas Vikas Colony', 'Ganga Ghat', 'PD Nagar', 'Bighapur Road', 'Safipur Road', 'Industrial Area'],
    costNote: 'Unnao solar panel cleaning cost depends on panel capacity, roof height, access, bird droppings and whether the booking is for a home, shop, school or commercial rooftop.',
    commercialNote: 'Commercial solar cleaning in Unnao is useful for schools, offices, shops, warehouses and industrial rooftops that need safe cleaning and basic inspection support.',
    residentialNote: 'Residential solar systems in Unnao can be cleaned for dust, stains, leaves and bird droppings with before-and-after proof shared after the visit.'
  },
  {
    name: 'Basti',
    slug: 'basti',
    introNote: 'Basti solar rooftops can collect seasonal dust, rain marks, leaves and bird waste, especially on exposed residential and institutional buildings.',
    areas: ['Gandhi Nagar', 'Malviya Road', 'Company Bagh', 'Purani Basti', 'Katra', 'Badeban', 'Roadways Area', 'Harraiya Road'],
    costNote: 'Basti pricing is estimated after checking system size, rooftop access, panel condition, water availability and cleaning effort required.',
    commercialNote: 'Commercial solar panel cleaning in Basti supports schools, hospitals, offices, shops and larger rooftops that need organized service visits.',
    residentialNote: 'Homeowners in Basti can request rooftop solar panel cleaning, bird dropping removal and basic visible inspection for small and medium systems.'
  }
];

const allCityLinks = cities.map((city) => `<a href="solar-panel-cleaning-${city.slug}.html">${city.name}</a>`).join(' ');

function escapeJson(value) {
  return JSON.stringify(value);
}

function serviceList(city) {
  return [
    ['Solar Panel Cleaning', `Panel-safe cleaning for dust, bird droppings and pollution buildup on ${city.name} rooftops.`],
    ['Solar Panel Maintenance', `Maintenance discussion for sites in ${city.name} that need repeat care or periodic cleaning.`],
    ['Solar Panel Inspection', `Basic visual inspection support for visible panel condition, access and service planning.`],
    ['Commercial Solar Cleaning', `Cleaning support for offices, schools, hospitals, warehouses, factories and larger commercial solar systems.`],
    ['Residential Rooftop Cleaning', `Home rooftop cleaning for small and medium solar systems with safe access planning.`],
    ['Bird Dropping Removal', `Careful removal of bird waste and sticky buildup where practical during the cleaning visit.`],
    ['Solar AMC Support', `Selected rooftops can enquire for AMC-style recurring support based on availability and site condition.`],
    ['Solar Installation Support', `Installation-side support and local guidance for customers planning new rooftop solar systems.`]
  ].map(([title, text]) => `<article class="info-card"><p class="card-label">Service</p><h2>${title}</h2><p>${text}</p></article>`).join('\n        ');
}

function nearbyLinks(city) {
  return cities
    .filter((item) => item.slug !== city.slug)
    .slice(0, 6)
    .map((item) => `<a href="solar-panel-cleaning-${item.slug}.html">${item.name}</a>`)
    .join(' ');
}

function pageHtml(city) {
  const title = `Solar Panel Cleaning in ${city.name} | IM Solar Care`;
  const description = `Professional solar panel cleaning, maintenance, AMC and inspection services in ${city.name}. IM Solar Care provides residential, commercial and industrial solar panel cleaning across Uttar Pradesh.`;
  const canonical = `https://imsolarcare.in/locations/solar-panel-cleaning-${city.slug}.html`;
  const isLucknow = city.slug === 'lucknow';
  const keywordBlock = isLucknow
    ? `<section class="info-card strong-card">
        <p class="card-label">Lucknow SEO Focus</p>
        <h2>Lucknow solar cleaning keywords covered on this page</h2>
        <p>${city.keywords.join(' | ')}</p>
      </section>`
    : '';

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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../legal-pages.css">
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': 'https://imsolarcare.in/#business',
    name: 'IM Solar Care',
    alternateName: 'IMSOLARCARE',
    url: 'https://imsolarcare.in/',
    telephone: '+91 8112780010',
    email: 'imsolarcare@gmail.com',
    priceRange: '₹799 onwards',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lucknow',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN'
    },
    areaServed: [`${city.name}, Uttar Pradesh`],
    serviceType: ['Solar Panel Cleaning', 'Solar Panel Maintenance', 'Solar AMC Support', 'Solar Installation Support'],
    description: `IM Solar Care provides solar panel cleaning, maintenance, inspection, AMC and installation support in ${city.name}, Uttar Pradesh.`
  }, null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Solar Panel Cleaning Services in ${city.name}`,
    serviceType: 'Solar Panel Cleaning',
    provider: {
      '@type': 'LocalBusiness',
      name: 'IM Solar Care',
      telephone: '+91 8112780010'
    },
    areaServed: {
      '@type': 'City',
      name: city.name
    },
    url: canonical,
    description
  }, null, 2)}
  </script>
  <script src="../site-chrome.js" defer></script>
</head>
<body>
  <main class="content-shell">
    <section class="page-hero page-hero-about">
      <div class="hero-copy-block">
        <p class="page-kicker">${city.name} Solar Cleaning</p>
        <h1>Solar Panel Cleaning Services in ${city.name}</h1>
        <p class="page-lead">IM Solar Care provides professional solar panel cleaning and maintenance services in ${city.name} for homes, offices, schools, hospitals, factories, warehouses and commercial solar systems. Our trained team uses safe cleaning methods to remove dust, bird droppings, stains and pollution buildup from solar panels.</p>
        <p class="page-lead">${city.introNote}</p>
        <div class="page-cta-row">
          <a class="primary-link" href="tel:+918112780010">Call Now</a>
          <a class="secondary-link" href="https://wa.me/918112780010?text=Hi%2C%20mujhe%20${encodeURIComponent(city.name)}%20me%20solar%20panel%20cleaning%20book%20karni%20hai." target="_blank" rel="noopener noreferrer">WhatsApp Now</a>
        </div>
      </div>
      <div class="hero-side-card">
        <h2>Book Professional Solar Panel Cleaning in ${city.name}</h2>
        <p>IM Solar Care is a Lucknow-based professional solar panel cleaning company serving customers across Uttar Pradesh, with ${city.name} coverage for residential, commercial and industrial solar sites.</p>
      </div>
    </section>

    <section class="info-grid">
      <article class="info-card">
        <p class="card-label">Importance</p>
        <h2>Why Solar Panel Cleaning is Important in ${city.name}</h2>
        <p>Solar panels in ${city.name} can collect dust, bird droppings, pollution residue, leaves and hard water marks. Regular cleaning keeps the glass surface clearer, makes visible inspection easier, and supports better sunlight exposure for the system.</p>
      </article>
      <article class="info-card accent-card">
        <p class="card-label">Local Need</p>
        <h2>Cleaning planned around real rooftop conditions</h2>
        <p>Every site is different. IM Solar Care checks panel count, access, roof height, water availability, dust level and bird activity before recommending a cleaning or maintenance approach for ${city.name} customers.</p>
      </article>
    </section>

    ${keywordBlock}

    <section class="three-up-grid">
        ${serviceList(city)}
    </section>

    <section class="visual-strip">
      <article class="info-card">
        <div class="page-media-frame">
          <img src="../assets/commercial-rooftop-cleaning-evening.jpg" alt="commercial solar panel cleaning in ${city.name}" loading="lazy">
        </div>
        <p class="card-label">Commercial Cleaning</p>
        <h2>Commercial solar panel cleaning in ${city.name}</h2>
        <p>Real rooftop visuals help customers understand the type of panel-safe finish expected after professional cleaning.</p>
      </article>
      <article class="info-card">
        <div class="page-media-frame">
          <img src="../assets/solar-cleaning-before-2.jpg" alt="rooftop solar panel cleaning in ${city.name}" loading="lazy">
        </div>
        <p class="card-label">Rooftop Condition</p>
        <h2>Rooftop solar panel cleaning in ${city.name}</h2>
        <p>Dust, stains and bird droppings are easier to judge when customers can compare real before-cleaning panel condition.</p>
      </article>
    </section>

    <section class="info-grid">
      <article class="info-card">
        <p class="card-label">Residential</p>
        <h2>Residential Solar Cleaning in ${city.name}</h2>
        <p>${city.residentialNote} Homeowners can request basic inspection, before-and-after proof and guidance on future cleaning frequency.</p>
      </article>
      <article class="info-card">
        <p class="card-label">Commercial</p>
        <h2>Commercial Solar Cleaning in ${city.name}</h2>
        <p>${city.commercialNote} Commercial jobs are planned with site access, timing and panel coverage in mind.</p>
      </article>
    </section>

    <section class="split-panel">
      <div class="panel-block">
        <p class="card-label">Pricing</p>
        <h2>Solar Panel Cleaning Cost in ${city.name}</h2>
        <p>${city.costNote} Final pricing may vary depending on rooftop access, heavy dust, bird droppings and panel condition.</p>
      </div>
      <div class="panel-block checklist-panel">
        <p class="card-label">Included Support</p>
        <ul class="check-list">
          <li><i class="ri-check-line"></i><span>Professional solar panel cleaning</span></li>
          <li><i class="ri-check-line"></i><span>Dust and bird dropping removal where practical</span></li>
          <li><i class="ri-check-line"></i><span>Basic visible inspection support</span></li>
          <li><i class="ri-check-line"></i><span>Residential and commercial booking support</span></li>
        </ul>
      </div>
    </section>

    <section class="info-grid">
      <article class="info-card">
        <p class="card-label">Areas</p>
        <h2>Areas We Serve Near ${city.name}</h2>
        <p>${city.areas.join(', ')} and nearby localities. For exact availability, call or send your location on WhatsApp.</p>
      </article>
      <article class="info-card accent-card">
        <p class="card-label">Why Choose</p>
        <h2>Why Choose IM Solar Care?</h2>
        <p>IM Solar Care provides professional rooftop cleaning, safe solar panel handling, transparent capacity-based pricing, real before-and-after proof, and direct call or WhatsApp support for customers across Uttar Pradesh.</p>
      </article>
    </section>

    <section class="info-grid faq-grid">
      <article class="info-card">
        <p class="card-label">FAQ</p>
        <h2>How often should panels be cleaned in ${city.name}?</h2>
        <p>Most systems need cleaning based on dust level, bird activity and nearby construction or traffic. Many customers prefer periodic cleaning instead of waiting for heavy buildup.</p>
      </article>
      <article class="info-card">
        <p class="card-label">FAQ</p>
        <h2>Do you clean commercial solar panels in ${city.name}?</h2>
        <p>Yes. IM Solar Care supports commercial rooftops, schools, hospitals, factories, warehouses and larger solar systems where site access and panel coverage are planned before service.</p>
      </article>
      <article class="info-card">
        <p class="card-label">FAQ</p>
        <h2>Can I get AMC support in ${city.name}?</h2>
        <p>Selected rooftops can enquire about AMC-style support. Availability depends on site condition, cleaning frequency and current service scheduling.</p>
      </article>
    </section>

    <section class="info-grid">
      <article class="info-card strong-card">
        <p class="card-label">Nearby Cities</p>
        <h2>Explore nearby Uttar Pradesh service pages</h2>
        <p>${nearbyLinks(city)}</p>
      </article>
      <article class="info-card">
        <p class="card-label">Internal Links</p>
        <h2>Useful service pages</h2>
        <p><a href="../index.html">Homepage</a> <a href="solar-panel-cleaning-lucknow.html">Lucknow page</a> <a href="solar-panel-cleaning-uttar-pradesh.html">Uttar Pradesh page</a> <a href="../solar-panel-cleaning-service.html">Commercial Solar Cleaning</a> <a href="../solar-panel-maintenance-service.html">Solar Panel Maintenance</a> <a href="../services.html">Solar Installation Support</a></p>
      </article>
    </section>

    <section class="info-card">
      <p class="card-label">All Uttar Pradesh Locations</p>
      <h2>Solar panel cleaning city pages</h2>
      <p>${allCityLinks}</p>
    </section>

    <section class="cta-banner">
      <div>
        <p class="card-label">Book Now</p>
        <h2>Book Professional Solar Panel Cleaning in ${city.name}</h2>
      </div>
      <div class="page-cta-row">
        <a class="primary-link" href="tel:+918112780010">Call Now</a>
        <a class="secondary-link" href="https://wa.me/918112780010?text=Hi%2C%20mujhe%20${encodeURIComponent(city.name)}%20me%20solar%20panel%20cleaning%20book%20karni%20hai." target="_blank" rel="noopener noreferrer">WhatsApp Now</a>
      </div>
    </section>
  </main>
</body>
</html>
`;
}

function upPageHtml() {
  const cityLinks = cities.map((city) => `<a href="solar-panel-cleaning-${city.slug}.html">${city.name}</a>`).join(' ');
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Solar Panel Cleaning in Uttar Pradesh | IM Solar Care</title>
  <meta name="description" content="IM Solar Care provides professional solar panel cleaning, maintenance, AMC, inspection and installation support across Uttar Pradesh including Lucknow, Kanpur, Noida, Ghaziabad, Agra, Prayagraj and Varanasi.">
  <link rel="canonical" href="https://imsolarcare.in/locations/solar-panel-cleaning-uttar-pradesh.html">
  <link rel="icon" type="image/svg+xml" href="../assets/favicon-solarcare.svg">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../legal-pages.css">
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': 'https://imsolarcare.in/#business',
    name: 'IM Solar Care',
    url: 'https://imsolarcare.in/',
    telephone: '+91 8112780010',
    email: 'imsolarcare@gmail.com',
    areaServed: ['Lucknow', 'Uttar Pradesh', ...cities.map((city) => city.name)],
    serviceType: ['Solar Panel Cleaning', 'Solar Panel Maintenance', 'Solar AMC Support', 'Solar Installation Support'],
    description: 'IM Solar Care is a Lucknow-based professional solar panel cleaning company serving customers across Uttar Pradesh.'
  }, null, 2)}
  </script>
  <script src="../site-chrome.js" defer></script>
</head>
<body>
  <main class="content-shell">
    <section class="page-hero page-hero-about">
      <div class="hero-copy-block">
        <p class="page-kicker">Uttar Pradesh Service Hub</p>
        <h1>Solar Panel Cleaning Services Across Uttar Pradesh</h1>
        <p class="page-lead">IM Solar Care is a Lucknow-based professional solar panel cleaning company serving customers across Uttar Pradesh with cleaning, maintenance, inspection, AMC and installation support.</p>
        <div class="page-cta-row">
          <a class="primary-link" href="tel:+918112780010">Call Now</a>
          <a class="secondary-link" href="https://wa.me/918112780010?text=Hi%2C%20mujhe%20Uttar%20Pradesh%20me%20solar%20panel%20cleaning%20service%20chahiye." target="_blank" rel="noopener noreferrer">WhatsApp Now</a>
        </div>
      </div>
      <div class="hero-side-card">
        <h2>Lucknow-first, Uttar Pradesh-wide</h2>
        <p>Lucknow remains the main hub, while this page helps customers from other UP cities find the right city landing page and booking path.</p>
      </div>
    </section>
    <section class="info-card strong-card">
      <p class="card-label">Cities Covered</p>
      <h2>Choose your city</h2>
      <p>${cityLinks}</p>
    </section>
    <section class="info-grid">
      <article class="info-card"><p class="card-label">Residential</p><h2>Residential rooftop solar cleaning</h2><p>Homeowners across Uttar Pradesh can enquire for dust removal, bird dropping cleaning, basic inspection and safe rooftop cleaning support.</p></article>
      <article class="info-card"><p class="card-label">Commercial</p><h2>Commercial and industrial solar cleaning</h2><p>Schools, hospitals, factories, warehouses, offices and solar plants can request professional cleaning support based on site access and panel coverage.</p></article>
    </section>
    <section class="cta-banner">
      <div><p class="card-label">Book Across UP</p><h2>Book solar panel cleaning anywhere in Uttar Pradesh.</h2></div>
      <div class="page-cta-row">
        <a class="primary-link" href="tel:+918112780010">Call Now</a>
        <a class="secondary-link" href="solar-panel-cleaning-lucknow.html">Open Lucknow Hub</a>
      </div>
    </section>
  </main>
</body>
</html>
`;
}

fs.mkdirSync(outDir, { recursive: true });
cities.forEach((city) => {
  fs.writeFileSync(path.join(outDir, `solar-panel-cleaning-${city.slug}.html`), pageHtml(city), 'utf8');
});
fs.writeFileSync(path.join(outDir, 'solar-panel-cleaning-uttar-pradesh.html'), upPageHtml(), 'utf8');
