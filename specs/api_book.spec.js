// eslint-disable-next-line no-unused-vars

import { User, Book } from "../framework/services/controller";
import { config } from "../framework/services/controller";
import {
  getToken,
  userCredentials as cred
} from "../framework/fixtures/userFixture";
import { bookList } from "../framework/fixtures/bookFixtures";

describe("BookStore API test", () => {
  const b = new Book()
  const u = new User()
  let isbnList = bookList.map(Book => (Book.isbn))
  let isbn = isbnList[2]

  describe("Получение информации о книге", () => {
    let token;

    beforeEach(async () => {
      token = await getToken(config.username, config.password);
    });
    it.each(bookList)
    (`"Получение информации о книге успешно", $book.isbn`, async (book) => {
      const response = await b.getBookInfo(book.isbn, token);
      const data = response.data;
      console.log(data)
      await expect(response.status).toBe(200);
      await expect(data.isbn).toBe(book.isbn)
      await expect(data.title).toBe(book.title)
      await expect(data.subTitle).toBe(book.subTitle)
      await expect(data.publish_date).toBe(book.publish_date)
      await expect(data.publisher).toBe(book.publisher)
      await expect(data.pages).toBe(book.pages)
      await expect(data.description).toBe(book.description)
      await expect(data.website).toBe(book.website)
    });

    it("Получение информации о книге с ошибкой", async () => {
      const response = await b.getBookInfo("wrongIsbn", token);
      const data = await response.data;
      await console.log(data)

      expect(response.status).toBe(400);
      expect(data.code).toBe("1205");
      expect(data.message).toBe("ISBN supplied is not available in Books Collection!");
    });
  });

  describe("Создание книги", () => {
    let token;

    beforeEach(async () => {
      token = await getToken(config.username, config.password);
      await b.deleteBooks(config.userId, token)
    });
    afterEach(async () => {
      await b.deleteBooks(config.userId, token)
    });

    it("Добавление книги успешно", async () => {
      const response = await b.addBooks(config.userId, [isbn], token);
      const data = response.data;
      console.log(data)
      await expect(response.status).toBe(201);
      await expect(data).toHaveProperty("books", [{ "isbn": isbn }])
    });

    it("Добавление списка книг успешно", async () => {
      const response = await b.addBooks(config.userId, isbnList, token);
      const data = response.data;

      await expect(response.status).toBe(201);
      await expect(data).toHaveProperty("books", isbnList.map(isbn => ({ isbn })))
    });

    it("Добавление книги с ошибкой авторизации", async () => {
      const response = await b.addBooks(config.userId, [isbn], "wrongToken");
      const data = response.data;

      expect(response.status).toBe(401);
      expect(data.code).toBe("1200");
      expect(data.message).toBe("User not authorized!");
    });

    it("Добавление книги с ошибкой", async () => {
      const response = await b.addBooks(config.userId, ["wrong"], token);
      const data = response.data;

      expect(response.status).toBe(400);
      expect(data.code).toBe("1205");
      expect(data.message).toBe("ISBN supplied is not available in Books Collection!");
    });
  });

  describe("Удаление книги", () => {
    let token;
    beforeEach(async () => {
      token = await getToken(config.username, config.password);
      await b.addBooks(config.userId, [isbn], token);
    });


    it("Удаление списка книг успешно", async () => {
      const response = await b.deleteBooks(config.userId, token)
      const data = response.data;
      console.log(data)
      await expect(response.status).toBe(204);
    });

    it("Удаление книги успешно", async () => {
      const response = await b.deleteBook(config.userId, isbn, token)
      const data = response.data;
      console.log(data)
      await expect(response.status).toBe(204);
    });

    it("Удаление книги c ошибкой авторизации", async () => {
      const response = await b.deleteBook(config.userId, isbn, "wrongToken")
      const data = response.data;
      expect(response.status).toBe(401);
      expect(data.code).toBe("1200");
      expect(data.message).toBe("User not authorized!");
    });

    it("Удаление книги с ошибкой", async () => {
      const response = await b.deleteBook(config.userId, "wrongIsbn", token)
      const data = response.data;

      expect(response.status).toBe(400);
      expect(data.code).toBe("1206");
      expect(data.message).toBe("ISBN supplied is not available in User's Collection!");
    });
  });


  describe("Обновление книги", () => {
    let token;
    beforeEach(async () => {
      token = await getToken(config.username, config.password);
      await b.addBooks(config.userId, [isbn], token);
    });
    afterEach(async () => {
      await b.deleteBook(config.userId, isbn, token)
    });


    it.each([
      {
        test: "title",
        bookNew:
        {
          "userId": config.userId,
          "isbn": isbn,
          "title": "New Title"
        }
      },
      {
        test: "author",
        bookNew:
        {
          "userId": config.userId,
          "isbn": isbn,
          "title": "New Author"
        }
      },
    ])(`"Обновление книги успешно", $test`, async ({ bookNew }) => {
      const response = await b.editBook(bookNew, isbn, token)
      const data = await response.data;
      console.log(await data)

      await expect(response.status).toBe(200);
      await expect(data).toHaveProperty("books", [bookNew])
    });

    it("Обновление книги с ошибкой", async () => {
      const response = await b.editBook(bookList[2], "wrongIsbn", token)
      const data = await response.data;
      expect(response.status).toBe(400);
      expect(data.code).toBe("1206");
      expect(data.message).toBe("ISBN supplied is not available in User's Collection!");
    });

    it("Обновление книги c ошибкой авторизации", async () => {
      const response = await b.editBook(bookList[2], isbn, "wrongToken")
      const data = response.data;
      expect(response.status).toBe(401);
      expect(data.code).toBe("1200");
      expect(data.message).toBe("User not authorized!");
    });
  });
})