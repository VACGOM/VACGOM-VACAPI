import styled from '@emotion/styled';
import { VacapiSdk } from '@vacgom/vacapi-sdk';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <VacapiSdk />
    </StyledApp>
  );
}

export default App;
