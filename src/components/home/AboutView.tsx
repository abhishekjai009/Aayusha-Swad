import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ShieldCheck, Heart, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="py-12 sm:py-20 bg-[#FAFAF7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent-600" />
            <span>Artisanal Food Heritage</span>
          </div>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
            Our Journey of Authentic Flavor, Pure Ghee & Uncompromised Love
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Aayusha Swad was founded with a singular conviction: Traditional Indian snacks should never be compromised by chemical additives, palm oil, or industrial dilution.
          </p>
        </div>

        {/* Narrative & Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl overflow-hidden shadow-elevated border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop"
              alt="Traditional baking and frying in pure desi ghee"
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              The Sacred Purity of Indian Mithai & Namkeen
            </h2>
            <p>
              In traditional Indian homes, preparing snacks like <strong>Thekua</strong>, <strong>Makhana</strong>, and <strong>Namak Paare</strong> was not merely cooking — it was a celebration. Women would gather during Chhath Puja, Diwali, and Holi, kneading stone-milled wheat flour with pure cow ghee and fragrant green cardamom, using hand-carved wooden blocks to stamp intricate sacred symbols.
            </p>
            <p>
              When commercial factory snacks began substituting pure desi ghee with cheap hydrogenated vegetable oils and packing them with synthetic preservatives, the authentic taste and digestive lightness disappeared.
            </p>
            <p>
              At <strong>Aayusha Swad</strong>, we recreated the authentic ritual. We source small-batch Desi Cow Ghee, stone-ground chakki flour, mineral rock salt, and whole spices directly from rural farming clusters.
            </p>
          </div>
        </div>

        {/* 4 Guiding Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: '100% Desi Cow Ghee',
              desc: 'Never palm oil, never dalda, never refined seed oils.'
            },
            {
              title: 'Small Batch Roasted',
              desc: 'Prepared every 48 hours to ensure zero stale crunch.'
            },
            {
              title: 'Unrefined Sweeteners',
              desc: 'Organic Desi Gur (jaggery) and raw sulphur-free cane sugar.'
            },
            {
              title: 'Vacuum Packaging',
              desc: 'Nitrogen sealed pouches keeping every piece crispy for months.'
            }
          ].map((pillar) => (
            <div key={pillar.title} className="p-6 rounded-3xl bg-white border border-warm-border shadow-xs text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-brand-600 mx-auto" />
              <h3 className="font-serif font-bold text-sm text-stone-900">{pillar.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* Founder's Note */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFDF7] border border-amber-200/80 shadow-soft text-center max-w-3xl mx-auto space-y-4">
          <Heart className="w-8 h-8 text-brand-500 fill-brand-500 mx-auto" />
          <h3 className="font-serif font-bold text-xl text-stone-900">
            A Promise from Our Family to Yours
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
            "When you open a box of Aayusha Swad Thekua or Makhana, we want you to pause, close your eyes, and feel the gentle nostalgia of festive family gatherings. We cook with the very same love and uncompromising ingredients we feed our own children."
          </p>
          <div className="pt-2">
            <span className="font-serif font-bold text-sm text-stone-900 block">The Founders & Artisans</span>
            <span className="text-[11px] text-brand-700 font-semibold uppercase tracking-wider">Aayusha Swad Family Kitchen</span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-6">
          <button
            onClick={() => setCurrentView('shop')}
            className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-2xl shadow-soft hover:shadow-premium inline-flex items-center gap-2 transition-all"
          >
            <span>Explore Our Artisanal Snacks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
