export const API_BASE_URL = "https://butler-backend-142058868140.asia-northeast1.run.app"
// export const API_BASE_URL = "http://localhost:8080"

export const API_ROUTES = {
  SIGNUP: `${API_BASE_URL}/api/signup`,
  SIGNIN: `${API_BASE_URL}/api/signin`,
  CREATE_CHAT: `${API_BASE_URL}/api/chats`,
  GET_CHATS: `${API_BASE_URL}/api/chats`,
  GET_RECENT_CHATS: `${API_BASE_URL}/api/chats/recent`,
  GET_MESSAGES: `${API_BASE_URL}/api/messages`,
  SEND_MESSAGE: `${API_BASE_URL}/api/messages`,
  EDIT_MESSAGE: `${API_BASE_URL}/api/messages`,
  DELETE_MESSAGE: `${API_BASE_URL}/api/messages?messageId=:messageId`,
  CREATE_SUMMARY: `${API_BASE_URL}/api/summary`,
  GET_SUMMARIES: `${API_BASE_URL}/api/summary`,
  GET_SUMMARY: `${API_BASE_URL}/api/summary/details`,
  GET_RECENT_SUMMARIES: `${API_BASE_URL}/api/summary/recent`,
}

