import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Brain, Plane, DollarSign, CloudSun, CreditCard, 
  Coins, ShieldAlert, Map, BarChart3, ArrowRight, Star, 
  MapPin, Clock, Compass, Heart, Sun, ChevronRight, 
  Send, Github, Twitter, Linkedin, Instagram, Activity, 
  Layers, Navigation2, CheckCircle2, User, Globe
} from 'lucide-react';
import { LoginPage } from './LoginPage';

interface Props {
  onGetStarted: () => void;
  onFeatureClick?: (featureId: string) => void;
}

// Live Time Widget component inside navbar
function NavbarClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-[#5EEAD4]">
      <Clock className="w-3.5 h-3.5 text-[#5EEAD4]" />
      <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
    </div>
  );
}

export function WelcomePage({ onGetStarted, onFeatureClick }: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (showLogin) {
    return <LoginPage onBack={() => setShowLogin(false)} />;
  }

  // Feature Card Configuration
  const premiumFeatures = [
    { 
      icon: Brain, 
      title: 'AI Trip Planner', 
      desc: 'Adaptive schedules built in seconds based on your travel personality.',
      color: 'purple',
      id: 'dynamic-planning'
    },
    { 
      icon: Plane, 
      title: 'Flight Tracking', 
      desc: 'Real-time monitoring and immediate warnings for terminal shifts.',
      color: 'primary',
      id: 'real-time-updates'
    },
    { 
      icon: Globe, 
      title: 'Hotel Finder', 
      desc: 'Smart localization and pricing matrix comparison across aggregator APIs.',
      color: 'teal',
      id: 'smart-booking'
    },
    { 
      icon: DollarSign, 
      title: 'Smart Budgeting', 
      desc: 'Calculates maximum costs, saving margins, and alerts you to overspending.',
      color: 'purple',
      id: 'dynamic-planning'
    },
    { 
      icon: CloudSun, 
      title: 'Live Weather', 
      desc: 'Immediate forecast metrics dynamically overlaid onto route vectors.',
      color: 'teal',
      id: 'interactive-maps'
    },
    { 
      icon: CreditCard, 
      title: 'Expense Tracking', 
      desc: 'Add, categorize, and archive travel receipts directly inside your vault.',
      color: 'primary',
      id: 'dynamic-planning'
    },
    { 
      icon: Coins, 
      title: 'Currency Converter', 
      desc: 'Conversion matrix updated in real-time with zero-latency rates.',
      color: 'purple',
      id: 'smart-booking'
    },
    { 
      icon: ShieldAlert, 
      title: 'Emergency Assistance', 
      desc: 'One-click SOS routing, nearest embassy contacts, and localized translations.',
      color: 'primary',
      id: 'real-time-updates'
    },
    { 
      icon: Map, 
      title: 'Offline Maps', 
      desc: 'Offline route compilation using cached TomTom telemetry.',
      color: 'teal',
      id: 'interactive-maps'
    },
    { 
      icon: BarChart3, 
      title: 'Travel Analytics', 
      desc: 'Beautiful visualization arrays mapping total miles, currencies, and spending.',
      color: 'primary',
      id: 'dynamic-planning'
    }
  ];

  // Destination Card Configuration
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
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80',
      city: 'Tokyo',
      country: 'Japan',
      rating: '4.9',
      season: 'Autumn / Spring',
      temp: '16°C',
      desc: 'Neo-futurist cityscapes merged with ancestral temples.'
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
    <div className="min-h-screen animate-mesh relative selection:bg-[#4F9DFF]/30 selection:text-white">
      {/* Background Glowing Blur Balls */}
      <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#4F9DFF]/5 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-[#7C6CF7]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[15%] w-[450px] h-[450px] bg-[#5EEAD4]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* STICKY NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-navbar py-3 shadow-lg' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1280px] mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F9DFF] to-[#7C6CF7] flex items-center justify-center shadow-md shadow-[#4F9DFF]/20">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Travel<span className="font-light text-slate-350">Sync</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition duration-200">Home</a>
            <a href="#features" className="hover:text-white transition duration-200">Features</a>
            <a href="#destinations" className="hover:text-white transition duration-200">Destinations</a>
            <a href="#pricing" className="hover:text-white transition duration-200">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition duration-200">Reviews</a>
            <a href="#footer" className="hover:text-white transition duration-200">Contact</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <NavbarClock />
            <button 
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 text-sm font-medium text-slate-350 hover:text-white transition duration-200"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="glass-btn-primary px-5 py-2 text-sm font-bold shadow-md shadow-[#4F9DFF]/10"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 sm:px-12 max-w-[1280px] mx-auto min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F9DFF]/10 border border-[#4F9DFF]/20 text-xs font-semibold text-[#4F9DFF] tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Introducing Next-Gen AI Itineraries
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-gradient-primary">
              Travel Smarter. <br />
              <span className="text-gradient-accent">Explore Better.</span>
            </h1>

            <p className="text-lg text-slate-350 leading-relaxed max-w-xl">
              Plan, organize, and optimize every journey with AI-powered travel assistance, 
              real-time updates, and intelligent recommendations tailored to your character.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={onGetStarted}
                className="glass-btn-primary px-8 py-4 text-base font-bold flex items-center gap-2 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#features"
                className="glass-btn px-8 py-4 text-base font-bold flex items-center justify-center"
              >
                Explore Features
              </a>
            </div>

            {/* Statistics */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white text-gradient-teal">20K+</p>
                <p className="text-xs text-slate-450 font-medium uppercase tracking-wider mt-1">Trips Planned</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white text-gradient-accent">95%</p>
                <p className="text-xs text-slate-450 font-medium uppercase tracking-wider mt-1">Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white text-gradient-teal">150+</p>
                <p className="text-xs text-slate-450 font-medium uppercase tracking-wider mt-1">Countries</p>
              </div>
            </div>
          </div>

          {/* Right Floating Dashboard Visual */}
          <div className="lg:col-span-6 flex justify-center items-center relative h-[500px]">
            {/* Dashboard Container */}
            <div className="relative w-full max-w-[450px]">
              
              {/* Card 1: World Map Visual - Base layer */}
              <div className="glass-card p-5 rounded-2xl w-full border border-white/5 z-10 animate-float relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5EEAD4] animate-pulse"></div>
                    <span className="text-[11px] font-bold text-slate-350 tracking-widest uppercase">Live Telemetry Map</span>
                  </div>
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>
                {/* Simulated Map lines */}
                <div className="h-[180px] bg-white/[0.02] border border-white/5 rounded-lg flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Curved connection path visual */}
                  <svg className="absolute w-full h-full stroke-slate-500/20 stroke-2 fill-none">
                    <path d="M 50 140 Q 150 40 350 90" strokeDasharray="5,5" className="stroke-[#4F9DFF]/60" />
                    <circle cx="50" cy="140" r="4" className="fill-[#4F9DFF]" />
                    <circle cx="350" cy="90" r="4" className="fill-[#7C6CF7]" />
                  </svg>
                  
                  {/* Flying Plane indicator */}
                  <div className="absolute top-[65px] left-[180px] w-6 h-6 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center rotate-45 shadow-lg">
                    <Plane className="w-3 h-3 text-[#4F9DFF]" />
                  </div>

                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/5 text-[9px] font-mono text-slate-400">
                    LHR ➔ HND (AA932)
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/5 text-[9px] font-mono text-[#5EEAD4]">
                    ALT: 38,000ft
                  </div>
                </div>
              </div>

              {/* Card 2: Upcoming Flight Status Card - Floating Left */}
              <div className="glass-card p-4 rounded-xl border border-white/10 w-[240px] absolute -left-8 top-[180px] z-30 animate-float-delayed shadow-xl shadow-black/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-[#4F9DFF]" />
                    <span className="text-[10px] font-bold tracking-wider text-slate-350 uppercase">Flight Status</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">On Time</span>
                </div>
                <p className="text-sm font-bold text-white">London Heathrow</p>
                <div className="flex items-center gap-2 my-1 text-[11px] text-slate-400 font-mono">
                  <span>LHR</span>
                  <div className="h-px flex-1 bg-slate-800"></div>
                  <span>HND</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-450 font-medium mt-2">
                  <span>Gate B22</span>
                  <span>Boarding 11:45</span>
                </div>
              </div>

              {/* Card 3: Weather Card Widget - Floating Right */}
              <div className="glass-card p-4 rounded-xl border border-white/10 w-[170px] absolute -right-6 top-[40px] z-20 animate-float-reverse shadow-xl shadow-black/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider text-slate-450 uppercase">Tokyo</span>
                  <CloudSun className="w-4 h-4 text-[#5EEAD4]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">24°</span>
                  <span className="text-[10px] text-slate-400 font-medium">Mostly Sunny</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-3">
                  <div className="bg-gradient-to-r from-[#5EEAD4] to-[#4F9DFF] h-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              {/* Card 4: Budget tracker - Bottom Center */}
              <div className="glass-card p-4 rounded-xl border border-white/10 w-[280px] absolute -bottom-10 right-4 z-40 animate-float-delayed-more shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-wider text-slate-450 uppercase">Budget Optimization</span>
                  <span className="text-[10px] font-bold text-[#5EEAD4]">$1,240 / $2,000</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden relative mb-2">
                  <div className="bg-[#7C6CF7] h-full" style={{ width: '62%' }}></div>
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                  <span>Hotels: $540</span>
                  <span>Flights: $420</span>
                  <span>Others: $280</span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[9px] text-[#5EEAD4] bg-[#5EEAD4]/5 px-2 py-0.5 rounded border border-[#5EEAD4]/10">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>AI Recommendation: Save $120 on train pass</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C6CF7]/15 border border-[#7C6CF7]/25 text-xs font-semibold text-[#7C6CF7] tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5" />
            Premium Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-gradient-primary">
            Every tool required to organize your voyages.
          </h2>
          <p className="text-base text-slate-400">
            A comprehensive suite of intelligence layers, tracking metrics, and secure vaults. Click any card below to launch the tool.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map(({ icon: Icon, title, desc, color, id }, index) => (
            <div
              key={title}
              onClick={() => handleCardClick(id)}
              className={`glass-card p-6 rounded-2xl cursor-pointer select-none text-left flex flex-col justify-between group ${
                color === 'purple' ? 'glass-card-purple' : color === 'teal' ? 'glass-card-teal' : ''
              }`}
            >
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition duration-300 border ${
                  color === 'purple' ? 'bg-[#7C6CF7]/10 border-[#7C6CF7]/20 text-[#7C6CF7] group-hover:bg-[#7C6CF7]/20' : 
                  color === 'teal' ? 'bg-[#5EEAD4]/10 border-[#5EEAD4]/20 text-[#5EEAD4] group-hover:bg-[#5EEAD4]/20' : 
                  'bg-[#4F9DFF]/10 border-[#4F9DFF]/20 text-[#4F9DFF] group-hover:bg-[#4F9DFF]/20'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#4F9DFF] transition duration-200 flex items-center gap-1.5">
                  {title}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mt-2">{desc}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <span>Active module</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINATIONS SECTION */}
      <section id="destinations" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5EEAD4]/15 border border-[#5EEAD4]/25 text-xs font-semibold text-[#5EEAD4] tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5" />
              World Explorations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-gradient-primary">
              Trending Destination Hotspots
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Handpicked premium escapes experiencing peak seasons and optimal climate matrices.
            </p>
          </div>
          <button 
            onClick={onGetStarted}
            className="glass-btn px-6 py-3 text-sm font-bold flex items-center gap-2 self-start md:self-auto group"
          >
            <span>Plan Custom Trip</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <div 
              key={dest.city}
              className="glass-card rounded-2xl overflow-hidden border border-white/5 group cursor-pointer text-left"
            >
              <div className="relative h-[220px] overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/30 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 text-[10px] text-amber-400 font-bold shadow-md">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{dest.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#5EEAD4] tracking-wider uppercase">{dest.country}</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{dest.city}</h3>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed h-[36px] overflow-hidden">
                  {dest.desc}
                </p>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-450 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Season: {dest.season}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#4F9DFF]">
                    <Sun className="w-3.5 h-3.5" />
                    <span>Avg {dest.temp}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleCardClick('interactive-maps')}
                  className="w-full glass-btn py-2 text-xs font-bold hover:bg-[#4F9DFF]/10 hover:text-white hover:border-[#4F9DFF]/30 transition"
                >
                  Explore Area
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F9DFF]/15 border border-[#4F9DFF]/25 text-xs font-semibold text-[#4F9DFF] tracking-wider uppercase">
            <Heart className="w-3.5 h-3.5" />
            Customer Success
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-gradient-primary">
            Trusted by Modern Explorers
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Read comments from global travelers who optimized their itineraries using our neural assistance engines.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Alexander V.',
              role: 'Product Lead at Linear',
              country: 'United States',
              review: 'The AI dynamic itinerary planning feature saved me at least 15 hours of manual map compilation. Absolutely flawless interface.',
              rating: 5
            },
            {
              name: 'Elena K.',
              role: 'Landscape Photographer',
              country: 'Germany',
              review: 'The live weather overlays and offline telemetry routes made my expedition in Hokkaido fully secure. High-end product design.',
              rating: 5
            },
            {
              name: 'Marcus Chen',
              role: 'Venture Architect',
              country: 'Singapore',
              review: 'A luxury SaaS application that actually delivers. Real-time updates alerted me to a flight gate change before the airport screens did.',
              rating: 5
            }
          ].map((item, index) => (
            <div key={item.name} className="glass-card p-6 rounded-2xl text-left border border-white/5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4F9DFF] to-[#7C6CF7] flex items-center justify-center text-white text-xs font-bold font-mono">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-450">{item.role} • {item.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 sm:px-12 max-w-[1280px] mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C6CF7]/15 border border-[#7C6CF7]/25 text-xs font-semibold text-[#7C6CF7] tracking-wider uppercase">
            <Coins className="w-3.5 h-3.5" />
            Pricing Matrices
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-gradient-primary">
            Sleek tiers, zero hidden variables.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Choose the plan that suits your exploration constraints. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-[1024px] mx-auto">
          {/* Starter Tier */}
          <div className="glass-card p-8 rounded-2xl text-left border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Starter</h3>
                  <p className="text-xs text-slate-450 mt-1">For casual backpackers</p>
                </div>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-xs text-slate-450 font-medium">/ forever free</span>
              </div>
              <ul className="space-y-3.5 mb-8 text-xs text-slate-350 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>3 active itineraries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Basic offline TomTom maps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Aggregated flight list searches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Document vault (100MB limit)</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={onGetStarted}
              className="w-full glass-btn py-3 text-xs font-bold"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="glass-card p-8 rounded-2xl text-left border-[#4F9DFF]/30 relative flex flex-col justify-between glow-pulse">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#4F9DFF] to-[#7C6CF7] px-3.5 py-1 rounded-full text-[10px] text-white font-extrabold tracking-wider uppercase shadow-md shadow-[#4F9DFF]/15">
              Recommended
            </div>
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                    Pro
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">For frequent business & leisure travel</p>
                </div>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$12</span>
                <span className="text-xs text-slate-450 font-medium">/ month</span>
              </div>
              <ul className="space-y-3.5 mb-8 text-xs text-slate-200 font-medium">
                <li className="flex items-center gap-2 text-[#4F9DFF]">
                  <CheckCircle2 className="w-4 h-4 text-[#4F9DFF] fill-[#4F9DFF]/5" />
                  <span className="font-semibold">Unlimited active itineraries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Neural Adaptive AI Planner</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Real-time weather routing arrays</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Active gate-monitoring telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Encrypted vault (10GB limit)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Direct co-traveler collaborations</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={onGetStarted}
              className="w-full glass-btn-primary py-3 text-xs font-bold"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="glass-card p-8 rounded-2xl text-left border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Enterprise</h3>
                  <p className="text-xs text-slate-450 mt-1">For corporate relocation & teams</p>
                </div>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$49</span>
                <span className="text-xs text-slate-450 font-medium">/ month</span>
              </div>
              <ul className="space-y-3.5 mb-8 text-xs text-slate-350 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>All features inside Pro tier</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Dedicated travel manager routing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Corporate tax compliance analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Custom API integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
                  <span>Unlimited encrypted secure vault</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={onGetStarted}
              className="w-full glass-btn py-3 text-xs font-bold"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="bg-[#07111F]/80 backdrop-blur-md border-t border-white/5 pt-20 pb-10 px-6 sm:px-12 text-left relative z-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-16 border-b border-white/5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#4F9DFF] to-[#7C6CF7] flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">TravelSync</span>
            </div>
            <p className="text-xs text-slate-450 leading-relaxed max-w-sm">
              Rebuilding travel planning parameters from scratch. Harnessing neural models to deliver zero-latency optimization for modern global explorers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition">
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition">
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Columns */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-450 font-medium">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Press Kit</a></li>
              <li><a href="#" className="hover:text-white transition">Venture News</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs text-slate-450 font-medium">
              <li><a href="#" className="hover:text-white transition">AI Models</a></li>
              <li><a href="#" className="hover:text-white transition">Telemetry Docs</a></li>
              <li><a href="#" className="hover:text-white transition">Aggregators</a></li>
              <li><a href="#" className="hover:text-white transition">SaaS Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs text-slate-450 font-medium">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Safety Guides</a></li>
              <li><a href="#" className="hover:text-white transition">SOS Registry</a></li>
              <li><a href="#" className="hover:text-white transition">Developer API</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Newsletter</h4>
            <p className="text-[11px] text-slate-450 leading-normal">
              Subscribe to get updates on seasonal climate shifts.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="name@email.com"
                className="w-full glass-input px-3 py-2 text-[11px] pr-9"
              />
              <button className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#4F9DFF] hover:bg-[#4F9DFF]/80 text-black rounded-lg transition flex items-center justify-center">
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="max-w-[1280px] mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-medium gap-4">
          <p>© 2026 TravelSync Inc. All capabilities registered.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-350 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-350 transition">Terms & Conditions</a>
            <a href="#" className="hover:text-slate-350 transition">Telemetry Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
