// src/components/articles/CommentForm.tsx

import React, { useState } from 'react';
import { Button, TextArea } from '../common';

interface CommentFormProps {
  onSubmit: (content: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
      />
      <Button type="submit" className="mt-2">
        Submit
      </Button>
    </form>
  );
};

export default CommentForm;