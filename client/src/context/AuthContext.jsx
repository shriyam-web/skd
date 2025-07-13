import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // ✅

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setIsAuth(true);
    } else {
      setAdmin(null);
      setIsAuth(false);
    }
    setLoading(false); // ✅ Done loading
  }, []);

  const login = (adminData) => {
    setIsAuth(true);
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = (navigate) => {
    setIsAuth(false);
    setAdmin(null);
    localStorage.removeItem("admin");

    setTimeout(() => {
      navigate("/admin/login");
      window.location.reload();
    }, 2000);
  };

  return (
    <AuthContext.Provider value={{ isAuth, admin, login, logout }}>
      {!loading && children} {/* ✅ only render when ready */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
