import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  LoaderCircle,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PortalLayout from "../PortalLayout/PortalLayout";
import {
  formatPhone,
  isValidIndianPhone,
  isValidPIN,
} from "../../utils/formatters";

const fieldClassName =
  "w-full min-w-0 rounded-xl border border-araina-pink/20 bg-white px-4 py-3 text-sm text-araina-black outline-none transition placeholder:text-araina-black/35 focus:border-araina-pink focus:ring-4 focus:ring-araina-pink/10 disabled:bg-gray-50";

const initialForm = {
  fullName: "",
  alternateMobile: "",
  referredByCode: "",
  houseNumber: "",
  building: "",
  street: "",
  area: "",
  landmark: "",
  village: "",
  city: "",
  district: "",
  state: "",
  pinCode: "",
};

const fieldLabels = {
  fullName: "Full name",
  alternateMobile: "Alternate mobile",
  referredByCode: "Referral code",
  houseNumber: "House / flat number",
  building: "Building / apartment",
  street: "Street / road",
  area: "Area / locality",
  landmark: "Nearby landmark",
  village: "Village",
  city: "City / town",
  district: "District",
  state: "State",
  pinCode: "PIN code",
};

const fieldMaxLengths = {
  fullName: 255,
  alternateMobile: 20,
  referredByCode: 50,
  houseNumber: 100,
  building: 100,
  street: 255,
  area: 100,
  landmark: 100,
  village: 100,
  city: 100,
  district: 100,
  state: 100,
  pinCode: 6,
};

