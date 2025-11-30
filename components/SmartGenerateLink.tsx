'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface SmartGenerateLinkProps {
  children: React.ReactNode;
  className?: string;
  fallbackHref?: string; // Where to redirect if no subscription (defaults to /#pricing)
}

export default function SmartGenerateLink({ 
  children, 
  className = '',
  fallbackHref = '/#pricing'
}: SmartGenerateLinkProps) {
  const { user, hasActiveSubscription, loading } = useAuth();

  // While loading, don't redirect anywhere
  if (loading) {
    return (
      <span className={className}>
        {children}
      </span>
    );
  }

  // If user is not logged in, redirect to register
  if (!user) {
    return (
      <Link href="/register" className={className}>
        {children}
      </Link>
    );
  }

  // If user is logged in but doesn't have subscription, go to pricing
  if (!hasActiveSubscription) {
    return (
      <Link href={fallbackHref} className={className}>
        {children}
      </Link>
    );
  }

  // User has active subscription, go to generate page
  return (
    <Link href="/generate" className={className}>
      {children}
    </Link>
  );
} 