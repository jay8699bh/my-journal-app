import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { JournalHeader } from './JournalHeader';

interface EditorProps {
  initialContent: string;
  initialTitle?: string;
  initialImages?: string[];
  onSave: (content: string, title: string, images: string[]) => void;
  placeholder?: string;
  onUpload: (file: File) => Promise<string>;
  date: Date;
}

export function Editor({ 
  initialContent, 
  initialTitle = '',
  initialImages = [], 
  onSave, 
  placeholder,
  onUpload,
  date
}: EditorProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [images, setImages] = useState<string[]>(initialImages);

  useEffect(() => {
    setContent(initialContent);
    setTitle(initialTitle);
    setImages(initialImages || []);
  }, [initialContent, initialTitle, initialImages]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <JournalHeader
        title={title}
        onTitleChange={setTitle}
        date={date}
      />
      <div className="space-y-6">
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          onUpload={onUpload}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full h-64 p-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <button
          onClick={() => onSave(content, title, images)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Entry
        </button>
      </div>
    </div>
  );
}