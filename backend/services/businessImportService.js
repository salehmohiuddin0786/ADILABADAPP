let xlsx;
try {
  xlsx = require('xlsx');
} catch (e) {
  xlsx = null;
}
const slugify = require('slugify');
const { query, pool } = require('../config/db');

// Supported columns and their alias variations
const COLUMN_ALIASES = {
  name: ['businessname', 'name', 'storename', 'shopname', 'firmname', 'company', 'title'],
  category: ['category', 'categoryname', 'categorytitle', 'type', 'industry'],
  subcategory: ['subcategory', 'subcat', 'sub_category', 'sub-category', 'secondarycategory'],
  phone: ['phonenumber', 'phone', 'mobile', 'mobilenumber', 'contact', 'contactnumber', 'tel'],
  alternate_phone: ['alternatephone', 'altphone', 'secondaryphone', 'otherphone', 'alternatecontact'],
  email: ['email', 'emailaddress', 'mail'],
  address: ['address', 'streetaddress', 'street', 'fulladdress', 'locationaddress'],
  locality: ['arealocality', 'area', 'locality', 'colony', 'neighborhood', 'zone'],
  city: ['city', 'town', 'village'],
  district: ['district'],
  state: ['state', 'province'],
  pincode: ['pincode', 'pin', 'postalcode', 'zip', 'zipcode'],
  latitude: ['latitude', 'lat'],
  longitude: ['longitude', 'long', 'lng'],
  maps_url: ['googlemapslink', 'googlemaps', 'mapslink', 'mapsurl', 'maplink', 'mapurl', 'googlemapsurl', 'locationlink'],
  website: ['website', 'websiteurl', 'web', 'url', 'site'],
  description: ['description', 'about', 'details', 'overview', 'summary', 'info'],
  logo_url: ['businessimageurl', 'businessimage', 'imageurl', 'image', 'logo', 'logourl', 'photo', 'coverimage', 'coverurl'],
  status: ['status', 'approvalstatus', 'isactive', 'active']
};

/**
 * Normalizes a header string for flexible matching
 */
function normalizeKey(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Match a raw column name to standard field
 */
function matchColumn(headerName) {
  const clean = normalizeKey(headerName);
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.includes(clean)) {
      return field;
    }
  }
  return null;
}

/**
 * Normalizes phone numbers to standard 10-digit or E.164 string
 */
