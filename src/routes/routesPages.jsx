import { Routes, Route } from 'react-router-dom';
import Index from '../pages';
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';
import NotFound from '../pages/notFound';
import MainLayoutLoged from '../components/layouts/mainLayoutsLoged';
import { ProtectedRoute } from './protectedRoute.jsx';
import { SaProtectedRoute } from './saProtectedRoute.jsx';
import CheckoutStamps from '../pages/checkout-stamps.jsx';
import OnlineStamps from '../pages/online-stamps.jsx';
import PhysicalStamps from '../pages/physical-stamps.jsx';
import CheckoutSuccess from '../sections/checkout-stamps/checkout-success.jsx';

const RoutesPage = ({ location }) => {
    return (
        <Routes location={location}>
            {/* <Route path="/" element={<Index />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/online_stamps" element={<MainLayoutLoged><OnlineStamps /></MainLayoutLoged>} />
            <Route path="/physical_stamps" element={<MainLayoutLoged><PhysicalStamps /></MainLayoutLoged>} />
            <Route path="/checkout_stamps" element={<MainLayoutLoged><CheckoutStamps /></MainLayoutLoged>} />
            <Route path="/checkout_stamps/success" element={<MainLayoutLoged><CheckoutSuccess /></MainLayoutLoged>} />
            {/* <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/dashboard" element={<SaProtectedRoute><MainLayoutLoged><Dashboard /></MainLayoutLoged></SaProtectedRoute>} />
            <Route path="/admin/appointments" element={<SaProtectedRoute><MainLayoutLoged><AppointmentsTable /></MainLayoutLoged></SaProtectedRoute>} />
            <Route path="/admin/calendar" element={<SaProtectedRoute><MainLayoutLoged><Calendar /></MainLayoutLoged></SaProtectedRoute>} />
            <Route path="/admin/courts" element={<SaProtectedRoute><MainLayoutLoged><Courts /></MainLayoutLoged></SaProtectedRoute>} />
            <Route path="/admin/courts/:id" element={<SaProtectedRoute><MainLayoutLoged><CourtDetail /></MainLayoutLoged></SaProtectedRoute>} />
            <Route path="/admin/settings" element={<SaProtectedRoute><MainLayoutLoged><Settings /></MainLayoutLoged></SaProtectedRoute>} />
            <Route path="/admin/current_days" element={<SaProtectedRoute><MainLayoutLoged><CancelDays /></MainLayoutLoged></SaProtectedRoute>} /> */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default RoutesPage;
