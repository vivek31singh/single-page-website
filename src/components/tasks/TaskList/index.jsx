import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import TaskItem from '../TaskItem';

/**
 * TaskList Component
 * Container component that displays a list of tasks
 * @param {Object} props - Component props
 * @param {Array} props.tasks - Array of task objects
 * @param {Function} props.onEdit - Callback when edit is triggered
 * @param {Function} props.onDelete - Callback when delete is triggered
 * @param {Function} props.onToggleStatus - Callback when status is toggled
 * @param {boolean} props.loading - Loading state indicator
 */
const TaskList = ({ tasks, onEdit, onDelete, onToggleStatus, loading }) => {
  // Empty state when no tasks exist
  if (!loading && (!tasks || tasks.length === 0)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          p: 4,
        }}
      >
        <Card sx={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Tasks Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You don't have any tasks yet. Create a new task to get started!
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Loading tasks...
        </Typography>
      </Box>
    );
  }

  // Render list of tasks
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <TaskItem
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.oneOf(['active', 'completed']).isRequired,
      priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
      category: PropTypes.string,
      dueDate: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onToggleStatus: PropTypes.func,
  loading: PropTypes.bool,
};

TaskList.defaultProps = {
  tasks: [],
  onEdit: () => {},
  onDelete: () => {},
  onToggleStatus: () => {},
  loading: false,
};

export default TaskList;