// Placeholder for chat logic (rooms, messages, etc.)
const messages = [];

export function addMessage({ room, username, text, time }) {
  messages.push({ room, username, text, time });
}

export function getMessages(room) {
  return messages.filter(m => m.room === room);
}
