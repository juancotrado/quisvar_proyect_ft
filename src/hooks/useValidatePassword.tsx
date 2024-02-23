import { useState } from 'react';

const useValidatePassword = (password: string) => {
  const [errorPassword, setErrorPassword] = useState<{ [key: string]: any }>();

  const verifyPasswords = ({ target }: React.FocusEvent<HTMLInputElement>) => {
    const error = {
      verifyPassword: { message: 'Las contraseñas no coinciden' },
    };
    password !== target.value ? setErrorPassword(error) : setErrorPassword({});
  };

  return { errorPassword, verifyPasswords };
};
export default useValidatePassword;
