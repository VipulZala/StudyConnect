import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, SendIcon, PaperclipIcon, MoreVerticalIcon, PhoneIcon, VideoIcon, XIcon, FileIcon, DownloadIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { apiFetch } from '../lib/api';

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

// Dummy data for testing
const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    chatId: 'chat-1',
    user: {
      id: '1',
      name: 'Vivek Pathak',
      email: 'vivek@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      online: true
    },
    lastMessage: {
      text: 'Hey, have you started working on the project yet?',
      timestamp: new Date().toISOString(),
      read: true
    },
    unreadCount: 0
  },
  {
    chatId: 'chat-2',
    user: {
      id: '2',
      name: 'Nisha Sharma',
      email: 'nisha@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      online: true
    },
    lastMessage: {
      text: 'I found some great resources for our research paper!',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    unreadCount: 3
  },
  {
    chatId: 'chat-3',
    user: {
      id: '3',
      name: 'Marcus Rodriguez',
      email: 'marcus@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      online: false
    },
    lastMessage: {
      text: 'Can we schedule a study session for tomorrow?',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    },
    unreadCount: 0
  },
  {
    chatId: 'chat-4',
    user: {
      id: '4',
      name: 'Priya Patel',
      email: 'priya@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      online: true
    },
    lastMessage: {
      text: 'Thanks for helping with the calculus problem!',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true
    },
    unreadCount: 0
  }
];

