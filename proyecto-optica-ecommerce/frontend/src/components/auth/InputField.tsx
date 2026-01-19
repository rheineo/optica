import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-2">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 
            border border-gray-300 rounded-md
            text-gray-900 text-base
            transition-all duration-200
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            placeholder:text-gray-400
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
