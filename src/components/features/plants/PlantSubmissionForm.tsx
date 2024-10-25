// src/components/features/plants/PlantSubmissionForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  Input, 
  Textarea, 
  Select, 
  Toggle, 
  Button,
  Alert 
} from '@/components/ui';
import { usePlantSubmission } from '@/hooks/features/plants/usePlantSubmission';

const plantSubmissionSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  scientificName: z.string().min(3, 'Scientific name must be at least 3 characters'),
  commonName: z.string().min(3, 'Common name must be at least 3 characters'),
  family: z.string().min(3, 'Family must be at least 3 characters'),
  light: z.string().min(1, 'Light requirement is required'),
  temperature: z.string().min(1, 'Temperature requirement is required'),
  soil: z.string().min(1, 'Soil requirement is required'),
  climate: z.string().min(1, 'Climate requirement is required'),
  humidity: z.string().min(1, 'Humidity requirement is required'),
  growthCycle: z.string().min(1, 'Growth cycle is required'),
  toxicity: z.string().min(1, 'Toxicity information is required'),
  petSafe: z.boolean(),
  plantType: z.string().min(1, 'Plant type is required'),
});

type PlantSubmissionFormData = z.infer<typeof plantSubmissionSchema>;

interface PlantSubmissionFormProps {
  onIconCreated: (iconData: string) => void;
  onImageUploaded: (imageUrl: string) => void;
}

export const PlantSubmissionForm: React.FC<PlantSubmissionFormProps> = ({
  onIconCreated,
  onImageUploaded,
}) => {
  const { submitPlant, isLoading, error } = usePlantSubmission();
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<PlantSubmissionFormData>({
    resolver: zodResolver(plantSubmissionSchema),
  });

  const onSubmit = async (data: PlantSubmissionFormData) => {
    try {
      await submitPlant({
        ...data,
        icon: '', // Will be set by pixel art editor
        image: '', // Will be set by image upload
      });
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="danger">
          Failed to submit plant. Please try again.
        </Alert>
      )}

      <Card>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
          
          <Input
            label="Plant Name"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Scientific Name"
            {...register('scientificName')}
            error={errors.scientificName?.message}
          />

          <Input
            label="Common Name"
            {...register('commonName')}
            error={errors.commonName?.message}
          />

          <Input
            label="Family"
            {...register('family')}
            error={errors.family?.message}
          />
        </div>
      </Card>

      <Card>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Care Requirements</h3>
          
          <Select
            label="Light Requirement"
            options={[
              { value: 'low', label: 'Low Light' },
              { value: 'medium', label: 'Medium Light' },
              { value: 'high', label: 'High Light' },
            ]}
            value={watch('light')}
            onChange={(value) => setValue('light', value)}
            error={errors.light?.message}
          />

          <Textarea
            label="Temperature Requirements"
            {...register('temperature')}
            error={errors.temperature?.message}
          />

          <Textarea
            label="Soil Requirements"
            {...register('soil')}
            error={errors.soil?.message}
          />

          <Input
            label="Climate"
            {...register('climate')}
            error={errors.climate?.message}
          />

          <Select
            label="Humidity"
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            value={watch('humidity')}
            onChange={(value) => setValue('humidity', value)}
            error={errors.humidity?.message}
          />
        </div>
      </Card>

      <Card>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
          
          <Select
            label="Growth Cycle"
            options={[
              { value: 'perennial', label: 'Perennial' },
              { value: 'annual', label: 'Annual' },
              { value: 'biennial', label: 'Biennial' },
            ]}
            value={watch('growthCycle')}
            onChange={(value) => setValue('growthCycle', value)}
            error={errors.growthCycle?.message}
          />

          <Textarea
            label="Toxicity Information"
            {...register('toxicity')}
            error={errors.toxicity?.message}
          />

          <Toggle
            label="Pet Safe"
            checked={watch('petSafe')}
            onChange={(checked) => setValue('petSafe', checked)}
          />

          <Select
            label="Plant Type" // < --------------------------------- change those types
            options={[
              { value: 'indoor', label: 'Indoor' },
              { value: 'outdoor', label: 'Outdoor' },
              { value: 'both', label: 'Both' },
            ]}
            value={watch('plantType')}
            onChange={(value) => setValue('plantType', value)}
            error={errors.plantType?.message}
          />
        </div>
      </Card>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Submitting...' : 'Submit Plant for Verification'}
      </Button>
    </form>
  );
};