import { RouterProvider } from 'react-router-dom';
import router from './router';

/**
 * Root Application Component
 * 
 * This component wraps the entire application and provides
 * the routing configuration through RouterProvider.
 * 
 * The Redux Provider is already set up in main.jsx,
 * so this component focuses solely on routing setup.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;