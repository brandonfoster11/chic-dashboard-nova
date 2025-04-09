/**
 * StyleAI Database Types
 * 
 * This file contains TypeScript interfaces for the StyleAI database schema.
 * These types are used throughout the application to ensure type safety
 * when interacting with the database.
 */

import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Profile represents a user profile in the system
 */
export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  style_preferences?: Record<string, any>;
  body_measurements?: Record<string, any>;
  onboarding_completed?: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * WardrobeItem represents a clothing item in a user's wardrobe
 */
export interface WardrobeItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  subcategory?: string;
  color?: string;
  pattern?: string;
  brand?: string;
  seasons?: string[];
  formality?: number;
  image_url?: string;
  purchase_date?: string;
  last_worn?: string;
  favorite: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  wear_count: number;
  times_worn: number;
}

/**
 * Outfit represents a collection of wardrobe items
 */
export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  occasion?: string;
  season?: string;
  formality?: number;
  rating?: number;
  times_worn: number;
  is_favorite: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * OutfitItem represents a junction between outfits and wardrobe items
 */
export interface OutfitItem {
  id: string;
  outfit_id: string;
  item_id: string;
  position: number;
  created_at: string;
}

/**
 * StylePreference represents a user's style preferences
 */
export interface StylePreference {
  id: string;
  user_id: string;
  color_palette?: string[];
  preferred_styles?: string[];
  avoided_styles?: string[];
  preferred_brands?: string[];
  seasonal_preferences?: Record<string, any>;
  occasion_preferences?: Record<string, any>;
  quiz_results?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * OutfitShare represents a shared outfit between users
 */
export interface OutfitShare {
  id: string;
  outfit_id: string;
  shared_by: string;
  shared_with: string;
  created_at: string;
}

/**
 * OutfitRecommendation represents an AI-generated outfit recommendation
 */
export interface OutfitRecommendation {
  id: string;
  user_id: string;
  outfit_id?: string;
  recommendation_type: string;
  occasion?: string;
  season?: string;
  confidence_score?: number;
  is_viewed: boolean;
  is_saved: boolean;
  feedback?: string;
  created_at: string;
}

/**
 * Database schema definition
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      wardrobe_items: {
        Row: WardrobeItem;
        Insert: Omit<WardrobeItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WardrobeItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      outfits: {
        Row: Outfit;
        Insert: Omit<Outfit, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Outfit, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      outfit_items: {
        Row: OutfitItem;
        Insert: Omit<OutfitItem, 'id' | 'created_at'>;
        Update: Partial<Omit<OutfitItem, 'id' | 'outfit_id' | 'item_id' | 'created_at'>>;
      };
      style_preferences: {
        Row: StylePreference;
        Insert: Omit<StylePreference, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StylePreference, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      outfit_shares: {
        Row: OutfitShare;
        Insert: Omit<OutfitShare, 'id' | 'created_at'>;
        Update: Partial<Omit<OutfitShare, 'id' | 'outfit_id' | 'shared_by' | 'created_at'>>;
      };
      outfit_recommendations: {
        Row: OutfitRecommendation;
        Insert: Omit<OutfitRecommendation, 'id' | 'created_at'>;
        Update: Partial<Omit<OutfitRecommendation, 'id' | 'user_id' | 'created_at'>>;
      };
    };
    Functions: {
      get_tables: {
        Args: Record<string, never>;
        Returns: {
          table_name: string;
          table_type: string;
          estimated_row_count: number;
        }[];
      };
      get_policies: {
        Args: Record<string, never>;
        Returns: {
          table_name: string;
          policy_name: string;
          command: string;
          roles: string[];
          using_expression: string;
          with_check_expression: string;
        }[];
      };
      get_columns: {
        Args: Record<string, never>;
        Returns: {
          table_name: string;
          column_name: string;
          data_type: string;
          is_nullable: boolean;
          column_default: string;
          is_identity: boolean;
        }[];
      };
      get_recommended_outfits: {
        Args: {
          user_id: string;
        };
        Returns: {
          outfit_id: string;
          outfit_name: string;
          outfit_description: string;
          occasion: string;
          season: string;
          confidence_score: number;
        }[];
      };
      exec_sql: {
        Args: {
          sql: string;
        };
        Returns: void;
      };
    };
  };
}

export type DbClient = SupabaseClient<Database>;
