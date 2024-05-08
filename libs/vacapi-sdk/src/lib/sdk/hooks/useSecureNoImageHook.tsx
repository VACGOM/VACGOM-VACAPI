import { useEffect, useState } from 'react';
import { getVacapiInstance } from '@vacgom/vacapi-sdk';

export const useSecureNoImage = () => {
  const [secureNoImage, setSecureNoImage] = useState<string | undefined>();

  useEffect(() => {
    const vacapi = getVacapiInstance();
    vacapi
      .requestSecureNoImage()
      .then((response) => {
        if (response) setSecureNoImage(response);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  return secureNoImage;
};
