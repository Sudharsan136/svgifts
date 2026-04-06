import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Contact() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h1 className="section-title mb-4 text-5xl">Get in Touch</h1>
        <p className="text-gray-500 text-lg">We're always happy to help with your gifting needs!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Info Column */}
        <div className="space-y-8">
          <div className="card p-10 md:p-12">
            <h3 className="font-semibold text-gray-800 mb-8 text-xl">Contact Information</h3>
            <div className="space-y-6">
              {[
                { icon: FiMapPin, label: 'Headquarters', val: 'Thanjavur, Tamil Nadu, India' },
                { icon: FiPhone, label: 'WhatsApp Concierge', val: '+91 241 974 967 849 040', href: 'https://wa.me/241974967849040' },
                { icon: FiMail, label: 'Email Support', val: 'svgifts@email.com', href: 'mailto:svgifts@email.com' },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-pink/5 flex items-center justify-center flex-shrink-0 border border-brand-pink/10 shadow-sm">
                    <Icon size={20} className="text-brand-pink" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-gray-800 text-lg font-medium hover:text-brand-pink transition-colors">{val}</a>
                    ) : (
                      <p className="text-gray-800 text-lg font-medium">{val}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://wa.me/241974967849040?text=Hi! I have a query about your products."
            target="_blank" rel="noopener noreferrer"
            className="btn-whatsapp justify-center w-full text-lg py-5 shadow-2xl"
          >
            <FaWhatsapp size={24} /> Chat with us on WhatsApp
          </a>

          <div className="card p-10 bg-gradient-to-br from-pink-50/50 to-white border border-brand-pink/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">💼</div>
              <h4 className="font-bold text-gray-900 text-lg">Bulk & Corporate Orders</h4>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Need 50+ gifts for your team, event, or wedding? Connect with our dedicated concierge for exclusive bulk pricing and customized branding.
            </p>
            <a href="https://wa.me/241974967849040?text=Hi! I need bulk pricing for corporate/event gifts."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-brand-pink/20 text-brand-pink font-bold text-sm hover:bg-brand-pink hover:text-white transition-all shadow-sm">
              <FaWhatsapp size={16} /> Request Bulk Quote
            </a>
          </div>
        </div>

        {/* Message Form Column */}
        <div className="card p-10 md:p-12 relative overflow-hidden">
          {/* Decorative background orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="font-semibold text-gray-800 mb-8 text-xl relative z-10">Send a Digital Enquiry</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const msg = `Hi SV Gifts!\n\nName: ${fd.get('name')}\nPhone: ${fd.get('phone')}\n\nMessage: ${fd.get('message')}`;
              window.open(`https://wa.me/241974967849040?text=${encodeURIComponent(msg)}`, '_blank');
            }}
            className="space-y-6 relative z-10"
          >
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name *</label>
              <input name="name" required className="input" placeholder="Enter your name" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Phone Number *</label>
              <input name="phone" required className="input" placeholder="+91 XXXXX XXXXX" type="tel" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Your Message *</label>
              <textarea name="message" required rows={5} className="input resize-none"
                placeholder="Tell us about your requirements or specific products..." />
            </div>
            <div className="pt-2">
              <button type="submit" className="btn-primary w-full justify-center py-5 text-lg">
                Submit Enquiry
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4 italic">
              Your enquiry will be sent directly to our WhatsApp team for immediate attention.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
