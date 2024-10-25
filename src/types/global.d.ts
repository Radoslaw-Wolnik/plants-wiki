// types/global.d.ts
declare global {
  // Re-export everything from prisma.ts
  export * from './prisma';
  export * from './admin';
  export * from './articles';
  export * from './image-editor';
  export * from './filters';
  
  // Re-export API types
  export * from './api/common';
  export * from './api/auth';
  export * from './api/responses';
  export * from './api/relations';
  export * from './api/users';
  


  // Additional global types that might be needed
  export interface Window {
    ENV?: {
      API_URL: string;
      // other env variables
    };
  }

  // Additional type declarations
  declare module 'sharp' {
    export * from 'sharp';
  }

}

export {};