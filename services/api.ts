
import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings } from '../types';
import { PROJECTS, BLOG_POSTS, PARTNERS, TEAM_MEMBERS, TESTIMONIALS, CONTACT_INFO } from '../pages/constants';

// --- CONFIGURATION API ---
// Assurez-vous que votre serveur PHP tourne sur ce port ou ajustez l'URL
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
        return fallback;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // En cas d'erreur (serveur éteint), on retourne les données statiques (mock)
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
  
  // --- LOGIN AMÉLIORÉ ---
  login: async (loginInput: string, passwordInput: string): Promise<{ success: boolean; user?: ApiUser; error?: string }> => {
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

        // Lecture en texte d'abord pour déboguer les erreurs PHP cachées
        const text = await response.text();
        console.log("Raw Server Response:", text); // Vérifiez la console (F12) pour voir ce que le serveur renvoie exactement

        let data;
        try {
            // On essaie de parser le JSON (même s'il y a des caractères invisibles avant/après)
            data = JSON.parse(text.trim());
        } catch (e) {
            console.error("Erreur parsing JSON:", e);
            // Si ce n'est pas du JSON, c'est peut-être une erreur PHP brute
            if (text.includes("<b>Warning</b>") || text.includes("<b>Notice</b>") || text.includes("<b>Fatal error</b>")) {
                 return { success: false, error: "Erreur serveur PHP (voir console)" };
            }
            return { success: false, error: "Format de réponse invalide." };
        }
        
        // Si le serveur répond 200 OK et renvoie un user
        if (response.ok && data.user) {
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error || data.message || "Identifiants incorrects" };
        }

    } catch (err) {
        console.error("Erreur Réseau/CORS:", err);
        
        // --- MODE SECOURS (DEV ONLY) ---
        // Gardé pour vous permettre de tester l'interface même si l'API bloque
        if (loginInput === 'admin' && passwordInput === 'password') {
            return { 
                success: true, 
                user: {
                    id: 'dev-1',
                    username: 'Admin Dev',
                    email: 'admin@comfort.org',
                    role: 'superadmin',
                    created_at: new Date().toISOString()
                }
            };
        }

        return { success: false, error: "Erreur de connexion. Vérifiez la console (F12)." };
    }
  },

  // --- GET DATA ---

  getProjects: async (): Promise<Project[]> => {
    const actions = await fetchData<ApiAction[]>('actions.php', []);
    // Mapping des données API vers le format Frontend
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
        const text = await response.text();
        const data = JSON.parse(text);
        
        if (response.ok && data.success) return { success: true };
        return { success: false, error: data.message || data.error || "Erreur inscription" };
    } catch (error) {
        return { success: false, error: "Serveur injoignable ou erreur format" };
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
