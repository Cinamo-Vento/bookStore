import { config } from "./controller";
import supertest from "supertest";

class Book {

    /**
     * 
     * @param {{"userId": "string", "collectionOfIsbns": [{"isbn": "string"}]}} body 
     * @param {string} token
     * @returns response
     */
    async addBooks(userId, isbnList, token) {
        const body = {
            userId,
            "collectionOfIsbns": isbnList.map(isbn => ({ isbn })),
        }

        const response = await supertest(config.baseURL)
            .post(`/BookStore/v1/Books`)
            .set("Authorization", `Bearer ${token}`)
            .send(body);

        console.log(JSON.stringify(response));
        return {
            headers: response.headers,
            status: response.status,
            data: response.body,
        };
    }

    /**
     * 
     * @param {string} userId
     * @param {string} token 
     * @returns 
     */
    async deleteBooks(userId, token) {

        const response = await supertest(config.baseURL)
            .delete(`/BookStore/v1/Books?UserId=${userId}`)
            .set("Authorization", `Bearer ${token}`)

        return {
            headers: response.headers,
            status: response.status,
            data: response.body,
        };
    }

    /**
     * 
     * @param {string} userId 
     * @param {string} isbn 
     * @param {string} token 
     * @returns 
     */
    async deleteBook(userId, isbn, token) {
        const body = {
            "isbn": isbn,
            "userId": userId
        }

        const response = await supertest(config.baseURL)
            .delete(`/BookStore/v1/Book`)
            .set("Authorization", `Bearer ${token}`)
            .send(body)

        return {
            headers: response.headers,
            status: response.status,
            data: response.body,
        };
    }

    /**
     * 
     * @param {Object} body
     * @param {Object} userId
     * @param {string} token 
     * @returns 
     */
    async editBook(body, isbn, token) {
        const response = await supertest(config.baseURL)
            .put(`/BookStore/v1/Book/${isbn}`)
            .set("Authorization", `Bearer ${token}`)
            .send(body)

        return {
            headers: response.header,
            status: response.status,
            data: response.body,
        };
    }

    /**
     * 
     * @param {object} isbn
     * @param {string} token 
     * @returns 
     */
    async getBookInfo( isbn , token) {


        const response = await supertest(config.baseURL)
            .get(`/BookStore/v1/Book?ISBN=${isbn}`)
            .set("Authorization", `Bearer ${token}`)

        return {
            headers: response.headers,
            status: response.status,
            data: response.body,
        };
    }
}

export default Book
