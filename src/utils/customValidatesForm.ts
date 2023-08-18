export const validateWhiteSpace = (value: string) => {
  return !value.trim()
    ? 'Este campo no puede estar vacío'
    : value[0].startsWith(' ')
    ? 'No deje espacios al inicio'
    : true;
};

export const validateCorrectTyping = (value: string) => {
  const regex = /^[^/?@|<>":'\\]+$/;
  return !regex.test(value)
    ? 'Ingresar nombre que no contenga lo siguiente ^/?@|<>": '
    : true;
};
export const validateEmail = (value: string) => {
  const regex = /^[\w]+(\.[\w]+)*@[\w]+(\.[\w]+)*\.[a-zA-Z]{2,5}$/i;
  return !regex.test(value) ? 'Ingresar un email valido' : true;
};
