import {
  MOCK_CATEGORIES,
  MOCK_LOCATIONS,
  MOCK_BANNERS,
  MOCK_BUSINESSES,
  MOCK_ADVERTISEMENTS,
  MOCK_EVENTS,
  MOCK_NOTIFICATIONS,
  MOCK_ANALYTICS,
  filterMockAdvertisements,
  filterMockBusinesses,
  filterMockEvents,
  getMockSearch
} from '../data/mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Parses query string from endpoint URL into key-value object
 */
function parseQueryParams(url) {
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) return {};
  const queryStr = url.slice(queryIndex + 1);
  const params = {};
  const pairs = queryStr.split('&');
  for (const pair of pairs) {
    const [key, val] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = val ? decodeURIComponent(val.replace(/\+/g, ' ')) : '';
    }
  }
  return params;
}

/**
 * Fallback Mock Router: provides realistic local data if backend is offline or unreachable
 */
export function getMockResponse(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('http')
    ? endpoint.replace(/^https?:\/\/[^/]+\/api/, '')
    : endpoint;

  const urlWithoutQuery = cleanEndpoint.split('?')[0].replace(/^\/api/, '');
  const params = parseQueryParams(cleanEndpoint);
  const method = (options.method || 'GET').toUpperCase();

  let body = {};
  if (options.body && typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body);
    } catch (e) {}
  }

  // 1. Categories
  if (urlWithoutQuery === '/categories' || urlWithoutQuery === '/categories/admin/list') {
    return { success: true, data: MOCK_CATEGORIES };
  }
  if (urlWithoutQuery.startsWith('/categories/admin/create')) {
    return { success: true, message: 'Category created successfully.', data: { id: Date.now(), slug: 'new-cat' } };
  }
  if (urlWithoutQuery.startsWith('/categories/admin/update')) {
    return { success: true, message: 'Category updated successfully.' };
  }
  if (urlWithoutQuery.startsWith('/categories/admin/delete')) {
    return { success: true, message: 'Category deleted successfully.' };
  }
  if (urlWithoutQuery.startsWith('/categories/detail/') || (urlWithoutQuery.startsWith('/categories/') && !urlWithoutQuery.includes('/admin/'))) {
    const slug = urlWithoutQuery.replace('/categories/detail/', '').replace('/categories/', '');
    const cat = MOCK_CATEGORIES.find(c => c.slug === slug || c.id == slug) || MOCK_CATEGORIES[0];
    return { success: true, data: cat };
  }

  // 2. Locations
  if (urlWithoutQuery === '/locations' || urlWithoutQuery.startsWith('/locations/')) {
    return { success: true, data: MOCK_LOCATIONS };
  }

  // 3. Banners
  if (urlWithoutQuery === '/banners' || urlWithoutQuery === '/banners/admin/list') {
    return { success: true, data: MOCK_BANNERS };
  }
  if (urlWithoutQuery.startsWith('/banners/admin/create') || urlWithoutQuery.startsWith('/banners/admin/update') || urlWithoutQuery.startsWith('/banners/admin/delete')) {
    return { success: true, message: 'Banner updated successfully.' };
  }

  // 4. Advertisements
  if (urlWithoutQuery === '/advertisements/admin/list' || urlWithoutQuery === '/advertisements') {
    return filterMockAdvertisements(params);
  }
  if (urlWithoutQuery.startsWith('/advertisements/admin/delete') || urlWithoutQuery.includes('/status') || urlWithoutQuery.includes('/feature')) {
    return { success: true, message: 'Advertisement updated successfully.' };
  }
  if (urlWithoutQuery.startsWith('/advertisements/detail/') || (urlWithoutQuery.startsWith('/advertisements/') && !urlWithoutQuery.includes('/admin/'))) {
    const slugOrId = urlWithoutQuery.replace('/advertisements/detail/', '').replace('/advertisements/', '');
    if (slugOrId.endsWith('/click')) {
      return { success: true, message: 'Click tracked (Demo Mode)' };
    }
    const ad = MOCK_ADVERTISEMENTS.find(a => a.slug === slugOrId || a.id == slugOrId) || MOCK_ADVERTISEMENTS[0];
    const related = MOCK_ADVERTISEMENTS.filter(a => a.id !== ad.id && a.category_id === ad.category_id).slice(0, 4);
    return { success: true, data: { ...ad, related } };
  }

  // 5. Businesses
  if (urlWithoutQuery === '/businesses' || urlWithoutQuery === '/businesses/admin/list') {
    return filterMockBusinesses(params);
  }
  if (urlWithoutQuery.startsWith('/businesses/admin/delete') || urlWithoutQuery.startsWith('/businesses/admin/update')) {
    return { success: true, message: 'Business updated successfully.' };
  }
  if (urlWithoutQuery.startsWith('/businesses/detail/') || (urlWithoutQuery.startsWith('/businesses/') && !urlWithoutQuery.includes('/admin/'))) {
    const slugOrId = urlWithoutQuery.replace('/businesses/detail/', '').replace('/businesses/', '');
    const biz = MOCK_BUSINESSES.find(b => b.slug === slugOrId || b.id == slugOrId) || MOCK_BUSINESSES[0];
    const bizAds = MOCK_ADVERTISEMENTS.filter(a => a.business_name === biz.name || a.category_id === biz.category_id);
    return { success: true, data: { ...biz, advertisements: bizAds } };
  }

  // 6. Events
  if (urlWithoutQuery === '/events' || urlWithoutQuery === '/events/admin/list') {
    return filterMockEvents(params);
  }
  if (urlWithoutQuery.startsWith('/events/admin/delete') || urlWithoutQuery.startsWith('/events/admin/update')) {
    return { success: true, message: 'Event updated successfully.' };
  }
  if (urlWithoutQuery.startsWith('/events/detail/') || (urlWithoutQuery.startsWith('/events/') && !urlWithoutQuery.includes('/admin/'))) {
    const slugOrId = urlWithoutQuery.replace('/events/detail/', '').replace('/events/', '');
    const ev = MOCK_EVENTS.find(e => e.slug === slugOrId || e.id == slugOrId) || MOCK_EVENTS[0];
    const upcoming = MOCK_EVENTS.filter(e => e.id !== ev.id);
    return { success: true, data: { ...ev, upcoming } };
  }

  // 7. Rentals (Rent Your Items & Heavy Equipment)
  if (urlWithoutQuery.includes('/rentals')) {
    const defaultMockRentals = [
      {
        id: 101,
        title: 'Sony Alpha A7 IV Mirrorless Camera + 24-70mm Lens',
        slug: 'sony-alpha-a7-iv-mirrorless-camera',
        category_id: 1,
        category_name: 'Electronics & Cameras',
        daily_rate: 1500,
        hourly_rate: 250,
        weekly_rate: 8000,
        monthly_rate: 28000,
        security_deposit: 5000,
        location: 'Cinema Road, Adilabad',
        pickup_address: 'Shop #4, Near Natraj Theater, Cinema Road, Adilabad, 504001',
        item_condition: 'like_new',
        owner_name: 'Adilabad Media Works & Camera Rentals',
        owner_phone: '+91 98480 22334',
        status: 'AVAILABLE',
        description: 'Professional camera kit for weddings, documentary shoots, and events in Adilabad. Includes 2x high-capacity batteries, 128GB V90 SD card, dual charger, and weather-sealed carrying case.',
        cancellation_policy: 'Full deposit refund if cancelled 24 hours prior to handover.',
        damage_policy: 'Hirer is responsible for physical lens scratches or water damage.',
        media: [{ media_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800' }]
      },
      {
        id: 102,
        title: 'John Deere 5050D Tractor with Cultivator',
        slug: 'john-deere-5050d-tractor-rental',
        category_id: 2,
        category_name: 'Agricultural Equipment & Tractors',
        daily_rate: 3200,
        hourly_rate: 450,
        weekly_rate: 18000,
        monthly_rate: 65000,
        security_deposit: 8000,
        location: 'Utnoor Road, Adilabad',
        pickup_address: 'Utnoor Highway Crossing, Adilabad Rural',
        item_condition: 'good',
        owner_name: 'Telangana Agri Hub',
        owner_phone: '+91 98499 11223',
        status: 'AVAILABLE',
        description: 'High performance 50HP tractor with heavy-duty disc cultivator ready for field plowing and agricultural transport.',
        cancellation_policy: 'Free cancellation up to 48 hours before farm dispatch.',
        damage_policy: 'Hirer responsible for tire puncture or mechanical misuse.',
        media: [{ media_url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800' }]
      },
      {
        id: 103,
        title: 'JBL VRX Line Array 10000W Sound Setup for Events',
        slug: 'jbl-vrx-sound-setup-events',
        category_id: 3,
        category_name: 'Event Sound & Stage Gear',
        daily_rate: 8500,
        hourly_rate: 1200,
        weekly_rate: 45000,
        monthly_rate: 150000,
        security_deposit: 12000,
        location: 'Subhash Nagar, Adilabad',
        pickup_address: 'Royal Sound Depot, Subhash Nagar, Adilabad',
        item_condition: 'like_new',
        owner_name: 'Royal Sound & Lights',
        owner_phone: '+91 94401 55667',
        status: 'AVAILABLE',
        description: 'Complete high-power public address and music sound system with wireless digital microphones and digital mixer.',
        cancellation_policy: '50% retention if cancelled less than 3 days before festival or wedding date.',
        damage_policy: 'Deposit forfeited if speaker drivers are blown by over-voltage.',
        media: [{ media_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800' }]
      }
    ];

    // Load persisted user-uploaded rental items from localStorage
    let savedRentals = [];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('adilabad_rentals');
        if (stored) {
          savedRentals = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Error reading adilabad_rentals from localStorage:', e);
      }
    }

    // Merge: User uploaded items first, followed by default mock rentals
    const allRentals = [...savedRentals, ...defaultMockRentals];

    // Handle Rental Booking proposal
    if (method === 'POST' && urlWithoutQuery.includes('/book')) {
      const bookingCode = `ADL-RENT-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking = {
        id: Date.now(),
        booking_code: bookingCode,
        rental_id: body.rental_id,
        start_date: body.start_date,
        end_date: body.end_date,
        customer_notes: body.customer_notes || '',
        status: 'PENDING',
        created_at: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        try {
          const storedBookings = JSON.parse(localStorage.getItem('adilabad_rental_bookings') || '[]');
          storedBookings.unshift(newBooking);
          localStorage.setItem('adilabad_rental_bookings', JSON.stringify(storedBookings));
        } catch (e) {}
      }

      return {
        success: true,
        message: 'Rental booking proposal sent to owner!',
        data: {
          booking_code: bookingCode,
          status: 'PENDING'
        }
      };
    }

    // Handle Upload / Create new rental item
    if (method === 'POST') {
      const categoryNames = {
        '1': 'Electronics & Cameras',
        '2': 'Agricultural Equipment & Tractors',
        '3': 'Event Sound & Stage Gear',
        '4': 'Construction & Power Tools',
        '5': 'Home Appliances & Coolers',
        '6': 'Vehicles & Transport'
      };

      const categoryName = body.category_name || categoryNames[body.category_id] || 'General Equipment';
      const cleanTitle = (body.title || 'Untitled Rental Item').trim();
      const generatedSlug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
      
      const defaultCatImages = {
        '1': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        '2': 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800',
        '3': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
        '4': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
        '5': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
        '6': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'
      };

      const finalImage = body.image_url || body.media_urls?.[0] || defaultCatImages[body.category_id] || defaultCatImages['1'];

      const newRental = {
        id: Date.now(),
        title: cleanTitle,
        slug: generatedSlug,
        category_id: body.category_id || 1,
        category_name: categoryName,
        daily_rate: Number(body.daily_rate) || 1000,
        hourly_rate: Number(body.hourly_rate) || 0,
        weekly_rate: Number(body.weekly_rate) || 0,
        monthly_rate: Number(body.monthly_rate) || 0,
        security_deposit: Number(body.security_deposit) || 0,
        min_rental_days: Number(body.min_rental_days) || 1,
        max_rental_days: Number(body.max_rental_days) || 30,
        item_condition: body.item_condition || 'like_new',
        location: body.location || 'Cinema Road, Adilabad',
        pickup_address: body.pickup_address || 'Adilabad, Telangana',
        is_delivery_available: !!body.is_delivery_available,
        delivery_charge: Number(body.delivery_charge) || 0,
        cancellation_policy: body.cancellation_policy || 'Full deposit refund if cancelled 24 hours prior to handover.',
        damage_policy: body.damage_policy || 'Hirer is responsible for repairing or replacing any physically broken parts.',
        owner_name: body.owner_name || 'Adilabad Media Works & Camera Rentals',
        owner_phone: body.owner_phone || '+91 98480 22334',
        status: 'AVAILABLE',
        is_user_uploaded: true,
        description: body.description || `${cleanTitle} available for rent in Adilabad. Verified local handover with test on site.`,
        media: [{ media_url: finalImage }],
        created_at: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        try {
          const currentList = JSON.parse(localStorage.getItem('adilabad_rentals') || '[]');
          currentList.unshift(newRental);
          localStorage.setItem('adilabad_rentals', JSON.stringify(currentList));
        } catch (e) {
          console.error('Error saving new rental to localStorage:', e);
        }
      }

      return {
        success: true,
        message: 'Rental listing submitted and published successfully to your inventory!',
        data: newRental
      };
    }

    // Handle Delete rental item
    if (method === 'DELETE') {
      const idMatch = urlWithoutQuery.match(/\/rentals\/(\d+)/);
      if (idMatch && typeof window !== 'undefined') {
        const delId = parseInt(idMatch[1], 10);
        try {
          const currentList = JSON.parse(localStorage.getItem('adilabad_rentals') || '[]');
          const filtered = currentList.filter(item => item.id !== delId);
          localStorage.setItem('adilabad_rentals', JSON.stringify(filtered));
        } catch (e) {}
      }
      return { success: true, message: 'Rental item removed from inventory.' };
    }

    // Handle Status update (e.g. AVAILABLE <-> RENTED / MAINTENANCE)
    if (method === 'PATCH' || method === 'PUT') {
      const idMatch = urlWithoutQuery.match(/\/rentals\/(\d+)/);
      if (idMatch && typeof window !== 'undefined') {
        const updateId = parseInt(idMatch[1], 10);
        try {
          const currentList = JSON.parse(localStorage.getItem('adilabad_rentals') || '[]');
          const updated = currentList.map(item => {
            if (item.id === updateId) {
              return { ...item, status: body.status || (item.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE') };
            }
            return item;
          });
          localStorage.setItem('adilabad_rentals', JSON.stringify(updated));
        } catch (e) {}
      }
      return { success: true, message: 'Rental item status updated successfully.' };
    }

    // Handle Detail route by slug or ID: e.g. /api/v1/rentals/:slug or /rentals/:slug
    const pathParts = urlWithoutQuery.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart && lastPart !== 'rentals' && lastPart !== 'list') {
      const found = allRentals.find(r => r.slug === lastPart || String(r.id) === lastPart);
      if (found) {
        return { success: true, data: found };
      }
    }

    // Return all merged rentals (optionally filtered by search / category)
    let result = allRentals;
    if (params.category && params.category !== 'all') {
      result = result.filter(r => r.category_name?.toLowerCase().includes(params.category.toLowerCase()));
    }
    if (params.search || params.q) {
      const q = (params.search || params.q).toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q));
    }

    return {
      success: true,
      count: result.length,
      data: result
    };
  }

  // 7b. Unified Submissions & Approvals (Owner <-> Super Admin)
  if (urlWithoutQuery.includes('/submissions')) {
    let subs = [];
    if (typeof window !== 'undefined') {
      try {
        subs = JSON.parse(localStorage.getItem('adilabad_unified_submissions') || '[]');
      } catch (e) {}
    }

    if (method === 'POST') {
      const newSub = {
        id: `SUB-${Date.now().toString().slice(-6)}`,
        module: body.module || 'rentals',
        title: body.title || 'Untitled Submission',
        category: body.category || 'General',
        pricing: body.pricing || 'Contact for Price',
        location: body.location || 'Adilabad',
        owner_name: body.owner_name || 'Owner',
        owner_phone: body.owner_phone || '+91 98480 22334',
        status: 'PENDING_APPROVAL',
        submitted_at: new Date().toISOString(),
        image_url: body.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        description: body.description || ''
      };
      subs.unshift(newSub);
      if (typeof window !== 'undefined') {
        localStorage.setItem('adilabad_unified_submissions', JSON.stringify(subs));
      }
      return { success: true, message: 'Submission created for approval', data: newSub };
    }

    if (method === 'PATCH' || method === 'PUT') {
      const match = urlWithoutQuery.match(/\/submissions\/([^/]+)/);
      const subId = match ? match[1] : null;
      if (subId && typeof window !== 'undefined') {
        subs = subs.map(s => s.id === subId ? { ...s, status: body.status || 'PUBLISHED', review_notes: body.review_notes || '' } : s);
        localStorage.setItem('adilabad_unified_submissions', JSON.stringify(subs));
      }
      return { success: true, message: 'Submission status updated successfully.' };
    }

    if (params.status && params.status !== 'all') {
      subs = subs.filter(s => s.status === params.status);
    }
    if (params.module && params.module !== 'all') {
      subs = subs.filter(s => s.module === params.module);
    }
    return { success: true, data: subs, total: subs.length };
  }

  // 8. Global Search
  if (urlWithoutQuery === '/search') {
    return getMockSearch(params.q || params.search || '', params.location || '');
  }

  // 8. Notifications
  if (urlWithoutQuery === '/notifications') {
    return { success: true, data: MOCK_NOTIFICATIONS };
  }

  // 9. Favorites (Persisted locally in offline mode)
  if (urlWithoutQuery === '/favorites') {
    let mockFavs = [];
    if (typeof window !== 'undefined') {
      try {
        mockFavs = JSON.parse(localStorage.getItem('adilabad_mock_favorites') || '[]');
      } catch (e) {}
    }

    if (method === 'POST') {
      const { item_type, item_id } = body;
      const numId = parseInt(item_id, 10);
      const index = mockFavs.findIndex(f => f.item_type === item_type && parseInt(f.item_id, 10) === numId);
      let isFavorited = false;
      if (index >= 0) {
        mockFavs.splice(index, 1);
        isFavorited = false;
      } else {
        mockFavs.push({ id: Date.now(), item_type, item_id: numId, created_at: new Date().toISOString() });
        isFavorited = true;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('adilabad_mock_favorites', JSON.stringify(mockFavs));
      }
      return {
        success: true,
        is_favorited: isFavorited,
        message: isFavorited ? 'Saved to favorites' : 'Removed from favorites'
      };
    }

    const favAds = MOCK_ADVERTISEMENTS.filter(a => mockFavs.some(f => f.item_type === 'advertisement' && parseInt(f.item_id, 10) === a.id));
    const favBiz = MOCK_BUSINESSES.filter(b => mockFavs.some(f => f.item_type === 'business' && parseInt(f.item_id, 10) === b.id));
    const favEv = MOCK_EVENTS.filter(e => mockFavs.some(f => f.item_type === 'event' && parseInt(f.item_id, 10) === e.id));

    return {
      success: true,
      data: {
        all: mockFavs,
        advertisements: favAds,
        businesses: favBiz,
        events: favEv
      }
    };
  }

  // 10. Analytics / Admin Dashboard
  if (urlWithoutQuery.includes('/analytics')) {
    return { success: true, data: MOCK_ANALYTICS };
  }

  // 11. Admin Reports / Users / Settings
  if (urlWithoutQuery === '/admin/reports') {
    return { success: true, data: [] };
  }
  if (urlWithoutQuery === '/admin/users') {
    return {
      success: true,
      data: [
        { id: 1, name: 'Adilabad Admin', email: 'admin@adilabadapp.com', role: 'admin', created_at: '2026-01-01' },
        { id: 2, name: 'Ramesh Kumar', email: 'user@adilabadapp.com', role: 'user', created_at: '2026-02-15' }
      ]
    };
  }
  if (urlWithoutQuery === '/admin/settings') {
    return {
      success: true,
      data: {
        site_name: 'Adilabad App',
        site_tagline: 'Discover Adilabad. Discover Local.',
        contact_phone: '+91 94401 12345',
        contact_email: 'hello@adilabadapp.com',
        admin_approval_required: true
      }
    };
  }

  // 12. Auth Endpoints
  if (urlWithoutQuery === '/auth/me') {
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('adilabad_mock_user') : null;
    if (savedUser) {
      try {
        return { success: true, user: JSON.parse(savedUser) };
      } catch (e) {}
    }
    return {
      success: true,
      user: {
        id: 1,
        name: 'Adilabad Admin',
        email: 'admin@adilabadapp.com',
        phone: '+91 94401 12345',
        role: 'admin'
      }
    };
  }

  if (urlWithoutQuery === '/auth/login') {
    const isAdmin = body.email && (body.email.includes('admin') || body.email === 'admin@adilabadapp.com');
    const isOwner = body.email && (body.email.includes('owner') || body.email === 'owner@adilabadapp.com');
    const mockUser = {
      id: isAdmin ? 1 : (isOwner ? 3 : 2),
      name: isAdmin ? 'Adilabad Admin' : (isOwner ? 'Adilabad Media Works (Owner)' : 'Ramesh Kumar'),
      email: body.email || (isAdmin ? 'admin@adilabadapp.com' : (isOwner ? 'owner@adilabadapp.com' : 'user@adilabadapp.com')),
      phone: isOwner ? '+91 98480 22334' : '+91 94401 12345',
      role: isAdmin ? 'admin' : (isOwner ? 'owner' : 'user'),
      primary_role: isAdmin ? 'SUPER_ADMIN' : (isOwner ? 'BUSINESS_OWNER' : 'CUSTOMER'),
      roles: isAdmin ? ['SUPER_ADMIN', 'ADMIN'] : (isOwner ? ['BUSINESS_OWNER', 'INDIVIDUAL_OWNER'] : ['CUSTOMER'])
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('adilabad_mock_user', JSON.stringify(mockUser));
    }
    return {
      success: true,
      token: 'mock-jwt-token-adilabad-preview',
      user: mockUser,
      message: `Signed in as ${mockUser.name} (Offline Preview Mode)`
    };
  }

  if (urlWithoutQuery === '/auth/register') {
    const isOwner = body.accountType === 'owner' || body.role === 'owner' || (body.email && body.email.includes('owner'));
    const mockUser = {
      id: Date.now(),
      name: body.name || (isOwner ? 'Adilabad Enterprise' : 'Local Resident'),
      email: body.email || (isOwner ? 'owner@adilabadapp.com' : 'user@adilabadapp.com'),
      phone: body.phone || '+91 98480 12345',
      role: isOwner ? 'owner' : 'user',
      primary_role: isOwner ? 'BUSINESS_OWNER' : 'CUSTOMER',
      roles: isOwner ? ['BUSINESS_OWNER', 'INDIVIDUAL_OWNER'] : ['CUSTOMER']
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('adilabad_mock_user', JSON.stringify(mockUser));
    }
    return {
      success: true,
      token: 'mock-jwt-token-adilabad-preview',
      user: mockUser,
      message: isOwner ? 'Business Owner account registered!' : 'Account created successfully (Offline Preview Mode)'
    };
  }

  if (urlWithoutQuery === '/auth/profile') {
    return { success: true, message: 'Profile updated (Demo Mode)' };
  }

  // Fallback for any other endpoint
  return { success: true, data: [] };
}

/**
 * Robust API fetch client with automatic offline fallback to rich dummy data
 */
export async function apiFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adilabad_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If body is FormData (like image uploads), delete Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    // Abort controller with 2500ms timeout for snappy fallback when backend is offline
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Adilabad App API] Response not OK (${response.status}) at ${url}. Switching to fallback dummy data.`);
      return getMockResponse(endpoint, options);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Backend offline / connection refused / timed out -> return rich fallback mock data
    console.info(`[Adilabad App Offline Mode] Backend unreachable at ${url}. Serving fallback dummy data for ${endpoint}.`);
    return getMockResponse(endpoint, options);
  }
}
