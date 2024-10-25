// src/components/features/articles/ArticleViewer.tsx
import React from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { DiscussionThread } from '@/components/features/discussions/DiscussionThread';
import { Edit, MessageCircle } from 'lucide-react';
import { Article } from '@/types';
import { formatDate } from '@/utils/general.util';
import Link from 'next/link';
import { useAuth } from '@/hooks';

interface ArticleViewerProps {
  article: Article;
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({ article }) => {
  const { user } = useAuth();
  const canEdit = user && (
    user.role === 'ADMIN' || 
    article.contributors.some(c => c.id === user.id)
  );

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{article.title}</h1>
              <div className="mt-2 space-x-2">
                {article.contributors.map((contributor) => (
                  <Badge key={contributor.id}>
                    {contributor.username}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-neutral-600 mt-2">
                Last updated: {formatDate(article.updatedAt)}
              </p>
            </div>
            {canEdit && (
              <Link href={`/articles/${article.id}/edit`}>
                <Button variant="ghost">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
          </div>

          <div className="prose max-w-none mt-6">
            {article.content}
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            <MessageCircle className="h-5 w-5 inline-block mr-2" />
            Discussions
          </h2>
          <DiscussionThread articleId={article.id} />
        </div>
      </Card>
    </div>
  );
};