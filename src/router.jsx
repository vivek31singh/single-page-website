import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TaskManager from './pages/TaskManager';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

/**
 * Application Router Configuration
 * 
 * Defines all application routes using React Router v6's
 * createBrowserRouter. All routes are wrapped in the Layout component
 * which provides the consistent header and sidebar navigation.
 * 
 * Route Structure:
 * - / (root): Dashboard - Overview of tasks and statistics
 * - /tasks: TaskManager - Full task management interface with filtering
 * - /settings: Settings - Application preferences and configuration
 */
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