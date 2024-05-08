import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './app/app';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { PasswordReset } from './app/password-reset/pages/passwordReset';
import { initVacapi, VacapiPasswordResetProvider } from '@vacgom/vacapi-sdk';
import { PasswordChanged } from './app/password-reset/pages/password-changed';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/password-reset',
    element: (
      <VacapiPasswordResetProvider>
        <PasswordReset />
      </VacapiPasswordResetProvider>
    ),
  },
  {
    path: '/password-changed',
    element: <PasswordChanged />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

initVacapi(
  'http://localhost:3000/json-rpc',
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3NzlmNDEyMy1kMTZkLTQ1N2UtYTFmYy02YjY3NWVhZDFmODMiLCJpYXQiOjE3MTUwMjA0MTYsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3MjQwMjA0MTZ9.tZrAkdvlH0eO3lCLZiwwYUfLzjoNL-58GuyBvUvpaww'
);

root.render(
  <CssVarsProvider defaultMode={'dark'}>
    <CssBaseline />

    <RouterProvider router={router} />
  </CssVarsProvider>
);
