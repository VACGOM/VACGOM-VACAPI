import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RequestService } from './types';

@Injectable()
export class CommonRequestService implements RequestService {
  private axiosInstance = axios.create();

  public async get<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, {});

    return response.data;
  }

  public async post<T>(url: string, data: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, {});

    return response.data;
  }
}
