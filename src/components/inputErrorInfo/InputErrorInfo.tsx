import { CSSProperties } from 'react';
import { FieldErrors, FieldValues, Path } from 'react-hook-form';

interface InputErrorInfoProps<FormData extends FieldValues> {
  errors: FieldErrors<FormData>;
  name: Path<FormData>;
  errorPosX?: number;
  errorPosY?: number;
  isRelative: boolean;
}
const InputErrorInfo = <FormData extends FieldValues>({
  name,
  errorPosX = 0,
  errorPosY = 0,
  errors,
  isRelative = false,
}: InputErrorInfoProps<FormData>) => {
  const style: CSSProperties = {
    transform: `translate(${errorPosX}px,${errorPosY}px)`,
    position: isRelative ? 'static' : 'absolute',
  };
  return (
    <span className="input-span-error" style={style}>
      <img src="/svg/warning.svg" alt="warning" className="input-span-icon" />
      {errors[name]?.type === 'required'
        ? 'Por favor llene el campo.'
        : errors[name]?.message?.toString()}
    </span>
  );
};

export default InputErrorInfo;
