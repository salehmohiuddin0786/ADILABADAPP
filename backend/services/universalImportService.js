let XLSX;
try {
  XLSX = require('xlsx');
} catch (e) {
  XLSX = null;
}
const { query } = require('../config/db');

/**
 * Universal Module Import Service
 * Supports: services, properties, jobs, buy-sell, rentals, offers, events
 */

const MODULE_DEFINITIONS = {
  services: {
    label: 'Services Directory',
    requiredFields: ['title', 'category'],
    headerAliases: {
      title: ['service title', 'title', 'service name', 'name', 'service'],
      category: ['category', 'service category', 'type'],
      pricing: ['pricing', 'price', 'fee', 'inspection fee', 'cost', 'service fee', 'rate'],
      location: ['location', 'area', 'locality', 'address', 'city'],
      owner_name: ['owner name', 'provider name', 'technician name', 'contact person', 'name of provider', 'business name'],
      owner_phone: ['phone number', 'phone', 'contact number', 'mobile', 'mobile number', 'contact'],
      alternate_phone: ['alternate phone', 'alt phone', 'secondary phone', 'whatsapp number'],
      experience: ['experience', 'experience years', 'years of experience'],
      description: ['description', 'details', 'about', 'service details'],
      image_url: ['image url', 'image', 'photo', 'photo url'],
      emergency_service: ['emergency service', '24x7 service', 'emergency'],
      status: ['status']
    },
    sampleData: [
      {
        'Service Title': 'Expert Submersible Motor Rewinding & Borewell Service',
        'Category': 'Electrical & Plumbing',
        'Pricing': '₹450 Visit Fee',
        'Location': 'Gandhi Chowk, Adilabad',
        'Provider Name': 'Sri Balaji Electrical Works',
        'Phone Number': '9848022331',
        'Alternate Phone': '9440122332',
        'Experience Years': '12+ Years',
        'Emergency Service': 'Yes',
        'Description': 'Fast on-site single and three-phase motor rewinding, starter panel diagnostics, and 24/7 agricultural pump emergency repairs.',
        'Image URL': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Service Title': 'High-Definition CCTV & Biometric Security Setup',
        'Category': 'Security & Surveillance',
        'Pricing': '₹599 Installation Charge',
        'Location': 'Cinema Road, Adilabad',
        'Provider Name': 'Smart Tech Security Systems',
        'Phone Number': '9440188990',
        'Alternate Phone': '9848877665',
        'Experience Years': '8+ Years',
        'Emergency Service': 'No',
        'Description': 'Commercial and domestic 4K IP camera installation with remote smartphone live monitoring and biometric attendance.',
        'Image URL': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Service Title': 'Adilabad Water Tank Cleaning & UV Disinfection',
        'Category': 'Cleaning & Sanitation',
        'Pricing': '₹799 Per 1,000L Tank',
        'Location': 'Housing Board Colony, Adilabad',
        'Provider Name': 'Swachh Home Services',
        'Phone Number': '9849211223',
        'Alternate Phone': '',
        'Experience Years': '5+ Years',
        'Emergency Service': 'Yes',
        'Description': '6-stage mechanized cleaning process: de-sludging, high-pressure scrubbing, vacuuming, antibacterial spray and UV sanitization.',
        'Image URL': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Service Title': 'Domestic & Commercial AC Servicing & Gas Charging',
        'Category': 'Appliance Repair',
        'Pricing': '₹399 Deep Clean Service',
        'Location': 'Bus Stand Road, Adilabad',
        'Provider Name': 'Cool Care Refrigeration & AC',
        'Phone Number': '9848033445',
        'Alternate Phone': '',
        'Experience Years': '10+ Years',
        'Emergency Service': 'Yes',
        'Description': 'Jet pump deep foam cleaning, PCB motherboard repair, refrigerant gas top-up, and split AC relocation with warranty.',
        'Image URL': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Service Title': 'Professional Interior & Exterior House Painting',
        'Category': 'Home Improvement',
        'Pricing': '₹12 / Sq.Ft (Labor + Material)',
        'Location': 'Shantinagar, Adilabad',
        'Provider Name': 'Telangana Royal Painters',
        'Phone Number': '9440566778',
        'Alternate Phone': '',
        'Experience Years': '15+ Years',
        'Emergency Service': 'No',
        'Description': 'Waterproofing texture coatings, Asian Paints Royale luxury finishes, and airless spray painting for villas and commercial complexes.',
        'Image URL': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
        'Status': 'PUBLISHED'
      }
    ]
  },

  properties: {
    label: 'Property Listings',
    requiredFields: ['title', 'category'],
    headerAliases: {
      title: ['property title', 'title', 'name', 'listing title'],
      category: ['property type', 'category', 'type', 'property category'],
      pricing: ['price', 'pricing', 'rent', 'cost', 'expected price', 'sale price'],
      location: ['location', 'address', 'locality', 'area', 'colony'],
      area_sqft: ['area', 'area sqft', 'sqft', 'plot size', 'land area', 'acres'],
      owner_name: ['owner name', 'seller name', 'agent name', 'builder name', 'contact person'],
      owner_phone: ['phone number', 'phone', 'contact number', 'mobile'],
      alternate_phone: ['alternate phone', 'alt phone'],
      description: ['description', 'property description', 'details', 'features'],
      image_url: ['image url', 'image', 'photo'],
      status: ['status']
    },
    sampleData: [
      {
        'Property Title': 'Prime 2,400 Sq.Ft Commercial Showroom on Main Road',
        'Property Type': 'Commercial Showroom',
        'Price': '₹65,000 / month',
        'Location': 'Cinema Road, Opp. Municipal Complex, Adilabad',
        'Area (Sq.Ft / Acres)': '2400 Sq.Ft',
        'Owner Name': 'Adilabad Prime Properties',
        'Phone Number': '9848022334',
        'Description': 'Corner-facing 40ft wide frontage, three-phase commercial electricity, 12 car parking slots, suitable for banks or brand showrooms.',
        'Image URL': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Property Title': 'Independent 3BHK Luxury Duplex Villa with Garden',
        'Property Type': 'Residential Villa',
        'Price': '₹85,00,000',
        'Location': 'Kranthi Nagar, Adilabad',
        'Area (Sq.Ft / Acres)': '2100 Sq.Ft',
        'Owner Name': 'K. Venkat Rao',
        'Phone Number': '9440122334',
        'Description': '100% Vastu compliant, private borewell water supply, modular teak kitchen, automated gate, and covered double car parking.',
        'Image URL': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Property Title': 'Fertile 5-Acre Agricultural Black Soil Land on Utnoor Highway',
        'Property Type': 'Agricultural Land',
        'Price': '₹22,00,000 / Acre',
        'Location': 'Utnoor Road, Adilabad Rural',
        'Area (Sq.Ft / Acres)': '5 Acres',
        'Owner Name': 'Telangana Agri Lands',
        'Phone Number': '9849211223',
        'Description': 'Crystal clear title, dual operational high-yield borewells, solar perimeter fencing, and 30ft road approach.',
        'Image URL': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        'Status': 'PUBLISHED'
      }
    ]
  },

  jobs: {
    label: 'Job Vacancies',
    requiredFields: ['title', 'category'],
    headerAliases: {
      title: ['job title', 'title', 'role', 'position', 'designation'],
      category: ['category', 'industry', 'job category', 'department'],
      pricing: ['salary', 'compensation', 'pay', 'pricing', 'salary range'],
      location: ['location', 'work location', 'city', 'job location'],
      owner_name: ['company name', 'employer name', 'company', 'organization', 'owner name'],
      owner_phone: ['contact phone', 'phone number', 'hr phone', 'phone', 'mobile'],
      experience_required: ['experience required', 'experience', 'minimum experience'],
      job_type: ['job type', 'employment type', 'work type'],
      vacancies: ['vacancies', 'number of vacancies', 'openings'],
      description: ['job description', 'description', 'requirements', 'responsibilities'],
      status: ['status']
    },
    sampleData: [
      {
        'Job Title': 'Senior Accountant & Tally Prime Specialist',
        'Category': 'Accounting & Finance',
        'Salary': '₹25,000 - ₹32,000 / month',
        'Location': 'Gandhi Chowk, Adilabad',
        'Company Name': 'Adilabad Cotton Heritage Group',
        'Contact Phone': '9848022334',
        'Experience Required': '3+ Years',
        'Job Type': 'Full-time',
        'Number of Vacancies': '2',
        'Job Description': 'Manage day-to-day accounts, GSTR-1, GSTR-3B filings, e-Way bills, bank reconciliations and audited ledger management.',
        'Status': 'PUBLISHED'
      },
      {
        'Job Title': 'Field Sales Executive – FMCG & Agro Products',
        'Category': 'Sales & Marketing',
        'Salary': '₹18,000 + Daily Allowances & Incentives',
        'Location': 'Bus Stand Road, Adilabad',
        'Company Name': 'Sri Lakshmi Distributors',
        'Contact Phone': '9440188990',
        'Experience Required': '1+ Years',
        'Job Type': 'Full-time',
        'Number of Vacancies': '4',
        'Job Description': 'Retail dealer visits across Adilabad, Utnoor, and Boath. Two-wheeler driving license mandatory.',
        'Status': 'PUBLISHED'
      },
      {
        'Job Title': 'Staff Nurse (GNM / B.Sc Nursing)',
        'Category': 'Healthcare & Hospital',
        'Salary': '₹20,000 - ₹28,000 / month',
        'Location': 'Collectorate Road, Adilabad',
        'Company Name': 'Adilabad Multispeciality Hospital',
        'Contact Phone': '9849211223',
        'Experience Required': 'Fresher to 2 Years',
        'Job Type': 'Full-time',
        'Number of Vacancies': '5',
        'Job Description': 'Inpatient ward care, ICU monitoring, medication administration and patient vitals documentation. Shifts rotation.',
        'Status': 'PUBLISHED'
      }
    ]
  },

  'buy-sell': {
    label: 'Pre-Owned Buy & Sell',
    requiredFields: ['title', 'category'],
    headerAliases: {
      title: ['item title', 'title', 'product name', 'item name'],
      category: ['category', 'item category', 'type'],
      pricing: ['price', 'pricing', 'asking price', 'amount'],
      location: ['location', 'area', 'locality', 'address'],
      owner_name: ['seller name', 'owner name', 'seller'],
      owner_phone: ['phone number', 'phone', 'contact number', 'mobile'],
      condition: ['condition', 'item condition', 'state'],
      description: ['description', 'details', 'item details'],
      image_url: ['image url', 'image', 'photo'],
      status: ['status']
    },
    sampleData: [
      {
        'Item Title': 'Pre-Owned Massey Ferguson 241 DI Tractor (2022 Model)',
        'Category': 'Agricultural Machinery',
        'Price': '₹4,85,000 (Negotiable)',
        'Location': 'Utnoor Road, Adilabad',
        'Seller Name': 'Sardar Balwinder Singh',
        'Phone Number': '9849211223',
        'Condition': 'Like New',
        'Description': 'Only 840 hours run, brand new rear MRF tyres, insurance valid until Oct 2027. RC and NOC ready for transfer.',
        'Image URL': 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Item Title': 'Apple iPhone 14 Pro Max 256GB Deep Purple',
        'Category': 'Smartphones & Gadgets',
        'Price': '₹68,500',
        'Location': 'Cinema Road, Adilabad',
        'Seller Name': 'Adilabad Mobile Zone',
        'Phone Number': '9440123456',
        'Condition': 'Like New',
        'Description': '94% battery health, original bill, box and fast charging cable included. Tempered glass pre-installed.',
        'Image URL': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Item Title': 'Hero Splendor Plus BS6 (2023 Single Hand Owner)',
        'Category': 'Bikes & Scooters',
        'Price': '₹54,000',
        'Location': 'Housing Board Colony, Adilabad',
        'Seller Name': 'R. Rajesh',
        'Phone Number': '9848022334',
        'Condition': 'Good',
        'Description': '11,200 km driven, 65+ kmpl mileage, showroom service history with zero accidental claims.',
        'Image URL': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
        'Status': 'PUBLISHED'
      }
    ]
  },

  rentals: {
    label: 'Equipment & Rental',
    requiredFields: ['title', 'category'],
    headerAliases: {
      title: ['rental item title', 'equipment name', 'title', 'name', 'item title'],
      category: ['category', 'equipment category', 'type'],
      daily_rate: ['daily rate', 'price / day', 'per day rate', 'rent per day', 'daily rent'],
      security_deposit: ['security deposit', 'deposit', 'refundable deposit'],
      pricing: ['pricing', 'rate', 'price'],
      location: ['location', 'pickup address', 'area', 'locality'],
      owner_name: ['owner name', 'vendor name', 'company name'],
      owner_phone: ['phone number', 'phone', 'contact number', 'mobile'],
      condition: ['condition', 'equipment condition'],
      description: ['description', 'specifications', 'details'],
      image_url: ['image url', 'image', 'photo'],
      status: ['status']
    },
    sampleData: [
      {
        'Equipment Name': 'Sony Alpha A7 IV 4K Cinema Kit + 24-70mm GM Lens',
        'Category': 'Electronics & Cameras',
        'Daily Rate': '1500',
        'Security Deposit': '5000',
        'Location': 'Cinema Road, Opp. Geeta Theatre, Adilabad',
        'Owner Name': 'Adilabad Media Works',
        'Phone Number': '9848022334',
        'Condition': 'Like New',
        'Description': 'Professional 33MP full-frame 4K camera with 2 high-speed 128GB V90 cards, 3 original batteries, and dual charger.',
        'Image URL': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Equipment Name': 'John Deere 5050D 50HP Tractor with Cultivator',
        'Category': 'Agricultural Equipment',
        'Daily Rate': '3200',
        'Security Deposit': '8000',
        'Location': 'Utnoor Road, Adilabad',
        'Owner Name': 'Telangana Agri Hub',
        'Phone Number': '9440192834',
        'Condition': 'Good',
        'Description': '50HP heavy farm tractor equipped with hydraulic cultivator and trolley hook for cotton and soya farming.',
        'Image URL': 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Equipment Name': 'JBL VRX Line Array Concert Sound System (4 Tops + 2 Subs)',
        'Category': 'Event Sound & Stage Gear',
        'Daily Rate': '7500',
        'Security Deposit': '12000',
        'Location': 'Bus Stand Road, Adilabad',
        'Owner Name': 'Adilabad DJ Sound & Gear',
        'Phone Number': '9848844556',
        'Condition': 'Excellent',
        'Description': 'Concert grade dual line array tops, Crown digital amplifiers, wireless Shure microphones and 16-channel digital mixer.',
        'Image URL': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
        'Status': 'PUBLISHED'
      }
    ]
  },

  offers: {
    label: 'Offers & Discounts',
    requiredFields: ['title', 'category'],
    headerAliases: {
      title: ['offer title', 'title', 'deal name', 'discount title'],
      category: ['category', 'offer category', 'type'],
      pricing: ['discount details', 'discount', 'pricing', 'offer price', 'deal'],
      coupon_code: ['coupon code', 'promo code', 'voucher code', 'code'],
      location: ['location', 'store location', 'area', 'locality'],
      owner_name: ['store name', 'business name', 'merchant name', 'owner name'],
      owner_phone: ['phone number', 'contact phone', 'phone'],
      valid_until: ['valid until', 'expiry date', 'valid through', 'end date'],
      description: ['description', 'terms', 'offer details'],
      image_url: ['image url', 'image', 'banner url'],
      status: ['status']
    },
    sampleData: [
      {
        'Offer Title': 'Flat 25% Off on All Pure Adilabad Cotton Sarees & Kurtas',
        'Category': 'Festive Deals & Fashion',
        'Discount Details': 'Flat 25% Off Storewide',
        'Coupon Code': 'ADBCOTTON25',
        'Location': 'Gandhi Chowk, Adilabad',
        'Store Name': 'Adilabad Cotton Heritage',
        'Phone Number': '9848022334',
        'Valid Until': '2026-12-31',
        'Description': 'Present this digital voucher at checkout to claim 25% discount on authentic GI tagged handloom sarees.',
        'Image URL': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
        'Status': 'PUBLISHED'
      },
      {
        'Offer Title': 'Zero Making Charges on Bridal Diamond & Platinum Jewellery',
        'Category': 'Jewellery & Luxury',
        'Discount Details': '100% Off Making Charges',
        'Coupon Code': 'BRIDAL2026',
        'Location': 'Main Road, Adilabad',
        'Store Name': 'Sri Krishna Jewellers',
        'Phone Number': '9440122331',
        'Valid Until': '2026-12-15',
        'Description': 'Exclusive wedding season privilege offer on 100% IGI certified hallmarked jewellery with guaranteed buyback.',
        'Image URL': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
        'Status': 'PUBLISHED'
      }
    ]
  },

  events: {
    label: 'Events & Expos',
    requiredFields: ['title', 'venue', 'event_date'],
    headerAliases: {
      title: ['event title', 'title', 'event name', 'name'],
      venue: ['venue', 'location', 'place', 'auditorium'],
      event_date: ['date', 'event date', 'start date'],
      event_time: ['time', 'event time', 'timings'],
      organizer: ['organizer', 'organizer name', 'hosted by'],
      phone: ['phone', 'contact phone', 'phone number', 'mobile'],
      address: ['address', 'full address', 'venue address'],
      description: ['description', 'event description', 'details'],
      cover_url: ['cover url', 'image url', 'banner url', 'cover'],
      registration_url: ['registration url', 'website', 'link'],
      status: ['status']
    },
    sampleData: [
      {
        'Event Title': 'Adilabad District Agri Expo & Kisan Mela 2026',
        'Venue': 'Indira Priyadarshini Stadium Ground',
        'Event Date': '2026-12-10',
        'Event Time': '09:00 AM - 06:00 PM',
        'Organizer': 'Adilabad District Agriculture Department',
        'Phone': '9848033445',
        'Address': 'Stadium Road, Near District Collectorate, Adilabad',
        'Description': 'Three-day agriculture machinery exhibition, certified seed stalls, organic cotton farming seminars and government subsidy desk.',
        'Cover URL': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        'Registration URL': 'https://adilabad.telangana.gov.in/events/agri-expo-2026',
        'Status': 'published'
      },
      {
        'Event Title': 'Telangana Tribal Folk Dance & Dhokra Art Festival',
        'Venue': 'Kala Ashram Cultural Amphitheatre',
        'Event Date': '2026-12-18',
        'Event Time': '05:30 PM - 10:00 PM',
        'Organizer': 'Telangana Department of Language & Culture',
        'Phone': '9440188990',
        'Address': 'Kala Ashram, Near Bellampalli Road Crossing, Adilabad',
        'Description': 'Live Gusadi dance troupes, traditional Gond art gallery, live Dhokra brass bell casting demonstrations and food court.',
        'Cover URL': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        'Registration URL': 'https://telanganaculture.gov.in',
        'Status': 'published'
      }
    ]
  }
};

