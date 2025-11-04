import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyEmail from "./components/VerifyEmail";
import ResetPassword from "./components/ResetPassword";
import AdminDashboard from "./components/Admin/AdminDashboard";
import KitchenDashboard from "./components/Kitchen/KitchenDashboard";
import WaiterDashboard from "./components/Waiter/WaiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Customer side pages
import TablePage from "./components/customer/TablePage";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import QRPage from "./components/customer/QRPage";
import ForgetPassword from "./components/ForgetPassword";
import ReviewOrder from "./components/customer/ReviewOrder";
import LiveOrders from "./components/customer/LiveOrders";
import OrderTracking from "./components/customer/OrderTracking";

// Custom Dishes Flow
import CustomDishes from "./components/customer/CustomDishes";
import Step1Page from "./components/customer/Step1Page";
import Step2Page from "./components/customer/Step2Page";
import Step3Page from "./components/customer/Step3Page";
// (Optional future steps)
// import Step2Page from "./components/customer/customdish/Step2Page";
// import Step3Page from "./components/customer/customdish/Step3Page";

function App() {
  return (
    <>
      <Routes>
        {/* 👇 Landing page for scanning QR */}
        <Route path="/" element={<QRPage />} />

        {/* 🔐 Auth Routes */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/reset-password/:userId/:token"
          element={<ResetPassword />}
        />

        {/* 🧩 Admin/Staff Dashboards */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kitchen-dashboard"
          element={
            <ProtectedRoute allowedRoles={["kitchen"]}>
              <KitchenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter-dashboard"
          element={
            <ProtectedRoute allowedRoles={["waiter"]}>
              <WaiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🍽️ Customer Side Routes */}
        <Route path="/table/:tableId" element={<TablePage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/review-order/:tableId" element={<ReviewOrder />} />
        <Route path="/live-orders/:tableId" element={<LiveOrders />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />

        {/* 🧃 Custom Dish Creation Flow */}
        <Route path="/custom-dishes" element={<CustomDishes />} />
        <Route path="/step1/:tableId" element={<Step1Page />} />
        <Route path="/step2/:tableId" element={<Step2Page />} />
        <Route path="/step3/:tableId" element={<Step3Page />} />

        {/* Optional future steps */}
        {/* <Route path="/step2" element={<Step2Page />} />
        <Route path="/step3" element={<Step3Page />} /> */}

        {/* 🚫 Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
