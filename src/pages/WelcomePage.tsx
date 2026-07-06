import React, { useState } from 'react';
import { 
  Plane, Star, Clock, Compass, Heart, Sun, ChevronRight, Send, 
  Github, Twitter, Linkedin, Instagram, Globe, CheckCircle2, 
  Sparkles, Coins, ArrowRight, User 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LoginPage } from './LoginPage';
import { WelcomeHero } from '../components/layout/WelcomeHero';
import { WelcomeMessage } from '../components/layout/WelcomeMessage';
import { FeatureGrid, PREMIUM_WELCOME_FEATURES } from '../components/cards/FeatureGrid';
import { Navigation } from '../components/navigation/Navigation';
import { useToast } from '../components/common/Toast';

interface Props {
  onGetStarted: () => void;
  onFeatureClick?: (featureId: string) => void;
}

// Right column travel photograph layout with quick booking action
const TravelShowcase: React.FC<Props> = ({ onGetStarted, onFeatureClick }) => {
  const navigateClick = () => {
    if (onFeatureClick) {
      onFeatureClick('smart-booking');
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="relative w-full h-[520px] flex items-center justify-center py-6">
      <div className="relative w-full max-w-[440px] h-full flex flex-col justify-between">
        
        {/* Large Travel Destination Showcase (Swiss Alps) */}
        <div className="travel-card rounded-[20px] overflow-hidden relative shadow-md h-[260px] group cursor-pointer" onClick={navigateClick}>
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop" 
            alt="Lauterbrunnen Valley"
            className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white text-left">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#5EEAD4] font-mono">Switzerland</span>
            <h3 className="text-lg font-black mt-0.5">Lauterbrunnen Valley</h3>
          </div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-200/50 flex items-center gap-1 text-[9px] text-amber-500 font-bold">
            <Star className="w-2.5 h-2.5 fill-amber-500 text-none" />
            <span>4.9</span>
          </div>
        </div>

        {/* Quick Booking Slip Card (Handcrafted Booking style input) */}
        <div className="travel-card p-5 rounded-[20px] text-left bg-white space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Plan Search Parameters</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">From</label>
              <input 
                type="text" 
                readOnly 
                value="London (LHR)" 
                className="w-full bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-xs font-semibold text-slate-700 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">To</label>
              <input 
                type="text" 
                readOnly 
                value="Tokyo (HND)" 
                className="w-full bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-xs font-semibold text-slate-700 outline-none" 
              />
            </div>
          </div>
          
          <button 
            type="button"
            onClick={navigateClick}
            className="w-full py-3 btn-teal text-xs uppercase tracking-wider font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Search Flight Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export function WelcomePage({ onGetStarted, onFeatureClick }: Props) {
  const { showToast } = useToast();
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <LoginPage onBack={() => setShowLogin(false)} />;
  }

  const destinations = [
    {
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      city: 'Paris',
      country: 'France',
      rating: '4.9',
      season: 'Spring',
      temp: '18°C',
      desc: 'City of lights, art galleries, and modern fashion.'
    },
    {
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      city: 'Kyoto',
      country: 'Japan',
      rating: '4.9',
      season: 'Autumn / Spring',
      temp: '16°C',
      desc: 'Traditional cityscapes merged with historic temples.'
    },
    {
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      city: 'Bali',
      country: 'Indonesia',
      rating: '4.8',
      season: 'Summer',
      temp: '29°C',
      desc: 'Tropical coastlines, emerald forests, and spiritual sanctuaries.'
    },
    {
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
      city: 'Sydney',
      country: 'Australia',
      rating: '4.7',
      season: 'Winter / Spring',
      temp: '22°C',
      desc: 'Iconic harbors, ocean pools, and vibrant urban culture.'
    }
  ];

  const handleCardClick = (id: string) => {
    if (onFeatureClick) {
      onFeatureClick(id);
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 selection:bg-[#00A896]/20 selection:text-[#0F3D91] pb-10">
      
      {/* Navigation Header */}
      <Navigation onLoginClick={() => setShowLogin(true)} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-[90vh] flex flex-col justify-center relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <WelcomeHero onGetStarted={onGetStarted} />
          </div>

          <div className="lg:col-span-5 flex justify-center items-center">
            <TravelShowcase onGetStarted={onGetStarted} onFeatureClick={onFeatureClick} />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto relative border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D91]/5 border border-[#0F3D91]/10 text-xs font-semibold text-[#0F3D91] tracking-wider uppercase font-mono">
            Premium Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F3D91]">
            Coordinate your voyages with precision.
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            A comprehensive suite of flight tracking options, route optimization maps, and secure digital vault lockers.
          </p>
        </div>

        <FeatureGrid onFeatureClick={handleCardClick} features={PREMIUM_WELCOME_FEATURES} />
      </section>

      {/* Philosophy Section */}
      <section className="py-12 px-6 sm:px-12 max-w-[1280px] mx-auto">
        <WelcomeMessage />
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto border-t border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00A896]/5 border border-[#00A896]/15 text-xs font-semibold text-[#00A896] tracking-wider uppercase font-mono">
              <Compass className="w-3.5 h-3.5 text-[#00A896]" />
              World Explorations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F3D91]">
              Trending Destinations
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Handpicked premium escapes experiencing peak seasons and optimal climate patterns.
            </p>
          </div>
          <button 
            type="button"
            onClick={onGetStarted}
            className="btn-secondary px-6 py-3 text-xs uppercase tracking-wider flex items-center gap-2 self-start md:self-auto group"
          >
            <span>Plan Custom Trip</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <div 
              key={dest.city}
              className="travel-card rounded-2xl overflow-hidden group cursor-pointer text-left flex flex-col h-full bg-white border border-slate-200 shadow-sm hover:translate-y-[-2px] transition duration-200"
            >
              <div className="relative h-[200px] overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-200/50 flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-500 text-none" />
                  <span>{dest.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-bold text-[#5EEAD4] tracking-wider uppercase font-mono">{dest.country}</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{dest.city}</h3>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {dest.desc}
                </p>
                <div className="space-y-3.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dest.season}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#00A896]">
                      <Sun className="w-3.5 h-3.5" />
                      <span>{dest.temp}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleCardClick('interactive-maps')}
                    className="w-full btn-secondary py-2.5 text-xs uppercase tracking-wider text-slate-700"
                  >
                    Explore Area
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D91]/5 border border-[#0F3D91]/10 text-xs font-semibold text-[#0F3D91] tracking-wider uppercase font-mono">
            <Heart className="w-3.5 h-3.5 text-[#0F3D91]" />
            Customer Success
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F3D91]">
            Trusted by Modern Explorers
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-medium">
            Read comments from global travelers who optimized their itineraries using our planning tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Alexander V.',
              role: 'Product Lead at Linear',
              country: 'United States',
              review: 'The AI itinerary planning tool saved me hours of manual search. Absolutely clean interface and zero bloat.',
              rating: 5
            },
            {
              name: 'Elena K.',
              role: 'Landscape Photographer',
              country: 'Germany',
              review: 'The weather parameters and mapping components made my photo trip fully organized. Timeless design layout.',
              rating: 5
            },
            {
              name: 'Marcus Chen',
              role: 'Venture Architect',
              country: 'Singapore',
              review: 'A luxury SaaS application that actually delivers. Real-time updates alerted me to flight terminal updates immediately.',
              rating: 5
            }
          ].map((item) => (
            <div 
              key={item.name} 
              className="travel-card bg-white border border-slate-200 p-6 rounded-[20px] text-left flex flex-col justify-between h-full shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 stroke-none" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-semibold italic">
                  "{item.review}"
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0F3D91]/5 border border-slate-200 flex items-center justify-center text-[#0F3D91] text-xs font-bold font-mono shadow-inner">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{item.role} • {item.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D91]/5 border border-[#0F3D91]/10 text-xs font-semibold text-[#0F3D91] tracking-wider uppercase font-mono">
            <Coins className="w-3.5 h-3.5 text-[#0F3D91]" />
            Pricing Plans
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F3D91]">
            Clear plans, no hidden costs.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-medium">
            Choose the plan that suits your travel requirements. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-[1024px] mx-auto">
          {/* Starter Plan */}
          <div className="travel-card bg-white border border-slate-200 p-8 rounded-[20px] text-left flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0F3D91]">Starter</h3>
                  <p className="text-xs text-slate-455 mt-1 font-semibold">For casual backpackers</p>
                </div>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-800 font-mono">$0</span>
                <span className="text-xs text-slate-500 font-semibold">/ forever free</span>
              </div>
              <ul className="space-y-3.5 mb-8 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>3 active itineraries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Basic offline maps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Flight search sandbox queries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Document vault (100MB limit)</span>
                </li>
              </ul>
            </div>
            <button 
              type="button"
              onClick={onGetStarted}
              className="w-full btn-secondary py-3 text-xs uppercase tracking-wider"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="travel-card bg-white border-2 border-[#00A896] p-8 rounded-[20px] text-left relative flex flex-col justify-between shadow-md">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00A896] px-3.5 py-1 rounded-full text-[9px] text-white font-black tracking-widest uppercase font-mono shadow-sm">
              Recommended
            </div>
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0F3D91]">Pro</h3>
                  <p className="text-xs text-slate-455 mt-1 font-semibold">For frequent travelers</p>
                </div>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-800 font-mono">$12</span>
                <span className="text-xs text-slate-500 font-semibold">/ month</span>
              </div>
              <ul className="space-y-3.5 mb-8 text-xs text-slate-650 font-medium">
                <li className="flex items-center gap-2 text-[#00A896]">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span className="font-semibold text-slate-800">Unlimited active itineraries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Neural Travel Itinerary Assistant</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Live weather and route calculations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Active gate-monitoring updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Encrypted vault (10GB limit)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Collaborator sharing options</span>
                </li>
              </ul>
            </div>
            <button 
              type="button"
              onClick={onGetStarted}
              className="w-full btn-teal py-3 text-xs uppercase tracking-wider"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="travel-card bg-white border border-slate-200 p-8 rounded-[20px] text-left flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0F3D91]">Enterprise</h3>
                  <p className="text-xs text-slate-455 mt-1 font-semibold">For teams & business relocations</p>
                </div>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-800 font-mono">$49</span>
                <span className="text-xs text-slate-500 font-semibold">/ month</span>
              </div>
              <ul className="space-y-3.5 mb-8 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>All features inside Pro tier</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Dedicated corporate manager routing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Expense reporting and PDF tax logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Custom team API tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A896]" />
                  <span>Unlimited secure document space</span>
                </li>
              </ul>
            </div>
            <button 
              type="button"
              onClick={onGetStarted}
              className="w-full btn-secondary py-3 text-xs uppercase tracking-wider"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Premium Light Footer */}
      <footer id="footer" className="bg-[#F8FAFC] border-t border-slate-200/80 pt-20 pb-10 px-6 sm:px-12 text-left mt-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-16 border-b border-slate-200/60">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0F3D91] flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-black text-[#0F3D91]">TravelSync</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
              Providing premium travel coordination tools. Optimized routing, secure document storage, and expense tracking arrays built for the modern global traveler.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-7 h-7 rounded-full bg-slate-200/50 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0F3D91] transition">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-slate-200/50 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0F3D91] transition">
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-slate-200/50 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0F3D91] transition">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-slate-200/50 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0F3D91] transition">
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F3D91] uppercase tracking-wider mb-4 font-mono">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-bold">
              <li><a href="#" className="hover:text-[#0F3D91] transition">About Us</a></li>
              <li><a href="#" className="hover:text-[#0F3D91] transition">Careers</a></li>
              <li><a href="#" className="hover:text-[#0F3D91] transition">Press Kit</a></li>
              <li><a href="#" className="hover:text-[#0F3D91] transition">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F3D91] uppercase tracking-wider mb-4 font-mono">Resources</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-bold">
              <li><a href="#" className="hover:text-[#0F3D91] transition">AI Travel Assistant</a></li>
              <li><a href="#" className="hover:text-[#0F3D91] transition">User Guide</a></li>
              <li><a href="#" className="hover:text-[#0F3D91] transition">Integrations</a></li>
              <li><a href="#" className="hover:text-[#0F3D91] transition">Service Partners</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F3D91] uppercase tracking-wider mb-4 font-mono">Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-bold">
              <li><a href="#" className="hover:text-[#0F3D91] transition">Help Center</a></li>
              <li><a href="#" className="hover:text-[#0F3D91] transition">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-[#0F3D91] transition">SOS Contact</a></li>
              <li><a href="#" className="hover:text-[#0F3D91] transition">Developer API</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <h4 className="text-xs font-bold text-[#0F3D91] uppercase tracking-wider font-mono">Newsletter</h4>
            <p className="text-[11px] text-slate-500 font-semibold leading-normal">
              Subscribe to get updates on seasonal travel parameters.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="name@email.com"
                className="w-full travel-input px-3 py-2 text-[11px] pr-9"
              />
              <button 
                type="button"
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#00A896] hover:bg-[#008f7f] text-white rounded-lg transition flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-450 font-bold gap-4">
          <p>© 2026 TravelSync Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0F3D91] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#0F3D91] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#0F3D91] transition">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
