import { MessageTypeImbox, OptionSelect } from '../../../../../../../types';

export interface HeaderOptionProcedure {
  procedureOpt: 'continue' | 'finish';
  text: string;
}

export interface MessageSendType {
  title: string;
  header: string;
  description?: string;
  receiverId: number;
  idMessageReply?: number;
  idMessageResend?: number;
  type: MessageTypeImbox;
}

export interface ProviedForm {
  title: string;
  numberPage?: number;
  pos: number;
  to: OptionSelect | null;
  date: string;
  observation?: string;
}
