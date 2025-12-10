
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, DollarSign, TrendingUp, Activity, Bell, Mail, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PROJECTS, BLOG_POSTS } from './constants';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    // Close window if opened via window.open, otherwise navigate back
    if (window.opener) {
        window.close();
    } else {
        navigate('/account');
    }
  };

  const renderContent = () => {
      switch(activeTab) {
        case 'emails':
          return (
              <div className="p-8">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex">
                      {/* Email Sidebar */}
                      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
                          <button className="w-full bg-comfort-blue text-white py-3 rounded-md font-bold mb-6 flex items-center justify-center shadow-md hover:bg-blue-900 transition-colors">
                              <Plus size={16} className="mr-2" /> {t('admin.compose')}
                          </button>
                          <nav className="space-y-1">
                              <a href="#" className="flex items-center px-3 py-2 text-gray-900 bg-white rounded-md border border-gray-200 font-medium">
                                  <Mail size={16} className="mr-3 text-gray-500" />
                                  {t('admin.inbox')} <span className="ml-auto bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs">2</span>
                              </a>
                              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium">
                                  <FileText size={16} className="mr-3 text-gray-500" />
                                  Drafts
                              </a>
                              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium">
                                  <Settings size={16} className="mr-3 text-gray-500" />
                                  Trash
                              </a>
                          </nav>
                      </div>
                      {/* Email List */}
                      <div className="flex-1">
                          <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50/50">
                             <h2 className="font-bold text-gray-800">{t('admin.webmail_title')}</h2>
                             <span className="text-sm text-gray-500">admin@comfort-asbl.com</span>
                          </div>
                          <div className="divide-y divide-gray-100">
                              <div className="p-4 hover:bg-blue-50 cursor-pointer transition-colors border-l-4 border-comfort-blue bg-blue-50/20">
                                  <div className="flex justify-between mb-1">
                                      <span className="font-bold text-gray-900">Fondation Virunga</span>
                                      <span className="text-xs text-gray-500">10:42 AM</span>
                                  </div>
                                  <p className="text-sm text-gray-800 font-medium mb-1">Proposition de partenariat 2024</p>
                                  <p className="text-xs text-gray-500 line-clamp-1">Bonjour, suite à notre conversation téléphonique, voici les documents...</p>
                              </div>
                              <div className="p-4 hover:bg-blue-50 cursor-pointer transition-colors border-l-4 border-transparent">
                                  <div className="flex justify-between mb-1">
                                      <span className="font-bold text-gray-900">Stripe Payments</span>
                                      <span className="text-xs text-gray-500">Yesterday</span>
                                  </div>
                                  <p className="text-sm text-gray-800 font-medium mb-1">Reçu de don #4458</p>
                                  <p className="text-xs text-gray-500 line-clamp-1">Un nouveau don de $500 a été reçu avec succès.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          );

        case 'users':
            return (
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Utilisateurs</h2>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[1,2,3,4,5].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Utilisateur {i}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">user{i}@example.com</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Donateur</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Actif</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-comfort-blue hover:text-blue-900 mr-3">Editer</button>
                                            <button className="text-red-600 hover:text-red-900">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        case 'content':
            return (
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Gestion du Contenu</h2>
                        <button className="bg-comfort-blue text-white px-4 py-2 rounded shadow hover:bg-blue-900 transition flex items-center">
                            <Plus size={16} className="mr-2" /> Nouveau Projet / Article
                        </button>
                    </div>
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Projets</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {PROJECTS.map(p => (
                                    <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <img src={p.image} className="w-12 h-12 object-cover rounded mr-4" alt="" />
                                            <div>
                                                <h4 className="font-bold">{p.title}</h4>
                                                <p className="text-xs text-gray-500">{p.status}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600"><Edit size={18}/></button>
                                            <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Articles de Blog</h3>
                             <div className="grid grid-cols-1 gap-4">
                                {BLOG_POSTS.map(b => (
                                    <div key={b.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                                        <div className="flex items-center">
                                             <div className="w-12 h-12 bg-gray-100 rounded mr-4 flex items-center justify-center text-gray-400"><FileText size={20}/></div>
                                            <div>
                                                <h4 className="font-bold">{b.title}</h4>
                                                <p className="text-xs text-gray-500">{b.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600"><Edit size={18}/></button>
                                            <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'finances':
            return (
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Finances & Dons</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                            <p className="text-gray-500 text-sm uppercase">Total Collecté (2024)</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">$124,500</h3>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <p className="text-gray-500 text-sm uppercase">Don Moyen</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">$85</h3>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                            <p className="text-gray-500 text-sm uppercase">Nouveaux Donateurs</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">142</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="font-bold">Transactions Récentes</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donateur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 text-sm text-gray-500">#TRX-9982</td>
                                    <td className="px-6 py-4 text-sm font-medium">Jean K.</td>
                                    <td className="px-6 py-4 text-sm font-bold text-green-600">$50.00</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">12 Oct 2024</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Succès</span></td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 text-sm text-gray-500">#TRX-9981</td>
                                    <td className="px-6 py-4 text-sm font-medium">Sophie M.</td>
                                    <td className="px-6 py-4 text-sm font-bold text-green-600">$200.00</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">11 Oct 2024</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Succès</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        case 'settings':
            return (
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Paramètres Généraux</h2>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom du Site</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" defaultValue="COMFORT Asbl" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email de Contact</label>
                                <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" defaultValue="contact@comfort-asbl.org" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" defaultValue="+243 999 000 000" />
                            </div>
                            <div className="flex items-center justify-between py-4 border-t border-gray-100">
                                <div>
                                    <h4 className="font-medium text-gray-900">Mode Maintenance</h4>
                                    <p className="text-sm text-gray-500">Mettre le site hors ligne temporairement.</p>
                                </div>
                                <button type="button" className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                                    <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                </button>
                            </div>
                             <div className="pt-4">
                                <button className="bg-comfort-blue text-white px-6 py-2 rounded shadow hover:bg-blue-900 transition">Sauvegarder</button>
                            </div>
                        </form>
                    </div>
                </div>
            );

        default: // dashboard
            return (
                <div className="p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('admin.total_donations')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">$124,500</h3>
                            </div>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign size={20} />
                            </div>
                        </div>
                        <span className="text-xs text-green-600 font-bold flex items-center"><TrendingUp size={12} className="mr-1"/> +12%</span>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('admin.users')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">2,340</h3>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Users size={20} />
                            </div>
                        </div>
                        <span className="text-xs text-blue-600 font-bold flex items-center"><TrendingUp size={12} className="mr-1"/> +5%</span>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('admin.active_projects')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">12</h3>
                            </div>
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Activity size={20} />
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">3 terminés</span>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Webmail</p>
                            <h3 className="text-2xl font-bold text-gray-900">2</h3>
                            </div>
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Mail size={20} />
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">Nouveaux messages</span>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">{t('admin.recent_activity')}</h3>
                        <button className="text-sm text-comfort-blue font-medium hover:underline">{t('admin.view_all')}</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">{t('admin.user')}</th>
                                <th className="px-6 py-3">{t('admin.action')}</th>
                                <th className="px-6 py-3">{t('admin.date')}</th>
                                <th className="px-6 py-3">{t('admin.status')}</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Jean Dupont</td>
                                <td className="px-6 py-4">Nouveau don de $50</td>
                                <td className="px-6 py-4 text-gray-500">Aujourd'hui, 10:30</td>
                                <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Complété</span></td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Marie Claire</td>
                                <td className="px-6 py-4">Inscription bénévole</td>
                                <td className="px-6 py-4 text-gray-500">Hier, 14:15</td>
                                <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">En attente</span></td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Paul Martin</td>
                                <td className="px-6 py-4">Commentaire sur "École Masisi"</td>
                                <td className="px-6 py-4 text-gray-500">Hier, 09:00</td>
                                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">Approuvé</span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
            )
      }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-comfort-blue text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-blue-900">
           <h2 className="text-2xl font-serif font-bold tracking-tight">COMFORT <span className="text-xs font-sans opacity-70 block">{t('admin.panel_title')}</span></h2>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-4">
           <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <LayoutDashboard size={20} className="mr-3" />
              {t('admin.dashboard')}
           </button>
           <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'users' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <Users size={20} className="mr-3" />
              {t('admin.users')}
           </button>
           <button onClick={() => setActiveTab('emails')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'emails' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <Mail size={20} className="mr-3" />
              {t('admin.emails')}
           </button>
           <button onClick={() => setActiveTab('content')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'content' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <FileText size={20} className="mr-3" />
              {t('admin.content')}
           </button>
           <button onClick={() => setActiveTab('finances')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'finances' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <DollarSign size={20} className="mr-3" />
              {t('admin.finances')}
           </button>
           <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <Settings size={20} className="mr-3" />
              {t('admin.settings')}
           </button>
        </nav>

        <div className="p-4 border-t border-blue-900">
           <button onClick={handleLogout} className="flex items-center text-blue-200 hover:text-white transition-colors w-full">
              <LogOut size={20} className="mr-3" />
              {t('admin.logout')}
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-10">
           <h1 className="text-xl font-bold text-gray-800">
             {activeTab === 'emails' ? t('admin.webmail_title') : 
              activeTab === 'dashboard' ? t('admin.overview') :
              activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
           </h1>
           <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-comfort-blue transition-colors relative">
                 <Bell size={20} />
                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-comfort-blue text-white flex items-center justify-center font-bold">A</div>
           </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
