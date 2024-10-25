// src/hooks/ui/useForm.ts
import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  validate?: (value: any) => boolean | string;
}

interface FormConfig {
  [key: string]: ValidationRule;
}

export function useForm<T extends { [key: string]: any }>(
  initialValues: T,
  validationConfig?: FormConfig
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (name: keyof T, value: any) => {
      if (!validationConfig?.[name as string]) return '';

      const rules = validationConfig[name as string];
      
      if (rules.required && !value) {
        return 'This field is required';
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Invalid format';
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        return `Minimum length is ${rules.minLength}`;
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Maximum length is ${rules.maxLength}`;
      }
      
      if (rules.validate) {
        const result = rules.validate(value);
        if (typeof result === 'string') return result;
        if (!result) return 'Invalid value';
      }

      return '';
    },
    [validationConfig]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues(prev => ({ ...prev, [name]: value }));
      const error = validateField(name as keyof T, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const error = validateField(key as keyof T, values[key]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setValues,
  };
}