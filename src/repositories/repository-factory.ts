/**
 * Repository Factory
 * 
 * This class provides a centralized way to create and access repositories.
 * It ensures that only one instance of each repository is created.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { ProfileRepository } from './profile-repository';
import { WardrobeRepository } from './wardrobe-repository';
import { OutfitRepository } from './outfit-repository';
import { StyleRepository } from './style-repository';

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private client: SupabaseClient<Database>;
  
  private profileRepository: ProfileRepository | null = null;
  private wardrobeRepository: WardrobeRepository | null = null;
  private outfitRepository: OutfitRepository | null = null;
  private styleRepository: StyleRepository | null = null;

  private constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  /**
   * Get the singleton instance of the repository factory
   * @param client Supabase client
   * @returns Repository factory instance
   */
  public static getInstance(client: SupabaseClient<Database>): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory(client);
    }
    return RepositoryFactory.instance;
  }

  /**
   * Get the profile repository
   * @returns Profile repository
   */
  public getProfileRepository(): ProfileRepository {
    if (!this.profileRepository) {
      this.profileRepository = new ProfileRepository(this.client);
    }
    return this.profileRepository;
  }

  /**
   * Get the wardrobe repository
   * @returns Wardrobe repository
   */
  public getWardrobeRepository(): WardrobeRepository {
    if (!this.wardrobeRepository) {
      this.wardrobeRepository = new WardrobeRepository(this.client);
    }
    return this.wardrobeRepository;
  }

  /**
   * Get the outfit repository
   * @returns Outfit repository
   */
  public getOutfitRepository(): OutfitRepository {
    if (!this.outfitRepository) {
      this.outfitRepository = new OutfitRepository(this.client);
    }
    return this.outfitRepository;
  }

  /**
   * Get the style repository
   * @returns Style repository
   */
  public getStyleRepository(): StyleRepository {
    if (!this.styleRepository) {
      this.styleRepository = new StyleRepository(this.client);
    }
    return this.styleRepository;
  }
}
