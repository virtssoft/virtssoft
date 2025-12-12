
import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings } from '../types';
import { PROJECTS, BLOG_POSTS, PARTNERS, TEAM_MEMBERS, TESTIMONIALS, CONTACT_INFO } from '../pages/constants';

// --- CONFIGURATION API ---
const API_BASE_URL = 'http://localhost/api';

// Détection de l'environnement : Est-ce qu'on est sur un site HTTPS (Vercel) essayant de taper sur du HTTP Local ?
const isMixedContentRestriction = typeof window !== 'undefined' && 
                                  window.location.protocol === 'https:' && 
                                  API_BASE_URL.includes('localhost');

// Helper pour les images
const getImageUrl = (path: string | undefined) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  
  // Si on est sur Vercel et que l'image pointe sur localhost, on renvoie une image placeholder
  if (isMixedContentRestriction && path.includes('localhost')) {
      return `https://placehold.co/600x400?text=Image+Localhost+Non+Visible`;
  }

  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Fonction générique pour récupérer les données (Blog, Projets, etc.)
async function fetchData<T>(endpoint: string, fallback: T): Promise<T> {
  // 1. Si on est sur Vercel (HTTPS) et API sur Localhost -> On retourne directement le fallback (Mock)
  // Cela évite l'erreur rouge "Mixed Content" dans la console
  if (isMixedContentRestriction) {
      console.warn(`[Mode Démo] Fetch bloqué vers ${endpoint} (HTTPS ne peut pas accéder à HTTP Localhost). Utilisation des données statiques.`);
      return fallback;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
        return fallback;
    }
    const data = await response.json();
    return data;
  } catch (error) {
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
  statut: string;
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
    
    // CAS SPÉCIAL VERCEL / PRODUCTION
    // Si on est en ligne, on coupe court au fetch qui va échouer (CORS/Mixed Content)
    if (isMixedContentRestriction) {
        if (loginInput === 'admin' && passwordInput === 'password') {
            return { 
                success: true, 
                user: {
                    id: 'dev-1',
                    username: 'Admin Demo (Vercel)',
                    email: 'admin@comfort.org',
                    role: 'superadmin',
                    created_at: new Date().toISOString()
                }
            };
        }
        return { success: false, error: "Mode Démo (Vercel) : Utilisez admin / password" };
    }

    // CAS NORMAL (Localhost ou Serveur Configuré)
    try {
        const response = await fetch(`${API_BASE_URL}/login.php`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ 
                login: loginInput, 
                password: passwordInput 
            })
        });

        const text = await response.text();
        
        let data;
        try {
            data = JSON.parse(text.trim());
        } catch (e) {
            console.error("Erreur parsing JSON:", e);
            return { success: false, error: "Erreur serveur PHP (format invalide)" };
        }
        
        if (response.ok && data.user) {
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error || data.message || "Identifiants incorrects" };
        }

    } catch (err) {
        console.error("Erreur Réseau/CORS:", err);
        
        // Fallback local aussi, au cas où le serveur est éteint
        if (loginInput === 'admin' && passwordInput === 'password') {
            return { 
                success: true, 
                user: {
                    id: 'dev-1',
                    username: 'Admin Dev (Local)',
                    email: 'admin@comfort.org',
                    role: 'superadmin',
                    created_at: new Date().toISOString()
                }
            };
        }

        return { success: false, error: "Impossible de contacter le serveur." };
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
    logoUrl: isMixedContentRestriction ? 'https://placehold.co/120x120/01217d/ffffff/png?text=Logo' : `${API_BASE_URL}/assets/images/logo1.png`, 
    faviconUrl: isMixedContentRestriction ? '' : `${API_BASE_URL}/assets/images/favicon.ico`,
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
    if (isMixedContentRestriction) return { success: false, error: "Inscription désactivée en mode démo (Vercel)." };
    
    try {
        const response = await fetch(`${API_BASE_URL}/users.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...userData, role: 'user' })
        });
        const text = await response.text();
        const data = JSON.parse(text);
        
        if (response.ok && data.success) return { success: true };
        return { success: false, error: data.message || data.error || "Erreur inscription" };
    } catch (error) {
        return { success: false, error: "Serveur injoignable ou erreur format" };
    }
  },

  updateUser: async (id: string, userData: any): Promise<{ success: boolean; error?: string }> => {
    if (isMixedContentRestriction) return { success: true }; // Simulation succès
    
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
