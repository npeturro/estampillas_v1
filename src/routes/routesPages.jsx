import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
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
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/online_stamps" element={<ProtectedRoute><MainLayoutLoged><OnlineStamps /></MainLayoutLoged></ProtectedRoute>} />
            <Route path="/physical_stamps" element={<ProtectedRoute><MainLayoutLoged><PhysicalStamps /></MainLayoutLoged></ProtectedRoute>} />
            <Route path="/checkout_stamps" element={<ProtectedRoute><MainLayoutLoged><CheckoutStamps /></MainLayoutLoged></ProtectedRoute>} />
            <Route path="/checkout_stamps/success" element={<ProtectedRoute><MainLayoutLoged><CheckoutSuccess /></MainLayoutLoged></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default RoutesPage;
