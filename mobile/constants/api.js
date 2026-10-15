const rawUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001/api";

export const API_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;