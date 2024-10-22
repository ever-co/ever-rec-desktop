import { HumanizeBytesPipe } from './humanizeBytes.pipe';

describe('HumanizeBytesPipe', () => {
  it('create an instance', () => {
    const pipe = new HumanizeBytesPipe();
    expect(pipe).toBeTruthy();
  });
});
