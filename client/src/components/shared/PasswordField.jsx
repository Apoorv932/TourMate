import { useState } from 'react';

import { useTheme } from '@/context/ThemeContext';
import { ui } from '@/utils/uiClasses';

export default function PasswordField({ value, onChange, placeholder, required = true }) {
  const [showPassword, setShowPassword] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${isDark ? ui.inputDark : ui.inputLight} pr-16`}
        required={required}
      />
      <button
        type="button"
        onClick={() => setShowPassword((currentValue) => !currentValue)}
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isDark ? 'text-yellow-300' : 'text-zinc-700'}`}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
