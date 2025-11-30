import Link from 'next/link';
import Logo from './ui/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent border-t border-gray-200/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <Logo width={32} height={32} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold text-white">AI Icon Maker</span>
            </Link>
            <p className="text-gray-300 max-w-sm">
              Create stunning, professional icons with the power of AI. 
              Perfect for designers, developers, and creative professionals.
            </p>
          </div>

          {/* Tools (SEO Pages) */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/ai-icon-generator" className="text-gray-300 hover:text-white transition-colors duration-300">
                  AI Icon Generator
                </Link>
              </li>
              <li>
                <Link href="/app-icon-maker" className="text-gray-300 hover:text-white transition-colors duration-300">
                  App Icon Maker
                </Link>
              </li>
              <li>
                <Link href="/png-icon-generator" className="text-gray-300 hover:text-white transition-colors duration-300">
                  PNG Icon Generator
                </Link>
              </li>
              <li>
                <Link href="/favicon-generator-ai" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Favicon Generator
                </Link>
              </li>
              <li>
                <Link href="/icon-set-generator" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Icon Set Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#pricing" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support & Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © {currentYear} AI Icon Maker. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          {/* Developer Watermark */}
          <div className="mt-6 pt-6 border-t border-gray-200/10 text-center">
            <p className="text-gray-400/60 text-xs">
              Developed by <span className="text-sunset-300 font-medium"> Carpentech</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
