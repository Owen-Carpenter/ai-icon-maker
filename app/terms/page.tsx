import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar variant="marketing" />
      
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-sunset-200 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-white space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <div className="text-gray-300">
                <p>By accessing and using AI Icon Maker ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <div className="text-gray-300 space-y-2">
                <p>AI Icon Maker provides artificial intelligence-powered icon generation services. Our service allows users to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Generate custom icons using AI technology</li>
                  <li>Access and manage their icon library</li>
                  <li>Download icons in various formats</li>
                  <li>Use icons for commercial and personal projects</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-lg font-medium text-white">Account Creation</h3>
                <p>To use our service, you must create an account and provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>
                
                <h3 className="text-lg font-medium text-white">Account Responsibility</h3>
                <p>You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment</h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-lg font-medium text-white">Subscription Plans</h3>
                <p>We offer various subscription plans with different features and usage limits. Current pricing and features are available on our website.</p>
                
                <h3 className="text-lg font-medium text-white">Payment Terms</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                  <li>Payment is processed through Stripe, our secure payment provider</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>We reserve the right to change pricing with 30 days notice</li>
                </ul>
                
                <h3 className="text-lg font-medium text-white">Cancellation</h3>
                <p>You may cancel your subscription at any time. Your access will continue until the end of your current billing period.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-lg font-medium text-white">Permitted Uses</h3>
                <p>You may use our service to generate icons for legitimate personal and commercial purposes.</p>
                
                <h3 className="text-lg font-medium text-white">Prohibited Uses</h3>
                <p>You agree not to use the service to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Generate illegal, harmful, threatening, abusive, or offensive content</li>
                  <li>Infringe on intellectual property rights of others</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Attempt to reverse engineer or extract our AI models</li>
                  <li>Use the service for spam or unauthorized commercial purposes</li>
                  <li>Share your account credentials with others</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-lg font-medium text-white">Generated Content</h3>
                <p>You own the icons generated through our service and may use them for any legal purpose, including commercial use, without attribution requirements.</p>
                
                <h3 className="text-lg font-medium text-white">Service Content</h3>
                <p>The AI Icon Maker service, including our AI models, software, and website content, is protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our service content.</p>
                
                <h3 className="text-lg font-medium text-white">User-Submitted Content</h3>
                <p>By submitting prompts or other content, you grant us a license to use this content to provide and improve our service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Privacy and Data</h2>
              <div className="text-gray-300">
                <p>Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information when you use our service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Service Availability</h2>
              <div className="text-gray-300 space-y-2">
                <p>We strive to maintain high service availability, but we do not guarantee uninterrupted access. Our service may be temporarily unavailable due to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Scheduled maintenance</li>
                  <li>Technical issues or outages</li>
                  <li>Third-party service dependencies</li>
                  <li>Force majeure events</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitations</h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-lg font-medium text-white">Service "As Is"</h3>
                <p>Our service is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the service will be error-free or uninterrupted.</p>
                
                <h3 className="text-lg font-medium text-white">Limitation of Liability</h3>
                <p>To the maximum extent permitted by law, AI Icon Maker shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
              <div className="text-gray-300 space-y-2">
                <p>We may terminate or suspend your account and access to the service at our sole discretion, without prior notice, for conduct that we believe:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violates these Terms of Service</li>
                  <li>Is harmful to other users or our service</li>
                  <li>Exposes us or others to liability</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <div className="text-gray-300">
                <p>We reserve the right to modify these terms at any time. We will notify users of material changes via email or through our service. Your continued use of the service after such changes constitutes acceptance of the new terms.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
              <div className="text-gray-300">
                <p>These terms are governed by and construed in accordance with the laws of the United States. Any disputes arising from these terms or your use of the service will be subject to the exclusive jurisdiction of the courts in the United States.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
              <div className="text-gray-300">
                <p>If you have any questions about these Terms of Service, please contact us at:</p>
                <ul className="list-none space-y-2 ml-4 mt-4">
                  <li><strong>Email:</strong> legal@aiiconmaker.com</li>
                  <li><strong>Address:</strong> AI Icon Maker, Legal Department</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 