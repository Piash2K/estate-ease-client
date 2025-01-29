import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomeLayout from './Components/Layouts/HomeLayout';
import AuthProvider from './Components/Provider/AuthProvider';
import Login from './Components/Pages/Login';
import Register from './Components/Pages/Register';
import Apartment from './Components/Pages/Apartment';
import Dashboard from './Components/Dashboard/Layouts/Dashboard';
import MyProfile from './Components/Pages/MyProfile';
import MakePayment from './Components/Dashboard/Pages/MakePayment';
import PaymentHistory from './Components/Dashboard/Pages/PaymentHistory';
import ManageMembers from './Components/Dashboard/Pages/ManageMembers';
import MakeAnnouncement from './Components/Dashboard/Pages/MakeAnnouncement';
import Announcements from './Components/Dashboard/Pages/Announcements';
import AgreementRequests from './Components/Dashboard/Pages/AggrementsRequest';
import ManageCoupons from './Components/Dashboard/Pages/ManageCoupons';
import Home from './Components/Pages/Home';
import AdminProfile from './Components/Dashboard/Pages/AdminProfile';
import ErrorPage from './Components/Pages/ErrorPage';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/appartment',
        element: <Apartment></Apartment>
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: 'my-profile',
        element: <MyProfile></MyProfile>
      },
      {
        path: 'announcements',
        element: <Announcements></Announcements>
      },
      {
        path: 'make-payment',
        element: <MakePayment></MakePayment>
      },
      {
        path: 'payment-history',
        element: <PaymentHistory></PaymentHistory>
      },
      {
        path: 'manage-members',
        element: <ManageMembers></ManageMembers>
      },
      {
        path: 'make-announcement',
        element: <MakeAnnouncement></MakeAnnouncement>
      },
      {
        path: 'agrements-request',
        element: <AgreementRequests></AgreementRequests>
      },
      {
        path: 'manage-coupons',
        element: <ManageCoupons></ManageCoupons>
      },
      {
        path: 'admin-profile',
        element: <AdminProfile></AdminProfile>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
       <QueryClientProvider client={queryClient}>
      <AuthProvider><RouterProvider router={router} /></AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
