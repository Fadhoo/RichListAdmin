import { useEffect, useState } from "react";
import { Info, Eye, EyeOff } from "lucide-react";
import "../../styles/input/Input.css";

interface Props {
  type?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  isPassword?: boolean;
  isEmail?: boolean;
  errorMessage?: string;
  helperText?: string;
  helperTextColour?: string;
  helperTextBgColour?: string;
  iconColour?: string;
  register?: any;
  required?: boolean;
  handleChange?: (value: any) => void;
}

const TextInput = ({
  type = "text",
  label,
  value,
  placeholder,
  loading,
  disabled,
  isPassword,
  errorMessage,
  helperText,
  helperTextColour = "#151515",
  helperTextBgColour,
  iconColour = "#333333",
  register,
  required,
  handleChange,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);
  const helperTextBgStyle = helperTextBgColour ? `bg-${helperTextBgColour}` : "bg-dt-dark-gray-50";

  const handleChangeInValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (handleChange && register) handleChange(e);
    if (handleChange) handleChange(value);
  };

  const handlePrevent = (e: React.ClipboardEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
    if (type === "password") e.preventDefault();
  };

  useEffect(() => {
    if (isPassword) {
      setInputType(showPassword ? "text" : "password");
    }
  }, [isPassword, showPassword]);

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label className="block theme-text-secondary text-sm mb-2 font-medium">{label}</label>}

      <div className="relative flex items-center">
        {register ? (
          <input
            className={`${
              disabled || loading ? "cursor-not-allowed" : ""
            } w-full theme-input focus:ring-2 focus:ring-blue-500 border rounded-xl text-sm delay-100 transition-all py-3 pl-3 flex-1`}
            type={inputType}
            {...register}
            autoComplete="off"
            placeholder={placeholder}
            disabled={disabled || loading}
            required={required}
            onCopy={handlePrevent}
            onCut={handlePrevent}
            onPaste={handlePrevent}
            onContextMenu={handlePrevent}
          />
        ) : (
          <input
            className={`${
              disabled || loading ? "cursor-not-allowed" : ""
            } w-full theme-input focus:ring-2 focus:ring-blue-500 border rounded-xl text-sm delay-100 transition-all py-3 pl-3 flex-1`}
            type={inputType}
            value={value}
            onChange={handleChangeInValue}
            onCopy={handlePrevent}
            onCut={handlePrevent}
            onPaste={handlePrevent}
            onContextMenu={handlePrevent}
            autoComplete="off"
            placeholder={placeholder}
            disabled={disabled || loading}
            required={required}
          />
        )}

        {isPassword && (
          <div
            className="absolute right-[3%] cursor-pointer transition ease-in-out"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye className="theme-text-primary" /> : <EyeOff className="theme-text-primary" />}
          </div>
        )}
      </div>

      {errorMessage ? (
        <div className="w-fit flex items-center gap-1 p-[6px] bg-dt-red-50 rounded-md">
          <Info color="#FF2468" />

          <p className="text-[10px] text-red-500 text-start">{errorMessage}</p>
        </div>
      ) : (
        helperText && (
          <div className={`${helperTextBgStyle} w-fit flex items-center gap-1 p-[6px] rounded-md`}>
            <Info color={helperTextColour} />

            <p className="text-[10px] theme-text-primary font-normal">{helperText}</p>
          </div>
        )
      )}
    </div>
  );
};

export default TextInput;
