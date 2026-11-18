const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'placeholders');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const placeholders = [
  {
    name: 'shopping.svg',
    title: 'Adilabad Handloom & Shopping',
    subtitle: 'Pure Cotton Sarees • Traditional Crafts • Local Bazaars',
    gradientStart: '#7C3AED',
    gradientEnd: '#DB2777',
    iconColor: '#F472B6',
    iconSvg: `
      <rect x="250" y="160" width="300" height="240" rx="28" fill="none" stroke="white" stroke-width="16" opacity="0.9"/>
      <path d="M330 160 C330 90, 470 90, 470 160" fill="none" stroke="white" stroke-width="16" stroke-linecap="round"/>
      <line x1="250" y1="230" x2="550" y2="230" stroke="white" stroke-width="10" stroke-dasharray="14 14" opacity="0.6"/>
      <circle cx="400" cy="300" r="40" fill="white" opacity="0.2"/>
      <path d="M385 300 L400 315 L420 285" fill="none" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    `
  },
  {
    name: 'property.svg',
    title: 'Adilabad Prime Real Estate',
    subtitle: 'Luxury Homes • Commercial Showrooms • Plots & Villas',
    gradientStart: '#0F172A',
    gradientEnd: '#0284C7',
    iconColor: '#38BDF8',
    iconSvg: `
      <path d="M260 250 L400 130 L540 250 L540 390 L260 390 Z" fill="none" stroke="white" stroke-width="16" stroke-linejoin="round" opacity="0.9"/>
      <path d="M340 390 L340 290 L460 290 L460 390" fill="none" stroke="white" stroke-width="14" stroke-linecap="round"/>
      <rect x="440" y="170" width="40" height="60" fill="white" opacity="0.7" rx="6"/>
      <line x1="370" y1="210" x2="430" y2="210" stroke="white" stroke-width="8" stroke-linecap="round" opacity="0.5"/>
    `
  },
  {
    name: 'food.svg',
    title: 'Adilabad Food & Cuisine',
    subtitle: 'Dum Biryani • Royal Mughlai • Telangana Thalis',
    gradientStart: '#B45309',
    gradientEnd: '#EA580C',
    iconColor: '#FDE047',
    iconSvg: `
      <ellipse cx="400" cy="310" rx="170" ry="60" fill="none" stroke="white" stroke-width="16"/>
      <path d="M250 300 C250 200, 550 200, 550 300" fill="none" stroke="white" stroke-width="16" stroke-linecap="round"/>
      <path d="M400 140 C400 140, 390 190, 400 200" fill="none" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <circle cx="400" cy="130" r="14" fill="white"/>
      <path d="M340 180 Q350 160 340 140" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
      <path d="M460 180 Q470 160 460 140" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
    `
  },
  {
    name: 'jobs.svg',
    title: 'Adilabad Careers & Hiring',
    subtitle: 'Accounting • Technical • Sales • Executive Openings',
    gradientStart: '#1E293B',
    gradientEnd: '#4F46E5',
    iconColor: '#818CF8',
    iconSvg: `
      <rect x="250" y="200" width="300" height="190" rx="20" fill="none" stroke="white" stroke-width="16"/>
      <path d="M340 200 L340 150 C340 135, 460 135, 460 150 L460 200" fill="none" stroke="white" stroke-width="14" stroke-linecap="round"/>
      <circle cx="400" cy="270" r="18" fill="white"/>
      <path d="M250 270 L380 270" stroke="white" stroke-width="12" stroke-linecap="round"/>
      <path d="M420 270 L550 270" stroke="white" stroke-width="12" stroke-linecap="round"/>
    `
  },
  {
    name: 'vehicles.svg',
    title: 'Adilabad Motors & Vehicles',
    subtitle: 'Pre-Owned SUVs • 4x4 Off-Road • Commercial Fleet',
    gradientStart: '#0F172A',
    gradientEnd: '#DC2626',
    iconColor: '#F87171',
    iconSvg: `
      <path d="M240 310 L280 220 L520 220 L560 310 L570 330 L230 330 Z" fill="none" stroke="white" stroke-width="16" stroke-linejoin="round"/>
      <circle cx="300" cy="340" r="40" fill="#0F172A" stroke="white" stroke-width="16"/>
      <circle cx="500" cy="340" r="40" fill="#0F172A" stroke="white" stroke-width="16"/>
      <circle cx="300" cy="340" r="14" fill="white"/>
      <circle cx="500" cy="340" r="14" fill="white"/>
      <line x1="390" y1="220" x2="390" y2="300" stroke="white" stroke-width="10"/>
    `
  },
  {
    name: 'electronics.svg',
    title: 'Adilabad Electronics & Tech',
    subtitle: 'Smart 4K TVs • Air Conditioners • Smartphones & Gadgets',
    gradientStart: '#111827',
    gradientEnd: '#0D9488',
    iconColor: '#2DD4BF',
    iconSvg: `
      <rect x="240" y="150" width="320" height="210" rx="20" fill="none" stroke="white" stroke-width="16"/>
      <line x1="350" y1="360" x2="330" y2="400" stroke="white" stroke-width="14" stroke-linecap="round"/>
      <line x1="450" y1="360" x2="470" y2="400" stroke="white" stroke-width="14" stroke-linecap="round"/>
      <line x1="300" y1="400" x2="500" y2="400" stroke="white" stroke-width="14" stroke-linecap="round"/>
      <circle cx="510" cy="190" r="8" fill="white" opacity="0.8"/>
    `
  },
  {
    name: 'agriculture.svg',
    title: 'Adilabad Agri & Farm Hub',
    subtitle: 'Cotton Seeds • Fertilizers • Tractors & Harvesters',
    gradientStart: '#14532D',
    gradientEnd: '#15803D',
    iconColor: '#86EFAC',
    iconSvg: `
      <path d="M400 390 L400 210" stroke="white" stroke-width="16" stroke-linecap="round"/>
      <path d="M400 270 C340 270, 310 220, 310 170 C360 170, 400 210, 400 270" fill="white" opacity="0.85"/>
      <path d="M400 230 C460 230, 490 180, 490 130 C440 130, 400 170, 400 230" fill="white" opacity="0.85"/>
      <line x1="260" y1="390" x2="540" y2="390" stroke="white" stroke-width="14" stroke-linecap="round"/>
    `
  },
  {
    name: 'services.svg',
    title: 'Adilabad Commercial Services',
    subtitle: 'Electrical • Plumbing • Motor Rewinding • Experts',
    gradientStart: '#1E1B4B',
    gradientEnd: '#4338CA',
    iconColor: '#A5B4FC',
    iconSvg: `
      <path d="M300 350 L420 230 C410 210, 415 180, 435 160 C460 135, 495 135, 510 150 C525 165, 525 200, 500 225 C480 245, 450 250, 430 240 L310 360 C300 370, 290 360, 300 350 Z" fill="white" opacity="0.9"/>
      <circle cx="485" cy="175" r="14" fill="#1E1B4B"/>
    `
  },
  {
    name: 'rentals.svg',
    title: 'Adilabad Equipment & Rental Fleet',
    subtitle: 'Cinema Cameras • Sound Systems • Farm Tools & Machinery',
    gradientStart: '#18181B',
    gradientEnd: '#D97706',
    iconColor: '#FBBF24',
    iconSvg: `
      <rect x="240" y="180" width="320" height="210" rx="24" fill="none" stroke="white" stroke-width="16"/>
      <circle cx="400" cy="285" r="55" fill="none" stroke="white" stroke-width="14"/>
      <circle cx="400" cy="285" r="22" fill="white" opacity="0.6"/>
      <rect x="290" y="140" width="90" height="40" rx="8" fill="white" opacity="0.8"/>
      <circle cx="505" cy="225" r="10" fill="white"/>
    `
  },
  {
    name: 'default.svg',
    title: 'Adilabad Verified Listing',
    subtitle: 'Handpicked Local Business & Hyperlocal Classifieds',
    gradientStart: '#0B132B',
    gradientEnd: '#1C2541',
    iconColor: '#10B981',
    iconSvg: `
      <polygon points="400,140 435,210 510,220 455,275 470,350 400,315 330,350 345,275 290,220 365,210" fill="none" stroke="white" stroke-width="14" stroke-linejoin="round"/>
      <circle cx="400" cy="245" r="28" fill="white" opacity="0.3"/>
    `
  }
];

