// src/lib/api/index.ts
export * from './client';
export * from './types/common';
export * from './types/plant';
export * from './types/user-plant';
export * from './types/article';
export * from './types/room';

export { plants } from './services/plants';
export { userPlants } from './services/user-plants';
export { articles } from './services/articles';
export { rooms } from './services/rooms';
export { moderation } from './services/moderation';
export { notifications } from './services/notifications';
export { trades } from './services/trades';
export { icons } from './services/icons';
export { careTips } from './services/care-tips';
export { search } from './services/search';