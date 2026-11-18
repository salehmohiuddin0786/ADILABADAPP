const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images', 'icons');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function makeIconSvg(size) {
  const radius = Math.round(size * 0.22);
  const subFontSize = Math.round(size * 0.08);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.03}" stdDeviation="${size * 0.04}" flood-color="#0284C7" flood-opacity="0.4" />
    </filter>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bgGrad)" />
  <g filter="url(#glow)">
    <path d="M${size * 0.5} ${size * 0.18} C${size * 0.35} ${size * 0.18} ${size * 0.24} ${size * 0.3} ${size * 0.24} ${size * 0.46} C${size * 0.24} ${size * 0.65} ${size * 0.5} ${size * 0.84} ${size * 0.5} ${size * 0.84} C${size * 0.5} ${size * 0.84} ${size * 0.76} ${size * 0.65} ${size * 0.76} ${size * 0.46} C${size * 0.76} ${size * 0.3} ${size * 0.65} ${size * 0.18} ${size * 0.5} ${size * 0.18} Z" fill="#FFFFFF" />
    <circle cx="${size * 0.5}" cy="${size * 0.46}" r="${size * 0.11}" fill="#0284C7" />
    <text x="${size * 0.5}" y="${size * 0.5}" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="${size * 0.14}" dy=".1em">A</text>
  </g>
  <text x="${size * 0.5}" y="${size * 0.94}" text-anchor="middle" fill="#38BDF8" font-family="sans-serif" font-weight="800" font-size="${subFontSize}" letter-spacing="${size * 0.01}">ADILABAD APP</text>
</svg>`;
}

fs.writeFileSync(path.join(dir, 'icon-192x192.svg'), makeIconSvg(192));
fs.writeFileSync(path.join(dir, 'icon-512x512.svg'), makeIconSvg(512));
fs.writeFileSync(path.join(dir, 'apple-touch-icon.svg'), makeIconSvg(180));
fs.writeFileSync(path.join(dir, 'maskable-icon-512x512.svg'), makeIconSvg(512));

console.log('PWA app icons generated successfully!');
