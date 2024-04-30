import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CodefTokenResponse } from './types/token/codef-token.response';
import { CodefAccessTokenException } from './exceptions/CodefAccessTokenException';
import { RequestService } from '../request/types';

@Injectable()
export class CredentialService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly publicKey: string;
  private accessToken?: string;

  constructor(
    @Inject('RequestService')
    private requestService: RequestService
  ) {
    this.clientId = process.env.CODEF_CLIENT_ID;
    this.clientSecret = process.env.CODEF_CLIENT_SECRET;
    this.publicKey = process.env.CODEF_PUBLIC_KEY;
  }

  public async refreshAccessToken(): Promise<void> {
    this.accessToken = await this.requestAccessToken();
  }

  public async getAccessToken(): Promise<string> {
    if (!this.accessToken) await this.refreshAccessToken();
    return this.accessToken;
  }

  public getPublicKey(): string {
    return this.publicKey;
  }

  private async requestAccessToken(): Promise<string> {
    try {
      const response = await axios.post<CodefTokenResponse>(
        'https://oauth.codef.io/oauth/token?grant_type=client_credentials&scope=read',
        null,
        {
          headers: {
            Authorization: `Basic ${this.getAuthString()}`,
            Accept: 'application/json',
          },
        }
      );

      return response.data.access_token;
    } catch (e) {
      throw new CodefAccessTokenException(e.response);
    }
  }

  private getAuthString(): string {
    return Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64'
    );
  }
}
