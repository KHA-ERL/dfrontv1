import { useState, useEffect } from "react";

export default function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  useEffect(() => {
    if (token) localStorage.setItem("access_token", token);
    else localStorage.removeItem("access_token");
  }, [token]);
  return { token, setToken };
}
