import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Our Purpose", id: "purpose" },
    { name: "Product", id: "product" },
    { name: "Why Araina", id: "why-araina" },
    { name: "Join Us", id: "join-us" },
    { name: "Contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (id) => {
    setIsOpen(false);

    const element = document.getElementById(id);

    if (element) {
      const offset = 75;

      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(id);
    }
  };

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-araina-white/95 backdrop-blur-md py-1.5 shadow-sm border-b border-araina-pink/10"
            : "bg-transparent py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* ==================== LOGO ==================== */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("home");
            }}
            className="flex items-center flex-shrink-0 group"
            aria-label="ARAINA Home"
          >
            <img
              src="/assets/logo/araina-logo-dark.png"
              alt="ARAINA Logo"
              className={`
                w-auto object-contain
                transition-all duration-300
                group-hover:scale-[1.03]
                ${isScrolled ? "h-14 sm:h-16" : "h-20 sm:h-22 lg:h-24"}
              `}
            />
          </a>

          {/* ==================== DESKTOP NAVIGATION ==================== */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`text-xs uppercase tracking-widest font-medium transition-all duration-300 relative py-2 whitespace-nowrap ${
                  activeSection === item.id
                    ? "text-araina-pink"
                    : "text-araina-black/75 hover:text-araina-pink"
                }`}
              >
                {item.name}

                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-araina-pink transition-transform duration-300 origin-left ${
                    activeSection === item.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* ==================== DESKTOP JOIN CTA ==================== */}
          <div className="hidden lg:block flex-shrink-0">
            <button
              onClick={() => handleNavClick("join-us")}
              className="bg-araina-pink hover:bg-araina-pink/90 text-araina-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:-translate-y-[2px] active:translate-y-0 shadow-md hover:shadow-lg shadow-araina-pink/20"
            >
              Join Us
            </button>
          </div>

          {/* ==================== MOBILE MENU TOGGLE ==================== */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-araina-black hover:text-araina-pink transition-colors p-2 flex-shrink-0"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* ==================== MOBILE DRAWER ==================== */}
      <div
        className={`fixed inset-0 z-40 bg-araina-white transition-all duration-500 lg:hidden flex flex-col justify-center px-8 ${
          isOpen
            ? "opacity-100 pointer-events-auto translate-x-0"
            : "opacity-0 pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 text-center">
          {menuItems.map((item, idx) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              style={{
                transitionDelay: isOpen ? `${idx * 50}ms` : "0ms",
              }}
              className={`text-lg uppercase tracking-widest font-semibold transition-all duration-300 ${
                activeSection === item.id
                  ? "text-araina-pink scale-105"
                  : "text-araina-black/80 hover:text-araina-pink"
              } ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {item.name}
            </a>
          ))}

          <div
            className={`mt-8 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } transition-all duration-500 delay-300`}
          >
            <button
              onClick={() => handleNavClick("join-us")}
              className="bg-araina-pink hover:bg-araina-pink/90 text-araina-white text-xs uppercase tracking-widest font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg shadow-araina-pink/20"
            >
              Join Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
