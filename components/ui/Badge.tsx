import React from 'react';

interface BadgeProps {
  color?: 'red' | 'yellow' | 'green' | 'blue' | 'slate';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ color = 'slate', children, className = '' }) => {
  const styles = {
    red: 'bg-red-100 text-red-700 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    slate: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${styles[color]} ${className}`}>
      {children}
    </span>
  );
};