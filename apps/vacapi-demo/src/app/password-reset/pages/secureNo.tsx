import React, { useState } from 'react';
import { Alert, Button, Card, IconButton, Input, Typography } from '@mui/joy';
import {
  getVacapiInstance,
  useSecureNoImage,
  useVacapiPasswordReset,
} from '@vacgom/vacapi-sdk';
import { useErrorBoundary } from 'react-error-boundary';
import { RefreshRounded } from '@mui/icons-material';

export const SecureNo: React.FC = () => {
  const secureNoImage = useSecureNoImage();

  const [refreshedSecureNoImage, setSecureNoImage] = useState<string>(); // [1
  const [secureNo, setSecureNo] = useState<string | undefined>();

  const state = useVacapiPasswordReset();
  const vacapi = getVacapiInstance();

  const eee = useErrorBoundary();
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
        {state.error && (
          <Alert size={'lg'}>{state.error.errorData.message}</Alert>
        )}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'space-between',
          }}
        >
          <Typography
            level={'h2'}
            sx={{
              display: 'inline-block',
            }}
          >
            보안코드 입력
          </Typography>
          <IconButton
            onClick={async () => {
              const secureNo = await vacapi.refreshSecureNoImage();
              await state.refresh();

              console.log('setSecureNoImage', secureNo);
              setSecureNoImage(secureNo);
            }}
          >
            <RefreshRounded />
          </IconButton>
        </div>

        <Card sx={{ backgroundColor: '#fff' }}>
          <img src={refreshedSecureNoImage ?? secureNoImage} alt="secureNo" />
        </Card>
        <Input
          placeholder={'보안코드'}
          size={'lg'}
          onChange={(e) => {
            setSecureNo(e.target.value);
          }}
        />
        <Button
          size={'lg'}
          onClick={async () => {
            if (secureNo) {
              try {
                state.removeError();
                await vacapi.inputSecureNo({
                  secureNo: secureNo,
                });
              } catch (e) {
                eee.showBoundary(e);
              }

              state.refresh();
            }
          }}
        >
          입력
        </Button>
      </Card>
    </div>
  );
};
