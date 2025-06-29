import { useState } from "react";
import PropTypes from "prop-types";
import Button from "../ui/Button";

const RegisterForm = ({ onSubmit, isLoading, error, onClearError }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    name: {
      firstname: "",
      lastname: ""
    },
    address: {
      city: "",
      street: "",
      number: 0,
      zipcode: "",
      geolocation: {
        lat: "",
        long: ""
      }
    },
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: name === "address.number" ? parseInt(value) || 0 : value
          }
        }));
      } else if (parts.length === 3) {
        const [parent, child, grandchild] = parts;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: value
            }
          }
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstname"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="name.firstname"
            value={formData.name.firstname}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label
            htmlFor="lastname"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="name.lastname"
            value={formData.name.lastname}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field"
          placeholder="Enter your email"
        />
      </div>

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
          placeholder="Choose a username"
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
          placeholder="Choose a password"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter your phone number"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Street
          </label>
          <input
            type="text"
            id="street"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter street address"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter city"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Number
          </label>
          <input
            type="number"
            id="number"
            name="address.number"
            value={formData.address.number || ""}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter number"
          />
        </div>

        <div>
          <label
            htmlFor="zipcode"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Zip Code
          </label>
          <input
            type="text"
            id="zipcode"
            name="address.zipcode"
            value={formData.address.zipcode}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter zip code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Latitude (Optional)
          </label>
          <input
            type="text"
            id="latitude"
            name="address.geolocation.lat"
            value={formData.address.geolocation.lat}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter latitude (e.g., -37.3159)"
          />
        </div>

        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Longitude (Optional)
          </label>
          <input
            type="text"
            id="longitude"
            name="address.geolocation.long"
            value={formData.address.geolocation.long}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter longitude (e.g., 81.1496)"
          />
        </div>
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
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onClearError: PropTypes.func.isRequired
};

export default RegisterForm;
