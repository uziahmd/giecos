import React from 'react';

const MinimalApp = () => {
  console.log('MinimalApp: Component rendering...');
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightgreen' }}>
      <h1>Minimal App Component</h1>
      <p>If you can see this, the App component is working!</p>
    </div>
  );
};

export default MinimalApp;
