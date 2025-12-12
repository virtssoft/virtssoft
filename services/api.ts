
import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings } from '../types';
import { PROJECTS, BLOG_POSTS, PARTNERS, TEAM_MEMBERS, TESTIMONIALS, CONTACT_INFO } from '../pages/constants';

// --- CONFIGURATION STRICTE (Comme dans votre exemple qui fonctionne) ---
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
        // Si erreur HTTP (404, 500), on utilise le fallback
        console.warn(`[API] Erreur ${response.status} sur ${endpoint}`);
        return fallback;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // Si serveur éteint ou erreur réseau, on utilise le fallback pour que le site s'affiche quand même
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
  
  // --- LOGIN (Copie conforme de votre script JS qui fonctionne) ---
  login: async (loginInput: string, passwordInput: string): Promise<{ success: boolean; user?: ApiUser; error?: string }> => {
    try {
        const res = await fetch(`${API_BASE_URL}/login.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: loginInput, password: passwordInput })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            // Succès
            return { success: true, user: data.user || data };
        } else {
            // Erreur renvoyée par PHP (ex: mot de passe incorrect)
            return { success: false, error: data.error || "Erreur de connexion" };
        }
    } catch (err) {
        // Erreur réseau (serveur éteint, mauvaise URL)
        console.error(err);
        return { success: false, error: "Impossible de se connecter au serveur (Vérifiez que http://localhost/api est accessible)" };
    }
  },

  // --- GET DATA (Récupération données) ---

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

  // --- AUTRES ACTIONS POST ---

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
