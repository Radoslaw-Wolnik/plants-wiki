// src/components/ui/image-upload.tsx
import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Button from './button';

export interface ImageUploadProps {
  value?: string[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  maxSize?: number; // in MB
  accept?: string;
  preview?: boolean;
  maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  multiple = false,
  maxSize = 5, // 5MB default
  accept = 'image/*',
  preview = true,
  maxFiles = 5
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(value);

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];
    const newPreviews: string[] = [...previews];
    
    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxSize}MB`);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not an image`);
        return;
      }

      // Check max files
      if (multiple && previews.length + validFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      validFiles.push(file);

      // Create preview
      if (preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);
          setPreviews(newPreviews);
        };
        reader.readAsDataURL(file);
      }
    });

    if (validFiles.length > 0) {
      onChange(validFiles);
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const removePreview = (index: number) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          relative p-6 border-2 border-dashed rounded-lg
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300'}
          transition-colors duration-200 ease-in-out
        `}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <Upload className="h-10 w-10 text-neutral-400" />
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleButtonClick}
            >
              Choose files
            </Button>
            <p className="text-sm text-neutral-500 mt-2">
              or drag and drop here
            </p>
          </div>
          <p className="text-xs text-neutral-400">
            {multiple ? `Up to ${maxFiles} files` : 'Single file'}, max {maxSize}MB each
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-danger-500">{error}</p>
      )}

      {preview && previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 p-1 bg-white rounded-full"
                onClick={() => removePreview(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};