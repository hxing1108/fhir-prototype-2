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
    <div className="flex flex-1 pt-14">
      {/* Left sidebar - Elements */}
      {!previewMode && (
        <aside className="fixed top-14 left-0 w-64 h-[calc(100vh-3.5rem)] border-r border-gray-200 bg-white hidden md:block overflow-y-auto z-30">
          {leftSidebar}
        </aside>
      )}

      {/* Main content area - Form Builder */}
      <main 
        className={`overflow-y-auto h-[calc(100vh-3.5rem)] 
                    ${previewMode 
                      ? 'max-w-3xl mx-auto w-full' 
                      : 'flex-1 ml-64 mr-72'}`}
      >
        {mainContent}
      </main>

      {/* Right sidebar - Properties */}
      {!previewMode && (
        <aside className="fixed top-14 right-0 w-72 h-[calc(100vh-3.5rem)] border-l border-gray-200 bg-white hidden lg:block overflow-y-auto z-30">
          {rightSidebar}
        </aside>
      )}
    </div>
  );
};

export default EditorLayout;