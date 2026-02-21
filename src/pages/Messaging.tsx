import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchIcon, SendIcon, PaperclipIcon, XIcon, FileIcon, DownloadIcon, ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';

import { apiFetch } from '../lib/api';

// Helper to construct full image URL
const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;

  // Construct full URL for uploaded files
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  try {
    const origin = new URL(apiUrl).origin;
    if (url.startsWith('/')) return `${origin}${url}`;
    return `${origin}/${url}`;
  } catch (e) {
    return url;
  }
};

// Internal Avatar Component
const UserAvatar = ({ name, src, size = 48, online, className }: { name: string, src?: string, size?: number, online?: boolean, className?: string }) => {
  const [error, setError] = React.useState(false);

  // Reset error when src changes
  React.useEffect(() => {
    setError(false);
  }, [src]);

  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Generate a consistent background color based on name
  const colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#198754', '#20c997', '#0dcaf0'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];

  return (
    <div className={`position-relative flex-shrink-0 ${className || ''}`} style={{ width: size, height: size }}>
      {!error && src && src !== 'undefined' && src !== 'null' ? (
        <img
          src={getImageUrl(src)}
          alt={name}
          className="rounded-circle w-100 h-100 object-fit-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div
          className="rounded-circle w-100 h-100 d-flex align-items-center justify-content-center text-white fw-medium"
          style={{ backgroundColor: color, fontSize: size * 0.4 }}
        >
          {initials}
        </div>
      )}
      {online !== undefined && online && (
        <span
          className="position-absolute bg-success rounded-circle border border-white"
          style={{
            width: Math.max(10, size * 0.25),
            height: Math.max(10, size * 0.25),
            bottom: 0,
            right: 0
          }}
        ></span>
      )}
    </div>
  );
};

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  online: boolean;
}

interface Message {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    profile?: { avatarUrl?: string };
    avatarUrl?: string;
  };
  content: string;
  messageType: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  readBy: string[];
  deliveredTo?: string[]; // Track who received the message
  createdAt: string;
}

interface Conversation {
  chatId: string;
  user: User;
  lastMessage: {
    text: string;
    timestamp: string;
    read: boolean;
  };
  unreadCount: number;
}

// No dummy data - conversations will be fetched from connected users

