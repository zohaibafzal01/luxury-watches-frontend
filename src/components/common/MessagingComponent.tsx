import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Message, Conversation } from "@/types/messaging";
import { Send, Search, Plus, MessageCircle, User } from "lucide-react";
import { selectUserInfo } from "@/redux/selectors/userSelectors";

export const MessagingComponent: React.FC = () => {
  const user = useSelector(selectUserInfo);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) return;

    const mockConversations: Conversation[] = [
      {
        id: "conv1",
        participants: [user.id, "dealer1"],
        participantNames: ["John Dealer"],
        lastMessage: "Thanks for the update on the Rolex service.",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isGroup: false,
      },
      {
        id: "conv2",
        participants: [user.id, "consumer1"],
        participantNames: ["Jane Consumer"],
        lastMessage: "When can I expect the watch to be ready?",
        lastMessageTime: new Date(
          Date.now() - 2 * 60 * 60 * 1000
        ).toISOString(),
        unreadCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isGroup: false,
      },
    ];

    const mockMessages: Message[] = [
      {
        id: "msg1",
        conversationId: "conv1",
        senderId: "dealer1",
        receiverId: user.id,
        senderName: "John Dealer",
        content:
          "Hello! I received your service request for the Rolex Submariner.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        messageType: "text",
      },
      {
        id: "msg2",
        conversationId: "conv1",
        senderId: user.id,
        receiverId: "dealer1",
        senderName: `${user.firstName} ${user.lastName}`,
        content: "Great! When can you start working on it?",
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        messageType: "text",
      },
      {
        id: "msg3",
        conversationId: "conv1",
        senderId: "dealer1",
        receiverId: user.id,
        senderName: "John Dealer",
        content:
          "I can start tomorrow. The estimated completion time is 7 days.",
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        messageType: "text",
      },
      {
        id: "msg4",
        conversationId: "conv1",
        senderId: "dealer1",
        receiverId: user.id,
        senderName: "John Dealer",
        content: "Thanks for the update on the Rolex service.",
        timestamp: new Date().toISOString(),
        isRead: false,
        messageType: "text",
      },
    ];

    setConversations(mockConversations);
    setMessages(mockMessages);

    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0].id);
    }
  }, [user]);

  const filteredConversations = conversations.filter((conv) =>
    conv.participantNames.some((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const selectedMessages = messages.filter(
    (msg) => msg.conversationId === selectedConversation
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConversation,
      senderId: user.id,
      receiverId: "",
      senderName: `${user.firstName} ${user.lastName}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
      messageType: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: new Date().toISOString(),
            }
          : conv
      )
    );
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
    return messageTime.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="luxury-title text-3xl mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with dealers, consumers, and other platform users
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations */}
          <div className="lg:col-span-1">
            <Card className="luxury-card h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Conversations</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 luxury-input"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 p-4">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conversation.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4" />
                              <span className="font-medium">
                                {conversation.participantNames.join(", ")}
                              </span>
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-primary text-primary-foreground">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            <Card className="luxury-card h-full">
              {selectedConversation ? (
                <>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      {conversations
                        .find((c) => c.id === selectedConversation)
                        ?.participantNames.join(", ")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-[500px]">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4">
                        {selectedMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === user?.id
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.senderId === user?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">
                                  {message.senderName}
                                </span>
                                <span className="text-xs opacity-70">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="flex gap-2 mt-4">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 min-h-[60px] luxury-input"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="luxury-button self-end"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
