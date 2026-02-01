import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600 text-lg">
                    Unauthorized. You don't have permission to access this page.
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
