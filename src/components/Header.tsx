import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  Save,
  ChevronDown,
  FileDown,
  Info,
  Download,
  X,
} from 'lucide-react';
import { useFormContext } from '../context/FormContext';
import FHIRMetadataDialog from './FHIRMetadataDialog';
import { FHIRXMLExportService } from '../services/FHIRXMLExportService';

const Header: React.FC = () => {
  const [formName, setFormName] = useState('Untitled Form');
  const {
    previewMode,
    togglePreviewMode,
    formMetadata,
    updateFormMetadata,
    exportToFHIRQuestionnaire,
    exportToFHIRQuestionnaireResponse,
  } = useFormContext();
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFHIRMetadataDialog, setShowFHIRMetadataDialog] = useState(false);
  const [showMetadataDialog, setShowMetadataDialog] = useState(false);

  // Initialize XML export service
  const xmlExportService = new FHIRXMLExportService();

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
    // Also update the form title in the metadata
    updateFormMetadata({ title: e.target.value });
  };

  // Export as FHIR Questionnaire
  const handleExportQuestionnaire = () => {
    const questionnaire = exportToFHIRQuestionnaire();
    const jsonString = JSON.stringify(questionnaire, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formMetadata.title || formName || 'questionnaire'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
  };

  // Export as FHIR QuestionnaireResponse
  const handleExportQuestionnaireResponse = () => {
    if (!previewMode) {
      alert(
        'Please enable preview mode and fill out the form before exporting responses.'
      );
      setShowExportMenu(false);
      return;
    }

    const response = exportToFHIRQuestionnaireResponse();
    const jsonString = JSON.stringify(response, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${
      formMetadata.title || formName || 'questionnaire'
    }_response.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
  };

  // Export as XML
  const handleExportXML = () => {
    if (!previewMode) {
      alert(
        'Please enable preview mode and fill out the form before exporting as XML.'
      );
      setShowExportMenu(false);
      return;
    }

    const response = exportToFHIRQuestionnaireResponse();
    const questionnaire = exportToFHIRQuestionnaire();

    // Debug logging
    console.log('Form Data:', response);
    console.log('Questionnaire:', questionnaire);
    console.log('Response Items:', response.item);

    const xmlString = xmlExportService.enhancedQuestionnaireResponseToXML(
      response,
      questionnaire
    );
    console.log('Generated XML:', xmlString);

    const blob = new Blob([xmlString], { type: 'application/xml' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${
      formMetadata.title || formName || 'questionnaire'
    }_response_with_metadata.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
  };

  // Export as Combined XML Bundle
  const handleExportCombinedXML = () => {
    if (!previewMode) {
      alert(
        'Please enable preview mode and fill out the form before exporting as Combined XML Bundle.'
      );
      setShowExportMenu(false);
      return;
    }

    const response = exportToFHIRQuestionnaireResponse();
    const questionnaire = exportToFHIRQuestionnaire();
    const xmlString = xmlExportService.combinedQuestionnaireResponseToXML(
      questionnaire,
      response
    );
    const blob = new Blob([xmlString], { type: 'application/xml' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${
      formMetadata.title || formName || 'questionnaire'
    }_bundle.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
  };

  // Export Questionnaire as XML
  const handleExportQuestionnaireXML = () => {
    const questionnaire = exportToFHIRQuestionnaire();

    // Debug logging
    console.log('Questionnaire for XML:', questionnaire);

    const xmlString = xmlExportService.questionnaireToXML(questionnaire);
    console.log('Generated Questionnaire XML:', xmlString);

    const blob = new Blob([xmlString], { type: 'application/xml' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${
      formMetadata.title || formName || 'questionnaire'
    }_questionnaire.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 text-gray-900 py-2 h-14">
        <div className="w-full px-4 flex items-center justify-between h-full">
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
            <button
              className="btn btn-secondary flex items-center"
              onClick={() => setShowFHIRMetadataDialog(true)}
              title="FHIR Metadata"
            >
              <Info size={16} className="mr-2" />
              FHIR Info
            </button>

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

            <div className="relative">
              <button
                className="btn btn-secondary flex items-center"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download size={16} className="mr-2" />
                Export
                <ChevronDown size={16} className="ml-2" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowMetadataDialog(true);
                      setShowExportMenu(false);
                    }}
                  >
                    Edit Metadata
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleExportQuestionnaire}
                  >
                    Export as FHIR Questionnaire
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleExportQuestionnaireResponse}
                  >
                    Export as FHIR QuestionnaireResponse
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleExportXML}
                  >
                    Export as XML
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleExportCombinedXML}
                  >
                    Export as Combined XML Bundle
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleExportQuestionnaireXML}
                  >
                    Export Questionnaire as XML
                  </button>
                </div>
              )}
            </div>

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

      {/* FHIR Metadata Dialog */}
      <FHIRMetadataDialog
        isOpen={showFHIRMetadataDialog}
        onClose={() => setShowFHIRMetadataDialog(false)}
      />

      {/* Form Metadata Dialog */}
      {showMetadataDialog && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-lg font-semibold">Form Metadata</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowMetadataDialog(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formMetadata.title || ''}
                  onChange={(e) =>
                    updateFormMetadata({ title: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formMetadata.status || 'draft'}
                  onChange={(e) =>
                    updateFormMetadata({
                      status: e.target.value as
                        | 'draft'
                        | 'active'
                        | 'retired'
                        | 'unknown',
                    })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="retired">Retired</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={formMetadata.url || ''}
                  onChange={(e) => updateFormMetadata({ url: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="https://example.org/Questionnaire/example"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  value={formMetadata.publisher || ''}
                  onChange={(e) =>
                    updateFormMetadata({ publisher: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={formMetadata.version || ''}
                  onChange={(e) =>
                    updateFormMetadata({ version: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setShowMetadataDialog(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
