import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export function ProtectedRoute({ children }) {
    // Si no está autenticado (no hay token o expiró)
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
