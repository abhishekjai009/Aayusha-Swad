import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  PackageCheck, 
  Award, 
  HeartHandshake 
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      title: 'Authentic Indian Taste',
      description: 'Heirloom family recipes from Eastern and Northern India passed down across three generations.',
      icon: <Sparkles className="w-6 h-6 text-brand-600" />
    },
    {
      title: 'Quality Ingredients',
      description: 'Prepared using 100% pure cow desi ghee, stone-milled whole wheat grains, and organic jaggery. Zero palm oil.',
      icon: <ShieldCheck className="w-6 h-6 text-brand-600" />
    },
    {
      title: 'Freshly Prepared',
      description: 'Slow-roasted and fresh-baked every 48 hours in small artisanal batches to preserve authentic crunch.',
      icon: <Flame className="w-6 h-6 text-brand-600" />
    },
    {
      title: 'Hygienically Packed',
      description: 'Multi-layer vacuum nitrogen sealed packaging keeping snacks fresh, crispy, and contamination-free.',
      icon: <PackageCheck className="w-6 h-6 text-brand-600" />
    },
    {
      title: 'Premium Quality',
      description: 'Every foxnut kernel and thekua piece is individually inspected for size, crispness, and aroma.',
      icon: <Award className="w-6 h-6 text-brand-600" />
    },
    {
      title: 'Made with Care',
      description: 'Crafted with the genuine love and affection of a traditional Indian mother’s kitchen.',
      icon: <HeartHandshake className="w-6 h-6 text-brand-600" />
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-warm-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-accent-600" />
            <span>The Aayusha Swad Promise</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Why Snack Lovers Across India Choose Us
          </h2>
          <p className="text-sm sm:text-base text-stone-500">
            We reject industrial shortcuts. We believe real food is made with uncompromised ingredients, pure desi ghee, and patience.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((item, index) => (
            <div
              key={item.title}
              className="group p-7 rounded-3xl bg-warm-cream/50 hover:bg-white border border-warm-border/80 hover:border-brand-300 shadow-xs hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-13 h-13 rounded-2xl bg-white group-hover:bg-brand-50 border border-warm-border group-hover:border-brand-200 flex items-center justify-center p-3 shadow-xs mb-5 transition-colors">
                {item.icon}
              </div>

              <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-brand-700 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 pt-3 border-t border-warm-border/50 text-[10px] font-bold text-stone-400 group-hover:text-brand-600 transition-colors uppercase tracking-widest">
                Pillar 0{index + 1}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
