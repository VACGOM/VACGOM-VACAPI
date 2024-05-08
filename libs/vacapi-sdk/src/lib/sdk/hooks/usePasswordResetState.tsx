import { useEffect, useState } from 'react';
import { StateType } from '@vacgom/types';
import { Vacapi } from '@vacgom/vacapi-sdk';

export const usePasswordResetState = () => {
  const [state, setState] = useState<StateType>(StateType.INITIAL);

  useEffect(() => {
    const vacapi = new Vacapi(
      'http://localhost:3000/json-rpc',
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3NzlmNDEyMy1kMTZkLTQ1N2UtYTFmYy02YjY3NWVhZDFmODMiLCJpYXQiOjE3MTUwMjA0MTYsInJvbGUiOiJST0xFX1VTRVIiLCJleHAiOjE3MjQwMjA0MTZ9.tZrAkdvlH0eO3lCLZiwwYUfLzjoNL-58GuyBvUvpaww'
    );
    vacapi
      .getCurrentState()
      .then((response) => {
        setState(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return {
    state,
  };
};
