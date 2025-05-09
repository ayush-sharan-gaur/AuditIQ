// frontend/src/App.js

import React, { useState } from 'react';
import {
  audit,
  downloadReport,
  downloadPng,
  createPurchaseSession,
  createSubscriptionSession
} from './services/api';
import ScoreDisplay from './components/ScoreDisplay';
import TipList from './components/TipList';

function App() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await audit(url);
      setData(res.data);
    } catch (err) {
      console.error('Audit error:', err.response?.data || err);
      alert(`Audit failed:\n${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!url) return;
    setDownloading(true);
    try {
      const res = await downloadReport(url);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'audit-report.pdf';
      link.click();
    } catch (err) {
      console.error('PDF download error:', err.response?.data || err);
      alert(`PDF download failed:\n${err.response?.data?.error || err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!url) return;
    setDownloading(true);
    try {
      const res = await downloadPng(url);
      const blob = new Blob([res.data], { type: 'image/png' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'audit-report.png';
      link.click();
    } catch (err) {
      console.error('PNG download error:', err.response?.data || err);
      alert(`PNG download failed:\n${err.response?.data?.error || err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleBuyAudit = async () => {
    try {
      const { data } = await createPurchaseSession();
      window.location.href = data.url;
    } catch (err) {
      console.error('Purchase session error:', err.response?.data || err);
      alert(`Failed to initiate purchase:\n${err.response?.data?.error || err.message}`);
    }
  };

  const handleSubscribe = async () => {
    try {
      const { data } = await createSubscriptionSession();
      window.location.href = data.url;
    } catch (err) {
      console.error('Subscription session error:', err.response?.data || err);
      alert(`Failed to initiate subscription:\n${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="container">
      <h1>AuditIQ</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--space-xl)' }}>
        <input
          type="url"
          placeholder="Enter URL to audit"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Running...' : 'Run Audit'}
        </button>
      </form>

      {data && (
        <>
          <ScoreDisplay categories={data.categories} />
          <TipList tips={data.tips} />

          <div style={{ marginTop: 'var(--space-lg)' }}>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="btn-secondary"
              style={{ marginRight: 'var(--space-md)' }}
            >
              {downloading ? 'Downloading…' : 'Download PDF'}
            </button>

            <button
              onClick={handleDownloadPng}
              disabled={downloading}
              className="btn-secondary"
              style={{ marginRight: 'var(--space-md)'}}
            >
              {downloading ? 'Downloading…' : 'Download PNG'}
            </button>

            <button
              onClick={handleBuyAudit}
              className="btn-primary"
              style={{ marginRight: 'var(--space-md)' }}
            >
              Buy Single Audit ($25)
            </button>

            <button
              onClick={handleSubscribe}
              className="btn-primary"
            >
              Subscribe ($49/mo)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
