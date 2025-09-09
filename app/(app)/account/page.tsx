'use client';

import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, Crown } from 'lucide-react';
import Logo from '../../../components/ui/Logo';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Loading from '../../../components/ui/Loading';
import CancelSubscriptionButton from '../../../components/payment/CancelSubscriptionButton';
import ReactivateSubscriptionButton from '../../../components/payment/ReactivateSubscriptionButton';
import PricingSection from '../../../components/payment/PricingSection';

function AccountPageContent() {
  const { user, userData, hasActiveSubscription, loading, refreshUserData, invalidateCache } = useAuth();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSubscriptionRequired, setShowSubscriptionRequired] = useState(false);
  const [showError, setShowError] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    const subscriptionRequired = searchParams.get('subscription_required');
    const error = searchParams.get('error');

    if (success === 'true') {
      setShowSuccess(true);
      // Invalidate cache and force refresh user data after successful payment
      invalidateCache();
      refreshUserData(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    
    if (subscriptionRequired === 'true') {
      setShowSubscriptionRequired(true);
      setTimeout(() => setShowSubscriptionRequired(false), 8000);
    }
    
    if (error) {
      setShowError(error === 'subscription_check_failed' 
        ? 'Unable to verify subscription status. Please try again.' 
        : 'An error occurred. Please try again.');
      setTimeout(() => setShowError(''), 5000);
    }
  }, [searchParams, refreshUserData, invalidateCache]);

  if (loading) {
    return <Loading text="Loading your account..." />;
  }

  const isPaidPlan = hasActiveSubscription;

  return (
    <div className="min-h-screen bg-dark-gradient flex flex-col">
      <div className="min-h-screen flex flex-col">
        <Navbar variant="app" />
        <div className="flex-1 container mx-auto px-4 pt-32 pb-8">
        <div className="max-w-6xl mx-auto w-full">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Account Settings
          </h1>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <p className="text-green-400">Payment successful! Your subscription has been activated.</p>
            </div>
          )}

          {/* Subscription Required Message */}
          {showSubscriptionRequired && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6 flex items-center">
              <Crown className="h-5 w-5 text-orange-400 mr-3" />
              <p className="text-orange-400">A paid subscription is required to access the icon generator. Please choose a plan below.</p>
            </div>
          )}

          {/* Error Message */}
          {showError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center">
              <p className="text-red-400">{showError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Profile Information */}
            <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-coral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  Profile Information
                </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                    {user?.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Account Created</label>
                  <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="glass-swipe bg-gradient-to-br from-midnight-900/30 to-midnight-950/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl hover:shadow-sunset-500/20 transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  Subscription Status
                </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Current Plan:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isPaidPlan 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {(() => {
                      const plan = userData?.subscription?.plan_type || 'free';
                      if (!isPaidPlan) return 'Subscription Required';
                      if (plan === 'enterprise') return 'Enterprise';
                      return plan.charAt(0).toUpperCase() + plan.slice(1);
                    })()}
                  </span>
                </div>
                
                {isPaidPlan ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Credits Remaining:</span>
                      <span className="flex items-center text-white font-semibold">
                        <Logo width={24} height={24} className="mr-2" />
                        {userData?.usage?.tokens_remaining || 0}
                        {userData?.subscription?.plan_type === 'enterprise' && (
                          <span className="ml-1 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                            Enterprise
                          </span>
                        )}
                      </span>
                    </div>

                    {userData?.usage?.total_generations !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Total Generated:</span>
                        <span className="text-white font-semibold">
                          {userData.usage.total_generations}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Crown className="h-5 w-5 text-orange-400 mr-2" />
                      <span className="text-orange-400 font-semibold">Access Required</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Subscribe to start generating custom icons with AI. Choose from our flexible plans below to unlock unlimited creativity.
                    </p>
                  </div>
                )}

                {isPaidPlan && userData?.subscription?.current_period_end && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {userData?.subscription?.cancel_at_period_end ? 'Expires On:' : 'Renews On:'}
                    </span>
                    <span className="text-white">
                      {new Date(userData.subscription.current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {userData?.subscription?.cancel_at_period_end && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                    <p className="text-orange-400 text-sm">
                      <strong>Subscription Canceled</strong><br />
                      You'll retain access to all features until {userData.subscription.current_period_end ? new Date(userData.subscription.current_period_end).toLocaleDateString() : 'the end of your billing period'}.
                    </p>
                  </div>
                )}

                {/* Show Cancel button for active subscriptions */}
                {isPaidPlan && !userData?.subscription?.cancel_at_period_end && (
                  <div className="pt-4">
                    <CancelSubscriptionButton className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors" />
                  </div>
                )}

                {/* Show Reactivate button for canceled subscriptions still in grace period */}
                {isPaidPlan && userData?.subscription?.cancel_at_period_end && (
                  <div className="pt-4">
                    <ReactivateSubscriptionButton className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors" />
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/generate" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Generate Icons
              </Link>
              <Link 
                href="/library" 
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-white/20 hover:border-white/40"
              >
                View Library
              </Link>
            </div>
          </div>

          {/* Pricing Section - Show for users without subscriptions or fully expired subscriptions */}
          {!isPaidPlan && (
            <PricingSection 
              currentPlan={userData?.subscription?.plan_type || 'free'}
              title={userData?.subscription?.status === 'canceled' ? 'Resubscribe to Continue' : 'Upgrade Your Plan'}
              subtitle={userData?.subscription?.status === 'canceled' ? 'Get back to creating amazing icons with our premium features' : 'Get more credits and unlock premium features'}
            />
          )}
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<Loading text="Loading account settings..." />}>
      <AccountPageContent />
    </Suspense>
  );
} 