import { apiFetch } from '../../utils/api';

/**
 * Unified Submission and Approval Service
 * Bridges Owner Panel creations and Super Admin Moderation/Approval
 * Covers all modules: rentals, advertisements, businesses, events, offers, buy-sell, services, jobs, properties, etc.
 */

const STORAGE_KEY = 'adilabad_unified_submissions';
const RENTALS_KEY = 'adilabad_rentals';

// Default initial submissions so system is active and realistic out of the box
const INITIAL_SUBMISSIONS = [
  {
    id: 'SUB-1001',
    module: 'rentals',
    moduleLabel: 'Equipment & Rental',
    title: 'Sony Alpha A7 IV Mirrorless Camera + 24-70mm GM Lens',
    category: 'Electronics & Cameras',
    pricing: '₹1,500 / day',
    daily_rate: 1500,
    security_deposit: 5000,
    location: 'Cinema Road, Adilabad',
    owner_id: 3,
    owner_name: 'Adilabad Media Works & Camera Rentals',
    owner_phone: '+91 98480 22334',
    status: 'PUBLISHED',
    submitted_at: '2026-11-14T10:00:00.000Z',
    reviewed_at: '2026-11-14T10:30:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    description: 'Professional high-speed full-frame 4K cinema kit for weddings, events, documentary, and portfolio shoots.',
    specs: { condition: 'like_new', pickup_address: 'Cinema Road, Opp. Geeta Theatre, Adilabad' }
  },
  {
    id: 'SUB-1002',
    module: 'rentals',
    moduleLabel: 'Equipment & Rental',
    title: 'John Deere 5050D 50HP Tractor with Heavy Cultivator',
    category: 'Agricultural Equipment & Tractors',
    pricing: '₹3,200 / day',
    daily_rate: 3200,
    security_deposit: 8000,
    location: 'Utnoor Road, Adilabad',
    owner_id: 3,
    owner_name: 'Telangana Agri Hub & Farm Services',
    owner_phone: '+91 94401 92834',
    status: 'PUBLISHED',
    submitted_at: '2026-11-14T11:00:00.000Z',
    reviewed_at: '2026-11-14T11:45:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800',
    description: '50HP heavy farm tractor equipped with hydraulic cultivator and trolley hook for cotton and soya farming.',
    specs: { condition: 'good', pickup_address: 'Utnoor Highway Crossing, Adilabad Rural' }
  },
  {
    id: 'SUB-1003',
    module: 'rentals',
    moduleLabel: 'Equipment & Rental',
    title: 'JBL VRX Line Array Concert Sound System (4 Tops + 2 Dual Subs)',
    category: 'Event Sound & Stage Gear',
    pricing: '₹7,500 / day',
    daily_rate: 7500,
    security_deposit: 12000,
    location: 'Bus Stand Road, Adilabad',
    owner_id: 3,
    owner_name: 'Adilabad DJ Sound & Event Gear',
    owner_phone: '+91 98488 44556',
    status: 'PENDING_APPROVAL',
    submitted_at: '2026-11-16T10:15:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    description: 'High-power professional stage sound rig with Crown digital amplifiers and digital mixer. Ideal for public rallies, marriages, and sangeet functions.',
    specs: { condition: 'excellent', pickup_address: 'Bus Stand Road, Near Netaji Chowk, Adilabad' }
  },
  {
    id: 'SUB-1004',
    module: 'advertisements',
    moduleLabel: 'Advertisement',
    title: 'Grand Diwali & Wedding Gold Jewellery Festival — 50% Off VA Charges',
    category: 'Jewellery & Retail',
    pricing: 'Special Seasonal Promotion',
    location: 'Main Road, Adilabad',
    owner_id: 3,
    owner_name: 'Sri Krishna Jewellers',
    owner_phone: '+91 94401 22331',
    status: 'PENDING_APPROVAL',
    submitted_at: '2026-11-16T11:20:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    description: 'Certified 916 BIS Hallmarked bridal jewellery collection with zero percent deduction on gold exchange.',
    specs: { banner_type: 'featured_ad', duration_days: 30 }
  },
  {
    id: 'SUB-1005',
    module: 'businesses',
    moduleLabel: 'Business Profile',
    title: 'Shree Balaji Electronics, Air Conditioners & Home Appliances',
    category: 'Electronics & Home Appliances',
    pricing: 'Storefront Profile',
    location: 'Cinema Road, Opp. Geeta Theatre, Adilabad',
    owner_id: 3,
    owner_name: 'Ramesh Balaji',
    owner_phone: '+91 94401 23456',
    status: 'PENDING_APPROVAL',
    submitted_at: '2026-11-16T12:05:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800',
    description: 'Authorized retailer for Sony, Samsung, Daikin, and Voltas with Bajaj Finserv 0% EMI financing.',
    specs: { trade_license: 'ADB-MUNC-TL-4912', gst_registered: true }
  },
  {
    id: 'SUB-1006',
    module: 'events',
    moduleLabel: 'Local Event',
    title: 'Adilabad District Agri Expo & Kisan Mela 2026',
    category: 'Expos & Trade Fairs',
    pricing: 'Free Public Entry',
    location: 'Indira Priyadarshini Stadium Ground, Adilabad',
    owner_id: 3,
    owner_name: 'Adilabad Farmers Association',
    owner_phone: '+91 98480 33445',
    status: 'PENDING_APPROVAL',
    submitted_at: '2026-11-16T13:10:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    description: 'Three-day agriculture machinery exhibition, seed suppliers conference, and organic farming workshops.',
    specs: { start_date: '2026-11-28', end_date: '2026-11-30' }
  },
  {
    id: 'SUB-1007',
    module: 'services',
    moduleLabel: 'Commercial Service',
    title: 'Adilabad Professional CCTV & Biometric Security Systems Installation',
    category: 'Home & Commercial Services',
    pricing: '₹499 Inspection Fee',
    location: 'Gandhi Chowk, Adilabad',
    owner_id: 3,
    owner_name: 'Telangana Smart Surveillance & IT Sol',
    owner_phone: '+91 98480 22334',
    status: 'PUBLISHED',
    submitted_at: '2026-11-15T09:00:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
    description: 'Expert HD and IP CCTV setup, DVR/NVR configuration, mobile app remote view and biometric attendance machine deployment for shops and godowns.',
    specs: { experience: '8+ Years', turnaround_time: '24 Hours' }
  },
  {
    id: 'SUB-1008',
    module: 'services',
    moduleLabel: 'Commercial Service',
    title: 'Sri Sai Electrician & Submersible Borewell Motor Rewinding Works',
    category: 'Electrical & Plumbing',
    pricing: '₹350 Service Visit',
    location: 'Netaji Chowk, Adilabad',
    owner_id: 3,
    owner_name: 'K. Ramesh Electricals',
    owner_phone: '+91 94401 88776',
    status: 'PENDING_APPROVAL',
    submitted_at: '2026-11-16T14:30:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
    description: 'Three-phase agricultural pump rewinding, domestic copper rewiring, MCB & inverter fault repairs with guaranteed 6-month warranty on motor coils.',
    specs: { emergency_service: true, tools: 'Advanced Testing Kit' }
  },
  {
    id: 'SUB-1009',
    module: 'buy-sell',
    moduleLabel: 'Pre-Owned Buy & Sell',
    title: 'Pre-Owned Massey Ferguson 241 DI Tractor (2022 Model, Single Owner)',
    category: 'Agricultural Machinery',
    pricing: '₹4,85,000 (Negotiable)',
    location: 'Utnoor Road, Adilabad',
    owner_id: 3,
    owner_name: 'Sardar Balwinder Singh',
    owner_phone: '+91 98492 11223',
    status: 'PUBLISHED',
    submitted_at: '2026-11-14T15:20:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800',
    description: 'Only 840 hours run, clean engine, brand new rear MRF tyres, comprehensive insurance valid until Oct 2027. RC and NOC ready for immediate transfer.',
    specs: { condition: 'excellent', model_year: '2022', ownership: '1st Owner' }
  },
  {
    id: 'SUB-1010',
    module: 'buy-sell',
    moduleLabel: 'Pre-Owned Buy & Sell',
    title: 'Apple iPhone 14 Pro Max 256GB Deep Purple (Battery 94% with Bill & Box)',
    category: 'Smartphones & Gadgets',
    pricing: '₹68,500',
    location: 'Cinema Road, Adilabad',
    owner_id: 3,
    owner_name: 'Adilabad Mobile Zone',
    owner_phone: '+91 94401 23456',
    status: 'PENDING_APPROVAL',
    submitted_at: '2026-11-16T15:10:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    description: 'Immaculate scratchless condition with genuine Apple fast charger cable, bill, original box and tempered glass pre-installed.',
    specs: { condition: 'like_new', warranty: '3 Months Shop Warranty' }
  },
  {
    id: 'SUB-1011',
    module: 'properties',
    moduleLabel: 'Commercial Property',
    title: 'Prime 2,400 Sq.Ft Commercial Ground Floor Showroom on Cinema Road',
    category: 'Commercial Rental',
    pricing: '₹65,000 / month',
    location: 'Cinema Road, Opp. Municipal Complex, Adilabad',
    owner_id: 3,
    owner_name: 'Adilabad Commercial Estates',
    owner_phone: '+91 98480 77889',
    status: 'PUBLISHED',
    submitted_at: '2026-11-15T11:40:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    description: 'Corner facing 40ft wide frontage, three-phase commercial power, designated customer parking for 12 cars, ideal for bank branch, clothing brand or hospital diagnostic lab.',
    specs: { area_sqft: 2400, property_type: 'Showroom', parking: 'Dedicated' }
  },
  {
    id: 'SUB-1012',
    module: 'jobs',
    moduleLabel: 'Job Vacancy',
    title: 'Senior Accountant & Tally Prime Specialist with GST Filing',
    category: 'Accounting & Finance',
    pricing: '₹25,000 - ₹32,000 / month',
    location: 'Gandhi Chowk, Adilabad',
    owner_id: 3,
    owner_name: 'Adilabad Cotton Heritage Group',
    owner_phone: '+91 98480 22334',
    status: 'PUBLISHED',
    submitted_at: '2026-11-15T16:00:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    description: 'Seeking energetic B.Com/M.Com graduate with minimum 3 years experience handling Tally Prime, e-Way bills, GSTR-1, GSTR-3B, TDS and vendor reconciliations.',
    specs: { job_type: 'Full-time', experience_required: '3+ Years', vacancies: 2 }
  },
  {
    id: 'SUB-1013',
    module: 'offers',
    moduleLabel: 'Special Offer',
    title: 'Flat 25% Off on All Pure Adilabad Cotton Sarees & Handloom Kurtas',
    category: 'Festive Deals & Fashion',
    pricing: 'Discount Voucher: ADBCOTTON25',
    location: 'Gandhi Chowk, Adilabad',
    owner_id: 3,
    owner_name: 'Adilabad Cotton Heritage',
    owner_phone: '+91 98480 22334',
    status: 'PUBLISHED',
    submitted_at: '2026-11-15T17:30:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
    description: 'Show this digital coupon at checkout to claim an exclusive 25% discount on all GI tagged authentic handloom items. Valid up to 30th November 2026.',
    specs: { coupon_code: 'ADBCOTTON25', discount_pct: 25, valid_until: '2026-11-30' }
  }
];

