export function isAsyncFn(fn: unknown): boolean {
  if (typeof fn !== "function") throw new TypeError("Expected a function");

  if (fn.constructor.name === "AsyncFunction") return true;

  try {
    const result = fn();
    return result instanceof Promise;
  } catch {
    return false;
  }
}
