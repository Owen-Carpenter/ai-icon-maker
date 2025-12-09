'use client';

import React from 'react';
import Link from 'next/link';

interface SmartGenerateLinkProps {
  children: React.ReactNode;
  className?: string;
  fallbackHref?: string; // Deprecated - kept for backwards compatibility
}

/**
 * SmartGenerateLink - Always links to /generate
 * Auth and subscription checks now happen when user tries to generate icons
 */
export default function SmartGenerateLink({ 
  children, 
  className = '',
  fallbackHref // Kept for backwards compatibility but not used
}: SmartGenerateLinkProps) {
  // Always go to generate page - auth check happens when user tries to generate
  return (
    <Link href="/generate" className={className}>
      {children}
    </Link>
  );
} 