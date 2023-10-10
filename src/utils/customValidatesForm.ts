export const validateWhiteSpace = (value: string | undefined) => {
  if (!value) return 'Este campo no puede estar vacío';
  return !value.trim()
    ? 'Este campo no puede estar vacío'
    : value[0].startsWith(' ')
    ? 'No deje espacios al inicio'
    : true;
};
export const validateOnlyNumbers = (value: string | undefined) => {
  if (!value) return 'Este campo no puede estar vacío';

  const regex = /^[0-9]+$/;
  return !regex.test(value) ? 'Ingrese solo caracteres numericos ' : true;
};

export const validateCorrectTyping = (value: string | undefined) => {
  if (!value) return 'Este campo no puede estar vacío';

  const regex = /^[a-zA-Z0-9,áéíóúÁÉÍÓÚñÑ _-]+$/;
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
