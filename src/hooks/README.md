# Hooks Structure

This directory contains feature-based hooks organized by functionality.

## Structure

Each feature has its own folder containing:
- `types.ts` - TypeScript types and interfaces
- `api.ts` - API functions and HTTP requests
- `reducer.ts` - State reducer for managing feature state
- `useAuth.ts` (optional) - Custom React hooks for easy component integration
- `index.ts` - Exports all public APIs

## Features

### Auth (`/auth`)

Authentication feature with login, signup, and user management.

**Usage Example:**

```typescript
import { useAuth } from '@/hooks/auth';

function LoginComponent() {
  const { login, isLoading, error, isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({
      email: 'test@gmail.com',
      password: '123123123'
    });
    
    if (result.success) {
      console.log('Logged in!', result.data.user);
    } else {
      console.error('Login failed:', result.error);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user?.full_name}!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

**API Functions:**

```typescript
import { login, signup, getCurrentUser, logout } from '@/hooks/auth';

// Login
const response = await login({ email: '...', password: '...' });

// Signup
const response = await signup({ 
  email: '...', 
  username: '...', 
  full_name: '...', 
  password: '...' 
});

// Get current user
const user = await getCurrentUser();

// Logout
logout();
```

## Adding New Features

1. Create a new folder: `src/hooks/feature-name/`
2. Add the required files:
   - `types.ts` - Define types
   - `api.ts` - Implement API calls
   - `reducer.ts` - Create reducer
   - `index.ts` - Export everything
3. Optionally add custom hooks (e.g., `useFeatureName.ts`)

