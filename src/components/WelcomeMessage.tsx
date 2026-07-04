import React from 'react';

export function WelcomeMessage() {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-6 mb-12">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Welcome to TravelSync!</h2>
      <div className="space-y-4 text-slate-300 leading-relaxed font-normal">
        <p>
          We're thrilled to have you here. At TravelSync, we are dedicated to delivering 
          exceptional travel solutions that make your journey seamless and unforgettable.
        </p>
        <p>
          Whether you're planning a business trip, vacation, or adventure, we're here to help 
          you organize and optimize every aspect of your travel experience.
        </p>
        <p>
          Explore our platform and discover how we can help make your travels smoother and 
          more enjoyable. Our intelligent system adapts to your needs, providing real-time 
          updates and smart recommendations throughout your journey.
        </p>
      </div>
    </div>
  );
}