import React from 'react';
import { Card } from '@/components/ui';
import { Flag } from 'lucide-react';
import { useUsers } from '@/hooks'; // Add this hook

interface CareTip {
  id: number;
  plantId: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  authorId: number;
}

interface CareTipsListProps {
  plantId: number;
  tips?: CareTip[];
}

const CareTipCard = ({ tip }: { tip: CareTip }) => {
  const { getUser } = useUsers();
  const [authorName, setAuthorName] = React.useState<string>('');

  React.useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const author = await getUser(tip.authorId);
        setAuthorName(author.username);
      } catch (err) {
        console.error('Failed to fetch author:', err);
      }
    };
    fetchAuthor();
  }, [tip.authorId, getUser]);

  return (
    <Card className="mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{tip.title}</h3>
          <button className="hover:text-danger-600">
            <Flag className="h-4 w-4" />
          </button>
        </div>
        <p className="text-neutral-600">{tip.content}</p>
        <div className="mt-2 text-sm text-neutral-500">
          {authorName ? `By ${authorName}` : ''} • {new Date(tip.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};

const CareTipsList: React.FC<CareTipsListProps> = ({ plantId, tips = [] }) => {
  if (!tips.length) {
    return (
      <Card>
        <div className="p-4 text-center text-neutral-500">
          No care tips available for this plant yet.
        </div>
      </Card>
    );
  }

  return (
    <div>
      {tips.map((tip) => (
        <CareTipCard key={tip.id} tip={tip} />
      ))}
    </div>
  );
};

export default CareTipsList;