function cleanPhone(val) {
  if (!val) return '';
  const digits = String(val).replace(/[^0-9]/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

/**
 * Normalizes string for duplicate detection comparison
 */
function normalizeForComparison(val) {
  return String(val || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Map raw row to standard business fields
 */
function mapRawRow(rawRow) {
  const mapped = {
    name: '',
    category: '',
    subcategory: '',
    phone: '',
    alternate_phone: '',
    email: '',
    address: '',
    locality: '',
    city: 'Adilabad',
    district: 'Adilabad',
    state: 'Telangana',
    pincode: '504001',
    latitude: null,
    longitude: null,
    maps_url: '',
    website: '',
    description: '',
    logo_url: '',
    status: 'approved'
  };

  for (const [key, value] of Object.entries(rawRow)) {
    const field = matchColumn(key);
    if (!field) continue;

    let val = value;
    if (typeof val === 'string') {
      val = val.trim();
    } else if (val !== null && val !== undefined) {
      val = String(val).trim();
    } else {
      val = '';
    }

    if (val === '' && (field === 'city' || field === 'district' || field === 'state' || field === 'pincode')) {
      continue; // keep defaults
    }

    mapped[field] = val;
  }

  return mapped;
}

/**
 * Extract lat/lng from a Google Maps URL if available
 */
function extractCoordsFromMapsUrl(url) {
  if (!url || typeof url !== 'string') return null;
  // Match @19.6641,78.5320
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }
  // Match q=19.6641,78.5320
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  }
  return null;
}

/**
 * Fetch system categories and locations for quick lookup
 */
async function getLookupData() {
  const categories = await query('SELECT id, name, slug FROM categories');
  const locations = await query('SELECT id, name, slug, pincode FROM locations');

  const categoryMap = new Map();
  for (const cat of categories) {
    categoryMap.set(normalizeKey(cat.name), cat);
    categoryMap.set(normalizeKey(cat.slug), cat);
  }

  // Common aliases
  const aliasMappings = {
    'retail': 'shopping',
    'retailshopping': 'shopping',
    'shoppingretail': 'shopping',
    'store': 'shopping',
    'restaurant': 'food-restaurants',
    'food': 'food-restaurants',
    'foodrestaurants': 'food-restaurants',
    'foodhospitality': 'food-restaurants',
    'hospitality': 'food-restaurants',
    'hotel': 'food-restaurants',
    'hospital': 'health',
    'healthcare': 'health',
    'doctor': 'health',
    'clinic': 'health',
    'medical': 'health',
    'school': 'education',
    'college': 'education',
    'coaching': 'education',
    'realestate': 'property',
    'realestateagent': 'property',
    'farm': 'agriculture',
    'agri': 'agriculture',
    'automobile': 'vehicles',
    'automotive': 'vehicles',
    'cars': 'vehicles',
    'bikes': 'vehicles',
    'commercial': 'business',
    'professionalservices': 'services',
    'professional': 'services',
    'service': 'services',
    'othercategories': 'other',
    'others': 'other'
  };

  for (const [alias, targetSlug] of Object.entries(aliasMappings)) {
    const target = categoryMap.get(normalizeKey(targetSlug));
    if (target && !categoryMap.has(alias)) {
      categoryMap.set(alias, target);
    }
  }

  const locationMap = new Map();
  for (const loc of locations) {
    locationMap.set(normalizeKey(loc.name), loc);
    locationMap.set(normalizeKey(loc.slug), loc);
  }

  return { categories, categoryMap, locations, locationMap };
}

/**
 * Fetch existing businesses for duplicate detection
 */
async function getExistingBusinesses() {
  return await query(`
    SELECT id, name, slug, phone, address
    FROM businesses
  `);
}

/**
 * Validate a mapped record
 */
function validateRecord(record, rowIndex, lookupData) {
  const errors = [];
  const { categoryMap, locationMap } = lookupData;

  // 1. Business Name (Required)
  if (!record.name || record.name.length < 2) {
    errors.push('Missing required field: Business Name (must be at least 2 characters).');
  } else if (record.name.length > 200) {
    errors.push('Business Name is too long (maximum 200 characters).');
  }

  // 2. Category (Required)
  let matchedCategory = null;
  if (!record.category) {
    errors.push('Missing required field: Category.');
  } else {
    const cleanCat = normalizeKey(record.category);
    matchedCategory = categoryMap.get(cleanCat);
    if (!matchedCategory) {
      errors.push(`Category "${record.category}" not found in system categories.`);
    }
  }

  // 3. Phone numbers (Optional, but validate if provided)
  const cleanedPhone = cleanPhone(record.phone);
  if (record.phone && (cleanedPhone.length < 7 || cleanedPhone.length > 15)) {
    errors.push(`Invalid Phone Number format: "${record.phone}". Expecting 10 digits.`);
  }

  const cleanedAltPhone = cleanPhone(record.alternate_phone);
  if (record.alternate_phone && (cleanedAltPhone.length < 7 || cleanedAltPhone.length > 15)) {
    errors.push(`Invalid Alternate Phone format: "${record.alternate_phone}".`);
  }

  // 4. Email (Optional)
  if (record.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(record.email)) {
      errors.push(`Invalid Email address format: "${record.email}".`);
    }
  }

  // 5. Pincode (Optional)
  let pincode = record.pincode ? String(record.pincode).trim() : '504001';
  if (pincode && !/^[0-9]{6}$/.test(pincode)) {
    pincode = '504001'; // auto-correct to Adilabad default rather than failing
  }

  // 6. Coordinates (Optional)
  let latitude = null;
  let longitude = null;

  if (record.latitude !== null && record.latitude !== '' && record.latitude !== undefined) {
    const latNum = parseFloat(record.latitude);
    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      errors.push(`Invalid Latitude: "${record.latitude}". Must be numeric between -90 and 90.`);
    } else {
      latitude = latNum;
    }
  }

  if (record.longitude !== null && record.longitude !== '' && record.longitude !== undefined) {
    const lngNum = parseFloat(record.longitude);
    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      errors.push(`Invalid Longitude: "${record.longitude}". Must be numeric between -180 and 180.`);
    } else {
      longitude = lngNum;
    }
  }

  // If coordinates missing, attempt to extract from maps URL
  if ((latitude === null || longitude === null) && record.maps_url) {
    const extracted = extractCoordsFromMapsUrl(record.maps_url);
    if (extracted) {
      latitude = latitude || extracted.lat;
      longitude = longitude || extracted.lng;
    }
  }

  // 7. Website URL (Optional)
  let website = record.website || '';
  if (website && !/^https?:\/\//i.test(website)) {
    website = `https://${website}`;
  }

  // 8. Locality matching to locations table
  let matchedLocation = null;
  if (record.locality) {
    matchedLocation = locationMap.get(normalizeKey(record.locality));
  }

  // 9. Status normalization
  let status = 'approved';
  const cleanStatus = String(record.status || '').toLowerCase().trim();
  if (['pending', 'rejected', 'suspended'].includes(cleanStatus)) {
    status = cleanStatus;
  } else if (cleanStatus === 'inactive' || cleanStatus === '0' || cleanStatus === 'false') {
    status = 'suspended';
  }

  // 10. Fallbacks for description & address
  const localityStr = record.locality || (matchedLocation ? matchedLocation.name : 'Adilabad');
  const cityStr = record.city || 'Adilabad';
  const districtStr = record.district || 'Adilabad';
  const stateStr = record.state || 'Telangana';

  const addressStr = record.address
    ? record.address.trim()
    : `${localityStr}, ${cityStr}, ${stateStr} - ${pincode}`;

  const descriptionStr = record.description
    ? record.description.trim()
    : `${record.name} is a verified business in ${localityStr}, ${cityStr}. Contact for products, local services, and inquiries.`;

  return {
    rowIndex,
    isValid: errors.length === 0,
    errors,
    data: {
      name: record.name ? record.name.trim() : '',
      category_id: matchedCategory ? matchedCategory.id : null,
      category_name: matchedCategory ? matchedCategory.name : record.category,
      subcategory: record.subcategory ? record.subcategory.trim() : null,
      location_id: matchedLocation ? matchedLocation.id : null,
      location_name: matchedLocation ? matchedLocation.name : localityStr,
      address: addressStr,
      locality: localityStr,
      city: cityStr,
      district: districtStr,
      state: stateStr,
      pincode: pincode,
      latitude: latitude,
      longitude: longitude,
      maps_url: record.maps_url || (latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : null),
      phone: cleanedPhone || null,
      alternate_phone: cleanedAltPhone || null,
      email: record.email ? record.email.trim() : null,
      website: website || null,
      description: descriptionStr,
      logo_url: record.logo_url || null,
      status: status,
      is_active: status === 'approved' ? 1 : 0
    }
  };
}

