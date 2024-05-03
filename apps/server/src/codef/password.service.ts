import { Injectable } from '@nestjs/common';
import NodeRSA from 'node-rsa';
import { CredentialService } from './credential.service';

@Injectable()
export class PasswordService {
  constructor(private credentialService: CredentialService) {}

  public encryptPassword(password: string): string {
    const key = new NodeRSA();
    key.importKey(this.credentialService.getPublicKey(), 'pkcs8-public');
    key.setOptions({ encryptionScheme: 'pkcs1' });

    return key.encrypt(password, 'base64');
  }
}
