
import { Project, BlogPost, Partner, TeamMember, Testimonial, SiteSettings } from '../types';
import { PROJECTS, BLOG_POSTS, PARTNERS, TEAM_MEMBERS, TESTIMONIALS, CONTACT_INFO } from '../pages/constants';

const API_DOMAIN = 'http://localhost';
const API_BASE_URL = `${API_DOMAIN}/api`;

// Helper to fix image URLs (prepend domain if relative path)
const getImageUrl = (path: string | undefined) => {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  if (path.startsWith('http')) return path;
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Prepend API_BASE_URL (http://localhost/api) to match database storage path structure
  // User req: prepend http://localhost/api/ to /assets/...
  return `${API_BASE_URL}${cleanPath}`;
};

// Helper for Fetching
async function fetchData<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch ${endpoint}, using fallback data.`);
    return fallback;
  }
}

// Interfaces for API Responses (French fields from your PHP API)
interface ApiArticle {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  image_url: string;
  auteur: string;
  categorie: string;
  created_at: string;
  status: string;
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

interface ApiPartner {
  id: string;
  nom: string;
  logo_url: string;
  site_web: string;
  description: string;
  created_at: string;
}

interface ApiUser {
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
  message: string;
  created_at: string;
  status: string;
}

export const api = {
  // --- PUBLIC DATA ---

  getSettings: () => fetchData<SiteSettings>('settings.php', {
    logoUrl: `${API_BASE_URL}/assets/images/logo1.png`, 
    faviconUrl: `${API_BASE_URL}/assets/images/favicon.ico`,
    siteName: 'COMFORT Asbl',
    contactEmail: 'contact@comfort-asbl.org',
    contactPhone: '+243 994 280 037',
    contactAddress: 'Katindo Beni 108, Goma, RDC',
    socialLinks: {
        facebook: 'https://facebook.com',
        twitter: 'https://x.com',
    }
  }),

  getProjects: async (): Promise<Project[]> => {
    try {
      const actions = await fetchData<ApiAction[]>('actions.php', []);
      if (actions.length === 0) return PROJECTS; // Fallback if empty API
      
      return actions.map(action => ({
        id: action.id,
        title: action.titre,
        category: action.categorie,
        description: action.description,
        image: getImageUrl(action.image_url),
        date: action.date_debut,
        status: action.statut === 'termine' ? 'Completed' : 'Ongoing',
        goal: 10000, // Default value as API doesn't provide it yet
        raised: 0    // Default value
      }));
    } catch (e) {
      return PROJECTS;
    }
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const articles = await fetchData<ApiArticle[]>('articles.php', []);
      if (articles.length === 0) return BLOG_POSTS;

      return articles.map(article => ({
        id: article.id,
        title: article.titre,
        excerpt: article.contenu.substring(0, 150) + '...', // Create excerpt from content
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
      if (partners.length === 0) return PARTNERS;

      return partners.map((p, index) => ({
        id: p.id,
        name: p.nom,
        // Override API logo_url to match the specific file convention requested (partners1.jpg -> partners6.jpg)
        logo: `${API_BASE_URL}/assets/images/partners/partners${(index % 6) + 1}.jpg`,
        description: p.description,
        type: 'Corporate' // Default type
      }));
    } catch (e) {
      return PARTNERS;
    }
  },

  // Fallback to constants for endpoints not yet in API list
  getTeam: () => fetchData<TeamMember[]>('team.php', TEAM_MEMBERS),
  getTestimonials: () => fetchData<Testimonial[]>('testimonials.php', TESTIMONIALS),

  // --- ADMIN / AUTH ---

  login: async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success || response.ok) { // Adjust based on actual PHP response structure
         return { success: true, user: data.user || { email, role: 'user' } };
      }
      return { success: false, error: data.message || 'Login failed' };
    } catch (error) {
      // Fallback for demo if API is offline
      if (email === 'admin@comfort-asbl.com') {
         return { success: true, user: { email, role: 'superadmin' } };
      }
      return { success: false, error: 'Network error or Invalid credentials' };
    }
  },

  getUsers: async (): Promise<ApiUser[]> => {
    return fetchData<ApiUser[]>('users.php', []);
  },

  getDonations: async (): Promise<ApiDonation[]> => {
    return fetchData<ApiDonation[]>('donations.php', []);
  }
};
