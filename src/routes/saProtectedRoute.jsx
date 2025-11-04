import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, isAuthenticated } from '../utils/auth';

export function SaProtectedRoute({ children }) {
    const userAuth = getUser();
 

    if (!isAuthenticated() || userAuth?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
