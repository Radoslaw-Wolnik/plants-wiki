import React from 'react';
import { Dialog, Input, Button, Alert } from '@/components/ui';
import { useGraveyard } from '@/hooks';
import { Flower } from 'lucide-react';

interface AddToGraveyardDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddToGraveyardDialog: React.FC<AddToGraveyardDialogProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [formData, setFormData] = React.useState({
    plantName: '',
    startDate: new Date().toISOString().split('T')[0], // Today's date as default
    endDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = React.useState<string | null>(null);
  const { addToGraveyard } = useGraveyard();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.plantName.trim()) {
      setError('Plant name is required');
      return;
    }

    // Validate dates
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end < start) {
      setError('End date cannot be before start date');
      return;
    }

    try {
      await addToGraveyard({
        plantName: formData.plantName,
        startDate: formData.startDate,
        endDate: formData.endDate
      });
      
      // Reset form and close dialog
      setFormData({
        plantName: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      });
      onClose();
    } catch (err) {
      setError('Failed to add plant to graveyard');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Graveyard"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Input
          name="plantName"
          value={formData.plantName}
          onChange={handleInputChange}
          placeholder="Enter plant name"
          label="Plant Name"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            label="Start Date"
            max={new Date().toISOString().split('T')[0]} // Can't be future date
            required
          />

          <Input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            label="End Date"
            min={formData.startDate} // Can't be before start date
            max={new Date().toISOString().split('T')[0]} // Can't be future date
            required
          />
        </div>

        <div className="pt-4 flex justify-end space-x-2 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
          >
            <Flower className="h-4 w-4 mr-2" />
            Add to Graveyard
          </Button>
        </div>
      </form>
    </Dialog>
  );
};