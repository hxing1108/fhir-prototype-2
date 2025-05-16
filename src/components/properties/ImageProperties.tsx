import React from 'react';
import { IFormElement } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { AlignLeft, AlignCenter, AlignRight, Upload } from 'lucide-react';

interface ImagePropertiesProps {
  element: IFormElement;
}

const defaultImageProps = { src: '', alt: '', width: '100%', height: 'auto', align: 'left' as const };

const ImageProperties: React.FC<ImagePropertiesProps> = ({ element }) => {
  const { updateElement } = useFormContext();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        updateElement(element.id, {
          image: {
            ...(element.image || defaultImageProps),
            src,
            alt: file.name
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlignmentChange = (align: 'left' | 'center' | 'right') => {
    updateElement(element.id, {
      image: { ...(element.image || defaultImageProps), align }
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    updateElement(element.id, {
      image: { ...(element.image || defaultImageProps), [dimension]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Image</label>
        {element.image?.src ? (
          <div className="relative group">
            <img
              src={element.image.src}
              alt={element.image.alt}
              className="w-full h-auto rounded-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-sm btn-secondary"
              >
                <Upload size={16} className="mr-2" />
                Change Image
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click to upload an image</span>
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div>
        <label className="label">Alt Text</label>
        <input
          type="text"
          value={(element.image || defaultImageProps).alt || ''}
          onChange={(e) => updateElement(element.id, {
            image: { ...(element.image || defaultImageProps), alt: e.target.value }
          })}
          className="input"
          placeholder="Enter image description..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Width</label>
          <input
            type="text"
            value={(element.image || defaultImageProps).width || ''}
            onChange={(e) => handleSizeChange('width', e.target.value)}
            className="input"
            placeholder="e.g., 100%, 300px"
          />
        </div>
        <div>
          <label className="label">Height</label>
          <input
            type="text"
            value={(element.image || defaultImageProps).height || ''}
            onChange={(e) => handleSizeChange('height', e.target.value)}
            className="input"
            placeholder="e.g., auto, 200px"
          />
        </div>
      </div>

      <div>
        <label className="label">Alignment</label>
        <div className="flex items-center gap-1 border border-gray-200 rounded-md">
          <button
            type="button"
            onClick={() => handleAlignmentChange('left')}
            className={`p-2 ${element.image?.align === 'left' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleAlignmentChange('center')}
            className={`p-2 ${element.image?.align === 'center' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleAlignmentChange('right')}
            className={`p-2 ${element.image?.align === 'right' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <AlignRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageProperties;