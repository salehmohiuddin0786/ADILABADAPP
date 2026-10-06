/**
 * Adilabad App - Offline Mock & Fallback Data Engine
 * Provides rich, authentic local Adilabad fallback data whenever the backend server
 * is disconnected, offline, or experiencing network connectivity issues.
 */

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Business', slug: 'business', icon: 'Briefcase', description: 'Local commercial enterprises, trading hubs, offices, and services in Adilabad.', display_order: 1, advertisements_count: 8 },
  { id: 2, name: 'Property', slug: 'property', icon: 'Home', description: 'Houses, flats, plots, commercial shops, and land for sale or rent in Adilabad.', display_order: 2, advertisements_count: 14 },
  { id: 3, name: 'Vehicles', slug: 'vehicles', icon: 'Car', description: 'Cars, bikes, tractors, commercial vehicles, and auto accessories in Adilabad.', display_order: 3, advertisements_count: 11 },
  { id: 4, name: 'Jobs', slug: 'jobs', icon: 'UserCheck', description: 'Local job vacancies, accountant openings, sales, drivers, and technical jobs.', display_order: 4, advertisements_count: 9 },
  { id: 5, name: 'Electronics', slug: 'electronics', icon: 'Tv', description: 'Smartphones, LED TVs, home appliances, computers, and repairs in Adilabad.', display_order: 5, advertisements_count: 16 },
  { id: 6, name: 'Shopping', slug: 'shopping', icon: 'ShoppingBag', description: 'Clothing, handlooms, textiles, footwear, jewellery, and general stores.', display_order: 6, advertisements_count: 18 },
  { id: 7, name: 'Food & Restaurants', slug: 'food-restaurants', icon: 'Utensils', description: 'Family restaurants, biryani points, sweet shops, cafes, and bakeries.', display_order: 7, advertisements_count: 12 },
  { id: 8, name: 'Education', slug: 'education', icon: 'GraduationCap', description: 'Schools, junior & degree colleges, coaching centres, and computer academies.', display_order: 8, advertisements_count: 7 },
  { id: 9, name: 'Health', slug: 'health', icon: 'Activity', description: 'Hospitals, diagnostic clinics, pharmacies, dentists, and wellness clinics.', display_order: 9, advertisements_count: 10 },
  { id: 10, name: 'Services', slug: 'services', icon: 'Wrench', description: 'Electricians, plumbers, painters, carpenters, event caterers, and legal pros.', display_order: 10, advertisements_count: 15 },
  { id: 11, name: 'Agriculture', slug: 'agriculture', icon: 'Sprout', description: 'Cotton seeds, fertilizers, farm machinery, harvesters, and solar pumps.', display_order: 11, advertisements_count: 13 },
  { id: 12, name: 'Events', slug: 'events', icon: 'Calendar', description: 'Local exhibitions, cultural programs, sports tournaments, and festivals.', display_order: 12, advertisements_count: 6 },
  { id: 13, name: 'Other', slug: 'other', icon: 'Layers', description: 'Miscellaneous local classified advertisements and notices in Adilabad.', display_order: 13, advertisements_count: 5 }
];

