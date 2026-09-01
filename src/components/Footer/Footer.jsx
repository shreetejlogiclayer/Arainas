import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '../SocialIcons/SocialIcons';
import { COMPANY_INFO, SOCIAL_LINKS } from '../../config/siteConfig';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products / Services', path: '/products' },
    { name: 'Why Us / Benefits', path: '/why-us' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent("Hello, I would like to know more about ARAINA products and opportunities.")}`;

  return (
    <footer id="contact" className="bg-araina-black text-araina-white py-16 border-t border-araina-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-araina-white/10">

          {/* Brand Info */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src="/assets/logo/araina-logo-light.png"
                alt="Araina Logo Light"
                className="h-10 w-auto object-contain mb-4 hover:opacity-90 transition-opacity"
              />
            </Link>
            <p className="text-xs uppercase tracking-[0.25em] text-araina-pink font-semibold mb-4">
              {COMPANY_INFO.tagline}
            </p>
            <p className="text-xs text-araina-white/60 font-light leading-relaxed max-w-sm mb-6">
              {COMPANY_INFO.description}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.instagram ? (
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-araina-white/5 border border-araina-white/10 flex items-center justify-center text-araina-white/80 hover:text-araina-pink hover:border-araina-pink transition-all"
                >
                  <InstagramIcon size={16} />
                </a>
              ) : null}

              {SOCIAL_LINKS.facebook ? (
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-araina-white/5 border border-araina-white/10 flex items-center justify-center text-araina-white/80 hover:text-araina-pink hover:border-araina-pink transition-all"
                >
                  <FacebookIcon size={16} />
                </a>
              ) : null}

              {SOCIAL_LINKS.youtube ? (
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-araina-white/5 border border-araina-white/10 flex items-center justify-center text-araina-white/80 hover:text-araina-pink hover:border-araina-pink transition-all"
                >
                  <YoutubeIcon size={16} />
                </a>
              ) : null}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                title="Connect on WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-araina-white font-bold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-light text-araina-white/70">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className="hover:text-araina-pink transition-colors py-1 inline-block text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Details & Quick Contact */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-araina-white font-bold mb-4">
              Company & Contact
            </h4>
            <p className="text-xs text-araina-white/90 font-medium mb-1">
              {COMPANY_INFO.name}
            </p>
            <p className="text-[11px] text-araina-white/50 font-light leading-relaxed mb-4">
              Flagship Brand: {COMPANY_INFO.brand}<br />
              Feminine Hygiene & Wellness Platform
            </p>

            <div className="space-y-2 text-xs text-araina-white/70 font-light">
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-araina-pink" />
                <span>{COMPANY_INFO.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-araina-blue" />
                <span>{COMPANY_INFO.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-araina-pink" />
                <span>{COMPANY_INFO.address}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-araina-white/40 font-light">
          <p>© {currentYear} {COMPANY_INFO.name} / {COMPANY_INFO.brand}. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-3 sm:mt-0">
            <Link to="/contact" className="hover:text-araina-pink transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-araina-pink transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
