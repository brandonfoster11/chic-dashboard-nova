import { WardrobeFilters, WardrobeItem, WardrobeService, WardrobeStats } from './types';

// Generate mock wardrobe data
const mockWardrobeItems: WardrobeItem[] = [
  {
    id: 'w1',
    name: 'White Oxford Shirt',
    type: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=500&auto=format',
    color: 'white',
    brand: 'Brooks Brothers',
    description: 'Classic white button-down oxford shirt',
    dateAdded: '2025-03-15T12:00:00Z',
    favorite: true,
    tags: ['formal', 'work', 'classic'],
    wearCount: 12,
    lastWorn: '2025-04-05T09:00:00Z'
  },
  {
    id: 'w2',
    name: 'Navy Blue Blazer',
    type: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=500&auto=format',
    color: 'blue',
    brand: 'J.Crew',
    description: 'Tailored navy blue wool blazer',
    dateAdded: '2025-02-20T15:30:00Z',
    favorite: true,
    tags: ['formal', 'work', 'classic'],
    wearCount: 8,
    lastWorn: '2025-04-01T14:00:00Z'
  },
  {
    id: 'w3',
    name: 'Black Slim Jeans',
    type: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format',
    color: 'black',
    brand: 'Levi\'s',
    description: 'Slim fit black denim jeans',
    dateAdded: '2025-01-10T10:15:00Z',
    favorite: false,
    tags: ['casual', 'everyday'],
    wearCount: 25,
    lastWorn: '2025-04-07T08:00:00Z'
  },
  {
    id: 'w4',
    name: 'Brown Leather Boots',
    type: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format',
    color: 'brown',
    brand: 'Red Wing',
    description: 'Classic brown leather work boots',
    dateAdded: '2024-12-05T16:45:00Z',
    favorite: true,
    tags: ['casual', 'winter', 'durable'],
    wearCount: 30,
    lastWorn: '2025-04-06T09:00:00Z'
  },
  {
    id: 'w5',
    name: 'Gray Wool Sweater',
    type: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&auto=format',
    color: 'gray',
    brand: 'Uniqlo',
    description: 'Soft merino wool crewneck sweater',
    dateAdded: '2025-01-25T11:20:00Z',
    favorite: false,
    tags: ['winter', 'casual', 'cozy'],
    wearCount: 15,
    lastWorn: '2025-03-20T10:00:00Z'
  },
  {
    id: 'w6',
    name: 'Khaki Chinos',
    type: 'bottom',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format',
    color: 'beige',
    brand: 'Dockers',
    description: 'Classic fit khaki chino pants',
    dateAdded: '2025-02-10T14:30:00Z',
    favorite: false,
    tags: ['work', 'casual', 'versatile'],
    wearCount: 18,
    lastWorn: '2025-04-03T09:00:00Z'
  },
  {
    id: 'w7',
    name: 'White Sneakers',
    type: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format',
    color: 'white',
    brand: 'Adidas',
    description: 'Clean white leather sneakers',
    dateAdded: '2025-03-01T13:15:00Z',
    favorite: true,
    tags: ['casual', 'everyday', 'versatile'],
    wearCount: 22,
    lastWorn: '2025-04-07T10:00:00Z'
  },
  {
    id: 'w8',
    name: 'Black Leather Belt',
    type: 'accessory',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format',
    color: 'black',
    brand: 'Fossil',
    description: 'Classic black leather belt with silver buckle',
    dateAdded: '2025-01-15T09:45:00Z',
    favorite: false,
    tags: ['formal', 'work', 'essential'],
    wearCount: 40,
    lastWorn: '2025-04-07T08:00:00Z'
  },
  {
    id: 'w9',
    name: 'Blue Denim Jacket',
    type: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&auto=format',
    color: 'blue',
    brand: 'Levi\'s',
    description: 'Classic blue denim trucker jacket',
    dateAdded: '2025-02-28T17:30:00Z',
    favorite: true,
    tags: ['casual', 'spring', 'layering'],
    wearCount: 10,
    lastWorn: '2025-04-02T12:00:00Z'
  },
  {
    id: 'w10',
    name: 'Navy Blue Suit',
    type: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format',
    color: 'blue',
    brand: 'Hugo Boss',
    description: 'Tailored navy blue wool suit',
    dateAdded: '2024-12-20T11:00:00Z',
    favorite: true,
    tags: ['formal', 'business', 'special occasion'],
    wearCount: 5,
    lastWorn: '2025-03-15T18:00:00Z'
  }
];

