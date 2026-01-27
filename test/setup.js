import { server } from '../mocks/api';
import { beforeAll, beforeEach, afterAll } from 'vitest';

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());
