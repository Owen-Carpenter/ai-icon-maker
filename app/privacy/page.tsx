import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar variant="marketing" />
      
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-sunset-200 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-white space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-lg font-medium text-white">Personal Information</h3>
                <p>When you create an account or use our services, we may collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email address and account credentials</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Profile information you choose to provide</li>
                </ul>
                
                <h3 className="text-lg font-medium text-white">Usage Data</h3>
                <p>We automatically collect information about how you use our service:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Icons you generate and prompts you submit</li>
                  <li>Features you use and preferences you set</li>
                  <li>Technical information about your device and connection</li>
                  <li>Log data including IP address, browser type, and usage patterns</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <div className="text-gray-300 space-y-2">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and maintain our AI icon generation service</li>
                  <li>Process your payments and manage your subscription</li>
                  <li>Generate icons based on your prompts and preferences</li>
                  <li>Improve our AI models and service quality</li>
                  <li>Send you important updates about your account and our service</li>
                  <li>Provide customer support and respond to your inquiries</li>
                  <li>Detect and prevent fraud or abuse</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
              <div className="text-gray-300 space-y-4">
                <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> With trusted third-party services like Stripe for payment processing and Supabase for data storage</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Safety:</strong> To protect the rights, property, or safety of our users or others</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <div className="text-gray-300 space-y-2">
                <p>We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure payment processing through Stripe</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication measures</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <div className="text-gray-300 space-y-2">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of non-essential communications</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
              <div className="text-gray-300 space-y-2">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how you use our service</li>
                  <li>Improve our website performance</li>
                </ul>
                <p>You can control cookie settings through your browser preferences.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
              <div className="text-gray-300">
                <p>Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. International Users</h2>
              <div className="text-gray-300">
                <p>Our service is operated from the United States. If you are accessing our service from outside the US, please be aware that your information may be transferred to, stored, and processed in the United States where our servers and central database are located.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
              <div className="text-gray-300">
                <p>We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "last updated" date. Your continued use of our service after such changes constitutes acceptance of the updated policy.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <div className="text-gray-300">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
                <ul className="list-none space-y-2 ml-4 mt-4">
                  <li><strong>Email:</strong> privacy@aiiconmaker.com</li>
                  <li><strong>Address:</strong> AI Icon Maker, Privacy Department</li>
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