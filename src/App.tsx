import { useState, useEffect } from 'react';
import Navigation from './routes/Navigation';
import Loader from './components/shared/loader/Loader';
import axiosInstance from './services/axiosInstance';
import { SnackbarUtilitiesConfigurator } from './utils/SnackbarManager';

function App() {
  const [isLoader, setisLoader] = useState(false);

  const handleLoader = (value: boolean) => {
    setisLoader(value);
  };
  useEffect(() => {
    axiosInstance(handleLoader);
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
