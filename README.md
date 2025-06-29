# Fake E-Commerce - React Frontend

A modern React e-commerce application built with Zustand for state management and Tailwind CSS for styling. This project demonstrates clean, readable code with proper use of React hooks and thoughtful state management.

## 🚀 Features

### ✅ Core Requirements Met

- **React (not Next.js)**: Pure React application using Create React App
- **State Management**: Zustand for authentication and cart state
- **UI Styling**: Tailwind CSS with custom color scheme and dark mode support
- **Authentication**: Login and register functionality with user avatar display
- **Product Listing**: First 20 products with category filtering
- **Shopping Cart**: User-scoped cart with separate management page
- **Responsive Design**: Mobile-first approach with responsive navigation

### 🎁 Bonus Features Implemented

- **Product Carousel**: Swiper-based carousel component for product images
- **Infinite Scroll**: Load more products automatically as user scrolls
- **Dark Mode**: Toggle between light and dark themes
- **User-Specific Cart**: Each user has their own isolated cart data
- **Protected Routes**: Cart page only accessible to authenticated users

## 🛠 Technical Decisions

### State Management

- **Zustand**: Chosen for its simplicity and performance over Redux
- **Persistent Storage**: Cart and auth state persisted in localStorage
- **User-Scoped Cart**: Custom storage implementation ensures each user has their own cart

### Authentication

- **Mock API**: Since Fake Store API doesn't provide auth endpoints, implemented mock authentication
- **Token-Based**: JWT-like tokens for session management
- **Auto-Login**: Registration automatically logs in the new user

### UI/UX

- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Dark Mode**: CSS class-based dark mode with localStorage persistence
- **Responsive Grid**: CSS Grid for product layout with responsive breakpoints
- **Loading States**: Spinner components and loading indicators throughout

### API Integration

- **Fake Store API**: Real product data from fakestoreapi.com
- **Axios**: HTTP client with request interceptors for auth tokens
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 📁 Project Structure

```
src/
├── api/
│   └── fakestore.js          # API configuration and endpoints
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx     # Login form component
│   │   └── RegisterForm.jsx  # Registration form component
│   ├── products/
│   │   ├── ProductCard.jsx   # Individual product display
│   │   └── ProductCarousel.jsx # Product image carousel
│   └── ui/
│       ├── Button.jsx        # Reusable button component
│       └── Spinner.jsx       # Loading spinner component
├── hooks/
│   ├── useAuth.js           # Authentication hook
│   └── useProducts.js       # Products data management
├── pages/
│   ├── Cart.jsx             # Shopping cart page
│   ├── Home.jsx             # Product listing page
│   ├── Login.jsx            # Login page
│   └── Register.jsx         # Registration page
├── router/
│   └── AppRouter.jsx        # Application routing
├── store/
│   ├── authStore.js         # Authentication state
│   └── cartStore.js         # Shopping cart state
└── styles/
    └── tailwind.css         # Tailwind CSS imports
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fake-e-commerce-raphael
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

The application includes demo users for testing:

**User 1:**

- Username: `mor_2314`
- Password: `83r5^_`

**User 2:**

- Username: `johnd`
- Password: `m38rmF$`

## 🎯 Key Features Explained

### User-Scoped Cart

The cart is properly scoped to each logged-in user using a custom storage implementation:

- Each user's cart data is stored with a unique key: `cart-storage-{userId}`
- Cart data is automatically loaded when user logs in
- Cart is cleared when user logs out
- Multiple users can use the same browser without cart conflicts

### Infinite Scroll

Products are loaded in batches of 20 with infinite scroll:

- Only works when viewing "All Products" (not when filtering by category)
- Automatically loads more products as user scrolls
- Shows loading spinner and end message appropriately

### Category Filtering

Users can filter products by category:

- Dropdown selector with all available categories
- Clear filter option to return to all products
- Disables infinite scroll when filtering (since category results are limited)

### Responsive Design

The application is fully responsive:

- Mobile-first approach
- Collapsible filters on mobile
- Responsive product grid (1-4 columns based on screen size)
- Touch-friendly navigation

## 🔧 Technical Implementation Details

### Cart Scoping Implementation

```javascript
// Custom storage for user-specific cart data
const createUserSpecificStorage = () => {
  return {
    getItem: (name) => {
      const userId = getCurrentUserId();
      const key = `${name}-${userId}`;
      return localStorage.getItem(key);
    },
    setItem: (name, value) => {
      const userId = getCurrentUserId();
      const key = `${name}-${userId}`;
      localStorage.setItem(key, value);
    }
  };
};
```

### Authentication Flow

1. User submits login/register form
2. Mock API validates credentials or creates new user
3. JWT-like token is generated and stored
4. User data is fetched and stored in Zustand
5. Cart is automatically scoped to the user

### Product Loading Strategy

1. Initial load: First 20 products
2. Infinite scroll: Load next 20 products
3. Category filter: Load all products in category
4. Reset: Clear current products and start over

## 🎨 Styling Approach

- **Tailwind CSS**: Utility-first approach for rapid development
- **Custom Colors**: Primary color scheme defined in tailwind.config.js
- **Dark Mode**: CSS class-based implementation with localStorage persistence
- **Component Variants**: Button and Spinner components with multiple variants
- **Responsive Utilities**: Mobile-first responsive design

## 🔒 Security Considerations

- **Mock Authentication**: Since this is a demo, authentication is mocked
- **Token Storage**: Tokens stored in localStorage (in production, consider httpOnly cookies)
- **User Scoping**: Cart data properly scoped to prevent cross-user access
- **Protected Routes**: Cart page only accessible to authenticated users

## 🚀 Future Enhancements

- **Real Authentication**: Integrate with a real auth service
- **Payment Integration**: Add checkout functionality
- **Product Search**: Implement search functionality
- **User Reviews**: Add product review system
- **Wishlist**: Add wishlist functionality
- **Order History**: Track user order history

## 📝 Code Quality

- **Clean Code**: Intuitive variable and function naming
- **Proper Hooks Usage**: Correct use of React hooks (useState, useEffect, useCallback)
- **Component Composition**: Reusable components with proper props
- **Error Handling**: Comprehensive error handling throughout
- **Loading States**: Proper loading indicators and states
- **TypeScript Ready**: Code structure ready for TypeScript migration

## 🤝 Contributing

This is a demo project, but contributions are welcome! Please ensure:

- Code follows existing patterns
- Components are properly tested
- Documentation is updated
- Responsive design is maintained

## 📄 License

This project is for demonstration purposes only.
