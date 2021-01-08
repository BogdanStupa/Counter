import { JsonValuePipe } from './json-value.pipe';

describe('JsonValuePipe', () => {
  it('create an instance', () => {
    const pipe = new JsonValuePipe();
    expect(pipe).toBeTruthy();
  });
});
