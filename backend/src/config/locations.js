/**
 * ADILABAD APP — CONFIGURABLE LOCATION REGISTRY
 * Configurable multi-district, multi-mandal geography engine.
 */

const LOCATIONS_CONFIG = Object.freeze({
  DEFAULT_DISTRICT: 'Adilabad',
  DEFAULT_STATE: 'Telangana',
  DEFAULT_COUNTRY: 'India',
  DEFAULT_PINCODE: '504001',

  DISTRICTS: [
    {
      id: 'adilabad',
      name: 'Adilabad',
      state: 'Telangana',
      is_primary: true,
      towns: [
        {
          id: 'adilabad_hq',
          name: 'Adilabad Town',
          pincode: '504001',
          localities: [
            'Collectorate Area',
            'Cinema Road',
            'Subhash Nagar',
            'Khanoor Road',
            'Old Town',
            'Shanti Nagar',
            'Vidya Nagar',
            'Dasnapur',
            'Bhuktapur',
            'Housing Board Colony',
            'Brahmanwada',
            'Kailash Nagar',
            'Anath Ashram Road',
            'Devapur Road',
            'Teachers Colony'
          ]
        },
        {
          id: 'mavala',
          name: 'Mavala',
          pincode: '504001',
          localities: ['Mavala Main', 'Bypass Junction', 'Industrial Area']
        },
        {
          id: 'utnoor',
          name: 'Utnoor',
          pincode: '504311',
          localities: ['Main Bazaar', 'Bus Stand Area', 'ITDA Colony', 'Hospital Road']
        },
        {
          id: 'boath',
          name: 'Boath',
          pincode: '504304',
          localities: ['Market Yard', 'Old Village', 'Main Road']
        },
        {
          id: 'echoda',
          name: 'Echoda',
          pincode: '504307',
          localities: ['National Highway 44 Junction', 'Gram Panchayat Area', 'Shanti Nagar']
        },
        {
          id: 'bela',
          name: 'Bela',
          pincode: '504310',
          localities: ['Bela Center', 'Cotton Market', 'Border Checkpoint']
        },
        {
          id: 'indervelly',
          name: 'Indervelly',
          pincode: '504312',
          localities: ['Keslapur Temple Area', 'Martyrs Memorial', 'Main Center']
        },
        {
          id: 'gudur',
          name: 'Gudihatnoor',
          pincode: '504308',
          localities: ['NH44 Corridor', 'Mandal Office Road']
        }
      ]
    },
    {
      id: 'nirmal',
      name: 'Nirmal',
      state: 'Telangana',
      is_primary: false,
      towns: [
        { id: 'nirmal_town', name: 'Nirmal Town', pincode: '504106', localities: ['Toy Craft Colony', 'Mancherial Road', 'Shivaji Chowk'] },
        { id: 'khanapur', name: 'Khanapur', pincode: '504203', localities: ['Main Bazaar', 'Kadam Dam Road'] },
        { id: 'bhainsa', name: 'Bhainsa', pincode: '504103', localities: ['Gandhi Chowk', 'Gaddi Vagu Area'] }
      ]
    },
    {
      id: 'mancherial',
      name: 'Mancherial',
      state: 'Telangana',
      is_primary: false,
      towns: [
        { id: 'mancherial_town', name: 'Mancherial Town', pincode: '504208', localities: ['Bellampalli Chowrasta', 'IB Colony', 'Station Road'] },
        { id: 'mandamarri', name: 'Mandamarri', pincode: '504231', localities: ['Singareni Quarters', 'Coal Belt Hub'] }
      ]
    },
    {
      id: 'hyderabad',
      name: 'Hyderabad (State Capital Hub)',
      state: 'Telangana',
      is_primary: false,
      towns: [
        { id: 'secunderabad', name: 'Secunderabad & Adilabad Link Bus Hub', pincode: '500003', localities: ['JBS Transit Hub'] }
      ]
    }
  ]
});

function getAllLocalities(districtName = 'Adilabad') {
  const district = LOCATIONS_CONFIG.DISTRICTS.find(d => d.name.toLowerCase() === districtName.toLowerCase()) || LOCATIONS_CONFIG.DISTRICTS[0];
  const list = [];
  district.towns.forEach(t => {
    t.localities.forEach(loc => {
      list.push({ locality: loc, town: t.name, pincode: t.pincode, district: district.name });
    });
  });
  return list;
}

module.exports = {
  LOCATIONS_CONFIG,
  getAllLocalities
};
