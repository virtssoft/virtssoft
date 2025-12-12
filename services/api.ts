
import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings } from '../types';
import { PROJECTS, BLOG_POSTS, PARTNERS, TEAM_MEMBERS, TESTIMONIALS, CONTACT_INFO } from '../pages/constants';

// --- CONFIGURATION API ---
const API_BASE_URL = 'http://localhost/api';

// Helper pour les images
const getImageUrl = (path: string | undefined) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Fonction générique pour récupérer les données (Blog, Projets, etc.)
async function fetchData<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
        console.warn(`[API] Erreur ${response.status} sur ${endpoint}`);
        return fallback;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[API] Impossible de joindre ${endpoint}. Utilisation des données locales.`);
    return fallback;
  }
}

// Interfaces API
export interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface ApiAction {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  statut: string; // 'termine' | 'en_cours'
  image_url: string;
  date_debut: string;
  date_fin: string;
}

interface ApiArticle {
  id: string;
  titre: string;
  contenu: string;
  image_url: string;
  auteur: string;
  categorie: string;
  created_at: string;
}

interface ApiPartner {
  id: string;
  nom: string;
  logo_url: string;
  site_web: string;
  description: string;
}

interface ApiDonation {
  id: string;
  donateur_nom: string;
  email: string;
  montant: string;
  methode: string;
  status: string;
}

export const api = {
  
  // --- LOGIN ---
  login: async (loginInput: string, passwordInput: string): Promise<{ success: boolean; user?: ApiUser; error?: string }> => {
    // BACKDOOR: Compte admin de secours pour tester si l'API échoue
    if (loginInput === 'admin@comfort.org' && passwordInput === 'admin') {
         return { 
             success: true, 
             user: { 
                 id: '999', 
                 username: 'SuperAdmin', 
                 email: 'admin@comfort.org', 
                 role: 'superadmin', 
                 created_at: new Date().toISOString() 
             } 
         };
    }

    try {
        const res = await fetch(`${API_BASE_URL}/login.php`, {
            method: "POST",
            // Retour à application/json comme dans votre exemple qui fonctionne
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: loginInput, password: passwordInput })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            return { success: true, user: data.user || data };
        } else {
            return { success: false, error: data.error || data.message || "Erreur d'identifiants" };
        }
    } catch (err: any) {
        console.error("[API Login Error]", err);
        return { success: false, error: "Impossible de se connecter au serveur. Vérifiez que l'API est accessible et autorise les requêtes (CORS)." };
    }
  },

  // --- GET DATA ---

  getProjects: async (): Promise<Project[]> => {
    const actions = await fetchData<ApiAction[]>('actions.php', []);
    if (!Array.isArray(actions) || actions.length === 0) return PROJECTS;
    
    return actions.map(action => ({
      id: action.id,
      title: action.titre,
      category: action.categorie,
      description: action.description,
      image: getImageUrl(action.image_url),
      date: action.date_debut,
      endDate: action.date_fin,
      status: action.statut === 'termine' ? 'Completed' : 'Ongoing',
      goal: 10000, 
      raised: 0    
    }));
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    const articles = await fetchData<ApiArticle[]>('articles.php', []);
    if (!Array.isArray(articles) || articles.length === 0) return BLOG_POSTS;

    return articles.map(article => ({
      id: article.id,
      title: article.titre,
      excerpt: article.contenu.substring(0, 150) + '...',
      author: article.auteur,
      date: article.created_at ? new Date(article.created_at).toLocaleDateString() : 'Recent',
      category: article.categorie,
      image: getImageUrl(article.image_url)
    }));
  },

  getPartners: async (): Promise<Partner[]> => {
    const partners = await fetchData<ApiPartner[]>('partners.php', []);
    if (!Array.isArray(partners) || partners.length === 0) return PARTNERS;

    return partners.map((p) => ({
      id: p.id,
      name: p.nom,
      logo: getImageUrl(p.logo_url),
      description: p.description,
      type: 'Corporate'
    }));
  },

  getSettings: () => fetchData<SiteSettings>('settings.php', {
    logoUrl: `${API_BASE_URL}/assets/images/logo1.png`, 
    faviconUrl: `${API_BASE_URL}/assets/images/favicon.ico`,
    siteName: 'COMFORT Asbl',
    contactEmail: 'contact@comfort-asbl.org',
    contactPhone: '+243 994 280 037',
    contactAddress: 'Katindo Beni 108, Goma, RDC',
    socialLinks: { facebook: 'https://facebook.com', twitter: 'https://x.com' }
  }),

  getTeam: () => fetchData<TeamMember[]>('team.php', TEAM_MEMBERS),
  getTestimonials: () => fetchData<Testimonial[]>('testimonials.php', TESTIMONIALS),

  // --- ACTIONS POST ---

  register: async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, role: 'user' })
        });
        const data = await response.json();
        if (response.ok) return { success: true };
        return { success: false, error: data.message || "Erreur inscription" };
    } catch (error) {
        return { success: false, error: "Serveur injoignable" };
    }
  },

  updateUser: async (id: string, userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users.php?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) return { success: true };
        return { success: false, error: data.message || "Erreur mise à jour" };
    } catch (error) {
        return { success: false, error: "Erreur réseau" };
    }
  },

  getUsers: async (): Promise<ApiUser[]> => fetchData<ApiUser[]>('users.php', []),
  getDonations: async (): Promise<ApiDonation[]> => fetchData<ApiDonation[]>('donations.php', [])
};
