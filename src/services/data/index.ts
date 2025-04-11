import { DataProvider } from './types';
import { MockDataProvider } from './mock-data-provider';

// Check if we should use mocks based on environment variable
const useMocks = import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS === 'true';

// Create and export the appropriate data provider
let dataProvider: DataProvider;

if (useMocks) {
  console.log('Using mock data provider for development');
  dataProvider = new MockDataProvider();
} else {
  // In the future, this could be replaced with a real implementation
  console.log('No production data provider available, falling back to mock data');
  dataProvider = new MockDataProvider();
}

export { dataProvider };

// Re-export types for convenience
export * from './types';
