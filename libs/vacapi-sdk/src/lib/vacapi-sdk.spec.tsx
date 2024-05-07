import { render } from '@testing-library/react';

import VacapiSdk from './vacapi-sdk';

describe('VacapiSdk', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VacapiSdk />);
    expect(baseElement).toBeTruthy();
  });
});
