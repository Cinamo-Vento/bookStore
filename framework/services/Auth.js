import { config } from "./controller";
import supertest from "supertest";

class Auth {
  /**
   * Метод генерирует токен по логинуи паролю
   * @param {string} userName
   * @param {string} password
   * @returns response
   */
  async generateToken(userName, password) {
    const response = await fetch(`${config.baseURL}/Account/v1/GenerateToken`, {
      method: "post",
      body: JSON.stringify({
        userName: userName,
        password: password,
      }),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log(JSON.stringify(response));
    return {
      headers: response.headers,
      status: response.status,
      data: response.json(),
    };
  }

  /**
   * Метод выполняет авторизацию по логину и паролю
   * @param {{userName: string, password: string}} body
   * @returns response
   */
  async authorized(body) {
    const response = await supertest(config.baseURL)
      .post("/Account/v1/Authorized")
      .send(body);

    console.log(JSON.stringify(response));
    return {
      headers: response.headers,
      status: response.status,
      data: response.body,
    };
  }
}

export default Auth;
