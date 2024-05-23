import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

export function initTelemetry() {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'vacapi',
      [SEMRESATTRS_SERVICE_VERSION]: '1.0',
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    metricReader: new PrometheusExporter({
      port: 9464,
    }),
  });

  sdk.start();
  console.log('Telemetry started');
}
