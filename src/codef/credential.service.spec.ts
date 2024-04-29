import { CredentialService } from './credential.service';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CommonRequestService } from '../request/request.service';

describe('CredentialService', () => {
  let credentialService: CredentialService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        CredentialService,
        {
          provide: 'RequestService',
          useClass: CommonRequestService,
        },
      ],
    }).compile();

    credentialService = moduleRef.get<CredentialService>(CredentialService);
  });

  describe('getAccessToken', () => {
    it('should return access token', async () => {
      const accessToken = await credentialService.getAccessToken();
      expect(accessToken).toBeDefined();
    });
  });

  describe('getPublicKey', () => {
    it('should return publicKey', () => {
      const publicKey = credentialService.getPublicKey();
      expect(publicKey).toBe(process.env.CODEF_PUBLIC_KEY);
    });
  });
});
