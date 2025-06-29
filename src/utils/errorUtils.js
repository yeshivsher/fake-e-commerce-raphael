// Centralized error handling utilities
export const handleAPIError = (error, defaultMessage = "An error occurred") => {
  if (error.response?.status === 401) {
    return "Invalid credentials";
  } else if (error.response?.status === 400) {
    return "Invalid request data";
  } else if (error.response?.status === 409) {
    return "Username already exists";
  } else if (error.response?.status === 404) {
    return "Resource not found";
  } else if (error.response?.status >= 500) {
    return "Server error. Please try again later.";
  } else {
    return error.message || defaultMessage;
  }
};

export const logError = (context, error, additionalInfo = {}) => {
  console.error(`Error in ${context}:`, error);
  if (Object.keys(additionalInfo).length > 0) {
    console.error("Additional info:", additionalInfo);
  }
};

export const handleStorageError = (operation, error) => {
  console.error(`Storage error during ${operation}:`, error);
  return `Failed to ${operation}. Please try again.`;
};
