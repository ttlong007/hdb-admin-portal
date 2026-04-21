import { useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import axiosInstance, { setNavigate } from "@/config/axios";

import RootRoutes from "./Routes";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { routes } from "./config/routes";
import { useAuth } from "./store/authSlice/useAuth";
import { Spin } from "antd";

function App() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const { setAuthState } = useAuth();
  const loginAttempted = useRef(false);
  // CRITICAL: Set initial state based on token presence to prevent premature render
  const [isLoggingIn, setIsLoggingIn] = useState(Boolean(token));

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !token) {
      // User already has a valid session
      setAuthState({ isAuthenticated: true });
    }
  }, []);

  const loginByTokenMutation = useMutation({
    mutationFn: async (data: { token: string; party_code: string }) => {
      const response = await axiosInstance.post(
        "/v1/admin/auth/login-by-token",
        data,
      );
      if (response.data.status_code === "ACCEPT") {
        // CRITICAL: Set tokens and auth state synchronously
        localStorage.setItem("accessToken", response.data.data.access_token);
        localStorage.setItem("refreshToken", response.data.data.refresh_token);

        // Set auth state after tokens are in localStorage
        setAuthState({
          isAuthenticated: true,
        });

        // Remove token from URL before navigating
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState({}, "", url.pathname + url.search);

        // Set logging in to false before navigating
        setIsLoggingIn(false);
        navigate(routes.dashboard, { replace: true });
      } else {
        toast.error(response.data.reason_message || "Đăng nhập thất bại");
        setIsLoggingIn(false);
        navigate(routes.unauthorize, { replace: true });
        throw new Error("Login failed");
      }
    },
    onError: (error: any) => {
      console.error("Login by token failed:", error);
      toast.error("Không thể đăng nhập. Vui lòng thử lại.");
      setIsLoggingIn(false);
      navigate(routes.unauthorize, { replace: true });
    },
  });

  useEffect(() => {
    if (token && !loginAttempted.current) {
      loginAttempted.current = true;
      setIsLoggingIn(true);
      loginByTokenMutation.mutate({ token, party_code: "HDA" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return isLoggingIn ? (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Spin size="large" />
      <p className="text-gray-600">Đang xác thực...</p>
    </div>
  ) : (
    <RootRoutes />
  );
}

export default App;
