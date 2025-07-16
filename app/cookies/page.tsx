import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar variant="marketing" />
      
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">Cookie Policy</h1>
          <p className="text-sunset-200 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-white space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <div className="text-gray-300">
                <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners about how users interact with their sites.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <div className="text-gray-300 space-y-2">
                <p>AI Icon Maker uses cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how you use our service to improve functionality</li>
                  <li>Ensure the security of our service</li>
                  <li>Provide personalized content and features</li>
                  <li>Measure the effectiveness of our marketing campaigns</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              <div className="text-gray-300 space-y-6">
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Essential Cookies</h3>
                  <p>These cookies are necessary for our website to function properly. They enable basic functions like page navigation, access to secure areas, and authentication. The website cannot function properly without these cookies.</p>
                  <div className="mt-2 bg-gray-800/50 rounded-lg p-3">
                    <p><strong>Examples:</strong> Session cookies, authentication tokens, security cookies</p>
                    <p><strong>Duration:</strong> Session or up to 30 days</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Functionality Cookies</h3>
                  <p>These cookies allow us to remember choices you make (such as your username, language preferences, or region) and provide enhanced, more personal features.</p>
                  <div className="mt-2 bg-gray-800/50 rounded-lg p-3">
                    <p><strong>Examples:</strong> Language settings, user preferences, theme choices</p>
                    <p><strong>Duration:</strong> Up to 1 year</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Analytics Cookies</h3>
                  <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our service.</p>
                  <div className="mt-2 bg-gray-800/50 rounded-lg p-3">
                    <p><strong>Examples:</strong> Google Analytics, usage statistics, performance monitoring</p>
                    <p><strong>Duration:</strong> Up to 2 years</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Marketing Cookies</h3>
                  <p>These cookies are used to track visitors across websites. They are used to display ads that are relevant and engaging for individual users.</p>
                  <div className="mt-2 bg-gray-800/50 rounded-lg p-3">
                    <p><strong>Examples:</strong> Advertising cookies, social media pixels, conversion tracking</p>
                    <p><strong>Duration:</strong> Up to 1 year</p>
                  </div>
                </div>

              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <div className="text-gray-300 space-y-4">
                <p>We may also use third-party services that set cookies on your device. These include:</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">Stripe</h3>
                    <p>Our payment processor uses cookies to ensure secure payment processing and fraud prevention.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white">Supabase</h3>
                    <p>Our backend service provider uses cookies for authentication and session management.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white">Google Analytics</h3>
                    <p>We use Google Analytics to understand how users interact with our website and improve our service.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-white">Social Media Platforms</h3>
                    <p>Social media plugins and sharing buttons may set cookies from their respective platforms.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. How to Control Cookies</h2>
              <div className="text-gray-300 space-y-4">
                
                <div>
                  <h3 className="text-lg font-medium text-white">Browser Settings</h3>
                  <p>Most web browsers allow you to control cookies through their settings. You can:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Set up notifications when cookies are being set</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white">Browser-Specific Instructions</h3>
                  <div className="space-y-2 ml-4">
                    <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
                    <p><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</p>
                    <p><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</p>
                    <p><strong>Edge:</strong> Settings → Site permissions → Cookies and site data</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white">Opt-Out Tools</h3>
                  <p>You can also opt out of specific tracking services:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-sunset-400 hover:text-sunset-300 underline">Google Analytics Opt-out</a></li>
                    <li>Digital Advertising Alliance: <a href="http://optout.aboutads.info/" className="text-sunset-400 hover:text-sunset-300 underline">DAA Opt-out</a></li>
                    <li>Network Advertising Initiative: <a href="http://optout.networkadvertising.org/" className="text-sunset-400 hover:text-sunset-300 underline">NAI Opt-out</a></li>
                  </ul>
                </div>

              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Impact of Disabling Cookies</h2>
              <div className="text-gray-300 space-y-2">
                <p>Please note that disabling certain cookies may impact your experience on our website:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You may need to re-enter information more frequently</li>
                  <li>Some features may not work properly or at all</li>
                  <li>You may not stay logged in between sessions</li>
                  <li>Personalized content and recommendations may not be available</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Mobile Devices</h2>
              <div className="text-gray-300">
                <p>Mobile devices may use technologies similar to cookies, such as local storage and mobile advertising identifiers. You can control these through your device settings or by opting out through industry opt-out tools.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Updates to This Policy</h2>
              <div className="text-gray-300">
                <p>We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will post any updates on this page and indicate when they were last updated. We encourage you to review this policy periodically.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <div className="text-gray-300">
                <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us at:</p>
                <ul className="list-none space-y-2 ml-4 mt-4">
                  <li><strong>Email:</strong> privacy@aiiconmaker.com</li>
                  <li><strong>Address:</strong> AI Icon Maker, Privacy Department</li>
                </ul>
                <p className="mt-4">For more information about our data practices, please see our <a href="/privacy" className="text-sunset-400 hover:text-sunset-300 underline">Privacy Policy</a>.</p>
              </div>
            </section>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 