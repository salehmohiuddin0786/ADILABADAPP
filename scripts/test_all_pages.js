const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3010';

const SLUG_MAP = {
  '[slug]': {
    'advertisements': 'shree-balaji-mega-festival-electronics-sale',
    'businesses': 'shree-balaji-electronics-appliances',
    'events': 'adilabad-mega-consumer-fair-food-festival-2026',
    'categories': 'business',
    'rentals': 'sony-alpha-a7-iv-mirrorless-camera'
  },
  '[id]': {
    'admin/advertisements': '1',
    'advertisements': '1'
  }
};

function getAllPages(dir, base = '') {
  let pages = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      pages = pages.concat(getAllPages(full, rel));
    } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
      if (!entry.name.startsWith('_') && !entry.name.startsWith('404')) {
        pages.push(rel.replace(/\\/g, '/'));
      }
    }
  }
  return pages;
}

function convertPageToRoute(pagePath) {
  let route = pagePath
    .replace(/\.jsx?$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '');

  if (!route.startsWith('/')) {
    route = '/' + route;
  }

  // Handle dynamic segments
  if (route.includes('[slug]')) {
    for (const [key, slug] of Object.entries(SLUG_MAP['[slug]'])) {
      if (route.includes(key)) {
        route = route.replace('[slug]', slug);
        break;
      }
    }
    // Fallback if not matched
    route = route.replace('[slug]', 'sample-slug');
  }

  if (route.includes('[id]')) {
    for (const [key, id] of Object.entries(SLUG_MAP['[id]'])) {
      if (route.includes(key)) {
        route = route.replace('[id]', id);
        break;
      }
    }
    route = route.replace('[id]', '1');
  }

  return route;
}

function fetchRoute(route) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + route);
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const is500 = res.statusCode >= 500;
        const hasReactError = data.includes('Internal Server Error') || data.includes('Unhandled Runtime Error') || data.includes('ReferenceError');
        resolve({
          route,
          status: res.statusCode,
          ok: res.statusCode === 200 && !hasReactError,
          length: data.length,
          error: is500 || hasReactError ? data.slice(0, 300) : null
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        route,
        status: 0,
        ok: false,
        error: err.message
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        route,
        status: 408,
        ok: false,
        error: 'Timeout after 10s'
      });
    });
  });
}

async function run() {
  console.log('Scanning all pages in frontend/pages...');
  const pages = getAllPages('frontend/pages');
  const routes = [...new Set(pages.map(convertPageToRoute))];
  console.log(`Found ${pages.length} page files, converted to ${routes.length} unique routes.\n`);

  console.log('Testing each route against live server at http://localhost:3010 ...\n');

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    process.stdout.write(`[${i + 1}/${routes.length}] Testing ${route} ... `);
    const result = await fetchRoute(route);

    if (result.ok) {
      console.log(`✓ 200 OK (${result.length} bytes)`);
      passed++;
    } else {
      console.log(`✗ FAILED (Status: ${result.status})`);
      if (result.error) {
        console.log(`    Error preview: ${result.error.replace(/\n/g, ' ').slice(0, 150)}`);
      }
      failed++;
      failures.push(result);
    }
  }

  console.log('\n======================================================');
  console.log(`FINAL REPORT: ${passed} PASSED, ${failed} FAILED out of ${routes.length} routes.`);
  console.log('======================================================');

  if (failures.length > 0) {
    console.log('\nFailed Routes:');
    failures.forEach(f => console.log(`  - ${f.route}: Status ${f.status} -> ${f.error?.slice(0, 100)}`));
    process.exit(1);
  } else {
    console.log('\nAll pages verified successfully! Zero errors found.');
    process.exit(0);
  }
}

run();
