import request from "@/utils/request";

export function getProducts() {
  return request({
    url: "/dashboard/products",
    method: "get",
  });
}

export function getSales() {
  return request({
    url: "/dashboard/sales",
    method: "get",
  });
}

export function getUsersAge() {
  return request({
    url: "/dashboard/users/age",
    method: "get",
  });
}
