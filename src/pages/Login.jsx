import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-secondary-400/20 to-accent-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-primary-400/10 to-accent-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-soft mb-6">
            <span className="text-white text-2xl font-bold">🔐</span>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue shopping
          </p>
        </div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 shadow-large">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
            onClearError={clearError}
          />

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
              >
                Create a new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
