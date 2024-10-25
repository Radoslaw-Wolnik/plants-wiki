import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Select, Alert, Tabs } from '@/components/ui';
import { usePlants, useArticleEditor } from '@/hooks';
import { ImageUpload } from '@/components/ui';
import { MarkdownEditor } from './MarkdownEditor';
import { Save } from 'lucide-react';

interface ArticleEditorProps {
  initialContent?: {
    title: string;
    content: string;
    plantId?: number;
    images?: string[];
  };
  onSave: (id: number) => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ initialContent, onSave }) => {
  const { content, setContent, uploadImage, saveArticle } = useArticleEditor();
  const { plants } = usePlants();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize content with initialContent if provided
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent, setContent]);

  const handleImageUpload = async (file: File) => {
    try {
      await uploadImage(file);
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const handleSave = async (isDraft = false) => {
    try {
      setIsSaving(true);
      setError(null);
      const article = await saveArticle(); // Assume it returns an article object
      if (article && article.id) {
        onSave(article.id);
      }
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
            onChange={(e) => setContent((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Enter article title..."
            required
          />

          <Select
            label="Related Plant"
            value={content.plantId?.toString() || ''}
            onChange={(e) => setContent((prev) => ({ ...prev, plantId: e.target.value ? parseInt(e.target.value) : undefined }))}
            options={[
              { value: '', label: 'Select a plant' },
              ...plants.map((plant) => ({
                value: plant.id.toString(),
                label: plant.name,
              })),
            ]}
          />

          <MarkdownEditor
            value={content.content}
            onChange={(value) => setContent((prev) => ({ ...prev, content: value }))}
            onImageUpload={handleImageUpload} // Changed to accept a single file
          />
        </div>
      ),
    },
    {
      id: 'images',
      label: 'Images',
      content: (
        <div>
          <ImageUpload onChange={(files) => files.forEach(handleImageUpload)} multiple />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {content.images?.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img src={url} alt={`Uploaded image ${index + 1}`} className="object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <div className="border-b border-neutral-200">
          <div className="p-4 flex justify-between items-center">
            <Button variant="success" onClick={() => handleSave(false)} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Publish
            </Button>
            <Button variant="ghost" onClick={() => handleSave(true)} disabled={isSaving}>
              Save Draft
            </Button>
          </div>
        </div>
        <Tabs tabs={tabs} />
      </Card>
    </div>
  );
};
