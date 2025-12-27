import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export const Card = ({ title, children, className = '', actions }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-xl font-semibold text-gray-800">{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

