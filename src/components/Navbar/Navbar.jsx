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
    { name: "About Us", id: "about", path: "/about" },
    { name: "Araina", id: "araina", path: "/araina" },
    { name: "Product", id: "product", path: "/products" },
    { name: "Women’s Health", id: "womens-health", path: "/womens-health" },
    { name: "Opportunity", id: "opportunity", path: "/opportunity" },
    { name: "Media", id: "media", path: "/media" },
    { name: "Contact", id: "contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

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
    if (item.path === "/") {
      return (
        location.pathname === "/" &&
        (!activeSection || activeSection === "home")
      );
    }
    return location.pathname === item.path;
  };

  // ==================== JOIN US BUTTON ====================
  const handleJoinUsClick = () => {
    setIsOpen(false);
    // Open Araina User Portal in a new tab
    window.open("/portal", "_blank", "noopener,noreferrer");
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
            ? "bg-araina-white/95 backdrop-blur-md py-2 shadow-sm border-b border-araina-pink/10"
            : "bg-transparent py-3"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 px-2 sm:gap-3 sm:px-6 lg:px-8">
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
            className="mr-1 flex min-w-0 flex-shrink items-center py-1.5 pr-1 group xl:mr-5"
            aria-label="ARAINA Home"
          >
            <img
              src="/assets/logo/araina-logo-dark.png"
              alt="ARAINA Logo"
              className={`
                w-auto object-contain
                transition-all duration-300
                group-hover:scale-[1.03]
                ${isScrolled ? "h-12 sm:h-16" : "h-12 sm:h-16 lg:h-20"}
              `}
            />
          </Link>

          {/* ==================== DESKTOP NAVIGATION ==================== */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-5 2xl:gap-7">
            {menuItems.map((item) => {
              const active = isItemActive(item);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`text-xs uppercase tracking-[0.08em] font-semibold transition-all duration-300 relative py-2 whitespace-nowrap ${
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
          {/* <div className="hidden xl:block flex-shrink-0">
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
                px-5
                py-2.5
                rounded-full
                transition-all
                duration-300
                shadow-md
                hover:shadow-lg
                shadow-araina-pink/20
              "
            >
              Become a Member
            </button>
          </div> */}

          {/* ==================== MOBILE JOIN CTA ==================== */}
          {/* <button
            onClick={handleJoinUsClick}
            aria-label="Become a Member"
            className="araina-heartbeat xl:hidden mr-1 flex-shrink-0 whitespace-nowrap rounded-full bg-araina-pink px-2 py-2 text-[9px] font-semibold uppercase tracking-wide text-araina-white shadow-md shadow-araina-pink/20 transition-all duration-300 hover:bg-araina-pink/90 hover:shadow-lg min-[360px]:px-3 min-[360px]:text-[10px] sm:px-4 sm:text-xs"
          >
            <span className="min-[360px]:hidden">Join</span>
            <span className="hidden min-[360px]:inline">Become a Member</span>
          </button> */}

          {/* ==================== MOBILE MENU TOGGLE ==================== */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden flex-shrink-0 p-1.5 text-araina-black transition-colors hover:text-araina-pink sm:p-2"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* ==================== MOBILE DRAWER ==================== */}
      <div
        className={`fixed inset-0 z-40 overflow-y-auto bg-araina-white px-6 py-24 transition-all duration-500 xl:hidden flex flex-col justify-center sm:px-8 ${
          isOpen
            ? "opacity-100 pointer-events-auto translate-x-0"
            : "opacity-0 pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-5 text-center sm:gap-6">
          {menuItems.map((item, idx) => {
            const active = isItemActive(item);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                style={{
                  transitionDelay: isOpen ? `${idx * 50}ms` : "0ms",
                }}
                className={`text-base leading-snug uppercase tracking-[0.12em] font-semibold transition-all duration-300 sm:text-lg sm:tracking-widest ${
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
        </div>
      </div>
    </>
  );
};

export default Navbar;