const Messaging: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('sc_token');
  const { socket, isConnected } = useSocket(token);

  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Log connection status
  useEffect(() => {
    console.log('Socket connection status:', isConnected);
  }, [isConnected]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Handle opening a specific user's chat from Connections page
  // Handle opening a specific user's chat from Connections page or restoring last active chat
  useEffect(() => {
    const state = location.state as { userId?: string; userName?: string } | null;
    if (state?.userId && user) {
      openChatWithUser(state.userId, state.userName || 'User');
    } else {
      // Restore last active chat
      const lastChatId = localStorage.getItem('lastActiveChatId');
      if (lastChatId && !selectedConversation && conversations.length > 0) {
        const savedConv = conversations.find(c => c.chatId === lastChatId);
        if (savedConv) {
          setSelectedConversation(savedConv);
          fetchMessages(savedConv.chatId);
          // Join socket room
          if (socket && isConnected) {
            socket.emit('joinChat', savedConv.chatId);
          }
        }
      }
    }
  }, [location.state, user, conversations, selectedConversation]);

  const openChatWithUser = async (userId: string, userName: string) => {
    try {
      // Create chatId (consistent format: smaller ID first)
      const ids = [user?.id || user?._id || '', userId].sort();
      const chatId = `${ids[0]}-${ids[1]}`;

      // Fetch user data
      const userData = await apiFetch(`/users/${userId}`);

      // Create conversation object
      const newConversation: Conversation = {
        chatId,
        user: {
          id: userId,
          name: userData.name || userName,
          email: userData.email || '',
          avatar: userData.profile?.avatarUrl || userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`,
          online: false
        },
        lastMessage: {
          text: '',
          timestamp: new Date().toISOString(),
          read: true
        },
        unreadCount: 0
      };

      // Check if conversation already exists
      const existingConv = conversations.find(c => c.chatId === chatId);
      if (existingConv) {
        setSelectedConversation(existingConv);
        fetchMessages(chatId);
      } else {
        // Add to conversations list
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        fetchMessages(chatId);
      }
    } catch (err) {
      console.error('Failed to open chat with user:', err);
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket || !selectedConversation) return;

    socket.emit('joinChat', selectedConversation.chatId);

    socket.on('newMessage', (message: Message) => {
      if (message.chatId === selectedConversation.chatId) {
        setMessages(prev => [...prev, message]);
        // scrollToBottom(); // Removed to let useEffect handle it intelligently

        // If message is from someone else, mark as delivered and read
        if (message.sender._id !== user?.id && message.sender._id !== user?._id) {
          // Emit delivery confirmation
          socket.emit('messageDelivered', {
            messageId: message._id,
            chatId: message.chatId
          });

          // Mark as read
          markAsRead(selectedConversation.chatId);
        }
      }

      // Update conversation list
      fetchConversations();
    });

    // Listen for delivery status updates
    socket.on('messageStatusUpdate', ({ messageId, status, userId }) => {
      setMessages(prev => prev.map(msg => {
        if (msg._id === messageId) {
          if (status === 'delivered' && !msg.deliveredTo?.includes(userId)) {
            return { ...msg, deliveredTo: [...(msg.deliveredTo || []), userId] };
          } else if (status === 'read' && !msg.readBy?.includes(userId)) {
            return { ...msg, readBy: [...(msg.readBy || []), userId] };
          }
        }
        return msg;
      }));
    });

    socket.on('typing', ({ userId }: { userId: string }) => {
      if (userId !== user?.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.emit('leaveChat', selectedConversation.chatId);
      socket.off('newMessage');
      socket.off('messageStatusUpdate');
      socket.off('typing');
    };
  }, [socket, selectedConversation, user]);

  // Intelligent scroll to bottom
  useEffect(() => {
    if (messages.length === 0) {
      prevMessagesLengthRef.current = 0;
      return;
    }

    const container = messagesContainerRef.current;
    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    const isInitialLoad = prevMessagesLengthRef.current === 0;

    // Always scroll on initial load
    if (isInitialLoad) {
      scrollToBottom();
      prevMessagesLengthRef.current = messages.length;
      return;
    }

    if (isNewMessage) {
      const lastMessage = messages[messages.length - 1];
      const isFromMe = lastMessage?.sender._id === user?.id || lastMessage?.sender._id === user?._id;

      if (!container) {
        scrollToBottom();
      } else {
        // Calculate distance from bottom
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
        const isNearBottom = distanceFromBottom < 200; // 200px threshold

        if (isFromMe || isNearBottom) {
          scrollToBottom();
        }
      }
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  };

  const fetchConversations = async () => {
    try {
      // First, try to fetch existing conversations from messages API
      const conversationsData = await apiFetch('/messages/conversations');

      if (conversationsData && conversationsData.length > 0) {
        setConversations(conversationsData);
        return;
      }

      // If no conversations exist, fetch connected users
      console.log('No existing conversations, fetching connected users...');
      const connectionsData = await apiFetch('/connections');

      if (!connectionsData || connectionsData.length === 0) {
        console.log('No connections found');
        setConversations([]);
        return;
      }

      // Transform connections into conversation format
      const connectedConversations: Conversation[] = connectionsData
        .filter((conn: any) => conn.status === 'accepted') // Only show accepted connections
        .map((conn: any) => {
          // Determine the other user (not the current user)
          const otherUser = conn.requester?._id === user?.id || conn.requester?._id === user?._id
            ? conn.recipient
            : conn.requester;

          if (!otherUser) return null;

          // Create chatId (consistent format: smaller ID first)
          const ids = [user?.id || user?._id || '', otherUser._id || otherUser.id].sort();
          const chatId = `${ids[0]}-${ids[1]}`;

          return {
            chatId,
            user: {
              id: otherUser._id || otherUser.id,
              name: otherUser.name || 'User',
              email: otherUser.email || '',
              avatar: otherUser.profile?.avatarUrl || otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || 'User')}`,
              online: false // We can add online status later via socket
            },
            lastMessage: {
              text: 'Start a conversation',
              timestamp: new Date().toISOString(),
              read: true
            },
            unreadCount: 0
          };
        })
        .filter((conv: Conversation | null) => conv !== null) as Conversation[];

      setConversations(connectedConversations);
      console.log(`Loaded ${connectedConversations.length} connected users`);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setConversations([]); // Show empty list instead of dummy data
    }
  };


  const fetchMessages = async (chatId: string) => {
    try {
      const data = await apiFetch(`/messages/conversation?chatId=${chatId}`);
      setMessages(data || []);
      markAsRead(chatId);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]); // Show empty conversation instead of dummy data
    }
  };

  const markAsRead = async (chatId: string) => {
    try {
      await apiFetch('/messages/read', { method: 'POST', body: { chatId } });
      fetchConversations(); // Refresh to update unread counts
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.chatId);
    // For mobile view
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const chatColumn = document.getElementById('chat-column');
        if (chatColumn) chatColumn.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setFilePreview(null); // No preview for PDF, just icon
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConversation) return;
    if (!newMessage.trim() && !selectedFile) return;

    try {
      let fileData = null;

      // Upload file if selected
      if (selectedFile) {
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);

          fileData = await apiFetch('/upload', {
            method: 'POST',
            body: formData,
            isFormData: true
          });

          console.log('File uploaded successfully:', fileData);
        } catch (uploadErr) {
          console.error('File upload failed:', uploadErr);
          alert('Failed to upload file. Please try again.');
          setUploading(false);
          return; // Don't send message if file upload fails
        }
        setUploading(false);
      }

      // Determine message type based on uploaded file data or selected file
      let messageType: 'text' | 'file' | 'image' = 'text';
      let finalFileType = '';

      if (fileData) {
        // Use the file type from uploaded data
        finalFileType = fileData.type || fileData.mimeType || selectedFile?.type || '';
        messageType = finalFileType.startsWith('image/') ? 'image' : 'file';
      } else if (selectedFile && !fileData) {
        // Fallback if upload didn't return data but we have selected file
        finalFileType = selectedFile.type;
        messageType = finalFileType.startsWith('image/') ? 'image' : 'file';
      }

      // Only set to text if no file is involved
      if (!fileData && !selectedFile) {
        messageType = 'text';
      }

      // Create message object with proper file metadata
      const newMsg: Message = {
        _id: 'msg-' + Date.now(),
        chatId: selectedConversation.chatId,
        sender: {
          _id: user?.id || user?._id || 'me',
          name: user?.name || 'You',
          email: user?.email || 'you@example.com',
          avatarUrl: user?.avatar || user?.profile?.avatarUrl || 'https://ui-avatars.com/api/?name=You'
        },
        content: newMessage.trim() || (fileData?.originalName || fileData?.name || selectedFile?.name || ''),
        messageType,
        fileUrl: fileData?.url || fileData?.path,
        fileName: fileData?.originalName || fileData?.name || selectedFile?.name,
        fileType: finalFileType,
        fileSize: fileData?.size || selectedFile?.size,
        readBy: [],
        createdAt: new Date().toISOString()
      };

      console.log('Sending message:', newMsg);

      // Don't add message locally - wait for socket to broadcast it back
      // This prevents duplicate messages

      // Send via socket if available
      if (socket && isConnected) {
        const messagePayload = {
          chatId: selectedConversation.chatId,
          content: newMsg.content,
          messageType: newMsg.messageType,
          fileUrl: newMsg.fileUrl,
          fileName: newMsg.fileName,
          fileType: newMsg.fileType,
          fileSize: newMsg.fileSize
        };

        console.log('Emitting message via socket:', messagePayload);
        socket.emit('sendMessage', messagePayload);
      } else {
        // If socket not connected, add locally as fallback
        setMessages(prev => [...prev, newMsg]);
      }

      // Update conversation list
      setConversations(prev => prev.map(conv => {
        if (conv.chatId === selectedConversation.chatId) {
          return {
            ...conv,
            lastMessage: {
              text: newMsg.fileName || newMsg.content,
              timestamp: newMsg.createdAt,
              read: true
            }
          };
        }
        return conv;
      }));

      // Clear input
      setNewMessage('');
      handleRemoveFile();
    } catch (err) {
      console.error('Failed to send message:', err);
      setUploading(false);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleTyping = () => {
    if (!socket || !selectedConversation) return;

    socket.emit('typing', { chatId: selectedConversation.chatId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // Typing stopped
    }, 1000);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    }

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(message => {
      const dateLabel = getDateLabel(message.createdAt);
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(message);
    });
    return groups;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get message status for tick indicators
  const getMessageStatus = (message: Message): 'sent' | 'delivered' | 'read' => {
    const currentUserId = user?.id || user?._id;

    // If message is read by anyone other than sender
    if (message.readBy && message.readBy.length > 0) {
      const readByOthers = message.readBy.filter(id => id !== currentUserId);
      if (readByOthers.length > 0) {
        return 'read';
      }
    }

    // If message is delivered to anyone
    if (message.deliveredTo && message.deliveredTo.length > 0) {
      return 'delivered';
    }

    // Default: just sent
    return 'sent';
  };

  // Render tick indicator based on message status
  const renderMessageTicks = (message: Message) => {
    const status = getMessageStatus(message);

    if (status === 'read') {
      // Double blue ticks
      return (
        <span className="ms-1" style={{ display: 'inline-flex', gap: '1px' }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M5.5 8.5L2 5L0.5 6.5L5.5 11.5L15.5 1.5L14 0L5.5 8.5Z" fill="#4A9EFF" />
            <path d="M10.5 8.5L7 5L5.5 6.5L10.5 11.5L20.5 1.5L19 0L10.5 8.5Z" fill="#4A9EFF" />
          </svg>
        </span>
      );
    } else if (status === 'delivered') {
      // Double gray ticks
      return (
        <span className="ms-1" style={{ display: 'inline-flex', gap: '1px' }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M5.5 8.5L2 5L0.5 6.5L5.5 11.5L15.5 1.5L14 0L5.5 8.5Z" fill="currentColor" opacity="0.5" />
            <path d="M10.5 8.5L7 5L5.5 6.5L10.5 11.5L20.5 1.5L19 0L10.5 8.5Z" fill="currentColor" opacity="0.5" />
          </svg>
        </span>
      );
    } else {
      // Single gray tick
      return (
        <span className="ms-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 7L1 4L0 5L4 9L12 1L11 0L4 7Z" fill="currentColor" opacity="0.5" />
          </svg>
        </span>
      );
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    return conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleToggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedMessages(new Set());
  };

  const handleToggleMessageSelection = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const handleDeleteMessages = () => {
    if (selectedMessages.size === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMessages = async () => {
    setShowDeleteConfirm(false);

    const messageIdsArray = Array.from(selectedMessages);
    console.log('Attempting to delete messages:', messageIdsArray);

    try {
      // Try DELETE method first
      try {
        const response = await apiFetch('/messages/delete', {
          method: 'DELETE',
          body: { messageIds: messageIdsArray }
        });
        console.log('Delete response:', response);
      } catch (deleteErr: any) {
        console.log('DELETE method failed, trying POST:', deleteErr);

        // Some backends prefer POST for delete operations
        const response = await apiFetch('/messages/delete', {
          method: 'POST',
          body: { messageIds: messageIdsArray }
        });
        console.log('Delete response (POST):', response);
      }

      // Remove deleted messages from local state
      setMessages(prev => prev.filter(msg => !selectedMessages.has(msg._id)));
      setSelectedMessages(new Set());
      setDeleteMode(false);

      // Refresh conversations to update last message
      fetchConversations();

      console.log('Messages deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete messages:', err);
      console.error('Error details:', err.message, err.response);
      alert(`Failed to delete messages: ${err.message || 'Unknown error'}. Please try again.`);
    }
  };

  const renderMessageContent = (message: Message) => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

    if (message.messageType === 'image' && message.fileUrl) {
      return (
        <div>
          <img
            src={`${baseUrl}${message.fileUrl}`}
            alt={message.fileName || 'Image'}
            className="rounded-3 mb-2"
            style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'cover' }}
          />
          {message.content && <p className="mb-0">{message.content}</p>}
        </div>
      );
    }

    if (message.messageType === 'file' && message.fileUrl) {
      const isPdf = message.fileType === 'application/pdf' || message.fileName?.toLowerCase().endsWith('.pdf');

      return (
        <div>
          <div className={`d-flex align-items-center gap-2 mb-2 p-2 rounded ${isPdf ? 'bg-danger bg-opacity-10 border border-danger border-opacity-25' : 'bg-light'}`}>
            <FileIcon size={24} className={isPdf ? 'text-danger' : 'text-secondary'} />
            <div className="flex-grow-1 min-w-0">
              <p className="mb-0 small fw-medium text-truncate">{message.fileName}</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>
                {message.fileSize ? formatFileSize(message.fileSize) : ''}
              </p>
            </div>
            <a
              href={`${baseUrl}${message.fileUrl}`}
              download={message.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-sm ${isPdf ? 'btn-outline-danger' : 'btn-light'}`}
            >
              <DownloadIcon size={16} />
            </a>
          </div>
          {message.content && <p className="mb-0">{message.content}</p>}
        </div>
      );
    }

    // Handle Call Links
    if (message.content.includes('/study-room?roomID=')) {
      const parts = message.content.split('Join here: ');
      const link = parts[1] || message.content;
      const text = parts[0] || 'Join Call';

      return (
        <div>
          <p className="mb-2">{text}</p>
          <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm d-inline-flex align-items-center gap-2">
            📞 Join Call
          </a>
        </div>
      );
    }

    return <p className="mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</p>;
  };

  return (
    <div className="w-100" style={{ height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
      <div className="container-fluid p-0" style={{ height: '100%' }}>
        <div className="row g-0 h-100">
          {/* Conversation List */}
          <div className={`col-12 col-md-6 col-lg-5 col-xl-4 bg-body border-end d-flex flex-column h-100 ${selectedConversation ? 'd-none d-md-flex' : 'd-flex'}`}>
            <div className="p-3 border-bottom">
              <h1 className="h4 fw-bold mb-3">Messages</h1>
              <div className="position-relative">
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3 pointer-events-none">
                  <SearchIcon size={18} className="text-muted" />
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="form-control ps-5"
                />
              </div>
            </div>

            <div className="flex-grow-1 overflow-auto">
              {filteredConversations.length === 0 ? (
                <div className="text-center p-4 text-muted">
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map(conversation => (
                  <button
                    key={conversation.chatId}
                    className={`w-100 text-start px-3 py-3 border-bottom border-light bg-transparent hover-bg-light transition-colors ${selectedConversation?.chatId === conversation.chatId ? 'bg-primary-subtle' : ''}`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <UserAvatar
                          name={conversation.user.name}
                          src={conversation.user.avatar}
                          size={48}
                          online={conversation.user.online}
                        />
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex justify-content-between align-items-baseline">
                          <h3 className="h6 fw-medium text-truncate mb-0">
                            {conversation.user.name}
                          </h3>
                          <span className="small text-muted text-nowrap ms-2">
                            {formatConversationDate(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className={`small text-truncate mb-0 ${conversation.unreadCount > 0 ? 'fw-medium text-dark' : 'text-muted'}`}>
                          {conversation.lastMessage.text}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="ms-2 badge bg-primary rounded-pill">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Conversation View */}
          <div id="chat-column" className={`col-12 col-md-6 col-lg-7 col-xl-8 d-flex flex-column h-100 ${!selectedConversation ? 'd-none d-md-flex' : 'd-flex'}`} style={{ overflow: 'hidden' }}>
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-3 border-bottom bg-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <button className="btn btn-link link-dark p-0 me-3 d-md-none" onClick={handleBackToConversations}>
                      <ArrowLeftIcon size={24} />
                    </button>
                    <div className="me-3">
                      <UserAvatar
                        name={selectedConversation.user.name}
                        src={selectedConversation.user.avatar}
                        size={40}
                        online={selectedConversation.user.online}
                      />
                    </div>
                    <div>
                      <h2 className="h6 fw-medium mb-0">
                        {selectedConversation.user.name}
                      </h2>
                      <p className="small text-muted mb-0">
                        {isTyping ? 'typing...' : (selectedConversation.user.online ? 'Online' : 'Offline')}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {deleteMode ? (
                      <>
                        <button
                          onClick={handleDeleteMessages}
                          className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                          disabled={selectedMessages.size === 0}
                          title="Delete Selected Messages"
                        >
                          <Trash2Icon size={16} />
                          Delete ({selectedMessages.size})
                        </button>
                        <button
                          onClick={handleToggleDeleteMode}
                          className="btn btn-light btn-sm"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleToggleDeleteMode}
                        className="btn btn-light rounded-circle p-2 text-muted"
                        title="Delete Messages"
                      >
                        <Trash2Icon size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div ref={messagesContainerRef} className="flex-grow-1 overflow-auto p-4 bg-body-tertiary" style={{ minHeight: 0 }}>
                  <div className="d-flex flex-column gap-3">
                    {Object.entries(groupMessagesByDate(messages)).map(([dateLabel, dateMessages]) => (
                      <div key={dateLabel}>
                        {/* Date Separator */}
                        <div className="d-flex align-items-center justify-content-center my-3">
                          <div className="bg-body-secondary text-muted px-3 py-1 rounded-pill small fw-medium">
                            {dateLabel}
                          </div>
                        </div>

                        {/* Messages for this date */}
                        {dateMessages.map(message => {
                          const isOwn = message.sender._id === user?.id;
                          const avatar = message.sender.profile?.avatarUrl || message.sender.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.name)}`;
                          const isSelected = selectedMessages.has(message._id);

                          return (
                            <div key={message._id} className={`d-flex ${isOwn ? 'justify-content-end' : 'justify-content-start'} align-items-start gap-2`}>
                              {deleteMode && (
                                <div className="d-flex align-items-center" style={{ paddingTop: '8px' }}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleMessageSelection(message._id)}
                                    className="form-check-input"
                                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                  />
                                </div>
                              )}
                              {!isOwn && (
                                <UserAvatar
                                  name={message.sender.name}
                                  src={avatar}
                                  size={32}
                                  className="align-self-end"
                                />
                              )}
                              <div
                                className={`p-3 rounded-3 ${isOwn ? 'bg-primary text-white rounded-bottom-end-0' : 'bg-body-secondary text-body rounded-bottom-start-0 shadow-sm'}`}
                                style={{ maxWidth: '75%' }}
                              >
                                {renderMessageContent(message)}
                                <p className={`small mb-0 text-end mt-1 d-flex align-items-center justify-content-end ${isOwn ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                                  {formatMessageTime(message.createdAt)}
                                  {isOwn && renderMessageTicks(message)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-3 border-top bg-body">
                  <form onSubmit={handleSendMessage} className="d-flex flex-column gap-2">
                    {selectedFile && (
                      <div className="p-2 bg-body rounded d-flex align-items-center gap-2 border shadow-sm">
                        {filePreview || (selectedFile.type && selectedFile.type.startsWith('image/')) ? (
                          <img src={filePreview || ''} alt="Preview" className="rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                        ) : (
                          <div className="p-2 bg-primary-subtle rounded">
                            <FileIcon size={24} className="text-primary" />
                          </div>
                        )}
                        <div className="flex-grow-1 min-w-0 mx-2">
                          <p className="mb-0 small fw-medium text-truncate">{selectedFile.name}</p>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-light rounded-circle p-1 hover-bg-light-dark"
                          onClick={handleRemoveFile}
                          title="Remove file"
                        >
                          <XIcon size={14} />
                        </button>
                      </div>
                    )}

                    <div className="d-flex align-items-end gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="d-none"
                        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                      />
                      <button
                        type="button"
                        className="btn btn-light rounded-circle p-2 text-muted flex-shrink-0"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <PaperclipIcon size={20} />
                      </button>
                      <div className="flex-grow-1">
                        <textarea
                          value={newMessage}
                          onChange={e => {
                            setNewMessage(e.target.value);
                            handleTyping();
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                          placeholder="Type a message... (Shift+Enter for new line)"
                          className="form-control"
                          rows={2}
                          style={{ resize: 'none', minHeight: '50px', maxHeight: '120px' }}
                          disabled={uploading}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '44px', height: '44px' }}
                        disabled={uploading || (!newMessage.trim() && !selectedFile)}
                      >
                        {uploading ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <SendIcon size={20} />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-body">
                <div className="text-center">
                  <div className="text-muted mb-4">
                    <svg className="mx-auto" width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="h5 fw-medium mb-2">
                    No conversation selected
                  </h3>
                  <p className="text-muted">
                    Choose a conversation from the list to start messaging.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Delete Messages</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    Are you sure you want to delete {selectedMessages.size} message{selectedMessages.size > 1 ? 's' : ''}?
                    This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDeleteMessages}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Messaging;