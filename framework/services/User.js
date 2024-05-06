import { config } from "./controller";
import supertest from "supertest";

class User {
  /**
   * Метод создает пользователю по логину и паролю
   * @param {string} userName
   * @param {string} password
   * @returns response
   */
  async createUser(userName, password) {
    const response = await fetch(`${config.baseURL}/Account/v1/User`, {
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
    return {
      headers: response.headers,
      status: response.status,
      data: response.json(),
    };
  }

  /**
   * Метод удаляет пользователя по UUID
   * @param {string} UUID
   * @param {string} token
   * @returns response
   */
  async deletededUser(UUID, token) {
    const response = await supertest(config.baseURL)
      .delete(`/Account/v1/User/${UUID}`)
      .set("Authorization", `Bearer ${token}`);

    console.log(JSON.stringify(response));
    return {
      headers: response.headers,
      status: response.status,
      data: response.body,
    };
  }

  /**
   * Метод получает информацию о пользователе по UUID
   * @param {string} UUID
   * @param {string} token
   * @returns response
   */
  async getUserInfo(UUID, token) {
    const response = await supertest(config.baseURL)
      .get(`/Account/v1/User/${UUID}`)
      .set("Authorization", `Bearer ${token}`);

    console.log(JSON.stringify(response));
    return {
      headers: response.headers,
      status: response.status,
      data: response.body,
    };
  }
}

export default User;
