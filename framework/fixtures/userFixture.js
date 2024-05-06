import { faker } from "@faker-js/faker";
import { Auth, User } from "../services/controller.js";

export const userCredentials = {
  userName: faker.internet.userName(),
  notExistUser: faker.internet.userName(),
  userName4Delete: faker.internet.userName(),
  password: "paSS123!",
  invalidPassword: "pass",
  errPassword: "wrongPa33",
  notExistUUID: "0a00a00a-0a00-00aa-0aaa-00a0a000aa000",
  wrongToken: "wrongToken",
};

/**
 * Метод возвращает токен
 * @param {string} userName
 * @param {string} password
 * @returns token
 */
export async function getToken(userName, password) {
  const au = new Auth();

  const response = await au.generateToken(userName, password);
  const data = await response.data;
  const token = data.token;

  return token;
}

/**
 * Метод создает пользовтеля и возвращает его UUID
 * @param {string} userName
 * @param {string} password
 * @returns UUID
 */
export async function getUUID(userName, password) {
  const u = new User()

  const response = await u.createUser(userName, password);
  const data = await response.data;
  const UUID = data.userID;

  return UUID;
}
