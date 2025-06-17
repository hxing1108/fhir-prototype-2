import React from 'react';
import { IFormElement } from '../../types/form';
import TextFieldProperties from '../properties/TextFieldProperties';
import TextAreaProperties from '../properties/TextAreaProperties';
import SelectProperties from '../properties/SelectProperties';
import CheckboxProperties from '../properties/CheckboxProperties';
import RadioProperties from '../properties/RadioProperties';
import GroupProperties from '../properties/GroupProperties';
import FormProperties from '../properties/FormProperties';
import HeaderProperties from '../properties/HeaderProperties';
import ImageProperties from '../properties/ImageProperties';
import YesNoProperties from '../properties/YesNoProperties';

interface ElementPropertiesProps {
  selectedElement?: IFormElement;
}

export const ElementProperties: React.FC<ElementPropertiesProps> = ({
  selectedElement,
}) => {
  if (!selectedElement) {
    return <FormProperties />;
  }

  switch (selectedElement.type) {
    case 'text':
    case 'email':
    case 'number':
    case 'date':
      return <TextFieldProperties element={selectedElement} />;
    case 'textarea':
      return <TextAreaProperties element={selectedElement} />;
    case 'select':
      return <SelectProperties element={selectedElement} />;
    case 'checkbox':
      return <CheckboxProperties element={selectedElement} />;
    case 'radio':
      return <RadioProperties element={selectedElement} />;
    case 'group':
      return <GroupProperties element={selectedElement} />;
    case 'header':
      return <HeaderProperties element={selectedElement} />;
    case 'image':
      return <ImageProperties element={selectedElement} />;
    case 'yesNo':
      return <YesNoProperties element={selectedElement} />;
    default:
      return <div>Select an element to edit its properties</div>;
  }
};
