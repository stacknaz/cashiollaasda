import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App.tsx';
import './index.css';

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
        // Properly handle query errors
        console.error('Query error:', error);
      },
      initialData: () => undefined // Prevent empty object initialization
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
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
  
  // Log other errors properly
  if (!event.message.includes('[{}]')) {
    console.error('Application error:', event.error);
  }
};

window.addEventListener('error', handleError);

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