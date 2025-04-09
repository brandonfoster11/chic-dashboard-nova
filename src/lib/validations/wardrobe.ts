import * as z from 'zod';
import { sanitizeText, sanitizeUrl, sanitizeArray } from '../utils/sanitization';

// Define allowed categories and subcategories
const clothingCategories = [
  'tops', 'bottoms', 'outerwear', 'dresses', 'suits', 
  'shoes', 'accessories', 'underwear', 'sleepwear', 'activewear'
] as const;

const clothingSubcategories = {
  tops: ['t-shirt', 'shirt', 'blouse', 'sweater', 'tank top', 'hoodie', 'polo', 'cardigan'],
  bottoms: ['jeans', 'pants', 'shorts', 'skirt', 'leggings', 'chinos', 'joggers'],
  outerwear: ['jacket', 'coat', 'blazer', 'parka', 'vest', 'windbreaker'],
  dresses: ['casual dress', 'formal dress', 'maxi dress', 'mini dress', 'sundress'],
  suits: ['full suit', 'suit jacket', 'suit pants', 'tuxedo'],
  shoes: ['sneakers', 'boots', 'sandals', 'heels', 'flats', 'loafers', 'dress shoes'],
  accessories: ['hat', 'scarf', 'gloves', 'belt', 'tie', 'bag', 'sunglasses', 'jewelry'],
  underwear: ['boxers', 'briefs', 'bra', 'panties', 'socks', 'undershirt'],
  sleepwear: ['pajamas', 'nightgown', 'robe', 'slippers'],
  activewear: ['workout top', 'workout bottom', 'sports bra', 'swimwear']
};

// Maximum input lengths for security
const MAX_NAME_LENGTH = 50;
const MAX_COLOR_LENGTH = 30;
const MAX_PATTERN_LENGTH = 30;
const MAX_BRAND_LENGTH = 50;
const MAX_TAG_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 500;
const MIN_NAME_LENGTH = 2;
const MIN_COLOR_LENGTH = 2;

// Base schema for wardrobe items
export const wardrobeItemSchema = z.object({
  name: z.string()
    .min(MIN_NAME_LENGTH, { message: `Name must be at least ${MIN_NAME_LENGTH} characters` })
    .max(MAX_NAME_LENGTH, { message: `Name must be less than ${MAX_NAME_LENGTH} characters` })
    .transform(sanitizeText),
  
  category: z.enum(clothingCategories, {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  
  subcategory: z.string()
    .trim()
    .optional()
    .transform(sanitizeText),
  
  color: z.string()
    .min(MIN_COLOR_LENGTH, { message: `Color must be at least ${MIN_COLOR_LENGTH} characters` })
    .max(MAX_COLOR_LENGTH, { message: `Color must be less than ${MAX_COLOR_LENGTH} characters` })
    .transform(sanitizeText),
  
  pattern: z.string()
    .max(MAX_PATTERN_LENGTH, { message: `Pattern must be less than ${MAX_PATTERN_LENGTH} characters` })
    .transform(sanitizeText)
    .optional(),
  
  brand: z.string()
    .max(MAX_BRAND_LENGTH, { message: `Brand must be less than ${MAX_BRAND_LENGTH} characters` })
    .transform(sanitizeText)
    .optional(),
  
  seasons: z.array(
    z.enum(['spring', 'summer', 'fall', 'winter'], {
      errorMap: () => ({ message: 'Please select valid seasons' })
    })
  ).default([]),
  
  formality: z.number()
    .int()
    .min(1, { message: 'Formality must be between 1 and 5' })
    .max(5, { message: 'Formality must be between 1 and 5' })
    .optional(),
  
  image_url: z.string()
    .url({ message: 'Please enter a valid URL' })
    .transform(sanitizeUrl)
    .optional(),
  
  purchase_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
    .optional(),
  
  tags: z.array(z.string().trim().max(MAX_TAG_LENGTH))
    .transform(sanitizeArray)
    .default([]),
  
  description: z.string()
    .max(MAX_DESCRIPTION_LENGTH, { message: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters` })
    .transform(sanitizeText)
    .optional(),
  
  last_worn: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
    .optional(),
  
  favorite: z.boolean()
    .default(false),
  
  wear_count: z.number()
    .int()
    .min(0)
    .default(0),
});

// Schema for creating a new wardrobe item
export const createWardrobeItemSchema = wardrobeItemSchema.omit({ 
  last_worn: true, 
  favorite: true, 
  wear_count: true 
});

// Schema for updating an existing wardrobe item
export const updateWardrobeItemSchema = wardrobeItemSchema.partial();

export type WardrobeItemFormValues = z.infer<typeof wardrobeItemSchema>;
export type CreateWardrobeItemValues = z.infer<typeof createWardrobeItemSchema>;
export type UpdateWardrobeItemValues = z.infer<typeof updateWardrobeItemSchema>;
