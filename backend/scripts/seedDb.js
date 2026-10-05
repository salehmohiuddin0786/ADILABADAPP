const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function seedDatabase() {
  console.log('🌱 Starting database seed for Adilabad App...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'adilabad_app',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    multipleStatements: true
  });

  try {
    // 1. Roles
    await connection.query(`
      INSERT INTO roles (id, name, description) VALUES
      (1, 'admin', 'System Administrator with full management permissions'),
      (2, 'user', 'Registered visitor with browsing and favorites permissions')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);

    // 2. Users (Admin + User)
    const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
    const userPasswordHash = await bcrypt.hash('User@123456', 10);

    await connection.query(`
      INSERT INTO users (id, role_id, name, email, phone, password_hash, avatar_url, is_active) VALUES
      (1, 1, 'Adilabad Admin', 'admin@adilabadapp.com', '+91 94401 12345', ?, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 1),
      (2, 2, 'Ramesh Kumar', 'user@adilabadapp.com', '+91 98480 54321', ?, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 1)
      ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash);
    `, [adminPasswordHash, userPasswordHash]);

    // 3. Categories (All required categories)
    const categories = [
      { id: 1, name: 'Business', slug: 'business', icon: 'Briefcase', description: 'Local commercial enterprises, trading hubs, offices, and services in Adilabad.', order: 1 },
      { id: 2, name: 'Property', slug: 'property', icon: 'Home', description: 'Houses, flats, plots, commercial shops, and land for sale or rent in Adilabad.', order: 2 },
      { id: 3, name: 'Vehicles', slug: 'vehicles', icon: 'Car', description: 'Cars, bikes, tractors, commercial vehicles, and auto accessories in Adilabad.', order: 3 },
      { id: 4, name: 'Jobs', slug: 'jobs', icon: 'UserCheck', description: 'Local job vacancies, accountant openings, sales, drivers, and technical jobs.', order: 4 },
      { id: 5, name: 'Electronics', slug: 'electronics', icon: 'Tv', description: 'Smartphones, LED TVs, home appliances, computers, and repairs in Adilabad.', order: 5 },
      { id: 6, name: 'Shopping', slug: 'shopping', icon: 'ShoppingBag', description: 'Clothing, handlooms, textiles, footwear, jewellery, and general stores.', order: 6 },
      { id: 7, name: 'Food & Restaurants', slug: 'food-restaurants', icon: 'Utensils', description: 'Family restaurants, biryani points, sweet shops, cafes, and bakeries.', order: 7 },
      { id: 8, name: 'Education', slug: 'education', icon: 'GraduationCap', description: 'Schools, junior & degree colleges, coaching centres, and computer academies.', order: 8 },
      { id: 9, name: 'Health', slug: 'health', icon: 'Activity', description: 'Hospitals, diagnostic clinics, pharmacies, dentists, and wellness clinics.', order: 9 },
      { id: 10, name: 'Services', slug: 'services', icon: 'Wrench', description: 'Electricians, plumbers, painters, carpenters, event caterers, and legal pros.', order: 10 },
      { id: 11, name: 'Agriculture', slug: 'agriculture', icon: 'Sprout', description: 'Cotton seeds, fertilizers, farm machinery, harvesters, and solar pumps.', order: 11 },
      { id: 12, name: 'Events', slug: 'events', icon: 'Calendar', description: 'Local exhibitions, cultural programs, sports tournaments, and festivals.', order: 12 },
      { id: 13, name: 'Other', slug: 'other', icon: 'Layers', description: 'Miscellaneous local classified advertisements and notices.', order: 13 }
    ];

    for (const cat of categories) {
      await connection.query(`
        INSERT INTO categories (id, name, slug, icon, description, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE name=VALUES(name), icon=VALUES(icon), description=VALUES(description), display_order=VALUES(display_order);
      `, [cat.id, cat.name, cat.slug, cat.icon, cat.description, cat.order]);
    }

    // 4. Locations in Adilabad
    const locations = [
      { id: 1, name: 'Shivaji Chowk', slug: 'shivaji-chowk', pincode: '504001', type: 'central' },
      { id: 2, name: 'Cinema Road', slug: 'cinema-road', pincode: '504001', type: 'commercial' },
      { id: 3, name: 'Dwaraka Nagar', slug: 'dwaraka-nagar', pincode: '504001', type: 'residential' },
      { id: 4, name: 'Gandhi Chowk', slug: 'gandhi-chowk', pincode: '504001', type: 'market' },
      { id: 5, name: 'Mavala', slug: 'mavala', pincode: '504002', type: 'suburb' },
      { id: 6, name: 'Teachers Colony', slug: 'teachers-colony', pincode: '504001', type: 'residential' },
      { id: 7, name: 'Collectorate Area', slug: 'collectorate-area', pincode: '504001', type: 'administrative' },
      { id: 8, name: 'Bus Stand Road', slug: 'bus-stand-road', pincode: '504001', type: 'commercial' },
      { id: 9, name: 'Netaji Chowk', slug: 'netaji-chowk', pincode: '504001', type: 'commercial' },
      { id: 10, name: 'IB Chowk', slug: 'ib-chowk', pincode: '504001', type: 'junction' },
      { id: 11, name: 'KRK Colony', slug: 'krk-colony', pincode: '504001', type: 'residential' },
      { id: 12, name: 'Utnoor Road', slug: 'utnoor-road', pincode: '504001', type: 'highway' },
      { id: 13, name: 'Dasnapur', slug: 'dasnapur', pincode: '504002', type: 'residential' },
      { id: 14, name: 'Bela Road', slug: 'bela-road', pincode: '504001', type: 'suburb' }
    ];

    for (const loc of locations) {
      await connection.query(`
        INSERT INTO locations (id, name, slug, pincode, type)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), pincode=VALUES(pincode), type=VALUES(type);
      `, [loc.id, loc.name, loc.slug, loc.pincode, loc.type]);
    }

    // 5. Businesses in Adilabad
    const businesses = [
      {
        id: 1,
        name: 'Shree Balaji Electronics & Appliances',
        slug: 'shree-balaji-electronics-appliances',
        category_id: 5,
        location_id: 2,
        address: 'Opposite Geeta Theatre, Cinema Road, Adilabad, Telangana 504001',
        phone: '+91 94401 23456',
        whatsapp: '+91 94401 23456',
        email: 'info@balajielectronicsadilabad.com',
        website: 'https://balajielectronicsadilabad.com',
        description: 'Leading electronics and multi-brand home appliances showroom in Adilabad. Authorized dealer for Sony, Samsung, LG, Haier, Voltas, and Whirlpool with lowest festival EMI schemes.',
        logo_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=300&q=80',
        cover_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80',
        rating: 4.9,
        total_reviews: 48,
        is_featured: 1,
        display_order: 1
      },
      {
        id: 2,
        name: 'Sri Sai Grand Multi-Cuisine Family Restaurant',
        slug: 'sri-sai-grand-family-restaurant',
        category_id: 7,
        location_id: 8,
        address: 'Near Old Bus Stand, Bus Stand Road, Adilabad, Telangana 504001',
        phone: '+91 98480 11223',
        whatsapp: '+91 98480 11223',
        email: 'contact@saigrandadilabad.com',
        website: 'https://saigrandadilabad.com',
        description: 'Famous family dining destination serving authentic Telangana mutton dalcha, Dum Biryani, North Indian curries, Chinese dishes, and pure veg tiffins in a deluxe air-conditioned environment.',
        logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
        cover_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
        rating: 4.8,
        total_reviews: 92,
        is_featured: 1,
        display_order: 2
      },
      {
        id: 3,
        name: 'Arogya Dental & Orthodontic Care Centre',
        slug: 'arogya-dental-orthodontic-care',
        category_id: 9,
        location_id: 1,
        address: '2nd Floor, Above Apollo Pharmacy, Shivaji Chowk, Adilabad, Telangana 504001',
        phone: '+91 94411 99887',
        whatsapp: '+91 94411 99887',
        email: 'appointments@arogyadentalcare.in',
        website: 'https://arogyadentalcare.in',
        description: 'Advanced dental hospital equipped with digital X-Ray, painless root canal treatment, dental implants, teeth whitening, smile makeover, and pediatric dental care by experienced dental surgeons.',
        logo_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80',
        cover_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
        rating: 4.9,
        total_reviews: 35,
        is_featured: 1,
        display_order: 3
      },
      {
        id: 4,
        name: 'Adilabad Cotton Heritage & Handlooms',
        slug: 'adilabad-cotton-heritage-handlooms',
        category_id: 6,
        location_id: 4,
        address: 'Gandhi Chowk Main Bazaar, Adilabad, Telangana 504001',
        phone: '+91 98492 44332',
        whatsapp: '+91 98492 44332',
        email: 'handlooms@adilabadcotton.com',
        website: 'https://adilabadcotton.com',
        description: 'Authentic pure cotton garments, Pochampally silk sarees, traditional dhotis, cotton bedsheets, and readymade festive ethnic wear direct from Telangana weavers at genuine wholesale rates.',
        logo_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        cover_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
        rating: 4.7,
        total_reviews: 64,
        is_featured: 1,
        display_order: 4
      },
      {
        id: 5,
        name: 'Kakatiya Automobiles & Multi-Brand Service',
        slug: 'kakatiya-automobiles-multibrand-service',
        category_id: 3,
        location_id: 12,
        address: 'Utnoor Bypass Road, Mavala Ring, Adilabad, Telangana 504002',
        phone: '+91 97011 55667',
        whatsapp: '+91 97011 55667',
        email: 'service@kakatiyaautomobiles.in',
        website: 'https://kakatiyaautomobiles.in',
        description: 'Certified 4-wheeler and 2-wheeler computerised diagnostic centre, 3D wheel alignment, cashless insurance repairs, foam wash, and genuine spare parts across Maruti, Hyundai, Tata & Mahindra.',
        logo_url: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=300&q=80',
        cover_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
        rating: 4.6,
        total_reviews: 42,
        is_featured: 0,
        display_order: 5
      },
      {
        id: 6,
        name: 'Smart Infotech & Computer Education Academy',
        slug: 'smart-infotech-computer-academy',
        category_id: 8,
        location_id: 3,
        address: 'Behind SBI Main Branch, Dwaraka Nagar, Adilabad, Telangana 504001',
        phone: '+91 99890 88776',
        whatsapp: '+91 99890 88776',
        email: 'learn@smartinfotechadilabad.org',
        website: 'https://smartinfotechadilabad.org',
        description: 'Government registered computer coaching institute teaching Python, Full-Stack Web Development, Data Analytics, Tally Prime GST, Graphic Designing, and DCA with 100% placement assistance.',
        logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80',
        cover_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
        rating: 4.9,
        total_reviews: 80,
        is_featured: 1,
        display_order: 6
      },
      {
        id: 7,
        name: 'Greenfield Agri Seeds & Farm Equipments',
        slug: 'greenfield-agri-seeds-farm-equipments',
        category_id: 11,
        location_id: 5,
        address: 'Mavala Main Road, Adilabad, Telangana 504002',
        phone: '+91 94901 33221',
        whatsapp: '+91 94901 33221',
        email: 'sales@greenfieldagriadilabad.com',
        website: 'https://greenfieldagriadilabad.com',
        description: 'Certified dealer of high yield hybrid cotton seeds, organic bio-fertilizers, drip irrigation fittings, solar water pump sets, and power sprayers for farmers across Adilabad district.',
        logo_url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=300&q=80',
        cover_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
        rating: 4.8,
        total_reviews: 29,
        is_featured: 0,
        display_order: 7
      },
      {
        id: 8,
        name: 'Sri Venkateshwara Granites, Tiles & Sanitaryware',
        slug: 'sri-venkateshwara-granites-tiles',
        category_id: 1,
        location_id: 10,
        address: 'IB Chowk, Near R&B Rest House, Adilabad, Telangana 504001',
        phone: '+91 98481 77665',
        whatsapp: '+91 98481 77665',
        email: 'info@venkateshwaratiles.com',
        website: 'https://venkateshwaratiles.com',
        description: 'Grand showroom featuring luxury vitrified tiles, polished black & brown granite slabs, Italian marble, Jaquar bath fittings, modular kitchen sinks, and designer sanitaryware at factory direct rates.',
        logo_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80',
        cover_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        rating: 4.7,
        total_reviews: 51,
        is_featured: 1,
        display_order: 8
      }
    ];

    for (const biz of businesses) {
      await connection.query(`
        INSERT INTO businesses (id, name, slug, category_id, location_id, address, phone, whatsapp, email, website, description, logo_url, cover_url, rating, total_reviews, is_featured, is_active, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), phone=VALUES(phone), address=VALUES(address), rating=VALUES(rating), is_featured=VALUES(is_featured);
      `, [biz.id, biz.name, biz.slug, biz.category_id, biz.location_id, biz.address, biz.phone, biz.whatsapp, biz.email, biz.website, biz.description, biz.logo_url, biz.cover_url, biz.rating, biz.total_reviews, biz.is_featured, biz.display_order]);

      // Add services
      await connection.query(`DELETE FROM business_services WHERE business_id = ?;`, [biz.id]);
      await connection.query(`
        INSERT INTO business_services (business_id, service_name, description) VALUES
        (?, 'Consultation & In-Store Assistance', 'Friendly local customer assistance with product demos and support.'),
        (?, 'Home Delivery & Local Dispatch', 'Fast same-day delivery available across all localities in Adilabad town.'),
        (?, 'Warranty & After-Sales Support', 'Dedicated local after-sales warranty and genuine spare parts assurance.');
      `, [biz.id, biz.id, biz.id]);

      // Add business hours (Mon-Sat 9am to 9pm, Sun 10am to 6pm)
      await connection.query(`DELETE FROM business_hours WHERE business_id = ?;`, [biz.id]);
      for (let day = 0; day <= 6; day++) {
        const isClosed = false;
        const openTime = day === 0 ? '10:00:00' : '09:00:00';
        const closeTime = day === 0 ? '18:00:00' : '21:00:00';
        await connection.query(`
          INSERT INTO business_hours (business_id, day_of_week, open_time, close_time, is_closed)
          VALUES (?, ?, ?, ?, ?);
        `, [biz.id, day, openTime, closeTime, isClosed ? 1 : 0]);
      }
    }

    // 6. Advertisements (Admin published only)
    const ads = [
      {
        id: 1,
        title: 'Shree Balaji Mega Festival Electronics Sale - Smart 4K TVs & Inverter ACs',
        slug: 'shree-balaji-mega-festival-electronics-sale',
        business_name: 'Shree Balaji Electronics',
        category_id: 5,
        location_id: 2,
        description: 'Huge discounts up to 45% on 55-inch Ultra HD 4K Google TVs, Double Door Refrigerators, 5-Star Split ACs, and Front Load Washing Machines. Instant cashbacks on HDFC, SBI and ICICI cards. Zero down payment finance with Bajaj Finserv. Free express home delivery and free wall-mount installation anywhere within Adilabad district.',
        price: 24990.00,
        price_type: 'starting_at',
        price_display: '₹24,990 onwards',
        phone: '+91 94401 23456',
        whatsapp: '+91 94401 23456',
        website: 'https://balajielectronicsadilabad.com',
        address: 'Opposite Geeta Theatre, Cinema Road, Adilabad, Telangana 504001',
        latitude: 19.6641,
        longitude: 78.5320,
        is_featured: 1,
        status: 'published',
        start_date: '2026-03-01',
        expiry_date: '2026-12-31',
        views_count: 342,
        clicks_count: 58,
        shares_count: 19,
        images: [
          'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 2,
        title: 'Prime 1800 Sq.Ft Commercial Showroom Space for Lease at Cinema Road',
        slug: 'prime-1800-sqft-commercial-showroom-cinema-road',
        business_name: 'Adilabad Prime Properties',
        category_id: 2,
        location_id: 2,
        description: 'Ready to occupy premium ground floor commercial space suitable for Banks, Branded Retail Showrooms, Jewellery Stores, Clinics, or Diagnostic Laboratories. 40 feet front road facing with 3-phase commercial electricity, 24/7 dedicated borewell water, separate male/female washrooms, and dedicated basement customer parking for 15 two-wheelers and 4 four-wheelers.',
        price: 65000.00,
        price_type: 'fixed',
        price_display: '₹65,000 / month',
        phone: '+91 98490 66778',
        whatsapp: '+91 98490 66778',
        website: 'https://adilabadproperties.com',
        address: 'Main Commercial Belt, Next to Canara Bank, Cinema Road, Adilabad',
        latitude: 19.6635,
        longitude: 78.5312,
        is_featured: 1,
        status: 'published',
        start_date: '2026-02-15',
        expiry_date: '2026-11-30',
        views_count: 512,
        clicks_count: 84,
        shares_count: 32,
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 3,
        title: 'Mahindra Thar 4x4 LX Hardtop 2023 - Single Owner, Mint Condition',
        slug: 'mahindra-thar-4x4-lx-hardtop-2023-adilabad',
        business_name: 'Direct Owner Deal',
        category_id: 3,
        location_id: 6,
        description: 'Immaculately maintained Mahindra Thar LX Hardtop Diesel Manual 4x4. Only 18,200 km driven with complete showroom service records at Adilabad Mahindra service centre. Features dark rocky beige interior, 18-inch alloy wheels with BFGoodrich all-terrain tyres, 7-inch infotainment touchscreen with Apple CarPlay, reverse camera, ceramic coating, comprehensive insurance valid till Nov 2026. Adilabad TS-01 registered.',
        price: 1475000.00,
        price_type: 'negotiable',
        price_display: '₹14,75,000 (Negotiable)',
        phone: '+91 94411 22334',
        whatsapp: '+91 94411 22334',
        website: null,
        address: 'Near Officers Club, Teachers Colony, Adilabad, Telangana 504001',
        latitude: 19.6680,
        longitude: 78.5280,
        is_featured: 1,
        status: 'published',
        start_date: '2026-03-10',
        expiry_date: '2026-09-30',
        views_count: 730,
        clicks_count: 110,
        shares_count: 45,
        images: [
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 4,
        title: 'Urgent Hiring: Senior Accountant & Tally ERP Billing Executives',
        slug: 'senior-accountant-tally-billing-jobs-adilabad',
        business_name: 'Adilabad Cotton & Ginning Mills Association',
        category_id: 4,
        location_id: 1,
        description: 'Leading cotton export and trading firm in Adilabad invites applications for full-time Senior Accountant and 2 Billing Operators. Candidate should have minimum 3+ years experience in Tally Prime, GST filing, TDS deductions, bank reconciliation, and invoice generation. Fresh B.Com / M.Com graduates with good typing skills can apply for junior roles. Attractive salary, provident fund, and annual performance bonus.',
        price: 28000.00,
        price_type: 'starting_at',
        price_display: '₹22,000 - ₹35,000 / month',
        phone: '+91 98485 55443',
        whatsapp: '+91 98485 55443',
        website: 'https://adilabadcottonmills.com',
        address: 'Commercial Complex, 1st Floor, Shivaji Chowk, Adilabad, Telangana 504001',
        latitude: 19.6650,
        longitude: 78.5330,
        is_featured: 1,
        status: 'published',
        start_date: '2026-03-01',
        expiry_date: '2026-08-31',
        views_count: 890,
        clicks_count: 142,
        shares_count: 76,
        images: [
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 5,
        title: 'Sri Sai Grand Mutton Biryani & Telangana Special Thali Weekend Offer',
        slug: 'sri-sai-grand-mutton-biryani-weekend-offer',
        business_name: 'Sri Sai Grand Restaurant',
        category_id: 7,
        location_id: 8,
        description: 'Special weekend feast at Adilabad’s favorite family restaurant! Enjoy authentic firewood slow-cooked Hyderabadi Dum Biryani, Telangana Mutton Roast, Natu Kodi Pulao, Paneer Butter Masala, and hot Double Ka Meetha. Special flat 20% discount on family dine-in orders above ₹1,000. AC family dining section and spacious party hall for up to 80 guests.',
        price: 320.00,
        price_type: 'starting_at',
        price_display: '₹320 per plate',
        phone: '+91 98480 11223',
        whatsapp: '+91 98480 11223',
        website: 'https://saigrandadilabad.com',
        address: 'Bus Stand Road, Near Old Bus Stand, Adilabad, Telangana 504001',
        latitude: 19.6620,
        longitude: 78.5300,
        is_featured: 1,
        status: 'published',
        start_date: '2026-03-05',
        expiry_date: '2026-12-31',
        views_count: 610,
        clicks_count: 98,
        shares_count: 40,
        images: [
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 6,
        title: 'Newly Constructed 3 BHK Luxury Independent House for Sale in Teachers Colony',
        slug: 'new-3-bhk-independent-house-teachers-colony',
        business_name: 'Adilabad Home Builders',
        category_id: 2,
        location_id: 6,
        description: '100% Vastu compliant East facing 3 BHK individual villa constructed on 200 sq. yards plot with 1,850 sq.ft built-up area. Features modular teakwood kitchen, POP false ceiling with LED profile lights, Jaguar sanitary fittings, borewell plus municipal water tap connection, CC road access, 1 car porch, and peaceful residential surroundings close to schools and hospitals.',
        price: 6800000.00,
        price_type: 'negotiable',
        price_display: '₹68 Lakhs (Negotiable)',
        phone: '+91 94405 88990',
        whatsapp: '+91 94405 88990',
        website: null,
        address: 'Plot 42, Teachers Colony Main Road, Adilabad, Telangana 504001',
        latitude: 19.6675,
        longitude: 78.5290,
        is_featured: 1,
        status: 'published',
        start_date: '2026-02-20',
        expiry_date: '2026-10-31',
        views_count: 1040,
        clicks_count: 195,
        shares_count: 62,
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 7,
        title: 'New Batch: Full-Stack Web Development & AI Tools Certification',
        slug: 'fullstack-web-dev-ai-tools-batch-smart-infotech',
        business_name: 'Smart Infotech Academy',
        category_id: 8,
        location_id: 3,
        description: 'Join comprehensive 4-month professional certificate program covering JavaScript, React, Node.js, Express, MySQL, Tailwind CSS, Git, and AI tools integration. Real world hands-on projects, daily 2-hour lab sessions, weekly mock interviews, and placement support across Hyderabad and remote tech companies. Batch starts 15th of every month. Limited seats of 18 students per batch.',
        price: 14500.00,
        price_type: 'fixed',
        price_display: '₹14,500 total fee',
        phone: '+91 99890 88776',
        whatsapp: '+91 99890 88776',
        website: 'https://smartinfotechadilabad.org',
        address: 'Behind SBI Main Branch, Dwaraka Nagar, Adilabad 504001',
        latitude: 19.6660,
        longitude: 78.5350,
        is_featured: 0,
        status: 'published',
        start_date: '2026-03-01',
        expiry_date: '2026-11-30',
        views_count: 420,
        clicks_count: 67,
        shares_count: 28,
        images: [
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 8,
        title: 'High-Yield Hybrid Cotton Seeds & Organic Bio-Fertilizers for Kharif Season',
        slug: 'hybrid-cotton-seeds-organic-bio-fertilizers-adilabad',
        business_name: 'Greenfield Agri Traders',
        category_id: 11,
        location_id: 5,
        description: 'Certified BG-II bollgard cotton seeds with guaranteed high germination rates, resistant to pink bollworm and drought conditions. Government lab tested batches with barcode authentication. Complete range of micronutrient fertilizers, neem cake, bio-fungicides, and drip lateral pipes available in wholesale packs for farmers in Adilabad, Bela, and Utnoor mandals.',
        price: 850.00,
        price_type: 'starting_at',
        price_display: '₹850 per packet',
        phone: '+91 94901 33221',
        whatsapp: '+91 94901 33221',
        website: 'https://greenfieldagriadilabad.com',
        address: 'Mavala Main Road, Near Petrol Bunk, Adilabad, Telangana 504002',
        latitude: 19.6580,
        longitude: 78.5200,
        is_featured: 0,
        status: 'published',
        start_date: '2026-03-15',
        expiry_date: '2026-09-15',
        views_count: 530,
        clicks_count: 72,
        shares_count: 22,
        images: [
          'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 9,
        title: 'Pain-Free Root Canal Treatment & Invisible Dental Aligners at Arogya Clinic',
        slug: 'painfree-root-canal-invisible-aligners-arogya',
        business_name: 'Arogya Dental Clinic',
        category_id: 9,
        location_id: 1,
        description: 'Specialized cosmetic and orthodontic dentistry by experienced doctors. Single-sitting painless root canal therapy with Rotary Endodontics, metal-free Zirconia crowns with 15-year warranty, clear aligners for teeth straightening without ugly braces, and deep ultrasonic teeth cleaning. Clean sterile hospital environment.',
        price: 2500.00,
        price_type: 'starting_at',
        price_display: 'Consultation ₹300',
        phone: '+91 94411 99887',
        whatsapp: '+91 94411 99887',
        website: 'https://arogyadentalcare.in',
        address: 'Shivaji Chowk, 2nd Floor Above Apollo Pharmacy, Adilabad',
        latitude: 19.6645,
        longitude: 78.5325,
        is_featured: 0,
        status: 'published',
        start_date: '2026-03-01',
        expiry_date: '2026-12-31',
        views_count: 310,
        clicks_count: 45,
        shares_count: 14,
        images: [
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 10,
        title: 'Maruti Suzuki Swift VXi Petrol 2021 - Pearl Metallic White, Well Maintained',
        slug: 'maruti-swift-vxi-2021-white-adilabad',
        business_name: 'Kakatiya Auto Deals',
        category_id: 3,
        location_id: 12,
        description: 'First owner private car driven only 32,500 km. Comprehensive insurance valid till Oct 2026. Equipped with chilled air conditioning, power steering, all 4 power windows, steering mounted audio controls, dual airbags, ABS with EBD, clean fabric interiors, new battery with 3 years warranty, and new Ceat tyres. Mileage 21 km/litre on highway. Loan facility available up to 80%.',
        price: 540000.00,
        price_type: 'fixed',
        price_display: '₹5,40,000',
        phone: '+91 97011 55667',
        whatsapp: '+91 97011 55667',
        website: null,
        address: 'Utnoor Bypass Road, Adilabad, Telangana 504002',
        latitude: 19.6550,
        longitude: 78.5250,
        is_featured: 0,
        status: 'published',
        start_date: '2026-03-12',
        expiry_date: '2026-08-31',
        views_count: 670,
        clicks_count: 89,
        shares_count: 31,
        images: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 11,
        title: 'Royal Mens Wedding Suits, Sherwanis & Indo-Western Designer Collection',
        slug: 'royal-mens-wedding-suits-sherwanis-gandhi-chowk',
        business_name: 'Adilabad Cotton Heritage',
        category_id: 6,
        location_id: 4,
        description: 'Complete groom collection for weddings and celebrations. Ready-to-wear and custom tailored tuxedos, 3-piece Jodhpuri suits, designer kurtas, silk shawls, and safas. Professional master cutters provide custom bespoke stitching within 48 hours. Best prices in town with festive package offers.',
        price: 4999.00,
        price_type: 'starting_at',
        price_display: '₹4,999 onwards',
        phone: '+91 98492 44332',
        whatsapp: '+91 98492 44332',
        website: 'https://adilabadcotton.com',
        address: 'Gandhi Chowk Main Bazaar, Adilabad, Telangana 504001',
        latitude: 19.6640,
        longitude: 78.5340,
        is_featured: 0,
        status: 'published',
        start_date: '2026-03-01',
        expiry_date: '2026-12-31',
        views_count: 380,
        clicks_count: 52,
        shares_count: 18,
        images: [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
        ]
      },
      {
        id: 12,
        title: 'Sree Venkateshwara Factory Direct Polished Granite & Nano Vitrified Tiles',
        slug: 'sree-venkateshwara-factory-direct-granite-tiles',
        business_name: 'Sri Venkateshwara Granites',
        category_id: 1,
        location_id: 10,
        description: 'Direct wholesale supply of South Indian Black Galaxy Granite, Tan Brown, Steel Grey slabs and 2x2, 4x2, 4x6 vitrified floor and wall tiles. Guaranteed zero breakage on site delivery across Adilabad district with our crane-assisted trucks. Ideal for residential house construction, commercial complexes, and apartment projects.',
        price: 45.00,
        price_type: 'starting_at',
        price_display: 'Tiles ₹45/sq.ft | Granite ₹85/sq.ft',
        phone: '+91 98481 77665',
        whatsapp: '+91 98481 77665',
        website: 'https://venkateshwaratiles.com',
        address: 'IB Chowk, Near R&B Rest House, Adilabad, Telangana 504001',
        latitude: 19.6655,
        longitude: 78.5295,
        is_featured: 0,
        status: 'published',
        start_date: '2026-02-10',
        expiry_date: '2026-11-30',
        views_count: 490,
        clicks_count: 63,
        shares_count: 21,
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
        ]
      }
    ];

    for (const ad of ads) {
      await connection.query(`
        INSERT INTO advertisements (
          id, title, slug, business_name, category_id, location_id, description,
          price, price_type, price_display, phone, whatsapp, website, address,
          latitude, longitude, is_featured, status, start_date, expiry_date,
          views_count, clicks_count, shares_count, created_by
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, 1
        )
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), description=VALUES(description), price=VALUES(price),
          price_display=VALUES(price_display), phone=VALUES(phone), address=VALUES(address),
          is_featured=VALUES(is_featured), status=VALUES(status);
      `, [
        ad.id, ad.title, ad.slug, ad.business_name, ad.category_id, ad.location_id, ad.description,
        ad.price, ad.price_type, ad.price_display, ad.phone, ad.whatsapp, ad.website, ad.address,
        ad.latitude, ad.longitude, ad.is_featured, ad.status, ad.start_date, ad.expiry_date,
        ad.views_count, ad.clicks_count, ad.shares_count
      ]);

      // Insert images
      await connection.query(`DELETE FROM advertisement_images WHERE advertisement_id = ?;`, [ad.id]);
      for (let i = 0; i < ad.images.length; i++) {
        await connection.query(`
          INSERT INTO advertisement_images (advertisement_id, image_url, is_primary, display_order)
          VALUES (?, ?, ?, ?);
        `, [ad.id, ad.images[i], i === 0 ? 1 : 0, i]);
      }
    }

    // 7. Events in Adilabad
    const events = [
      {
        id: 1,
        title: 'Adilabad Mega Consumer Fair & Food Festival 2026',
        slug: 'adilabad-mega-consumer-fair-food-festival-2026',
        description: 'Grand 10-day shopping carnival and family entertainment expo featuring 120+ retail stalls, amusement rides, live music evenings, food courts with 40+ Telangana delicacies, handicraft displays, and electronics showcase. Fun for the entire family!',
        cover_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-11-15',
        event_time: '04:00 PM - 10:30 PM',
        venue: 'Indira Priyadarshini Stadium Grounds',
        location_id: 1,
        address: 'Stadium Road, Near Shivaji Chowk, Adilabad, Telangana 504001',
        organizer: 'Adilabad Merchants & Citizens Welfare Forum',
        phone: '+91 94401 99001',
        whatsapp: '+91 94401 99001',
        website: 'https://adilabadfair.org',
        registration_url: 'https://adilabadfair.org/tickets',
        is_featured: 1,
        status: 'published'
      },
      {
        id: 2,
        title: 'Adilabad District Open Cricket Championship 2026',
        slug: 'adilabad-district-open-cricket-championship-2026',
        description: 'T20 tennis ball tournament with 32 teams competing for the prestigious Adilabad Cup and cash prizes worth ₹1,50,000. Professional umpires, digital scoreboard, live streaming on local channels, and trophies for best batsman, bowler, and player of the series.',
        cover_url: 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-10-25',
        event_time: '08:00 AM - 06:00 PM',
        venue: 'Police Parade Grounds',
        location_id: 7,
        address: 'Opposite SP Office, Collectorate Road, Adilabad, Telangana 504001',
        organizer: 'Adilabad District Youth Sports Club',
        phone: '+91 98482 77112',
        whatsapp: '+91 98482 77112',
        website: null,
        registration_url: null,
        is_featured: 1,
        status: 'published'
      },
      {
        id: 3,
        title: 'Telangana Handloom & Cotton Weavers Heritage Expo',
        slug: 'telangana-handloom-cotton-weavers-heritage-expo',
        description: 'Exhibition and direct sale of handspun organic cotton clothing, Dokra bell metal craft from Jainoor/Ushegaon, traditional tribal embroidery, and hand-woven blankets directly from master craftsmen of Adilabad and Kumuram Bheem Asifabad districts.',
        cover_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-11-02',
        event_time: '10:00 AM - 08:30 PM',
        venue: 'Town Hall Auditorium',
        location_id: 2,
        address: 'Cinema Road, Next to Municipal Council, Adilabad, Telangana 504001',
        organizer: 'Telangana State Handloom Development Society',
        phone: '+91 94405 11882',
        whatsapp: '+91 94405 11882',
        website: 'https://telanganahandlooms.org',
        registration_url: null,
        is_featured: 0,
        status: 'published'
      },
      {
        id: 4,
        title: 'Free Mega Multispeciality Health & Cardiac Checkup Camp',
        slug: 'free-mega-multispeciality-health-camp-adilabad',
        description: 'Comprehensive free medical camp with senior specialist doctors visiting from Hyderabad. Free ECG, blood sugar, lipid profile, bone mineral density scans, cataract eye screening, dental checkup, and distribution of medicines for eligible patients.',
        cover_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        event_date: '2026-10-18',
        event_time: '09:00 AM - 03:00 PM',
        venue: 'Lions Club Hall & Community Centre',
        location_id: 3,
        address: 'Dwaraka Nagar, Near Water Tank, Adilabad, Telangana 504001',
        organizer: 'Lions Club of Adilabad & Arogya Foundation',
        phone: '+91 94411 99887',
        whatsapp: '+91 94411 99887',
        website: null,
        registration_url: null,
        is_featured: 0,
        status: 'published'
      }
    ];

    for (const ev of events) {
      await connection.query(`
        INSERT INTO events (
          id, title, slug, description, cover_url, event_date, event_time,
          venue, location_id, address, organizer, phone, whatsapp, website,
          registration_url, is_featured, status
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?
        )
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), description=VALUES(description), event_date=VALUES(event_date),
          event_time=VALUES(event_time), venue=VALUES(venue), is_featured=VALUES(is_featured),
          status=VALUES(status);
      `, [
        ev.id, ev.title, ev.slug, ev.description, ev.cover_url, ev.event_date, ev.event_time,
        ev.venue, ev.location_id, ev.address, ev.organizer, ev.phone, ev.whatsapp, ev.website,
        ev.registration_url, ev.is_featured, ev.status
      ]);
    }

    // 8. Banners for Homepage and Sections
    const banners = [
      {
        id: 1,
        title: 'Discover What\'s Happening in Adilabad',
        subtitle: 'The #1 local advertising & discovery portal for businesses, deals, properties, vehicles, jobs and events in Adilabad.',
        cta_text: 'Browse Advertisements',
        link_url: '/advertisements',
        image_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
        priority: 1,
        is_active: 1
      },
      {
        id: 2,
        title: 'Festival Shopping & Mega Electronics Deals',
        subtitle: 'Explore authentic discounts from top verified retail stores and showrooms across Cinema Road & Shivaji Chowk.',
        cta_text: 'View Electronics Deals',
        link_url: '/categories/electronics',
        image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
        priority: 2,
        is_active: 1
      },
      {
        id: 3,
        title: 'Looking for Commercial Property or Plots?',
        subtitle: 'Browse prime rental spaces, independent villas, and residential plots in Teachers Colony & Dwaraka Nagar.',
        cta_text: 'Explore Properties',
        link_url: '/categories/property',
        image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
        priority: 3,
        is_active: 1
      }
    ];

    for (const ban of banners) {
      await connection.query(`
        INSERT INTO banners (id, title, subtitle, cta_text, link_url, image_url, priority, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), subtitle=VALUES(subtitle), cta_text=VALUES(cta_text),
          link_url=VALUES(link_url), image_url=VALUES(image_url), priority=VALUES(priority), is_active=VALUES(is_active);
      `, [ban.id, ban.title, ban.subtitle, ban.cta_text, ban.link_url, ban.image_url, ban.priority, ban.is_active]);
    }

    // 9. Initial Favorites for demo user (user_id = 2)
    await connection.query(`
      INSERT IGNORE INTO favorites (user_id, item_type, item_id) VALUES
      (2, 'advertisement', 1),
      (2, 'advertisement', 3),
      (2, 'business', 1),
      (2, 'event', 1);
    `);

    // 10. Sample Notifications
    await connection.query(`
      INSERT INTO notifications (id, title, message, type, target_type, link_url) VALUES
      (1, 'Welcome to Adilabad App!', 'Discover top local advertisements, businesses, offers, and upcoming events across Adilabad in one place.', 'announcement', 'all', '/explore'),
      (2, 'Mega Festival Sale Announced!', 'Shree Balaji Electronics has launched their festive discount bonanza on Cinema Road. Check deals now.', 'featured_ad', 'all', '/advertisements/shree-balaji-mega-festival-electronics-sale'),
      (3, 'Adilabad Food Carnival 2026', 'Tickets & vendor stall passes are now available for the upcoming Adilabad Mega Consumer Fair.', 'event', 'all', '/events/adilabad-mega-consumer-fair-food-festival-2026')
      ON DUPLICATE KEY UPDATE title=VALUES(title), message=VALUES(message);
    `);

    // 11. Settings
    const settings = [
      { key: 'site_name', value: 'Adilabad App', desc: 'Website title' },
      { key: 'site_tagline', value: 'Discover Adilabad. Discover Local.', desc: 'Primary branding slogan' },
      { key: 'contact_phone', value: '+91 94401 12345', desc: 'Support phone number' },
      { key: 'contact_email', value: 'hello@adilabadapp.com', desc: 'Support email address' },
      { key: 'contact_whatsapp', value: '+91 94401 12345', desc: 'WhatsApp contact line' },
      { key: 'contact_address', value: 'Main Commercial Hub, Shivaji Chowk, Adilabad, Telangana 504001', desc: 'Physical office address' },
      { key: 'about_text', value: 'Adilabad App is the premier local discovery and advertising platform dedicated to the people and businesses of Adilabad, Telangana. We provide a curated, verified, and modern directory of advertisements, shops, deals, property listings, vehicle sales, local job vacancies, and community events.', desc: 'About website copy' }
    ];

    for (const s of settings) {
      await connection.query(`
        INSERT INTO settings (setting_key, setting_value, description)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value), description=VALUES(description);
      `, [s.key, s.value, s.desc]);
    }

    // 12. Admin Activity Logs
    await connection.query(`
      INSERT INTO admin_activity_logs (admin_id, action, entity, entity_id, details, ip_address) VALUES
      (1, 'System Initialized', 'system', NULL, 'Database seeded with default Adilabad categories, locations, businesses, and advertisements', '127.0.0.1');
    `);

    console.log('✅ Database seeded successfully with realistic Adilabad data!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
