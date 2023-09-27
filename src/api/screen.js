/**
 * screen页面的数据接口 mock
 */

import request from "@/utils/request";

export function getSeller() {
  return request({
    url: "/screen/seller",
    method: "get",
  });
}

export function getRank() {
  return request({
    url: "/screen/rank",
    method: "get",
  });
}

export function getMap() {
  return request({
    url: "/screen/map",
    method: "get",
  });
}

export function getBudget() {
  return request({
    url: "/screen/budget",
    method: "get",
  });
}

export function getHotproduct() {
  return request({
    url: "/screen/hotproduct",
    method: "get",
  });
}

export function getStock() {
  return request({
    url: "/screen/stock",
    method: "get",
  });
}

export function getTrend() {
  return request({
    url: "/screen/trend",
    method: "get",
  });
}
