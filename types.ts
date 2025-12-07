export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  date: string;
  status: 'Ongoing' | 'Completed';
  goal: number;
  raised: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  type: 'Corporate' | 'NGO' | 'Volunteer' | 'Government';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}