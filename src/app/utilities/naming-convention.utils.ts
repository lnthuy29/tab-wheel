/**
 * Converts object keys from camelCase to snake_case recursively.
 */
export function toSnakeCaseObject<
  T extends Record<string, any>,
>(obj: T): Record<string, any> {
  const toSnake = (key: string) =>
    key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`,
    );

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnake(key);

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      result[snakeKey] = toSnakeCaseObject(value);
    } else {
      result[snakeKey] = value;
    }
  }

  return result;
}

/**
 * Converts object keys from snake_case to camelCase recursively.
 */
export function toCamelCaseObject<
  T extends Record<string, any>,
>(obj: Record<string, any>): T {
  const toCamel = (key: string) =>
    key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    );

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamel(key);

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      result[camelKey] = toCamelCaseObject(value);
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map((item) =>
        typeof item === 'object'
          ? toCamelCaseObject(item)
          : item,
      );
    } else {
      result[camelKey] = value;
    }
  }

  return result as T;
}
