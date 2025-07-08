import type React from 'react';

export interface Product {
  id: string;
  name: string;
  summary: string;
  imageUrl: string;
  description: string;
  price: string;
  purchaseUrl?: string;
  detailImageUrl?: string;
}

export interface CompanyInfo {
  name: string;
  logo: React.ReactNode;
  introduction: string;
  philosophy: string;
  vision: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: {
    youtube: string;
  };
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
}

export interface NewsArticle {
  id: number;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  message?: string;
}