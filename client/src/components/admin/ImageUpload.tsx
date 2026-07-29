import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>

      {value ? (
        /* Preview mode */
        <div className="relative w-full max-w-[180px]">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full aspect-square rounded-xl object-cover border border-border shadow-sm"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-white border border-border rounded-full shadow-sm hover:bg-muted transition-colors duration-200 cursor-pointer"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Upload zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <Upload size={24} className="text-foreground-muted mb-1.5" />
          <p className="text-sm text-foreground-muted font-medium">Click or drag to upload</p>
          <p className="text-xs text-foreground-muted/70 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
        </div>
      )}
    </div>
  );
}
