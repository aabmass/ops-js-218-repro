import bunyan from 'bunyan';
import {LogLevel} from '@opentelemetry/core';
import {NodeTracerProvider} from '@opentelemetry/node';
import {BatchSpanProcessor} from '@opentelemetry/tracing';
import {TraceExporter} from '@google-cloud/opentelemetry-cloud-trace-exporter';
import {CloudPropagator} from '@google-cloud/opentelemetry-cloud-trace-propagator';

const initTracer = (logger: bunyan): void => {
  const provider = new NodeTracerProvider({
    logger,
    logLevel: LogLevel.ERROR,
  });
  provider.register({
    propagator: new CloudPropagator(),
  });

  // Initialize the exporter
  const exporter = new TraceExporter({
    logger,
  });

  // Configure the span processor to send spans to the exporter
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
};

initTracer(bunyan.createLogger({name: __filename}));
