import { useEffect } from "react";
import useAuthStore from "../store/authStore";

const useAuth = () => {
  const authStore = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    authStore.initializeAuth();
  }, [authStore]);

  return authStore;
};

export default useAuth;