/**
 * Duplicate check against database records and in-file items
 */
function checkDuplicate(record, existingBusinesses, seenKeys) {
  const normName = normalizeForComparison(record.data.name);
  const cleanPhoneNum = record.data.phone ? cleanPhone(record.data.phone) : '';
  const normLocality = normalizeForComparison(record.data.locality || '');

  // 1. Check in-file duplicate
  const fileKeyPhone = cleanPhoneNum ? `phone_${cleanPhoneNum}` : null;
  const fileKeyNameLoc = `name_${normName}_loc_${normLocality}`;
  const fileKeyName = `name_${normName}`;

  if (fileKeyPhone && seenKeys.has(fileKeyPhone)) {
    return {
      isDuplicate: true,
      duplicateType: 'file',
      reason: `Duplicate row in this file: Phone number (${record.data.phone}) repeated.`
    };
  }

  if (seenKeys.has(fileKeyNameLoc)) {
    return {
      isDuplicate: true,
      duplicateType: 'file',
      reason: `Duplicate row in this file: Same business name in "${record.data.locality}".`
    };
  }

  // 2. Check against Database
  for (const eb of existingBusinesses) {
    const ebNormName = normalizeForComparison(eb.name);
    const ebPhone = cleanPhone(eb.phone);
    const ebAltPhone = cleanPhone(eb.alternate_phone);

    // Exact phone match (strongest signal)
    if (cleanPhoneNum && (cleanPhoneNum === ebPhone || cleanPhoneNum === ebAltPhone)) {
      return {
        isDuplicate: true,
        duplicateType: 'database',
        matchedId: eb.id,
        matchedName: eb.name,
        matchedPhone: eb.phone,
        reason: `Matches existing business "${eb.name}" (ID #${eb.id}) by phone number (${eb.phone}).`
      };
    }

    // Name match with same locality or exact normalized name
    if (normName === ebNormName) {
      return {
        isDuplicate: true,
        duplicateType: 'database',
        matchedId: eb.id,
        matchedName: eb.name,
        matchedPhone: eb.phone,
        reason: `Matches existing business "${eb.name}" (ID #${eb.id}) by business name.`
      };
    }
  }

  // Mark as seen in this file
  if (fileKeyPhone) seenKeys.add(fileKeyPhone);
  seenKeys.add(fileKeyNameLoc);
  seenKeys.add(fileKeyName);

  return { isDuplicate: false };
}

