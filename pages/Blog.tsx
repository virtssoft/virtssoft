
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, PARTNERS, CONTACT_INFO } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Mail, Phone, MapPin, Clock } from 'lucide-react';

type FilterType = 'All' | 'Corporate' | 'NGO' | 'Volunteer' | 'Government';

const Blog: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredPartners = filter === 'All' 
    ? PARTNERS 
    : PARTNERS.filter(p => p.type === filter);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      
      {/* 🟦 HEADER SECTION */}
      <section className="py-20 bg-gray-50">
         <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-comfort-blue mb-6 text-center">{t('blog_page.title')}</h1>
            <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">{t('blog_page.subtitle')}</p>
         </div>
      </section>

      {/* 🟩 1. BLOG GRID */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {BLOG_POSTS.map(post => (
                <div key={post.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="overflow-hidden h-56">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-8">
                    <div className="flex justify-between text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
                    <span>{post.date}</span>
                    <span className="text-comfort-blue">{post.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 hover:text-comfort-blue cursor-pointer transition-colors leading-snug">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">{post.excerpt}</p>
                    <Link to={`/blog/${post.id}`} className="text-comfort-blue font-bold text-sm uppercase hover:underline flex items-center">
                    {t('blog_page.read_more')} <ArrowRight size={14} className="ml-2"/>
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* 🟧 2. PARTNERS SECTION (Merged) */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-comfort-blue mb-6">{t('partners.title')}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{t('partners.subtitle')}</p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredPartners.map((partner) => (
                <div key={partner.id} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center">
                <div className="h-32 w-full flex items-center justify-center mb-6 p-4 bg-gray-50 rounded-md overflow-hidden">
                    <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100 transform hover:scale-110"
                    />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                <p className="text-gray-500 text-sm">{partner.description}</p>
                </div>
            ))}
            </div>
            
            <div className="text-center">
                <a 
                    href="mailto:partenariat@comfort-asbl.org" 
                    className="inline-block border-2 border-comfort-blue text-comfort-blue px-8 py-3 rounded-sm font-bold uppercase tracking-wide hover:bg-comfort-blue hover:text-white transition-colors"
                >
                    {t('partners.become')}
                </a>
            </div>
        </div>
      </section>

      {/* 🟦 3. CONTACT SECTION (Merged) */}
      <section className="py-24 bg-white border-t border-gray-100" id="contact-section">
        <div className="container mx-auto px-4 md:px-6">
           <div className="grid lg:grid-cols-2 gap-16">
              
              {/* Colonne Gauche - Info */}
              <div>
                 <h2 className="text-3xl font-serif font-bold text-comfort-blue mb-6">{t('contact.title')}</h2>
                 <p className="text-gray-600 mb-10 text-lg">
                   {t('contact.desc')}
                 </p>
                 
                 <div className="space-y-8">
                    <div className="flex items-start">
                       <MapPin className="text-comfort-blue mt-1 mr-6" size={28} strokeWidth={1.5} />
                       <div>
                          <h4 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-1">{t('contact.address')}</h4>
                          <p className="text-gray-600">{CONTACT_INFO.address}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-start">
                       <Mail className="text-comfort-blue mt-1 mr-6" size={28} strokeWidth={1.5} />
                       <div>
                          <h4 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-1">{t('contact.email')}</h4>
                          <p className="text-gray-600">{CONTACT_INFO.email}</p>
                       </div>
                    </div>

                    <div className="flex items-start">
                       <Phone className="text-comfort-blue mt-1 mr-6" size={28} strokeWidth={1.5} />
                       <div>
                          <h4 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-1">{t('contact.phone')}</h4>
                          <p className="text-gray-600">{CONTACT_INFO.phone}</p>
                       </div>
                    </div>

                    <div className="flex items-start">
                       <Clock className="text-comfort-blue mt-1 mr-6" size={28} strokeWidth={1.5} />
                       <div>
                          <h4 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-1">{t('contact.hours')}</h4>
                          <p className="text-gray-600">{CONTACT_INFO.hours}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Colonne Droite - Formulaire */}
              <div className="bg-gray-50 p-8 md:p-12 rounded-lg border border-gray-100 shadow-sm">
                 <h3 className="text-xl font-bold mb-8 text-gray-900">{t('contact.form_title')}</h3>
                 <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('contact.name')}</label>
                          <input type="text" className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-comfort-blue focus:outline-none transition-colors" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('contact.email')}</label>
                          <input type="email" className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-comfort-blue focus:outline-none transition-colors" />
                       </div>
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('contact.phone')}</label>
                       <input type="tel" className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-comfort-blue focus:outline-none transition-colors" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('contact.subject')}</label>
                       <select className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-comfort-blue focus:outline-none transition-colors text-gray-600">
                          <option>Renseignement général</option>
                          <option>Devenir bénévole</option>
                          <option>Partenariat</option>
                          <option>Presse</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('contact.message')}</label>
                       <textarea rows={5} className="w-full bg-white border border-gray-200 p-3 rounded-sm focus:border-comfort-blue focus:outline-none transition-colors"></textarea>
                    </div>
                    <button className="w-full bg-comfort-blue text-white font-bold py-4 rounded-sm uppercase tracking-wider hover:bg-[#001860] transition-colors shadow-lg">
                       {t('contact.send')}
                    </button>
                 </form>
              </div>

           </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
