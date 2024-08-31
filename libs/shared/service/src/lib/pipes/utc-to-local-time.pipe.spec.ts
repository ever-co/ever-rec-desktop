import { UtcToLocalTimePipe } from './utc-to-local-time.pipe';

describe('UtcToLocalTimePipe', () => {
  it('create an instance', () => {
    const pipe = new UtcToLocalTimePipe();
    expect(pipe).toBeTruthy();
  });
});
