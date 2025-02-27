import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App.tsx';
import './index.css';
import { initOffer18Tracking } from './lib/offer18.ts';

// Configure React Query with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
      cacheTime: 3600000, // 1 hour
      refetchOnMount: false,
      onError: (error) => {
        // Only log errors in development
        if (process.env.NODE_ENV !== 'production') {
          console.error('Query error:', error);
        }
      },
      initialData: () => undefined // Prevent empty object initialization
    },
    mutations: {
      onError: (error) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Mutation error:', error);
        }
      }
    }
  },
});

// Handle global errors
const handleError = (event: ErrorEvent) => {
  if (event.message.includes('ResizeObserver')) {
    event.stopImmediatePropagation();
    return false;
  }
  
  // Ignore empty object errors
  if (event.message === '[{}]') {
    event.stopImmediatePropagation();
    return false;
  }
  
  // Log other errors only in development
  if (!event.message.includes('[{}]') && process.env.NODE_ENV !== 'production') {
    console.error('Application error:', event.error);
  }
};

window.addEventListener('error', handleError);

// Initialize tracking with error handling
try {
  setTimeout(() => {
    initOffer18Tracking();
  }, 1000);
} catch (error) {
  // Silent error handling
}

// Initialize app with error boundary
const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);