/**
 * Normalizes phone numbers
 */
function normalizePhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits;
}

/**
 * Flexible header matching
 */
function matchHeaderToField(headerName, headerAliases) {
  if (!headerName) return null;
  const cleanHeader = String(headerName).trim().toLowerCase().replace(/[_-]/g, ' ');

  for (const [canonicalField, aliases] of Object.entries(headerAliases)) {
    if (canonicalField.toLowerCase() === cleanHeader) return canonicalField;
    for (const alias of aliases) {
      if (alias.toLowerCase() === cleanHeader) return canonicalField;
    }
  }
  return null;
}

/**
 * Parse uploaded buffer (XLSX, XLS, CSV) into raw rows
 */
function parseFileBuffer(buffer, originalname = '') {
  let workbook;
  const ext = (originalname.split('.').pop() || '').toLowerCase();

  if (ext === 'csv') {
    const csvContent = buffer.toString('utf-8');
    workbook = XLSX.read(csvContent, { type: 'string', raw: false });
  } else {
    workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true, cellNF: false, cellText: true });
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error('Uploaded file does not contain any sheets.');

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  return rawRows;
}

/**
 * Validate and map parsed rows for a given module
 */
function mapAndValidateRows(moduleKey, rawRows) {
  const modDef = MODULE_DEFINITIONS[moduleKey];
  if (!modDef) {
    throw new Error(`Unsupported module: ${moduleKey}`);
  }

  if (!rawRows || rawRows.length === 0) {
    return {
      headers: [],
      mappedRows: [],
      metrics: { total: 0, valid: 0, invalid: 0, duplicates: 0, missingRequired: 0 }
    };
  }

  // 1. Map headers
  const firstRow = rawRows[0];
  const rawHeaders = Object.keys(firstRow);
  const headerMap = {}; // rawHeader -> canonicalField

  rawHeaders.forEach((h) => {
    const matched = matchHeaderToField(h, modDef.headerAliases);
    if (matched) {
      headerMap[h] = matched;
    }
  });

  const mappedRows = [];
  let validCount = 0;
  let invalidCount = 0;
  let missingRequiredCount = 0;
  let duplicateCount = 0;

  const seenInFile = new Set();

  rawRows.forEach((row, idx) => {
    const rowNum = idx + 2; // Excel row numbering
    const mapped = {};

    Object.keys(row).forEach((k) => {
      const canonical = headerMap[k];
      if (canonical) {
        let val = row[k];
        if (typeof val === 'string') val = val.trim();
        mapped[canonical] = val;
      }
    });

    const errors = [];
    const warnings = [];

    // Check required fields
    modDef.requiredFields.forEach((rf) => {
      if (!mapped[rf] || String(mapped[rf]).trim() === '') {
        errors.push(`Missing required field: ${rf}`);
      }
    });

    if (errors.length > 0) {
      missingRequiredCount++;
    }

    // Phone validation
    const phoneVal = mapped.phone || mapped.owner_phone;
    if (phoneVal) {
      const cleanPhone = normalizePhone(phoneVal);
      if (cleanPhone.length > 0 && cleanPhone.length < 10) {
        warnings.push(`Phone number might be incomplete (${phoneVal})`);
      }
    }

    // Status default
    if (!mapped.status) {
      mapped.status = 'PUBLISHED';
    }

    // Pricing / Daily Rate normalization
    if (moduleKey === 'rentals') {
      if (mapped.daily_rate && !mapped.pricing) {
        mapped.pricing = `₹${mapped.daily_rate} / day`;
      }
    }

    // In-file duplicate check
    const dedupKey = [
      (mapped.title || '').toLowerCase().trim(),
      normalizePhone(mapped.phone || mapped.owner_phone || ''),
      (mapped.location || mapped.venue || '').toLowerCase().trim()
    ].filter(Boolean).join('|');

    let isDuplicate = false;
    if (dedupKey && seenInFile.has(dedupKey)) {
      isDuplicate = true;
      duplicateCount++;
      warnings.push('Duplicate entry detected in file');
    } else if (dedupKey) {
      seenInFile.add(dedupKey);
    }

    const isValid = errors.length === 0;
    if (isValid && !isDuplicate) {
      validCount++;
    } else if (!isValid) {
      invalidCount++;
    }

    mappedRows.push({
      rowNumber: rowNum,
      raw: row,
      data: mapped,
      errors,
      warnings,
      isDuplicate,
      status: !isValid ? 'invalid' : (isDuplicate ? 'duplicate' : 'valid')
    });
  });

  return {
    headers: rawHeaders,
    mappedRows,
    metrics: {
      total: rawRows.length,
      valid: validCount,
      invalid: invalidCount,
      duplicates: duplicateCount,
      missingRequired: missingRequiredCount
    }
  };
}

