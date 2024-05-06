// eslint-disable-next-line no-unused-vars

import { faker } from "@faker-js/faker";
import { Auth, User, Book } from "../framework/services/controller";
import { config } from "../framework/services/controller";
import {
  getToken,
  userCredentials as cred,
  getUUID,
} from "../framework/fixtures/userFixture";

describe("Account API test", () => {
  const au = new Auth();
  const u = new User();
  const b = new Book()

  beforeAll(async () => {
    await u.createUser(cred.userName, cred.password);
  });

  describe("Создание пользователя", () => {
    it("Создание пользователя c ошибкой, логин уже используется", async () => {
      const response = await u.createUser(cred.userName, cred.password);
      const data = await response.data;

      expect(response.status).toBe(406);
      expect(data.code).toBe("1204");
      expect(data.message).toBe("User exists!");
    });

    it("Создание пользователя c ошибкой, пароль не подходит", async () => {
      const response = await u.createUser(cred.userName, cred.invalidPassword);
      const data = await response.data;

      expect(response.status).toBe(400);
      expect(data.code).toBe("1300");
      expect(data.message).toBe(
        "Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.",
      );
    });

    it("Создание пользователя успешно", async () => {
      const newUserName = faker.internet.userName();

      const response = await u.createUser(newUserName, config.password);
      const data = await response.data;

      expect(response.status).toBe(201);
      expect(data.userID).toBeTruthy;
      expect(data.userID).toHaveLength(36);
      expect(data.username).toBe(newUserName);
      expect(data).toHaveProperty("books", []);
    });
  });

  describe("Генерация токена", () => {
    it("Генерация токена c ошибкой, пароль не передан", async () => {
      const response = await au.generateToken(config.username, "");
      const data = await response.data;

      expect(response.status).toBe(400);
      expect(data.code).toBe("1200");
      expect(data.message).toBe("UserName and Password required.");
    });

    it.each([
      {
        test: "Неверный пароль",
        userName: config.username,
        password: cred.errPassword,
      },
      {
        test: "Несуществующий пользователь",
        userName: cred.notExistUser,
        password: config.password,
      },
    ])(`Генерация токена c ошибкой, $test`, async ({ userName, password }) => {
      const response = await au.generateToken(userName, password);
      const data = await response.data;

      expect(response.status).toBe(200);
      expect(data.token).toBe(null);
      expect(data.expires).toBe(null);
      expect(data.status).toBe("Failed");
      expect(data.result).toBe("User authorization failed.");
    });

    it("Генерация токена успешно", async () => {
      const response = await au.generateToken(config.username, config.password);
      const data = await response.data;

      expect(response.status).toBe(200);
      expect(data.token).toBeTruthy;
      expect(data.expires).toBeTruthy;
      expect(data.status).toBe("Success");
      expect(data.result).toBe("User authorized successfully.");
    });
  });

  describe("Авторизация пользователя", () => {
    it("Авторизация пользователя успешно", async () => {
      const response = await au.authorized({
        userName: config.username,
        password: config.password,
      });
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data).toBe(true);
    });

    it.each([
      {
        test: "Неверный пароль",
        body: { userName: config.username, password: cred.errPassword },
      },
      {
        test: "Несуществующий пользователь",
        body: { userName: cred.notExistUser, password: config.password },
      },
    ])("Ошибка авторизации, неверный логин или пароль", async ({ body }) => {
      const response = await au.authorized(body);
      const data = response.data;

      expect(response.status).toBe(404);
      expect(data.code).toBe("1207");
      expect(data.message).toBe("User not found!");
    });

    it.each([
      { test: "Не передан логин", body: { password: config.password } },
      { test: "Не передан пароль", body: { userName: config.username } },
    ])("Ошибка авторизации, не передан логин или пароль", async ({ body }) => {
      const response = await au.authorized(body);
      const data = response.data;

      expect(response.status).toBe(400);
      expect(data.code).toBe("1200");
      expect(data.message).toBe("UserName and Password required.");
    });
  });

  describe("Удаление пользователя", () => {
    const userName = cred.userName4Delete;

    let UUID;
    let token;
    beforeEach(async () => {
      UUID = await getUUID(userName, cred.password);
      token = await getToken(userName, cred.password);
    });

    it("Удаление пользователя успешно", async () => {
      const response = await u.deletededUser(UUID, token);
      const data = response.data;

      expect(response.status).toBe(204);
      expect(data).toBeFalsy;
    });

    it("Удаление пользователя c ошибкой авторизации", async () => {
      const response = await u.deletededUser(UUID, cred.wrongToken);
      const data = response.data;

      expect(response.status).toBe(401);
      expect(data.code).toBe("1200");
      expect(data.message).toBe("User not authorized!");
    });

    it("Удаление несуществующего пользователья с ошибкой", async () => {
      const response = await u.deletededUser(cred.notExistUUID, token);
      const data = response.data;

      expect(response.status).toBe(200);
      expect(data.code).toBe("1207");
      expect(data.message).toBe("User Id not correct!");
    });
  });

  describe("Получение информации о пользователе", () => {
    let token;
    beforeAll(async () => {
      token = await getToken(config.username, config.password);
    });

    it("Получение информации о пользователе успешно", async () => {
      const response = await u.getUserInfo(config.userId, token);
      const data = response.data;
      expect(response.status).toBe(200);
      expect(data.userID).toBe.apply(config.userId);
      expect(data.username).toBe(config.username);
      expect(data).toHaveProperty("books");
    });

    it("Получение информации о пользователе c ошибкой авторизации", async () => {
      const response = await u.getUserInfo(config.userId, cred.wrongToken);
      const data = response.data;

      expect(response.status).toBe(401);
      expect(data.code).toBe("1200");
      expect(data.message).toBe("User not authorized!");
    });

    it("Получение информации о несуществующем пользователе с ошибкой", async () => {
      const response = await u.getUserInfo(cred.notExistUser, token);
      const data = response.data;

      expect(response.status).toBe(401);
      expect(data.code).toBe("1207");
      expect(data.message).toBe("User not found!");
    });
  });

});
