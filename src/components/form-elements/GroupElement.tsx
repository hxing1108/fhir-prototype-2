import React, { useState, useRef, useEffect } from 'react';
import { FormElement, FormElementType } from '../../types/form';
import { useFormContext } from '../../context/FormContext';
import { ChevronDown, Type, AlignLeft, Hash, Mail, List, CheckSquare, Circle, CalendarDays } from 'lucide-react';
import FormElementComponent from './FormElement';

interface GroupElementProps {
  element: FormElement;
}

const GroupElement: React.FC<GroupElementProps> = ({ element }) => {
  const { updateElement, addElement } = useFormContext();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const elementTypes = [
    { type: 'text' as FormElementType, icon: <Type size={16} />, label: 'Text Field' },
    { type: 'textarea' as FormElementType, icon: <AlignLeft size={16} />, label: 'Text Area' },
    { type: 'number' as FormElementType, icon: <Hash size={16} />, label: 'Number' },
    { type: 'email' as FormElementType, icon: <Mail size={16} />, label: 'Email' },
    { type: 'select' as FormElementType, icon: <List size={16} />, label: 'Dropdown' },
    { type: 'checkbox' as FormElementType, icon: <CheckSquare size={16} />, label: 'Checkbox Group' },
    { type: 'radio' as FormElementType, icon: <Circle size={16} />, label: 'Radio Group' },
    { type: 'date' as FormElementType, icon: <CalendarDays size={16} />, label: 'Date' },
  ];

  const handleAddElement = (type: FormElementType) => {
    addElement(type, element.id);
    setShowAddMenu(false);
  };

  return (
    <div className="space-y-4">
      {element.description && (
        <p className="text-sm text-gray-500">{element.description}</p>
      )}

      <div className="pl-4 border-l-2 border-gray-200 space-y-4">
        {element.elements?.map((childElement) => (
          <FormElementComponent
            key={childElement.id}
            element={childElement}
            isNested={true}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupElement;