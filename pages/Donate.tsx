
import React, { useState } from 'react';
import { Heart, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Donate: React.FC = () => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount(null);
  };

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-comfort-blue mb-4">{t('donate.title')}</h1>
          <p className="text-xl text-gray-600">{t('donate.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Heart className="text-red-500 mr-2" fill="currentColor" size={20} />
              {t('donate.choose_amount')}
            </h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[10, 25, 50, 100, 250, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => { setAmount(val); setCustomAmount(''); }}
                  className={`py-3 rounded border font-semibold transition-all ${
                    amount === val 
                      ? 'bg-comfort-blue text-white border-comfort-blue' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-comfort-blue'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('donate.other_amount')}</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500">$</span>
                <input 
                  type="number" 
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-comfort-blue focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold mb-6">{t('donate.your_info')}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder={t('donate.firstname')} className="border p-3 rounded" />
              <input type="text" placeholder={t('donate.lastname')} className="border p-3 rounded" />
            </div>
            <input type="email" placeholder={t('donate.email_placeholder')} className="border p-3 rounded w-full mb-6" />

            <button className="w-full bg-comfort-blue text-white text-lg font-bold py-4 rounded hover:bg-blue-900 transition-colors shadow-lg">
              {t('donate.button')} ${amount || customAmount || '0'}
            </button>
            
            <p className="text-xs text-gray-400 mt-4 flex items-center justify-center">
              <Lock size={12} className="mr-1" /> {t('donate.secure')}
            </p>
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-1">
             <div className="bg-blue-900 text-white p-6 rounded-lg shadow-lg mb-6">
               <h3 className="font-bold text-lg mb-2">{t('donate.why_give')}</h3>
               <ul className="space-y-3 text-blue-100 text-sm">
                 <li className="flex items-start">
                   <span className="mr-2">•</span> $25 fournit des kits scolaires pour 5 enfants.
                 </li>
                 <li className="flex items-start">
                   <span className="mr-2">•</span> $100 finance des soins médicaux d'urgence.
                 </li>
                 <li className="flex items-start">
                   <span className="mr-2">•</span> $500 aide à construire un puits communautaire.
                 </li>
               </ul>
             </div>
             
             <div className="bg-white p-6 rounded-lg border border-gray-200">
               <h3 className="font-bold text-gray-800 mb-2">{t('donate.help')}</h3>
               <p className="text-sm text-gray-600 mb-4">Contactez notre équipe de relations donateurs.</p>
               <a href="mailto:donations@comfort-asbl.org" className="text-comfort-blue text-sm font-semibold hover:underline">donations@comfort-asbl.org</a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
