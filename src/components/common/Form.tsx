// src/components/common/Form.tsx

import React, { ReactNode } from 'react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitButtonText: string;
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, submitButtonText, values, onChange }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const renderField = (field: FormField): ReactNode => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: values[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        onChange(field.name, e.target.value),
      className:
        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
      required: field.required,
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return <textarea {...commonProps} rows={3} />;
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {renderField(field)}
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default Form;