placeholders.forEach((p) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="grad_${p.name.replace('.svg', '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.gradientStart}"/>
      <stop offset="100%" stop-color="${p.gradientEnd}"/>
    </linearGradient>
    <radialGradient id="glow_${p.name.replace('.svg', '')}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${p.iconColor}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${p.gradientStart}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1" opacity="0.06"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#grad_${p.name.replace('.svg', '')})"/>
  <rect width="100%" height="100%" fill="url(#glow_${p.name.replace('.svg', '')})"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>

  <!-- Decorative circles -->
  <circle cx="720" cy="80" r="160" fill="none" stroke="white" stroke-width="2" opacity="0.08"/>
  <circle cx="80" cy="420" r="120" fill="none" stroke="white" stroke-width="2" opacity="0.08"/>

  <!-- District Watermark Tag -->
  <g transform="translate(40, 40)">
    <rect width="180" height="32" rx="16" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <circle cx="20" cy="16" r="6" fill="#10B981"/>
    <text x="35" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" letter-spacing="1">ADILABAD SUPER APP</text>
  </g>

  <!-- Icon Graphic -->
  <g id="iconGroup">
    ${p.iconSvg}
  </g>

  <!-- Ambient Bottom Gradient for Text Legibility -->
  <rect y="380" width="800" height="120" fill="url(#grad_${p.name.replace('.svg', '')})" opacity="0.95"/>
  <line x1="40" y1="410" x2="760" y2="410" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

  <!-- Title & Subtitle -->
  <text x="400" y="445" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${p.title}</text>
  <text x="400" y="472" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="rgba(255,255,255,0.75)" text-anchor="middle">${p.subtitle}</text>
</svg>`;

  fs.writeFileSync(path.join(targetDir, p.name), svg, 'utf8');
  console.log(`Generated: ${p.name}`);
});

console.log('All placeholder SVGs generated successfully!');
