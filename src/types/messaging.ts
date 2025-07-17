
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  attachments?: MessageAttachment[];
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'document' | 'system';
  senderName: string;
}

export interface MessageAttachment {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: string;
  lastMessageTime: string;
  updatedAt: string;
  isGroup: boolean;
  title?: string;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface SendMessageData {
  receiverId: string;
  content: string;
  attachments?: File[];
  messageType?: 'text' | 'image' | 'document';
}
