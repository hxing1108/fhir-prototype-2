import React, { useState } from 'react';
import { ArrowLeft, Share, Eye, Save, Settings } from 'lucide-react';
import { useFormContext } from '../context/FormContext';

const Header: React.FC = () => {
  const [formName, setFormName] = useState('Untitled Form');
  const { previewMode, togglePreviewMode } = useFormContext();

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
  };

  return (
    <header className="bg-black text-white py-2">
      <div className="w-full px-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-gray-300 hover:text-white">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back</span>
          </button>
          
          <input
            type="text"
            value={formName}
            onChange={handleFormNameChange}
            className="text-lg font-medium bg-transparent border-0 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <button className="nav-button">
            <Settings size={16} className="mr-2" />
            Settings
          </button>
          
          <button className="nav-button">
            <Share size={16} className="mr-2" />
            Share
          </button>
          
          <button 
            className="nav-button"
            onClick={togglePreviewMode}
          >
            <Eye size={16} className="mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          
          <button className="nav-button bg-indigo-600 hover:bg-indigo-700">
            <Save size={16} className="mr-2" />
            Save
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;