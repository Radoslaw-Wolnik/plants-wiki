// src/lib/api/index.ts
export * from './client';
export * from './types/common';
export * from './types/plant';
export * from './types/user-plant';
export * from './types/article';
export * from './types/room';

// Admin exports
export {
  getAdminStatistics,
  banUser,
  unbanUser,
} from './services/admin';

// Articles exports
export {
  getAllArticles,
  getArticleById,
  createArticle,
  uploadArticlePhoto,
  addArticleComment,
  createDiscussion,
  getDiscussions,
  flagArticle,
} from './services/articles';

// Auth exports
export {
  login,
  register,
  logout,
  getCurrentUser,
} from './services/auth';

// Care Tips exports
export {
  getPlantCareTips,
  createCareTip,
  likeCareTip,
  flagCareTip,
} from './services/care-tips';

// Icons exports
export {
  loadIcon,
  saveIcon,
} from './services/icons';

// Moderation exports
export {
  submitModeratorRequest,
  getModeratorRequests,
  processModeratorRequest,
  reviewFlag,
} from './services/moderation';

// Notifications exports
export {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} from './services/notifications';

// Plants exports
export {
  getAllPlants,
  getPlantById,
  createPlant,
  submitPlantVerification,
  uploadPlantPhoto,
  uploadPlantIcon,
} from './services/plants';

// Rooms exports
export {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from './services/rooms';

// Search exports
export {
  globalSearch,
} from './services/search';

// Trades exports
export {
  getAllTrades,
  createTrade,
  respondToTrade,
} from './services/trades';

// User Plants exports
export {
  getUserPlantById,
  createUserPlant,
  updateUserPlant,
  addWateringLog,
  addFertilizingLog,
  moveUserPlantToRoom,
  addPlantToGraveyard,
} from './services/user-plants';

// Users exports
export {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getGraveyard,
  addToGraveyard,
  removeFromGraveyard,
  getCalendarEvents,
  getFriends,
  addFriend,
  removeFriend,
  searchUsers,
  getNotifications,
  markNotificationRead,
} from './services/users';