const DUMMY_MESSAGES: { [key: string]: Message[] } = {
  'chat-1': [
    {
      _id: 'msg-1',
      chatId: 'chat-1',
      sender: {
        _id: '1',
        name: 'Vivek Pathak',
        email: 'vivek@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Hi! How are you doing?',
      messageType: 'text',
      readBy: [],
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      _id: 'msg-2',
      chatId: 'chat-1',
      sender: {
        _id: 'me',
        name: 'You',
        email: 'you@example.com',
        avatarUrl: 'https://ui-avatars.com/api/?name=You'
      },
      content: 'Hey! I\'m good, thanks! Working on the project.',
      messageType: 'text',
      readBy: ['1'],
      createdAt: new Date(Date.now() - 7000000).toISOString()
    },
    {
      _id: 'msg-3',
      chatId: 'chat-1',
      sender: {
        _id: '1',
        name: 'Vivek Pathak',
        email: 'vivek@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Hey, have you started working on the project yet?',
      messageType: 'text',
      readBy: [],
      createdAt: new Date().toISOString()
    }
  ],
  'chat-2': [
    {
      _id: 'msg-4',
      chatId: 'chat-2',
      sender: {
        _id: '2',
        name: 'Nisha Sharma',
        email: 'nisha@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'I found some great resources for our research paper!',
      messageType: 'text',
      readBy: [],
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  'chat-3': [
    {
      _id: 'msg-5',
      chatId: 'chat-3',
      sender: {
        _id: '3',
        name: 'Marcus Rodriguez',
        email: 'marcus@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Can we schedule a study session for tomorrow?',
      messageType: 'text',
      readBy: [],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  'chat-4': [
    {
      _id: 'msg-6',
      chatId: 'chat-4',
      sender: {
        _id: '4',
        name: 'Priya Patel',
        email: 'priya@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Thanks for helping with the calculus problem!',
      messageType: 'text',
      readBy: [],
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]
};

const Messaging: React.FC = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('sc_token');
  const { socket, isConnected } = useSocket(token);

  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>(DUMMY_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Socket event listeners
  useEffect(() => {
    if (!socket || !selectedConversation) return;

    socket.emit('joinChat', selectedConversation.chatId);

    socket.on('newMessage', (message: Message) => {
      if (message.chatId === selectedConversation.chatId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();

        // Mark as read
        if (message.sender._id !== user?.id) {
          markAsRead(selectedConversation.chatId);
        }
      }

      // Update conversation list
      fetchConversations();
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
      socket.off('typing');
    };
  }, [socket, selectedConversation, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  };

  const fetchConversations = async () => {
    try {
      const data = await apiFetch('/messages/conversations');
      setConversations(data || DUMMY_CONVERSATIONS);
    } catch (err) {
      console.error('Failed to fetch conversations, using dummy data:', err);
      setConversations(DUMMY_CONVERSATIONS);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const data = await apiFetch(`/messages/conversation?chatId=${chatId}`);
      setMessages(data || DUMMY_MESSAGES[chatId] || []);
      markAsRead(chatId);
    } catch (err) {
      console.error('Failed to fetch messages, using dummy data:', err);
      setMessages(DUMMY_MESSAGES[chatId] || []);
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

  const handleCall = (video: boolean = false) => {
    if (!selectedConversation) return;

    const roomId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const callLink = `${window.location.origin}/study-room?roomID=${roomId}`;
    const callType = video ? 'Video Call' : 'Voice Call';

    // Send call link as message
    const callMessage = `📞 Started a ${callType}. Join here: ${callLink}`;

    // We can reuse the handleSendMessage logic by setting state and submitting, 
    // or refactor handleSendMessage to accept content. 
    // For simplicity/safety, we'll manually trigger a send here or just update state and call a sender helper.
    // Let's create a specialized sender helper or just invoke socket/api directly if possible, 
    // but reusing handleSendMessage logic via state hack is messy.
    // Better: extract send logic. For now, I'll direct inject into socket/state.

    // Actually, adapting handleSendMessage is complex due to event object dependency.
    // Let's just set the message and simulate a submit or duplicate the core logic.
    // Duplicating core logic for safety:

    const newMsg: Message = {
      _id: 'msg-' + Date.now(),
      chatId: selectedConversation.chatId,
      sender: {
        _id: user?.id || 'me',
        name: user?.name || 'You',
        email: user?.email || 'you@example.com',
        avatarUrl: user?.avatar || 'https://ui-avatars.com/api/?name=You'
      },
      content: callMessage,
      messageType: 'text',
      readBy: [],
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);

    if (socket && isConnected) {
      socket.emit('sendMessage', {
        chatId: selectedConversation.chatId,
        content: newMsg.content,
        messageType: 'text'
      });
    }

    // Open the room for the caller immediately
    window.open(callLink, '_blank');
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
        } catch (uploadErr) {
          console.error('File upload failed:', uploadErr);
          // Continue without file if upload fails
        }
        setUploading(false);
      }

      // Determine message type
      let messageType: 'text' | 'file' | 'image' = 'text';
      if (fileData) {
        messageType = fileData.type.startsWith('image/') ? 'image' : 'file';
      } else if (selectedFile) {
        if (selectedFile.type.startsWith('image/')) {
          messageType = 'image';
        } else if (selectedFile.type === 'application/pdf') {
          messageType = 'file'; // Treating PDF as file, but will render differently
        } else {
          messageType = 'file';
        }
      }

      // Create message object
      const newMsg: Message = {
        _id: 'msg-' + Date.now(),
        chatId: selectedConversation.chatId,
        sender: {
          _id: user?.id || 'me',
          name: user?.name || 'You',
          email: user?.email || 'you@example.com',
          avatarUrl: user?.avatar || 'https://ui-avatars.com/api/?name=You'
        },
        content: newMessage.trim() || (fileData ? fileData.name : selectedFile?.name || ''),
        messageType,
        fileUrl: fileData?.url,
        fileName: fileData?.name || selectedFile?.name,
        fileType: fileData?.type || selectedFile?.type,
        fileSize: fileData?.size || selectedFile?.size,
        readBy: [],
        createdAt: new Date().toISOString()
      };

      // Add message locally immediately
      setMessages(prev => [...prev, newMsg]);

      // Send via socket if available
      if (socket && isConnected) {
        const messagePayload = {
          chatId: selectedConversation.chatId,
          content: newMsg.content,
          messageType,
          fileUrl: fileData?.url,
          fileName: fileData?.name || selectedFile?.name,
          fileType: fileData?.type || selectedFile?.type,
          fileSize: fileData?.size || selectedFile?.size
        };

        socket.emit('sendMessage', messagePayload);
      }

      // Update conversation list
      setConversations(prev => prev.map(conv => {
        if (conv.chatId === selectedConversation.chatId) {
          return {
            ...conv,
            lastMessage: {
              text: newMsg.content,
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    return conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
            <VideoIcon size={16} /> Join Call
          </a>
        </div>
      );
    }

    return <p className="mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</p>;
  };

  return (
    <div className="w-100 bg-light min-vh-100">
      <div className="container-fluid p-0">
        <div className="d-flex" style={{ height: 'calc(100vh - 60px)' }}>
          {/* Conversation List */}
          <div className={`col-12 col-md-4 col-lg-3 bg-white border-end d-flex flex-column ${selectedConversation ? 'd-none d-md-flex' : 'd-flex'}`}>
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

            <div className="flex-grow-1 overflow-y-auto">
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
                      <div className="position-relative me-3">
                        <img
                          src={conversation.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.user.name)}`}
                          alt={conversation.user.name}
                          className="rounded-circle object-fit-cover"
                          style={{ width: '48px', height: '48px' }}
                        />
                        {conversation.user.online && (
                          <span className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white" style={{ width: '12px', height: '12px' }}></span>
                        )}
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
          <div id="chat-column" className={`col-12 col-md-8 col-lg-9 d-flex flex-column ${!selectedConversation ? 'd-none d-md-flex' : 'd-flex'}`}>
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-3 border-bottom bg-white d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <button className="btn btn-link link-dark p-0 me-3 d-md-none" onClick={handleBackToConversations}>
                      <ArrowLeftIcon size={24} />
                    </button>
                    <div className="position-relative me-3">
                      <img
                        src={selectedConversation.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.user.name)}`}
                        alt={selectedConversation.user.name}
                        className="rounded-circle object-fit-cover"
                        style={{ width: '40px', height: '40px' }}
                      />
                      {selectedConversation.user.online && (
                        <span className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white" style={{ width: '10px', height: '10px' }}></span>
                      )}
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
                    <button onClick={() => handleCall(false)} className="btn btn-light rounded-circle p-2 text-muted" title="Voice Call">
                      <PhoneIcon size={20} />
                    </button>
                    <button onClick={() => handleCall(true)} className="btn btn-light rounded-circle p-2 text-muted" title="Video Call">
                      <VideoIcon size={20} />
                    </button>
                    <button className="btn btn-light rounded-circle p-2 text-muted">
                      <MoreVerticalIcon size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-grow-1 overflow-y-auto p-4 bg-light">
                  <div className="d-flex flex-column gap-3">
                    {messages.map(message => {
                      const isOwn = message.sender._id === user?.id;
                      const avatar = message.sender.profile?.avatarUrl || message.sender.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.name)}`;

                      return (
                        <div key={message._id} className={`d-flex ${isOwn ? 'justify-content-end' : 'justify-content-start'}`}>
                          {!isOwn && (
                            <img
                              src={avatar}
                              alt={message.sender.name}
                              className="rounded-circle object-fit-cover me-2 align-self-end"
                              style={{ width: '32px', height: '32px' }}
                            />
                          )}
                          <div
                            className={`p-3 rounded-3 ${isOwn ? 'bg-primary text-white rounded-bottom-end-0' : 'bg-white text-dark rounded-bottom-start-0 shadow-sm'}`}
                            style={{ maxWidth: '75%' }}
                          >
                            {renderMessageContent(message)}
                            <p className={`small mb-0 text-end mt-1 ${isOwn ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                              {formatMessageTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-3 border-top bg-white">
                  {selectedFile && (
                    <div className="mb-2 p-2 bg-light rounded d-flex align-items-center gap-2">
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                      ) : (
                        <FileIcon size={50} className="text-muted" />
                      )}
                      <div className="flex-grow-1 min-w-0">
                        <p className="mb-0 small fw-medium text-truncate">{selectedFile.name}</p>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-light rounded-circle p-1"
                        onClick={handleRemoveFile}
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="d-flex align-items-end gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="d-none"
                      accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                    />
                    <button
                      type="button"
                      className="btn btn-light rounded-circle p-2 text-muted"
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
                        placeholder="Type a message..."
                        className="form-control resize-none"
                        rows={1}
                        disabled={uploading}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                      disabled={uploading || (!newMessage.trim() && !selectedFile)}
                    >
                      {uploading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <SendIcon size={20} />
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
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
    </div>
  );
};

export default Messaging;