import { useState, useEffect } from 'react';
import Navigation from './routes/Navigation';
import Loader from './components/shared/loader/Loader';
import { SnackbarUtilitiesConfigurator } from './utils/SnackbarManager';
import { axiosInterceptor } from './services/axiosInstance';

function App() {
  const [isLoader, setisLoader] = useState(false);

  const handleLoader = (value: boolean) => {
    setisLoader(value);
  };
  useEffect(() => {
    axiosInterceptor(handleLoader);
  }, []);
  return (
    <>
      <SnackbarUtilitiesConfigurator />
      <Navigation />
      <Loader isLoading={isLoader} />
    </>
  );
}

export default App;
