// src/components/features/articles/MarkdownEditor.tsx
import React from 'react';
import { Button } from '@/components/ui';
import { 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon,
  Image,
  Code,
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<void>;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onImageUpload,
}) => {
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = value.substring(start, end);
    const newText = 
      value.substring(0, start) +
      before +
      selection +
      after +
      value.substring(end);

    onChange(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const handleImageUpload = async () => {
    if (!onImageUpload) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await onImageUpload(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2 border-b border-neutral-200 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('**', '**')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('*', '*')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('- ')}
          title="List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('[', '](url)')}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleImageUpload}
          title="Image"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('`', '`')}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[400px] p-4 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
        placeholder="Write your article content here..."
      />
    </div>
  );
};