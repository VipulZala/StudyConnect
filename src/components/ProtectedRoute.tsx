import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Preserves the intended destination for post-login redirect
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="d-flex vh-100 align-items-center justify-content-center bg-body">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login but save the location they were trying to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
