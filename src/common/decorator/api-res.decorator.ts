import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

// const baseTypeNames = ['String', 'Number', 'Boolean'];
export enum ApiResType {
  OBJECT = 0,
  PAGE_ARRAY = 1,
  ARRAY = 2,
}

/**
 * @description: 生成返回结果装饰器
 */
export const ApiRes = <TModel extends Type<any>>(
  type?: TModel | TModel[],
  apiResType?: ApiResType, // 1或者true分页数组 , 2表示单纯数组
  data?: unknown,
) => {
  let prop = null;
  // if (Array.apiResType(type)) {
  //   if (apiResType) {
  //     prop = {
  //       type: 'object',
  //       properties: {
  //         records: {
  //           type: 'array',
  //           items: { $ref: getSchemaPath(type[0]) },
  //         },
  //         pages: { type: 'number', default: 0 },
  //         total: { type: 'number', default: 0 },
  //         current: { type: 'number', default: 0 },
  //         pageSize: { type: 'number', default: 0 },
  //       },
  //     };
  //   } else {
  //     prop = {
  //       type: 'array',
  //       items: { $ref: getSchemaPath(type[0]) },
  //     };
  //   }
  // } else if (type) {
  //   if (type && baseTypeNames.includes(type.name)) {
  //     prop = { type: type.name.toLocaleLowerCase() };
  //   } else {
  //     prop = { $ref: getSchemaPath(type) };
  //   }
  // } else {
  //   prop = { type: 'null', default: null };
  // }
  if (apiResType || apiResType === ApiResType.OBJECT) {
    switch (apiResType) {
      case ApiResType.OBJECT: {
        prop = {
          type: 'object',
          properties: {
            records: {
              type: 'array',
              items: { $ref: getSchemaPath(type as unknown as string) },
            },
            pages: { type: 'number', default: 0 },
            total: { type: 'number', default: 0 },
            current: { type: 'number', default: 0 },
            pageSize: { type: 'number', default: 0 },
          },
        };
      }
      case ApiResType.ARRAY: {
        prop = {
          type: 'array',
          items: { $ref: getSchemaPath(type as unknown as string) },
        };
        break;
      }
      case ApiResType.PAGE_ARRAY: {
        prop = {
          type: 'object',
          properties: {
            records: {
              type: 'array',
              items: { $ref: getSchemaPath(type as unknown as string) },
            },
            pages: { type: 'number', default: 0 },
            total: { type: 'number', default: 0 },
            current: { type: 'number', default: 0 },
            pageSize: { type: 'number', default: 0 },
          },
        };
        break;
      }
      default: {
        prop = data;
      }
    }
  } else {
    if (type) {
      prop = { $ref: getSchemaPath(type as unknown as string) };
    } else {
      prop = data;
    }
  }

  const resProps = {
    type: 'object',
    properties: {
      code: { type: 'string', default: '000000' },
      msg: { type: 'string', default: 'ok' },
      data: prop,
    },
  };

  return applyDecorators(
    ApiExtraModels(type ? (Array.isArray(type) ? type[0] : type) : String),
    ApiResponse({
      schema: {
        allOf: [resProps],
      },
    }),
  );
};

export const ApiStringRes = () => {
  const resProps = {
    type: 'object',
    properties: {
      code: { type: 'string', default: '000000' },
      msg: { type: 'string', default: 'ok' },
      data: { type: 'string', default: '' },
    },
  };

  return applyDecorators(
    ApiResponse({
      schema: {
        allOf: [resProps],
      },
    }),
  );
};
