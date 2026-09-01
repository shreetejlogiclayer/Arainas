import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from "../components/SocialIcons/SocialIcons";
import { COMPANY_INFO, SOCIAL_LINKS, EMAIL_CONFIG } from "../config/siteConfig";

const ContactPage = () => {
  useEffect(() => {
    document.title = "Contact Us | Araina - Reach Out To Our Team";
  }, []);

  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    subject: "Product Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = "Full Name is required.";
    }

    if (!formData.user_email.trim()) {
      newErrors.user_email = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      newErrors.user_email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message content is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage("");

    try {
      const hasEmailJsKeys =
        EMAIL_CONFIG.serviceId &&
        EMAIL_CONFIG.templateId &&
        EMAIL_CONFIG.publicKey;

      if (hasEmailJsKeys) {
        await emailjs.send(
          EMAIL_CONFIG.serviceId,
          EMAIL_CONFIG.templateId,
          {
            user_name: formData.user_name,
            user_email: formData.user_email,
            user_phone: formData.user_phone || "N/A",
            subject: formData.subject,
            message: formData.message,
            to_name: COMPANY_INFO.name,
          },
          EMAIL_CONFIG.publicKey,
        );

        setSubmitStatus("success");
        setStatusMessage(
          "Thank you! Your message has been sent successfully. Our team will get back to you shortly.",
        );
        setFormData({
          user_name: "",
          user_email: "",
          user_phone: "",
          subject: "Product Inquiry",
          message: "",
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        setSubmitStatus("success");
        setStatusMessage(
          "Thank you! Your enquiry has been received. (Note: EmailJS environment variables can be configured in .env for live email routing).",
        );
        setFormData({
          user_name: "",
          user_email: "",
          user_phone: "",
          subject: "Product Inquiry",
          message: "",
        });
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitStatus("error");
      setStatusMessage(
        "Unable to send message at this moment. Please try again or reach out directly via WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
    `Hello ARAINA Team, I would like to make an inquiry regarding: ${formData.subject}`,
  )}`;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-araina-white text-araina-black">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-tr from-araina-white via-araina-pink/5 to-araina-blue/5 overflow-hidden border-b border-araina-pink/10">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-araina-pink bg-araina-pink/10 px-4 py-2 rounded-full mb-6"
          >
            Contact & Support
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6"
          >
            Let's Connect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-araina-pink to-araina-blue">
              With Us
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-araina-black/75 font-light leading-relaxed mb-8"
          >
            Have a question about ARAINA products, need more information about
            our mission, or want to explore business and community
            opportunities? Reach out to our team.
          </motion.p>
        </div>
      </section>

      {/* ==================== CONTACT CONTENT SECTION ==================== */}
      <section className="py-20 bg-araina-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Contact Cards & Info */}
            <div className="lg:col-span-5 space-y-8">
              {/* Image banner */}
              <div className="rounded-3xl overflow-hidden border border-araina-pink/10 shadow-sm">
                <img
                  src="/assets/images/araina_contact_hero.jpg"
                  alt="ARAINA Support Team Connection"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Company Info Box */}
              <div className="bg-gradient-to-br from-araina-pink/5 via-araina-white to-araina-blue/5 border border-araina-pink/15 rounded-3xl p-8 shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-widest text-araina-pink block mb-2">
                  Company Details
                </span>
                <h3 className="text-xl font-bold text-araina-black mb-1">
                  {COMPANY_INFO.name}
                </h3>
                <p className="text-xs text-araina-black/70 font-light mb-6">
                  Flagship Brand: <strong>{COMPANY_INFO.brand}</strong>
                </p>

                <div className="space-y-4 text-xs font-light text-araina-black/80">
                  <div className="flex items-start gap-3">
                    <Mail
                      size={18}
                      className="text-araina-pink shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-semibold block text-araina-black">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${COMPANY_INFO.email}`}
                        className="hover:text-araina-pink transition-colors"
                      >
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone
                      size={18}
                      className="text-araina-blue shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-semibold block text-araina-black">
                        Phone Number
                      </span>
                      <a
                        href={`tel:${COMPANY_INFO.phone}`}
                        className="hover:text-araina-blue transition-colors"
                      >
                        {COMPANY_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-araina-pink shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-semibold block text-araina-black">
                        Office Location
                      </span>
                      <span>{COMPANY_INFO.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock
                      size={18}
                      className="text-araina-blue shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-semibold block text-araina-black">
                        Business Hours
                      </span>
                      <span>{COMPANY_INFO.businessHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Box */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                    Instant WhatsApp Support
                  </h4>
                  <p className="text-xs text-emerald-800/80 font-light mt-1">
                    Connect directly with our team on WhatsApp for quick
                    responses.
                  </p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-full transition-all shrink-0 flex items-center gap-2 shadow-md"
                >
                  Chat Now
                </a>
              </div>

              {/* Social Media Links Box */}
              <div className="bg-araina-white border border-araina-pink/10 rounded-3xl p-6">
                <h4 className="text-xs uppercase font-bold tracking-widest text-araina-black mb-4">
                  Follow Our Social Channels
                </h4>
                <div className="flex items-center gap-4">
                  {SOCIAL_LINKS.instagram ? (
                    <a
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-araina-black/80 hover:text-araina-pink transition-colors p-2 rounded-xl bg-araina-pink/5 border border-araina-pink/10"
                    >
                      <InstagramIcon size={18} className="text-araina-pink" />
                      <span>Instagram</span>
                    </a>
                  ) : null}

                  {SOCIAL_LINKS.facebook ? (
                    <a
                      href={SOCIAL_LINKS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-araina-black/80 hover:text-araina-pink transition-colors p-2 rounded-xl bg-araina-pink/5 border border-araina-pink/10"
                    >
                      <FacebookIcon size={18} className="text-araina-pink" />
                      <span>Facebook</span>
                    </a>
                  ) : null}

                  {SOCIAL_LINKS.youtube ? (
                    <a
                      href={SOCIAL_LINKS.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-araina-black/80 hover:text-araina-pink transition-colors p-2 rounded-xl bg-araina-pink/5 border border-araina-pink/10"
                    >
                      <YoutubeIcon size={18} className="text-araina-pink" />
                      <span>YouTube</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right Column: EmailJS Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-araina-white border border-araina-pink/15 rounded-3xl p-8 sm:p-12 shadow-lg relative">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-2">
                  Send Us A Message
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-araina-black tracking-tight mb-2">
                  Contact Form
                </h2>
                <p className="text-xs sm:text-sm text-araina-black/60 font-light leading-relaxed mb-8">
                  Fill out the form below. Our customer support team will
                  process your enquiry promptly.
                </p>

                <AnimatePresence mode="wait">
                  {submitStatus === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center my-6"
                    >
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-emerald-900 mb-2">
                        Message Received!
                      </h3>
                      <p className="text-xs text-emerald-800 font-light leading-relaxed mb-6">
                        {statusMessage}
                      </p>
                      <button
                        onClick={() => setSubmitStatus(null)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-full transition-all"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      noValidate
                    >
                      {submitStatus === "error" && (
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-800 text-xs font-light">
                          <AlertCircle
                            size={18}
                            className="text-rose-600 shrink-0 mt-0.5"
                          />
                          <span>{statusMessage}</span>
                        </div>
                      )}

                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="user_name"
                          className="block text-xs uppercase font-bold tracking-wider text-araina-black mb-2"
                        >
                          Full Name <span className="text-araina-pink">*</span>
                        </label>
                        <input
                          id="user_name"
                          type="text"
                          name="user_name"
                          value={formData.user_name}
                          onChange={handleChange}
                          placeholder="Your Full Name"
                          disabled={isSubmitting}
                          className={`w-full bg-araina-pink/5 border ${
                            errors.user_name
                              ? "border-rose-500"
                              : "border-araina-pink/15"
                          } rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-araina-black focus:outline-none focus:border-araina-pink transition-all font-light`}
                        />
                        {errors.user_name && (
                          <span className="text-[11px] text-rose-500 mt-1 block">
                            {errors.user_name}
                          </span>
                        )}
                      </div>

                      {/* Email & Phone grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="user_email"
                            className="block text-xs uppercase font-bold tracking-wider text-araina-black mb-2"
                          >
                            Email Address{" "}
                            <span className="text-araina-pink">*</span>
                          </label>
                          <input
                            id="user_email"
                            type="email"
                            name="user_email"
                            value={formData.user_email}
                            onChange={handleChange}
                            placeholder="your.email@domain.com"
                            disabled={isSubmitting}
                            className={`w-full bg-araina-pink/5 border ${
                              errors.user_email
                                ? "border-rose-500"
                                : "border-araina-pink/15"
                            } rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-araina-black focus:outline-none focus:border-araina-pink transition-all font-light`}
                          />
                          {errors.user_email && (
                            <span className="text-[11px] text-rose-500 mt-1 block">
                              {errors.user_email}
                            </span>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="user_phone"
                            className="block text-xs uppercase font-bold tracking-wider text-araina-black mb-2"
                          >
                            Phone Number
                          </label>
                          <input
                            id="user_phone"
                            type="tel"
                            name="user_phone"
                            value={formData.user_phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            disabled={isSubmitting}
                            className="w-full bg-araina-pink/5 border border-araina-pink/15 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-araina-black focus:outline-none focus:border-araina-pink transition-all font-light"
                          />
                        </div>
                      </div>

                      {/* Subject dropdown */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-xs uppercase font-bold tracking-wider text-araina-black mb-2"
                        >
                          Subject / Enquiry Type
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full bg-araina-pink/5 border border-araina-pink/15 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-araina-black focus:outline-none focus:border-araina-pink transition-all font-light"
                        >
                          <option value="Product Inquiry">
                            Product Inquiry (Araina Pads)
                          </option>
                          <option value="Business / Distribution">
                            Business & Distribution Enquiry
                          </option>
                          <option value="Women Opportunity Program">
                            Araina Women Opportunity
                          </option>
                          <option value="General Question">
                            General Question
                          </option>
                        </select>
                      </div>

                      {/* Message Textarea */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-xs uppercase font-bold tracking-wider text-araina-black mb-2"
                        >
                          Your Message{" "}
                          <span className="text-araina-pink">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Write your detailed query or message here..."
                          disabled={isSubmitting}
                          className={`w-full bg-araina-pink/5 border ${
                            errors.message
                              ? "border-rose-500"
                              : "border-araina-pink/15"
                          } rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-araina-black focus:outline-none focus:border-araina-pink transition-all font-light resize-none`}
                        />
                        {errors.message && (
                          <span className="text-[11px] text-rose-500 mt-1 block">
                            {errors.message}
                          </span>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-araina-pink hover:bg-araina-pink/90 disabled:opacity-60 text-araina-white text-xs uppercase tracking-widest font-bold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg shadow-araina-pink/20 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            Submit Enquiry <Send size={14} />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
