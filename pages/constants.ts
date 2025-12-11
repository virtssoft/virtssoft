
import { Project, BlogPost, Domain, Testimonial, Partner, TeamMember } from './types';

export const CONTACT_INFO = {
  phone: "+243 994 280 037",
  email: "contact@comfort-asbl.org",
  address: "Katindo Beni 108, Goma, RDC",
  hours: "Lun - Ven: 8h00 - 17h00"
};

export const DOMAINS: Domain[] = [
  { 
    id: 'health', 
    title: '', // Loaded via translation
    description: '', // Loaded via translation
    icon: 'Heart' 
  },
  { 
    id: 'education', 
    title: '', 
    description: '', 
    icon: 'BookOpen' 
  },
  { 
    id: 'socio_eco', 
    title: '', 
    description: '', 
    icon: 'HandCoins' 
  },
  { 
    id: 'food', 
    title: '', 
    description: '', 
    icon: 'Wheat' 
  },
  { 
    id: 'culture', 
    title: '', 
    description: '', 
    icon: 'Palette' 
  },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: "Construction d'une école à Masisi",
    category: "Éducation",
    description: "Un projet ambitieux pour offrir un cadre d'apprentissage sécurisé à 500 enfants déplacés, garantissant leur droit fondamental à l'éducation.",
    image: "/assets/images/project-1.jpg",
    date: "2023-10-15",
    status: "Ongoing",
    goal: 50000,
    raised: 35000
  },
  {
    id: '2',
    title: "Eau potable pour Kibumba",
    category: "Santé & Eau",
    description: "Installation de 5 bornes fontaines alimentées par l'énergie solaire pour éradiquer les maladies hydriques dans la région.",
    image: "/assets/images/project-2.jpg",
    date: "2023-08-01",
    status: "Completed",
    goal: 15000,
    raised: 15000
  },
  {
    id: '3',
    title: "Autonomisation des femmes",
    category: "Dév. Économique",
    description: "Programme de formation professionnelle et micro-crédit pour 200 femmes chefs de ménage.",
    image: "/assets/images/project-3.jpg",
    date: "2023-12-01",
    status: "Ongoing",
    goal: 25000,
    raised: 12000
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "L'impact de l'éducation sur la paix",
    excerpt: "Comment l'accès à l'école réduit les conflits communautaires sur le long terme.",
    author: "Dr. Jean Amani",
    date: "12 Oct 2023",
    category: "Analyse",
    image: "/assets/images/blog-1.jpg"
  },
  {
    id: '2',
    title: "Rapport annuel 2023",
    excerpt: "Découvrez nos réalisations et nos défis durant l'année écoulée.",
    author: "COMFORT Team",
    date: "05 Nov 2023",
    category: "News",
    image: "/assets/images/blog-2.jpg"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: "John K. Biloto",
    role: "Partenaire institutionnel",
    content: "Collaborer avec COMFORT Asbl a transformé notre manière d’intervenir sur le terrain. Leur approche centrée sur la dignité humaine et l’impact durable nous a permis de soutenir des communautés qui étaient jusque-là difficiles d’accès. Leur rigueur, leur transparence et leur capacité à mobiliser rapidement les ressources en font un partenaire fiable et visionnaire.",
    image: "http://localhost/api/assets/images/temoins/t1.jpg"
  },
  {
    id: '2',
    name: "Charle Landa",
    role: "Internaute / Observateur engagé",
    content: "J’ai découvert COMFORT Asbl à travers leurs actions publiées en ligne, et j’ai été profondément marqué par leur engagement réel. Beaucoup d’organisations parlent d’impact, mais COMFORT le démontre chaque jour sur le terrain. Leur communication claire et leurs résultats visibles m’ont inspiré à suivre de près leurs initiatives.",
    image: "http://localhost/api/assets/images/temoins/t2.jpg"
  },
  {
    id: '3',
    name: "Gabriel Muruwa",
    role: "Coordinateur COMFORT Asbl",
    content: "À COMFORT Asbl, notre priorité est de servir les populations les plus vulnérables avec intégrité et responsabilité. Chaque action menée, chaque programme lancé, est le fruit d’un travail d’équipe dévoué et d’un engagement profond envers nos valeurs. Voir des vies s’améliorer, des familles retrouver espoir et des communautés se reconstruire, voilà ce qui nous motive.",
    image: "http://localhost/api/assets/images/temoins/t3.jpg"
  }
];

export const PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Fondation Virunga',
    logo: 'http://localhost/api/assets/images/partners/partner1.jpg',
    description: "Collaboration pour la conservation de l'environnement et le développement durable autour du parc.",
    type: 'NGO'
  },
  {
    id: '2',
    name: 'Ministère de la Santé RDC',
    logo: 'http://localhost/api/assets/images/partners/partner2.png',
    description: "Partenariat stratégique pour l'accès aux soins de santé primaire dans les zones reculées.",
    type: 'Government'
  },
  {
    id: '3',
    name: 'Tech for Good Congo',
    logo: 'http://localhost/api/assets/images/partners/partner3.jpg',
    description: "Soutien technique et logistique pour la digitalisation de nos programmes éducatifs.",
    type: 'Corporate'
  },
  {
    id: '4',
    name: 'Association des Femmes Vaillantes',
    logo: 'http://localhost/api/assets/images/partners/partner4.png',
    description: "Réseau de bénévoles locaux mobilisés pour l'autonomisation économique des femmes.",
    type: 'Volunteer'
  },
  {
    id: '5',
    name: 'Global Water Aid',
    logo: 'http://localhost/api/assets/images/partners/partner5.jpg',
    description: "Financement et expertise technique pour nos projets d'adduction d'eau potable.",
    type: 'NGO'
  },
  {
    id: '6',
    name: 'Banque Locale de Goma',
    logo: 'http://localhost/api/assets/images/partners/partner6.png',
    description: "Mécénat d'entreprise soutenant nos initiatives de micro-crédit.",
    type: 'Corporate'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Jean Amani',
    role: 'Directeur Exécutif',
    bio: 'Médecin de santé publique avec 15 ans d\'expérience dans l\'humanitaire en RDC.',
    image: '/assets/images/team-1.jpg'
  },
  {
    id: '2',
    name: 'Sarah Kabuya',
    role: 'Responsable Programmes',
    bio: 'Experte en développement communautaire et gestion de projets éducatifs.',
    image: '/assets/images/team-2.jpg'
  },
  {
    id: '3',
    name: 'Michel Kasongo',
    role: 'Coordinateur Logistique',
    bio: 'Spécialiste de la chaîne d\'approvisionnement en zones difficiles d\'accès.',
    image: '/assets/images/team-3.jpg'
  },
  {
    id: '4',
    name: 'Aline Mwamba',
    role: 'Responsable Partenariats',
    bio: 'Passionnée par la mobilisation de ressources et le plaidoyer international.',
    image: '/assets/images/team-4.jpg'
  }
];
