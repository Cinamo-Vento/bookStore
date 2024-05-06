import "dotenv/config";
const config = {
  baseURL: process.env.TEST_BASE_API_URL ?? "https://bookstore.demoqa.com", // undefined
  userId: process.env.TEST_UUID ?? "5f75e38e-0f16-41fb-9cbd-55a7d943f490",
  username: process.env.TEST_USERNAME ?? "test_user_78125",
  password: process.env.TEST_PASSWORD ?? "paSS_54!",
};
export default config;
