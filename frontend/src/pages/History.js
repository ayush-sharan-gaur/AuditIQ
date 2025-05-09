import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function History() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get('/api/history')
      .then(res => setSessions(res.data.sessions))
      .catch(console.error);
  }, []);

  return (
    <div className="container">
      <h1>Audit History</h1>
      <table>
        <thead>
          <tr>
            <th>Session ID</th>
            <th>URL</th>
            <th>Customer</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.sessionId}>
              <td>{s.sessionId}</td>
              <td>{s.url}</td>
              <td>{s.customer}</td>
              <td>{new Date(s.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/" className="btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
        Back to AuditIQ
      </Link>
    </div>
  );
}