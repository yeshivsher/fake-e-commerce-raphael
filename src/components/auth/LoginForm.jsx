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
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-900/20 dark:border-red-800">
          {error}
        </div>
      )}

      <Button
        type="submit"
        loading={isLoading}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Demo credentials:</p>
        <p>
          Username:{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
            mor_2314
          </code>
        </p>
        <p>
          Password:{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
            83r5^_
          </code>
        </p>
        <p className="mt-2">
          Or try:{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
            johnd
          </code>{" "}
          /{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
            m38rmF$
          </code>
        </p>
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
