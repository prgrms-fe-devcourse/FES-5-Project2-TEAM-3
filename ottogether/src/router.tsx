import { createBrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';

export const router = createBrowserRouter([
  {
    // path: '/',
    // element: <Main />,
  },
  {
    // path: '/login',
    // element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);