import Navigation from './routes/Navigation';
import Loader from './components/loader/Loader';
import { SnackbarUtilitiesConfigurator } from './utils/SnackbarManager';

function App() {
  return (
    <>
      <SnackbarUtilitiesConfigurator />
      <Navigation />
      <Loader />
    </>
  );
}

export default App;
