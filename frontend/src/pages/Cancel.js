import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="container">
      <h1>Payment Canceled</h1>
      <p>Your payment was not completed. You can try again.</p>
      <Link to="/" className="btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
        Try Again
      </Link>
    </div>
  );
}