import { createBrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';
import TestSupabase from './supabase/ TestSupabase';


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
   {
    path: '/test',
    element: < TestSupabase/>,
  },
]);