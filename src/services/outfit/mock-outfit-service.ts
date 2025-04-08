import { GeneratedOutfit, OutfitGenerationRequest, OutfitItem, OutfitService } from './types';

// Mock outfit items
const mockTops: OutfitItem[] = [
  {
    id: 't1',
    name: 'White Cotton T-Shirt',
    type: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format',
    color: 'white',
    brand: 'Essentials',
    description: 'Classic white cotton t-shirt with a crew neck'
  },
  {
    id: 't2',
    name: 'Blue Oxford Shirt',
    type: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=500&auto=format',
    color: 'blue',
    brand: 'Brooks Brothers',
    description: 'Light blue button-down oxford shirt'
  },
  {
    id: 't3',
    name: 'Black Turtleneck',
    type: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?w=500&auto=format',
    color: 'black',
    brand: 'Uniqlo',
    description: 'Slim-fit black turtleneck sweater'
  }
];

const mockBottoms: OutfitItem[] = [
  {
    id: 'b1',
    name: 'Blue Jeans',
    type: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format',
    color: 'blue',
    brand: 'Levi\'s',
    description: 'Classic blue straight-leg jeans'
  },
  {
    id: 'b2',
    name: 'Black Chinos',
    type: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format',
    color: 'black',
    brand: 'Dockers',
    description: 'Slim-fit black chino pants'
  },
  {
    id: 'b3',
    name: 'Khaki Shorts',
    type: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=500&auto=format',
    color: 'beige',
    brand: 'Gap',
    description: 'Casual khaki shorts for summer'
  }
];

const mockShoes: OutfitItem[] = [
  {
    id: 's1',
    name: 'White Sneakers',
    type: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format',
    color: 'white',
    brand: 'Adidas',
    description: 'Clean white leather sneakers'
  },
  {
    id: 's2',
    name: 'Brown Loafers',
    type: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&auto=format',
    color: 'brown',
    brand: 'Cole Haan',
    description: 'Classic brown penny loafers'
  },
  {
    id: 's3',
    name: 'Black Boots',
    type: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&auto=format',
    color: 'black',
    brand: 'Dr. Martens',
    description: 'Sturdy black leather boots'
  }
];

const mockAccessories: OutfitItem[] = [
  {
    id: 'a1',
    name: 'Silver Watch',
    type: 'accessory',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format',
    color: 'silver',
    brand: 'Timex',
    description: 'Minimalist silver watch with leather strap'
  },
  {
    id: 'a2',
    name: 'Black Belt',
    type: 'accessory',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format',
    color: 'black',
    brand: 'Fossil',
    description: 'Classic black leather belt'
  },
  {
    id: 'a3',
    name: 'Blue Beanie',
    type: 'accessory',
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&auto=format',
    color: 'blue',
    brand: 'The North Face',
    description: 'Warm knit beanie in navy blue'
  }
];

// Mock outfit responses based on keywords
const outfitResponses: Record<string, string[]> = {
  casual: [
    "Here's a casual outfit perfect for everyday wear.",
    "I've created a relaxed, casual look that's both comfortable and stylish.",
    "This laid-back outfit works great for casual outings or weekend activities."
  ],
  formal: [
    "I've put together an elegant formal outfit suitable for special occasions.",
    "This sophisticated ensemble will make you stand out at formal events.",
    "Here's a polished formal look that exudes confidence and style."
  ],
  summer: [
    "This light, breathable outfit is perfect for hot summer days.",
    "I've created a summer look that will keep you cool while looking great.",
    "Here's a vibrant summer outfit ideal for beach days or outdoor activities."
  ],
  winter: [
    "This layered outfit will keep you warm during the cold winter months.",
    "I've designed a cozy winter look that doesn't sacrifice style for warmth.",
    "This winter ensemble combines functionality with fashion for the colder season."
  ],
  office: [
    "This professional outfit is perfect for the workplace.",
    "I've created a business-appropriate look that maintains your personal style.",
    "Here's a polished office outfit that strikes the right balance between professional and comfortable."
  ],
  date: [
    "This outfit will make a great impression on your date night.",
    "I've designed a stylish look perfect for a romantic evening out.",
    "This ensemble strikes the right balance between effort and effortlessness for your date."
  ]
};

// Helper function to get random items from arrays
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to generate outfit description based on keywords
const generateOutfitDescription = (prompt: string): string => {
  const promptLower = prompt.toLowerCase();
  
  for (const [keyword, responses] of Object.entries(outfitResponses)) {
    if (promptLower.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Default response if no keywords match
  return "I've created an outfit based on your preferences. This versatile look can be styled in multiple ways.";
};

export class MockOutfitService implements OutfitService {
  private savedOutfits: GeneratedOutfit[] = [];

  async generateOutfit(request: OutfitGenerationRequest): Promise<GeneratedOutfit> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a random outfit based on the prompt
    const top = getRandomItems(mockTops, 1)[0];
    const bottom = getRandomItems(mockBottoms, 1)[0];
    const shoes = getRandomItems(mockShoes, 1)[0];
    const accessories = getRandomItems(mockAccessories, Math.random() > 0.5 ? 1 : 0);
    
    const outfitItems = [top, bottom, shoes, ...accessories];
    const description = generateOutfitDescription(request.prompt);
    
    const generatedOutfit: GeneratedOutfit = {
      id: `outfit-${Date.now()}`,
      name: `Outfit for ${new Date().toLocaleDateString()}`,
      items: outfitItems,
      description,
      createdAt: new Date().toISOString(),
      prompt: request.prompt
    };
    
    return generatedOutfit;
  }

  async saveOutfit(outfit: GeneratedOutfit): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.savedOutfits.push(outfit);
    
    // Save to localStorage for persistence
    const existingOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    localStorage.setItem('savedOutfits', JSON.stringify([...existingOutfits, outfit]));
  }

  async getUserOutfits(): Promise<GeneratedOutfit[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get from localStorage
    const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');
    this.savedOutfits = savedOutfits;
    
    return this.savedOutfits;
  }
}
