import React, { useCallback, useEffect, useState } from "react";
import {
  Camera,
  Check,
  CircleUserRound,
  Home,
  LoaderCircle,
  MapPin,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { getPortalErrorMessage } from "../../utils/errorMessages";
import { requestPortalJson } from "../../utils/portalApi";

const emptyAddress = {
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

const addressFields = [
  ["houseNumber", "House / flat number", true, 100],
  ["building", "Building / apartment", false, 100],
  ["street", "Street / road", true, 255],
  ["area", "Area / locality", true, 100],
  ["landmark", "Nearby landmark", false, 100],
  ["village", "Village", false, 100],
  ["city", "City / town", true, 100],
  ["district", "District", true, 100],
  ["state", "State", true, 100],
  ["pinCode", "PIN code", true, 6],
];

const inputClass =
  "w-full min-w-0 rounded-lg border border-araina-pink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-araina-pink focus:ring-2 focus:ring-araina-pink/10";

const apiRequest = async (url, options = {}) => {
  return requestPortalJson(url, options);
};

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAddresses = useCallback(async () => {
    const user = await apiRequest("/api/auth/me");
    setAddresses(user.addresses || []);
  }, []);

  useEffect(() => {
    loadAddresses()
      .catch((loadError) =>
        setError(
          getPortalErrorMessage(
            loadError,
            "We couldn’t load your saved addresses. Please refresh and try again.",
          ),
        ),
      )
      .finally(() => setIsLoading(false));
  }, [loadAddresses]);

  const startAdd = () => {
    setEditingId("");
    setForm(emptyAddress);
    setIsAdding(true);
    setError("");
  };

  const startEdit = (address) => {
    setEditingId(address.id);
    setForm({
      ...Object.fromEntries(
        Object.keys(emptyAddress).map((key) => [key, address[key] || ""]),
      ),
      isDefault: address.isDefault,
    });
    setIsAdding(true);
    setError("");
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      const body = JSON.stringify({
        address: { ...form, isDefault: !editingId && addresses.length === 0 },
      });
      await apiRequest(
        editingId
          ? `/api/auth/addresses/${encodeURIComponent(editingId)}`
          : "/api/auth/addresses",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body,
        },
      );
      await loadAddresses();
      setIsAdding(false);
      setEditingId("");
    } catch (saveError) {
      setError(
        getPortalErrorMessage(
          saveError,
          "We couldn’t save this address. Please try again.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const setDefault = async (addressId) => {
    setError("");
    try {
      await apiRequest(`/api/auth/addresses/${encodeURIComponent(addressId)}/default`, {
        method: "PATCH",
      });
      await loadAddresses();
    } catch (requestError) {
      setError(
        getPortalErrorMessage(
          requestError,
          "We couldn’t update your default address. Please try again.",
        ),
      );
    }
  };

  const deleteAddress = async (address) => {
    if (!window.confirm("Delete this saved address?")) return;
    setError("");
    try {
      await apiRequest(`/api/auth/addresses/${encodeURIComponent(address.id)}`, {
        method: "DELETE",
      });
      await loadAddresses();
    } catch (requestError) {
      setError(
        getPortalErrorMessage(
          requestError,
          "We couldn’t delete this address. Please try again.",
        ),
      );
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl rounded-3xl border border-araina-blue/15 bg-white/95 p-5 shadow-lg shadow-araina-blue/5 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-araina-blue/10 text-araina-blue">
            <Home size={20} />
          </span>
          <div>
            <h2 className="font-semibold text-araina-black">Saved addresses</h2>
            <p className="mt-1 text-xs text-araina-black/55">
              Manage delivery addresses and choose your default.
            </p>
          </div>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={startAdd}
            className="min-h-11 rounded-lg bg-araina-blue px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-araina-blue/90"
          >
            Add address
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {isAdding && (
        <form
          onSubmit={saveAddress}
          className="mb-6 rounded-2xl border border-araina-blue/15 bg-araina-blue/[0.03] p-4 sm:p-6"
        >
          <h3 className="mb-4 font-semibold text-araina-black">
            {editingId ? "Edit address" : "Add a delivery address"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addressFields.map(([name, label, required, maxLength]) => (
              <label key={name} className="min-w-0 text-xs font-medium text-araina-black/75">
                {label}{required && <span className="ml-1 text-araina-pink">*</span>}
                <input
                  className={`${inputClass} mt-1.5`}
                  name={name}
                  value={form[name]}
                  maxLength={maxLength}
                  required={required}
                  inputMode={name === "pinCode" ? "numeric" : undefined}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [name]:
                        name === "pinCode"
                          ? event.target.value.replace(/\D/g, "").slice(0, 6)
                          : event.target.value,
                    }))
                  }
                  placeholder={label}
                />
              </label>
            ))}
          </div>
          <label className="mt-4 flex w-fit items-center gap-2 text-sm text-araina-black/70">
            <input
              type="checkbox"
              checked={form.isDefault || false}
              onChange={(event) =>
                setForm((current) => ({ ...current, isDefault: event.target.checked }))
              }
              className="accent-araina-pink"
            />
            Make this my default address
          </label>
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="min-h-11 rounded-lg border border-araina-pink/20 px-5 text-xs font-semibold uppercase tracking-wider text-araina-black/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-araina-pink px-5 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-60"
            >
              {isSaving && <LoaderCircle size={16} className="animate-spin" />}
              {isSaving ? "Saving…" : "Save address"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoaderCircle className="animate-spin text-araina-pink" />
        </div>
      ) : addresses.length === 0 ? (
        <p className="rounded-xl bg-araina-blue/5 p-5 text-sm text-araina-black/60">
          No saved addresses yet. Add an address to keep it available for future orders.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.id}
              className="rounded-2xl border border-araina-blue/10 p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-araina-blue" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-araina-black">
                      {address.houseNumber}{address.building ? `, ${address.building}` : ""}
                    </h3>
                    {address.isDefault && (
                      <span className="rounded-full bg-araina-pink/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-araina-pink">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 break-words text-sm leading-6 text-araina-black/60">
                    {[address.street, address.area, address.landmark, address.village,
                      address.city, address.district, address.state, address.pinCode,
                      address.country].filter(Boolean).join(", ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefault(address.id)}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-araina-blue/10 px-3 text-xs font-medium text-araina-blue hover:bg-araina-blue/15"
                      >
                        <Check size={14} /> Make default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => startEdit(address)}
                      className="min-h-9 rounded-lg border border-araina-pink/15 px-3 text-xs font-medium text-araina-black/70 hover:border-araina-pink hover:text-araina-pink"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAddress(address)}
                      aria-label="Delete address"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-100 px-3 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

const ProfileSecurity = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = React.useRef(null);
  const cameraStreamRef = React.useRef(null);

  const refreshUser = useCallback(async () => {
    const account = await apiRequest("/api/auth/me");
    setUser(account);
  }, []);

  useEffect(() => {
    refreshUser().catch((loadError) => setError(loadError.message));
  }, [refreshUser]);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, isCameraOpen]);

  useEffect(
    () => () => {
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  const closeCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    setCameraStream(null);
    setIsCameraOpen(false);
  };

  const openCamera = async () => {
    setError("");
    setMessage("");
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Live camera needs a secure connection (HTTPS or localhost) and a browser that supports camera access.",
      );
      setIsCameraOpen(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
      });
      cameraStreamRef.current = stream;
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (cameraRequestError) {
      const message =
        cameraRequestError.name === "NotAllowedError" ||
        cameraRequestError.name === "PermissionDeniedError"
          ? "Camera permission was denied. Allow camera access in your browser settings and try again."
          : cameraRequestError.name === "NotFoundError"
            ? "No camera was found on this device."
            : cameraRequestError.name === "NotReadableError"
              ? "The camera is busy in another app. Close that app and try again."
              : "Could not start the camera. Check browser permissions and try again.";
      setCameraError(message);
      setIsCameraOpen(true);
    }
  };

  const uploadImage = async (file) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Choose a JPEG, PNG, or WebP image.");
    }
    if (file.size > 3 * 1024 * 1024) {
      throw new Error("Profile photos must be 3 MB or smaller.");
    }

    setError("");
    setMessage("");
    setPhotoBusy(true);
    try {
      await apiRequest("/api/auth/profile/photo", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      await refreshUser();
      setMessage("Profile photo updated.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      await uploadImage(file);
    } catch (uploadError) {
      setError(
        getPortalErrorMessage(
          uploadError,
          "We couldn’t update your profile photo. Please try again.",
        ),
      );
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video?.videoHeight) {
      setCameraError("The camera is not ready yet. Please wait a moment and try again.");
      return;
    }

    const scale = Math.min(1, 1280 / video.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.88),
    );
    if (!photoBlob) {
      setCameraError("Could not capture the photo. Please try again.");
      return;
    }
    if (photoBlob.size > 3 * 1024 * 1024) {
      setCameraError("The captured image is too large. Move closer and try again.");
      return;
    }

    try {
      await uploadImage(photoBlob);
      closeCamera();
    } catch (uploadError) {
      setCameraError(
        getPortalErrorMessage(
          uploadError,
          "We couldn’t update your profile photo. Please try again.",
        ),
      );
    }
  };

  const removePhoto = async () => {
    const photoId = user?.photos?.[0]?.id;
    if (!photoId) return;
    setError("");
    setPhotoBusy(true);
    try {
      await apiRequest(`/api/auth/profile/photos/${encodeURIComponent(photoId)}`, {
        method: "DELETE",
      });
      await refreshUser();
      setMessage("Profile photo removed.");
    } catch (removeError) {
      setError(
        getPortalErrorMessage(
          removeError,
          "We couldn’t remove your profile photo. Please try again.",
        ),
      );
    } finally {
      setPhotoBusy(false);
    }
  };

  const photo =
    user?.photos?.find(
      (item) => item.url === user.profile?.photoKeyReference,
    ) || user?.photos?.[0];
  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="rounded-3xl border border-araina-pink/15 bg-white/95 p-5 shadow-lg shadow-araina-pink/5 sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-araina-pink/10 text-araina-pink">
            <Camera size={20} />
          </span>
          <div>
            <h2 className="font-semibold text-araina-black">Profile photo</h2>
            <p className="mt-1 text-xs text-araina-black/55">JPEG, PNG or WebP · up to 3 MB</p>
          </div>
        </div>
        <div className="flex flex-col gap-5 rounded-2xl bg-araina-pink/[0.03] p-5 sm:flex-row sm:items-center">
          <div className="flex justify-center sm:justify-start">
            {photo ? (
              <img
                src={`${photo.url}?v=${encodeURIComponent(photo.createdAt)}`}
                alt="Your profile"
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
              />
            ) : (
              <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-araina-blue/10 text-araina-blue shadow-md">
                <CircleUserRound size={42} />
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-wrap justify-center gap-2 sm:justify-start">
            <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-araina-pink px-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-araina-pink/90">
              {photoBusy ? <LoaderCircle size={15} className="animate-spin" /> : <Camera size={15} />}
              Choose from device
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={photoBusy}
                onChange={uploadPhoto}
              />
            </label>
            <button
              type="button"
              onClick={openCamera}
              disabled={photoBusy}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-araina-blue/25 bg-white px-4 text-xs font-semibold uppercase tracking-wider text-araina-blue transition hover:bg-araina-blue/5 disabled:opacity-50"
            >
              <Video size={16} />
              Use front camera
            </button>
            {photo && (
              <button
                type="button"
                onClick={removePhoto}
                disabled={photoBusy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-100 px-4 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={15} />
                Remove photo
              </button>
            )}
          </div>
        </div>
        {isCameraOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeCamera();
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="camera-dialog-title"
              className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-araina-pink/10 px-5 py-4">
                <div>
                  <h3 id="camera-dialog-title" className="font-semibold text-araina-black">
                    Take a profile photo
                  </h3>
                  <p className="mt-1 text-xs text-araina-black/55">
                    Camera permission is requested by your browser.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCamera}
                  aria-label="Close camera"
                  className="rounded-full p-2 text-araina-black/60 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              {cameraError ? (
                <div className="m-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  {cameraError}
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  aria-label="Front camera preview"
                  className="max-h-[65vh] w-full bg-black object-contain"
                />
              )}
              <div className="flex flex-col-reverse gap-3 border-t border-araina-pink/10 p-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCamera}
                  className="min-h-11 rounded-lg border border-araina-pink/20 px-5 text-xs font-semibold uppercase tracking-wider text-araina-black/70"
                >
                  Cancel
                </button>
                {cameraError && (
                  <button
                    type="button"
                    onClick={openCamera}
                    className="min-h-11 rounded-lg border border-araina-blue/25 px-5 text-xs font-semibold uppercase tracking-wider text-araina-blue"
                  >
                    Try camera again
                  </button>
                )}
                {!cameraError && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={photoBusy}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-araina-pink px-5 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-60"
                  >
                    {photoBusy ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Camera size={16} />
                    )}
                    {photoBusy ? "Saving photo…" : "Capture photo"}
                  </button>
                )}
              </div>
            </section>
          </div>
        )}
      </div>

    </section>
  );
};

const ProfileManagement = () => (
  <div className="space-y-6">
    <AddressBook />
    <ProfileSecurity />
  </div>
);

export default ProfileManagement;
