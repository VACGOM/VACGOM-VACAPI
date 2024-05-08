import { StateType } from '@vacgom/types';
import { RequestPasswordReset } from './requestPasswordReset';
import React, { useRef } from 'react';
import { SecureNo } from './secureNo';
import { SMS } from './sms';
import { useVacapiPasswordReset } from '@vacgom/vacapi-sdk';
import { ErrorBoundary } from 'react-error-boundary';
import { DomainException } from '../../../../../server/src/exception/domain-exception';

export const PasswordReset = () => {
  const state = useVacapiPasswordReset();
  const ref = useRef<ErrorBoundary | null>();

  let component;
  if (
    state.state == StateType.INITIAL ||
    state.state == StateType.REQUEST_PASSWORD_RESET
  ) {
    component = <RequestPasswordReset />;
  } else if (state.state == StateType.SECURE_NO) {
    component = <SecureNo />;
  } else if (state.state == 'sms') {
    component = <SMS />;
  } else {
    component = <RequestPasswordReset />;
  }

  return (
    <ErrorBoundary
      ref={(r) => {
        ref.current = r;
      }}
      fallbackRender={() => {
        return <div>error</div>;
      }}
      onError={async (e) => {
        await state.refresh();
        if (e instanceof DomainException) state.setError?.(e);
        ref.current?.resetErrorBoundary();
      }}
    >
      {component}
    </ErrorBoundary>
  );
};