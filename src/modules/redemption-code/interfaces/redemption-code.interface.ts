// export interface RedemptionCode {
//   id: number;
//   code: string;
//   age: number;
//   breed: string;
// }

/**
 * 激活码状态
 */
export enum RedemptionCodeStatus {
  /**
   * 未使用
   */
  NOT_USE = 0,
  /**
   * 已使用
   */
  Used,
}

/**
 * 激活码类型
 */
export enum RedemptionCodeType {
  /**
   * 科目
   */
  SUBJECT = 0,
  /**
   * 课程
   */
  COURSE,
}
