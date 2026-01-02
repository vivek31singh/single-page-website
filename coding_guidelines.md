# Development Guidelines

## File Structure
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── InputField/
│   │   ├── Modal/
│   │   └── LoadingSpinner/
│   ├── layout/
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── TaskList/
│   └── tasks/
│       ├── TaskItem/
│       ├── TaskForm/
│       └── TaskFilters/
├── hooks/
│   ├── useTasks.js
│   ├── useLocalStorage.js
│   └── useNotification.js
├── pages/
│   ├── Dashboard/
│   ├── TaskManager/
│   └── Settings/
├── store/
│   ├── index.js
│   ├── tasksSlice.js
│   ├── categoriesSlice.js
│   └── uiSlice.js
├── services/
│   ├── api.js
│   └── taskService.js
├── utils/
│   ├── dateHelpers.js
│   └── validation.js
├── styles/
│   ├── global.css
│   ├── variables.css
│   └── components.css
├── App.jsx
├── index.jsx
└── router.jsx

## Naming Conventions
Files: PascalCase for components (TaskList.jsx), camelCase for utilities and hooks (useTasks.js)
Variables: camelCase for variables and functions (getUserTasks)
Constants: UPPER_SNAKE_CASE for constants (API_BASE_URL)
Components: PascalCase (TaskItem)
CSS classes: kebab-case (task-item, button-primary)
Redux slices: camelCase with 'Slice' suffix (tasksSlice.js)

## Coding Standards
Use functional components with hooks
Implement PropTypes for type checking
Keep components small and focused (single responsibility)
Use arrow functions for callbacks and methods
Destructure props and use default values
Write self-documenting code with descriptive names
Follow the 80-character line limit where practical
Add comments for complex logic or business rules
Avoid nested ternary operators; use early returns instead
Use try-catch for error handling in async operations
Implement proper cleanup in useEffect hooks

## Testing Strategy
Unit tests: Test individual components, utility functions, and hooks using Jest and React Testing Library
Integration tests: Test component interactions and Redux store using React Testing Library
End-to-end tests: Test critical user flows using Cypress
Snapshot testing: For components to prevent unintended UI changes
Coverage goal: Minimum 70% code coverage for critical components
Test naming: Describe what is being tested and the expected result (e.g., 'should create a new task when form is submitted')

## Error Handling
Try-catch blocks around async operations
Redux actions for error state management
Consistent error objects with code, message, and details
User-friendly error messages for display
Error logging to console in development
Global error boundary for catching React errors
Specific error types for different scenarios (validation, network, etc.)
Fallback components for error states
Retry mechanisms for network failures

## Dependencies
react, react-dom, react-router-dom, @reduxjs/toolkit, react-redux, @mui/material, @emotion/react, @emotion/styled, @mui/icons-material, axios, date-fns, prop-types, react-hot-toast, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jest-environment-jsdom, eslint, prettier

## Configuration
vite.config.js - Vite configuration with React plugin
.eslintrc. - ESLint rules for React and JSX
.prettierrc - Code formatting rules
tailwind.config.js - If using Tailwind CSS (optional)
.env.development - Development environment variables
.env.production - Production environment variables
jest.config.js - Jest testing configuration
package. - Project dependencies and scripts
