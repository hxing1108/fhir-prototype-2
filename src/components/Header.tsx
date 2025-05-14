import React, { useState } from 'react';
import { ArrowLeft, Eye, Save, ChevronDown, FileDown } from 'lucide-react';
import { useFormContext } from '../context/FormContext';

const Header: React.FC = () => {
  const [formName, setFormName] = useState('Untitled Form');
  const { previewMode, togglePreviewMode } = useFormContext();
  const [showImportMenu, setShowImportMenu] = useState(false);

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
  };

  return (
    <header className="bg-[#F5F6F8] text-gray-900 py-2">
      <div className="w-full px-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
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
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button 
              className="btn btn-secondary flex items-center"
              onClick={() => setShowImportMenu(!showImportMenu)}
            >
              Import
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {showImportMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button 
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    // Handle import template
                    setShowImportMenu(false);
                  }}
                >
                  Import Template
                </button>
                <button 
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    // Handle import data
                    setShowImportMenu(false);
                  }}
                >
                  Import Data
                </button>
              </div>
            )}
          </div>
          
          <button className="btn btn-secondary flex items-center">
            <FileDown size={16} className="mr-2" />
            Download XML
          </button>
          
          <button 
            className="btn btn-secondary flex items-center"
            onClick={togglePreviewMode}
          >
            <Eye size={16} className="mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          
          <button className="btn btn-primary flex items-center">
            <Save size={16} className="mr-2" />
            Save
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;