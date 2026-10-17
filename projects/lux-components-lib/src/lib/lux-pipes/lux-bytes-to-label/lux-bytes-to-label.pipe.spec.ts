import { TestBed } from '@angular/core/testing';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxBytesToLabelPipe } from './lux-bytes-to-label.pipe';

describe('LuxBytesToLabelPipe', () => {
  function createPipe() {
    return TestBed.runInInjectionContext(() => new LuxBytesToLabelPipe());
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();
  });

  it('should create an instance', () => {
    const pipe = createPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    const pipe = createPipe();
    expect(pipe.transform(null)).toEqual('');
  });

  it('should return empty string for undefined', () => {
    const pipe = createPipe();
    expect(pipe.transform(undefined)).toEqual('');
  });

  it('should return empty string for NaN', () => {
    const pipe = createPipe();
    expect(pipe.transform(NaN)).toEqual('');
  });

  it('should return empty string for negative bytes', () => {
    const pipe = createPipe();
    expect(pipe.transform(-1)).toEqual('');
    expect(pipe.transform(-1024)).toEqual('');
  });

  it('should return "0 MiB" for zero bytes', () => {
    const pipe = createPipe();
    expect(pipe.transform(0)).toEqual('0 MiB');
  });

  it('should return "0 B" for zero bytes with unit B', () => {
    const pipe = createPipe();
    expect(pipe.transform(0, 'B')).toEqual('0 B');
  });

  it('should display bytes correctly with unit B', () => {
    const pipe = createPipe();
    expect(pipe.transform(512, 'B')).toEqual('512 B');
    expect(pipe.transform(1024, 'B')).toEqual('1.024 B');
  });

  it('should display KB correctly', () => {
    const pipe = createPipe();
    expect(pipe.transform(5000, 'KB')).toEqual('5 KB');
    expect(pipe.transform(1500000, 'KB')).toEqual('1.500 KB');
  });

  it('should display KiB correctly', () => {
    const pipe = createPipe();
    expect(pipe.transform(5120, 'KiB')).toEqual('5 KiB');
  });

  it('should fall back to KB when value is less than 1 MB', () => {
    const pipe = createPipe();
    // 500_000 bytes = 0.5 MB → falls back to 500 KB
    expect(pipe.transform(500_000, 'MB')).toEqual('500 KB');
  });

  it('should fall back to KiB when value is less than 1 MiB', () => {
    const pipe = createPipe();
    // 512 * 1024 bytes = 512 KiB → less than 1 MiB
    expect(pipe.transform(512 * 1024, 'MiB')).toEqual('512 KiB');
  });

  it('should display MiB correctly with decimals', () => {
    const pipe = createPipe();
    expect(pipe.transform(1024 * 1024, 'MiB')).toEqual('1,00 MiB');
    expect(pipe.transform(1.5 * 1024 * 1024, 'MiB')).toEqual('1,50 MiB');
  });

  it('should use minimum value of 1 KB for very small non-zero byte sizes', () => {
    const pipe = createPipe();
    // 1 byte → 0.001 KB → truncated to 0, but minimum is 1 KB
    expect(pipe.transform(1, 'KB')).toEqual('1 KB');
  });

  it('should use minimum value of 1 KiB for very small non-zero byte sizes', () => {
    const pipe = createPipe();
    // 1 byte → 0.000976 KiB → truncated to 0, but minimum is 1 KiB
    expect(pipe.transform(1, 'KiB')).toEqual('1 KiB');
  });
});
