export function FileInput() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] || null;

      // Call the original method with just the File object
      return originalMethod.call(this, file);
    };

    return descriptor;
  };
}
