
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, DollarSign, Activity, Bell, Mail, Plus, Edit, Trash2, Handshake, Briefcase, X, Check, Eye, UploadCloud, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api, ApiUser, ApiAction, ApiArticle, ApiDonation, ApiPartner } from '../services/api';

/* --- IMAGE UPLOAD COMPONENT --- */
interface ImageUploadProps {
    label: string;
    value: string;
    folder: string;
    onChange: (path: string) => void;
}

const ImageUploader: React.FC<ImageUploadProps> = ({ label, value, folder, onChange }) => {
    const [uploading, setUploading] = useState(false);
    
    // Determine preview URL (handle relative vs absolute)
    const previewUrl = value 
        ? (value.startsWith('http') ? value : `http://localhost/api/${value}`) 
        : null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            const file = e.target.files[0];
            
            // Appel API pour upload
            const result = await api.uploadFile(file, folder);
            
            setUploading(false);
            if (result.success && result.path) {
                // Le serveur doit renvoyer ex: "assets/images/actions/monfichier.jpg"
                onChange(result.path);
            } else {
                alert("Erreur lors de l'upload : " + (result.error || "Inconnue"));
            }
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                {previewUrl ? (
                    <div className="relative w-full h-32 mb-3 group">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                            <span className="text-white text-xs font-bold">Changer l'image</span>
                        </div>
                    </div>
                ) : (
                    <UploadCloud className="text-gray-400 mb-2" size={32} />
                )}
                
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />
                
                <p className="text-xs text-gray-500 font-medium">
                    {uploading ? "Téléversement..." : (value ? "Cliquez pour remplacer" : "Cliquez ou glissez une image")}
                </p>
                {value && <p className="text-[10px] text-gray-400 mt-1 truncate w-full text-center">{value}</p>}
            </div>
        </div>
    );
};

/* --- MODAL COMPONENT --- */
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                <div className="p-6 space-y-4">
                    {children}
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors font-medium">Annuler</button>
                    <button onClick={onSave} className="px-4 py-2 bg-comfort-blue text-white rounded hover:bg-blue-900 flex items-center transition-colors shadow-md font-bold">
                        <Check size={16} className="mr-2"/> Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
}

