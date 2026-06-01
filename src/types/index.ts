export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "business";
  credits: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  duration: number;
  format: string;
  views: number;
  conversions: number;
}

export interface Template {
  id: string;
  name: string;
  category: "fashion" | "streetwear" | "luxury" | "sportswear" | "ecommerce";
  thumbnail: string;
  isPremium: boolean;
  uses: number;
  tags: string[];
}

export interface Asset {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
  size: number;
  createdAt: string;
  dimensions?: { width: number; height: number };
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  description: string;
  features: string[];
  popular?: boolean;
  credits: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface AnalyticsStat {
  label: string;
  value: number;
  change: number;
  format: "number" | "currency" | "percentage";
}

export interface ChartData {
  name: string;
  videos: number;
  views: number;
  conversions: number;
}
