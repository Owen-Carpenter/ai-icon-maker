'use client';

import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, Crown, Zap } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Loading from '../../../components/ui/Loading';
import CancelSubscriptionButton from '../../../components/payment/CancelSubscriptionButton';
import ReactivateSubscriptionButton from '../../../components/payment/ReactivateSubscriptionButton';
import PricingSection from '../../../components/payment/PricingSection';

function AccountPageContent() {
  const { user, userData, hasActiveSubscription, loading, refreshUserData } = useAuth();
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
      // Refresh user data after successful payment - now safe with memoized function
      refreshUserData();
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
  }, [searchParams, refreshUserData]); // Now safe because refreshUserData is memoized

  if (loading) {
    return <Loading text="Loading your account..." />;
  }

  const isPaidPlan = hasActiveSubscription;

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar variant="app" />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
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
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
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

            {/* Subscription Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
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
                      const plan = userData?.subscription_plan || '';
                      if (!isPaidPlan) return 'Subscription Required';
                      if (plan === 'unlimited') return 'Enterprise';
                      return plan.charAt(0).toUpperCase() + plan.slice(1);
                    })()}
                  </span>
                </div>
                
                {isPaidPlan ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Credits Remaining:</span>
                      <span className="flex items-center text-white font-semibold">
                        <Zap className="h-4 w-4 mr-1 text-yellow-400" />
                        {userData?.credits_remaining || 0}
                        {userData?.subscription_plan === 'unlimited' && (
                          <span className="ml-1 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                            Enterprise
                          </span>
                        )}
                      </span>
                    </div>

                    {userData?.total_generations_used !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Total Generated:</span>
                        <span className="text-white font-semibold">
                          {userData.total_generations_used}
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

                {isPaidPlan && userData?.subscription_current_period_end && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {userData?.subscription_cancel_at_period_end ? 'Expires On:' : 'Renews On:'}
                    </span>
                    <span className="text-white">
                      {new Date(userData.subscription_current_period_end).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {userData?.subscription_cancel_at_period_end && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                    <p className="text-orange-400 text-sm">
                      <strong>Subscription Canceled</strong><br />
                      You'll retain access to all features until {userData.subscription_current_period_end ? new Date(userData.subscription_current_period_end).toLocaleDateString() : 'the end of your billing period'}.
                    </p>
                  </div>
                )}

                {/* Show Cancel button for active subscriptions */}
                {isPaidPlan && !userData?.subscription_cancel_at_period_end && (
                  <div className="pt-4">
                    <CancelSubscriptionButton className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors" />
                  </div>
                )}

                {/* Show Reactivate button for canceled subscriptions still in grace period */}
                {isPaidPlan && userData?.subscription_cancel_at_period_end && (
                  <div className="pt-4">
                    <ReactivateSubscriptionButton className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors" />
                  </div>
                )}
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
              currentPlan={userData?.subscription_plan || ''}
              title={userData?.subscription_status === 'canceled' ? 'Resubscribe to Continue' : 'Upgrade Your Plan'}
              subtitle={userData?.subscription_status === 'canceled' ? 'Get back to creating amazing icons with our premium features' : 'Get more credits and unlock premium features'}
            />
          )}
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