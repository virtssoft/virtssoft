
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

// Interfaces for API Responses
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

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at?: string;
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
      if (actions.length === 0) return PROJECTS; 
      
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
      if (articles.length === 0) return BLOG_POSTS;

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
      
      return partners.map((p) => ({
        id: p.id,
        name: p.nom,
        logo: getImageUrl(p.logo_url),
        description: p.description,
        type: 'Corporate' // Default type
      }));
    } catch (e) {
      return []; 
    }
  },

  getTeam: () => fetchData<TeamMember[]>('team.php', TEAM_MEMBERS),
  getTestimonials: () => fetchData<Testimonial[]>('testimonials.php', TESTIMONIALS),

  // --- ADMIN / AUTH / USER MANAGEMENT ---

  // POST login.php
  login: async (emailOrUsername: string, password: string): Promise<{ success: boolean; user?: ApiUser; error?: string }> => {
    try {
      // FIX: Use JSON body and 'login' key as per PHP backend expectation ($input['login'])
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: emailOrUsername, 
            password: password
        }),
      });

      const data = await response.json();
      
      // Backend returns { "user": ... } on success
      if (data.user) {
         return { success: true, user: data.user };
      }
      
      // Handle specific error messages from PHP { "error": "..." }
      if (data.error) {
          return { success: false, error: data.error };
      }
      
      return { success: false, error: data.message || 'Identifiants incorrects' };
    } catch (error) {
      // Simulation for fallback/demo if API is down
      if (emailOrUsername === 'admin@comfort.org' && password === 'admin') {
         return { success: true, user: { id: '1', username: 'admin1', email: 'admin1@comfort.org', role: 'superadmin', created_at: '2025-01-01' } };
      }
      return { success: false, error: 'Erreur de connexion serveur' };
    }
  },

  // POST users.php (Create Account)
  register: async (userData: { username: string; email: string; password: string; role?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...userData,
                role: userData.role || 'user' // Default to basic user
            })
        });
        const data = await response.json();
        if (response.ok || data.success) return { success: true };
        return { success: false, error: data.message || 'Erreur lors de l\'inscription' };
    } catch (error) {
        return { success: false, error: 'Erreur réseau' };
    }
  },

  // PUT users.php?id=ID (Update Profile)
  updateUser: async (id: string, userData: { username?: string; password?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/users.php?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) return { success: true };
        return { success: false, error: data.message || 'Erreur lors de la mise à jour' };
    } catch (error) {
        return { success: false, error: 'Erreur réseau' };
    }
  },

  // GET users.php
  getUsers: async (): Promise<ApiUser[]> => {
    return fetchData<ApiUser[]>('users.php', []);
  },

  getDonations: async (): Promise<ApiDonation[]> => {
    return fetchData<ApiDonation[]>('donations.php', []);
  }
};
