import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", id: "home", path: "/" },
    { name: "About", id: "about", path: "/about" },
    { name: "Why Araina", id: "why-araina", path: "/why-us" },
    { name: "Our Product", id: "product", path: "/products" },
    { name: "Contact", id: "contact", path: "/contact" },
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

  const handleNavClick = (item) => {
    setIsOpen(false);

    if (!item) return;

    // ==================== HOME ====================
    if (item.path === "/") {
      if (location.pathname !== "/") {
        navigate("/");

        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 100);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      if (setActiveSection) {
        setActiveSection("home");
      }

      return;
    }

    // ==================== SECTION NAVIGATION ====================
    if (item.sectionId) {
      if (location.pathname !== "/") {
        navigate("/");

        setTimeout(() => {
          const element = document.getElementById(item.sectionId);

          if (element) {
            const offset = 75;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;

            window.scrollTo({
              top: elementPosition - offset,
              behavior: "smooth",
            });
          }
        }, 150);
      } else {
        const element = document.getElementById(item.sectionId);

        if (element) {
          const offset = 75;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;

          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }
      }

      if (setActiveSection) {
        setActiveSection(item.sectionId);
      }

      return;
    }

    // ==================== DIRECT PAGE ROUTE NAVIGATION ====================
    navigate(item.path);
  };

  // ==================== DETERMINE ACTIVE ITEM ====================
  const isItemActive = (item) => {
    if (location.pathname === "/about" && item.id === "about") {
      return true;
    }

    if (location.pathname === "/products" && item.id === "product") {
      return true;
    }

    if (location.pathname === "/why-us" && item.id === "why-araina") {
      return true;
    }

    if (location.pathname === "/contact" && item.id === "contact") {
      return true;
    }

    if (location.pathname === "/") {
      if (activeSection === item.id) {
        return true;
      }

      if (item.id === "home" && (!activeSection || activeSection === "home")) {
        return true;
      }
    }

    return false;
  };

  // ==================== JOIN US BUTTON ====================
  const handleJoinUsClick = () => {
    setIsOpen(false);
    // Open Araina User Portal in a new tab
    window.open("/portal/login", "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* =========================================================
          HEARTBEAT ANIMATION
          Kept inside this component so it works without
          Tailwind configuration or external CSS.
          ========================================================= */}
      <style>
        {`
          @keyframes arainaHeartbeat {
            0% {
              transform: scale(1);
            }

            8% {
              transform: scale(1.06);
            }

            16% {
              transform: scale(1);
            }

            24% {
              transform: scale(1.09);
            }

            32% {
              transform: scale(1);
            }

            45% {
              transform: scale(1);
            }

            100% {
              transform: scale(1);
            }
          }

          .araina-heartbeat {
            animation: arainaHeartbeat 2s ease-in-out infinite;
            transform-origin: center;
          }

          .araina-heartbeat:hover {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .araina-heartbeat {
              animation: none;
            }
          }
        `}
      </style>

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
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }
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
          </Link>

          {/* ==================== DESKTOP NAVIGATION ==================== */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {menuItems.map((item) => {
              const active = isItemActive(item);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`text-xs uppercase tracking-widest font-medium transition-all duration-300 relative py-2 whitespace-nowrap ${
                    active
                      ? "text-araina-pink"
                      : "text-araina-black/75 hover:text-araina-pink"
                  }`}
                >
                  {item.name}

                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-araina-pink transition-transform duration-300 origin-left ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* ==================== DESKTOP JOIN CTA ==================== */}
          <div className="hidden lg:block flex-shrink-0">
            <button
              onClick={handleJoinUsClick}
              className="
                araina-heartbeat
                bg-araina-pink
                hover:bg-araina-pink/90
                text-araina-white
                text-xs
                uppercase
                tracking-widest
                font-semibold
                px-6
                py-3
                rounded-full
                transition-all
                duration-300
                shadow-md
                hover:shadow-lg
                shadow-araina-pink/20
              "
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
          {menuItems.map((item, idx) => {
            const active = isItemActive(item);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                style={{
                  transitionDelay: isOpen ? `${idx * 50}ms` : "0ms",
                }}
                className={`text-lg uppercase tracking-widest font-semibold transition-all duration-300 ${
                  active
                    ? "text-araina-pink scale-105"
                    : "text-araina-black/80 hover:text-araina-pink"
                } ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                {item.name}
              </button>
            );
          })}

          {/* ==================== MOBILE JOIN CTA ==================== */}
          <div
            className={`mt-8 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } transition-all duration-500 delay-300`}
          >
            <button
              onClick={handleJoinUsClick}
              className="
                araina-heartbeat
                bg-araina-pink
                hover:bg-araina-pink/90
                text-araina-white
                text-xs
                uppercase
                tracking-widest
                font-semibold
                px-10
                py-4
                rounded-full
                transition-all
                duration-300
                shadow-md
                hover:shadow-lg
                shadow-araina-pink/20
              "
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
