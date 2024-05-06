// eslint-disable-next-line no-unused-vars
import { nameIsValid, fullTrim, getTotal, getScore } from "../src/app.js";

describe("Unit tests", () => {
  describe("Test of the nameIsValid function", () => {
    it.each([
      { name: "Ян", expected: true },
      { name: "Анна-Мария", expected: true },
      { name: "Jack", expected: true },
    ])("The name $name is valid", ({ name, expected }) => {
      expect(nameIsValid(name)).toBe(expected);
    });

    it.each([
      { name: "", expected: false },
      { name: "N", expected: false },
      { name: "Jack Black", expected: false },
    ])("The name $name is invalid", ({ name, expected }) => {
      expect(nameIsValid(name)).toBe(expected);
    });
  });

  describe("Test of the fullTrim function", () => {
    it.each([
      {
        text: "Пример объявления функции",
        expected: "Примеробъявленияфункции",
      },
      { text: "Двойной  пробел", expected: "Двойнойпробел" },
      { text: " Пробел в начале строки", expected: "Пробелвначалестроки" },
      { text: "Пробел в конце строки ", expected: "Пробелвконцестроки" },
      { text: "НетПробела", expected: "НетПробела" },
      { text: " ", expected: "" },
    ])("Spaces removed successfully", ({ text, expected }) => {
      expect(fullTrim(text)).toBe(expected);
    });
  });

  describe("Test of the getTotal function", () => {
    it.each([
      { item: [{ price: 120, quantity: 5 }], discount: 0, expected: 600 },
      { item: [{ price: 100, quantity: 1 }], discount: 1, expected: 99 },
      { item: [{ price: 100, quantity: 10 }], discount: 10, expected: 900 },
      { item: [{ price: 1234, quantity: 7 }], discount: 99, expected: 86.38 },
      { item: [{ price: 150, quantity: 2 }], discount: 100, expected: 0 },
      {
        item: [
          { price: 10, quantity: 3 },
          { price: 70, quantity: 1 },
        ],
        discount: 5,
        expected: 95,
      },
    ])(
      "Order amount with $discount % discount is correct",
      ({ item, discount, expected }) => {
        const res = getTotal(item, discount);
        expect(res).toBeCloseTo(expected, 2);
      },
    );

    it.each([
      { item: [{ price: 100, quantity: 1 }], expected: 100 },
      {
        item: [
          { price: 100, quantity: 9 },
          { price: 50, quantity: 2 },
        ],
        expected: 1000,
      },
    ])("Order amount without discount is correct", ({ item, expected }) => {
      const res = getTotal(item);
      expect(res).toBeCloseTo(expected, 2);
    });

    it.each([
      {
        item: [{ price: 100, quantity: 5 }],
        discount: null,
        expected: "Скидка должна быть числом",
      },
      {
        item: [{ price: 100, quantity: 1 }],
        discount: -10,
        expected: "Процент скидки не может быть отрицательным",
      },
    ])(
      "Catch an invalid discount $discount",
      ({ item, discount, expected }) => {
        expect(() => {
          getTotal(item, discount);
        }).toThrow(expected);
      },
    );
  });
});