export class MockWardrobeService implements WardrobeService {
  private wardrobeItems: WardrobeItem[] = [...mockWardrobeItems];

  constructor() {
    // Load any saved items from localStorage
    const savedItems = localStorage.getItem('wardrobeItems');
    if (savedItems) {
      try {
        this.wardrobeItems = JSON.parse(savedItems);
      } catch (error) {
        console.error('Failed to parse saved wardrobe items:', error);
        // Fall back to mock data
        this.wardrobeItems = [...mockWardrobeItems];
      }
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('wardrobeItems', JSON.stringify(this.wardrobeItems));
  }

  async getWardrobeItems(filters?: WardrobeFilters): Promise<WardrobeItem[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredItems = [...this.wardrobeItems];
    
    if (filters) {
      if (filters.type && filters.type.length > 0) {
        filteredItems = filteredItems.filter(item => filters.type!.includes(item.type));
      }
      
      if (filters.color && filters.color.length > 0) {
        filteredItems = filteredItems.filter(item => filters.color!.includes(item.color));
      }
      
      if (filters.brand && filters.brand.length > 0) {
        filteredItems = filteredItems.filter(item => item.brand && filters.brand!.includes(item.brand));
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredItems = filteredItems.filter(item => 
          filters.tags!.some(tag => item.tags.includes(tag))
        );
      }
      
      if (filters.favorite !== undefined) {
        filteredItems = filteredItems.filter(item => item.favorite === filters.favorite);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.name.toLowerCase().includes(searchLower) || 
          (item.description && item.description.toLowerCase().includes(searchLower)) ||
          (item.brand && item.brand.toLowerCase().includes(searchLower)) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
    }
    
    return filteredItems;
  }

  async getWardrobeItem(id: string): Promise<WardrobeItem> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const item = this.wardrobeItems.find(item => item.id === id);
    
    if (!item) {
      throw new Error(`Wardrobe item with id ${id} not found`);
    }
    
    return item;
  }

  async addWardrobeItem(item: Omit<WardrobeItem, 'id'>): Promise<WardrobeItem> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newItem: WardrobeItem = {
      ...item,
      id: `w${Date.now()}`,
      dateAdded: new Date().toISOString(),
      wearCount: 0,
      favorite: false,
      tags: item.tags || []
    };
    
    this.wardrobeItems.push(newItem);
    this.saveToLocalStorage();
    
    return newItem;
  }

  async updateWardrobeItem(id: string, updates: Partial<WardrobeItem>): Promise<WardrobeItem> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.wardrobeItems.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Wardrobe item with id ${id} not found`);
    }
    
    const updatedItem = {
      ...this.wardrobeItems[index],
      ...updates
    };
    
    this.wardrobeItems[index] = updatedItem;
    this.saveToLocalStorage();
    
    return updatedItem;
  }

  async removeWardrobeItem(id: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.wardrobeItems.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Wardrobe item with id ${id} not found`);
    }
    
    this.wardrobeItems.splice(index, 1);
    this.saveToLocalStorage();
  }

  async getWardrobeStats(): Promise<WardrobeStats> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Calculate stats
    const totalItems = this.wardrobeItems.length;
    
    // Group by category
    const categoryMap = new Map<string, number>();
    this.wardrobeItems.forEach(item => {
      const count = categoryMap.get(item.type) || 0;
      categoryMap.set(item.type, count + 1);
    });
    
    const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name,
      name: name.charAt(0).toUpperCase() + name.slice(1) + 's', // Capitalize and pluralize
      count
    }));
    
    // Most worn item
    const sortedByWear = [...this.wardrobeItems].sort((a, b) => b.wearCount - a.wearCount);
    const mostWorn = sortedByWear.length > 0 ? sortedByWear[0] : null;
    
    // Recently added items
    const sortedByDate = [...this.wardrobeItems].sort(
      (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
    const recentlyAdded = sortedByDate.slice(0, 5);
    
    // Favorite items
    const favorites = this.wardrobeItems.filter(item => item.favorite);
    
    return {
      totalItems,
      categories,
      mostWorn,
      recentlyAdded,
      favorites
    };
  }

  async toggleFavorite(id: string): Promise<WardrobeItem> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const item = await this.getWardrobeItem(id);
    return this.updateWardrobeItem(id, { favorite: !item.favorite });
  }

  async incrementWearCount(id: string): Promise<WardrobeItem> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const item = await this.getWardrobeItem(id);
    return this.updateWardrobeItem(id, { 
      wearCount: item.wearCount + 1,
      lastWorn: new Date().toISOString()
    });
  }
}
