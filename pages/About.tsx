
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DOMAINS, TEAM_MEMBERS, PARTNERS, CONTACT_INFO } from '../constants';
import { Heart, BookOpen, HandCoins, Wheat, Palette, Shield, Activity, TrendingUp, Users, MapPin, Mail, Phone, Clock, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useLanguage();

  const getIcon = (iconName: string, size = 32) => {
    switch (iconName) {
      case 'Heart': return <Heart size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'HandCoins': return <HandCoins size={size} />;
      case 'Wheat': return <Wheat size={size} />;
      case 'Palette': return <Palette size={size} />;
      default: return <Heart size={size} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      
      {/* 🟦 1. HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/humanitarian/1920/1080" 
            alt="Humanitarian Work" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-comfort-blue/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center animate-in fade-in duration-1000">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-md">
            {t('about_page.hero_title')}
          </h1>
          <p className="text-lg md:text-2xl text-blue-50 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-sm">
            {t('about_page.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* 🟩 2. QUI SOMMES-NOUS ? */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="prose prose-lg text-gray-600">
              <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-8">{t('about_page.who_title')}</h2>
              <p className="leading-loose text-lg text-gray-700">
                {t('about_page.who_text')}
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gray-100 rounded-2xl transform rotate-2 group-hover:rotate-1 transition-all duration-500"></div>
              <img 
                src="https://picsum.photos/seed/community2/800/1000" 
                alt="Community Support" 
                className="relative z-10 rounded-2xl shadow-xl w-full object-cover h-[500px] transform group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🟦 3. VISION */}
      <section className="py-24 bg-comfort-blue text-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-10">{t('about_page.vision_title')}</h2>
          <p className="text-xl md:text-2xl leading-relaxed font-light text-blue-50 opacity-90 whitespace-pre-line">
            {t('about_page.vision_text')}
          </p>
        </div>
      </section>

      {/* 🟧 4. MISSION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center max-w-4xl">
          <div className="bg-blue-50 p-6 rounded-full text-comfort-blue mb-8">
             <Activity size={48} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-comfort-blue mb-8">{t('about_page.mission_title')}</h2>
          <p className="text-xl leading-relaxed text-gray-700">
            {t('about_page.mission_text')}
          </p>
        </div>
      </section>

      {/* 🟫 5. OBJECTIFS STRATEGIQUES */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-serif font-bold text-comfort-blue mb-4">{t('about_page.objectives_title')}</h2>
             <p className="text-gray-600">{t('about_page.objectives_intro')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {/* Card 1 */}
             <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <Shield className="text-comfort-blue mb-6 group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about_page.obj_1_title')}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t('about_page.obj_1_text')}</p>
             </div>
             {/* Card 2 */}
             <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <Heart className="text-comfort-blue mb-6 group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about_page.obj_2_title')}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t('about_page.obj_2_text')}</p>
             </div>
             {/* Card 3 */}
             <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <TrendingUp className="text-comfort-blue mb-6 group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about_page.obj_3_title')}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t('about_page.obj_3_text')}</p>
             </div>
             {/* Card 4 */}
             <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <Users className="text-comfort-blue mb-6 group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('about_page.obj_4_title')}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t('about_page.obj_4_text')}</p>
             </div>
          </div>
        </div>
      </section>

      {/* 🟦 6. DOMAINES D'INTERVENTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-comfort-blue mb-4">{t('domains.title')}</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm font-medium">{t('domains.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
             {DOMAINS.map((domain) => (
               <div key={domain.id} className="group flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-gray-50">
                  <div className="h-20 w-20 rounded-full border border-gray-100 flex items-center justify-center mb-6 text-comfort-blue group-hover:bg-comfort-blue group-hover:text-white transition-all shadow-sm">
                     {getIcon(domain.icon, 32)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-comfort-blue transition-colors">{t(`domains.${domain.id}.title`)}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed opacity-80 group-hover:opacity-100">
                    {t(`domains.${domain.id}.desc`)}
                  </p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 🟩 7. NOTRE APPROCHE */}
      <section className="py-24 bg-blue-50/50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-comfort-blue mb-8">{t('about_page.approach_title')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                 {t('about_page.approach_text')}
              </p>
              <img src="https://picsum.photos/seed/planning/600/400" alt="Approach" className="rounded-xl shadow-lg w-full" />
            </div>

            <div className="space-y-0 relative pl-8 border-l-2 border-comfort-blue/20">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="relative pb-12 last:pb-0">
                  <span className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-comfort-blue text-white text-xs font-bold ring-4 ring-white">
                    {step}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t(`about_page.step_${step}`)}</h3>
                  <p className="text-gray-500 text-sm">Phase {step} du cycle de projet</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🟦 8. NOTRE EQUIPE */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-comfort-blue mb-4">{t('about_page.team_title')}</h2>
            <p className="text-gray-500">{t('about_page.team_desc')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="flex flex-col items-center text-center group">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-gray-50 group-hover:border-comfort-blue transition-colors shadow-lg">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <span className="text-comfort-blue text-sm font-bold uppercase tracking-wide mb-3">{member.role}</span>
                <p className="text-sm text-gray-500 leading-relaxed px-4">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🟧 9. PARTENAIRES (Blue BG) */}
      <section className="py-16 bg-comfort-blue overflow-hidden">
         <div className="container mx-auto px-4 mb-10 text-center">
             <h3 className="text-xl font-serif font-bold text-white uppercase tracking-widest opacity-80">{t('about_page.partners_title')}</h3>
         </div>
         <div className="w-full relative">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
              <div className="flex shrink-0 items-center justify-around gap-12 md:gap-16 px-4">
                {PARTNERS.map((partner) => (
                    <div key={`ab-p1-${partner.id}`} className="w-32 md:w-48 flex items-center justify-center shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                        <img 
                            src={partner.logo} 
                            alt={partner.name} 
                            className="max-h-16 w-auto object-contain brightness-0 invert"
                        />
                    </div>
                ))}
              </div>
              <div className="flex shrink-0 items-center justify-around gap-12 md:gap-16 px-4">
                {PARTNERS.map((partner) => (
                    <div key={`ab-p2-${partner.id}`} className="w-32 md:w-48 flex items-center justify-center shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                        <img 
                            src={partner.logo} 
                            alt={partner.name} 
                            className="max-h-16 w-auto object-contain brightness-0 invert"
                        />
                    </div>
                ))}
              </div>
            </div>
         </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
         `}</style>
      </section>

      {/* 🟩 10. SECTION CONTACT (Integrated) */}
      <section className="py-24 bg-white" id="contact-section">
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

export default About;
