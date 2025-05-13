import React from 'react';
import { useFormContext } from '../context/FormContext';

interface EditorLayoutProps {
  leftSidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar: React.ReactNode;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  leftSidebar,
  mainContent,
  rightSidebar,
}) => {
  const { previewMode } = useFormContext();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left sidebar - Elements */}
      {!previewMode && (
        <div className="w-64 border-r border-gray-200 bg-white hidden md:block">
          {leftSidebar}
        </div>
      )}

      {/* Main content area - Form Builder */}
      <div className={`flex-1 overflow-auto ${previewMode ? 'max-w-3xl mx-auto' : ''}`}>
        {mainContent}
      </div>

      {/* Right sidebar - Properties */}
      {!previewMode && (
        <div className="w-72 border-l border-gray-200 bg-white hidden lg:block">
          {rightSidebar}
        </div>
      )}
    </div>
  );
};

export default EditorLayout;