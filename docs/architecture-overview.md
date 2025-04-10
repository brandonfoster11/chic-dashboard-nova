# StyleAI Architecture Overview

## System Architecture

StyleAI follows a modern frontend architecture with a Supabase backend, leveraging the power of React, TypeScript, and serverless functions. This document provides a comprehensive overview of the system architecture.

![Architecture Diagram](https://mermaid.ink/img/pako:eNqFkk1rwzAMhv-K0GmD_YHADmvXww5bYYcedvFpxKrjBNsZlJL_PjtJ2ZrCNrAty3r0vJI-YKUlYgJrpXfKSHRQoWrRWmXeUTnYPJXNDkr0jcONUhCMRFdpvYfSGFTOQqO0hK3WDYwwwgTTdDrNZnCnm9JYKNXOgVEOnHLQGLWDtdLWQaXqGpbGVLBSxkKpnXKwMbqBjTYVPGlXwVKbGt5QF5BoC5XWDjZGVbDVdQlLVTsotN7BRpUO1qhKWCjdwBPqEu5Rl_CIWsJCO9jq2kGhVQMrVTt4Vk7CvXYSFrqWsFQOCq0beELdwFJJB89KNrBQUkKB2sGzkg6eddPAQkkJT0o28KikgyfUDTwq2cBCSQfPqIFEOQcFKgcbVTt4UbKBhZLwgLqBhZISnlHCQkkHa1QOCiUdrFE5WKNysEYNiTLwR5IkZ0mSXsXxJIriOI6nUZQm6Sw9i-M4Gv-eDnEYhsNgEIZBGIRBMBwOg-EwCILRaPSXEPwAl8XYzQ?type=png)

## Frontend Architecture

### Core Technologies
- **React**: UI library for building component-based interfaces
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **Vite**: Modern frontend build tool for fast development and optimized production builds
- **TanStack Query**: Data fetching and state management library
- **Zod**: TypeScript-first schema validation
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **shadcn/ui**: Reusable UI component library

### Directory Structure
```
src/
├── app/            # App-specific configuration
├── components/     # Reusable UI components
├── contexts/       # React contexts for state management
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries and configurations
├── pages/          # Page components
├── repositories/   # Data access layer
├── services/       # Business logic services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

### Key Components

#### State Management
StyleAI uses a combination of React Context and TanStack Query for state management:

1. **Context API**: For global application state
   - `AuthContext`: Manages user authentication state
   - `ThemeContext`: Manages application theme
   - `OnboardingContext`: Manages user onboarding flow
   - `ToastContext`: Manages toast notifications

2. **TanStack Query**: For server state management
   - Handles data fetching, caching, and synchronization
   - Provides loading and error states
   - Manages background refetching and optimistic updates

#### Repository Pattern
The application implements the repository pattern to abstract data access:

1. **Base Repository**: Provides common CRUD operations
2. **Specialized Repositories**:
   - `ProfileRepository`: User profile operations
   - `WardrobeRepository`: Wardrobe item operations
   - `OutfitRepository`: Outfit operations
   - `StylePreferenceRepository`: Style preference operations
   - `OutfitShareRepository`: Outfit sharing operations
   - `OutfitRecommendationRepository`: Recommendation operations

#### Services Layer
Services encapsulate business logic and interact with repositories:

1. **AuthService**: Handles user authentication and session management
2. **WardrobeService**: Manages wardrobe items and operations
3. **OutfitService**: Handles outfit generation and management
4. **StorageService**: Manages file uploads and storage
5. **UserService**: Handles user profile and preferences
6. **PrivacyService**: Manages CCPA compliance operations

## Backend Architecture (Supabase)

### Core Technologies
- **PostgreSQL**: Relational database for data storage
- **Supabase Auth**: Authentication and authorization service
- **Supabase Storage**: File storage service
- **Supabase Edge Functions**: Serverless functions for custom logic
- **Row Level Security (RLS)**: Database-level security policies

### Database Schema
The database schema is designed with security and performance in mind:

1. **Core Tables**:
   - `roles`: User role definitions for RBAC
   - `profiles`: User profile information
   - `wardrobe_items`: User's clothing items
   - `outfits`: User-created outfits
   - `outfit_items`: Links wardrobe items to outfits
   - `style_preferences`: User style preferences
   - `outfit_shares`: Manages outfit sharing
   - `outfit_recommendations`: Stores outfit recommendations

2. **Security Tables**:
   - `mfa_logs`: Logs authentication events
   - `security_audit_logs`: Tracks security-related actions

### Security Architecture

#### Authentication & Authorization
1. **Supabase Auth**: Handles user registration, login, and session management
2. **Role-Based Access Control (RBAC)**:
   - `user`: Regular user with standard permissions
   - `admin`: Administrator with elevated permissions
3. **Row Level Security (RLS)**: Database-level security policies
   - User-specific data access
   - Admin override policies
   - Shared resource access controls

#### Data Protection
1. **Input Validation**: Zod schema validation for all user inputs
2. **Data Sanitization**: Input sanitization to prevent XSS and injection attacks
3. **Rate Limiting**: Prevents abuse of API endpoints
4. **Secure Storage**: Policies for secure file storage and access

#### CCPA Compliance
1. **Data Export**: Functions to export all user data
2. **Data Deletion**: Functions to delete user data
3. **Data Anonymization**: Alternative to deletion that preserves analytics

### Edge Functions
Serverless functions for custom backend logic:

1. **generate-outfit**: AI-powered outfit generation
2. **rate-limiter**: Implements rate limiting for API endpoints
3. **export-user-data**: Handles CCPA data export requests

## Authentication Flow

1. **Registration**:
   - User submits registration form
   - Supabase Auth creates user account
   - Trigger creates profile record
   - User is redirected to onboarding

2. **Login**:
   - User submits login form
   - Supabase Auth validates credentials
   - Session is created and stored
   - User is redirected to dashboard

3. **Session Management**:
   - JWT token is stored in local storage
   - Token is refreshed automatically
   - AuthContext provides authentication state

4. **Logout**:
   - User initiates logout
   - Session is destroyed
   - User is redirected to login page

## Data Flow

### Wardrobe Item Creation
1. User submits wardrobe item form
2. Client validates input with Zod
3. Image is uploaded to Supabase Storage
4. Wardrobe item is created in database
5. UI is updated with new item

### Outfit Generation
1. User requests outfit generation
2. Request is sent to generate-outfit edge function
3. Function queries user's wardrobe items and preferences
4. AI generates outfit recommendation
5. Outfit is saved to database
6. UI displays generated outfit

## Performance Optimizations

1. **Database Indexes**:
   - Optimized indexes for common query patterns
   - Composite indexes for complex queries

2. **Caching Strategy**:
   - TanStack Query for client-side caching
   - Stale-while-revalidate pattern
   - Optimistic updates for better UX

3. **Code Splitting**:
   - Route-based code splitting
   - Lazy loading of components
   - Dynamic imports for large libraries

4. **Asset Optimization**:
   - Image compression and optimization
   - Modern image formats (WebP)
   - Responsive images with srcset

## Deployment Architecture

1. **Frontend**:
   - Vite build process
   - Static site hosting
   - CDN distribution

2. **Backend**:
   - Supabase hosted services
   - PostgreSQL database
   - Edge functions deployment

## Monitoring and Logging

1. **Error Tracking**:
   - Client-side error logging
   - Server-side error logging
   - Error reporting and alerting

2. **Performance Monitoring**:
   - API response times
   - Database query performance
   - Client-side performance metrics

3. **Security Monitoring**:
   - Authentication event logging
   - Security audit logging
   - Rate limit violation tracking

## Future Architecture Considerations

1. **Scalability**:
   - Horizontal scaling of edge functions
   - Database sharding for large user bases
   - Read replicas for high-traffic scenarios

2. **Feature Expansion**:
   - Social sharing capabilities
   - Advanced AI recommendations
   - Mobile app integration
   - AR/VR wardrobe visualization

3. **Performance Enhancements**:
   - Server-side rendering for critical paths
   - WebSocket for real-time features
   - Advanced caching strategies
