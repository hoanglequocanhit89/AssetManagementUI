import { Children, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import DefaultLayout from "../components/layouts";
import PageNotFound from "../pages/404";
import AdminDashboard from "../pages/admin";
import Login from "../pages/auth/login";
import SignUp from "../pages/auth/sign-up";
import Home from "../pages/home";
import StaffDashboard from "../pages/staff";
import { Protected } from "./protected";

const router = createBrowserRouter([
    {
        element: <DefaultLayout />,//Loading component
        path: '/',
        errorElement: '',//Show when loading error,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'sign-up',
                element: <SignUp />
            },
            {
                element: <Protected requiredRole="admin" />,
                children: [
                    {
                        path: '/admin',
                        element: <AdminDashboard />
                    }
                ]
            },
            {
                element: <Protected requiredRole="staff" />,
                children: [
                    {
                        path: 'staff',
                        element: <StaffDashboard />
                    }
                ]
            },
            {
                path: '*',
                element: <PageNotFound />
            }
        ]
    }
])

const Index = () => {
    return (
        <RouterProvider router={router} />
    )
};

export default Index;