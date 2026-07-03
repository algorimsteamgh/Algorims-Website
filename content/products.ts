import type { Product } from "./types";

export const products = [
  {
    "id": "operations-automation",
    "name": "GenAI Operations Automation",
    "status": "Enterprise platform · AWS-native",
    "live": true,
    "tagline": "Less manual work. More finished work.",
    "body": "An AWS-native platform that automates the end-to-end document lifecycle across finance, HR, and operations — built for Singapore with UEN validation, GST checks, and PayNow matching, all inside your own AWS account.",
    "glyph": "workflow",
    "bgFrom": "hsl(265 85% 60% / 0.18)",
    "bgTo": "hsl(280 95% 70% / 0.16)",
    "accent": "hsl(265 85% 58%)",
    "logoBg": "linear-gradient(135deg, hsl(265 60% 96%), hsl(280 70% 96%))",
    "features": [
      {
        "icon": "scan-text",
        "label": "Document processing",
        "desc": "Invoices, claims, and POs extracted with Singapore UEN & GST validation."
      },
      {
        "icon": "calculator",
        "label": "AR/AP reconciliation",
        "desc": "AI GL coding and bank matching posted to Xero, QuickBooks, SAP."
      },
      {
        "icon": "message-square-text",
        "label": "Conversational assistant",
        "desc": "Natural-language queries over finance, HR, and ops — with cited answers."
      }
    ],
    "readMore": "/solutions/operations-automation"
  },
  {
    "id": "algokisan",
    "name": "Algokisan",
    "status": "Live on Play Store",
    "live": true,
    "tagline": "A direct line from farm to buyer.",
    "body": "Farmers list their produce. Buyers reach out directly — no middlemen, no markup. When either side needs it, transport is built right into the app.",
    "logo": "/assets/products/algokisan.png",
    "bgFrom": "hsl(140 60% 55% / 0.18)",
    "bgTo": "hsl(215 80% 55% / 0.18)",
    "accent": "hsl(140 50% 38%)",
    "logoBg": "linear-gradient(135deg, hsl(140 50% 95%), hsl(215 60% 95%))",
    "features": [
      {
        "icon": "store",
        "label": "Direct listings",
        "desc": "Farmers post produce with photos, quantity, and asking price."
      },
      {
        "icon": "message-square-text",
        "label": "Buyer ↔ seller chat",
        "desc": "Negotiate and confirm orders inside the app."
      },
      {
        "icon": "truck",
        "label": "Optional transport",
        "desc": "Either party can request in-app transport for the load."
      }
    ],
    "cta": {
      "label": "Get on Google Play",
      "href": "#"
    }
  },
  {
    "id": "algoride",
    "name": "Algoride",
    "status": "Live on Play Store",
    "live": true,
    "tagline": "Intercity travel, two ways.",
    "body": "Carpool with people heading the same way, or hire a full vehicle and driver for the trip. Built for the long haul between cities — not for hopping across town.",
    "logo": "/assets/products/algoride.png",
    "bgFrom": "hsl(212 90% 60% / 0.18)",
    "bgTo": "hsl(195 90% 60% / 0.18)",
    "accent": "hsl(212 90% 48%)",
    "logoBg": "linear-gradient(135deg, hsl(212 70% 95%), hsl(195 70% 95%))",
    "modes": [
      {
        "icon": "users-round",
        "title": "Carpooling",
        "desc": "Intercity rides only — riders match with drivers going the same route. Not designed for intra-city trips."
      },
      {
        "icon": "car-front",
        "title": "For-Hire",
        "desc": "Hire a vehicle along with its driver for a planned trip. Owners can publish their vehicles to earn."
      }
    ],
    "safety": [
      {
        "icon": "shield-check",
        "label": "KYC verified"
      },
      {
        "icon": "phone-call",
        "label": "Emergency contact"
      },
      {
        "icon": "map-pin",
        "label": "Live tracking share"
      }
    ],
    "cta": {
      "label": "Get on Google Play",
      "href": "#"
    }
  },
  {
    "id": "algomart",
    "name": "Algomart",
    "status": "Coming Soon",
    "live": false,
    "tagline": "Something's taking flight.",
    "body": "We're not ready to talk about this one yet — but it's moving fast and it's almost here. Drop your email and we'll tell you the moment it lands.",
    "logo": "/assets/products/algomart.png",
    "bgFrom": "hsl(140 70% 55% / 0.15)",
    "bgTo": "hsl(30 95% 60% / 0.15)",
    "accent": "hsl(140 50% 40%)",
    "logoBg": "linear-gradient(135deg, hsl(140 60% 95%), hsl(30 80% 95%))",
    "comingSoon": true
  }
] satisfies Product[];

export const productsById = Object.fromEntries(products.map((product) => [product.id, product])) as Record<string, Product>;
