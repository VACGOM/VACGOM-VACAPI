import { Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import { CredentialService } from './credential.service';
import axios, { AxiosInstance } from 'axios';
import { RequestService } from '../request/types';

@Injectable()
export class CodefRequestService implements RequestService {
  private axiosInstance: AxiosInstance;
  private limiter: Bottleneck;

  constructor(private credentialService: CredentialService) {
    this.limiter = new Bottleneck({
      maxConcurrent: 5,
      minTime: 200,
    });

    this.axiosInstance = axios.create({
      validateStatus: () => true,
      transformResponse: [
        (data: string) => {
          return JSON.parse(decodeURIComponent(data.replace(/\+/g, '%20')));
        },
      ],
    });
  }

  public get<T>(url: string): Promise<T> {
    return this.limiter.schedule(async () => {
      const response = await this.axiosInstance.get<T>(url, {
        headers: {
          Authorization: `Bearer ${await this.credentialService.getAccessToken()}`,
        },
      });

      return response.data;
    });
  }

  public post<T>(url: string, data: any): Promise<T> {
    return this.limiter.schedule(async () => {
      const response = await this.axiosInstance.post<T>(url, data, {
        headers: {
          Authorization: `Bearer ${await this.credentialService.getAccessToken()}`,
        },
      });

      console.log(data, response.data, response.data);
      return response.data;
    });
  }
}
