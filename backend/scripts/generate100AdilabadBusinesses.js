const xlsx = require('xlsx');
const path = require('path');

const categories = [
  'Business', 'Shopping', 'Food & Restaurants', 'Health', 'Education',
  'Services', 'Agriculture', 'Vehicles', 'Property', 'Other'
];

const subcategories = {
  'Shopping': ['Supermarket', 'Textiles & Sarees', 'Jewellery', 'Footwear', 'General Store', 'Electronics'],
  'Food & Restaurants': ['Family Restaurant', 'Biryani Point', 'Sweet Shop & Bakery', 'Cafe', 'Fast Food'],
  'Health': ['Hospital', 'Multi-Speciality Clinic', 'Dental Clinic', 'Pharmacy', 'Diagnostic Centre', 'Eye Hospital'],
  'Education': ['Junior College', 'Degree College', 'High School', 'Coaching Academy', 'Computer Institute'],
  'Agriculture': ['Cotton Trading', 'Seeds & Fertilizers', 'Tractor Spares', 'Agri Machinery', 'Drip Irrigation'],
  'Vehicles': ['Two Wheeler Showroom', 'Auto Spares & Service', 'Car Care', 'Tractor Dealership'],
  'Services': ['Electrical Services', 'Plumbing & Hardware', 'Printing & Xerox', 'Event Catering', 'Legal & Tax'],
  'Property': ['Real Estate Consultants', 'Building Materials', 'Cement & Steel Traders'],
  'Business': ['Auditing & Tax Hub', 'Logistics & Cargo', 'Finance & Leasing', 'Security Agency'],
  'Other': ['General Enterprises', 'Local Handicrafts', 'Timber Depot']
};

const localities = [
  { name: 'Shivaji Chowk', lat: 19.6672, lng: 78.5345 },
  { name: 'Cinema Road', lat: 19.6641, lng: 78.5320 },
  { name: 'Dwaraka Nagar', lat: 19.6615, lng: 78.5360 },
  { name: 'Gandhi Chowk', lat: 19.6655, lng: 78.5332 },
  { name: 'Mavala', lat: 19.6450, lng: 78.5250 },
  { name: 'Teachers Colony', lat: 19.6702, lng: 78.5390 },
  { name: 'Collectorate Area', lat: 19.6680, lng: 78.5370 },
  { name: 'Bus Stand Road', lat: 19.6630, lng: 78.5310 },
  { name: 'Netaji Chowk', lat: 19.6660, lng: 78.5338 },
  { name: 'IB Chowk', lat: 19.6685, lng: 78.5355 },
  { name: 'KRK Colony', lat: 19.6600, lng: 78.5400 },
  { name: 'Utnoor Road', lat: 19.6750, lng: 78.5450 },
  { name: 'Dasnapur', lat: 19.6589, lng: 78.5298 },
  { name: 'Bela Road', lat: 19.6710, lng: 78.5412 }
];

const namePrefixes = [
  'Sri', 'Shree', 'Adilabad', 'Telangana', 'Sai', 'Venkateshwara', 'Tirumala',
  'Balaji', 'Laxmi', 'Ganesh', 'Kishan', 'Bharat', 'Navaratna', 'Kaveri',
  'Pragati', 'Surya', 'Anand', 'Krishna', 'Royal', 'Modern', 'Santhosh',
  'Padmavati', 'Manjeera', 'Vijaya', 'National', 'Universal', 'Diamond'
];

const nameTypes = [
  'Enterprises', 'Traders', 'Stores', 'Agencies', 'Showroom', 'Emporium',
  'Hub', 'Mart', 'Center', 'World', 'Services', 'Associates', 'Solutions'
];

function generate100Records() {
  const records = [];
  const total = 105; // Generates 105 realistic business records

  for (let i = 1; i <= total; i++) {
    const cat = categories[i % categories.length];
    const subcats = subcategories[cat] || ['Commercial'];
    const subcat = subcats[i % subcats.length];
    const loc = localities[i % localities.length];
    const prefix = namePrefixes[i % namePrefixes.length];
    const type = nameTypes[i % nameTypes.length];

    const businessName = `${prefix} ${subcat.replace(/ & .*/, '')} ${type} ${i}`;
    const phone = `984${String(1000000 + (i * 8763)).slice(-7)}`;
    const altPhone = i % 3 === 0 ? `944${String(2000000 + (i * 5431)).slice(-7)}` : '';
    const email = `contact@${prefix.toLowerCase()}${type.toLowerCase()}${i}.in`;
    const lat = (loc.lat + (Math.sin(i) * 0.005)).toFixed(6);
    const lng = (loc.lng + (Math.cos(i) * 0.005)).toFixed(6);
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    const address = `Shop #${10 + (i % 50)}, Near ${loc.name}, Main Road`;
    const website = i % 2 === 0 ? `https://www.${prefix.toLowerCase()}${i}.com` : '';
    const description = `Leading provider of ${subcat.toLowerCase()} products and professional services located at ${loc.name}, Adilabad.`;

    records.push({
      'Business Name': businessName,
      'Category': cat,
      'Subcategory': subcat,
      'Phone Number': phone,
      'Alternate Phone': altPhone,
      'Email': email,
      'Address': address,
      'Area / Locality': loc.name,
      'City': 'Adilabad',
      'District': 'Adilabad',
      'State': 'Telangana',
      'Pincode': '504001',
      'Latitude': lat,
      'Longitude': lng,
      'Google Maps Link': mapsLink,
      'Website': website,
      'Description': description,
      'Business Image URL': `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80`,
      'Status': 'approved'
    });
  }

  return records;
}

const records = generate100Records();
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(records);

ws['!cols'] = [
  { wch: 35 },
  { wch: 20 },
  { wch: 22 },
  { wch: 16 },
  { wch: 16 },
  { wch: 30 },
  { wch: 38 },
  { wch: 20 },
  { wch: 14 },
  { wch: 14 },
  { wch: 14 },
  { wch: 10 },
  { wch: 14 },
  { wch: 14 },
  { wch: 35 },
  { wch: 28 },
  { wch: 60 },
  { wch: 40 },
  { wch: 12 }
];

xlsx.utils.book_append_sheet(wb, ws, 'Businesses');

const outputPath = path.join(__dirname, 'Adilabad_100_Businesses.xlsx');
xlsx.writeFile(wb, outputPath);
console.log(`✅ Generated ${records.length} business records in: ${outputPath}`);
