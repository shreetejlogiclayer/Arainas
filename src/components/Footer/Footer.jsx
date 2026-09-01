import React from 'react';

const Footer = ({ setActiveSection }) => {
  const menuItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Our Purpose', id: 'purpose' },
    { name: 'Product', id: 'product' },
    { name: 'Why Araina', id: 'why-araina' },
    { name: 'Join Us', id: 'join-us' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      if (setActiveSection) setActiveSection(id);
    }
  };

  return (
    <footer id="contact" className="bg-araina-black text-araina-white py-16 border-t border-araina-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-araina-white/10">

          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col items-start">
            <img
              src="/assets/logo/araina-logo-light.png"
              alt="Araina Logo Light"
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-xs uppercase tracking-[0.25em] text-araina-pink font-semibold mb-4">
              Empowering To Rise
            </p>
            <p className="text-xs text-araina-white/60 font-light leading-relaxed max-w-sm">
              Royo India LLP is a purpose-driven platform for women's health, wellness, education, and opportunity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-araina-white font-bold mb-4">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs font-light text-araina-white/70">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    className="hover:text-araina-pink transition-colors py-1 inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Details */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-araina-white font-bold mb-4">
              Company
            </h4>
            <p className="text-xs text-araina-white/80 font-medium mb-1">
              Royo India LLP
            </p>
            <p className="text-[11px] text-araina-white/50 font-light leading-relaxed">
              Flagship Brand: ARAINA<br />
              Personal Care & Feminine Wellness Platform
            </p>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-araina-white/40 font-light">
          <p>© 2026 Royo India LLP / Araina. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Design By: LogicLayer</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