function getStoredSubmissions() {
  if (typeof window === 'undefined') return INITIAL_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    
    // Auto backfill any missing default modules if user has an old cache
    let updated = false;
    INITIAL_SUBMISSIONS.forEach((initItem) => {
      if (!parsed.some((p) => p.id === initItem.id || (p.title === initItem.title && p.module === initItem.module))) {
        parsed.push(initItem);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error('Error reading submissions from localStorage:', e);
    return INITIAL_SUBMISSIONS;
  }
}

function saveSubmissions(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // Also dispatch custom event for instant cross-component re-rendering
    window.dispatchEvent(new Event('adilabad_submissions_updated'));
  } catch (e) {
    console.error('Error saving submissions to localStorage:', e);
  }
}

export const submissionService = {
  /**
   * Get all submissions, optionally filtered by module, status, or search
   */
  async getSubmissions(filters = {}) {
    let items = getStoredSubmissions();

    // Also sync rentals into submissions if any exists in adilabad_rentals
    if (typeof window !== 'undefined') {
      try {
        const rawRentals = localStorage.getItem(RENTALS_KEY);
        if (rawRentals) {
          const rentalList = JSON.parse(rawRentals);
          if (Array.isArray(rentalList)) {
            let modified = false;
            rentalList.forEach((r) => {
              const subId = r.submission_id || `RENT-${r.id}`;
              const exists = items.some((i) => i.id === subId || i.id === r.id || (i.title === r.title && i.module === 'rentals'));
              if (!exists) {
                items.unshift({
                  id: subId,
                  module: 'rentals',
                  moduleLabel: 'Equipment & Rental',
                  title: r.title,
                  category: r.category_name || 'Equipment',
                  pricing: `₹${r.daily_rate} / day`,
                  daily_rate: r.daily_rate,
                  security_deposit: r.security_deposit || 0,
                  location: r.location || 'Adilabad',
                  owner_id: r.owner_id || 3,
                  owner_name: r.owner_name || 'Adilabad Media Works (Owner)',
                  owner_phone: r.owner_phone || '+91 98480 22334',
                  status: r.status === 'AVAILABLE' || r.status === 'approved' ? 'PUBLISHED' : (r.status || 'PENDING_APPROVAL'),
                  submitted_at: r.created_at || new Date().toISOString(),
                  image_url: r.media?.[0]?.media_url || r.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
                  description: r.description || r.title,
                  specs: { condition: r.item_condition, pickup_address: r.pickup_address }
                });
                modified = true;
              }
            });
            if (modified) saveSubmissions(items);
          }
        }
      } catch (e) {}
    }

    if (filters.module && filters.module !== 'all') {
      items = items.filter((i) => i.module === filters.module);
    }
    if (filters.status && filters.status !== 'all') {
      items = items.filter((i) => i.status === filters.status);
    }
    if (filters.owner_id) {
      items = items.filter((i) => i.owner_id === filters.owner_id);
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      items = items.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.owner_name?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q)
      );
    }

    return { success: true, data: items, total: items.length };
  },

  /**
   * Submit a new item from Owner Panel
   */
  async createSubmission(payload) {
    const items = getStoredSubmissions();
    const id = `SUB-${Date.now().toString().slice(-6)}`;
    const moduleLabelMap = {
      rentals: 'Equipment & Rental',
      advertisements: 'Advertisement',
      businesses: 'Business Profile',
      events: 'Local Event',
      offers: 'Offer & Discount',
      'buy-sell': 'Buy & Sell',
      services: 'Service Listing',
      jobs: 'Job Opening',
      properties: 'Property Listing',
      agriculture: 'Agricultural Supply',
      education: 'Education & Coaching',
      weddings: 'Wedding Service',
      restaurants: 'Restaurant Profile'
    };

    const newSub = {
      id,
      module: payload.module || 'rentals',
      moduleLabel: moduleLabelMap[payload.module] || 'Listing',
      title: (payload.title || 'Untitled Submission').trim(),
      category: payload.category || payload.category_name || 'General',
      pricing: payload.pricing || (payload.daily_rate ? `₹${payload.daily_rate} / day` : 'Contact for Price'),
      daily_rate: payload.daily_rate ? parseFloat(payload.daily_rate) : undefined,
      security_deposit: payload.security_deposit ? parseFloat(payload.security_deposit) : 0,
      location: payload.location || 'Adilabad',
      owner_id: payload.owner_id || 3,
      owner_name: payload.owner_name || 'Adilabad Media Works (Owner)',
      owner_phone: payload.owner_phone || '+91 98480 22334',
      status: 'PENDING_APPROVAL',
      submitted_at: new Date().toISOString(),
      image_url: payload.image_url || payload.media_urls?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      description: payload.description || payload.title,
      specs: payload.specs || {},
      review_notes: ''
    };

    items.unshift(newSub);
    saveSubmissions(items);

    // If it's a rental item, also save to adilabad_rentals so public/owner rental lists see it
    if (payload.module === 'rentals' && typeof window !== 'undefined') {
      try {
        const rawRentals = localStorage.getItem(RENTALS_KEY);
        const rentalList = rawRentals ? JSON.parse(rawRentals) : [];
        const cleanSlug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
        const rentalObj = {
          id: Date.now(),
          submission_id: id,
          title: newSub.title,
          slug: cleanSlug,
          category_name: newSub.category,
          daily_rate: newSub.daily_rate || 1000,
          security_deposit: newSub.security_deposit || 0,
          location: newSub.location,
          pickup_address: payload.pickup_address || newSub.location,
          status: 'PENDING_APPROVAL',
          owner_name: newSub.owner_name,
          owner_phone: newSub.owner_phone,
          media: [{ media_url: newSub.image_url }],
          description: newSub.description,
          created_at: newSub.submitted_at
        };
        rentalList.unshift(rentalObj);
        localStorage.setItem(RENTALS_KEY, JSON.stringify(rentalList));
      } catch (e) {}
    }

    return {
      success: true,
      message: `Your ${newSub.moduleLabel} "${newSub.title}" has been submitted to Super Admin for approval!`,
      data: newSub
    };
  },

  /**
   * Super Admin approves and publishes a submission
   */
  async approveAndPublish(id, notes = '') {
    const items = getStoredSubmissions();
    let target = null;
    const updated = items.map((item) => {
      if (item.id === id) {
        target = {
          ...item,
          status: 'PUBLISHED',
          reviewed_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          review_notes: notes || 'Approved & Published by Super Admin.'
        };
        return target;
      }
      return item;
    });

    saveSubmissions(updated);

    // Sync published rental item in adilabad_rentals
    if (target && target.module === 'rentals' && typeof window !== 'undefined') {
      try {
        const rawRentals = localStorage.getItem(RENTALS_KEY);
        if (rawRentals) {
          const rentalList = JSON.parse(rawRentals);
          const syncList = rentalList.map((r) => {
            if (r.submission_id === id || r.title === target.title) {
              return { ...r, status: 'AVAILABLE', approved_at: new Date().toISOString() };
            }
            return r;
          });
          localStorage.setItem(RENTALS_KEY, JSON.stringify(syncList));
        }
      } catch (e) {}
    }

    return {
      success: true,
      message: `"${target?.title || 'Submission'}" has been approved and published to the public marketplace!`,
      data: target
    };
  },

  /**
   * Super Admin requests changes from Owner
   */
  async requestChanges(id, feedback = 'Please provide clearer media or updated pricing.') {
    const items = getStoredSubmissions();
    let target = null;
    const updated = items.map((item) => {
      if (item.id === id) {
        target = {
          ...item,
          status: 'CHANGES_REQUESTED',
          reviewed_at: new Date().toISOString(),
          review_notes: feedback
        };
        return target;
      }
      return item;
    });

    saveSubmissions(updated);
    return {
      success: true,
      message: `Change request sent to owner for "${target?.title || 'Submission'}".`,
      data: target
    };
  },

  /**
   * Super Admin rejects a submission
   */
  async rejectSubmission(id, reason = 'Does not meet district marketplace guidelines.') {
    const items = getStoredSubmissions();
    let target = null;
    const updated = items.map((item) => {
      if (item.id === id) {
        target = {
          ...item,
          status: 'REJECTED',
          reviewed_at: new Date().toISOString(),
          review_notes: reason
        };
        return target;
      }
      return item;
    });

    saveSubmissions(updated);
    return {
      success: true,
      message: `Submission "${target?.title || 'Submission'}" rejected.`,
      data: target
    };
  },

  /**
   * Delete submission
   */
  async deleteSubmission(id) {
    const items = getStoredSubmissions();
    const filtered = items.filter((item) => item.id !== id);
    saveSubmissions(filtered);

    // Also remove from adilabad_rentals if applicable
    if (typeof window !== 'undefined') {
      try {
        const rawRentals = localStorage.getItem(RENTALS_KEY);
        if (rawRentals) {
          const rentalList = JSON.parse(rawRentals);
          const filteredRentals = rentalList.filter((r) => r.submission_id !== id);
          localStorage.setItem(RENTALS_KEY, JSON.stringify(filteredRentals));
        }
      } catch (e) {}
    }

    return { success: true, message: 'Submission deleted successfully.' };
  },

  /**
   * Bulk import submissions for any module
   */
  async bulkImportSubmissions({ module, records = [], duplicateStrategy = 'skip' }) {
    const items = getStoredSubmissions();
    const moduleLabelMap = {
      services: 'Service Listing',
      properties: 'Property Listing',
      jobs: 'Job Opening',
      'buy-sell': 'Buy & Sell',
      rentals: 'Equipment & Rental',
      offers: 'Offer & Discount',
      events: 'Local Event',
      businesses: 'Business Profile'
    };

    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    const newSubmissions = [];

    records.forEach((record, index) => {
      const data = record.data || record;
      const title = (data.title || '').trim();
      if (!title) return;

      const existingIndex = items.findIndex(
        (i) => i.module === module && i.title.toLowerCase().trim() === title.toLowerCase().trim()
      );

      if (existingIndex !== -1) {
        if (duplicateStrategy === 'skip') {
          skippedCount++;
          return;
        } else if (duplicateStrategy === 'update') {
          items[existingIndex] = {
            ...items[existingIndex],
            category: data.category || items[existingIndex].category,
            pricing: data.pricing || items[existingIndex].pricing,
            location: data.location || items[existingIndex].location,
            owner_name: data.owner_name || items[existingIndex].owner_name,
            owner_phone: data.owner_phone || items[existingIndex].owner_phone,
            description: data.description || items[existingIndex].description,
            image_url: data.image_url || items[existingIndex].image_url,
            status: data.status || items[existingIndex].status,
            specs: { ...items[existingIndex].specs, ...(data.specs || data) }
          };
          updatedCount++;
          return;
        }
      }

      // New submission
      const subId = `SUB-${Date.now().toString().slice(-6)}${index}`;
      const newSub = {
        id: subId,
        module,
        moduleLabel: moduleLabelMap[module] || 'Listing',
        title,
        category: data.category || 'General',
        pricing: data.pricing || (data.daily_rate ? `₹${data.daily_rate} / day` : 'Contact for Price'),
        daily_rate: data.daily_rate ? parseFloat(data.daily_rate) : undefined,
        security_deposit: data.security_deposit ? parseFloat(data.security_deposit) : 0,
        location: data.location || data.venue || 'Adilabad',
        owner_id: 1,
        owner_name: data.owner_name || data.organizer || 'Adilabad Service Hub',
        owner_phone: data.owner_phone || data.phone || '+91 98480 22334',
        status: data.status || 'PUBLISHED',
        submitted_at: new Date().toISOString(),
        image_url: data.image_url || data.cover_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
        description: data.description || title,
        specs: data.specs || data
      };

      newSubmissions.unshift(newSub);
      importedCount++;
    });

    const updatedList = [...newSubmissions, ...items];
    saveSubmissions(updatedList);

    // If rentals, also sync to adilabad_rentals
    if (module === 'rentals' && typeof window !== 'undefined') {
      try {
        const rawRentals = localStorage.getItem(RENTALS_KEY);
        const rentalList = rawRentals ? JSON.parse(rawRentals) : [];
        newSubmissions.forEach((s) => {
          rentalList.unshift({
            id: Date.now() + Math.random(),
            submission_id: s.id,
            title: s.title,
            slug: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
            category_name: s.category,
            daily_rate: s.daily_rate || 1000,
            security_deposit: s.security_deposit || 0,
            location: s.location,
            pickup_address: s.location,
            status: s.status,
            owner_name: s.owner_name,
            owner_phone: s.owner_phone,
            image_url: s.image_url,
            description: s.description
          });
        });
        localStorage.setItem(RENTALS_KEY, JSON.stringify(rentalList));
      } catch (e) {}
    }

    return {
      success: true,
      importedCount,
      updatedCount,
      skippedCount
    };
  },

  /**
   * Quick status counts for dashboard summaries
   */
  async getCounts() {
    const items = getStoredSubmissions();
    return {
      total: items.length,
      pending: items.filter((i) => i.status === 'PENDING_APPROVAL').length,
      published: items.filter((i) => i.status === 'PUBLISHED').length,
      changes_requested: items.filter((i) => i.status === 'CHANGES_REQUESTED').length,
      rejected: items.filter((i) => i.status === 'REJECTED').length
    };
  },

  /**
   * Reset to initial seed data with fresh pending items for testing
   */
  resetToInitialSeed() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      window.dispatchEvent(new Event('adilabad_submissions_updated'));
    }
    return INITIAL_SUBMISSIONS;
  }
};
