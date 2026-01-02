import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TaskManager from './pages/TaskManager';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'tasks',
        element: <TaskManager />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export default router;