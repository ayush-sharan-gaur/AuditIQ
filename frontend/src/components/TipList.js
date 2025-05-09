import React from 'react';

export default function TipList({ tips }) {
  return (
    <ul className="tips">
      {tips.map((t, i) => (
        <li key={i}>
          <strong>{t.title}</strong>: {t.description}
        </li>
      ))}
    </ul>
  );
}
