// List of 51 curated Dhanya memory photos — served from backend/media/photos/
// Paths are dynamically resolved using backend origin if VITE_API_BASE_URL is an external host,
// or as relative /media/photos/ for Vite dev proxy and single-domain hosting.
const apiBase = import.meta.env.VITE_API_BASE_URL || '';
let backendOrigin = '';
try {
  if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
    backendOrigin = new URL(apiBase).origin;
  }
} catch {
  backendOrigin = '';
}

export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${backendOrigin}${url}`;
  }
  return `${backendOrigin}/${url}`;
};

const BACKEND_PHOTOS_BASE = `${backendOrigin}/media/photos`;

export const DHANYA_PHOTOS = [
  `${BACKEND_PHOTOS_BASE}/Snapchat-1843135019.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-312305450.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1794566057.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1952006319.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-902852403.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-888638711.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1701119568.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1910911787.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1343512516.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-656659172.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1204675420.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-188724693.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-2132198044.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-904955455.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-2004962484.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-2146259258.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-431641921.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1645078834.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1188259774.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1971537399.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-873355464.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1975455454.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1353788397.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1477508741.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-419560338.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1950890127.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1845559573.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1086830591.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1968662157.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-895357841.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-607923743.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-146109384.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1246159396.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1558714196.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1057071900.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-171689857.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-225450320.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1156384205.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1558456407.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-2045931443.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-2024342004.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-822837660.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-669093889.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-2066916262.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-190173052.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1359696763.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1667074281.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-166734657.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-389663268.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-837867980.jpg`,
  `${BACKEND_PHOTOS_BASE}/Snapchat-1804065572.jpg`,
];

export const getPhotoForSlot = (slotId, customPhotos = {}) => {
  if (customPhotos[slotId]?.image_url) {
    return resolveMediaUrl(customPhotos[slotId].image_url);
  }
  
  // Deterministic mapping for default slots
  if (slotId.startsWith('scene_')) {
    const num = parseInt(slotId.replace('scene_', ''), 10) || 1;
    return DHANYA_PHOTOS[(num - 1) % DHANYA_PHOTOS.length];
  }
  
  if (slotId.startsWith('polaroid_')) {
    const num = parseInt(slotId.replace('polaroid_', ''), 10) || 0;
    return DHANYA_PHOTOS[(num + 4) % DHANYA_PHOTOS.length];
  }

  if (slotId.startsWith('gallery_')) {
    const num = parseInt(slotId.replace('gallery_', ''), 10) || 0;
    return DHANYA_PHOTOS[(num + 12) % DHANYA_PHOTOS.length];
  }

  if (slotId.startsWith('carousel_')) {
    const num = parseInt(slotId.replace('carousel_', ''), 10) || 0;
    return DHANYA_PHOTOS[(num + 28) % DHANYA_PHOTOS.length];
  }

  return DHANYA_PHOTOS[0];
};
