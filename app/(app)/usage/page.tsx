'use client';

import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, Crown, BarChart3, Calendar, TrendingUp, Zap } from 'lucide-react';
import Logo from '../../../components/ui/Logo';
import Sidebar from '../../../components/generate/Sidebar';
import Footer from '../../../components/Footer';
import Loading from '../../../components/ui/Loading';

function UsagePageContent() {
  const { user, userData, hasActiveSubscription, loading } = useAuth();
  const [showMessage, setShowMessage] = useState('');

  if (loading) {
    return <Loading text="Loading usage data..." />;
  }

  const isPaidPlan = hasActiveSubscription;
  const creditsUsed = userData?.usage?.tokens_used_this_month || 0;
  const creditsRemaining = userData?.usage?.tokens_remaining || 0;
  const totalCredits = userData?.subscription?.monthly_token_limit || 5;
  const usagePercentage = userData?.usage?.usage_percentage || 0;

  // Calculate usage statistics
  const planType = userData?.subscription?.plan_type || 'free';
  const isUnlimited = planType === 'enterprise';
  
  // Mock data for demonstration - in real app this would come from API
  const usageStats = {
    thisMonth: creditsUsed,
    lastMonth: Math.max(0, creditsUsed - 10),
    avgPerDay: creditsUsed > 0 ? Math.round(creditsUsed / 30) : 0,
    peakDay: Math.max(1, Math.round(creditsUsed / 10))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 flex flex-col">
      <Sidebar currentPage="usage" />
      
      <div className="flex-1 px-4 py-8 lg:py-8 lg:ml-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Usage & Limits
          </h1>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Track your icon generation usage, monitor your remaining credits, and understand your subscription limits.
          </p>

          {/* Usage Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Credits Remaining */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">Available</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">
                  {isUnlimited ? '∞' : creditsRemaining}
                </h3>
                <p className="text-gray-400 text-sm">Credits Remaining</p>
              </div>
            </div>

            {/* Credits Used */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-blue-400 text-sm font-medium">Used</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">{creditsUsed}</h3>
                <p className="text-gray-400 text-sm">Icons Generated</p>
              </div>
            </div>

            {/* This Month */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-purple-400 text-sm font-medium">Monthly</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">{usageStats.thisMonth}</h3>
                <p className="text-gray-400 text-sm">This Month</p>
              </div>
            </div>

            {/* Average Daily */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <span className="text-orange-400 text-sm font-medium">Daily Avg</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">{usageStats.avgPerDay}</h3>
                <p className="text-gray-400 text-sm">Per Day</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Usage Progress */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Usage Progress
              </h2>
              
              {isPaidPlan ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Credits Used</span>
                    <span className="text-white font-semibold">
                      {creditsUsed} / {isUnlimited ? '∞' : totalCredits}
                    </span>
                  </div>
                  
                  {!isUnlimited && (
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{creditsUsed}</div>
                      <div className="text-gray-400 text-sm">Icons Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {isUnlimited ? '∞' : creditsRemaining}
                      </div>
                      <div className="text-gray-400 text-sm">Remaining</div>
                    </div>
                  </div>

                  {!isUnlimited && usagePercentage > 80 && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Crown className="h-4 w-4 text-orange-400 mr-2" />
                        <span className="text-orange-400 font-semibold">Usage Alert</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        You've used {Math.round(usagePercentage)}% of your credits. Consider upgrading your plan for more icons.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 text-center">
                  <Crown className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">No Active Subscription</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Subscribe to start tracking your icon generation usage and unlock unlimited creativity.
                  </p>
                  <Link 
                    href="/account" 
                    className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
                  >
                    View Plans
                  </Link>
                </div>
              )}
            </div>

            {/* Plan Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Plan Details
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
                      if (!isPaidPlan) return 'No Subscription';
                      if (planType === 'enterprise') return 'Enterprise';
                      return planType.charAt(0).toUpperCase() + planType.slice(1);
                    })()}
                  </span>
                </div>

                {isPaidPlan && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Plan Features:</span>
                      <span className="text-white">
                        {isUnlimited ? 'Unlimited Icons' : `${totalCredits} Credits/Month`}
                      </span>
                    </div>

                    {userData?.subscription_current_period_end && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">
                          {userData?.subscription_cancel_at_period_end ? 'Expires:' : 'Renews:'}
                        </span>
                        <span className="text-white">
                          {new Date(userData.subscription_current_period_end).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-green-400 font-semibold">Active Subscription</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Your subscription is active and you can generate {isUnlimited ? 'unlimited' : creditsRemaining} more icons.
                      </p>
                    </div>
                  </>
                )}

                {!isPaidPlan && (
                  <div className="space-y-3">
                    <div className="text-gray-400 text-sm">Available Plans:</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Starter</span>
                        <span className="text-white">100 icons/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Pro</span>
                        <span className="text-white">500 icons/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Enterprise</span>
                        <span className="text-white">Unlimited icons</span>
                      </div>
                    </div>
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
                Generate More Icons
              </Link>
              <Link 
                href="/account" 
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-white/20 hover:border-white/40"
              >
                Manage Subscription
              </Link>
              <Link 
                href="/library" 
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-white/20 hover:border-white/40"
              >
                View Library
              </Link>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Usage Tips & Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Maximize Your Credits</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Be specific in your icon descriptions for better results
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Use the "Improve Icon" feature to refine existing icons
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Save your favorite icons to the library for later use
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Try different styles to get varied results
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Need More Credits?</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Upgrade to Pro for 5x more icons per month
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Enterprise plan offers unlimited icon generation
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Credits reset monthly on your renewal date
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    Unused credits don't roll over to the next month
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function UsagePage() {
  return (
    <Suspense fallback={<Loading text="Loading usage & limits..." />}>
      <UsagePageContent />
    </Suspense>
  );
}