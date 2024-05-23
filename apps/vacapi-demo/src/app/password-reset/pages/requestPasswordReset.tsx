import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Input,
  Option,
  Select,
  Typography,
} from '@mui/joy';
import { getVacapiInstance, useVacapiPasswordReset } from '@vacgom/vacapi-sdk';
import { Identity, Telecom } from '@vacgom/types';
import { DomainException } from '../../../../../../libs/types/src/exceptions/domain-exception';
import { IdentityException } from '../../../../../../libs/types/src/models/common/identity/exceptions/IdentityException';
import { InvalidTelecomStringException } from '../../../../../../libs/types/src/models/common/telecom/exception';

export const RequestPasswordReset: React.FC = () => {
  const [name, setName] = React.useState<string>();
  const [phoneNumber, setPhoneNumber] = React.useState<string>();
  const [telecom, setTelecom] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [identity, setIdentity] = React.useState<string>();

  const vacapiPasswordResetContext = useVacapiPasswordReset();
  const vacapi = getVacapiInstance();
  const [error, setError] = useState('');

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
        {error && <Alert>{error}</Alert>}
        <Typography level={'h2'}>비밀번호 찾기</Typography>
        {vacapiPasswordResetContext.error && (
          <Alert size={'lg'}>
            {vacapiPasswordResetContext.error.errorData.message}
          </Alert>
        )}
        <div>
          <Input
            title={'이름'}
            size={'lg'}
            placeholder={'이름'}
            sx={{ mb: 2 }}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            title={'전화번호'}
            type={'tel'}
            size={'lg'}
            placeholder={'전화번호'}
            sx={{ mb: 2 }}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Select placeholder={'통신사'} size={'lg'} sx={{ mb: 2 }}>
            <Option value={'SKT'} onClick={(e) => setTelecom('SKT')}>
              SKT
            </Option>
            <Option value={'KT'} onClick={(e) => setTelecom('KT')}>
              KT
            </Option>
            <Option value={'LGU+'} onClick={(e) => setTelecom('LGU+')}>
              LGU+
            </Option>
            <Option value={'SKT MVNO'} onClick={(e) => setTelecom('SKT MVNO')}>
              SKT 알뜰폰
            </Option>
            <Option value={'KT MVNO'} onClick={(e) => setTelecom('KT MVNO')}>
              KT 알뜰폰
            </Option>
            <Option
              value={'LGU+ MVNO'}
              onClick={(e) => setTelecom('LGU+ MVNO')}
            >
              LGU+ 알뜰폰
            </Option>
          </Select>
          <Input
            title={'비밀번호'}
            type={'password'}
            size={'lg'}
            placeholder={'비밀번호'}
            sx={{ mb: 2 }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            title={'주민등록번호 앞 7자리'}
            type={'number'}
            size={'lg'}
            placeholder={'주민등록번호 앞 7자리'}
            sx={{ mb: 2 }}
            onChange={(e) => setIdentity(e.target.value)}
          />
          <Button
            title={'비밀번호 찾기'}
            fullWidth={true}
            size={'lg'}
            onClick={async () => {
              try {
                setError('');

                if (
                  !name ||
                  !identity ||
                  !telecom ||
                  !phoneNumber ||
                  !password
                ) {
                  setError('모든 항목을 입력해주세요');
                  return;
                }

                const result = await vacapi.requestPasswordChange({
                  name: name,
                  identity: Identity.parse(identity),
                  newPassword: password,
                  telecom: Telecom.fromString(telecom),
                  phoneNumber: phoneNumber,
                });
                await vacapiPasswordResetContext.refresh();
              } catch (e) {
                if (e instanceof IdentityException) setError(e.message);
                if (e instanceof DomainException) setError(e.message);
                if (e instanceof InvalidTelecomStringException)
                  setError(e.message);
              }
            }}
          >
            비밀번호 찾기
          </Button>
        </div>
      </Card>
    </div>
  );
};
