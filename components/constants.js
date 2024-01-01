const BASE_URL = "http://localhost:5000/api";
const AUTH_URL = `${BASE_URL}/auth`;
const USER_URL = `${BASE_URL}/user`;
const ADMIN_URL = `${BASE_URL}/admin`;

const LOGIN_URL = `${AUTH_URL}/login`;
const REGISTER_URL = `${AUTH_URL}/register`;
const REGISTER_VERIFY_URL = `${AUTH_URL}/register/verify`;
const FORGOT_PASSWORD_URL = `${AUTH_URL}/forgot-password`;
const FORGOT_PASSWORD_VERIFY_URL = `${AUTH_URL}/forgot-password/verify`;

const GET_EVENTS_URL = `${USER_URL}/event/all`;
const REGISTER_EVENT_URL = `${USER_URL}/event/register`;

export {
    LOGIN_URL,
    REGISTER_URL,
    REGISTER_VERIFY_URL,
    FORGOT_PASSWORD_URL,
    FORGOT_PASSWORD_VERIFY_URL,
    GET_EVENTS_URL,
    REGISTER_EVENT_URL
};