/**
 * Generate sample Excel template
 */
function generateSampleTemplate(moduleKey) {
  const modDef = MODULE_DEFINITIONS[moduleKey];
  if (!modDef) {
    throw new Error(`Unsupported module: ${moduleKey}`);
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(modDef.sampleData);

  // Set column widths
  const colWidths = Object.keys(modDef.sampleData[0] || {}).map((col) => {
    return { wch: Math.max(col.length + 5, 20) };
  });
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, `${modDef.label.slice(0, 28)} Template`);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generate Failed Records Excel buffer
 */
function generateFailedRecordsExcel(moduleKey, failedRecords) {
  const wb = XLSX.utils.book_new();
  const rows = failedRecords.map((item) => {
    const raw = item.raw || item.data || {};
    return {
      'Excel Row': item.rowNumber || 'N/A',
      'Reason For Failure': Array.isArray(item.errors) ? item.errors.join('; ') : (item.error || 'Validation Error'),
      ...raw
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 12 }, { wch: 45 }, { wch: 25 }, { wch: 20 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Failed Records');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Record import history into MySQL bulk_imports table
 */
async function recordImportHistory({
  module,
  fileName,
  uploadedBy = 1,
  uploaderName = 'Admin',
  totalRecords,
  successfulRecords,
  updatedRecords = 0,
  skippedRecords = 0,
  failedRecords = 0,
  status = 'completed',
  duplicateStrategy = 'skip',
  failedData = null
}) {
  try {
    const sql = `
      INSERT INTO bulk_imports 
      (module, file_name, uploaded_by, uploader_name, total_records, successful_records, updated_records, skipped_records, failed_records, status, duplicate_strategy, failed_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const res = await query(sql, [
      module,
      fileName,
      uploadedBy,
      uploaderName,
      totalRecords,
      successfulRecords,
      updatedRecords,
      skippedRecords,
      failedRecords,
      status,
      duplicateStrategy,
      failedData ? JSON.stringify(failedData) : null
    ]);
    return { success: true, id: res.insertId };
  } catch (err) {
    console.error('Error saving to bulk_imports:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get import history from MySQL bulk_imports table
 */
async function getImportHistory(moduleKey) {
  try {
    const sql = `
      SELECT id, module, file_name, uploader_name, total_records, successful_records, updated_records, skipped_records, failed_records, status, duplicate_strategy, created_at
      FROM bulk_imports
      WHERE module = ?
      ORDER BY created_at DESC
      LIMIT 50
    `;
    const rows = await query(sql, [moduleKey]);
    return rows;
  } catch (err) {
    console.error('Error fetching bulk_imports history:', err);
    return [];
  }
}

/**
 * Execute events import directly into MySQL events table
 */
async function executeEventsImport(records, duplicateStrategy = 'skip') {
  let successCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const failedList = [];
  const imported = [];

  for (const item of records) {
    const data = item.data || item;
    try {
      if (!data.title || !data.venue || !data.event_date) {
        failedCount++;
        failedList.push({ ...item, errors: ['Title, Venue and Event Date are required.'] });
        continue;
      }

      // Check existing event by title
      const existing = await query('SELECT id, title, slug FROM events WHERE title = ? LIMIT 1', [data.title.trim()]);

      if (existing && existing.length > 0) {
        if (duplicateStrategy === 'skip') {
          skippedCount++;
          continue;
        } else if (duplicateStrategy === 'update') {
          const evId = existing[0].id;
          await query(
            `UPDATE events SET
              description = COALESCE(?, description),
              event_date = COALESCE(?, event_date),
              event_time = COALESCE(?, event_time),
              venue = COALESCE(?, venue),
              address = COALESCE(?, address),
              organizer = COALESCE(?, organizer),
              phone = COALESCE(?, phone),
              cover_url = COALESCE(?, cover_url),
              registration_url = COALESCE(?, registration_url),
              status = COALESCE(?, status)
             WHERE id = ?`,
            [
              data.description || null,
              data.event_date || null,
              data.event_time || null,
              data.venue || null,
              data.address || data.venue || null,
              data.organizer || null,
              data.phone || null,
              data.cover_url || null,
              data.registration_url || null,
              data.status || 'published',
              evId
            ]
          );
          updatedCount++;
          imported.push({ id: evId, title: data.title, action: 'updated' });
          continue;
        }
      }

      // Insert new event
      const slugBase = (data.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const uniqueSlug = `${slugBase}-${Date.now().toString().slice(-4)}`;

      const res = await query(
        `INSERT INTO events 
         (title, slug, description, cover_url, event_date, event_time, venue, address, organizer, phone, registration_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.title.trim(),
          uniqueSlug,
          data.description || data.title,
          data.cover_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
          data.event_date,
          data.event_time || '10:00 AM',
          data.venue,
          data.address || data.venue,
          data.organizer || 'Adilabad Event Host',
          data.phone || null,
          data.registration_url || null,
          data.status || 'published'
        ]
      );

      successCount++;
      imported.push({ id: res.insertId, title: data.title, action: 'created' });
    } catch (err) {
      failedCount++;
      failedList.push({ ...item, errors: [err.message] });
    }
  }

  return {
    totalProcessed: records.length,
    successCount,
    updatedCount,
    skippedCount,
    failedCount,
    failedRecords: failedList,
    imported
  };
}

module.exports = {
  MODULE_DEFINITIONS,
  normalizePhone,
  parseFileBuffer,
  mapAndValidateRows,
  generateSampleTemplate,
  generateFailedRecordsExcel,
  recordImportHistory,
  getImportHistory,
  executeEventsImport
};
