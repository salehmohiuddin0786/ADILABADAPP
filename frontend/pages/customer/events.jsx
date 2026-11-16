import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Users, CheckCircle2, Ticket, ArrowRight } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';

export default function CustomerEventsPage() {
  const { showToast } = useToast();
  const [registeredEvents, setRegisteredEvents] = useState([
    {
      id: 'EVT-01',
      title: 'Adilabad Cotton & Agri Expo 2026',
      date: '28 Nov 2026',
      time: '10:00 AM - 6:00 PM',
      venue: 'Market Yard Ground, Adilabad',
      organizer: 'Telangana Agri Hub & Farmers Council',
      status: 'REGISTERED',
      passCode: 'ADB-EXPO-8821'
    }
  ]);

  const [availableEvents, setAvailableEvents] = useState([
    {
      id: 'EVT-02',
      title: 'Nagoba Jatara Cultural Heritage Gathering',
      date: '05 Dec 2026',
      time: '9:00 AM onwards',
      venue: 'Keslapur, Indervelly Mandal',
      organizer: 'Adilabad District Cultural Society',
      badge: 'Cultural'
    },
    {
      id: 'EVT-03',
      title: 'Local Handicrafts & Nirmal Toys Showcase',
      date: '12 Dec 2026',
      time: '11:00 AM - 8:00 PM',
      venue: 'Collectorate Ground Hall, Adilabad',
      organizer: 'Adilabad Artisans Forum',
      badge: 'Exhibition'
    }
  ]);

  useEffect(() => {
    // Also load any published events from submissionService
    const subs = submissionService.getSubmissions({ module: 'events', status: 'PUBLISHED' });
    if (subs && subs.length > 0) {
      const extraEvents = subs.map((s) => ({
        id: s.id,
        title: s.title,
        date: s.date || 'Upcoming 2026',
        time: s.time || 'All Day',
        venue: s.location || 'Adilabad Town',
        organizer: s.submittedBy || 'Community Organizer',
        badge: s.category || 'Event'
      }));
      setAvailableEvents((prev) => [...prev, ...extraEvents]);
    }
  }, []);

  const handleRegister = (evt) => {
    if (registeredEvents.find((e) => e.id === evt.id)) {
      showToast('You are already registered for this event!', 'info');
      return;
    }
    const newReg = {
      ...evt,
      status: 'REGISTERED',
      passCode: `ADB-PASS-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setRegisteredEvents((prev) => [newReg, ...prev]);
    showToast(`Registered for "${evt.title}" successfully! Pass generated.`, 'success');
  };

  return (
    <CustomerLayout title="My Event Registrations">
      <Head>
        <title>Events & Passes — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">District Events & Passes</h2>
          <p className="text-xs text-slate-500 mt-0.5">Expos, cultural gatherings, and local workshops in Adilabad.</p>
        </div>

        {/* My Registered Passes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center">
              <Ticket className="w-4 h-4 mr-2 text-emerald-700" />
              My Entry Passes ({registeredEvents.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registeredEvents.map((evt) => (
              <div key={evt.id} className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed Pass
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">{evt.passCode}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{evt.title}</h4>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {evt.date} • {evt.time}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {evt.venue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Adilabad Events */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-indigo-700" />
            Upcoming Adilabad Events
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableEvents.map((evt) => {
              const isRegistered = registeredEvents.some((r) => r.id === evt.id);
              return (
                <div key={evt.id} className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded">
                      {evt.badge || 'Adilabad Event'}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5">{evt.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> {evt.date} • {evt.time}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {evt.venue}
                    </p>
                  </div>

                  <div>
                    {isRegistered ? (
                      <button disabled className="w-full py-2 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs cursor-not-allowed">
                        Already Registered
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt)}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center space-x-1"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Get Free Entry Pass</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
