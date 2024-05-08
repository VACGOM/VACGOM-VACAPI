import React, { PropsWithChildren, useEffect, useState } from 'react';
import { getVacapiInstance } from '../../../index';
import { DomainException } from '../../../../../../apps/server/src/exception/domain-exception';
import { VacapiPasswordResetContext } from './hooks/useVacapiPasswordResetContext';
import { StateType } from '@vacgom/types';

export const VacapiPasswordResetProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<string>(StateType.INITIAL);
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
