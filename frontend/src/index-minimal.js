import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div style={{
    background: '#030303',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif'
  }}>
    <div style={{
      textAlign: 'center',
      padding: '40px',
      background: '#0a0a0a',
      border: '2px solid #00D9FF',
      borderRadius: '20px'
    }}>
      <h1 style={{color: '#00D9FF', fontSize: '3rem'}}>✅ React Funguje!</h1>
      <p style={{fontSize: '1.5rem'}}>ChciAI.cz - Minimální verze</p>
      <p>Pokud vidíš tohle, React app se načetl správně.</p>
    </div>
  </div>
);
