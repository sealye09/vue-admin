export default [
  {
    // 生成模拟的商品数据
    url: "/api/dashboard/products",
    method: "get",
    timeout: 200,
    statusCode: 200,
    response: {
      code: 200,
      message: "success",
      "data|7-15": [
        {
          "id|+1": 1,
          name: "@ctitle(3, 8)",
          "price|50-500": 1,
          "sales|100-1000": 1,
          "inventory|50-200": 1,
        },
      ],
    },
  },
  {
    // 生成模拟的销售额数据
    url: "/api/dashboard/sales",
    method: "get",
    timeout: 200,
    statusCode: 200,
    response: {
      code: 200,
      message: "success",
      "data|7": [
        {
          day: '@date("yyyy-MM-dd")',
          amount: "@integer(1000, 5000)",
        },
      ],
    },
  },
  {
    url: "/api/dashboard/users/age",
    method: "get",
    timeout: 200,
    statusCode: 200,
    response: {
      code: 200,
      message: "success",
      "data|4": [
        {
          "name|+1": ["18-25岁", "26-35岁", "36-45岁", "45岁以上"],
          "value|10-50": 1,
        },
      ],
    },
  },
];
