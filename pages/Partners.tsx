
import React, { useState } from 'react';
import { PARTNERS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

type FilterType = 'All' | 'Corporate' | 'NGO' | 'Volunteer' | 'Government';

const Partners: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredPartners = filter === 'All' 
    ? PARTNERS 
    : PARTNERS.filter(p => p.type === filter);

  return (
    <div className="py-20 bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-comfort-blue mb-6">{t('partners.title')}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('partners.subtitle')}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {['All', 'NGO', 'Government', 'Corporate', 'Volunteer'].map((type) => {
             let label = t('partners.filter_all');
             if (type === 'NGO') label = t('partners.filter_ngo');
             if (type === 'Government') label = t('partners.filter_gov');
             if (type === 'Corporate') label = t('partners.filter_corp');
             if (type === 'Volunteer') label = t('partners.filter_vol');

             return (
              <button
                key={type}
                onClick={() => setFilter(type as FilterType)}
                className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${
                  filter === type 
                    ? 'bg-comfort-blue text-white shadow-lg transform scale-105' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-comfort-blue hover:text-comfort-blue'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center animate-in fade-in duration-500">
              <div className="h-32 w-full flex items-center justify-center mb-6 p-4 bg-gray-50 rounded-md overflow-hidden">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100 transform hover:scale-110"
                />
              </div>
              
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${
                partner.type === 'NGO' ? 'bg-green-100 text-green-700' :
                partner.type === 'Government' ? 'bg-purple-100 text-purple-700' :
                partner.type === 'Corporate' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {partner.type}
              </span>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{partner.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPartners.length === 0 && (
           <div className="text-center py-12 text-gray-400">
             <p>Aucun partenaire trouvé dans cette catégorie.</p>
           </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center bg-white p-12 border-t border-gray-100">
           <h3 className="text-2xl font-serif font-bold text-comfort-blue mb-4">{t('partners.become')}</h3>
           <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
             Vous souhaitez rejoindre notre réseau et contribuer à notre mission ? Contactez notre équipe de partenariats stratégiques.
           </p>
           <a 
            href="mailto:partenariat@comfort-asbl.org" 
            className="inline-block border-2 border-comfort-blue text-comfort-blue px-8 py-3 rounded-sm font-bold uppercase tracking-wide hover:bg-comfort-blue hover:text-white transition-colors"
           >
             {t('partners.contact_us')}
           </a>
        </div>
      </div>
    </div>
  );
};

export default Partners;
