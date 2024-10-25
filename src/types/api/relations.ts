// types/api/relations.ts
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


export type UserWithLibrary = Prisma.UserGetPayload<{
    include: { 
      library: {
        include: {
          userPlants: true;
        };
      };
    };
  }>;
  
  export type ArticleWithDetails = Prisma.ArticleGetPayload<{
    include: {
      plant: true;
      contributors: true;
      comments: {
        include: {
          user: true;
        };
      };
      photos: true;
    };
  }>;