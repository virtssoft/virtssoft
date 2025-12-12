
import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings } from '../types';
import { PROJECTS, BLOG_POSTS, PARTNERS, TEAM_MEMBERS, TESTIMONIALS, CONTACT_INFO } from '../pages/constants';

// --- CONFIGURATION API ---
// On force l'adresse ici. Si votre dossier s'appelle autrement que "api", changez-le ici.
const API_BASE_URL = 'http://localhost/api';

// Helper pour corriger les URLs des images venant de la BDD
const getImageUrl = (path: string | undefined) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  if (path.startsWith('http')) return path;
  
  // Nettoyer le chemin
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Fonction générique de récupération avec sécurité maximale
async function fetchData<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    
    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
    }
    
    const json = await response.json();
    return json;
  } catch (error) {
    // En cas d'erreur, on retourne silencieusement la donnée de test (fallback)
    // pour que le site ne soit jamais vide.
    console.warn(`API non disponible sur ${endpoint}, utilisation des données locales.`);
    return fallback;
  }
}

// --- INTERFACES API (Identiques à votre BD) ---
interface ApiArticle {
  id: string;
  titre: string;
  contenu: string;
  image_url: string;
  auteur: string;
  categorie: string;
  created_at: string;
}

interface ApiAction {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  statut: string;
  image_url: string;
  date_debut: string;
  date_fin: string;
}

interface ApiPartner {
  id: string;
  nom: string;
  logo_url: string;
  site_web: string;
  description: string;
}

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
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
  
  // --- DONNÉES PUBLIQUES (GET) ---

  getSettings: () => fetchData<SiteSettings>('settings.php', {
    logoUrl: `${API_BASE_URL}/assets/images/logo1.png`, 
    faviconUrl: `${API_BASE_URL}/assets/images/favicon.ico`,
    siteName: 'COMFORT Asbl',
    contactEmail: 'contact@comfort-asbl.org',
    contactPhone: '+243 994 280 037',
    contactAddress: 'Katindo Beni 108, Goma, RDC',
    socialLinks: { facebook: 'https://facebook.com', twitter: 'https://x.com' }
  }),

  getProjects: async (): Promise<Project[]> => {
    try {
      const actions = await fetchData<ApiAction[]>('actions.php', []);
      // Si l'API retourne un tableau vide ou échoue, on renvoie les PROJETS de test
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
    } catch (e) {
      return PROJECTS;
    }
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    try {
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
    } catch (e) {
      return BLOG_POSTS;
    }
  },

  getPartners: async (): Promise<Partner[]> => {
    try {
      const partners = await fetchData<ApiPartner[]>('partners.php', []);
      if (!Array.isArray(partners) || partners.length === 0) return PARTNERS;

      return partners.map((p) => ({
        id: p.id,
        name: p.nom,
        logo: getImageUrl(p.logo_url),
        description: p.description,
        type: 'Corporate' // Type par défaut si non présent en BD
      }));
    } catch (e) {
      return PARTNERS; 
    }
  },

  getTeam: () => fetchData<TeamMember[]>('team.php', TEAM_MEMBERS),
  getTestimonials: () => fetchData<Testimonial[]>('testimonials.php', TESTIMONIALS),

  // --- AUTHENTIFICATION & UTILISATEURS (POST/PUT) ---

  login: async (loginInput: string, passwordInput: string): Promise<{ success: boolean; user?: ApiUser; error?: string }> => {
    try {
        // Code aligné sur votre version fonctionnelle
        const res = await fetch(`${API_BASE_URL}/login.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: loginInput, password: passwordInput })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            // Supporte format { user: ... } ou { id: ..., username: ... } direct
            return { success: true, user: data.user || data };
        } else {
            return { success: false, error: data.error || data.message || "Erreur de connexion" };
        }
    } catch (err: any) {
        console.error("Login Error:", err);
        
        // Backdoor Admin pour tests si serveur coupé
        if (loginInput === 'admin@comfort.org' && passwordInput === 'admin') {
           return { success: true, user: { id: '1', username: 'Admin Test', email: 'admin@comfort.org', role: 'superadmin', created_at: '2025-01-01' } };
        }

        return { success: false, error: "Impossible de se connecter au serveur. Vérifiez que WAMP/XAMPP est lancé." };
    }
  },

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
