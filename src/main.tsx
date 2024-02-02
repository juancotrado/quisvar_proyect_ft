import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SnackbarProvider } from 'notistack';
import { axiosInterceptor } from './services/axiosInstance.ts';
import { Provider } from 'react-redux';
import store from './store/index.ts';

axiosInterceptor();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <SnackbarProvider autoHideDuration={4000}>
      <App />
    </SnackbarProvider>
  </Provider>

  // </React.StrictMode>
);
