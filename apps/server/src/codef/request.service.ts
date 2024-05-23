import { Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import { CredentialService } from './credential.service';
import axios, { AxiosInstance } from 'axios';
import { RequestService } from '../request/types';
import * as opentelemetry from '@opentelemetry/api';
import { metrics } from '@opentelemetry/api';

@Injectable()
export class CodefRequestService implements RequestService {
  private axiosInstance: AxiosInstance;
  private limiter: Bottleneck;

  constructor(private credentialService: CredentialService) {
    this.limiter = new Bottleneck({
      maxConcurrent: 5,
      minTime: 200,
    });
    const meter = metrics.getMeter('codef-request-queue');
    meter
      .createObservableGauge('queued', {
        description: 'Queued Jobs',
      })
      .addCallback((result) => {
        result.observe(this.limiter.counts().QUEUED);
      });

    meter
      .createObservableGauge('running', {
        description: 'Running jobs',
      })
      .addCallback((result) => {
        result.observe(this.limiter.counts().RUNNING);
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
    const tracer = opentelemetry.trace.getTracer('codef-request-service');
    return tracer.startActiveSpan('post', async (span) => {
      const response = await this.limiter.schedule(async () => {
        const response = await this.axiosInstance.post<T>(url, data, {
          headers: {
            Authorization: `Bearer ${await this.credentialService.getAccessToken()}`,
          },
        });

        return response.data;
      });
      span.setAttribute('url', url);
      span.setAttribute('data', JSON.stringify(data));
      span.setAttribute('response', JSON.stringify(response));
      span.end();

      return response;
    });
  }
}