/* --- FIELD HELPER --- */
const FormField = ({ label, value, onChange, type = "text", options = [] }: any) => (
    <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
        {type === 'textarea' ? (
            <textarea className="w-full border border-gray-300 rounded p-2.5 focus:ring-2 focus:ring-comfort-blue focus:border-transparent outline-none transition-all text-sm" rows={4} value={value} onChange={e => onChange(e.target.value)} />
        ) : type === 'select' ? (
             <select className="w-full border border-gray-300 rounded p-2.5 focus:ring-2 focus:ring-comfort-blue focus:border-transparent outline-none transition-all text-sm bg-white" value={value} onChange={e => onChange(e.target.value)}>
                 {options.map((opt:any) => (
                    <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                        {typeof opt === 'string' ? opt : opt.label}
                    </option>
                 ))}
             </select>
        ) : (
            <input type={type} className="w-full border border-gray-300 rounded p-2.5 focus:ring-2 focus:ring-comfort-blue focus:border-transparent outline-none transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} />
        )}
    </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [donations, setDonations] = useState<ApiDonation[]>([]);
  const [projects, setProjects] = useState<ApiAction[]>([]); // Actions.php
  const [blogs, setBlogs] = useState<ApiArticle[]>([]); // Articles.php
  const [partners, setPartners] = useState<ApiPartner[]>([]);
  
  // Carousel State
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const galleryImages = Array.from({ length: 10 }, (_, i) => `http://localhost/api/assets/images/gallery/gallery${i + 1}.jpg`);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project'|'blog'|'partner'|'user'|'donation'>('project');
  const [editingItem, setEditingItem] = useState<any>(null); // null = create mode

  // Security Check
  useEffect(() => {
     if (!isAuthenticated || user?.role !== 'superadmin') {
         // Redirect handled by AuthContext or Component logic
     }
  }, [isAuthenticated, user]);

  // Load Data
  const loadAllData = async () => {
        setUsers(await api.getUsers());
        setDonations(await api.getDonations());
        setProjects(await api.getRawActions());
        setBlogs(await api.getRawArticles());
        setPartners(await api.getRawPartners());
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'superadmin') {
        loadAllData();
    }
  }, [isAuthenticated, user]);

  // Gallery Carousel Effect
  useEffect(() => {
    if (activeTab === 'dashboard') {
        const timer = setInterval(() => {
            setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }
  }, [activeTab, galleryImages.length]);

  const handleLogout = () => {
    logout(); 
    if (window.history.length > 1) window.close();
    else navigate('/');
  };

  /* --- CRUD HANDLERS --- */
  const handleEdit = (type: any, item: any) => {
      setModalType(type);
      setEditingItem(item);
      setIsModalOpen(true);
  };

  const handleCreate = (type: any) => {
      setModalType(type);
      setEditingItem({}); // Empty
      setIsModalOpen(true);
  };

  const handleDelete = async (type: string, id: string) => {
      if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
      
      let res;
      if (type === 'project') res = await api.deleteAction(id);
      if (type === 'blog') res = await api.deleteArticle(id);
      if (type === 'partner') res = await api.deletePartner(id);
      if (type === 'user') res = await api.deleteUser(id);
      if (type === 'donation') res = await api.deleteDonation(id);

      if (res.success) loadAllData();
      else alert("Erreur lors de la suppression");
  };

  const handleSaveModal = async () => {
      const id = editingItem.id;
      let res;

      if (modalType === 'project') {
          res = id ? await api.updateAction(id, editingItem) : await api.createAction(editingItem);
      } else if (modalType === 'blog') {
          res = id ? await api.updateArticle(id, editingItem) : await api.createArticle(editingItem);
      } else if (modalType === 'partner') {
          res = id ? await api.updatePartner(id, editingItem) : await api.createPartner(editingItem);
      } else if (modalType === 'user') {
          res = id ? await api.updateUser(id, editingItem) : await api.createUser(editingItem);
      } else if (modalType === 'donation') {
          // Pour les dons, on modifie surtout le statut
          res = await api.updateDonationStatus(id, editingItem.status);
      }

      if (res?.success) {
          setIsModalOpen(false);
          loadAllData();
      } else {
          alert("Erreur lors de l'enregistrement: " + (res?.error || res?.message));
      }
  };

  /* --- RENDER MODALS --- */
  const renderModalContent = () => {
      if (modalType === 'project') { // Actions
          return (
              <>
                <ImageUploader 
                    label="Image du Projet" 
                    value={editingItem.image_url || ''} 
                    folder="actions" 
                    onChange={(path) => setEditingItem({...editingItem, image_url: path})} 
                />
                <FormField label="Titre" value={editingItem.titre || ''} onChange={(v:string) => setEditingItem({...editingItem, titre: v})} />
                <FormField label="Catégorie" value={editingItem.categorie || ''} onChange={(v:string) => setEditingItem({...editingItem, categorie: v})} />
                <FormField label="Description" type="textarea" value={editingItem.description || ''} onChange={(v:string) => setEditingItem({...editingItem, description: v})} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Date Début" type="date" value={editingItem.date_debut || ''} onChange={(v:string) => setEditingItem({...editingItem, date_debut: v})} />
                    <FormField label="Date Fin" type="date" value={editingItem.date_fin || ''} onChange={(v:string) => setEditingItem({...editingItem, date_fin: v})} />
                </div>
                <FormField label="Statut" type="select" options={[{label:'En Cours', value:'en_cours'}, {label:'Terminé', value:'termine'}, {label:'À Venir', value:'a_venir'}]} value={editingItem.statut || 'en_cours'} onChange={(v:string) => setEditingItem({...editingItem, statut: v})} />
              </>
          );
      }
      if (modalType === 'blog') { // Articles
        return (
            <>
              <ImageUploader 
                    label="Image de l'Article" 
                    value={editingItem.image_url || ''} 
                    folder="blog" 
                    onChange={(path) => setEditingItem({...editingItem, image_url: path})} 
              />
              <FormField label="Titre" value={editingItem.titre || ''} onChange={(v:string) => setEditingItem({...editingItem, titre: v})} />
              <FormField label="Contenu" type="textarea" value={editingItem.contenu || ''} onChange={(v:string) => setEditingItem({...editingItem, contenu: v})} />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Auteur" value={editingItem.auteur || ''} onChange={(v:string) => setEditingItem({...editingItem, auteur: v})} />
                <FormField label="Catégorie" value={editingItem.categorie || ''} onChange={(v:string) => setEditingItem({...editingItem, categorie: v})} />
              </div>
            </>
        );
      }
      if (modalType === 'partner') {
          return (
              <>
                <ImageUploader 
                    label="Logo du Partenaire" 
                    value={editingItem.logo_url || ''} 
                    folder="partners" 
                    onChange={(path) => setEditingItem({...editingItem, logo_url: path})} 
                />
                <FormField label="Nom" value={editingItem.nom || ''} onChange={(v:string) => setEditingItem({...editingItem, nom: v})} />
                <FormField label="Description" type="textarea" value={editingItem.description || ''} onChange={(v:string) => setEditingItem({...editingItem, description: v})} />
                <FormField label="Site Web" value={editingItem.site_web || ''} onChange={(v:string) => setEditingItem({...editingItem, site_web: v})} />
              </>
          );
      }
      if (modalType === 'user') {
          return (
              <>
                <FormField label="Username" value={editingItem.username || ''} onChange={(v:string) => setEditingItem({...editingItem, username: v})} />
                <FormField label="Email" value={editingItem.email || ''} onChange={(v:string) => setEditingItem({...editingItem, email: v})} />
                <FormField label="Role" type="select" options={['user', 'editor', 'superadmin']} value={editingItem.role || 'user'} onChange={(v:string) => setEditingItem({...editingItem, role: v})} />
                {!editingItem.id && <FormField label="Mot de passe" type="password" value={editingItem.password || ''} onChange={(v:string) => setEditingItem({...editingItem, password: v})} />}
              </>
          );
      }
      if (modalType === 'donation') {
          return (
              <>
                 <div className="bg-blue-50 p-4 rounded mb-4 text-sm text-gray-700">
                     <p><strong>Donateur:</strong> {editingItem.donateur_nom}</p>
                     <p><strong>Montant:</strong> {editingItem.montant}$ ({editingItem.methode})</p>
                 </div>
                 <FormField label="Statut" type="select" options={[{label:'En Attente', value:'en_attente'}, {label:'Confirmé', value:'confirmé'}, {label:'Annulé', value:'annulé'}]} value={editingItem.status || 'en_attente'} onChange={(v:string) => setEditingItem({...editingItem, status: v})} />
              </>
          )
      }
      return null;
  }

  /* --- VIEW --- */
  if (!isAuthenticated || user?.role !== 'superadmin') return <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement de l'interface admin...</div>;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem?.id ? (modalType === 'donation' ? "Gérer le don" : "Modifier") : "Créer"} onSave={handleSaveModal}>
          {editingItem && renderModalContent()}
      </Modal>

      {/* SIDEBAR */}
      <aside className="w-64 bg-comfort-dark text-white flex flex-col hidden md:flex shadow-2xl z-20">
        <div className="p-6 border-b border-gray-800 bg-comfort-blue">
           <h2 className="text-2xl font-serif font-bold tracking-tight">COMFORT <span className="text-xs font-sans opacity-70 block uppercase tracking-widest mt-1">Administration</span></h2>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-3">
           {[
               { id: 'dashboard', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
               { id: 'users', icon: Users, label: 'Utilisateurs' },
               { id: 'partners', icon: Handshake, label: 'Partenaires' },
               { id: 'content', icon: FileText, label: 'Contenu (Site)' },
               { id: 'finances', icon: DollarSign, label: 'Dons & Finances' },
           ].map(item => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)} 
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium ${activeTab === item.id ? 'bg-comfort-blue text-white shadow-lg translate-x-1' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <item.icon size={20} className="mr-3" /> {item.label}
                </button>
           ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
           <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-white transition-colors w-full px-4 py-2 hover:bg-red-900/20 rounded">
              <LogOut size={20} className="mr-3" /> Déconnexion
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
           <h1 className="text-xl font-bold text-gray-800 capitalize flex items-center">
               {activeTab === 'dashboard' ? 'Tableau de Bord' : activeTab}
           </h1>
           <div className="flex items-center space-x-4">
              <div className="h-9 w-9 rounded-full bg-comfort-blue text-white flex items-center justify-center font-bold shadow-md">
                  {user?.username.charAt(0).toUpperCase()}
              </div>
           </div>
        </header>

        <div className="p-8">
            {/* DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4"><DollarSign size={28} /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Dons</p>
                                <h3 className="text-2xl font-bold text-gray-900">${donations.reduce((acc, curr) => acc + parseFloat(curr.montant), 0).toFixed(0)}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4"><Users size={28} /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Utilisateurs</p>
                                <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4"><Briefcase size={28} /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projets Actifs</p>
                                <h3 className="text-2xl font-bold text-gray-900">{projects.filter(p => p.statut === 'en_cours').length}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-lg bg-orange-50 text-orange-600 mr-4"><FileText size={28} /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Articles</p>
                                <h3 className="text-2xl font-bold text-gray-900">{blogs.length}</h3>
                            </div>
                        </div>
                    </div>

                    {/* GALLERY CAROUSEL */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative h-96 group">
                        <img 
                            src={galleryImages[currentGalleryIndex]} 
                            alt={`Gallery ${currentGalleryIndex + 1}`} 
                            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                            onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <div className="text-white">
                                <h3 className="text-2xl font-serif font-bold mb-2">Galerie Photos</h3>
                                <p className="text-white/80">Aperçu automatique des images du dossier assets/images/gallery</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setCurrentGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={() => setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* USERS VIEW */}
            {activeTab === 'users' && (
                <div>
                     <div className="flex justify-end mb-4"><button onClick={() => handleCreate('user')} className="bg-comfort-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold shadow flex items-center"><Plus size={16} className="mr-2"/> Nouvel Utilisateur</button></div>
                     <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Username</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Rôle</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.username}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                                        <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                            <button onClick={() => handleEdit('user', u)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete('user', u.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}

            {/* CONTENT VIEW (PROJECTS & BLOGS) */}
            {activeTab === 'content' && (
                <div className="space-y-12">
                    {/* Actions / Projets */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-700 flex items-center"><Briefcase size={20} className="mr-2"/> Projets (Actions)</h3>
                            <button onClick={() => handleCreate('project')} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded text-sm font-medium flex items-center"><Plus size={14} className="mr-1"/> Ajouter Projet</button>
                        </div>
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Titre</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Statut</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {projects.map(p => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4">
                                                <img src={p.image_url?.startsWith('http') ? p.image_url : `http://localhost/api/${p.image_url}`} alt="" className="w-12 h-12 object-cover rounded bg-gray-100" />
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.titre}</td>
                                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${p.statut === 'en_cours' ? 'bg-blue-100 text-blue-700' : p.statut === 'termine' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{p.statut.replace('_', ' ')}</span></td>
                                            <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                                <button onClick={() => handleEdit('project', p)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                                                <button onClick={() => handleDelete('project', p.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Articles */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-700 flex items-center"><FileText size={20} className="mr-2"/> Blog (Articles)</h3>
                            <button onClick={() => handleCreate('blog')} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded text-sm font-medium flex items-center"><Plus size={14} className="mr-1"/> Ajouter Article</button>
                        </div>
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Titre</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Auteur</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {blogs.map(b => (
                                        <tr key={b.id}>
                                            <td className="px-6 py-4">
                                                <img src={b.image_url?.startsWith('http') ? b.image_url : `http://localhost/api/${b.image_url}`} alt="" className="w-12 h-12 object-cover rounded bg-gray-100" />
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.titre}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{b.auteur}</td>
                                            <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                                <button onClick={() => handleEdit('blog', b)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                                                <button onClick={() => handleDelete('blog', b.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* FINANCES VIEW */}
            {activeTab === 'finances' && (
                <div>
                     <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Historique des Transactions</h3>
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Derniers 30 jours</span>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Donateur</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Montant</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Méthode</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Statut</th>
                                    <th className="px-6 py-3 text-right">Gérer</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {donations.map(d => (
                                    <tr key={d.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {d.donateur_nom}
                                            <span className="block text-xs text-gray-400 font-normal">{d.email}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-800">${d.montant}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{d.methode}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                d.status === 'confirmé' ? 'bg-green-100 text-green-700' : 
                                                d.status === 'annulé' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {d.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleEdit('donation', d)} className="text-comfort-blue hover:underline text-xs font-bold">Modifier Statut</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
             {/* PARTNERS VIEW */}
             {activeTab === 'partners' && (
                <div>
                     <div className="flex justify-end mb-4"><button onClick={() => handleCreate('partner')} className="bg-comfort-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-bold shadow flex items-center"><Plus size={16} className="mr-2"/> Nouveau Partenaire</button></div>
                     <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Logo</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nom</th><th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Site Web</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {partners.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img src={p.logo_url?.startsWith('http') ? p.logo_url : `http://localhost/api/${p.logo_url}`} alt="" className="w-16 h-16 object-contain border rounded bg-gray-50" />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {p.nom}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-comfort-blue hover:underline"><a href={p.site_web} target="_blank" rel="noreferrer">{p.site_web}</a></td>
                                        <td className="px-6 py-4 text-right flex justify-end space-x-2">
                                            <button onClick={() => handleEdit('partner', p)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete('partner', p.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
