// src/components/features/articles/ArticleEditor.tsx
import React, { useState } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Select, 
  Alert,
  Tabs,
} from '@/components/ui';
import { useArticleEditor } from '@/hooks/useArticleEditor';
import { usePlants } from '@/hooks/usePlants';
import { ImageUpload } from '@/components/ui/image-upload';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { Save, Eye, Image as ImageIcon } from 'lucide-react';

interface ArticleEditorProps {
  initialContent?: {
    title: string;
    content: string;
    plantId?: number;
  };
  onSave: (articleId: number) => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  initialContent,
  onSave,
}) => {
  const { content, setContent, uploadImage, saveArticle } = useArticleEditor();
  const { plants } = usePlants();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      setContent(prev => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const handleSave = async (isDraft: boolean = false) => {
    try {
      setIsSaving(true);
      setError(null);
      const article = await saveArticle(isDraft);
      onSave(article.id);
    } catch (err) {
      setError('Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    {
      id: 'edit',
      label: 'Edit',
      content: (
        <div className="space-y-4">
          <Input
            label="Title"
            value={content.title}
            onChange={(e) => setContent(prev => ({
              ...prev,
              title: e.target.value,
            }))}
            placeholder="Enter article title..."
            required
          />

          <Select
            label="Related Plant"
            value={content.plantId?.toString() || ''}
            onChange={(e) => setContent(prev => ({
              ...prev,
              plantId: parseInt(e.target.value),
            }))}
            options={[
              { value: '', label: 'Select a plant' },
              ...plants.map(plant => ({
                value: plant.id.toString(),
                label: plant.name,
              })),
            ]}
          />

          <MarkdownEditor
            value={content.content}
            onChange={(value) => setContent(prev => ({
              ...prev,
              content: value,
            }))}
            onImageUpload={handleImageUpload}
          />
        </div>
      ),
    },
    {
      id: 'preview',
      label: 'Preview',
      content: (
        <div className="prose max-w-none">
          <h1>{content.title}</h1>
          {content.plantId && (
            <p className="text-neutral-600">
              Related Plant: {plants.find(p => p.id === content.plantId)?.name}
            </p>
          )}
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        </div>
      ),
    },
    {
      id: 'images',
      label: 'Images',
      content: (
        <div>
          <ImageUpload onUpload={handleImageUpload} multiple />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {content.images.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Card>
        <div className="border-b border-neutral-200">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="success"
                onClick={() => handleSave(false)}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Publish
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleSave(true)}
                disabled={isSaving}
              >
                Save Draft
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs tabs={tabs} />
      </Card>
    </div>
  );
};