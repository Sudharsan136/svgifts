import { useEffect, useRef } from 'react';
import founderImg from '../assets/founder.jpg';

const VALUES = [
  {
    icon: '🔍',
    title: 'Transparency',
    desc: 'No hidden charges, no compromises — just honest products delivered with care.',
  },
  {
    icon: '💎',
    title: 'Quality',
    desc: 'Every product is personally curated with a strong focus on quality, value, and uniqueness.',
  },
  {
    icon: '🤝',
    title: 'Trust',
    desc: 'Trust is not just a word for me — it is a promise I stand by with every order.',
  },
  {
    icon: '🎁',
    title: 'Meaningful Gifting',
    desc: 'I help you create memories, not just purchase products. Each gift tells a story.',
  },
];

export default function About() {
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="about-page">
      {/* ── Hero Banner ── */}
      <section className="about-hero" ref={heroRef}>
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <span className="about-tag">Our Story</span>
          <h1 className="about-hero-title">
            The Heart Behind<br />
            <span className="text-gradient">SV Gifts by SV</span>
          </h1>
          <p className="about-hero-sub">
            A brand born from passion, built on trust, and dedicated to making you feel special.
          </p>
        </div>
        {/* Decorative blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </section>

      {/* ── Founder Section ── */}
      <section className="founder-section">
        <div className="founder-container">
          {/* Photo */}
          <div className="founder-photo-wrap">
            <div className="founder-photo-ring" />
            <img
              src={founderImg}
              alt="Sree Vishmaya — Founder of SV Gifts"
              className="founder-photo"
            />
            <div className="founder-badge">
              <span>✦</span> Founder & Curator
            </div>
          </div>

          {/* Bio */}
          <div className="founder-bio">
            <p className="founder-greeting">Hello, I'm</p>
            <h2 className="founder-name">Sree Vishmaya</h2>
            <p className="founder-tagline">Researcher · Trainer · Gift Curator</p>

            <div className="founder-story">
              <p>
                Professionally, I am a researcher in <strong>bioinformatics and genomics</strong>,
                and I also work as a trainer, sharing my knowledge with students and professionals.
                While my career is rooted in science, my heart has always been drawn to creativity,
                thoughtful details, and meaningful connections.
              </p>
              <p>
                Beyond work, I am a <strong>responsible daughter and a loving aunty</strong> —
                roles that define my values of care, trust, and responsibility.
              </p>
              <p>
                <strong>SV Gifts by SV</strong> began as a passion project — born from my love for
                gifting and the joy of making others feel special. Built independently and named
                after myself, this brand reflects who I am and what I stand for.
              </p>
              <p>
                Every product you see is personally curated with a strong focus on{' '}
                <strong>quality, value, and uniqueness</strong>. I believe in complete transparency
                — no hidden charges, no compromises, just honest products delivered with care.
              </p>
              <p>
                My goal is simple: to bring the best to you and help you{' '}
                <em>create meaningful memories through gifting.</em>
              </p>
            </div>

            <blockquote className="founder-quote">
              "Trust, transparency, and assurance are not just words for me — they are promises
              I stand by."
            </blockquote>

            <p className="founder-sign">— Sree Vishmaya</p>
          </div>
        </div>
      </section>

      {/* ── Values Section ── */}
      <section className="values-section">
        <div className="values-inner">
          <div className="values-header">
            <span className="about-tag">What I Stand For</span>
            <h2 className="values-title">The Pillars of SV Gifts</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div className="value-card" key={i}>
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="about-cta">
        <div className="cta-glow" />
        <div className="cta-inner">
          <h2 className="cta-title">Ready to Find the Perfect Gift?</h2>
          <p className="cta-sub">
            Browse our handpicked collection and let Sree help you create a memory.
          </p>
          <a href="/shop" className="btn-primary cta-btn">
            Explore the Shop ✦
          </a>
        </div>
      </section>

      {/* ── Inline Styles ── */}
      <style>{`
        .about-page {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* HERO */
        .about-hero {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff0f5 0%, #ffe4ec 50%, #ffd6e7 100%);
          overflow: hidden;
          padding: 80px 24px;
          text-align: center;
        }
        .about-hero-overlay {
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff2a85' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .about-hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }
        .about-tag {
          display: inline-block;
          background: linear-gradient(135deg, #ff2a85, #ff758c);
          color: white;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .about-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 700;
          color: #1c1c1c;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .about-hero-sub {
          font-size: 1.1rem;
          color: #555;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* Blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.25;
          pointer-events: none;
        }
        .blob-1 {
          width: 320px; height: 320px;
          background: #ff2a85;
          top: -100px; right: -80px;
          animation: float 8s ease-in-out infinite;
        }
        .blob-2 {
          width: 240px; height: 240px;
          background: #ff758c;
          bottom: -60px; left: -60px;
          animation: float 10s ease-in-out infinite reverse;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-20px) scale(1.05); }
        }

        /* FOUNDER */
        .founder-section {
          padding: 80px 24px;
          background: #fff;
        }
        .founder-container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .founder-container {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }
        }

        /* Photo */
        .founder-photo-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .founder-photo-ring {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff2a85, #ff758c, #ffb347);
          z-index: 0;
          animation: spin-ring 10s linear infinite;
          border-radius: 999px;
        }
        @keyframes spin-ring {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .founder-photo {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 340px;
          aspect-ratio: 3/4;
          object-fit: cover;
          object-position: top center;
          border-radius: 24px;
          box-shadow: 0 30px 80px rgba(255, 42, 133, 0.2);
          border: 4px solid white;
        }
        .founder-badge {
          margin-top: 16px;
          background: linear-gradient(135deg, #ff2a85, #ff758c);
          color: white;
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 20px rgba(255, 42, 133, 0.35);
          position: relative;
          z-index: 1;
        }

        /* Bio */
        .founder-bio {
          padding-top: 8px;
        }
        .founder-greeting {
          font-size: 14px;
          font-weight: 600;
          color: #ff2a85;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .founder-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #1c1c1c;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .founder-tagline {
          font-size: 14px;
          font-weight: 600;
          color: #888;
          letter-spacing: 0.06em;
          margin-bottom: 28px;
          text-transform: uppercase;
        }
        .founder-story {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 28px;
        }
        .founder-story p {
          font-size: 15.5px;
          line-height: 1.8;
          color: #444;
        }
        .founder-story strong {
          color: #1c1c1c;
          font-weight: 600;
        }
        .founder-story em {
          color: #ff2a85;
          font-style: italic;
        }
        .founder-quote {
          border-left: 4px solid #ff2a85;
          padding: 16px 20px;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #fff0f5, #fff8fb);
          border-radius: 0 16px 16px 0;
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-style: italic;
          color: #2c2c2c;
          line-height: 1.7;
        }
        .founder-sign {
          font-size: 14px;
          font-weight: 600;
          color: #ff2a85;
          letter-spacing: 0.04em;
        }

        /* VALUES */
        .values-section {
          padding: 80px 24px;
          background: linear-gradient(135deg, #fff8fb 0%, #fff0f5 100%);
        }
        .values-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .values-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .values-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 700;
          color: #1c1c1c;
          margin-top: 12px;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 24px;
        }
        .value-card {
          background: white;
          border-radius: 24px;
          padding: 36px 28px;
          box-shadow: 0 4px 24px rgba(255, 42, 133, 0.07);
          border: 1px solid #ffe4ec;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
        }
        .value-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(255, 42, 133, 0.15);
        }
        .value-icon {
          font-size: 2.4rem;
          margin-bottom: 16px;
        }
        .value-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #1c1c1c;
          margin-bottom: 10px;
        }
        .value-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.7;
        }

        /* CTA */
        .about-cta {
          position: relative;
          padding: 90px 24px;
          background: linear-gradient(135deg, #ff2a85 0%, #ff758c 100%);
          text-align: center;
          overflow: hidden;
        }
        .cta-glow {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          top: -150px; right: -100px;
          pointer-events: none;
        }
        .cta-inner {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
        }
        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
        }
        .cta-sub {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.88);
          margin-bottom: 36px;
          line-height: 1.7;
        }
        .cta-btn {
          display: inline-block;
          background: white !important;
          color: #ff2a85 !important;
          font-weight: 700;
          padding: 14px 40px;
          border-radius: 100px;
          font-size: 15px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15) !important;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.2) !important;
        }
      `}</style>
    </div>
  );
}
