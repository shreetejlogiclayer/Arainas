/**
 * ARAINA / Royo India LLP - Site Configuration
 *
 * Update contact details, social links, and EmailJS environment variables here.
 */

export const COMPANY_INFO = {
  name: "Royo India LLP",
  brand: "ARAINA",
  tagline: "Empowering To Rise",
  description:
    "Royo India LLP is a purpose-driven platform for women's health, wellness, education, and opportunity.",
  detailedDescription:
    "Royo India LLP is a purpose-driven health, wellness, and personal-care company focused on bringing together women's health, menstrual wellness, education, entrepreneurship, and empowerment.",
  email: "care@arainas.com",
  phone: "+91 98765 43210",
  whatsappNumber: "919876543210",
  address: "Pune, Maharastra, India",
  businessHours: "Mon - Sat: 9:00 AM - 6:00 PM IST",
};

/**
 * Social Media Links
 * If a URL is empty, the icon will remain in placeholder mode or be hidden according to UI rules.
 */
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/arainawellness",
  facebook: "https://facebook.com/arainawellness",
  youtube: "https://youtube.com/@arainawellness",
};

/**
 * EmailJS Configuration
 * Set your EmailJS keys in your .env file or deployment environment variables:
 * VITE_EMAILJS_SERVICE_ID=your_service_id
 * VITE_EMAILJS_TEMPLATE_ID=your_template_id
 * VITE_EMAILJS_PUBLIC_KEY=your_public_key
 */
export const EMAIL_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
};
