import React, { createContext, useContext, useState, useEffect } from "react";
import { storageService, initializeStorage } from "../utils/storage";

const AuthContext = createContext();

export const DEMO_CREDENTIALS = {
  user: {
    name: "Rahul Sharma",
    email: "user@vvcars.com",
    password: "password123",
    role: "user",
    phone: "+91 98765 43210",
    id: "usr-001",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  mechanic: {
    name: "Suresh Verma",
    email: "mechanic@vvcars.com",
    password: "password123",
    role: "mechanic",
    phone: "+91 98450 12345",
    id: "mech-001",
    specialization: "Engine Diagnostics & Overhaul",
    experience: "9 years",
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
  },
  admin: {
    name: "Amit Kumar",
    email: "vvcarservice@gmail.com",
    password: "password123",
    role: "admin",
    phone: "+91 7845963210",
    id: "adm-001",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
  },
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize storage once on mount
  useEffect(() => {
    initializeStorage();
    const storedAuth = storageService.getAuth();
    if (storedAuth && storedAuth.user) {
      setCurrentUser(storedAuth.user);
    }
    setLoading(false);

    const handleAuthUpdate = () => {
      const auth = storageService.getAuth();
      setCurrentUser(auth?.user || null);
    };

    window.addEventListener("autoserve_auth_update", handleAuthUpdate);
    return () => window.removeEventListener("autoserve_auth_update", handleAuthUpdate);
  }, []);

  const login = (email, password, role) => {
    const normalizeEmail = (e) =>
      e?.toLowerCase().replace("@autoserve.com", "@vvcars.com").replace("admin@vvcars.com", "vvcarservice@gmail.com");
    const targetEmail = normalizeEmail(email);

    // Check against demo accounts first
    const demoKey = Object.keys(DEMO_CREDENTIALS).find(
      (k) =>
        normalizeEmail(DEMO_CREDENTIALS[k].email) === targetEmail &&
        DEMO_CREDENTIALS[k].role === role
    );

    if (demoKey) {
      const userObj = DEMO_CREDENTIALS[demoKey];
      storageService.setAuth({
        token: `mock-jwt-token-${userObj.id}`,
        user: userObj,
      });
      setCurrentUser(userObj);
      return { success: true, user: userObj };
    }

    // Check registered users from storage
    const users = storageService.getUsers();
    const foundUser = users.find(
      (u) => normalizeEmail(u.email) === targetEmail && u.role === role
    );

    if (foundUser) {
      storageService.setAuth({
        token: `mock-jwt-token-${foundUser.id}`,
        user: foundUser,
      });
      setCurrentUser(foundUser);
      return { success: true, user: foundUser };
    }

    // Also check mechanics
    if (role === "mechanic") {
      const mechanics = storageService.getMechanics();
      const foundMech = mechanics.find(
        (m) => normalizeEmail(m.email) === targetEmail
      );
      if (foundMech) {
        const userObj = { ...foundMech, role: "mechanic" };
        storageService.setAuth({
          token: `mock-jwt-token-${foundMech.id}`,
          user: userObj,
        });
        setCurrentUser(userObj);
        return { success: true, user: userObj };
      }
    }

    // Default fallback: allow flexible demo login with provided credentials
    const fallbackUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: email.split("@")[0].replace(".", " ").replace(/^\w/, (c) => c.toUpperCase()),
      email,
      role,
      phone: "+91 98000 00000",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
    };

    storageService.setAuth({
      token: `mock-jwt-token-${fallbackUser.id}`,
      user: fallbackUser,
    });
    setCurrentUser(fallbackUser);
    return { success: true, user: fallbackUser };
  };

  const demoLogin = (role) => {
    const userObj = DEMO_CREDENTIALS[role];
    if (userObj) {
      storageService.setAuth({
        token: `mock-jwt-token-${userObj.id}`,
        user: userObj,
      });
      setCurrentUser(userObj);
      return { success: true, user: userObj };
    }
    return { success: false, error: "Role demo not found" };
  };

  const register = (registrationData) => {
    const { name, email, phone, role, specialization, experience } = registrationData;
    const newId = role === "mechanic" ? `mech-${Date.now().toString().slice(-4)}` : `usr-${Date.now().toString().slice(-4)}`;
    
    const newUser = {
      id: newId,
      name,
      email,
      phone: phone || "+91 99999 88888",
      role,
      status: role === "mechanic" ? "Pending" : "active",
      joinedDate: new Date().toISOString().split("T")[0],
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      ...(role === "mechanic" && {
        specialization: specialization || "General Automotive Repair",
        experience: experience || "3 years",
        rating: 5.0,
        reviewsCount: 0,
        completedJobs: 0,
        availability: "Available",
        workingHours: "09:00 AM - 06:00 PM",
        hourlyRate: 600,
        skills: ["General Diagnostic", "Periodic Service"],
        bio: "Newly onboarded certified vehicle specialist.",
        earningsThisMonth: 0,
        totalEarnings: 0,
      }),
      ...(role === "user" && {
        address: "Gift City, Gandhinagar, Gujrat - 382000",
        vehiclesCount: 0,
        bookingsCount: 0,
      }),
    };

    if (role === "mechanic") {
      const mechanics = storageService.getMechanics();
      storageService.setMechanics([newUser, ...mechanics]);
    } else {
      const users = storageService.getUsers();
      storageService.setUsers([newUser, ...users]);
    }

    storageService.setAuth({
      token: `mock-jwt-token-${newId}`,
      user: newUser,
    });
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

    // Persist in auth
    storageService.setAuth({
      token: `mock-jwt-token-${updated.id}`,
      user: updated,
    });

    // Also persist in users or mechanics collection
    if (updated.role === "mechanic") {
      const mechs = storageService.getMechanics();
      const newMechs = mechs.map((m) => (m.id === updated.id ? { ...m, ...updated } : m));
      storageService.setMechanics(newMechs);
    } else {
      const users = storageService.getUsers();
      const newUsers = users.map((u) => (u.id === updated.id ? { ...u, ...updated } : u));
      storageService.setUsers(newUsers);
    }
  };

  const logout = () => {
    storageService.clearAuth();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        loading,
        login,
        demoLogin,
        register,
        updateProfile,
        logout,
        demoAccounts: DEMO_CREDENTIALS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

