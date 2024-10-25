export interface ArticleRevision {
    id: number;
    content: string;
    createdAt: string;
    author: {
      id: number;
      username: string;
    };
  }