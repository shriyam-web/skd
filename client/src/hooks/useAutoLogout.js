import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const useAutoLogout = (timeout = 10 * 60 * 1000) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(timeout);
  const triggeredRef = useRef(false); // ✅ Prevent multiple triggers

  useEffect(() => {
    let logoutTimer, countdownTimer;

    const handleLogout = () => {
      if (!triggeredRef.current) {
        triggeredRef.current = true;
        alert("Session expired due to inactivity.");
        logout(navigate);
      }
    };

    const resetTimer = () => {
      setTimeLeft(timeout);
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);

      logoutTimer = setTimeout(handleLogout, timeout);

      countdownTimer = setInterval(() => {
        setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Initial setup

    return () => {
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, timeout]);

  const minutes = Math.floor(timeLeft / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((timeLeft % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export default useAutoLogout;
