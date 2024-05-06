import { SetMetadata } from '@nestjs/common';

export const JSON_RPC_CONTROLLER = Symbol('JSON_RPC_CONTROLLER');
export const JSON_RPC_METHOD = Symbol('JSON_RPC_METHOD');
export const JSON_RPC_PARAMS = Symbol('JSON_RPC_PARAMS');

export function JsonRpcController(controllerName: string): ClassDecorator {
  return SetMetadata(JSON_RPC_CONTROLLER, controllerName);
}

export function JsonRpcMethod(methodName: string) {
  return SetMetadata(JSON_RPC_METHOD, methodName);
}

export type RequestContext = {
  req: Request;
  body: any;
};

export type RouteParamTypes = 'REQ' | 'BODY';
export type JsonRpcParamsMetadata = {
  params: JsonRpcParam[];
};

export type JsonRpcParam = {
  type: RouteParamTypes;
  key: string | symbol;
  index: number;
};

function createRouteParamDecorator(type: RouteParamTypes): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const meta: JsonRpcParamsMetadata =
      Reflect.getOwnMetadata(JSON_RPC_PARAMS, target.constructor) || {};

    const params = meta.params || [];

    Reflect.defineMetadata(
      JSON_RPC_PARAMS,
      {
        params: [...params, { type, key: propertyKey, index: parameterIndex }],
      },
      target.constructor
    );
  };
}

export const Body = createRouteParamDecorator('BODY');
export const Req = createRouteParamDecorator('REQ');