/**
 * Parse an Excel/CSV file buffer and generate full preview & validation
 */
async function parseAndPreview(fileBuffer, fileName) {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer', cellDates: true });
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('The uploaded Excel file contains no readable sheets.');
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawRows = xlsx.utils.sheet_to_json(sheet, { defval: '', raw: false });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('The uploaded file is empty. Please upload an Excel or CSV file with business records.');
  }

  const lookupData = await getLookupData();
  const existingBusinesses = await getExistingBusinesses();

  const previewRows = [];
  const seenKeys = new Set();

  let validCount = 0;
  let invalidCount = 0;
  let duplicateCount = 0;
  let missingRequiredCount = 0;

  for (let i = 0; i < rawRows.length; i++) {
    const rawRow = rawRows[i];
    const rowNum = i + 2; // Row number in Excel (header is row 1)
    const mapped = mapRawRow(rawRow);
    const validated = validateRecord(mapped, rowNum, lookupData);

    const missingRequired = !mapped.name || !mapped.category;
    if (missingRequired) {
      missingRequiredCount++;
    }

    if (!validated.isValid) {
      invalidCount++;
      previewRows.push({
        rowNumber: rowNum,
        status: 'invalid',
        errors: validated.errors,
        data: validated.data,
        raw: mapped
      });
      continue;
    }

    const dupCheck = checkDuplicate(validated, existingBusinesses, seenKeys);
    if (dupCheck.isDuplicate) {
      duplicateCount++;
      previewRows.push({
        rowNumber: rowNum,
        status: 'duplicate',
        errors: [],
        duplicateInfo: dupCheck,
        data: validated.data,
        raw: mapped
      });
    } else {
      validCount++;
      previewRows.push({
        rowNumber: rowNum,
        status: 'valid',
        errors: [],
        data: validated.data,
        raw: mapped
      });
    }
  }

  return {
    fileName,
    totalRecords: rawRows.length,
    validRecords: validCount,
    invalidRecords: invalidCount,
    duplicateRecords: duplicateCount,
    missingRequiredFields: missingRequiredCount,
    canImport: (validCount + duplicateCount) > 0,
    preview: previewRows
  };
}

/**
 * Generate a unique slug for a business
 */
