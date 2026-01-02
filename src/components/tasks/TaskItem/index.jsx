import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

/**
 * Get priority color for chip
 * @param {string} priority - Priority level
 * @returns {string} Color string
 */
const getPriorityColor = (priority) => {
  const colors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
  };
  return colors[priority] || 'default';
};

/**
 * Get status color for chip
 * @param {string} status - Task status
 * @returns {string} Color string
 */
const getStatusColor = (status) => {
  return status === 'completed' ? 'success' : 'info';
};

/**
 * TaskItem Component
 * Displays individual task details with action buttons
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object
 * @param {Function} props.onEdit - Callback when edit is triggered
 * @param {Function} props.onDelete - Callback when delete is triggered
 * @param {Function} props.onToggleStatus - Callback when status is toggled
 */
const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isCompleted = task.status === 'completed';
  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);

  // Format due date if available
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), 'MMM dd, yyyy')
    : null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        ...(isCompleted && {
          opacity: 0.7,
        }),
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Task Title and Status Toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1, mr: 1 }}>
            <Tooltip title={isCompleted ? 'Mark as active' : 'Mark as completed'}>
              <IconButton
                size="small"
                onClick={() => onToggleStatus(task.id)}
                sx={{ mr: 1, mt: -0.5 }}
                color={isCompleted ? 'success' : 'default'}
              >
                {isCompleted ? (
                  <CheckCircleIcon />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                wordBreak: 'break-word',
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </Typography>
          </Box>
        </Box>

        {/* Task Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Meta Information Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {/* Priority Chip */}
          <Chip
            label={task.priority}
            size="small"
            color={priorityColor}
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />

          {/* Status Chip */}
          <Chip
            label={task.status}
            size="small"
            color={statusColor}
            sx={{ fontSize: '0.75rem' }}
          />

          {/* Category Chip */}
          {task.category && (
            <Chip
              label={task.category}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>

        {/* Due Date */}
        {formattedDueDate && (
          <Typography variant="caption" color="text.secondary" display="block">
            Due: {formattedDueDate}
          </Typography>
        )}
      </CardContent>

      <Divider />

      {/* Action Buttons */}
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
        <Tooltip title="Edit task">
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete task">
          <IconButton
            size="small"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.oneOf(['active', 'completed']).isRequired,
    priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    category: PropTypes.string,
    dueDate: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onToggleStatus: PropTypes.func,
};

TaskItem.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  onToggleStatus: () => {},
};

export default TaskItem;