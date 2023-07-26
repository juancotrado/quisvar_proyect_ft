export const validateWhiteSpace = (value: string) => {
  return !value.trim()
    ? 'Este campo no puede estar vacío'
    : value[0] === ' '
    ? 'No deje espacios al inicio'
    : true;
};

export const validateCorrectTyping = (value: string) => {
  const regex = /^[^/?@|<>":'\\]+$/;
  return !regex.test(value)
    ? 'Ingresar nombre que no contenga lo siguiente ^/?@|<>": '
    : true;
};
