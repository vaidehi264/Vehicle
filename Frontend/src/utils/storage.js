import { initialUsers } from "../data/users";
import { initialMechanics } from "../data/mechanics";
import { initialServices } from "../data/services";
import { initialVehicles } from "../data/vehicles";
import { initialBookings } from "../data/bookings";
import { initialReviews } from "../data/reviews";

const STORAGE_KEYS = {
  USERS: "autoserve_users",
  MECHANICS: "autoserve_mechanics",
  SERVICES: "autoserve_services",
  VEHICLES: "autoserve_vehicles",
  BOOKINGS: "autoserve_bookings",
  REVIEWS: "autoserve_reviews",
  AUTH: "autoserve_auth",
};

/**
 * Initialize mock data into localStorage if not already initialized
 */
export const initializeStorage = () => {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MECHANICS)) {
      localStorage.setItem(STORAGE_KEYS.MECHANICS, JSON.stringify(initialMechanics));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(initialServices));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(initialVehicles));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialBookings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
    }

    // Auto-migrate cached local data from @autoserve.com to @vvcars.com
    [STORAGE_KEYS.USERS, STORAGE_KEYS.MECHANICS, STORAGE_KEYS.BOOKINGS, STORAGE_KEYS.AUTH].forEach((key) => {
      const data = localStorage.getItem(key);
      if (data && data.includes("@autoserve.com")) {
        localStorage.setItem(key, data.replace(/@autoserve\.com/g, "@vvcars.com"));
      }
    });
  } catch (error) {
    console.error("Failed to initialize localStorage mock data:", error);
  }
};

/**
 * Generic getter with fallback
 */
export const getStorageData = (key, fallback = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading key ${key} from storage:`, error);
    return fallback;
  }
};

/**
 * Generic setter
 */
export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Trigger custom storage event for live tab synchronization
    window.dispatchEvent(new Event("autoserve_storage_update"));
  } catch (error) {
    console.error(`Error setting key ${key} in storage:`, error);
  }
};

// Convenience methods for each collection
export const storageService = {
  getUsers: () => getStorageData(STORAGE_KEYS.USERS, initialUsers),
  setUsers: (users) => setStorageData(STORAGE_KEYS.USERS, users),

  getMechanics: () => getStorageData(STORAGE_KEYS.MECHANICS, initialMechanics),
  setMechanics: (mechanics) => setStorageData(STORAGE_KEYS.MECHANICS, mechanics),

  getServices: () => getStorageData(STORAGE_KEYS.SERVICES, initialServices),
  setServices: (services) => setStorageData(STORAGE_KEYS.SERVICES, services),

  getVehicles: () => getStorageData(STORAGE_KEYS.VEHICLES, initialVehicles),
  setVehicles: (vehicles) => setStorageData(STORAGE_KEYS.VEHICLES, vehicles),

  getBookings: () => getStorageData(STORAGE_KEYS.BOOKINGS, initialBookings),
  setBookings: (bookings) => setStorageData(STORAGE_KEYS.BOOKINGS, bookings),

  getReviews: () => getStorageData(STORAGE_KEYS.REVIEWS, initialReviews),
  setReviews: (reviews) => setStorageData(STORAGE_KEYS.REVIEWS, reviews),

  getAuth: () => {
    try {
      const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
      return auth ? JSON.parse(auth) : null;
    } catch {
      return null;
    }
  },
  setAuth: (authData) => {
    if (!authData) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } else {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
    }
    window.dispatchEvent(new Event("autoserve_auth_update"));
  },
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    window.dispatchEvent(new Event("autoserve_auth_update"));
  },

  // Reset all to initial state (handy for demo reset button!)
  resetAll: () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(STORAGE_KEYS.MECHANICS, JSON.stringify(initialMechanics));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(initialServices));
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(initialVehicles));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialBookings));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
    window.dispatchEvent(new Event("autoserve_storage_update"));
  },
};

