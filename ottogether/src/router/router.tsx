import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound/NotFound';
import Register from '../pages/Register/Register';
import Home from '../pages/Home/Home';
import Layout from '../layout/Layout';
import RegisterDetail from '../pages/Register/RegisterDetail';
import RegisterProfile from '../pages/Register/RegisterProfile';
import Login from '../pages/Login/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { 
        index: true, 
        element: <Home /> 
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        // path: '/login',
        // element: <Login />
      },
      {
        path: '/register/detail',
        element: <RegisterDetail />
      },
      {
        path: '/register/profile',
        element: <RegisterProfile />
      },
      {
        path: '/register/detail',
        element: <RegisterDetail />
      },
      {
        path: '/register/profile',
        element: <RegisterProfile />
      },
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);