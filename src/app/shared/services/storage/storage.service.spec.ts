import { TestBed } from '@angular/core/testing';
import { StorageServiceBase } from './storage.service';

function setupTests<T extends StorageServiceBase>(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  serviceType: any,
  prefix: string
): void {
  let service: T;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    service = TestBed.inject(serviceType);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get/set values', () => {
    const payload = { arg1: 'value1', arg2: true };
    const key = prefix + 'storage-get-set';
    service.set(key, payload);
    expect(service.get<typeof payload>(key)).toEqual(payload);
  });

  it('should allow a default for get', () => {
    const defaultValue = { arg1: 'value1', arg2: true };
    const key = prefix + 'storage-get-default';
    expect(service.get<typeof defaultValue>(key, defaultValue)).toEqual(defaultValue);
  });
  it('should remove values', () => {
    const payload = { arg1: 'value1', arg2: true };
    const key = prefix + 'storage-remove';
    service.set(key, payload);
    service.remove(key);
    expect(service.get<typeof payload>(key)).toBeNull();
  });
}

export { setupTests };