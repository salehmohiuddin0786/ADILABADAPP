const XLSX = require('xlsx');
const path = require('path');

const servicesData = [
  {
    'Service Title': 'Adilabad Inverter Battery & Solar Power Solutions',
    'Category': 'Electrical & Solar',
    'Pricing': '₹399 Service Visit',
    'Location': 'Netaji Chowk, Adilabad',
    'Provider Name': 'Surya Solar & Battery Hub',
    'Phone Number': '9848011223',
    'Alternate Phone': '9440111224',
    'Experience Years': '9+ Years',
    'Emergency Service': 'Yes',
    'Description': 'Exide & Luminous inverter maintenance, solar panel efficiency testing, battery acid replenishment and wiring inspection.',
    'Status': 'PUBLISHED'
  },
  {
    'Service Title': 'Royal Sofa & Carpet Deep Foam Cleaning',
    'Category': 'Cleaning Services',
    'Pricing': '₹799 Per 5-Seater Sofa',
    'Location': 'Cinema Road, Adilabad',
    'Provider Name': 'CleanTech Adilabad',
    'Phone Number': '9848022335',
    'Alternate Phone': '',
    'Experience Years': '6+ Years',
    'Emergency Service': 'No',
    'Description': 'Commercial extraction machines, germicidal shampoo, fabric stain removal, and sanitization for homes and hotels.',
    'Status': 'PUBLISHED'
  },
  {
    'Service Title': 'Precision Wheel Alignment & 3D Balancing Center',
    'Category': 'Automobile & Mechanics',
    'Pricing': '₹350 Alignment',
    'Location': 'Utnoor Road, Adilabad',
    'Provider Name': 'Adilabad Tyre & Alignment Care',
    'Phone Number': '9440188992',
    'Alternate Phone': '',
    'Experience Years': '14+ Years',
    'Emergency Service': 'Yes',
    'Description': 'Computerized 3D sensor alignment for cars, SUVs and commercial trucks. Nitrogen tyre inflation available.',
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
    'Status': 'PUBLISHED'
  }
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(servicesData);
ws['!cols'] = Object.keys(servicesData[0]).map(() => ({ wch: 22 }));
XLSX.utils.book_append_sheet(wb, ws, 'Services');

const filePath = path.join(__dirname, 'Adilabad_Test_Services.xlsx');
XLSX.writeFile(wb, filePath);
console.log(`Saved sample test file to ${filePath}`);
