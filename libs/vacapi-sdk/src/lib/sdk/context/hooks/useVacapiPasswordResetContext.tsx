import { createContext, useContext } from 'react';
import { DomainException } from '../../../../../../../apps/server/src/exception/domain-exception';

type PasswordResetContext = {
  state: string;
  refresh: () => Promise<void>;
  error?: DomainException;
  setError: (error: DomainException) => void;
  removeError: () => void;
};

export const VacapiPasswordResetContext = createContext<PasswordResetContext>({
  state: '',
  refresh: async (force = false) => {
    throw new Error('Not implemented');
  },
  setError: () => {
    throw new Error('Not implemented');
  },
  removeError: () => {
    throw new Error('Not implemented');
  },
});

export const useVacapiPasswordReset = () => {
  return useContext(VacapiPasswordResetContext);
};
