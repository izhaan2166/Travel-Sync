import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plane, Map, Calendar, Clock, Shield, Share2, ChevronRight, 
  Brain, Globe, DollarSign, CloudSun, CreditCard, Coins, 
  ShieldAlert, BarChart3, LucideIcon 
} from 'lucide-react';

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  id: string;
  color: 'purple' | 'teal' | 'primary';
}

interface Props {
  onFeatureClick: (feature: string) => void;
  features?: FeatureItem[];
}

export const DEFAULT_FEATURES: FeatureItem[] = [
  { 
    icon: Plane, 
    title: 'Smart Booking', 
    desc: 'Real-time flight search & direct Google Flights comparison',
    id: 'smart-booking',
    color: 'primary'
  },
  { 
    icon: Map, 
    title: 'Interactive Maps', 
    desc: 'Visualize your entire journey and track weather routes',
    id: 'interactive-maps',
    color: 'teal'
  },
  { 
    icon: Calendar, 
    title: 'Dynamic Planning', 
    desc: 'Adaptive scheduling with intelligent ML recommendations',
    id: 'dynamic-planning',
    color: 'primary'
  },
  { 
    icon: Clock, 
    title: 'Real-Time Updates', 
    desc: 'Stay informed about changes and delays during the trip',
    id: 'real-time-updates',
    color: 'primary'
  },
  { 
    icon: Shield, 
    title: 'Secure Storage', 
    desc: 'Keep your digital travel documents safe and encrypted',
    id: 'secure-storage',
    color: 'primary'
  },
  { 
    icon: Share2, 
    title: 'Easy Sharing', 
    desc: 'Collaborate and share itineraries with co-travelers',
    id: 'easy-sharing',
    color: 'teal'
  }
];

export const PREMIUM_WELCOME_FEATURES: FeatureItem[] = [
  { 
    icon: Brain, 
    title: 'AI Trip Planner', 
    desc: 'Adaptive schedules built in seconds based on your travel personality.',
    color: 'primary',
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
    color: 'primary',
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
    color: 'primary',
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

export const FeatureGrid: React.FC<Props> = React.memo(({ onFeatureClick, features = DEFAULT_FEATURES }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
    >
      {features.map(({ icon: Icon, title, desc, id, color }) => (
        <motion.div
          key={title}
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="travel-card travel-card-hover p-6 cursor-pointer select-none text-left flex flex-col justify-between group h-full relative overflow-hidden"
          onClick={() => onFeatureClick(id)}
        >
          <div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 border transition duration-200 ${
              color === 'teal' 
                ? 'bg-[#00A896]/5 border-[#00A896]/15 text-[#00A896]' 
                : 'bg-[#0F3D91]/5 border-[#0F3D91]/15 text-[#0F3D91]'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F3D91] group-hover:text-[#00A896] transition duration-200 flex items-center gap-1.5 leading-tight">
              <span>{title}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#00A896]" />
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2.5 font-medium">{desc}</p>
          </div>
          <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">
            <span>Launch Tool</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]"></span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
});

FeatureGrid.displayName = 'FeatureGrid';
