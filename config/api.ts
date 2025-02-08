export const API_BASE_URL = "https://butler-backend-142058868140.asia-northeast1.run.app"

export const API_ROUTES = {
  SIGNUP: `${API_BASE_URL}/api/signup`,
  SIGNIN: `${API_BASE_URL}/api/signin`,
  CREATE_CHAT: `${API_BASE_URL}/api/chats`,
  GET_CHATS: `${API_BASE_URL}/api/chats`,
  GET_MESSAGES: `${API_BASE_URL}/api/messages`,
  SEND_MESSAGE: `${API_BASE_URL}/api/messages`,
  EDIT_MESSAGE: `${API_BASE_URL}/api/messages`,
  DELETE_MESSAGE: `${API_BASE_URL}/api/messages?messageId=:messageId`,
}

