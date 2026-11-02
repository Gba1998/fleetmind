import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'orange';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    orange: 'bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/30',
    neutral: 'bg-[#172231] text-[#8995A3] border-[#8995A3]/25',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${variantStyles[variant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
};
export default Badge;
