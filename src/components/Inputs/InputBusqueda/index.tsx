interface BusquedaProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeHolder?: string;
  value: any;
  onChange: any;
  type?: string;
  icono?: React.ReactNode;
  name?: string;
  autoFocus?: any;
}
const InputBusqueda: React.FC<BusquedaProps> = ({
  className,
  placeHolder,
  value,
  onChange,
  type = 'text',
  icono,
  name,
  autoFocus = false,
  ...props
}) => {
  return (
    <>
      <input
        autoComplete="off"
        autoFocus={autoFocus}
        type={type}
        name={name}
        placeholder={placeHolder}
        className={`${className} outline-none`}
        value={value}
        onChange={onChange}
        {...props}
      />
      {icono && (
        <span className="absolute inset-y-0 left-4 flex items-center">
          {icono}
        </span>
      )}
    </>
  );
};
export default InputBusqueda;
