import { server } from '../mocks/api';
import { beforeAll, beforeEach, afterAll, vi } from 'vitest';

beforeAll(() => server.listen());
beforeEach(() => {
  vi.resetAllMocks();
  server.resetHandlers();
});
afterAll(() => {
  vi.restoreAllMocks();
  server.close();
});
