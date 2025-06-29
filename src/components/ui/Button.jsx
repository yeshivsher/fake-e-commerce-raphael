import PropTypes from "prop-types";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-soft hover:shadow-medium focus:ring-primary-500",
    secondary:
      "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 shadow-soft hover:shadow-medium focus:ring-gray-500 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 dark:text-white",
    outline:
      "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-soft hover:shadow-medium focus:ring-red-500",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-soft hover:shadow-medium focus:ring-green-500",
    accent:
      "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-soft hover:shadow-medium focus:ring-accent-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl"
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "danger",
    "success",
    "accent"
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default Button;
