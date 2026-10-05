import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Compass, Utensils, Mountain, Landmark, ShoppingBag, ArrowRight } from 'lucide-react';
import MainLayout from '../src/components/layout/MainLayout';

export default function ExplorePage() {
  const [selectedTag, setSelectedTag] = React.useState('All');

  const attractions = [
    {
      title: 'Kuntala Waterfalls',
      tag: 'Waterfalls',
      category: 'Natural Wonder',
      distance: '64 km from town',
      bestTime: 'July to December',
      location: 'Near Neredigonda, Adilabad',
      description: 'Telangana’s highest natural cascading waterfall with a spectacular 147-foot drop amidst lush teak forests of the Sahyadri mountain range.',
      image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
      mapsQuery: 'Kuntala Waterfalls Adilabad'
    },
    {
      title: 'Pochera Waterfalls',
      tag: 'Waterfalls',
      category: 'Scenic Destination',
      distance: '50 km from town',
      bestTime: 'August to January',
      location: 'Boath Mandal, Adilabad',
      description: 'A deep plunge waterfall falling into a wide circular rocky basin on the Kadam river, surrounded by serene picnic spots and thick foliage.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      mapsQuery: 'Pochera Waterfalls Adilabad'
    },
    {
      title: 'Kawal Wildlife Sanctuary & Tiger Reserve',
      tag: 'Wildlife',
      category: 'Ecotourism & Safari',
      distance: '75 km from town',
      bestTime: 'November to May',
      location: 'Jannaram / Adilabad Border',
      description: 'Sprawling deciduous teak jungle home to Bengal tigers, leopards, barking deer, nilgai, and over 200 species of migratory and native birds.',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
      mapsQuery: 'Kawal Wildlife Sanctuary'
    },
    {
      title: 'Historic Jainath Sun Temple',
      tag: 'Heritage',
      category: 'Heritage & Archaeology',
      distance: '21 km from town',
      bestTime: 'October to March',
      location: 'Jainath Village, 21 km from Adilabad',
      description: 'Ancient temple renowned for its distinctive Pallava architectural style, intricate stone carvings, and annual Karthika Shuddha Ashtami celebrations.',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      mapsQuery: 'Jainath Sun Temple Adilabad'
    },
    {
      title: 'Cinema Road & Shivaji Chowk Shopping Hub',
      tag: 'Markets',
      category: 'Commercial & Retail',
      distance: 'City Centre',
      bestTime: 'Year Round',
      location: 'City Centre, Adilabad',
      description: 'The pulsing commercial heart of Adilabad town lined with branded electronics showrooms, jewelers, textiles, mobile markets, and street food.',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
      mapsQuery: 'Cinema Road Adilabad'
    },
    {
      title: 'Gandhi Chowk Cotton Handloom Bazaar',
      tag: 'Markets',
      category: 'Traditional Handloom',
      distance: 'City Centre',
      bestTime: 'Year Round',
      location: 'Gandhi Chowk, Adilabad',
      description: 'Adilabad’s famous cotton trading capital featuring pure organic handwoven fabrics, sarees, and genuine Dokra bell metal folk art.',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
      mapsQuery: 'Gandhi Chowk Adilabad'
    }
  ];

  const filtered = selectedTag === 'All'
    ? attractions
    : attractions.filter(a => a.tag === selectedTag);

  return (
    <>
      <Head>
        <title>Explore Adilabad — Local Guide & Highlights | Adilabad App</title>
        <meta
          name="description"
          content="Discover natural wonders, waterfalls, temples, shopping hubs, and famous spots in Adilabad, Telangana."
        />
      </Head>

      {/* HERO BANNER SECTION */}
      <section className="bg-slate-900 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden haikei-hero-bg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30 mb-3">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Adilabad City & Tourism Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Discover the Treasures of Adilabad
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl">
              From the thunderous falls of Kuntala and Pochera to ancient stone shrines, wildlife safaris, and bustling cotton bazaars.
            </p>
          </div>

          {/* Tag Filter Pills */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1">
            {['All', 'Waterfalls', 'Heritage', 'Wildlife', 'Markets'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTag === t
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-slate-50 py-10 sm:py-14 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                  
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow">
                    {item.category}
                  </div>

                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-lg bg-brand-600 text-white text-[11px] font-black shadow">
                    {item.distance}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition">
                      {item.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </p>
                    <div className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600 mb-3">
                      Best Time: {item.bestTime}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapsQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-xl transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>

                    <Link
                      href={`/search?q=${encodeURIComponent(item.title.split(' ')[0])}`}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      <span>Nearby Ads</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

ExplorePage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

