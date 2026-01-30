function camelCaseToKebabCase(str: string): string {
  return str.replaceAll(/[A-Z]/g, (s) => '-' + s.toLowerCase());
}

export function paramsToStr(obj: object = {}): string {
  const str = Object.entries(obj)
    .map(([key, value]) => {
      const kebabKey = camelCaseToKebabCase(key);
      let sanitizedValue = value;
      if (Array.isArray(value)) sanitizedValue = value.join(',');

      if (
        kebabKey === 'format' &&
        (sanitizedValue as string).toLowerCase() !== 'json'
      ) {
        throw new Error(
          `Fetch request failed: client only supports json format response`,
        );
      }

      if (kebabKey.toLowerCase() === 'callback') {
        throw new Error(
          `Fetch request failed: client does not support callback parameter`,
        );
      }

      return `${kebabKey}=${sanitizedValue}`;
    })
    .join('&');
  return str;
}
