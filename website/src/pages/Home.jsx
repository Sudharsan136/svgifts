import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGift, FiTruck, FiShield, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api';
import logo from '../assets/logo.jpg';

const CATEGORIES = [
  { name: 'Festival Gifts', emoji: '🎉', color: 'bg-gradient-to-br from-[#ff2a85] to-[#ff6b6b]' },
  { name: 'Corporate Gifts', emoji: '💼', color: 'bg-gradient-to-br from-[#ff758c] to-[#ffa3b1]' },
  { name: 'Personalised Gifts', emoji: '💝', color: 'bg-gradient-to-br from-[#1c1c1c] to-[#3a3a3a]' },
  { name: 'Home Decor', emoji: '🏡', color: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  { name: 'Pooja Items', emoji: '🪔', color: 'bg-gradient-to-br from-pink-400 to-rose-500' },
];

const FEATURES = [
  { icon: FiGift, title: 'Premium Quality', desc: 'Handpicked luxury gifts' },
  { icon: FiTruck, title: 'Fast Delivery', desc: 'Securely shipped across India' },
  { icon: FiShield, title: 'Secure Payment', desc: 'Razorpay & seamless checkout' },
  { icon: FiStar, title: 'Signature Touch', desc: 'Exquisite branding and packaging' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-[4/5] bg-gray-100 mb-3" />
      <div className="p-4 flex-1">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-1/4 mt-auto" />
      </div>
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: 'true' })
      .then((res) => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="overflow-hidden">
      {/* ─── Luxury Hero Section ─────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-12">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-brand-pink/20 rounded-full blur-[100px] animate-float pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-softpink/20 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md text-gray-900 border border-gray-200 text-sm font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
                A Signature Touch In Every Gift
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
                Premium Gifts That <br />
                <span className="text-gradient">Leave a Mark</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-gray-600 text-lg md:text-xl mb-10 leading-relaxed font-light">
                Discover our handpicked collection of exquisite gifts. 
                Whether for festivals, corporate events, or personal milestones, 
                we make every unboxing unforgettable.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 items-center">
                <Link to="/shop" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  Explore Collection <FiArrowRight />
                </Link>
                <a
                  href="https://wa.me/241974967849040?text=Hi! I want to place a bulk order."
                  target="_blank" rel="noopener noreferrer"
                  className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
                >
                  <FaWhatsapp className="text-[#25D366]" size={22} /> Bulk Order
                </a>
              </motion.div>
              
              <motion.div variants={fadeUp} className="flex gap-10 mt-14 pt-8 border-t border-gray-100">
                {[['500+', 'Premium Products'], ['1000+', 'Happy Clients'], ['5.0★', 'Customer Score']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-3xl font-display font-bold text-gray-900 mb-1">{val}</div>
                    <div className="text-sm text-gray-500 font-medium">{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Visual Composition */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="hidden lg:block relative">
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl bg-gray-900 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-pink/40 to-brand-softpink/40 opacity-50 mix-blend-overlay group-hover:opacity-70 transition-opacity duration-1000" />
                <img src={logo} alt="SV Gifts Cover" className="absolute inset-0 w-full h-full object-cover scale-150 opacity-10 blur-xl" />
                
                {/* Floating Elements inside frame */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-64 h-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex flex-col items-center justify-center shadow-2xl p-6 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                      <span className="font-display font-bold text-3xl text-white mb-4 tracking-wider drop-shadow-lg">SV Gifts</span>
                      <img src={logo} alt="SV Gifts Logo" className="w-full h-auto max-h-32 object-contain filter drop-shadow-2xl" />
                   </div>
                </div>
              </div>
              {/* Decorative tags */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-brand-pink">✨</div>
                  <div>
                    <div className="font-bold text-gray-900">Handcrafted</div>
                    <div className="text-xs text-gray-500">With precision</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Features Bar ─────────────────────────── */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divider-x divider-gray-100">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} key={title} className="flex flex-col items-center text-center px-4">
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 transition-transform hover:scale-110">
                  <Icon size={24} className="text-brand-pink" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ───────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="section-title mb-4">Curated Collections</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-gray-500 text-lg max-w-2xl mx-auto">Discover the perfect gift mapped to your exact occasion.</motion.p>
        </div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className={`group relative overflow-hidden rounded-3xl p-8 text-center text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 aspect-square flex flex-col justify-center ${cat.color}`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                <div className="text-5xl mb-4 drop-shadow-md">{cat.emoji}</div>
                <div className="font-display font-bold text-lg leading-snug tracking-wide">{cat.name}</div>
              </div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* ─── Featured Products ─────────────────── */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="section-title mb-3">Signature Arrivals</h2>
              <p className="text-gray-500 text-lg">Our most loved and requested gifts this season</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Link to="/shop" className="btn-secondary bg-transparent hover:bg-white inline-flex items-center gap-2">
                View Gallery <FiArrowRight />
              </Link>
            </motion.div>
          </div>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.length === 0
              ? (
                <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-gray-100">
                  <div className="text-6xl mb-6 opacity-80">🎀</div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Curating New Magic</h3>
                  <p className="text-gray-500 mb-6">Our featured showcase is currently being updated.</p>
                  <a href="https://wa.me/241974967849040" target="_blank" rel="noopener noreferrer"
                    className="btn-whatsapp mx-auto inline-flex">
                    <FaWhatsapp size={20} /> Request Catalog
                  </a>
                </div>
              )
              : featured.map((p) => (
                  <motion.div key={p._id} variants={fadeUp}>
                    <ProductCard product={p} />
                  </motion.div>
                ))
            }
          </motion.div>
        </div>
      </section>

      {/* Premium Bulk Order CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#111]" />
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/111/222?text=+')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-pink/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand-softpink/20 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center text-white relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="w-20 h-20 bg-white/10 backdrop-blur border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float">
              <span className="text-4xl">👑</span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight">Corporate & Bulk Orders</h2>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Elevate your corporate gifting, festival giveaways, or wedding favors with our bespoke curation. Connect with our luxury gifting concierge today.
            </p>
            <a
              href="https://wa.me/241974967849040?text=Hi! I want to discuss a premium bulk order."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-gray-900 font-bold text-lg md:text-xl px-10 py-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <FaWhatsapp size={26} className="text-[#25D366]" />
              Connect with WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
