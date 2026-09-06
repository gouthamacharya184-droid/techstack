// List of 51 curated Dhanya memory photos available in public/photos/
export const DHANYA_PHOTOS = [
  '/photos/Snapchat-1843135019.jpg',
  '/photos/Snapchat-312305450.jpg',
  '/photos/Snapchat-1794566057.jpg',
  '/photos/Snapchat-1952006319.jpg',
  '/photos/Snapchat-902852403.jpg',
  '/photos/Snapchat-888638711.jpg',
  '/photos/Snapchat-1701119568.jpg',
  '/photos/Snapchat-1910911787.jpg',
  '/photos/Snapchat-1343512516.jpg',
  '/photos/Snapchat-656659172.jpg',
  '/photos/Snapchat-1204675420.jpg',
  '/photos/Snapchat-188724693.jpg',
  '/photos/Snapchat-2132198044.jpg',
  '/photos/Snapchat-904955455.jpg',
  '/photos/Snapchat-2004962484.jpg',
  '/photos/Snapchat-2146259258.jpg',
  '/photos/Snapchat-431641921.jpg',
  '/photos/Snapchat-1645078834.jpg',
  '/photos/Snapchat-1188259774.jpg',
  '/photos/Snapchat-1971537399.jpg',
  '/photos/Snapchat-873355464.jpg',
  '/photos/Snapchat-1975455454.jpg',
  '/photos/Snapchat-1353788397.jpg',
  '/photos/Snapchat-1477508741.jpg',
  '/photos/Snapchat-419560338.jpg',
  '/photos/Snapchat-1950890127.jpg',
  '/photos/Snapchat-1845559573.jpg',
  '/photos/Snapchat-1086830591.jpg',
  '/photos/Snapchat-1968662157.jpg',
  '/photos/Snapchat-895357841.jpg',
  '/photos/Snapchat-607923743.jpg',
  '/photos/Snapchat-146109384.jpg',
  '/photos/Snapchat-1246159396.jpg',
  '/photos/Snapchat-1558714196.jpg',
  '/photos/Snapchat-1057071900.jpg',
  '/photos/Snapchat-171689857.jpg',
  '/photos/Snapchat-225450320.jpg',
  '/photos/Snapchat-1156384205.jpg',
  '/photos/Snapchat-1558456407.jpg',
  '/photos/Snapchat-2045931443.jpg',
  '/photos/Snapchat-2024342004.jpg',
  '/photos/Snapchat-822837660.jpg',
  '/photos/Snapchat-669093889.jpg',
  '/photos/Snapchat-2066916262.jpg',
  '/photos/Snapchat-190173052.jpg',
  '/photos/Snapchat-1359696763.jpg',
  '/photos/Snapchat-1667074281.jpg',
  '/photos/Snapchat-166734657.jpg',
  '/photos/Snapchat-389663268.jpg',
  '/photos/Snapchat-837867980.jpg',
  '/photos/Snapchat-1804065572.jpg'
];

export const getPhotoForSlot = (slotId, customPhotos = {}) => {
  if (customPhotos[slotId]?.image_url) {
    return customPhotos[slotId].image_url;
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
