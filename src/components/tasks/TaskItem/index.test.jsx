import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './index';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test description',
  status: 'active',
  priority: 'high',
  category: 'work',
  dueDate: '2024-12-31',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('TaskItem', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnToggleStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('should render task description', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render priority chip', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should render status chip', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should call onToggleStatus when status icon is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );
    const statusButton = screen.getByTitle(/mark as completed/i);
    fireEvent.click(statusButton);
    expect(mockOnToggleStatus).toHaveBeenCalledWith('1');
  });
});