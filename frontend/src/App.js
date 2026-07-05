import React, { useState } from 'react';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

const API = process.env.REACT_APP_API_URL || '';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API}/api/analyze`, { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Analysis failed');
      setData(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/demo`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load demo');
      setData(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setData(null); setError(null); };

  return (
    <div>
      <Header hasData={!!data} onReset={handleReset} />
      {data ? (
        <Dashboard data={data} />
      ) : (
        <UploadPage onUpload={handleUpload} onDemo={handleDemo} loading={loading} error={error} />
      )}
    </div>
  );
}
