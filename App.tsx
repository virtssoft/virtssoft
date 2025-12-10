
import React from 'react';
import { HashRouter as Router, Routes, Route, useParams, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Donate from './pages/Donate';
import Projects from './pages/Projects';
import Blog from './pages/Blog'; // Consolidated Page
import Account from './pages/Account'; // New Page
import AdminDashboard from './pages/AdminDashboard'; // New Admin Page
import GenericPage from './pages/GenericPage';
import { PROJECTS, BLOG_POSTS } from './pages/constants';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ArrowLeft, Calendar, User } from 'lucide-react';

/* --- Inline Components for simpler pages --- */

const ProjectDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) return (
    <div className="py-20 text-center">
       <h1 className="text-2xl font-bold">{t('project_details.not_found')}</h1>
       <p>{t('project_details.not_found_text')}</p>
    </div>
  );

  return (
    <div className="py-20 bg-white">
       <div className="container mx-auto px-4 md:px-6 max-w-4xl">
         <div className="rounded-2xl overflow-hidden shadow-2xl mb-10">
            <img src={project.image} alt={project.title} className="w-full h-[400px] md:h-[500px] object-cover" />
         </div>
         <div className="flex items-center justify-between mb-6">
            <span className="bg-blue-50 text-comfort-blue px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border border-blue-100">{project.category}</span>
            <span className="text-gray-500 text-sm font-medium">{project.date}</span>
         </div>
         <h1 className="text-3xl md:text-5xl font-serif font-bold text-comfort-blue mb-8 leading-tight">{project.title}</h1>
         <div className="prose prose-lg text-gray-700 max-w-none mb-16 leading-relaxed">
           <p className="text-xl font-light text-gray-800 mb-6 border-l-4 border-comfort-blue pl-6">{project.description}</p>
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
           <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
         </div>
         
         <div className="bg-blue-50 p-10 rounded-2xl border border-blue-100 text-center shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">{t('project_details.support_title')}</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
                <div className="bg-green-500 h-4 rounded-full relative" style={{width: `${Math.min((project.raised / project.goal) * 100, 100)}%`}}>
                   <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                </div>
            </div>
            <p className="mb-8 text-xl font-medium text-gray-800">
              <span className="font-bold text-3xl text-comfort-blue">${project.raised.toLocaleString()}</span> {t('project_details.raised_of')} <span className="text-gray-500">${project.goal.toLocaleString()}</span>
            </p>
            <Link to="/donate" className="inline-block bg-comfort-blue text-white font-bold py-4 px-10 rounded-sm hover:bg-blue-900 transition-all uppercase tracking-widest shadow-lg hover:-translate-y-1">
              {t('project_details.donate_button')}
            </Link>
         </div>
       </div>
    </div>
  );
};

const BlogPostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = BLOG_POSTS.find(p => p.id === id);

    if (!post) return <div className="p-20 text-center">Article non trouvé</div>;

    return (
        <div className="py-20 bg-white font-sans">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-comfort-blue mb-8 transition-colors font-medium">
                    <ArrowLeft size={20} className="mr-2" /> Retour
                </button>

                <div className="mb-8">
                    <span className="bg-blue-50 text-comfort-blue px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4 inline-block">{post.category}</span>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
                    <div className="flex items-center text-gray-500 text-sm space-x-6">
                        <span className="flex items-center"><Calendar size={16} className="mr-2"/> {post.date}</span>
                        <span className="flex items-center"><User size={16} className="mr-2"/> {post.author}</span>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden mb-10 shadow-lg">
                    <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
                </div>

                <div className="prose prose-lg text-gray-700 leading-relaxed max-w-none">
                    <p className="font-bold text-xl text-gray-900 mb-6">{post.excerpt}</p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. 
                        Nullam ac odio et magna facilisis blandit. Nam nec nunc tellus. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, 
                        eget egestas libero turpis vel mi.
                    </p>
                    <p>
                        Proin tincidunt metus vel nunc tincidunt, a tempus diam facilisis. Sed lacinia, nisi sit amet condimentum cursus, massa justo placerat est, 
                        at elementum felis enim vitae nisi. Curabitur convallis, lacus in commodo tincidunt, urna turpis viverra magna, ut pretium ligula sem a dui.
                    </p>
                    <h3>Impact attendu</h3>
                    <p>
                        Suspendisse potenti. In hac habitasse platea dictumst. Vestibulum tristique sem id ligula accumsan, nec feugiat justo facilisis. 
                        Integer at lorem eget diam imperdiet efficitur.
                    </p>
                </div>
            </div>
        </div>
    );
};


const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center h-[70vh] text-center px-4 bg-gray-50">
      <div>
        <h1 className="text-9xl font-bold text-gray-200 mb-4 font-serif">{t('not_found.title')}</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('not_found.subtitle')}</h2>
        <p className="text-gray-500 mb-8 text-lg">{t('not_found.text')}</p>
        <a href="/" className="inline-block bg-comfort-blue text-white px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-blue-900 transition-colors">
          {t('not_found.back_home')}
        </a>
      </div>
    </div>
  );
};

const SearchResults = () => {
  const { t } = useLanguage();
  return (
    <GenericPage title={t('search.title')}>
      <p className="text-xl text-gray-600 mb-4">{t('search.placeholder')}</p>
      <div className="mt-4 p-6 bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-gray-500 italic">{t('search.hint')}</p>
      </div>
    </GenericPage>
  );
};

const AppRoutes = () => {
    // We separate this to allow Header/Footer logic conditional rendering if needed
    // But currently, the design implies AdminDashboard is a standalone page or has its own layout.
    // We'll wrap AdminDashboard without Header/Footer or let it handle its own full screen layout.
    
    return (
        <Routes>
            <Route path="/" element={<><Header /><Home /><Footer /></>} />
            <Route path="/about" element={<><Header /><About /><Footer /></>} />
            <Route path="/projects" element={<><Header /><Projects /><Footer /></>} />
            <Route path="/projects/:id" element={<><Header /><ProjectDetails /><Footer /></>} />
            <Route path="/blog" element={<><Header /><Blog /><Footer /></>} />
            <Route path="/blog/:id" element={<><Header /><BlogPostDetails /><Footer /></>} />
            <Route path="/donate" element={<><Header /><Donate /><Footer /></>} />
            <Route path="/account" element={<><Header /><Account /><Footer /></>} />
            
            {/* Admin Route - No public Header/Footer */}
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/privacy" element={<><Header /><GenericPage title="Politique de confidentialité"><p>Texte légal...</p></GenericPage><Footer /></>} />
            <Route path="/terms" element={<><Header /><GenericPage title="Conditions d'utilisation"><p>Mentions légales...</p></GenericPage><Footer /></>} />
            <Route path="/search" element={<><Header /><SearchResults /><Footer /></>} />
            <Route path="*" element={<><Header /><NotFound /><Footer /></>} />
        </Routes>
    )
}

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans antialiased text-gray-800">
            <AppRoutes />
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
