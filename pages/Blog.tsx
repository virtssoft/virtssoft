
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from './constants';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { ArrowRight, Mail, Phone, MapPin, Clock, Facebook } from 'lucide-react';

const Blog: React.FC = () => {
  const { t } = useLanguage();
  const { blogPosts, partners, settings } = useData();

  // Use dynamic settings if available, fallback to constants
  const contactEmail = settings?.contactEmail || CONTACT_INFO.email;
  const contactPhone = settings?.contactPhone || CONTACT_INFO.phone;
  const contactAddress = settings?.contactAddress || CONTACT_INFO.address;

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
            {blogPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {blogPosts.map(post => (
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
            )}
        </div>
      </section>

      {/* 🟧 2. PARTNERS SECTION (Merged) */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-comfort-blue mb-6">{t('partners.title')}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{t('partners.subtitle')}</p>
            </div>

            {/* Partners Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {partners.map((partner) => (
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
                    href={`mailto:${contactEmail}`} 
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
                          <p className="text-gray-600">{contactAddress}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-start">
                       <Mail className="text-comfort-blue mt-1 mr-6" size={28} strokeWidth={1.5} />
                       <div>
                          <h4 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-1">{t('contact.email')}</h4>
                          <p className="text-gray-600">{contactEmail}</p>
                       </div>
                    </div>

                    <div className="flex items-start">
                       <Phone className="text-comfort-blue mt-1 mr-6" size={28} strokeWidth={1.5} />
                       <div>
                          <h4 className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-1">{t('contact.phone')}</h4>
                          <p className="text-gray-600">{contactPhone}</p>
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

                 {/* Google Maps Integrated */}
                 <div className="mt-10 h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.1161023288914!2d29.208470799999997!3d-1.6737250000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd0f26ed024195%3A0x41de59a10eb8289!2sHibaigle%20SAS!5e0!3m2!1sfr!2scd!4v1765191811649!5m2!1sfr!2scd" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Map"
                    ></iframe>
                 </div>
              </div>

              {/* Colonne Droite - Direct Contact Replacement */}
              <div className="bg-gray-50 p-8 md:p-12 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center text-center">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Préférez-vous un contact direct ?</h3>
                  <p className="text-gray-600 mb-8">
                      Nous n'utilisons pas de formulaires pour garantir une réponse plus rapide et personnelle. Écrivez-nous ou appelez-nous directement.
                  </p>
                  <div className="space-y-4">
                      <a href={`mailto:${contactEmail}`} className="block w-full bg-comfort-blue text-white font-bold py-4 rounded-sm uppercase tracking-wider hover:bg-[#001860] transition-colors shadow-lg flex items-center justify-center">
                          <Mail className="mr-2" size={20} />
                          Envoyer un Email
                      </a>
                      <a href={`tel:${contactPhone}`} className="block w-full bg-white text-comfort-blue border-2 border-comfort-blue font-bold py-4 rounded-sm uppercase tracking-wider hover:bg-blue-50 transition-colors shadow-sm flex items-center justify-center">
                          <Phone className="mr-2" size={20} />
                          Appeler : {contactPhone}
                      </a>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-4">Suivez nos actions au quotidien</p>
                      <div className="flex justify-center space-x-6">
                           <a href="https://x.com/AsblComfor44668" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-comfort-blue"><span className="sr-only">X</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                           <a href="https://www.facebook.com/photo/?fbid=122103347780826664&set=a.122103344876826664" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-comfort-blue"><Facebook size={24} /></a>
                      </div>
                  </div>
              </div>

           </div>
        </div>
      </section>

    </div>
  );
};

export default Blog;
