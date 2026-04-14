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
import DashboardLayout from './Components/Dashboard/Layouts/DashboardLayout';
import Faq from './Components/Pages/Faq';
import Contacts from './Components/Pages/Contacts';
import ApartmentDetails from './Components/Pages/ApartmentDetails';

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
        path: '/apartment',
        element: <Apartment></Apartment>
      },
      {
        path: '/apartment/:id',
        element: <ApartmentDetails></ApartmentDetails>
      },
      {
        path: '/contacts',
        element: <Contacts></Contacts>
      },
      {
        path: '/FAQ',
        element: <Faq></Faq>
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: 'my-profile',
        element: <PrivateRoute allowedRoles={['member', 'admin', 'manager']}><MyProfile></MyProfile></PrivateRoute>
      },
      {
        path: 'announcements',
        element: <PrivateRoute allowedRoles={['member', 'admin', 'manager']}><Announcements></Announcements></PrivateRoute>
      },
      {
        path: 'make-payment',
        element: <PrivateRoute allowedRoles={['member']}><MakePayment></MakePayment></PrivateRoute>
      },
      {
        path: 'payment-history',
        element: <PrivateRoute allowedRoles={['member']}><PaymentHistory></PaymentHistory></PrivateRoute>
      },
      {
        path: 'manage-members',
        element: <PrivateRoute allowedRoles={['admin', 'manager']}><ManageMembers></ManageMembers></PrivateRoute>
      },
      {
        path: 'make-announcement',
        element: <PrivateRoute allowedRoles={['admin', 'manager']}><MakeAnnouncement></MakeAnnouncement></PrivateRoute>
      },
      {
        path: 'agrements-request',
        element: <PrivateRoute allowedRoles={['admin', 'manager']}><AgreementRequests></AgreementRequests></PrivateRoute>
      },
      {
        path: 'manage-coupons',
        element: <PrivateRoute allowedRoles={['admin', 'manager']}><ManageCoupons></ManageCoupons></PrivateRoute>
      },
      {
        path: 'admin-profile',
        element: <PrivateRoute allowedRoles={['admin', 'manager']}><AdminProfile></AdminProfile></PrivateRoute>
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
