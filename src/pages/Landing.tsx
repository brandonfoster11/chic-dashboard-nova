import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#f3e8ff] text-black dark:from-[#0f0f11] dark:to-[#1a1a1e] dark:text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-5xl font-bold mb-4 leading-tight">Style smarter.<br />Dress sharper.</h1>
          <p className="text-xl leading-relaxed mb-8 max-w-md">
            StyleAI is your personal fashion assistant powered by machine learning.
          </p>
          <div className="flex gap-4">
            <button className="bg-black text-white px-8 py-3 rounded-full text-lg hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-100">
              Get started
            </button>
            <button className="bg-white border border-black px-8 py-3 rounded-full text-lg hover:bg-zinc-100 dark:bg-zinc-700 dark:text-white dark:border-white dark:hover:bg-zinc-600 transition">
            <span className="mr-2">▶</span>Watch demo
            </button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-gradient-to-br from-[#f3e8ff] to-[#ffffff] dark:from-[#1c1c20] dark:to-[#0f0f11] p-4 rounded-xl">
            <img 
              src="/images/Outfit_Preview_mockup.png"
              alt="StyleAI outfit of the day on laptop"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-16 text-center">
        <h2 className="text-4xl font-bold">Smart Fit. Smarter Style</h2>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-lg">
          <div className="mb-4">
            <img 
              src="/images/Recommend_Outfit.png" 
              alt="Personalized recommendation interface"
              className="w-full h-auto rounded-md"
            />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Personalized recommendation</h3>
          <p className="text-zinc-600 dark:text-zinc-300">
            StyleAI learns your preferences and body shape to match outfits that feel just right.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-lg">
          <div className="mb-4">
            <img 
              src="/images/Outfit_generator.png" 
              alt="AI outfit generator interface"
              className="w-full h-auto rounded-md"
            />
          </div>
          <h3 className="text-2xl font-semibold mb-2">AI-driven suggestions</h3>
          <p className="text-zinc-600 dark:text-zinc-300">
            As your style evolves, get suggestions to match, suggest an optimal ensemble.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c1c20] p-6 rounded-lg">
          <div className="mb-4">
            <img 
              src="/images/wardrobe_management.png" 
              alt="Wardrobe management UI"
              className="w-full h-auto rounded-md"
            />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Wardrobe management</h3>
          <p className="text-zinc-600 dark:text-zinc-300">
            Easily organize and manage your wardrobe—everything in one sleek interface.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[#f9f5ff] dark:bg-[#15151a]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Pricing</h2>
          <p className="text-xl text-center mb-16 max-w-2xl mx-auto">
            Choose the plan that fits your style needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white dark:bg-[#1c1c20] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">Perfect for getting started</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-zinc-500 dark:text-zinc-400">/month</span>
                </div>
                <button className="w-full bg-white border border-black text-black py-3 rounded-full hover:bg-zinc-100 transition dark:bg-[#1c1c20] dark:border-white dark:text-white dark:hover:bg-[#252529]">
                  Get Started
                </button>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Basic wardrobe management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>5 outfit suggestions per month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Community access</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white dark:bg-[#1c1c20] rounded-xl overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 rounded-bl-lg dark:bg-white dark:text-black">
                Popular
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">For the fashion enthusiast</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-zinc-500 dark:text-zinc-400">/month</span>
                </div>
                <button className="w-full bg-black text-white py-3 rounded-full hover:bg-zinc-800 transition dark:bg-white dark:text-black dark:hover:bg-zinc-100">
                  Subscribe Now
                </button>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Advanced wardrobe management</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited outfit suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>AI style analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Seasonal trend reports</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-[#1c1c20] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">For the style connoisseur</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$19.99</span>
                  <span className="text-zinc-500 dark:text-zinc-400">/month</span>
                </div>
                <button className="w-full bg-white border border-black text-black py-3 rounded-full hover:bg-zinc-100 transition dark:bg-[#1c1c20] dark:border-white dark:text-white dark:hover:bg-[#252529]">
                  Subscribe Now
                </button>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Everything in Premium</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Personal stylist consultation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Shopping recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Mode Section */}
      <section className="py-10 text-center">
        <div className="inline-block bg-[#f3e8ff] dark:bg-[#1c1c20] px-6 py-3 rounded-full">
          Design Mode Enabled
        </div>
      </section>
    </div>
  );
}