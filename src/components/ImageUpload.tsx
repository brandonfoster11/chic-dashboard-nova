import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onImageRemove?: (index: number) => void;
  uploadedImages?: File[];
  maxImages?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export function ImageUpload({
  onImageUpload,
  onImageRemove,
  uploadedImages = [],
  maxImages = 5,
  maxSizeInMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    validateAndUploadFile(files[0]);
    
    // Reset the input value so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateAndUploadFile = (file: File) => {
    setError(null);
    
    // Check if maximum number of images is reached
    if (uploadedImages.length >= maxImages) {
      setError(`Maximum of ${maxImages} images allowed`);
      return;
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`File type not supported. Please upload ${allowedTypes.map(type => type.split('/')[1]).join(', ')} files`);
      return;
    }
    
    // Check file size
    if (file.size > maxSizeInBytes) {
      setError(`File size exceeds ${maxSizeInMB}MB limit`);
      return;
    }
    
    onImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    validateAndUploadFile(files[0]);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">
            Drag and drop an image, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            {allowedTypes.map(type => type.split('/')[1]).join(', ')} files up to {maxSizeInMB}MB
          </p>
        </div>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
          className="hidden"
        />
      </div>
      
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {uploadedImages.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-md overflow-hidden border bg-background">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {onImageRemove && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageRemove(index);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <p className="text-xs truncate mt-1">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
