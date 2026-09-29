import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// HomePage Structure
import Layout from './layouts/Layout';
import ProductPage from './pages/LandingPages/ProductPage';
import HomePage from './pages/LandingPages/HomePage';
import AboutPage from './pages/LandingPages/AboutPage';
import ProductListPage from './pages/LandingPages/ProductListPage';

// Auth Pages Structure
import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

// Dashboard Structure
import DashLayout from "./layouts/DashLayout";
import DashboardPage from "./pages/DashboardPages/DashboardPage";
import ReportsPage from "./pages/DashboardPages/ReportsPage";
import UsersPage from "./pages/DashboardPages/UsersPage";
import DashProductListPage from "./pages/DashboardPages/DashProductListPage";

import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/DashboardPages/OrdersPage';
import ReviewsPage from './pages/DashboardPages/ReviewsPage';

const AccessDeniedPage = () => (
  <div className="mx-auto max-w-2xl px-6 py-16 text-center">
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Access denied</p>
    <h1 className="mt-3 text-4xl font-bold text-zinc-900">You cannot open this page</h1>
    <p className="mt-3 text-zinc-600">You do not have permission to access this area.</p>
  </div>
);

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:name',
        element: <ProductPage />,
      },
    ],
  },
  {
    path: "auth/",
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      }
    ],
  },
  {
    path: "/403",
    element: <AccessDeniedPage />,
  },
  {
    element: <ProtectedRoute roles={["admin", "seller"]} />,
    children: [{
    path: "dashboard",
    element: <DashLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <ProtectedRoute roles={["admin"]} />,
        children: [{ path: "", element: <DashboardPage /> }],
      },
      {
        path: "reports",
        element: <ProtectedRoute roles={["admin"]} />,
        children: [{ path: "", element: <ReportsPage /> }],
      },
      {
        path: "users",
        element: <ProtectedRoute roles={["admin"]} />,
        children: [{ path: "", element: <UsersPage /> }],
      },
      {
        path: "products",
        element: <DashProductListPage />,
      },
      { path: "orders", element: <OrdersPage /> },
      { path: "reviews", element: <ReviewsPage /> },
    ],
    }],
  },
  {
    element: <ProtectedRoute roles={["customer", "admin", "seller"]} />,
    children: [{
      path: "account",
      element: <Layout />,
      children: [{ path: "", element: <AccountPage /> }],
    }, {
      path: "orders",
      element: <Layout />,
      children: [{ path: "", element: <OrdersPage /> }],
    }],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
