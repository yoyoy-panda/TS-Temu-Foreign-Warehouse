import React from 'react';
import './App.css';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectLink = urlParams.get('redirectLink');

  if (redirectLink) {
    //return <AuthPage />;
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src="./assets/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => console.log('Button clicked')}>
          Click me
        </button>
        <p>
          This is the default App content.
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
