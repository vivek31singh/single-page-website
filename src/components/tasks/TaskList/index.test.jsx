import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './index';

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Test description',
    status: 'active',
    priority: 'high',
    category: 'work',
    dueDate: '2024-12-31',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Another description',
    status: 'completed',
    priority: 'low',
    category: 'personal',
    dueDate: '2024-12-31',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('TaskList', () => {
  it('should render empty state when no tasks are provided', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText('No Tasks Found')).toBeInTheDocument();
  });

  it('should render loading state when loading is true', () => {
    render(<TaskList tasks={[]} loading={true} />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('should render task items when tasks are provided', () => {
    render(<TaskList tasks={mockTasks} />);
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('should render correct number of task items', () => {
    const { container } = render(<TaskList tasks={mockTasks} />);
    const taskCards = container.querySelectorAll('[role="button"]');
    expect(taskCards.length).toBeGreaterThan(0);
  });
});