
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS, TESTIMONIALS } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const Projects: React.FC = () => {
  const { t } = useLanguage();
  
  // Testimonial Logic reused
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white">
      {/* HEADER */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-comfort-blue mb-4">{t('projects.title')}</h1>
            <p className="text-gray-600 text-lg">{t('projects.subtitle')}</p>
            </div>
        </div>
      </div>

      {/* PROJECTS GRID */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
                <div key={project.id} className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                    <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-comfort-blue rounded-full">
                    {project.status === 'Ongoing' ? t('projects.ongoing') : t('projects.completed')}
                    </span>
                </div>
                <div className="p-6">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">{project.category}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-comfort-blue transition-colors">
                    <Link to={`/projects/${project.id}`}>{project.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {project.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold mb-1 text-gray-500">
                        <span>${project.raised} {t('projects.raised')}</span>
                        <span>{t('projects.goal')}: ${project.goal}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                        className="bg-comfort-blue h-2 rounded-full" 
                        style={{width: `${Math.min((project.raised / project.goal) * 100, 100)}%`}}
                        ></div>
                    </div>
                    </div>

                    <Link 
                    to={`/projects/${project.id}`} 
                    className="block w-full text-center border border-comfort-blue text-comfort-blue py-2 rounded font-semibold hover:bg-comfort-blue hover:text-white transition-colors text-sm"
                    >
                    {t('projects.view_details')}
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </div>
      </div>

      {/* 🟧 TESTIMONIALS SECTION (Merged) */}
      <section className="py-24 bg-comfort-blue text-white relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
           <div className="max-w-4xl mx-auto text-center">
              <div className="mb-12">
                 <Heart className="mx-auto mb-6 text-white/80" size={48} />
                 <h2 className="text-3xl font-serif font-bold mb-2">{t('testimonials.title')}</h2>
              </div>

              <div className="relative min-h-[300px] flex items-center justify-center">
                 {/* Slider Content */}
                 <div className="px-8 md:px-16 animate-in fade-in duration-500 key={currentTestimonial}">
                    <p className="text-xl md:text-3xl font-serif leading-relaxed italic mb-8 opacity-90">
                      "{TESTIMONIALS[currentTestimonial].content}"
                    </p>
                    <div className="flex flex-col items-center justify-center">
                       <img 
                        src={TESTIMONIALS[currentTestimonial].image} 
                        alt={TESTIMONIALS[currentTestimonial].name} 
                        className="w-16 h-16 rounded-full border-2 border-white/30 object-cover mb-4"
                       />
                       <h4 className="font-bold text-lg">{TESTIMONIALS[currentTestimonial].name}</h4>
                       <span className="text-sm text-blue-200 uppercase tracking-widest">{TESTIMONIALS[currentTestimonial].role}</span>
                    </div>
                 </div>

                 {/* Controls */}
                 <button onClick={prevTestimonial} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block">
                    <ChevronLeft size={32} />
                 </button>
                 <button onClick={nextTestimonial} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block">
                    <ChevronRight size={32} />
                 </button>
                 
                 {/* Dots */}
                 <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex space-x-2">
                    {TESTIMONIALS.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentTestimonial(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${currentTestimonial === idx ? 'bg-white w-6' : 'bg-white/40'}`}
                      />
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
