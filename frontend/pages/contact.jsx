import React, { useState } from 'react';
import Head from 'next/head';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import MainLayout from '../src/components/layout/MainLayout';
import { useToast } from '../src/context/ToastContext';

export default function ContactPage() {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Thank you! Your message has been received by our Adilabad team.', 'success');
  };

  return (
    <>
      <Head>
        <title>Contact Us — Adilabad App</title>
        <meta
          name="description"
          content="Get in touch with Adilabad App administration for advertising inquiries, feedback, or support in Adilabad, Telangana."
        />
      </Head>

      <div className="bg-slate-50 py-12 sm:py-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Local Support & Help
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Get in Touch with Us
            </h1>
            <p className="text-sm sm:text-base text-slate-500">
              Have questions or want your business featured by administrators on Adilabad App? Reach out to our local team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Local Office</h3>

                <div className="space-y-5 text-sm text-slate-700">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Adilabad App Centre</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Main Commercial Complex, Shivaji Chowk, Adilabad, Telangana 504001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Phone Support</p>
                      <a href="tel:+919440112345" className="text-xs text-brand-600 font-semibold hover:underline mt-0.5 block">
                        +91 94401 12345
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">WhatsApp Desk</p>
                      <a
                        href="https://wa.me/919440112345?text=Hello%20Adilabad%20App%20Team"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 font-semibold hover:underline mt-0.5 block"
                      >
                        +91 94401 12345 (Chat Now)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Email Inquiries</p>
                      <a href="mailto:hello@adilabadapp.com" className="text-xs text-brand-600 font-semibold hover:underline mt-0.5 block">
                        hello@adilabadapp.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Office Working Hours</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Monday – Saturday: 9:00 AM – 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Fill out the form below and an administrator will get back to you promptly.
                </p>

                {submitted ? (
                  <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-lg font-bold text-emerald-900">Inquiry Submitted Successfully!</h4>
                    <p className="text-xs text-emerald-700">
                      Our Adilabad representative will contact you via phone or WhatsApp shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-3 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ramesh Kumar"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 94401 00000"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Message / Business Details *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your business or inquiry..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ContactPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
