import { type StartOptions, setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const server = setupWorker(...handlers);

export const enableMocking = async (options?: StartOptions) => {
  if (!import.meta.env.DEV) {
    return;
  }

  return server.start(options);
};
