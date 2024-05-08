import { Vacapi } from './lib/sdk';

export * from './lib/sdk';

let vacapiInstance: Vacapi | null = null;

export function initVacapi(apiUrl: string, accessToken: string) {
  vacapiInstance = new Vacapi(apiUrl, accessToken);
}

export function getVacapiInstance() {
  if (!vacapiInstance) {
    throw new Error('Vacapi is not initialized');
  }

  return vacapiInstance;
}
