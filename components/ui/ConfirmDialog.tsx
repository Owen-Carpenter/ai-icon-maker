'use client';

import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      gradient: 'from-red-500 to-orange-500',
      border: 'border-red-500/30',
      icon: '⚠️',
    },
    warning: {
      gradient: 'from-sunset-500 to-coral-500',
      border: 'border-sunset-500/30',
      icon: '⚠️',
    },
    info: {
      gradient: 'from-blue-500 to-cyan-500',
      border: 'border-blue-500/30',
      icon: 'ℹ️',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-midnight-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${style.gradient} rounded-full flex items-center justify-center text-3xl shadow-lg`}>
              {style.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white text-center mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sunset-200 text-center mb-8 leading-relaxed">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-midnight-700/50 hover:bg-midnight-600/50 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 bg-gradient-to-r ${style.gradient} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-${variant}-500/30 transition-all duration-300 hover:scale-105`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

