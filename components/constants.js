const BASE_URL = "http://localhost:5000/api";
const AUTH_URL = `${BASE_URL}/auth`;
const USER_URL = `${BASE_URL}/user`;
const ADMIN_URL = `${BASE_URL}/admin`;

const LOGIN_URL = `${AUTH_URL}/login`;
const REGISTER_URL = `${AUTH_URL}/register`;
const REGISTER_VERIFY_URL = `${AUTH_URL}/register/verify`;

export {
    LOGIN_URL,
    REGISTER_URL,
    REGISTER_VERIFY_URL,
};