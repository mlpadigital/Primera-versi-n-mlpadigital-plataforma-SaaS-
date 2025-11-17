import React from 'react';
import Input from '../../shared/components/ui/input';
import { Button } from '../../shared/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder = "Contraseña",
  showPassword,
  toggleShowPassword,
  disabled = false,
}) => {
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
        disabled={disabled}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-600"
        onClick={toggleShowPassword}
        tabIndex={-1}
        disabled={disabled}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default React.memo(PasswordInput);