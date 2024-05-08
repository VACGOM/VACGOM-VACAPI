import React, { useState } from 'react';
import { Alert, Button, Card, Input, Typography } from '@mui/joy';
import { getVacapiInstance } from '@vacgom/vacapi-sdk';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useVacapiPasswordReset } from '../../../../../../libs/vacapi-sdk/src/lib/sdk/context/hooks/useVacapiPasswordResetContext';

export const SMS: React.FC = () => {
  const [secureNo, setSecureNo] = useState<string | undefined>();
  const error = useErrorBoundary();
  const vac = getVacapiInstance();
  const state = useVacapiPasswordReset();

  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Card sx={{ width: 500, p: 3 }}>
        {state.error && <Alert>{state.error.errorData.message}</Alert>}
        <Typography level={'h2'}>SMS 인증번호</Typography>
        <Input
          placeholder={'SMS 인증번호'}
          size={'lg'}
          onChange={(e) => {
            setSecureNo(e.target.value);
          }}
        />
        <Button
          size={'lg'}
          onClick={async () => {
            state.removeError();
            try {
              if (secureNo) {
                const result = await vac.inputSMSCode({
                  smsCode: secureNo,
                });

                navigate('/password-changed', {
                  state: { userId: result.userId },
                });
              }
            } catch (e) {
              error.showBoundary(e);
            }
          }}
        >
          입력
        </Button>
      </Card>
    </div>
  );
};
