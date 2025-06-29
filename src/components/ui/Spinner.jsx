import PropTypes from "prop-types";

const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <div className="absolute inset-0 border-2 border-primary-200 dark:border-primary-800 rounded-full"></div>
      <div className="absolute inset-0 border-2 border-transparent border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
      <div
        className="absolute inset-0 border-2 border-transparent border-t-secondary-600 dark:border-t-secondary-400 rounded-full animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      ></div>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  className: PropTypes.string
};

export default Spinner;
