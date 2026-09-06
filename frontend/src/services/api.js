import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health
  getHealth: async () => {
    try {
      const res = await client.get('/health');
      return res.data;
    } catch (err) {
      console.warn('API health check fallback:', err);
      return { status: 'offline' };
    }
  },

  // Content (Director Mode)
  getContent: async () => {
    try {
      const res = await client.get('/content');
      return res.data;
    } catch (err) {
      console.warn('Failed to load remote content, using fallback:', err);
      return null;
    }
  },

  updateContent: async (contentMap) => {
    try {
      const res = await client.put('/content', { content: contentMap });
      return res.data;
    } catch (err) {
      console.error('Failed to save content to backend:', err);
      throw err;
    }
  },

  // Wishes
  getWishes: async () => {
    try {
      const res = await client.get('/wishes');
      return res.data;
    } catch (err) {
      console.warn('Failed to fetch wishes:', err);
      return [];
    }
  },

  createWish: async (wishData) => {
    try {
      const res = await client.post('/wishes', wishData);
      return res.data;
    } catch (err) {
      console.error('Failed to create wish:', err);
      throw err;
    }
  },

  deleteWish: async (id) => {
    try {
      await client.delete(`/wishes/${id}`);
      return true;
    } catch (err) {
      console.error('Failed to delete wish:', err);
      return false;
    }
  },

  // Photos
  getPhotos: async () => {
    try {
      const res = await client.get('/photos');
      return res.data;
    } catch (err) {
      console.warn('Failed to fetch photos:', err);
      return [];
    }
  },

  uploadPhoto: async (photoData) => {
    try {
      const res = await client.post('/photos/upload', photoData);
      return res.data;
    } catch (err) {
      console.error('Failed to upload photo:', err);
      throw err;
    }
  },

  // Map Pins
  getPins: async () => {
    try {
      const res = await client.get('/map-pins');
      return res.data;
    } catch (err) {
      console.warn('Failed to fetch map pins:', err);
      return [];
    }
  },

  createPin: async (pinData) => {
    try {
      const res = await client.post('/map-pins', pinData);
      return res.data;
    } catch (err) {
      console.error('Failed to create pin:', err);
      throw err;
    }
  },

  // Secret Verification
  verifySecret: async (code) => {
    try {
      const res = await client.post('/secret/verify', { code });
      return res.data;
    } catch (err) {
      console.error('Failed to verify secret code:', err);
      return { success: false, message: 'Server verification error' };
    }
  },

  // Share Cards
  getCards: async () => {
    try {
      const res = await client.get('/cards');
      return res.data;
    } catch (err) {
      console.warn('Failed to fetch cards:', err);
      return [];
    }
  },

  saveCard: async (cardData) => {
    try {
      const res = await client.post('/cards/save', cardData);
      return res.data;
    } catch (err) {
      console.error('Failed to save card:', err);
      throw err;
    }
  },
};

export default apiService;
