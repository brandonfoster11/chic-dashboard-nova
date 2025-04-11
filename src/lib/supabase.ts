import { USE_MOCKS } from '@/constants';
import { toast } from '@/components/ui/use-toast';
import { dataProvider } from '@/services/data';

/**
 * Mock Supabase Client
 * 
 * This is a complete replacement for the Supabase client that doesn't
 * require any Supabase dependencies. It's used in design mode to allow
 * the application to function without a real backend.
 */

// Create a mock client that simulates the Supabase API surface
const mockClient = {
  auth: {
    getUser: async () => {
      const user = await dataProvider.getUser();
      return { data: { user }, error: null };
    },
    getSession: async () => {
      const user = await dataProvider.getUser();
      return { data: { session: { user } }, error: null };
    },
    signUp: async (params: any) => {
      console.log('Mock signUp called with', params);
      const user = await dataProvider.getUser();
      return { data: { user }, error: null };
    },
    signIn: async (params: any) => {
      console.log('Mock signIn called with', params);
      const user = await dataProvider.getUser();
      return { data: { user }, error: null };
    },
    signOut: async () => {
      console.log('Mock signOut called');
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      console.log('Mock onAuthStateChange registered');
      // Return a mock unsubscribe function
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    setSession: (session: any) => {
      console.log('Mock setSession called with', session);
    }
  },
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          console.log(`Mock select from ${table} where ${column} = ${value}`);
          
          if (table === 'profiles') {
            const user = await dataProvider.getUser();
            return { data: user, error: null };
          }
          
          return { data: null, error: null };
        },
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          limit: (limit: number) => ({
            range: (from: number, to: number) => ({
              then: (callback: any) => {
                console.log(`Mock select from ${table} where ${column} = ${value} order by ${column} ${ascending ? 'asc' : 'desc'} limit ${limit} range ${from}-${to}`);
                return Promise.resolve(callback({ data: [], error: null }));
              }
            })
          })
        }),
        then: async (callback: any) => {
          console.log(`Mock select from ${table} where ${column} = ${value}`);
          
          let data: any[] = [];
          
          if (table === 'wardrobe_items') {
            data = await dataProvider.getWardrobeItems();
            data = data.filter(item => (item as any)[column] === value);
          } else if (table === 'outfits') {
            data = await dataProvider.getOutfits();
            data = data.filter(item => (item as any)[column] === value);
          } else if (table === 'outfit_items') {
            data = await dataProvider.getOutfitItems(value);
          }
          
          return Promise.resolve(callback({ data, error: null }));
        }
      }),
      in: (column: string, values: any[]) => ({
        then: async (callback: any) => {
          console.log(`Mock select from ${table} where ${column} in [${values.join(', ')}]`);
          
          let data: any[] = [];
          
          if (table === 'wardrobe_items') {
            data = await dataProvider.getWardrobeItems();
            data = data.filter(item => values.includes((item as any)[column]));
          } else if (table === 'outfits') {
            data = await dataProvider.getOutfits();
            data = data.filter(item => values.includes((item as any)[column]));
          } else if (table === 'outfit_items') {
            // Get all outfit items for the first outfit ID in values
            if (values.length > 0) {
              data = await dataProvider.getOutfitItems(values[0]);
            }
          }
          
          return Promise.resolve(callback({ data, error: null }));
        }
      }),
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        then: async (callback: any) => {
          console.log(`Mock select from ${table} order by ${column} ${ascending ? 'asc' : 'desc'}`);
          
          let data: any[] = [];
          
          if (table === 'wardrobe_items') {
            data = await dataProvider.getWardrobeItems();
            data.sort((a, b) => {
              if (ascending) {
                return (a as any)[column] > (b as any)[column] ? 1 : -1;
              } else {
                return (a as any)[column] < (b as any)[column] ? 1 : -1;
              }
            });
          } else if (table === 'outfits') {
            data = await dataProvider.getOutfits();
            data.sort((a, b) => {
              if (ascending) {
                return (a as any)[column] > (b as any)[column] ? 1 : -1;
              } else {
                return (a as any)[column] < (b as any)[column] ? 1 : -1;
              }
            });
          }
          
          return Promise.resolve(callback({ data, error: null }));
        }
      }),
      then: async (callback: any) => {
        console.log(`Mock select from ${table}`);
        
        let data: any[] = [];
        
        if (table === 'wardrobe_items') {
          data = await dataProvider.getWardrobeItems();
        } else if (table === 'outfits') {
          data = await dataProvider.getOutfits();
        } else if (table === 'outfit_items') {
          // For outfit items, we need an outfit ID
          // Just return empty array for now
          data = [];
        } else if (table === 'style_preferences') {
          data = await dataProvider.getStylePreferences();
        }
        
        return Promise.resolve(callback({ data, error: null }));
      }
    }),
    insert: (data: any) => ({
      select: (columns: string = '*') => ({
        single: async () => {
          console.log(`Mock insert into ${table}`, data);
          
          let result: any = { ...data, id: `mock-${Date.now()}` };
          
          if (table === 'wardrobe_items') {
            result = await dataProvider.createWardrobeItem(data);
          } else if (table === 'outfits') {
            result = await dataProvider.createOutfit(data);
          } else if (table === 'outfit_items') {
            // Use addItemToOutfit instead of createOutfitItem
            if (data.outfit_id && data.wardrobe_item_id) {
              result = await dataProvider.addItemToOutfit(
                data.outfit_id,
                data.wardrobe_item_id,
                data.position || 0
              );
            }
          } else if (table === 'style_preferences') {
            // Use updateStylePreference instead of createStylePreference
            if (data.id) {
              result = await dataProvider.updateStylePreference(data.id, data.value);
            } else {
              // For new preferences, create a mock ID
              result = { ...data, id: `mock-pref-${Date.now()}` };
            }
          }
          
          toast({
            title: "Created",
            description: `Created new ${table.replace('_', ' ')}`,
          });
          
          return { data: result, error: null };
        },
        then: async (callback: any) => {
          console.log(`Mock insert into ${table}`, data);
          
          let result: any = { ...data, id: `mock-${Date.now()}` };
          
          if (table === 'wardrobe_items') {
            result = await dataProvider.createWardrobeItem(data);
          } else if (table === 'outfits') {
            result = await dataProvider.createOutfit(data);
          } else if (table === 'outfit_items') {
            // Use addItemToOutfit instead of createOutfitItem
            if (data.outfit_id && data.wardrobe_item_id) {
              result = await dataProvider.addItemToOutfit(
                data.outfit_id,
                data.wardrobe_item_id,
                data.position || 0
              );
            }
          } else if (table === 'style_preferences') {
            // Use updateStylePreference instead of createStylePreference
            if (data.id) {
              result = await dataProvider.updateStylePreference(data.id, data.value);
            } else {
              // For new preferences, create a mock ID
              result = { ...data, id: `mock-pref-${Date.now()}` };
            }
          }
          
          toast({
            title: "Created",
            description: `Created new ${table.replace('_', ' ')}`,
          });
          
          return Promise.resolve(callback({ data: [result], error: null }));
        }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: (columns: string = '*') => ({
          single: async () => {
            console.log(`Mock update ${table} where ${column} = ${value}`, data);
            
            let result: any = { ...data, id: value };
            
            if (table === 'wardrobe_items') {
              result = await dataProvider.updateWardrobeItem(value, data);
            } else if (table === 'outfits') {
              result = await dataProvider.updateOutfit(value, data);
            } else if (table === 'style_preferences') {
              result = await dataProvider.updateStylePreference(value, data.value);
            }
            
            toast({
              title: "Updated",
              description: `Updated ${table.replace('_', ' ')}`,
            });
            
            return { data: result, error: null };
          },
          then: async (callback: any) => {
            console.log(`Mock update ${table} where ${column} = ${value}`, data);
            
            let result: any = { ...data, id: value };
            
            if (table === 'wardrobe_items') {
              result = await dataProvider.updateWardrobeItem(value, data);
            } else if (table === 'outfits') {
              result = await dataProvider.updateOutfit(value, data);
            } else if (table === 'style_preferences') {
              result = await dataProvider.updateStylePreference(value, data.value);
            }
            
            toast({
              title: "Updated",
              description: `Updated ${table.replace('_', ' ')}`,
            });
            
            return Promise.resolve(callback({ data: [result], error: null }));
          }
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: async (callback: any) => {
          console.log(`Mock delete from ${table} where ${column} = ${value}`);
          
          if (table === 'wardrobe_items') {
            await dataProvider.deleteWardrobeItem(value);
          } else if (table === 'outfits') {
            await dataProvider.deleteOutfit(value);
          } else if (table === 'outfit_items') {
            // Use removeItemFromOutfit instead of deleteOutfitItem
            await dataProvider.removeItemFromOutfit(value);
          } else if (table === 'style_preferences') {
            // No direct delete method for style preferences
            // Just log it
            console.log(`Mock: Would delete style preference ${value}`);
          }
          
          toast({
            title: "Deleted",
            description: `Deleted ${table.replace('_', ' ')}`,
          });
          
          return Promise.resolve(callback({ error: null }));
        }
      })
    })
  }),
  rpc: (functionName: string, params?: any) => ({
    then: (callback: any) => {
      console.log(`Mock RPC call to ${functionName}`, params);
      toast({
        title: "Mock RPC Call",
        description: `Called ${functionName} in mock mode`
      });
      return Promise.resolve(callback({ data: [], error: null }));
    }
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        console.log(`Mock file upload to ${bucket}/${path}`);
        toast({
          title: "File Uploaded",
          description: `Uploaded to ${bucket}/${path} (mock)`
        });
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `/mock-storage/${bucket}/${path}` }
      }),
      remove: async (paths: string[]) => {
        console.log(`Mock file removal from ${bucket}`, paths);
        toast({
          title: "Files Removed",
          description: `Removed ${paths.length} files from ${bucket} (mock)`
        });
        return { data: { paths }, error: null };
      }
    })
  }
};

// Export the mock client
export const supabase = mockClient;

// Log a message to indicate we're using mock mode
console.log('Using mock Supabase client in design mode');

// Initialize session from localStorage if it exists
if (localStorage.getItem('supabase.auth.token')) {
  console.log('Mock: Restoring session from localStorage');
}

// Listen for auth state changes and persist them
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    localStorage.setItem('supabase.auth.token', JSON.stringify(session));
  } else {
    localStorage.removeItem('supabase.auth.token');
  }
});
