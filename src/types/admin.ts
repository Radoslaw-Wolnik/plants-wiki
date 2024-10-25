export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalPlants: number;
    totalArticles: number;
    totalComments: number;
    flaggedContent: number;
    moderationQueue: number;
    pendingVerifications: number;
    reportedContent: number;
    newUsersToday: number;
    topContributors: Array<{
      id: number;
      username: string;
      contributions: number;
    }>;
  }

  export interface AdminUser {
    id: number;
    username: string;
    email: string;
    role: 'USER' | 'MODERATOR' | 'ADMIN';
    createdAt: string;
    isBanned: boolean;
    stats: {
      plants: number;
      articles: number;
      reports: number;
    };
  }