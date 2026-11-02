import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  customIconBadge?: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  onClick?: () => void;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  customIconBadge,
  trend,
  trendPositive,
  onClick,
  accentColor = '#FF8A00',
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-gradient-to-b from-[#141E2C]/95 via-[#101723]/95 to-[#0A101A] border border-[#8995A3]/25 hover:border-[#8995A3]/60 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.6)]' : ''
      }`}
      style={{
        boxShadow: '0 10px 28px -6px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Top glowing micro-accent line */}
      <div 
        className="absolute top-0 left-4 right-4 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
        }}
      />

      {/* Subtle corner technical blueprint grid accent */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity pointer-events-none overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white">
          <pattern id={`grid-tech-${label.replace(/\s+/g, '')}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100" height="100" fill={`url(#grid-tech-${label.replace(/\s+/g, '')})`} />
        </svg>
      </div>

      {/* Top Row: Smart 3D Icon Badge on Left + Trend Pill on Right */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        {customIconBadge ? (
          customIconBadge
        ) : Icon ? (
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0"
            style={{
              backgroundColor: `${accentColor}18`,
              border: `1px solid ${accentColor}40`,
              boxShadow: `0 8px 20px -4px ${accentColor}30, inset 0 1px 1px rgba(255,255,255,0.2)`
            }}
          >
            <Icon className="w-5 h-5 stroke-[2.2]" style={{ color: accentColor }} />
          </div>
        ) : null}

        {trend && (
          <div
            className={`text-[11px] font-bold font-mono px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-transform group-hover:scale-105 ${
              trendPositive
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-red-500/15 border-red-500/35 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
            }`}
          >
            {trendPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.8]" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.8]" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Label and Primary Big Stat */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span 
            className="w-1.5 h-1.5 rounded-full shrink-0" 
            style={{ backgroundColor: accentColor }} 
          />
          <span className="text-[11px] font-black text-[#8995A3] uppercase tracking-wider font-mono truncate">
            {label}
          </span>
        </div>

        <div className="text-2xl sm:text-[27px] font-black font-mono text-[#F4F6F8] tracking-tight truncate leading-tight group-hover:text-white transition-colors">
          {value}
        </div>
      </div>

      {/* SubValue Footer with Micro-Separator */}
      {subValue && (
        <div className="mt-4 pt-3 border-t border-[#8995A3]/15 text-[11px] font-medium text-[#8995A3] font-mono flex items-center justify-between">
          <span className="truncate">{subValue}</span>
          <div 
            className="w-2 h-2 rounded-full shrink-0 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" 
            style={{ backgroundColor: accentColor }} 
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;
