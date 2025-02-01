// snake_case를 camelCase로 변환하는 함수
export function convertKeysToCamelCase(data) {
  if (Array.isArray(data)) {
    return data.map(item => convertKeysToCamelCase(item));
  } else if (data !== null && typeof data === 'object') {
    const camelCaseData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        camelCaseData[camelCaseKey] = convertKeysToCamelCase(data[key]);
      }
    }
    return camelCaseData;
  }
  return data;
}