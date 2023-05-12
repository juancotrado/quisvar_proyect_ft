import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SnackbarProvider } from 'notistack';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <SnackbarProvider autoHideDuration={2000}>
    <App />
  </SnackbarProvider>

  // </React.StrictMode>
);
