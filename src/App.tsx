import React from 'react';
import Header from './components/Header';
import EditorLayout from './layouts/EditorLayout';
import FormBuilder from './components/FormBuilder';
import ElementsSidebar from './components/ElementsSidebar';
import PropertiesSidebar from './components/PropertiesSidebar';
import { FormProvider } from './context/FormContext';

function App() {
  return (
    <FormProvider>
      <div className="h-screen flex flex-col bg-gray-50 text-gray-900 font-sans overflow-hidden">
        <Header />
        <EditorLayout
          leftSidebar={<ElementsSidebar />}
          mainContent={<FormBuilder />}
          rightSidebar={<PropertiesSidebar />}
        />
      </div>
    </FormProvider>
  );
}

export default App;