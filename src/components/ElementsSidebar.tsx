import React from 'react';
import { 
  Type, 
  AlignLeft, 
  Hash, 
  Mail, 
  List, 
  CheckSquare, 
  Circle, 
  CalendarDays,
  Search,
  FolderPlus,
  Heading,
  Image
} from 'lucide-react';
import { useFormContext } from '../context/FormContext';
import { FormElementType } from '../types/form';

interface ElementButtonProps {
  type: FormElementType;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ElementButton: React.FC<ElementButtonProps> = ({ icon, label, onClick }) => (
  <button 
    className="flex items-center p-3 rounded-md hover:bg-gray-50 w-full transition-colors"
    onClick={onClick}
  >
    <div className="mr-3 text-gray-500">{icon}</div>
    <span className="text-sm">{label}</span>
  </button>
);

const ElementsSidebar: React.FC = () => {
  const { addElement } = useFormContext();
  const [searchQuery, setSearchQuery] = React.useState('');

  const elementTypes = [
    { type: 'header' as FormElementType, icon: <Heading size={18} />, label: 'Header Text' },
    { type: 'text' as FormElementType, icon: <Type size={18} />, label: 'Text Field' },
    { type: 'textarea' as FormElementType, icon: <AlignLeft size={18} />, label: 'Text Area' },
    { type: 'number' as FormElementType, icon: <Hash size={18} />, label: 'Number' },
    { type: 'email' as FormElementType, icon: <Mail size={18} />, label: 'Email' },
    { type: 'select' as FormElementType, icon: <List size={18} />, label: 'Dropdown' },
    { type: 'checkbox' as FormElementType, icon: <CheckSquare size={18} />, label: 'Checkbox Group' },
    { type: 'radio' as FormElementType, icon: <Circle size={18} />, label: 'Radio Group' },
    { type: 'date' as FormElementType, icon: <CalendarDays size={18} />, label: 'Date' },
    { type: 'group' as FormElementType, icon: <FolderPlus size={18} />, label: 'Question Group' },
    { type: 'image' as FormElementType, icon: <Image size={18} />, label: 'Image' },
  ];

  const filteredElements = searchQuery
    ? elementTypes.filter(element => 
        element.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : elementTypes;

  return (
    <div className="h-full flex flex-col">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Form Elements</h3>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search elements..."
            className="pl-10 input text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          {filteredElements.map((element) => (
            <ElementButton
              key={element.type}
              type={element.type}
              icon={element.icon}
              label={element.label}
              onClick={() => addElement(element.type)}
            />
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Drag and drop elements to build your form
        </p>
      </div>
    </div>
  );
};

export default ElementsSidebar;