async function generateUniqueSlug(name, connection) {
  let baseSlug = slugify(name, { lower: true, strict: true }) || 'business';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const [rows] = await connection.query('SELECT id FROM businesses WHERE slug = ? LIMIT 1', [slug]);
    if (rows.length === 0) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Execute bulk import into database with batching and transactions
 */
async function executeBulkImport({ records, duplicateStrategy = 'skip', fileName, user }) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('No records provided for import.');
  }

  const lookupData = await getLookupData();
  const existingBusinesses = await getExistingBusinesses();
  const seenKeys = new Set();

  let successfulRecords = 0;
  let updatedRecords = 0;
  let skippedRecords = 0;
  let failedRecords = 0;
  const failedDetails = [];

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const batchSize = 50;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      for (const item of batch) {
        try {
          const rawRow = item.raw || item.data || item;
          const mapped = mapRawRow(rawRow);
          const validated = validateRecord(mapped, item.rowNumber || (i + 1), lookupData);

          if (!validated.isValid) {
            failedRecords++;
            failedDetails.push({
              rowNumber: validated.rowIndex,
              businessName: mapped.name || 'Unknown',
              reason: validated.errors.join('; '),
              data: mapped
            });
            continue;
          }

          const dupCheck = checkDuplicate(validated, existingBusinesses, seenKeys);

          if (dupCheck.isDuplicate) {
            if (duplicateStrategy === 'skip') {
              skippedRecords++;
              continue;
            } else if (duplicateStrategy === 'update' && dupCheck.matchedId) {
              // Update matched existing business
              const bData = validated.data;
              await connection.query(
                `UPDATE businesses SET
                  name = COALESCE(?, name),
                  category_id = COALESCE(?, category_id),
                  location_id = COALESCE(?, location_id),
                  address = COALESCE(?, address),
                  phone = COALESCE(?, phone),
                  email = COALESCE(?, email),
                  website = COALESCE(?, website),
                  description = COALESCE(?, description),
                  logo_url = COALESCE(?, logo_url),
                  is_active = ?
                 WHERE id = ?`,
                [
                  bData.name,
                  bData.category_id,
                  bData.location_id,
                  [bData.address, bData.locality, bData.city, bData.district, bData.state, bData.pincode].filter(Boolean).join(', ') || null,
                  bData.phone,
                  bData.email,
                  bData.website,
                  bData.description,
                  bData.logo_url,
                  bData.is_active,
                  dupCheck.matchedId
                ]
              );
              updatedRecords++;
              continue;
            }
            // If duplicateStrategy === 'import_all', fall through to insert as new
          }

          // Insert new business
          const bData = validated.data;
          const slug = await generateUniqueSlug(bData.name, connection);
          const fullAddress = [bData.address, bData.locality, bData.city, bData.district, bData.state, bData.pincode].filter(Boolean).join(', ') || null;

          await connection.query(
            `INSERT INTO businesses (
              name, slug, category_id, location_id,
              address, phone, email, website,
              description, logo_url, rating, total_reviews,
              is_featured, is_active, display_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4.8, 0, 0, ?, 0)`,
            [
              bData.name,
              slug,
              bData.category_id,
              bData.location_id,
              fullAddress,
              bData.phone,
              bData.email,
              bData.website,
              bData.description,
              bData.logo_url,
              bData.is_active
            ]
          );

          successfulRecords++;
        } catch (itemErr) {
          console.error(`Row import error:`, itemErr);
          failedRecords++;
          failedDetails.push({
            rowNumber: item.rowNumber || 0,
            businessName: item.data?.name || item.raw?.name || 'Unknown',
            reason: itemErr.message || 'Database insert failed',
            data: item.raw || item.data || {}
          });
        }
      }
    }

    // Determine final status
    let importStatus = 'completed';
    if (failedRecords > 0 && (successfulRecords > 0 || updatedRecords > 0)) {
      importStatus = 'partial';
    } else if (failedRecords > 0 && successfulRecords === 0 && updatedRecords === 0) {
      importStatus = 'failed';
    }

    // Record into business_imports
    const [importResult] = await connection.query(
      `INSERT INTO business_imports (
        file_name, uploaded_by, uploader_name, total_records,
        successful_records, updated_records, skipped_records, failed_records,
        status, duplicate_strategy, failed_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fileName || 'bulk_import.xlsx',
        user?.id || null,
        user?.name || 'Administrator',
        records.length,
        successfulRecords,
        updatedRecords,
        skippedRecords,
        failedRecords,
        importStatus,
        duplicateStrategy,
        failedDetails.length > 0 ? JSON.stringify(failedDetails) : null
      ]
    );

    await connection.commit();

    return {
      importId: importResult.insertId,
      total: records.length,
      imported: successfulRecords,
      updated: updatedRecords,
      skipped: skippedRecords,
      failed: failedRecords,
      status: importStatus,
      failedRecords: failedDetails
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Generate sample Excel workbook buffer for download
 */
function generateSampleTemplate() {
  const headers = [
    'Business Name',
    'Category',
    'Subcategory',
    'Phone Number',
    'Alternate Phone',
    'Email',
    'Address',
    'Area / Locality',
    'City',
    'District',
    'State',
    'Pincode',
    'Latitude',
    'Longitude',
    'Google Maps Link',
    'Website',
    'Description',
    'Business Image URL',
    'Status'
  ];

  const sampleRows = [
    [
      'Tirumala Supermarket & Provisions',
      'Shopping',
      'Supermarket',
      '9440112345',
      '08732223344',
      'contact@tirumalasuper.com',
      'Beside Natraj Theater, Cinema Road',
      'Cinema Road',
      'Adilabad',
      'Adilabad',
      'Telangana',
      '504001',
      '19.66410000',
      '78.53200000',
      'https://maps.google.com/?q=19.6641,78.5320',
      'https://tirumalasupermarket.in',
      'Leading grocery, fresh produce, spices, and household essentials supermarket in Adilabad.',
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58',
      'approved'
    ],
    [
      'Sri Venkateshwara Multi-Speciality Clinic',
      'Health',
      'Medical Clinic',
      '9848055443',
      '',
      'info@srivenkateshwarahealth.com',
      'Collectorate Road, Near Shivaji Chowk',
      'Shivaji Chowk',
      'Adilabad',
      'Adilabad',
      'Telangana',
      '504001',
      '19.66720000',
      '78.53450000',
      'https://maps.google.com/?q=19.6672,78.5345',
      '',
      'Comprehensive healthcare, outpatient care, general physician, and diagnostic services in Adilabad.',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
      'approved'
    ],
    [
      'Royal Mughal Family Restaurant',
      'Food & Restaurants',
      'Biryani & Mughlai',
      '9989012345',
      '',
      '',
      'NH 44 Junction, Dasnapur Road',
      'Dasnapur',
      'Adilabad',
      'Adilabad',
      'Telangana',
      '504002',
      '19.65890000',
      '78.52980000',
      'https://maps.google.com/?q=19.6589,78.5298',
      '',
      'Authentic Hyderabadi dum biryani, family AC dining, tandoor starters, and Chinese delicacies.',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      'approved'
    ],
    [
      'Telangana Cotton Machinery & Agro Tools',
      'Agriculture',
      'Farm Machinery',
      '9849922110',
      '9849922111',
      'sales@telanganaagri.com',
      'Bela Road Industrial Area, Near Market Yard',
      'Bela Road',
      'Adilabad',
      'Adilabad',
      'Telangana',
      '504001',
      '19.67100000',
      '78.54120000',
      'https://maps.google.com/?q=19.6710,78.5412',
      'https://telanganaagri.com',
      'Quality cotton farming tools, micro-irrigation, fertilizer sprayers, and tractor attachments in Adilabad.',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0',
      'approved'
    ],
    [
      'Adilabad Modern Digital Academy',
      'Education',
      'Coaching Institute',
      '9440567890',
      '',
      'admissions@adilabaddigital.edu.in',
      'Opp. Government Degree College, Dwaraka Nagar',
      'Dwaraka Nagar',
      'Adilabad',
      'Adilabad',
      'Telangana',
      '504001',
      '19.66150000',
      '78.53600000',
      'https://maps.google.com/?q=19.6615,78.5360',
      'https://adilabaddigital.edu.in',
      'Computer applications, software development, web design, and competitive examination coaching center.',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
      'approved'
    ]
  ];

  const wsData = [headers, ...sampleRows];
  const ws = xlsx.utils.aoa_to_sheet(wsData);

  // Column width hints
  ws['!cols'] = [
    { wch: 35 }, // Business Name
    { wch: 20 }, // Category
    { wch: 22 }, // Subcategory
    { wch: 16 }, // Phone Number
    { wch: 16 }, // Alternate Phone
    { wch: 28 }, // Email
    { wch: 40 }, // Address
    { wch: 20 }, // Area / Locality
    { wch: 15 }, // City
    { wch: 15 }, // District
    { wch: 15 }, // State
    { wch: 12 }, // Pincode
    { wch: 14 }, // Latitude
    { wch: 14 }, // Longitude
    { wch: 35 }, // Google Maps Link
    { wch: 28 }, // Website
    { wch: 50 }, // Description
    { wch: 45 }, // Business Image URL
    { wch: 12 }  // Status
  ];

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Businesses');

  // Instructions sheet
  const instructionHeaders = ['Column', 'Required?', 'Description & Supported Values'];
  const instructionData = [
    ['Business Name', 'YES', 'Name of the shop, enterprise, clinic or establishment (2-200 characters).'],
    ['Category', 'YES', 'Must match one of Adilabad categories (e.g. Business, Shopping, Food & Restaurants, Health, Education, Agriculture, Services, Vehicles, Property, Other).'],
    ['Subcategory', 'NO', 'Specific sub-classification (e.g. Supermarket, Medical Clinic, Bakery, Farm Machinery).'],
    ['Phone Number', 'NO', 'Primary contact mobile or landline number (10 digits).'],
    ['Alternate Phone', 'NO', 'Secondary contact or WhatsApp number.'],
    ['Email', 'NO', 'Valid business email address.'],
    ['Address', 'NO', 'Full street address. Defaults to Adilabad if left blank.'],
    ['Area / Locality', 'NO', 'Locality in Adilabad (e.g. Shivaji Chowk, Cinema Road, Dwaraka Nagar, Gandhi Chowk, Mavala, Teachers Colony, Dasnapur, Bela Road).'],
    ['City', 'NO', 'Defaults to "Adilabad".'],
    ['District', 'NO', 'Defaults to "Adilabad".'],
    ['State', 'NO', 'Defaults to "Telangana".'],
    ['Pincode', 'NO', '6-digit postal code. Defaults to 504001.'],
    ['Latitude', 'NO', 'GPS latitude in decimal degrees (e.g. 19.6641).'],
    ['Longitude', 'NO', 'GPS longitude in decimal degrees (e.g. 78.5320).'],
    ['Google Maps Link', 'NO', 'Full Google Maps URL to direct visitors.'],
    ['Website', 'NO', 'Official website URL.'],
    ['Description', 'NO', 'Overview of products, services, and specialities.'],
    ['Business Image URL', 'NO', 'Direct image URL for storefront logo or banner.'],
    ['Status', 'NO', 'Options: approved (default), pending, rejected, suspended.']
  ];

  const wsInstructions = xlsx.utils.aoa_to_sheet([instructionHeaders, ...instructionData]);
  wsInstructions['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 75 }];
  xlsx.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generate Excel workbook containing failed records with reasons
 */
function generateFailedRecordsExcel(failedRecords) {
  const headers = [
    'Row',
    'Business Name',
    'Failure Reason',
    'Category',
    'Phone Number',
    'Alternate Phone',
    'Email',
    'Address',
    'Area / Locality',
    'City',
    'District',
    'Pincode',
    'Latitude',
    'Longitude',
    'Description'
  ];

  const rows = failedRecords.map(f => {
    const d = f.data || {};
    return [
      f.rowNumber || '',
      f.businessName || d.name || '',
      f.reason || 'Validation error',
      d.category || '',
      d.phone || '',
      d.alternate_phone || '',
      d.email || '',
      d.address || '',
      d.locality || '',
      d.city || 'Adilabad',
      d.district || 'Adilabad',
      d.pincode || '504001',
      d.latitude || '',
      d.longitude || '',
      d.description || ''
    ];
  });

  const ws = xlsx.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = [
    { wch: 8 },
    { wch: 30 },
    { wch: 45 },
    { wch: 20 },
    { wch: 16 },
    { wch: 16 },
    { wch: 25 },
    { wch: 35 },
    { wch: 20 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 40 }
  ];

  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Failed Records');

  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = {
  COLUMN_ALIASES,
  normalizeKey,
  mapRawRow,
  validateRecord,
  checkDuplicate,
  parseAndPreview,
  executeBulkImport,
  generateSampleTemplate,
  generateFailedRecordsExcel
};
