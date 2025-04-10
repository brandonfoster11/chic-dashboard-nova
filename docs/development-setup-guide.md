# StyleAI Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended with the following extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/brandonfoster11/StyleAI.git
cd StyleAI
```

### 2. Environment Setup

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:5173/`.

## Project Structure

```
StyleAI/
├── .github/                # GitHub workflows and configuration
├── docs/                   # Project documentation
├── public/                 # Static assets
├── src/                    # Source code
│   ├── app/                # App-specific configuration
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   ├── repositories/       # Data access layer
│   ├── services/           # Business logic services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── supabase/               # Supabase configuration and migrations
│   ├── edge-functions/     # Serverless functions
│   └── security/           # Security policies and setup
├── .env.example            # Example environment variables
├── index.html              # Entry HTML file
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Development Workflow

### Code Style and Formatting

This project uses ESLint and Prettier for code style and formatting:

- **Lint the code**:
  ```bash
  npm run lint
  ```

- **Format the code**:
  ```bash
  npm run format
  ```

### TypeScript

The project is written in TypeScript. Make sure to define proper types for all variables, functions, and components.

### Component Development

When creating new components:

1. Create the component in the appropriate directory under `src/components/`
2. Use TypeScript interfaces for props
3. Follow the project's naming conventions
4. Include proper documentation comments
5. Implement proper accessibility attributes

Example component structure:

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button component with different variants and sizes
 */
export const Button = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'rounded-md font-medium transition-colors',
        {
          'bg-primary text-white hover:bg-primary/90': variant === 'default',
          'border border-gray-300 bg-transparent hover:bg-gray-50': variant === 'outline',
          'bg-transparent hover:bg-gray-50': variant === 'ghost',
        },
        {
          'px-2 py-1 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Page Development

When creating new pages:

1. Create the page component in `src/pages/`
2. Add the route in `App.tsx`
3. Implement proper data fetching using TanStack Query
4. Add loading and error states

Example page structure:

```tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { wardrobeService } from '@/services/wardrobeService';
import { WardrobeItem } from '@/components/WardrobeItem';
import { SkeletonCard } from '@/components/SkeletonCard';
import { ErrorMessage } from '@/components/ErrorMessage';

export const WardrobePage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['wardrobe'],
    queryFn: () => wardrobeService.getItems(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Failed to load wardrobe items" />;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">My Wardrobe</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <WardrobeItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
```

## Working with Supabase

### Local Development

For local development, you can use the Supabase CLI:

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start a local Supabase instance:
   ```bash
   supabase start
   ```

3. Apply migrations:
   ```bash
   npm run supabase:migrate
   ```

### Database Schema Changes

When making changes to the database schema:

1. Create a new migration file in `supabase/migrations/`
2. Test the migration locally
3. Apply the migration to the development environment
4. Document the changes

### Edge Functions

To develop and test Edge Functions:

1. Create a new function in `supabase/edge-functions/`
2. Test locally using the Supabase CLI:
   ```bash
   supabase functions serve
   ```
3. Deploy the function:
   ```bash
   supabase functions deploy your-function-name
   ```

## Testing

### Running Tests

```bash
npm run test
```

### Writing Tests

- **Component Tests**: Use React Testing Library
- **Service Tests**: Test API interactions
- **Utility Tests**: Test helper functions

Example component test:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="default">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-primary');

    rerender(<Button variant="outline">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('border-gray-300');

    rerender(<Button variant="ghost">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('bg-transparent');
  });
});
```

## Building for Production

To build the project for production:

```bash
npm run build
```

This will create a production-ready build in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set up environment variables
4. Deploy

### GitHub Actions Deployment

The project includes a GitHub Actions workflow for automated deployment:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure your `.env` file is in the root directory
   - Make sure variable names start with `VITE_` for client-side access
   - Restart the development server

2. **TypeScript Errors**
   - Run `npm run type-check` to identify type issues
   - Check for missing type definitions
   - Ensure proper imports for types

3. **Supabase Connection Issues**
   - Verify your Supabase URL and API key
   - Check network connectivity
   - Ensure your IP is allowed in Supabase settings

4. **Build Failures**
   - Check for ESLint errors: `npm run lint`
   - Verify all dependencies are installed
   - Look for TypeScript errors: `npm run type-check`

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

## Contributing

Please follow these guidelines when contributing to the project:

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request
5. Wait for code review and approval

## Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Proper error handling
- [ ] Accessibility considerations
- [ ] Performance considerations
