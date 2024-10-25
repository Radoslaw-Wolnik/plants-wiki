import React from 'react';
import { Dialog, Input, Button, Alert } from '@/components/ui';
import { useWishlist } from '@/hooks';
import { Plus } from 'lucide-react';

interface AddToWishlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddToWishlistDialog: React.FC<AddToWishlistDialogProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [plantName, setPlantName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const { addToWishlist } = useWishlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim()) {
      setError('Plant name is required');
      return;
    }

    try {
      await addToWishlist({ plantName });
      setPlantName('');
      onClose();
    } catch (err) {
      setError('Failed to add plant to wishlist');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Wishlist"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Input
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          placeholder="Enter plant name"
          label="Plant Name"
        />

        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Add to Wishlist
          </Button>
        </div>
      </form>
    </Dialog>
  );
};