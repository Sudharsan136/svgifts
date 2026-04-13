import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGift, FiTruck, FiShield, FiStar, FiBriefcase, FiHeart, FiHome, FiSun } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api';
import logo from '../assets/logo.jpg';

const CATEGORIES = [
  { name: 'Festival Gifts', icon: FiStar, color: 'bg-rose-50 text-rose-600 border-rose-100', hoverInfo: 'Joyful celebrations' },
  { name: 'Corporate Gifts', icon: FiBriefcase, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', hoverInfo: 'Bulk branding' },
  { name: 'Personalised Gifts', icon: FiHeart, color: 'bg-pink-50 text-pink-600 border-pink-100', hoverInfo: 'A custom touch' },
  { name: 'Home Decor', icon: FiHome, color: 'bg-amber-50 text-amber-600 border-amber-100', hoverInfo: 'Elegant living' },
  { name: 'Pooja Items', icon: FiSun, color: 'bg-orange-50 text-orange-600 border-orange-100', hoverInfo: 'Divine rituals' },
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
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden bg-[#fff5f7]">
        {/* Modern Soft Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\' fill=\'%23fb7185\' fill-opacity=\'0.04\'/%3E%3C/g%3E%3C/svg%3E')] opacity-100 mix-blend-multiply pointer-events-none" />
        
        {/* Dynamic Mesh Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-300/40 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-rose-300/30 rounded-full blur-[140px] animate-float pointer-events-none" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[15%] w-[40%] h-[40%] bg-fuchsia-200/40 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '3s' }} />
        
        {/* Soft bottom fade to blend with next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

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
                  href="https://wa.me/919047529439?text=Hi! I want to place a bulk order."
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

            {/* Minimalist Premium 3D Orbital Rings */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="hidden lg:flex relative h-[650px] w-full mt-10 lg:mt-0 items-center justify-center perspective-[1200px]">
              
              {/* Soft Ambient Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-rose-200/40 to-pink-100/40 blur-[100px] rounded-full pointer-events-none z-0 animate-pulse duration-[4000ms]" />

              {/* 3D Orbits Container */}
              <motion.div 
                animate={{ rotateX: [10, -10, 10], rotateY: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                className="relative w-[450px] h-[450px] flex items-center justify-center transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Ring 1 - Outer Gold */}
                <motion.div 
                  animate={{ rotateZ: 360 }}
                  transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                  className="absolute inset-[-10%] border border-[#c8a97e]/20 rounded-full"
                  style={{ transformStyle: 'preserve-3d' }}
                />
                
                {/* Ring 2 - Middle Pink Dashed */}
                <motion.div 
                  animate={{ rotateZ: -360, rotateX: 20 }}
                  transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
                  className="absolute inset-0 border border-brand-pink/30 border-dashed rounded-full"
                  style={{ transformStyle: 'preserve-3d' }}
                />

                {/* Ring 3 - Inner Fine Orbit (Holds a glowing star) */}
                <motion.div 
                  animate={{ rotateZ: 360, rotateY: 20 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="absolute inset-[10%] border border-[#c8a97e]/40 rounded-full flex items-center justify-start"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-3 h-3 rounded-full bg-brand-pink border shadow-[0_0_15px_rgba(255,107,107,0.8)] -translate-x-1.5" />
                </motion.div>

                {/* Ring 4 - Counter Rotating Track */}
                <motion.div 
                  animate={{ rotateZ: -360, rotateX: -20, rotateY: -10 }}
                  transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                  className="absolute inset-[20%] border-[0.5px] border-gray-400/20 rounded-full flex items-end justify-center"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                   <div className="w-2 h-2 rounded-full bg-[#c8a97e] shadow-[0_0_10px_rgba(200,169,126,0.8)] translate-y-1" />
                </motion.div>

                {/* Core Floating Glass Prism */}
                <motion.div 
                   initial={{ scale: 0.8 }}
                   animate={{ scale: [1, 1.02, 1], rotateZ: [0, 2, -2, 0] }}
                   transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                   className="relative z-10 w-64 h-64 rounded-full bg-white/20 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-white/60 flex items-center justify-center overflow-hidden"
                >
                  {/* Prism reflections */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/60" />
                  <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-b from-white/30 to-transparent rotate-45 transform origin-center animate-[spin_20s_linear_infinite]" />
                  
                  {/* Central Logo Enclosure */}
                  <div className="relative z-20 w-48 h-48 rounded-full bg-white shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex items-center justify-center p-6 transform transition-transform hover:scale-105 duration-500 will-change-transform">
                    <img src={logo} alt="SV Gifts" className="w-full h-full object-contain" />
                  </div>
                </motion.div>
                
              </motion.div>

              {/* Floating Brand Badge (Top Left) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, y: [-5, 5, -5] }}
                transition={{ opacity: { duration: 1 }, x: { duration: 1 }, y: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
                className="absolute top-[12%] left-[8%] z-30"
              >
                 <div className="relative group cursor-default">
                   <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/20 to-[#c8a97e]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
                   <div className="bg-white/50 backdrop-blur-lg px-6 py-3 rounded-full border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse shadow-[0_0_8px_rgba(255,107,107,0.8)]" />
                     <span className="font-display tracking-[0.25em] uppercase text-xs font-extrabold text-gray-800">
                       SV Gifts <span className="text-[#c8a97e] italic font-serif lowercase tracking-normal px-1">by</span> SV
                     </span>
                   </div>
                 </div>
              </motion.div>

              {/* Minimal floating accent stars */}
              <motion.div animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-[20%] right-[15%] text-[#c8a97e] z-30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L3 11l8.5-2.5L12 0z"/></svg>
              </motion.div>
              <motion.div animate={{ y: [10, -10, 10], opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }} className="absolute bottom-[25%] left-[20%] text-brand-pink z-30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L3 11l8.5-2.5L12 0z"/></svg>
              </motion.div>

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
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-3xl p-6 text-center border border-gray-100 transition-all duration-300 hover:-translate-y-2 aspect-square flex flex-col items-center justify-center bg-white shadow-sm hover:shadow-xl"
              >
                <div className={`w-16 h-16 rounded-full border ${cat.color} flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner`}>
                  <Icon size={24} />
                </div>
                <div className="font-display font-extrabold text-gray-900 text-base md:text-lg leading-tight tracking-wide">{cat.name}</div>
                <div className="text-[11px] text-gray-400 mt-2 font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">{cat.hoverInfo}</div>
              </Link>
            );
          })}
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
                  <a href="https://wa.me/919047529439" target="_blank" rel="noopener noreferrer"
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
              href="https://wa.me/919047529439?text=Hi! I want to discuss a premium bulk order."
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
