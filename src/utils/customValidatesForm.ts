export const validateWhiteSpace = (value: string | undefined | number) => {
  value = String(value);
  if (!value || value === 'NaN') return 'Este campo no puede estar vacío';
  return !value.trim()
    ? 'Este campo no puede estar vacío'
    : value[0].startsWith(' ')
    ? 'No deje espacios al inicio'
    : true;
};
export const validateOnlyNumbers = <T>(value: T) => {
  const valTransform = String(value);
  if (valTransform === 'NaN') return 'Ingrese solo caracteres numericos';
  const regex = /^[0-9]+$/;
  return !regex.test(valTransform)
    ? 'Ingrese solo caracteres numericos '
    : true;
};
export const validateOnlyDecimals = <T>(value: T) => {
  const valTransform = String(value);
  console.log('valTransform', valTransform);
  if (valTransform === 'NaN') return 'Ingrese solo caracteres numericos';
  const regex = /^[0-9]+(\.[0-9]+)?$/;
  return !regex.test(valTransform)
    ? 'Ingrese solo caracteres numericos '
    : true;
};

export const validateCorrectTyping = <T>(value: T) => {
  if (!value || typeof value !== 'string')
    return 'Este campo no puede estar vacío';
  const regex = /^[a-zA-Z0-9,áéíóúÁÉÍÓÚñÑ()° _-]+$/;
  return !regex.test(value)
    ? 'Ingresar nombre que no contenga lo siguiente ^*/?@|<>": '
    : true;
};
export const validateEmail = (value: string) => {
  const regex = /^[\w]+(\.[\w]+)*@[\w]+(\.[\w]+)*\.[a-zA-Z]{2,5}$/i;
  return !regex.test(value) ? 'Ingresar un email valido' : true;
};

export const validateDNI = (value: string) => {
  return value.length !== 8 ? 'Ingresar un dni' : true;
};
export const validateRuc = (value: string) => {
  return value.length !== 11 ? 'Ingresar un ruc valido' : true;
};
export const validateJPGExtension = (value: any) => {
  if (!value?.[0]) return true; // puede que se tenga imagen o no
  const regex = /\.(jpg|jpeg|png|gif)$/i;
  return !regex.test(value?.[0].name) ? 'Ingrese un archivo .jpg' : true;
};
