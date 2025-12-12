
import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings } from '../types';
import { PROJECTS, BLOG_POSTS, PARTNERS, TEAM_MEMBERS, TESTIMONIALS } from '../pages/constants';

// --- CONFIGURATION SIMPLE ---
// C'est l'adresse unique de votre serveur.
const API_BASE_URL = 'http://localhost/api'; 

// Fonction simple pour lire les données
async function fetchData<T>(endpoint: string, fallback: T): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  try {
    const response = await fetch(url);

    // Si le serveur répond une erreur (ex: 404 fichier introuvable), on le dit
    if (!response.ok) {
        console.error(`[API ERROR] Le serveur a répondu ${response.status} pour ${url}`);
        return fallback;
    }

    const text = await response.text();
    
    // On essaie de transformer la réponse en JSON
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error(`[API ERROR] Le serveur n'a pas renvoyé du JSON valide pour ${url}. Réponse reçue :`, text);
        return fallback;
    }

  } catch (error) {
    console.error(`[API ERROR] Impossible de contacter le serveur sur ${url}. Vérifiez que XAMPP est allumé.`, error);
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
  
  // --- LOGIN (Simplifié) ---
  login: async (loginInput: string, passwordInput: string): Promise<{ success: boolean; user?: ApiUser; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/login.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: loginInput, password: passwordInput })
        });

        const text = await response.text();
        
        try {
            const data = JSON.parse(text);
            if (data.success && data.user) {
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.message || "Identifiants incorrects" };
            }
        } catch (e) {
            console.error("Erreur JSON Login:", text);
            // BACKDOOR LOCALE : Si le serveur plante mais que vous tapez admin/password, on vous laisse entrer pour tester le design
            if (loginInput === 'admin' && passwordInput === 'password') {
                 return { 
                    success: true, 
                    user: { id: 'dev', username: 'Admin Local', email: 'admin@local', role: 'superadmin', created_at: new Date().toISOString() } 
                 };
            }
            return { success: false, error: "Erreur du serveur (voir console)" };
        }
    } catch (err) {
        console.error("Erreur Réseau Login:", err);
        // BACKDOOR LOCALE
        if (loginInput === 'admin' && passwordInput === 'password') {
             return { 
                success: true, 
                user: { id: 'dev', username: 'Admin Local', email: 'admin@local', role: 'superadmin', created_at: new Date().toISOString() } 
             };
        }
        return { success: false, error: "Serveur injoignable" };
    }
  },

  // --- GET DATA (Mappage direct) ---

  getProjects: async (): Promise<Project[]> => {
    const actions = await fetchData<ApiAction[]>('actions.php', []);
    if (actions.length === 0) return PROJECTS;
    
    return actions.map(action => ({
      id: action.id,
      title: action.titre,
      category: action.categorie,
      description: action.description,
      image: action.image_url?.startsWith('http') ? action.image_url : `${API_BASE_URL}/${action.image_url}`,
      date: action.date_debut,
      endDate: action.date_fin,
      status: action.statut === 'termine' ? 'Completed' : 'Ongoing',
      goal: 10000, 
      raised: 0    
    }));
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    const articles = await fetchData<ApiArticle[]>('articles.php', []);
    if (articles.length === 0) return BLOG_POSTS;

    return articles.map(article => ({
      id: article.id,
      title: article.titre,
      excerpt: article.contenu.substring(0, 150) + '...',
      author: article.auteur,
      date: article.created_at,
      category: article.categorie,
      image: article.image_url?.startsWith('http') ? article.image_url : `${API_BASE_URL}/${article.image_url}`
    }));
  },

  getPartners: async (): Promise<Partner[]> => {
    const partners = await fetchData<ApiPartner[]>('partners.php', []);
    if (partners.length === 0) return PARTNERS;

    return partners.map((p) => ({
      id: p.id,
      name: p.nom,
      logo: p.logo_url?.startsWith('http') ? p.logo_url : `${API_BASE_URL}/${p.logo_url}`,
      description: p.description,
      type: 'Corporate'
    }));
  },

  // Ces fonctions sont requises par le AdminDashboard
  getUsers: async (): Promise<ApiUser[]> => fetchData<ApiUser[]>('users.php', []),
  getDonations: async (): Promise<ApiDonation[]> => fetchData<ApiDonation[]>('donations.php', []),
  
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

  // --- ACTIONS (Create/Update/Delete) ---
  // Ces fonctions envoient les données au PHP.
  
  register: async (userData: any) => {
    try {
        await fetch(`${API_BASE_URL}/users.php`, { method: 'POST', body: JSON.stringify(userData) });
        return { success: true };
    } catch(e) { return { success: false, error: "Erreur" }; }
  },

  updateUser: async (id: string, userData: any) => {
    try {
        await fetch(`${API_BASE_URL}/users.php?id=${id}`, { method: 'PUT', body: JSON.stringify(userData) });
        return { success: true };
    } catch(e) { return { success: false, error: "Erreur lors de la mise à jour" }; }
  },

  deleteItem: async (endpoint: string, id: string) => {
      try {
        await fetch(`${API_BASE_URL}/${endpoint}.php?id=${id}`, { method: 'DELETE' });
        return { success: true };
      } catch (e) { return { success: false }; }
  },

  createItem: async (endpoint: string, data: any) => {
      try {
        await fetch(`${API_BASE_URL}/${endpoint}.php`, { method: 'POST', body: JSON.stringify(data) });
       return { success: true, id: Math.random().toString() };
      } catch (e) { return { success: false }; }
  }
};
