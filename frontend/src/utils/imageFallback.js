/**
 * Robust image fallback helper for Adilabad Super App
 * Ensures listings always show rich visual assets even if external CDN (Unsplash) is blocked or offline.
 */

export function getCategoryFallbackImage(categoryName = '', slugOrTitle = '') {
  const norm = `${categoryName || ''} ${slugOrTitle || ''}`.toLowerCase();

  if (norm.includes('shop') || norm.includes('saree') || norm.includes('cloth') || norm.includes('jewel') || norm.includes('gold') || norm.includes('handloom')) {
    return '/images/placeholders/shopping.svg';
  }
  if (norm.includes('prop') || norm.includes('house') || norm.includes('flat') || norm.includes('showroom') || norm.includes('land') || norm.includes('plot') || norm.includes('bhk') || norm.includes('villa') || norm.includes('lease')) {
    return '/images/placeholders/property.svg';
  }
  if (norm.includes('food') || norm.includes('rest') || norm.includes('biryani') || norm.includes('hotel') || norm.includes('cafe') || norm.includes('sweet') || norm.includes('dining') || norm.includes('thali')) {
    return '/images/placeholders/food.svg';
  }
  if (norm.includes('job') || norm.includes('hiring') || norm.includes('accountant') || norm.includes('career') || norm.includes('walk-in') || norm.includes('vacancy') || norm.includes('billing')) {
    return '/images/placeholders/jobs.svg';
  }
  if (norm.includes('veh') || norm.includes('car') || norm.includes('thar') || norm.includes('bike') || norm.includes('auto') || norm.includes('tractor') || norm.includes('motor') || norm.includes('4x4')) {
    return '/images/placeholders/vehicles.svg';
  }
  if (norm.includes('elec') || norm.includes('tv') || norm.includes('mobile') || norm.includes('appliance') || norm.includes('ac') || norm.includes('refriger') || norm.includes('smart')) {
    return '/images/placeholders/electronics.svg';
  }
  if (norm.includes('agri') || norm.includes('farm') || norm.includes('cotton') || norm.includes('seed') || norm.includes('crop') || norm.includes('kisan')) {
    return '/images/placeholders/agriculture.svg';
  }
  if (norm.includes('serv') || norm.includes('repair') || norm.includes('plumb') || norm.includes('paint') || norm.includes('mechanic') || norm.includes('electrician')) {
    return '/images/placeholders/services.svg';
  }
  if (norm.includes('rent') || norm.includes('camera') || norm.includes('sound') || norm.includes('lens') || norm.includes('tool') || norm.includes('gear') || norm.includes('fleet')) {
    return '/images/placeholders/rentals.svg';
  }

  return '/images/placeholders/default.svg';
}

/**
 * Image error handler that prevents infinite loop and applies appropriate category SVG
 */
export function handleImageError(e, categoryName = '', slugOrTitle = '') {
  if (!e || !e.target) return;
  if (e.target.dataset.hasFailed === 'true') return;
  e.target.dataset.hasFailed = 'true';
  const fallback = getCategoryFallbackImage(categoryName, slugOrTitle);
  e.target.src = fallback;
}