export const MOCK_LOCATIONS = [
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

export const MOCK_BANNERS = [
  {
    id: 1,
    title: "Discover What's Happening in Adilabad",
    subtitle: "Find local businesses, advertisements, offers, events, jobs and more — all in one place.",
    cta_text: "Browse Advertisements",
    link_url: "/advertisements",
    image_url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
    priority: 1,
    is_active: 1
  },
  {
    id: 2,
    title: "Festival Shopping & Mega Electronics Deals",
    subtitle: "Explore authentic discounts from top verified retail stores and showrooms across Cinema Road & Shivaji Chowk.",
    cta_text: "View Electronics Deals",
    link_url: "/categories/electronics",
    image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    priority: 2,
    is_active: 1
  },
  {
    id: 3,
    title: "Looking for Commercial Property or Plots?",
    subtitle: "Browse prime rental spaces, independent villas, and residential plots in Teachers Colony & Dwaraka Nagar.",
    cta_text: "Explore Properties",
    link_url: "/categories/property",
    image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    priority: 3,
    is_active: 1
  }
];

export const MOCK_BUSINESSES = [
  {
    id: 1,
    name: 'Shree Balaji Electronics & Appliances',
    slug: 'shree-balaji-electronics-appliances',
    category_id: 5,
    category_name: 'Electronics',
    category_slug: 'electronics',
    location_id: 2,
    location_name: 'Cinema Road',
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
    display_order: 1,
    services: [
      { id: 1, service_name: 'Zero Cost EMI Finance', description: 'Instant approval through Bajaj Finserv, HDFC & TVS Credit.' },
      { id: 2, service_name: 'Free Home Delivery', description: 'Same-day express safe delivery across Adilabad district.' },
      { id: 3, service_name: 'Authorized Service Center', description: 'Genuine spares and trained brand technicians on call.' }
    ],
    hours: [
      { day_of_week: 0, open_time: '10:00:00', close_time: '18:00:00', is_closed: 0 },
      { day_of_week: 1, open_time: '09:00:00', close_time: '21:00:00', is_closed: 0 },
      { day_of_week: 2, open_time: '09:00:00', close_time: '21:00:00', is_closed: 0 },
      { day_of_week: 3, open_time: '09:00:00', close_time: '21:00:00', is_closed: 0 },
      { day_of_week: 4, open_time: '09:00:00', close_time: '21:00:00', is_closed: 0 },
      { day_of_week: 5, open_time: '09:00:00', close_time: '21:00:00', is_closed: 0 },
      { day_of_week: 6, open_time: '09:00:00', close_time: '21:00:00', is_closed: 0 }
    ]
  },
  {
    id: 2,
    name: 'Sri Sai Grand Multi-Cuisine Family Restaurant',
    slug: 'sri-sai-grand-family-restaurant',
    category_id: 7,
    category_name: 'Food & Restaurants',
    category_slug: 'food-restaurants',
    location_id: 8,
    location_name: 'Bus Stand Road',
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
    display_order: 2,
    services: [
      { id: 4, service_name: 'Air Conditioned Family Dining', description: 'Comfortable private booths and family section.' },
      { id: 5, service_name: 'Banquet Hall for Celebrations', description: 'Capacity for up to 150 guests for birthdays and parties.' },
      { id: 6, service_name: 'Direct WhatsApp Parcel Order', description: 'Hot takeaway packed within 15 minutes.' }
    ]
  },
  {
    id: 3,
    name: 'Arogya Dental & Orthodontic Care Centre',
    slug: 'arogya-dental-orthodontic-care',
    category_id: 9,
    category_name: 'Health',
    category_slug: 'health',
    location_id: 1,
    location_name: 'Shivaji Chowk',
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
    display_order: 3,
    services: [
      { id: 7, service_name: 'Painless Single-Sitting RCT', description: 'Advanced rotary endodontic tech.' },
      { id: 8, service_name: 'Invisible Clear Aligners', description: 'Straighten teeth discreetly without wire braces.' }
    ]
  },
  {
    id: 4,
    name: 'Adilabad Cotton Heritage & Handlooms',
    slug: 'adilabad-cotton-heritage-handlooms',
    category_id: 6,
    category_name: 'Shopping',
    category_slug: 'shopping',
    location_id: 4,
    location_name: 'Gandhi Chowk',
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
    category_name: 'Vehicles',
    category_slug: 'vehicles',
    location_id: 12,
    location_name: 'Utnoor Road',
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
    category_name: 'Education',
    category_slug: 'education',
    location_id: 3,
    location_name: 'Dwaraka Nagar',
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
    category_name: 'Agriculture',
    category_slug: 'agriculture',
    location_id: 5,
    location_name: 'Mavala',
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
    category_name: 'Business',
    category_slug: 'business',
    location_id: 10,
    location_name: 'IB Chowk',
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

export const MOCK_ADVERTISEMENTS = [
  {
    id: 1,
    title: 'Shree Balaji Mega Festival Electronics Sale - Smart 4K TVs & Inverter ACs',
    slug: 'shree-balaji-mega-festival-electronics-sale',
    business_name: 'Shree Balaji Electronics',
    category_id: 5,
    category_name: 'Electronics',
    category_slug: 'electronics',
    location_id: 2,
    location_name: 'Cinema Road',
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
    created_at: '2026-03-01T10:00:00.000Z',
    views_count: 342,
    clicks_count: 58,
    shares_count: 19,
    primary_image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 101, image_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80', is_primary: 1 },
      { id: 102, image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80', is_primary: 0 },
      { id: 103, image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80', is_primary: 0 }
    ]
  },
  {
    id: 2,
    title: 'Prime 1800 Sq.Ft Commercial Showroom Space for Lease at Cinema Road',
    slug: 'prime-1800-sqft-commercial-showroom-cinema-road',
    business_name: 'Adilabad Prime Properties',
    category_id: 2,
    category_name: 'Property',
    category_slug: 'property',
    location_id: 2,
    location_name: 'Cinema Road',
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
    created_at: '2026-02-15T11:30:00.000Z',
    views_count: 512,
    clicks_count: 84,
    shares_count: 32,
    primary_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 104, image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80', is_primary: 1 },
      { id: 105, image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80', is_primary: 0 }
    ]
  },
  {
    id: 3,
    title: 'Mahindra Thar 4x4 LX Hardtop 2023 - Single Owner, Mint Condition',
    slug: 'mahindra-thar-4x4-lx-hardtop-2023-adilabad',
    business_name: 'Direct Owner Deal',
    category_id: 3,
    category_name: 'Vehicles',
    category_slug: 'vehicles',
    location_id: 6,
    location_name: 'Teachers Colony',
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
    created_at: '2026-03-10T14:15:00.000Z',
    views_count: 730,
    clicks_count: 110,
    shares_count: 45,
    primary_image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 106, image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80', is_primary: 1 },
      { id: 107, image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80', is_primary: 0 }
    ]
  },
  {
    id: 4,
    title: 'Senior Accountant & Tally Prime Executive Required in Adilabad Town',
    slug: 'senior-accountant-tally-prime-adilabad',
    business_name: 'Adilabad Cotton Heritage',
    category_id: 4,
    category_name: 'Jobs',
    category_slug: 'jobs',
    location_id: 4,
    location_name: 'Gandhi Chowk',
    description: 'Urgent requirement for an experienced Male/Female Accountant with minimum 2-3 years experience in Tally Prime, GST monthly filing (GSTR-1 & 3B), bank reconciliation, purchase billing, and inventory tracking. Working hours: 10:00 AM to 08:30 PM. Competitive salary based on experience with annual festival bonuses.',
    price: 25000.00,
    price_type: 'starting_at',
    price_display: '₹22,000 - ₹28,000 / month',
    phone: '+91 98492 44332',
    whatsapp: '+91 98492 44332',
    website: null,
    address: 'Gandhi Chowk Main Bazaar, Adilabad, Telangana 504001',
    latitude: 19.6640,
    longitude: 78.5335,
    is_featured: 1,
    status: 'published',
    created_at: '2026-03-05T09:00:00.000Z',
    views_count: 420,
    clicks_count: 65,
    shares_count: 28,
    primary_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 108, image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80', is_primary: 1 }
    ]
  },
  {
    id: 5,
    title: 'Authentic Hyderabadi Dum Biryani & Mutton Dalcha Festival at Sri Sai Grand',
    slug: 'dum-biryani-mutton-dalcha-festival-sri-sai-grand',
    business_name: 'Sri Sai Grand Restaurant',
    category_id: 7,
    category_name: 'Food & Restaurants',
    category_slug: 'food-restaurants',
    location_id: 8,
    location_name: 'Bus Stand Road',
    description: 'Relish the authentic flavours of slow-cooked dum biryani prepared with aromatic seeraga samba rice and tender halal meat using time-honoured royal spices. Special weekend combo: 1 Full Mutton Biryani + Mutton Dalcha + Bagara Rice + Mirchi ka Salan + Double Ka Meetha. Family AC dining available.',
    price: 320.00,
    price_type: 'starting_at',
    price_display: 'Combos from ₹320',
    phone: '+91 98480 11223',
    whatsapp: '+91 98480 11223',
    website: 'https://saigrandadilabad.com',
    address: 'Near Old Bus Stand, Bus Stand Road, Adilabad, Telangana 504001',
    latitude: 19.6620,
    longitude: 78.5300,
    is_featured: 1,
    status: 'published',
    created_at: '2026-03-08T12:00:00.000Z',
    views_count: 850,
    clicks_count: 140,
    shares_count: 67,
    primary_image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 109, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80', is_primary: 1 },
      { id: 110, image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80', is_primary: 0 }
    ]
  },
  {
    id: 6,
    title: 'Adilabad Pure Cotton Sarees & Traditional Handloom Khadi Collection',
    slug: 'adilabad-pure-cotton-sarees-handloom-collection',
    business_name: 'Adilabad Cotton Heritage',
    category_id: 6,
    category_name: 'Shopping',
    category_slug: 'shopping',
    location_id: 4,
    location_name: 'Gandhi Chowk',
    description: 'Direct weaver showcase of organic pure cotton sarees, soft Pochampally ikkat handlooms, lightweight summer daily wear sarees, and wedding zari borders. Buy directly from cooperative weavers and support rural artisans of Adilabad district. Free saree fall & pico service included with every purchase.',
    price: 899.00,
    price_type: 'starting_at',
    price_display: '₹899 onwards',
    phone: '+91 98492 44332',
    whatsapp: '+91 98492 44332',
    website: 'https://adilabadcotton.com',
    address: 'Gandhi Chowk Main Bazaar, Adilabad, Telangana 504001',
    latitude: 19.6640,
    longitude: 78.5340,
    is_featured: 1,
    status: 'published',
    created_at: '2026-03-02T15:30:00.000Z',
    views_count: 460,
    clicks_count: 68,
    shares_count: 24,
    primary_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 111, image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80', is_primary: 1 }
    ]
  },
  {
    id: 7,
    title: 'Luxury 3 BHK Independent Duplex Villa For Sale in Dwaraka Nagar',
    slug: 'luxury-3bhk-duplex-villa-dwaraka-nagar-adilabad',
    business_name: 'Adilabad Prime Properties',
    category_id: 2,
    category_name: 'Property',
    category_slug: 'property',
    location_id: 3,
    location_name: 'Dwaraka Nagar',
    description: 'Newly constructed East-facing 3 BHK architect-designed duplex villa on 200 sq.yards plot. 100% Vasthu compliant with Teak wood doors, UPVC windows, premium false ceiling with LED cove lighting, modular kitchen with chimney, borewell + municipal tap water connection, and covered car parking.',
    price: 8200000.00,
    price_type: 'negotiable',
    price_display: '₹82 Lakhs (Negotiable)',
    phone: '+91 98490 66778',
    whatsapp: '+91 98490 66778',
    website: 'https://adilabadproperties.com',
    address: 'Plot No. 45, Near Hanuman Temple, Dwaraka Nagar, Adilabad',
    latitude: 19.6650,
    longitude: 78.5305,
    is_featured: 0,
    status: 'published',
    created_at: '2026-02-28T08:00:00.000Z',
    views_count: 610,
    clicks_count: 95,
    shares_count: 36,
    primary_image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 112, image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80', is_primary: 1 }
    ]
  },
  {
    id: 8,
    title: 'High Yield Hybrid Cotton Seeds (Bt Cotton) & Micro-Drip Irrigation Systems',
    slug: 'hybrid-cotton-seeds-bt-cotton-drip-irrigation',
    business_name: 'Greenfield Agri Seeds',
    category_id: 11,
    category_name: 'Agriculture',
    category_slug: 'agriculture',
    location_id: 5,
    location_name: 'Mavala',
    description: 'Certified BG-II Bollgard hybrid cotton seeds tested for pest resistance, drought endurance, and superior boll bursting suitable for Adilabad black cotton soils. Also supplying government subsidy-approved drip irrigation pipes, lateral filters, and Venturi fertilizer injectors with 5-year warranty.',
    price: 860.00,
    price_type: 'fixed',
    price_display: '₹860 / packet (450g)',
    phone: '+91 94901 33221',
    whatsapp: '+91 94901 33221',
    website: 'https://greenfieldagriadilabad.com',
    address: 'Mavala Main Road, Adilabad, Telangana 504002',
    latitude: 19.6580,
    longitude: 78.5200,
    is_featured: 0,
    status: 'published',
    created_at: '2026-02-20T10:45:00.000Z',
    views_count: 530,
    clicks_count: 72,
    shares_count: 22,
    primary_image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80',
    images: [
      { id: 113, image_url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80', is_primary: 1 }
    ]
  }
];

export const MOCK_EVENTS = [
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
    location_name: 'Shivaji Chowk',
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
    location_name: 'Collectorate Area',
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
    location_name: 'Cinema Road',
    address: 'Cinema Road, Next to Municipal Council, Adilabad, Telangana 504001',
    organizer: 'Telangana State Handloom Development Society',
    phone: '+91 94405 11882',
    whatsapp: '+91 94405 11882',
    website: 'https://telanganahandlooms.org',
    registration_url: null,
    is_featured: 0,
    status: 'published'
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Welcome to Adilabad App!',
    message: 'Discover verified advertisements, businesses, jobs and events in Adilabad town.',
    is_read: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Festive Deals Announced',
    message: 'Check out new Electronics and Property listings in Cinema Road.',
    is_read: 0,
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

export const MOCK_ANALYTICS = {
  totalUsers: 1420,
  activeUsers: 890,
  totalAds: 12,
  activeAds: 12,
  featuredAds: 6,
  totalBusinesses: 8,
  totalEvents: 3,
  totalViews: 3850,
  totalClicks: 620,
  growthRate: '+18.4%',
  popularCategories: [
    { name: 'Electronics', count: 16 },
    { name: 'Property', count: 14 },
    { name: 'Shopping', count: 18 },
    { name: 'Vehicles', count: 11 },
    { name: 'Food & Restaurants', count: 12 }
  ]
};

/**
 * Filter and query helper for mock data
 */
export function filterMockAdvertisements(params = {}) {
  let list = [...MOCK_ADVERTISEMENTS];

  if (params.featured === 'true' || params.featured === true) {
    list = list.filter(a => a.is_featured === 1);
  }

  if (params.category) {
    list = list.filter(a => a.category_slug === params.category || a.category_id == params.category);
  }

  if (params.location) {
    list = list.filter(a => a.location_name?.toLowerCase() === params.location.toLowerCase() || a.location_id == params.location);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.business_name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category_name.toLowerCase().includes(q)
    );
  }

  const limit = params.limit ? parseInt(params.limit, 10) : 12;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const pagedList = list.slice((page - 1) * limit, page * limit);

  return {
    success: true,
    data: pagedList,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

export function filterMockBusinesses(params = {}) {
  let list = [...MOCK_BUSINESSES];

  if (params.featured === 'true' || params.featured === true) {
    list = list.filter(b => b.is_featured === 1);
  }

  if (params.category) {
    list = list.filter(b => b.category_slug === params.category || b.category_id == params.category);
  }

  if (params.location) {
    list = list.filter(b => b.location_name?.toLowerCase() === params.location.toLowerCase() || b.location_id == params.location);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(b => 
      b.name.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.category_name.toLowerCase().includes(q)
    );
  }

  const limit = params.limit ? parseInt(params.limit, 10) : 12;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const pagedList = list.slice((page - 1) * limit, page * limit);

  return {
    success: true,
    data: pagedList,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

export function filterMockEvents(params = {}) {
  let list = [...MOCK_EVENTS];

  if (params.location) {
    list = list.filter(e => e.location_name?.toLowerCase() === params.location.toLowerCase() || e.location_id == params.location);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q)
    );
  }

  const limit = params.limit ? parseInt(params.limit, 10) : 12;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const pagedList = list.slice((page - 1) * limit, page * limit);

  return {
    success: true,
    data: pagedList,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

export function getMockSearch(query = '', location = '') {
  const q = (query || '').toLowerCase().trim();
  const loc = (location || '').toLowerCase().trim();

  const matchedAds = MOCK_ADVERTISEMENTS.filter(a => {
    const matchText = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.category_name.toLowerCase().includes(q) || a.business_name.toLowerCase().includes(q);
    const matchLoc = !loc || loc === 'all' || a.location_name?.toLowerCase().includes(loc);
    return matchText && matchLoc;
  });

  const matchedBiz = MOCK_BUSINESSES.filter(b => {
    const matchText = !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.category_name.toLowerCase().includes(q);
    const matchLoc = !loc || loc === 'all' || b.location_name?.toLowerCase().includes(loc);
    return matchText && matchLoc;
  });

  const matchedEvents = MOCK_EVENTS.filter(e => {
    const matchText = !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
    const matchLoc = !loc || loc === 'all' || e.location_name?.toLowerCase().includes(loc);
    return matchText && matchLoc;
  });

  const matchedCats = MOCK_CATEGORIES.filter(c => {
    return !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

  return {
    success: true,
    data: {
      advertisements: matchedAds,
      businesses: matchedBiz,
      events: matchedEvents,
      categories: matchedCats
    },
    counts: {
      total: matchedAds.length + matchedBiz.length + matchedEvents.length + matchedCats.length,
      advertisements: matchedAds.length,
      businesses: matchedBiz.length,
      events: matchedEvents.length,
      categories: matchedCats.length
    }
  };
}
