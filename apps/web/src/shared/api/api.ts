import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
  // Le jeton d'accès est un cookie httpOnly posé par l'API.
  withCredentials: true,
});
