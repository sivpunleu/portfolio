export const DEFAULT_HERO_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Punleu&clothing=shirtCrewNeck&eyebrows=default&eyes=happy&facialHair=beardLight&hair=shortCombover&skinColor=pale";

export const DEFAULT_PORTRAIT_AVATAR =
  "https://api.dicebear.com/7.x/avataaars/svg?seed=PunleuPortrait&clothing=collarAndSweater&eyebrows=default&eyes=happy&facialHair=beardLight&hair=shortCombover&skinColor=pale";

export const DEFAULT_PROJECT_THUMBNAIL =
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800";

const getApiOrigin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "";
  if (!apiUrl || !/^https?:\/\//i.test(apiUrl)) return "";
  return apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

/**
 * Resolves uploaded relative paths (/uploads/...) and filters dead placeholder URLs.
 */
export const resolveAssetUrl = (url, fallback = "") => {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed || trimmed.includes("via.placeholder.com")) return fallback;

  if (trimmed.startsWith("/uploads/")) {
    return `${getApiOrigin()}${trimmed}`;
  }

  if (/^(https?:|blob:|data:)/i.test(trimmed)) {
    return trimmed;
  }

  return fallback;
};

/**
 * Extracts readable error messages (including Joi validation error details) from Axios errors.
 */
export const extractErrorMessage = (err, fallback = "An unexpected error occurred") => {
  const data = err?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join(", ");
  }
  return data?.message || fallback;
};

/**
 * Converts a date value or string to YYYY-MM-DD without UTC timezone day-shift.
 */
export const formatIsoDateInput = (dateVal) => {
  if (!dateVal) return "";
  if (typeof dateVal === "string") {
    const match = dateVal.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats a MySQL DATE / ISO string safely in local calendar time.
 */
export const formatDisplayDate = (
  dateVal,
  options = { year: "numeric", month: "short" },
  emptyLabel = "Present",
) => {
  if (!dateVal) return emptyLabel;
  if (typeof dateVal === "string") {
    const match = dateVal.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const localDate = new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
      );
      return localDate.toLocaleDateString("en-US", options);
    }
  }
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString("en-US", options);
};

