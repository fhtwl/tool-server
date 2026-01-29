export function success(
  data: unknown,
  code: string = '000000',
  message: string = 'success',
) {
  return {
    code,
    data,
    message,
  };
}

/**
 * 修改对象字段映射
 * @param obj
 * @param mappings
 * @returns
 */
export function renameObjectFields<
  T extends Record<string, any>,
  K extends keyof T,
>(obj: T, mappings: Record<K, string>): Record<string, any> {
  // 创建一个新对象来存储修改后的属性
  const result: Record<string, any> = {};

  // 遍历原对象的所有属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 检查是否存在映射
      if (mappings[key as unknown as K] !== undefined) {
        // 如果有映射，则使用新字段名并将值存入结果对象
        result[mappings[key as unknown as K]] = obj[key];
      } else {
        // 如果没有映射，直接将原字段名和值存入结果对象
        result[key] = obj[key];
      }
    }
  }

  return result;
}
