import React, { useRef } from 'react';
import { FormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { Upload } from 'lucide-react';

interface ImageElementProps {
  element: FormElement;
}

const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        updateElement(element.id, {
          image: {
            ...element.image!,
            src,
            alt: file.name
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const imageStyle = {
    textAlign: element.image?.align || 'left',
    maxWidth: element.image?.width || '100%',
    height: element.image?.height || 'auto',
  };

  return (
    <div style={{ textAlign: element.image?.align || 'left' }}>
      {element.image?.src ? (
        <img
          src={element.image.src}
          alt={element.image.alt}
          style={imageStyle}
          className="max-w-full h-auto"
        />
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageElement;