'use client';

import { useState } from 'react';
import ScrollAnimation from './ScrollAnimation';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <section id="contact" className="py-20 bg-midnight-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <ScrollAnimation>
            <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
          </ScrollAnimation>
          <ScrollAnimation delay={100}>
            <p className="text-sunset-200 max-w-2xl mx-auto">
              Have questions about AI Icon Maker? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </ScrollAnimation>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <ScrollAnimation delay={150}>
            <div className="bg-gradient-to-br from-midnight-900/50 to-midnight-950/70 backdrop-blur-md rounded-lg p-8 border border-white/10 shadow-xl">
              <h3 className="text-2xl font-semibold text-white mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sunset-200 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-midnight-800/50 border border-midnight-700 rounded-lg px-4 py-3 text-white placeholder-sunset-300/50 focus:outline-none focus:border-sunset-400 focus:ring-1 focus:ring-sunset-400 transition-colors duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sunset-200 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-midnight-800/50 border border-midnight-700 rounded-lg px-4 py-3 text-white placeholder-sunset-300/50 focus:outline-none focus:border-sunset-400 focus:ring-1 focus:ring-sunset-400 transition-colors duration-300"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sunset-200 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-midnight-800/50 border border-midnight-700 rounded-lg px-4 py-3 text-white placeholder-sunset-300/50 focus:outline-none focus:border-sunset-400 focus:ring-1 focus:ring-sunset-400 transition-colors duration-300 resize-none"
                    placeholder="Tell us about your project or question..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sunset-gradient text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-sunset-500/30"
                >
                  Send Message
                </button>
              </form>
            </div>
          </ScrollAnimation>

          {/* Contact Information */}
          <ScrollAnimation delay={250}>
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-midnight-900/50 to-midnight-950/70 backdrop-blur-md rounded-lg p-6 border border-white/10 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#ff7e5f] rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Email</h4>
                    <p className="text-sunset-200">hello@aiiconmaker.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-midnight-900/50 to-midnight-950/70 backdrop-blur-md rounded-lg p-6 border border-white/10 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#ff7e5f] rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Live Chat</h4>
                    <p className="text-sunset-200">Available 24/7</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-midnight-900/50 to-midnight-950/70 backdrop-blur-md rounded-lg p-6 border border-white/10 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#ff7e5f] rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Office</h4>
                    <p className="text-sunset-200">San Francisco, CA</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-midnight-900/50 to-midnight-950/70 backdrop-blur-md rounded-lg p-6 border border-white/10 shadow-xl">
                <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-[#ff7e5f] rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#ff7e5f] rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#ff7e5f] rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
} 