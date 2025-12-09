import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";
import bgImage from "../assets/images/bg-img.jpg";
import { useEffect, useState } from "react";

export default function HomeRedirect() {
  const { user, token, role } = useAuthStore();
  const navigate = useNavigate();

  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());
  const [showSpinner, setShowSpinner] = useState(true);

  // Wait for Zustand persist to finish hydrating
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return () => unsub();
  }, []);

  // Spinner shows for minimum duration
  useEffect(() => {
    if (hydrated) {
      const timeout = setTimeout(() => setShowSpinner(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [hydrated]);

  // Redirect only when hydrated
  useEffect(() => {
    if (!hydrated) return;

    if (!user || !token) {
      navigate("/login", { replace: true });
    } else if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/staff/dashboard", { replace: true });
    }
  }, [hydrated, user, token, role, navigate]);

  const loadingMessage = (() => {
    if (!hydrated) return "Loading session...";
    if (!token || !user) return "Redirecting to login...";
    return "Redirecting to your dashboard...";
  })();

  if (showSpinner) {
    return (
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
        className="flex h-screen items-center justify-center absolute inset-0 bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-[#a66a30] opacity-40"></div>
        <div className="flex flex-col items-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-white text-4xl font-medium">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return null;
}
