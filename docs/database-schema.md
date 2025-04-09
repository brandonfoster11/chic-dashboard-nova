# StyleAI Database Schema Documentation

## Overview
This document provides a comprehensive overview of the database schema for StyleAI, including tables, relationships, policies, and security measures.

## Core Tables

### 1. Roles Table
- **Purpose**: Defines user roles for role-based access control
- **Columns**:
  - `id`: SERIAL PRIMARY KEY
  - `name`: TEXT UNIQUE NOT NULL
  - `description`: TEXT
  - `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 2. Profiles Table
- **Purpose**: Extends auth.users table with additional user information
- **Columns**:
  - `id`: UUID REFERENCES auth.users PRIMARY KEY
  - `username`: TEXT UNIQUE
  - `full_name`: TEXT
  - `avatar_url`: TEXT
  - `role_id`: INTEGER REFERENCES roles(id) DEFAULT 1
  - `style_preferences`: JSONB DEFAULT '{}'
  - `body_measurements`: JSONB DEFAULT '{}'
  - `onboarding_completed`: BOOLEAN DEFAULT FALSE
  - `created_at`: TIMESTAMPTZ DEFAULT NOW()
  - `updated_at`: TIMESTAMPTZ DEFAULT NOW()

### 3. Wardrobe Items Table
- **Purpose**: Stores individual clothing items
- **Columns**:
  - `id`: UUID PRIMARY KEY
  - `user_id`: UUID REFERENCES profiles(id) NOT NULL
  - `name`: TEXT NOT NULL
  - `category`: TEXT NOT NULL
  - `subcategory`: TEXT
  - `color`: TEXT
  - `pattern`: TEXT
  - `brand`: TEXT
  - `seasons`: TEXT[] DEFAULT '{}'
  - `formality`: INTEGER CHECK (formality BETWEEN 1 AND 5)
  - `size`: TEXT
  - `condition`: TEXT
  - `price`: DECIMAL(10,2)
  - `purchase_date`: DATE
  - `notes`: TEXT
  - `created_at`: TIMESTAMPTZ DEFAULT NOW()
  - `updated_at`: TIMESTAMPTZ DEFAULT NOW()

### 4. Outfits Table
- **Purpose**: Stores user-created outfits
- **Columns**:
  - `id`: UUID PRIMARY KEY
  - `user_id`: UUID REFERENCES profiles(id) NOT NULL
  - `name`: TEXT NOT NULL
  - `description`: TEXT
  - `occasion`: TEXT
  - `season`: TEXT
  - `created_at`: TIMESTAMPTZ DEFAULT NOW()
  - `updated_at`: TIMESTAMPTZ DEFAULT NOW()

### 5. Outfit Items Table
- **Purpose**: Links wardrobe items to outfits
- **Columns**:
  - `id`: UUID PRIMARY KEY
  - `outfit_id`: UUID REFERENCES outfits(id) NOT NULL
  - `wardrobe_item_id`: UUID REFERENCES wardrobe_items(id) NOT NULL
  - `position`: INTEGER
  - `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 6. Style Preferences Table
- **Purpose**: Stores user style preferences
- **Columns**:
  - `id`: UUID PRIMARY KEY
  - `user_id`: UUID REFERENCES profiles(id) NOT NULL
  - `preferences`: JSONB
  - `created_at`: TIMESTAMPTZ DEFAULT NOW()
  - `updated_at`: TIMESTAMPTZ DEFAULT NOW()

### 7. Outfit Shares Table
- **Purpose**: Manages outfit sharing between users
- **Columns**:
  - `id`: UUID PRIMARY KEY
  - `outfit_id`: UUID REFERENCES outfits(id) NOT NULL
  - `shared_by`: UUID REFERENCES profiles(id) NOT NULL
  - `shared_with`: UUID REFERENCES profiles(id) NOT NULL
  - `created_at`: TIMESTAMPTZ DEFAULT NOW()

### 8. Outfit Recommendations Table
- **Purpose**: Stores outfit recommendations
- **Columns**:
  - `id`: UUID PRIMARY KEY
  - `user_id`: UUID REFERENCES profiles(id) NOT NULL
  - `outfit_id`: UUID REFERENCES outfits(id)
  - `recommendation_type`: TEXT NOT NULL
  - `created_at`: TIMESTAMPTZ DEFAULT NOW()
  - `updated_at`: TIMESTAMPTZ DEFAULT NOW()

## Indexes
- `idx_wardrobe_items_user_id`: Index on wardrobe_items(user_id)
- `idx_outfits_user_id`: Index on outfits(user_id)
- `idx_outfit_items_outfit_id`: Index on outfit_items(outfit_id)
- `idx_outfit_shares_shared_by`: Index on outfit_shares(shared_by)
- `idx_outfit_shares_shared_with`: Index on outfit_shares(shared_with)
- `idx_outfit_recommendations_user_id`: Index on outfit_recommendations(user_id)

## Row Level Security (RLS) Policies

### Profiles Table
- Users can view their own profile
- Users can update their own profile
- Admins can view all profiles
- Admins can update all profiles

### Wardrobe Items Table
- Users can view their own wardrobe items
- Users can insert their own wardrobe items
- Users can update their own wardrobe items
- Users can delete their own wardrobe items
- Admins can view all wardrobe items
- Admins can update all wardrobe items
- Admins can delete all wardrobe items

### Outfits Table
- Users can view their own outfits or shared with them
- Users can insert their own outfits
- Users can update their own outfits
- Users can delete their own outfits
- Admins can view all outfits
- Admins can update all outfits
- Admins can delete all outfits

### Outfit Items Table
- Users can view items in their own outfits or shared with them
- Users can insert items to their own outfits
- Users can update items in their own outfits
- Users can delete items from their own outfits
- Admins can view all outfit items
- Admins can update all outfit items
- Admins can delete all outfit items

### Style Preferences Table
- Users can view their own style preferences
- Users can insert their own style preferences
- Users can update their own style preferences
- Admins can view all style preferences
- Admins can insert all style preferences
- Admins can update all style preferences

### Outfit Shares Table
- Users can view outfits shared by them or with them
- Users can share their own outfits
- Users can delete shares they created
- Admins can view all outfit shares
- Admins can insert all outfit shares
- Admins can delete all outfit shares

### Outfit Recommendations Table
- Users can view their own recommendations
- Users can update their own recommendations
- Admins can view all outfit recommendations
- Admins can insert all outfit recommendations
- Admins can update all outfit recommendations

## Security Features

### Authentication & Authorization
- Uses Supabase Auth for user authentication
- Implements Role-Based Access Control (RBAC)
- Two predefined roles:
  - `user`: Regular user with standard permissions
  - `admin`: Administrator with full access

### Rate Limiting
- Implemented via Supabase Edge Functions
- Rate limits:
  - `/generate-outfit`: 5 requests per minute
  - `/auth/login`: 5 requests per 5 minutes
  - `/upload`: 10 requests per hour
  - Default: 20 requests per minute

### Data Protection
- All tables have Row Level Security enabled
- User data is protected by RLS policies
- Admins have elevated access permissions
- Secure storage policies for wardrobe images

### CCPA Compliance
- Functions for data export, deletion, and anonymization
- Privacy component for user data management
- Export functionality includes:
  - Profile information
  - Wardrobe items
  - Outfits
  - Style preferences
  - Outfit shares
  - Recommendations

## Deployment Status
- Schema deployed to Supabase project: xrzjagfctsvglikwyfxn
- RLS policies enabled on all tables
- Rate limiting configured via Edge Functions
- CCPA compliance features implemented
- Security scanning integrated via GitHub Actions
