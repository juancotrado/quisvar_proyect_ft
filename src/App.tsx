import { useEffect, useState } from 'react';
import Navigation from './routes/Navigation';
import Loader from './components/shared/loader/Loader';
import { SnackbarUtilitiesConfigurator } from './utils/SnackbarManager';
import { isLoader$ } from './services/axiosInstance';

function App() {
  const [isLoader, setisLoader] = useState(false);

  isLoader$.subscribe({
    next: value => setisLoader(value),
  });

  return (
    <>
      <SnackbarUtilitiesConfigurator />
      <Navigation />
      <Loader isLoading={isLoader} />
    </>
  );
}

export default App;
