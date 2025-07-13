"use client"
import { useState } from 'react';

export default function UrlInput({ onAnalyze, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url && !loading) {
      onAnalyze(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-form">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        required
        disabled={loading}
      />
      <button type="submit" disabled={!url || loading}>
        {loading ? 'در حال تحلیل...' : 'تحلیل UI'}
      </button>
      
      <style jsx>{`
        .url-form {
          display: flex;
          gap: 10px;
          margin: 2rem 0;
        }
        input {
          flex: 1;
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}