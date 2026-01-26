import GuardianContentClient from '../dist/index';
import { describe, expect, it } from 'vitest';

const TEST_API_KEY = 'test';

describe('GuardianContentClient', () => {
  it('should be the default export of index', () => {
    expect(GuardianContentClient).toBeDefined();
  });
});
