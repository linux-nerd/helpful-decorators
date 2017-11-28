export function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalFn: Function = descriptor.value,
    cache: any = {};

  descriptor.value = (...args) => {
    const arg = args[0];

    if (arg in cache) {
      console.log('Fetching From Cache');
      return cache[arg];
    } else {
      console.log('Calculating Result');
      cache[arg] = originalFn(arg);
      return cache[arg];
    }
  }

  return descriptor;
}