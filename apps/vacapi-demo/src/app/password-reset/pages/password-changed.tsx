import React from 'react';
import { Button, Card, Typography } from '@mui/joy';
import { useLocation, useNavigate } from 'react-router-dom';

export const PasswordChanged = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const state: { userId?: string } = location.state;
  if (!state) {
    return null;
  }

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
        <Typography level={'h2'}>
          축하합니다. 비밀번호가 변경되었어요 !!
        </Typography>
        <Typography level={'h4'}>ID: {state.userId}</Typography>
        <Button
          fullWidth={true}
          size={'lg'}
          onClick={() => {
            navigation('/password-reset');
          }}
        >
          감사합니다
        </Button>
      </Card>
    </div>
  );
};
