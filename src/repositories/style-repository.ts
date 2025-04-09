/**
 * Style Repository
 * 
 * This class handles database operations for style preferences and recommendations.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base-repository';
import { Database, StylePreference, OutfitRecommendation } from '../types/database';

export class StyleRepository extends BaseRepository<
  StylePreference,
  Omit<StylePreference, 'id' | 'created_at' | 'updated_at'>,
  Partial<Omit<StylePreference, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
> {
  constructor(client: SupabaseClient<Database>) {
    super(client, 'style_preferences');
  }

  /**
   * Get style preferences for the current user
   * @returns Style preferences or null if not found
   */
  async getCurrentUserPreferences(): Promise<StylePreference | null> {
    try {
      const { data: user } = await this.client.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('user_id', user.user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Style preferences not found
          return null;
        }
        console.error('Error fetching current user style preferences:', error);
        throw error;
      }
      
      return data as StylePreference;
    } catch (error) {
      console.error('Error in getCurrentUserPreferences:', error);
      throw error;
    }
  }

  /**
   * Create or update style preferences for the current user
   * @param data Style preference data
   * @returns Created or updated style preferences
   */
  async saveCurrentUserPreferences(data: Partial<Omit<StylePreference, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<StylePreference> {
    try {
      const { data: user } = await this.client.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      // Check if preferences already exist
      const currentPreferences = await this.getCurrentUserPreferences();
      
      if (currentPreferences) {
        // Update existing preferences
        return this.update(currentPreferences.id, data);
      } else {
        // Create new preferences
        const preferenceData = {
          ...data,
          user_id: user.user.id
        };
        
        return this.create(preferenceData as any);
      }
    } catch (error) {
      console.error('Error saving current user style preferences:', error);
      throw error;
    }
  }

  /**
   * Get recommended outfits for the current user
   * @returns Array of outfit recommendations
   */
  async getRecommendations(): Promise<OutfitRecommendation[]> {
    try {
      const { data: user } = await this.client.auth.getUser();
      
      if (!user.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await this.client
        .from('outfit_recommendations')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('is_viewed', false)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching outfit recommendations:', error);
        throw error;
      }
      
      return data as OutfitRecommendation[];
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      throw error;
    }
  }

  /**
   * Mark a recommendation as viewed
   * @param recommendationId Recommendation ID
   * @returns Updated recommendation
   */
  async markRecommendationAsViewed(recommendationId: string): Promise<OutfitRecommendation> {
    try {
      const { data, error } = await this.client
        .from('outfit_recommendations')
        .update({ is_viewed: true })
        .eq('id', recommendationId)
        .select()
        .single();
      
      if (error) {
        console.error('Error marking recommendation as viewed:', error);
        throw error;
      }
      
      return data as OutfitRecommendation;
    } catch (error) {
      console.error('Error in markRecommendationAsViewed:', error);
      throw error;
    }
  }

  /**
   * Save a recommendation
   * @param recommendationId Recommendation ID
   * @returns Updated recommendation
   */
  async saveRecommendation(recommendationId: string): Promise<OutfitRecommendation> {
    try {
      const { data, error } = await this.client
        .from('outfit_recommendations')
        .update({ is_saved: true })
        .eq('id', recommendationId)
        .select()
        .single();
      
      if (error) {
        console.error('Error saving recommendation:', error);
        throw error;
      }
      
      return data as OutfitRecommendation;
    } catch (error) {
      console.error('Error in saveRecommendation:', error);
      throw error;
    }
  }

  /**
   * Provide feedback on a recommendation
   * @param recommendationId Recommendation ID
   * @param feedback Feedback text
   * @returns Updated recommendation
   */
  async provideFeedback(recommendationId: string, feedback: string): Promise<OutfitRecommendation> {
    try {
      const { data, error } = await this.client
        .from('outfit_recommendations')
        .update({ feedback })
        .eq('id', recommendationId)
        .select()
        .single();
      
      if (error) {
        console.error('Error providing feedback on recommendation:', error);
        throw error;
      }
      
      return data as OutfitRecommendation;
    } catch (error) {
      console.error('Error in provideFeedback:', error);
      throw error;
    }
  }
}
