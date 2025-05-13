import React, { useState } from 'react';
import { Menu, ArrowLeft, Share, Eye, Save, MoreVertical, Settings } from 'lucide-react';
import { useFormContext } from '../context/FormContext';

const Header: React.FC = () => {
  const [formName, setFormName] = useState('Untitled Form');
  const { previewMode, togglePreviewMode } = useFormContext();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3">
      <div className="w-[98%] mx-auto flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center">
          <button 
            className="mr-4 p-2 rounded-md hover:bg-gray-100 lg:hidden"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={20} />
          </button>
          
          <button className="mr-4 flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} className="mr-1" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <div className="flex items-center">
            <input
              type="text"
              value={formName}
              onChange={handleFormNameChange}
              className="text-lg font-medium bg-transparent border-0 focus:outline-none focus:ring-0 w-[180px] sm:w-auto"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <button className="btn btn-sm btn-secondary hidden sm:flex items-center">
            <Settings size={16} className="mr-1" />
            <span>Settings</span>
          </button>
          
          <button className="btn btn-sm btn-secondary hidden md:flex items-center">
            <Share size={16} className="mr-1" />
            <span>Share</span>
          </button>
          
          <button 
            className="btn btn-sm btn-secondary flex items-center"
            onClick={togglePreviewMode}
          >
            <Eye size={16} className="mr-1" />
            <span className="hidden sm:inline">{previewMode ? 'Edit' : 'Preview'}</span>
          </button>
          
          <button className="btn btn-sm btn-primary flex items-center">
            <Save size={16} className="mr-1" />
            <span className="hidden sm:inline">Save</span>
          </button>
          
          <button className="p-2 rounded-md hover:bg-gray-100">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4 shadow-md animate-entrance absolute w-full z-10">
          <div className="flex flex-col space-y-2">
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <Settings size={16} className="mr-2" />
              <span>Settings</span>
            </button>
            <button className="flex items-center p-2 hover:bg-gray-100 rounded-md">
              <Share size={16} className="mr-2" />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;