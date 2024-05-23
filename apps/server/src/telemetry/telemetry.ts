import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';

export function initTelemetry() {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'vacapi',
      [SEMRESATTRS_SERVICE_VERSION]: '1.0',
    }),
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation({
        spanNameHook: (req, name) => {
          if (req.request.body.jsonrpc)
            return `${req.route} - ${req.request.body.method}`;
          return `${req.route} - ${name}`;
        },
      }),
    ],
    traceExporter: new OTLPTraceExporter({
      url: 'http://127.0.0.1:14317',
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: 'http://127.0.0.1:14317',
      }),
    }),
  });

  sdk.start();
  console.log('Telemetry started');
}
