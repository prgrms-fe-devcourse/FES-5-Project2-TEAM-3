import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound/NotFound';
import Register from '../pages/Register/Register';
import Home from '../pages/Home/Home';
import Layout from '../layout/Layout';
import RegisterDetail from '../pages/Register/RegisterDetail';
import RegisterProfile from '../pages/Register/RegisterProfile';
import QuotesPage from '../pages/Quotes/QuotesPage';
import Login from '../pages/Login/Login';
import EditPassword from '../pages/EditPassword/EditPassword';
import SearchResult from '../pages/SearchResult/SearchResult';
import Review from '../pages/Review_/Review';

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
         path: '/quotes',
         element: <QuotesPage /> 
      },
      {
        path: '/login',
        element: <Login />
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
        path: '/edit-password',
        element: <EditPassword />
      },
      {
        path: '/search',
        element: <SearchResult />
      },
      {
        path: '/review',
        element: <Review />
      },
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);