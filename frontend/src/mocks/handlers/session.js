let sessionUserId = null

export function setSessionUser(userId) { sessionUserId = userId }
export function clearSession() { sessionUserId = null }
export function getSessionUserId() { return sessionUserId }