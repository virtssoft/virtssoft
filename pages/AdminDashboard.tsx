
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, DollarSign, Activity, Bell, Mail, Plus, Edit, Trash2, Handshake, Briefcase, X, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext'; 
import { useAuth } from '../context/AuthContext'; // Security Check
import { api } from '../services/api';
import { Project, BlogPost, Partner } from '../types';

/* --- GENERIC MODAL COMPONENT --- */
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave: () => void;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onSave }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                <div className="p-6 space-y-4">
                    {children}
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Annuler</button>
                    <button onClick={onSave} className="px-4 py-2 bg-comfort-blue text-white rounded hover:bg-blue-900 flex items-center">
                        <Check size={16} className="mr-2"/> Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
}

/* --- FORM FIELD COMPONENT --- */
const FormField = ({ label, value, onChange, type = "text", options = [] }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {type === 'textarea' ? (
            <textarea className="w-full border border-gray-300 rounded p-2 focus:ring-comfort-blue focus:border-comfort-blue" rows={4} value={value} onChange={e => onChange(e.target.value)} />
        ) : type === 'select' ? (
             <select className="w-full border border-gray-300 rounded p-2 focus:ring-comfort-blue focus:border-comfort-blue" value={value} onChange={e => onChange(e.target.value)}>
                 {options.map((opt:string) => <option key={opt} value={opt}>{opt}</option>)}
             </select>
        ) : (
            <input type={type} className="w-full border border-gray-300 rounded p-2 focus:ring-comfort-blue focus:border-comfort-blue" value={value} onChange={e => onChange(e.target.value)} />
        )}
    </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // We use local state for admin data manipulation to reflect CRUD immediately
  const { projects: initialProjects, blogPosts: initialBlogs, partners: initialPartners } = useData();
  const { user, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Local Data State
  const [users, setUsers] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project'|'blog'|'partner'|'user'>('project');
  const [editingItem, setEditingItem] = useState<any>(null); // null = create mode

  // Security Check
  useEffect(() => {
     if (!isAuthenticated || user?.role !== 'superadmin') {
         const timer = setTimeout(() => {
             if (!isAuthenticated) navigate('/account');
         }, 500);
         return () => clearTimeout(timer);
     }
  }, [isAuthenticated, user, navigate]);

  // Initial Data Load
  useEffect(() => {
    if (isAuthenticated && user?.role === 'superadmin') {
        const fetchAdminData = async () => {
            const [fetchedUsers, fetchedDonations] = await Promise.all([
                api.getUsers(),
                api.getDonations()
            ]);
            setUsers(fetchedUsers);
            setDonations(fetchedDonations);
            setProjects(initialProjects);
            setBlogs(initialBlogs);
            setPartners(initialPartners);
        };
        fetchAdminData();
    }
  }, [isAuthenticated, user, initialProjects, initialBlogs, initialPartners]);

  const handleLogout = () => {
    logout(); 
    if (window.history.length > 1) window.close();
    else navigate('/');
  };

  /* --- CRUD HANDLERS --- */
  const handleEdit = (type: 'project'|'blog'|'partner'|'user', item: any) => {
      setModalType(type);
      setEditingItem(item);
      setIsModalOpen(true);
  };

  const handleCreate = (type: 'project'|'blog'|'partner'|'user') => {
      setModalType(type);
      setEditingItem({}); // Empty object for create
      setIsModalOpen(true);
  };

  const handleDelete = async (type: string, id: string) => {
      if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
      
      await api.deleteItem(type, id);
      
      // Optimistic UI update
      if (type === 'project') setProjects(prev => prev.filter(p => p.id !== id));
      if (type === 'blog') setBlogs(prev => prev.filter(b => b.id !== id));
      if (type === 'partner') setPartners(prev => prev.filter(p => p.id !== id));
      if (type === 'user') setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleSaveModal = async () => {
      // Mock Save Logic
      const isNew = !editingItem.id;
      const newItem = { ...editingItem, id: editingItem.id || Math.random().toString(36).substr(2, 9) };

      if (modalType === 'project') {
          setProjects(prev => isNew ? [...prev, newItem] : prev.map(p => p.id === newItem.id ? newItem : p));
      } else if (modalType === 'blog') {
          setBlogs(prev => isNew ? [...prev, newItem] : prev.map(b => b.id === newItem.id ? newItem : b));
      } else if (modalType === 'partner') {
          setPartners(prev => isNew ? [...prev, newItem] : prev.map(p => p.id === newItem.id ? newItem : p));
      } else if (modalType === 'user') {
          setUsers(prev => isNew ? [...prev, newItem] : prev.map(u => u.id === newItem.id ? newItem : u));
      }

      await api.createItem(modalType, newItem); // Fire and forget for demo
      setIsModalOpen(false);
  };

  /* --- RENDER HELPERS --- */
  if (!isAuthenticated || user?.role !== 'superadmin') return <div className="p-10 text-center">Chargement...</div>;

  const renderModalContent = () => {
      if (modalType === 'project') {
          return (
              <>
                <FormField label="Titre" value={editingItem.title || ''} onChange={(v:string) => setEditingItem({...editingItem, title: v})} />
                <FormField label="Catégorie" value={editingItem.category || ''} onChange={(v:string) => setEditingItem({...editingItem, category: v})} />
                <FormField label="Description" type="textarea" value={editingItem.description || ''} onChange={(v:string) => setEditingItem({...editingItem, description: v})} />
                <FormField label="Status" type="select" options={['Ongoing', 'Completed']} value={editingItem.status || 'Ongoing'} onChange={(v:string) => setEditingItem({...editingItem, status: v})} />
                <FormField label="Image URL" value={editingItem.image || ''} onChange={(v:string) => setEditingItem({...editingItem, image: v})} />
              </>
          );
      }
      if (modalType === 'blog') {
        return (
            <>
              <FormField label="Titre" value={editingItem.title || ''} onChange={(v:string) => setEditingItem({...editingItem, title: v})} />
              <FormField label="Extrait" type="textarea" value={editingItem.excerpt || ''} onChange={(v:string) => setEditingItem({...editingItem, excerpt: v})} />
              <FormField label="Auteur" value={editingItem.author || ''} onChange={(v:string) => setEditingItem({...editingItem, author: v})} />
              <FormField label="Date" value={editingItem.date || ''} onChange={(v:string) => setEditingItem({...editingItem, date: v})} />
              <FormField label="Catégorie" value={editingItem.category || ''} onChange={(v:string) => setEditingItem({...editingItem, category: v})} />
            </>
        );
      }
      if (modalType === 'partner') {
          return (
              <>
                <FormField label="Nom" value={editingItem.name || ''} onChange={(v:string) => setEditingItem({...editingItem, name: v})} />
                <FormField label="Description" type="textarea" value={editingItem.description || ''} onChange={(v:string) => setEditingItem({...editingItem, description: v})} />
                <FormField label="Type" type="select" options={['Corporate', 'NGO', 'Government', 'Volunteer']} value={editingItem.type || 'Corporate'} onChange={(v:string) => setEditingItem({...editingItem, type: v})} />
                <FormField label="Logo URL" value={editingItem.logo || ''} onChange={(v:string) => setEditingItem({...editingItem, logo: v})} />
              </>
          );
      }
      if (modalType === 'user') {
          return (
              <>
                <FormField label="Username" value={editingItem.username || ''} onChange={(v:string) => setEditingItem({...editingItem, username: v})} />
                <FormField label="Email" value={editingItem.email || ''} onChange={(v:string) => setEditingItem({...editingItem, email: v})} />
                <FormField label="Role" type="select" options={['user', 'admin', 'superadmin']} value={editingItem.role || 'user'} onChange={(v:string) => setEditingItem({...editingItem, role: v})} />
              </>
          );
      }
      return null;
  }

  const renderContent = () => {
      switch(activeTab) {
        case 'dashboard':
            return (
                <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('admin.total_donations')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">${donations.reduce((acc, curr) => acc + parseFloat(curr.montant), 0).toFixed(0)}</h3>
                            </div>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('admin.users')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('admin.active_projects')}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{projects.length}</h3>
                            </div>
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Briefcase size={20} /></div>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Partenaires</p>
                            <h3 className="text-2xl font-bold text-gray-900">{partners.length}</h3>
                            </div>
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Handshake size={20} /></div>
                        </div>
                    </div>
                </div>
                </div>
            );
        case 'users':
            return (
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                         <button onClick={() => handleCreate('user')} className="bg-comfort-blue text-white px-4 py-2 rounded shadow flex items-center"><Plus size={16} className="mr-2"/> Ajouter</button>
                    </div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit('user', user)} className="text-comfort-blue hover:text-blue-900 mr-3"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete('user', user.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
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
                <div className="p-8 space-y-12">
                    {/* Projects Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-700">Projets (Actions)</h3>
                            <button onClick={() => handleCreate('project')} className="bg-comfort-blue text-white px-3 py-1.5 rounded text-sm flex items-center"><Plus size={14} className="mr-1"/> Nouveau Projet</button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Titre</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Status</th><th className="px-6 py-3 text-right text-xs uppercase text-gray-500">Actions</th></tr></thead>
                                <tbody className="divide-y divide-gray-200">
                                    {projects.map(p => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{p.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500"><span className={`px-2 py-1 rounded text-xs ${p.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{p.status}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleEdit('project', p)} className="text-blue-600 hover:text-blue-900 mr-2"><Edit size={16}/></button>
                                                <button onClick={() => handleDelete('project', p.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Blog Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-700">Articles de Blog</h3>
                            <button onClick={() => handleCreate('blog')} className="bg-comfort-blue text-white px-3 py-1.5 rounded text-sm flex items-center"><Plus size={14} className="mr-1"/> Nouvel Article</button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Titre</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Auteur</th><th className="px-6 py-3 text-right text-xs uppercase text-gray-500">Actions</th></tr></thead>
                                <tbody className="divide-y divide-gray-200">
                                    {blogs.map(b => (
                                        <tr key={b.id}>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{b.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{b.author}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleEdit('blog', b)} className="text-blue-600 hover:text-blue-900 mr-2"><Edit size={16}/></button>
                                                <button onClick={() => handleDelete('blog', b.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );

        case 'partners':
            return (
                 <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Nos Partenaires</h2>
                        <button onClick={() => handleCreate('partner')} className="bg-comfort-blue text-white px-4 py-2 rounded shadow flex items-center"><Plus size={16} className="mr-2" /> Ajouter</button>
                    </div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Nom</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Type</th><th className="px-6 py-3 text-right text-xs uppercase text-gray-500">Actions</th></tr></thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {partners.map((p) => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                            <img src={p.logo} alt="" className="w-8 h-8 rounded mr-3 object-contain border"/>
                                            {p.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit('partner', p)} className="text-comfort-blue hover:text-blue-900 mr-3"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete('partner', p.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        case 'finances':
            return (
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Finances & Dons</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                            <p className="text-gray-500 text-sm uppercase">Total Collecté</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">${donations.reduce((acc, curr) => acc + parseFloat(curr.montant), 0).toFixed(2)}</h3>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <p className="text-gray-500 text-sm uppercase">Nombre de Dons</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{donations.length}</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="font-bold">Historique des Transactions</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donateur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {donations.map((d) => (
                                    <tr key={d.id}>
                                        <td className="px-6 py-4 text-sm font-medium">{d.donateur_nom}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-green-600">${d.montant}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{d.methode}</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">{d.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case 'emails':
          return (
              <div className="p-8">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[500px] flex">
                      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
                          <button className="w-full bg-comfort-blue text-white py-3 rounded-md font-bold mb-6 flex items-center justify-center shadow-md hover:bg-blue-900 transition-colors">
                              <Plus size={16} className="mr-2" /> {t('admin.compose')}
                          </button>
                          <nav className="space-y-1">
                              <a href="#" className="flex items-center px-3 py-2 text-gray-900 bg-white rounded-md border border-gray-200 font-medium">
                                  <Mail size={16} className="mr-3 text-gray-500" />
                                  {t('admin.inbox')} <span className="ml-auto bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs">2</span>
                              </a>
                          </nav>
                      </div>
                      <div className="flex-1">
                          <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50/50">
                             <h2 className="font-bold text-gray-800">{t('admin.webmail_title')}</h2>
                             <span className="text-sm text-gray-500">admin@comfort-asbl.com</span>
                          </div>
                          <div className="p-8 text-center text-gray-500">Simulated Webmail Interface</div>
                      </div>
                  </div>
              </div>
          );
        default: return null;
      }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem?.id ? "Modifier" : "Créer"} onSave={handleSaveModal}>
          {editingItem && renderModalContent()}
      </Modal>

      {/* SIDEBAR */}
      <aside className="w-64 bg-comfort-blue text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-blue-900">
           <h2 className="text-2xl font-serif font-bold tracking-tight">COMFORT <span className="text-xs font-sans opacity-70 block">{t('admin.panel_title')}</span></h2>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-4">
           <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <LayoutDashboard size={20} className="mr-3" /> {t('admin.dashboard')}
           </button>
           <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'users' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <Users size={20} className="mr-3" /> {t('admin.users')}
           </button>
           <button onClick={() => setActiveTab('partners')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'partners' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <Handshake size={20} className="mr-3" /> Partenaires
           </button>
           <button onClick={() => setActiveTab('content')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'content' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <FileText size={20} className="mr-3" /> {t('admin.content')}
           </button>
           <button onClick={() => setActiveTab('finances')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'finances' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <DollarSign size={20} className="mr-3" /> {t('admin.finances')}
           </button>
           <button onClick={() => setActiveTab('emails')} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors ${activeTab === 'emails' ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800'}`}>
              <Mail size={20} className="mr-3" /> {t('admin.emails')}
           </button>
        </nav>

        <div className="p-4 border-t border-blue-900">
           <button onClick={handleLogout} className="flex items-center text-blue-200 hover:text-white transition-colors w-full">
              <LogOut size={20} className="mr-3" /> {t('admin.logout')}
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-10">
           <h1 className="text-xl font-bold text-gray-800 capitalize">{activeTab}</h1>
           <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-comfort-blue transition-colors relative"><Bell size={20} /></button>
              <div className="h-8 w-8 rounded-full bg-comfort-blue text-white flex items-center justify-center font-bold">
                  {user?.username.charAt(0).toUpperCase() || 'A'}
              </div>
           </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
