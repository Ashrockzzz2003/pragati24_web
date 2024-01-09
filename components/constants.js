const BASE_URL = "http://localhost:5000/api";
const AUTH_URL = `${BASE_URL}/auth`;
const USER_URL = `${BASE_URL}/user`;

const LOGIN_URL = `${AUTH_URL}/login`;
const REGISTER_URL = `${AUTH_URL}/register`;
const REGISTER_VERIFY_URL = `${AUTH_URL}/register/verify`;
const FORGOT_PASSWORD_URL = `${AUTH_URL}/forgot-password`;
const FORGOT_PASSWORD_VERIFY_URL = `${AUTH_URL}/forgot-password/verify`;

const GET_EVENTS_URL = `${USER_URL}/event/all`;
const REGISTER_EVENT_URL = `${USER_URL}/event/register`;
const EVENT_RECEIPT_URL = `${USER_URL}/event/receipt`;

const USER_PROFILE_URL = `${USER_URL}/profile`;
const USER_EVENTS_URL = `${USER_URL}/profile/event`;
const EDIT_PROFILE_URL = `${USER_URL}/profile/edit`;
const USER_TRANSACTIONS_URL = `${USER_URL}/profile/transactions`;

const ADMIN_EVENTS_URL = `${BASE_URL}/admin/event/all`;
const ADMIN_DOWNLOAD_PARTICIPANTS_LIST_URL = `${BASE_URL}/admin/event/participants`;

const VERIFY_TRANSACTIONS_URL = `${USER_URL}/event/register/verify`;

export {
    LOGIN_URL,
    REGISTER_URL,
    REGISTER_VERIFY_URL,
    FORGOT_PASSWORD_URL,
    FORGOT_PASSWORD_VERIFY_URL,
    GET_EVENTS_URL,
    REGISTER_EVENT_URL,
    USER_PROFILE_URL,
    USER_EVENTS_URL,
    EDIT_PROFILE_URL,
    EVENT_RECEIPT_URL,
    ADMIN_EVENTS_URL,
    ADMIN_DOWNLOAD_PARTICIPANTS_LIST_URL,
    USER_TRANSACTIONS_URL,
    VERIFY_TRANSACTIONS_URL
};