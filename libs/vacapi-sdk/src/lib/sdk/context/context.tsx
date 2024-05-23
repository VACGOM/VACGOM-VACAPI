import React, { PropsWithChildren, useEffect, useState } from 'react';
import { getVacapiInstance } from '@vacgom/vacapi-sdk';
import { DomainException } from '@vacgom/types';
import { VacapiPasswordResetContext } from './hooks';
import { PasswordResetStateType } from './types';

export const VacapiPasswordResetProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<string>(PasswordResetStateType.INITIAL);
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