const ProfileForm = ({ mode = "create", children }) => {
  const navigate = useNavigate();
  const isEditing = mode === "edit";
  const [form, setForm] = useState(initialForm);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error?.message || "Unable to load your account details.",
          );
        }

        const profile = result.data.profile || {};
        const address = result.data.address || {};
        setAccount(result.data);
        setForm({
          ...initialForm,
          fullName: profile.fullName || "",
          alternateMobile: profile.alternateMobile || "",
          referredByCode: profile.referredByCode || "",
          houseNumber: address.houseNumber || "",
          building: address.building || "",
          street: address.street || "",
          area: address.area || "",
          landmark: address.landmark || "",
          village: address.village || "",
          city: address.city || "",
          district: address.district || "",
          state: address.state || "",
          pinCode: address.pinCode || "",
        });

        if (!isEditing && profile.fullName?.trim() && address.id) {
          navigate("/portal/dashboard", { replace: true });
        }
      } catch (loadError) {
        if (loadError.name !== "AbortError") setError(loadError.message);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => controller.abort();
  }, [isEditing, navigate]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]:
        name === "referredByCode"
          ? value.toUpperCase()
          : name === "pinCode"
            ? value.replace(/\D/g, "").slice(0, 6)
            : value,
    }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setError("");
    setSuccess("");
  };

  const validate = () => {
    const nextErrors = {};
    const requiredFields = [
      "fullName",
      "houseNumber",
      "street",
      "area",
      "city",
      "district",
      "state",
      "pinCode",
    ];

    for (const field of requiredFields) {
      if (!form[field].trim()) {
        nextErrors[field] = `${fieldLabels[field]} is required.`;
      }
    }
    if (
      form.fullName.trim() &&
      (form.fullName.trim().length < 2 || form.fullName.trim().length > 255)
    ) {
      nextErrors.fullName = "Name must be between 2 and 255 characters.";
    }
    if (
      form.alternateMobile.trim() &&
      !isValidIndianPhone(form.alternateMobile)
    ) {
      nextErrors.alternateMobile =
        "Enter a valid 10-digit Indian mobile number.";
    }
    if (form.pinCode.trim() && !isValidPIN(form.pinCode)) {
      nextErrors.pinCode = "Enter a valid 6-digit PIN code.";
    }
    if (form.referredByCode.trim().length > 50) {
      nextErrors.referredByCode = "Referral code must be 50 characters or fewer.";
    }

    for (const [field, maxLength] of Object.entries(fieldMaxLengths)) {
      if (field === "fullName" || field === "alternateMobile" ||
          field === "referredByCode" || field === "pinCode") continue;
      if (form[field].trim().length > maxLength) {
        nextErrors[field] = `${fieldLabels[field]} must be ${maxLength} characters or fewer.`;
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          alternateMobile: form.alternateMobile.trim(),
          referredByCode: form.referredByCode.trim(),
          address: {
            houseNumber: form.houseNumber.trim(),
            building: form.building.trim(),
            street: form.street.trim(),
            area: form.area.trim(),
            landmark: form.landmark.trim(),
            village: form.village.trim(),
            city: form.city.trim(),
            district: form.district.trim(),
            state: form.state.trim(),
            pinCode: form.pinCode.trim(),
          },
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Unable to save your profile.");
      }

      if (isEditing) {
        setSuccess("Your profile and address have been updated.");
      } else {
        navigate("/portal/dashboard", { replace: true });
      }
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (
    name,
    { optional = false, autoComplete, type = "text", inputMode, maxLength } = {},
  ) => (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-araina-black/80"
      >
        {fieldLabels[name]}
        {!optional && <span className="ml-1 text-araina-pink">*</span>}
        {optional && (
          <span className="ml-2 font-normal normal-case tracking-normal text-araina-black/40">
            Optional
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength || fieldMaxLengths[name]}
        required={!optional}
        value={form[name]}
        onChange={updateField}
        placeholder={
          name === "pinCode" ? "6-digit PIN code" : `Enter ${fieldLabels[name].toLowerCase()}`
        }
        aria-invalid={Boolean(fieldErrors[name])}
        aria-describedby={fieldErrors[name] ? `${name}-error` : undefined}
        className={`${fieldClassName} ${
          fieldErrors[name] ? "border-red-300 bg-red-50" : ""
        }`}
        disabled={isSaving}
      />
      {fieldErrors[name] && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">
          {fieldErrors[name]}
        </p>
      )}
    </div>
  );

  return (
    <PortalLayout showHeader={isEditing} isAuthenticated>
      <div className="w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-araina-pink/15 bg-white/95 shadow-xl shadow-araina-pink/5 backdrop-blur"
        >
          <div className="bg-gradient-to-r from-araina-pink/10 via-white to-araina-blue/10 px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
            <div className="flex items-start gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-araina-pink/10 text-araina-pink sm:flex">
                <UserRound size={25} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-araina-pink">
                  {isEditing ? "Your account" : "One last step"}
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-araina-black sm:text-3xl">
                  {isEditing ? "My Profile" : "Complete your profile"}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-araina-black/60">
                  Add your contact and delivery details. Required fields are
                  marked with an asterisk; your address is saved securely to
                  your Araina account.
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-8 sm:py-8 lg:px-10">
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-sm text-araina-black/60">
                <LoaderCircle
                  className="animate-spin text-araina-pink"
                  size={20}
                />
                Loading your account…
              </div>
            ) : error && !account ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={() => navigate("/portal/login", { replace: true })}
                  className="mt-3 text-sm font-semibold text-araina-pink hover:underline"
                >
                  Sign in again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-7">
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}
                {success && (
                  <div
                    role="status"
                    className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                  >
                    <CheckCircle2 size={18} aria-hidden="true" />
                    {success}
                  </div>
                )}

                <section className="rounded-2xl border border-araina-pink/10 bg-white p-4 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-araina-pink/10 text-araina-pink">
                      <UserRound size={19} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-araina-black">
                        Personal details
                      </h2>
                      <p className="mt-0.5 text-xs text-araina-black/50">
                        Your basic contact information
                      </p>
                    </div>
                  </div>
                  <div className="mb-5 flex items-start gap-3 rounded-xl bg-araina-blue/5 p-4">
                    <LockKeyhole
                      className="mt-0.5 shrink-0 text-araina-blue"
                      size={17}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-araina-black/70">
                        Registered mobile · used to sign in
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-araina-black">
                        {account?.mobile
                          ? formatPhone(account.mobile)
                          : "Mobile number unavailable"}
                        {account?.mobileVerified && (
                          <span className="ml-2 text-xs font-medium text-green-700">
                            Verified
                          </span>
                        )}
                      </p>
                      <p className="mt-1 break-all text-xs text-araina-black/55">
                        Email (optional): {account?.email || "Not added"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                                    {renderField("fullName", { autoComplete: "name" })}
                    {renderField("alternateMobile", {
                      optional: true,
                      autoComplete: "tel-national",
                      inputMode: "tel",
                      type: "tel",
                    })}
                    {renderField("referredByCode", {
                      optional: true,
                    })}
                  </div>
                </section>

                <section className="rounded-2xl border border-araina-blue/15 bg-white p-4 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-araina-blue/10 text-araina-blue">
                      <Home size={19} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-araina-black">
                        Delivery address
                      </h2>
                      <p className="mt-0.5 text-xs text-araina-black/50">
                        Used to deliver your Araina orders · India
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    {renderField("houseNumber", { autoComplete: "address-line1" })}
                    {renderField("building", {
                      optional: true,
                      autoComplete: "address-line2",
                    })}
                    {renderField("street", { autoComplete: "street-address" })}
                    {renderField("area")}
                    {renderField("landmark", { optional: true })}
                    {renderField("village", { optional: true })}
                    {renderField("city", { autoComplete: "address-level2" })}
                    {renderField("district")}
                    {renderField("state", { autoComplete: "address-level1" })}
                    {renderField("pinCode", {
                      autoComplete: "postal-code",
                      inputMode: "numeric",
                    })}
                  </div>
                </section>

                <div className="flex flex-col gap-3 border-t border-araina-pink/10 pt-6 sm:flex-row sm:justify-end">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => navigate("/portal/dashboard")}
                      disabled={isSaving}
                      className="min-h-12 rounded-xl border border-araina-pink/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-araina-black/70 transition hover:border-araina-pink hover:text-araina-pink disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-araina-pink px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-lg shadow-araina-pink/20 transition hover:-translate-y-0.5 hover:bg-araina-pink/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-56"
                  >
                    {isSaving ? (
                      <>
                        <LoaderCircle className="animate-spin" size={17} />
                        Saving details…
                      </>
                    ) : (
                      <>
                        {isEditing ? "Save changes" : "Complete profile"}
                        <ArrowRight size={17} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-center text-xs text-araina-black/45">
                  <span className="text-araina-pink">*</span> Required fields
                </p>
              </form>
            )}
          </div>
        </motion.div>
        {isEditing && children}
      </div>
    </PortalLayout>
  );
};

export default ProfileForm;
