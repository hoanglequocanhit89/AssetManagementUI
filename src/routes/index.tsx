import { createBrowserRouter, RouterProvider } from "react-router";
import DefaultLayout from "../components/layouts";
import PageNotFound from "../pages/404";
import AdminDashboard from "../pages/admin";
import Login from "../pages/auth/login";
import SignUp from "../pages/auth/sign-up";
import Home from "../pages/home";
import ManageAsset from "../pages/manage-asset";
import ManageAssignment from "../pages/manage-assignment";
import ManageUser from "../pages/manage-user";
import Report from "../pages/report";
import RequestForReturn from "../pages/request-return";
import StaffDashboard from "../pages/staff";
import { Protected } from "./protected";
import CreateUpdateUser from "../pages/manage-user/create-update-user";
import CreateUpdateAsset from "../pages/manage-asset/create-update-asset";
import CreateUpdateAssignment from "../pages/manage-assignment/create-update-assignment";


const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    path: "/",
    errorElement: "", //Show when loading error,
    children: [
      {
        index: true,
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "manage-user",
        element: <ManageUser />,
      },
      {
        path: "manage-user/create",
        element: <CreateUpdateUser />,
      },
      {
        path: "manage-user/edit/:id",
        element: <CreateUpdateUser />,
      },
      {
        path: "manage-asset",
        element: <ManageAsset />,
      },
      {
        path: "manage-asset/create",
        element: <CreateUpdateAsset />,
      },
      {
        path: "manage-asset/edit/:id",
        element: <CreateUpdateAsset />,
      },
      {
        path: "manage-assignment",
        element: <ManageAssignment />,
      },
      {
        path: "manage-assignment/create",
        element: <CreateUpdateAssignment />,
      },
      {
        path: "manage-assignment/edit/:id",
        element: <CreateUpdateAssignment />,
      },
      {
        path: "request-return",
        element: <RequestForReturn />,
      },
      {
        path: "report",
        element: <Report />,
      },
      {
        element: <Protected requiredRole="admin" />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
          },
        ],
      },
      {
        element: <Protected requiredRole="staff" />,
        children: [
          {
            path: "staff",
            element: <StaffDashboard />,
          },
        ],
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

const Index = () => {
    return (
        <RouterProvider router={router} />
    )
};

export default Index;