import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getVacapiInstance } from '../../../index';
import { DomainException } from '../../../../../../apps/server/src/exception/domain-exception';

type PasswordResetContext = {
  state: string;
  refresh: () => Promise<void>;
  error?: DomainException;
  setError: (error: DomainException) => void;
  removeError: () => void;
};
const VacapiPasswordResetContext = createContext<PasswordResetContext>({
  state: '',
  refresh: async () => {
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

export const VacapiPasswordResetProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<string>('initial');
  const vacapi = getVacapiInstance();
  const [error, setError] = useState<DomainException>();
  const refresh = async () => {
    try {
      const response = await vacapi.getCurrentState();
      if (response) setState(response);
    } catch (error) {
      console.error(error);
    }
  };

  const removeError = () => {
    setError(undefined);
  };
  useEffect(() => {
    refresh();
  }, []);

  return (
    <VacapiPasswordResetContext.Provider
      value={{ state, refresh, error, setError, removeError }}
    >
      {children}
    </VacapiPasswordResetContext.Provider>
  );
};
