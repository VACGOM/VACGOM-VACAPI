import ClientBrowser from 'jayson/lib/client/browser';
import {
  InputSecureNoRequest,
  InputSMSCodeRequest,
  JsonRpcDomainException,
  PasswordChangeSuccessResponse,
  ResetPasswordRequest,
  VaccinationRequest,
  VaccinationResponse,
} from '@vacgom/types';
import {
  JSONRPCCallbackTypePlain,
  JSONRPCCallbackTypeSugared,
  JSONRPCError,
  JSONRPCErrorLike,
  JSONRPCResultLike,
  RequestParamsLike,
} from 'jayson';
import { isLeft, isRight } from 'fp-ts/Either';
import { DomainException } from '../../../../../apps/server/src/exception/domain-exception';
import { ValidationError } from '../../../../../apps/server/src/password-reset/exception/ValidationError';
import { PasswordResetStateType } from '../../../../../apps/server/src/password-reset/password-reset.context';

const jaysonBrowserClient = require('jayson/lib/client/browser');

export type JsonRPCDomainException = JSONRPCError & {
  data: DomainException;
};

export class Vacapi {
  private client: ClientBrowser;

  constructor(
    private readonly apiUrl: string,
    private readonly accessToken: string
  ) {
    this.client = new jaysonBrowserClient(
      async (request: string, callback: JSONRPCCallbackTypePlain) => {
        try {
          const response = await fetch(this.apiUrl, {
            method: 'POST',
            body: request,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.accessToken}`,
            },
          });
          const json = await response.text();

          callback(null, json);
        } catch (e) {
          console.log('요건 요청 에러');
          if (e instanceof Error) {
            callback(e);
          }
        }
      },
      {}
    );
    console.log('Vacapi Client Initialized');
  }

  async getVaccinationRecords(
    request: VaccinationRequest
  ): Promise<VaccinationResponse> {
    const validation = VaccinationRequest.decode(request);
    if (isLeft(validation)) throw new ValidationError(validation.left);

    return this.request('vaccination.getVaccinationRecords', validation);
  }

  async getCurrentState(): Promise<string> {
    try {
      return await this.request('password-reset.currentState', {});
    } catch (e) {
      return PasswordResetStateType.INITIAL;
    }
  }

  async inputSMSCode(
    request: InputSMSCodeRequest
  ): Promise<PasswordChangeSuccessResponse> {
    const req = InputSMSCodeRequest.encode(request);
    const response = await this.request('password-reset.inputSMSCode', req);

    const validation = PasswordChangeSuccessResponse.decode(response);
    if (isLeft(validation)) {
      throw new ValidationError(validation.left);
    }

    return validation.right;
  }

  inputSecureNo(request: InputSecureNoRequest): Promise<boolean> {
    const req = InputSecureNoRequest.encode(request);
    return this.request('password-reset.inputSecureNo', req);
  }

  async resetContext(): Promise<void> {
    return this.request('password-reset.resetContext', {});
  }

  async requestPasswordChange(request: ResetPasswordRequest): Promise<boolean> {
    const validate = ResetPasswordRequest.decode(request);
    if (isLeft(validate)) {
      throw new ValidationError(validate.left);
    }

    const req = ResetPasswordRequest.encode(request);
    return this.request('password-reset.requestPasswordReset', req);
  }

  async requestSecureNoImage(): Promise<string> {
    return this.request('password-reset.requestSecureNoImage', {});
  }

  async refreshSecureNoImage(): Promise<string> {
    return this.request('password-reset.refreshSecureNoImage', {});
  }

  private isDomainException(error: any): error is JsonRPCDomainException {
    const decoded = JsonRpcDomainException.decode(error);
    return !!isRight(decoded);
  }

  private request(method: string, payload: RequestParamsLike): Promise<any> {
    return new Promise((resolve, reject) => {
      const callback: JSONRPCCallbackTypeSugared = (
        err?: Error | null,
        error?: JSONRPCErrorLike | JsonRPCDomainException,
        result?: JSONRPCResultLike
      ): void => {
        if (error) {
          if (this.isDomainException(error)) {
            reject(new DomainException(error.data.errorData, error.data.data));
          } else {
            reject(error);
          }
        }

        resolve(result);
      };

      this.client.request(method, payload, callback);
    });
  }
}
