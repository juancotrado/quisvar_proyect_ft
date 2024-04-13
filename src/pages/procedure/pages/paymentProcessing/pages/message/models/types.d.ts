import { MessageTypeImbox, OptionSelect } from '../../../../../../../types';
import { Contact } from '../../../../../models';

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
  observations: string;
  numberPage?: number;
  to: Contact;
}
