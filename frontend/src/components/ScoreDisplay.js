import React from 'react';

export default function ScoreDisplay({ categories }) {
  // Map category to icon and color class
  const icons = {
    performance: '⚡',
    accessibility: '♿',
    'best-practices': '🛡️',
    seo: '🔍'
  };

  const getColor = score => {
    if (score >= 0.9) return 'var(--color-success)';
    if (score >= 0.7) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="scores" style={{ marginTop: 'var(--space-lg)' }}>
      {Object.entries(categories).map(([key, score]) => (
        <div key={key}>
          <span style={{ marginRight: 'var(--space-sm)' }}>
            {icons[key]}
          </span>
          <strong style={{ color: getColor(score) }}>
            {key.replace('-', ' ')}: {Math.round(score * 100)}%
          </strong>
        </div>
      ))}
    </div>
  );
}
