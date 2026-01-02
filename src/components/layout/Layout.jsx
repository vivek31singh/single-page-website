import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Sidebar from './Sidebar';
import { Box, Container } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Layout Component
 * 
 * Main layout wrapper that provides consistent structure across the application.
 * Includes a fixed header, navigation sidebar, and main content area.
 * 
 * @component
 */
const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - 240px)` },
            mt: { xs: '56px', sm: '64px' }, // Offset for fixed header (mobile: 56px, desktop: 64px)
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: 'background.default',
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              py: 3,
              px: { xs: 2, sm: 3 },
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  /**
   * Child components to render within the layout
   */
  children: PropTypes.node,
};

export default Layout;
