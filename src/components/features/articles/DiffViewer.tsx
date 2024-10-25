// src/components/features/articles/DiffViewer.tsx
import React from 'react';
import { diffLines, Change } from 'diff';

interface DiffViewerProps {
  original: string;
  modified: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  original,
  modified,
}) => {
  const changes = diffLines(original, modified);

  return (
    <div className="font-mono text-sm">
      {changes.map((change, i) => (
        <div
          key={i}
          className={`
            p-2 whitespace-pre-wrap
            ${change.added ? 'bg-success-50 text-success-900' : ''}
            ${change.removed ? 'bg-danger-50 text-danger-900' : ''}
          `}
        >
          {change.value}
        </div>
      ))}
    </div>
  );
};