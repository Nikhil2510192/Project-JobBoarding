import { useEffect, useState } from "react";
import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type Conversation = {
  id: number;
  name: string;
  company: string;
  lastMessage: string;
  time: string;
  unread: boolean;
};

type Message = {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
};

const UserMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/messages/conversations`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load conversations");
        }

        // Adjust mapping based on your backend fields
        const mapped: Conversation[] = (data.conversations || data || []).map(
          (c: any) => ({
            id: c.id,
            name: c.otherPartyName || c.name,
            company: c.companyName || c.company || "",
            lastMessage: c.lastMessage || "",
            time: c.time || "",
            unread: Boolean(c.unread),
          })
        );

        setConversations(mapped);
        if (mapped.length > 0) {
          setSelectedConversation(mapped[0]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  // 2) Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/messages/${selectedConversation.id}`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load messages");
        }

        const mapped: Message[] = (data.messages || data || []).map(
          (m: any) => ({
            id: m.id,
            sender: m.senderName || m.sender || "Unknown",
            content: m.content,
            time: m.time || "",
            isMe: m.isMe ?? m.isFromCurrentUser ?? false,
          })
        );

        setMessages(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // 3) Send new message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const content = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/messages/${selectedConversation.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      const newMsg: Message = {
        id: data.message?.id ?? Date.now(),
        sender: "Me",
        content,
        time: data.message?.time || "Just now",
        isMe: true,
      };

      setMessages((prev) => [...prev, newMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while sending");
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] animate-fade-in">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Connect with recruiters and companies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-6rem)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>
          </div>
          <div className="divide-y divide-border">
            {loadingConversations ? (
              <p className="p-4 text-sm text-muted-foreground">
                Loading conversations...
              </p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No conversations yet.
              </p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-secondary",
                    selectedConversation?.id === conv.id && "bg-secondary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium text-primary-foreground">
                      {conv.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground truncate">
                          {conv.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {conv.company}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread && (
                      <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 rounded-xl border border-border flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-medium text-primary-foreground">
                    {selectedConversation.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {selectedConversation.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.company}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <p className="text-sm text-muted-foreground">
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Start the conversation.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-3",
                          msg.isMe
                            ? "bg-foreground text-primary-foreground rounded-br-md"
                            : "bg-secondary text-foreground rounded-bl-md"
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            msg.isMe
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-border p-4">
                <div className="flex gap-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button onClick={handleSend}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default UserMessages;
