import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound/NotFound';
import Register from '../pages/Register/Register';
import Home from '../pages/Home/Home';
import Layout from '../layout/Layout';
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
        path: '/Register',
        element: <Register />
      },
      {
        path: '/login',
        element: <Login />
      },
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);