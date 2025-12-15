// Environment configuration using Vite environment variables
// These values are injected at build time from .env files

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dms-redevabilite.com:8443";

const DEPLOYMENT_URL = import.meta.env.VITE_DEPLOYMENT_URL || "https://mybsd.shop/";

const PUSHER_BASE_URL = import.meta.env.VITE_PUSHER_BASE_URL || "https://mybsd.shop";

const PUSHER_APP_KEY = import.meta.env.VITE_PUSHER_APP_KEY || "44c99c1fccbbcdb8d6fd";

const PUSHER_APP_CLUSTER = import.meta.env.VITE_PUSHER_APP_CLUSTER || "eu";

const FRONT_BASE_URL = window.location.origin + "/";

export { API_BASE_URL, PUSHER_APP_CLUSTER, PUSHER_APP_KEY, PUSHER_BASE_URL, FRONT_BASE_URL };
