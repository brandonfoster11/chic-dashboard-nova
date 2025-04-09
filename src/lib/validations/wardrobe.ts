import * as z from 'zod';

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

// Sanitize text input
const sanitizeText = (input: string) => {
  // Remove any HTML tags
  const noHtml = input.replace(/<[^>]*>/g, '');
  // Trim whitespace
  return noHtml.trim();
};

// Base schema for wardrobe items
export const wardrobeItemSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' })
    .transform(sanitizeText),
  
  category: z.enum(clothingCategories, {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  
  subcategory: z.string()
    .trim()
    .refine(
      (val) => {
        const category = z.getContext().data.category as keyof typeof clothingSubcategories;
        return clothingSubcategories[category]?.includes(val) || val === '';
      },
      { message: 'Please select a valid subcategory for the selected category' }
    )
    .optional(),
  
  color: z.string()
    .trim()
    .min(2, { message: 'Color must be at least 2 characters' })
    .max(30, { message: 'Color must be less than 30 characters' })
    .transform(sanitizeText),
  
  pattern: z.string()
    .trim()
    .max(30, { message: 'Pattern must be less than 30 characters' })
    .transform(sanitizeText)
    .optional(),
  
  brand: z.string()
    .trim()
    .max(50, { message: 'Brand must be less than 50 characters' })
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
    .optional(),
  
  purchase_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
    .optional(),
  
  tags: z.array(z.string().trim().max(20))
    .transform(tags => tags.map(sanitizeText))
    .default([]),
  
  description: z.string()
    .trim()
    .max(500, { message: 'Description must be less than 500 characters' })
    .transform(sanitizeText)
    .optional(),
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
