import { createRoot } from 'react-dom/client'

console.log('test.tsx: Starting minimal test...');

const rootElement = document.getElementById("root");
console.log('test.tsx: Root element found:', rootElement);

if (!rootElement) {
  console.error('test.tsx: Root element not found!');
} else {
  console.log('test.tsx: Creating React root...');
  
  try {
    const root = createRoot(rootElement);
    console.log('test.tsx: React root created, rendering minimal app...');
    
    root.render(
      <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
        <h1>Minimal React App Test</h1>
        <p>If you can see this, React is working!</p>
      </div>
    );
    
    console.log('test.tsx: Minimal app rendered successfully');
  } catch (error) {
    console.error('test.tsx: Error rendering minimal app:', error);
  }
}
