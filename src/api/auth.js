import request from "@/utils/request.js";

export async function login(username, password) {
  console.log("login");
  const res = await request.post("/login", { username, password });
  return res;
}

export async function logout() {}
