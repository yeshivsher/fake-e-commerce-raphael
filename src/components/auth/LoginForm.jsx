import { useState } from "react";
import PropTypes from "prop-types";
import Button from "../ui/Button";

const LoginForm = ({ onSubmit, isLoading, error, onClearError }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) {
      onClearError();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-slide-down">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        loading={isLoading}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Demo credentials:
        </p>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Username:{" "}
            <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 font-mono">
              mor_2314
            </code>
          </p>
          <p>
            Password:{" "}
            <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 font-mono">
              83r5^_
            </code>
          </p>
          <p className="mt-3">
            Or try:{" "}
            <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 font-mono">
              johnd
            </code>{" "}
            /{" "}
            <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 font-mono">
              m38rmF$
            </code>
          </p>
        </div>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onClearError: PropTypes.func.isRequired
};

export default LoginForm;
