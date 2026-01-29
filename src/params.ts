function camelCaseToKebabCase(str: string): string {
  return str.replaceAll(/[A-Z]/g, (s) => '-' + s.toLowerCase());
}

export function paramsToStr(obj = {}): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      const kebabKey = camelCaseToKebabCase(key);
      let sanitizedValue = value;
      if (Array.isArray(value)) sanitizedValue = value.join(',');
      return `${kebabKey}=${sanitizedValue}`;
    })
    .join('&');
}
