import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="container">
      <h1>Thank you!</h1>
      <p>Your payment was successful.</p>
      {sessionId && (
        <p>
          Session ID: <code>{sessionId}</code>
        </p>
      )}
      <Link to="/" className="btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
        Back to AuditIQ
      </Link>
    </div>
  );
}
