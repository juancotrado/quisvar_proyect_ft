import {
  SnackbarKey,
  useSnackbar,
  VariantType,
  WithSnackbarProps,
} from 'notistack';
import { PiXBold } from 'react-icons/pi';

let useSnackbarRef: WithSnackbarProps;
export const SnackbarUtilitiesConfigurator: React.FC = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

const action = (snackbarId: SnackbarKey) => (
  <>
    <PiXBold
      onClick={() => {
        useSnackbarRef.closeSnackbar(snackbarId);
      }}
      size={21}
      style={{ cursor: 'pointer', marginInline: '1rem' }}
    />
  </>
);

export const SnackbarUtilities = {
  toast(msg: string, variant: VariantType = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, { variant, action });
  },
  success(msg: string) {
    this.toast(msg, 'success');
  },
  error(msg: string) {
    this.toast(msg, 'error');
  },
  info(msg: string) {
    this.toast(msg, 'info');
  },
  warning(msg: string) {
    this.toast(msg, 'warning');
  },
};
