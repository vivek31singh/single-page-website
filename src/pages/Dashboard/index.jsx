import { Typography, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to the Task Management System. Select a task from the sidebar or
        create a new one to get started.
      </Typography>
    </Box>
  );
};

export default Dashboard;