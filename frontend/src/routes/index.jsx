import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/user/Home";
import Product from "../pages/user/Product";
import ProductsPage from "../pages/user/ProductsPage";
import Cart from "../pages/user/Cart";
import About from "../pages/user/About"
import Login from "../pages/user/Login";
import Signup from "../pages/user/Signup";

import Dashboard from "../pages/admin/Dashboard";
import ProductsAdmin from "../pages/admin/ProductsAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <UserLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "products", element: <ProductsPage /> },
          { path: "product/:slug/:id", element: <Product /> },
          { path: "cart", element: <Cart /> },
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <Signup /> },
          { path: "about", element: <About />}
        ],
      },

      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "products", element: <ProductsAdmin /> },
        ],
      },
    ],
  },
]);