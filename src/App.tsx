import { useState } from 'react';
import Navigation from './routes/Navigation';
import Loader from './components/shared/loader/Loader';
import axiosInstance from './services/axiosInstance';

function App() {
  const [isLoader, setisLoader] = useState(false);
  const handleLoader = (value: boolean) => {
    setisLoader(value);
  };
  axiosInstance(handleLoader);
  return (
    <>
      <Navigation />
      <Loader isLoading={isLoader} />
    </>
  );
}

export default App;
