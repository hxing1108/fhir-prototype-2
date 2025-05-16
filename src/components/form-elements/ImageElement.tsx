import React, { useRef } from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { Upload } from 'lucide-react';

interface ImageElementProps {
  element: IFormElement;
}

const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const { updateElement } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const src = loadEvent.target?.result as string;
        updateElement(element.id, {
          image: {
            src: src,
            alt: element.image?.alt || file.name,
            width: element.image?.width || '100%',
            height: element.image?.height || 'auto',
            align: element.image?.align || 'left',
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const textAlignStyle = element.image?.align || 'left';

  const imgStyle: React.CSSProperties = {
    maxWidth: element.image?.width || '100%',
    height: element.image?.height || 'auto',
    display: 'inline-block',
  };

  return (
    <div style={{ textAlign: textAlignStyle }}>
      {element.image?.src ? (
        <img
          src={element.image.src}
          alt={element.image.alt || ''}
          style={imgStyle}
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