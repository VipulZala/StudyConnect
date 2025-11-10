import React, { useState } from 'react';
import { SearchIcon, SendIcon, PaperclipIcon, SmileIcon, MoreVerticalIcon, PhoneIcon, VideoIcon } from 'lucide-react';
// Mock data for conversations
const MOCK_CONVERSATIONS = [{
  id: 1,
  user: {
    id: 1,
    name: 'Vivek Pathak',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    online: true
  },
  lastMessage: {
    text: 'Hey, have you started working on the project yet?',
    timestamp: '2023-10-15T14:30:00Z',
    read: true
  },
  unreadCount: 0
}, {
  id: 2,
  user: {
    id: 2,
    name: 'Nisha Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    online: true
  },
  lastMessage: {
    text: 'I found some great resources for our research paper!',
    timestamp: '2023-10-14T23:15:00Z',
    read: false
  },
  unreadCount: 3
}, {
  id: 3,
  user: {
    id: 3,
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    online: false
  },
  lastMessage: {
    text: 'Can we schedule a study session for tomorrow?',
    timestamp: '2023-10-14T18:45:00Z',
    read: true
  },
  unreadCount: 0
}, {
  id: 4,
  user: {
    id: 4,
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    online: true
  },
  lastMessage: {
    text: 'Thanks for helping with the calculus problem!',
    timestamp: '2023-10-13T20:10:00Z',
    read: true
  },
  unreadCount: 0
}, {
  id: 5,
  user: {
    id: 5,
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    online: false
  },
  lastMessage: {
    text: 'Did you see the latest lecture notes?',
    timestamp: '2023-10-12T15:30:00Z',
    read: true
  },
  unreadCount: 0
}, {
  id: 6,
  user: {
    id: 6,
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    online: true
  },
  lastMessage: {
    text: 'Let me know when you want to meet up for the group project.',
    timestamp: '2023-10-11T12:45:00Z',
    read: true
  },
  unreadCount: 0
}];
// Mock data for messages in a conversation
const MOCK_MESSAGES = [{
  id: 1,
  sender: 2,
  text: "Hi there! How', s, your, day, going,",
  timestamp: '2023-10-14T10:30:00Z'
}, {
  id: 2,
  sender: 0,
  text: 'Hey Sophia! Pretty good, just working on some assignments. How about you?',
  timestamp: '2023-10-14T10:35:00Z'
}, {
  id: 3,
  sender: 2,
  text: "Same here. I', ve, been, researching, for: our, group, project, and, found, some, interesting, papers, .,",
  timestamp: '2023-10-14T10:40:00Z'
}, {
  id: 4,
  sender: 0,
  text: 'That sounds great! Would you mind sharing them with me?',
  timestamp: '2023-10-14T10:45:00Z'
}, {
  id: 5,
  sender: 2,
  text: "Of course! I', ll, compile, them, and, send, them, over, .Also, I, was, thinking, we, could, meet, up, tomorrow, to, discuss, our, approach,",
  timestamp: '2023-10-14T10:50:00Z'
}, {
  id: 6,
  sender: 0,
  text: 'Tomorrow works for me. How about the library at 2pm?',
  timestamp: '2023-10-14T10:55:00Z'
}, {
  id: 7,
  sender: 2,
  text: "Perfect! I', ll, book, a, study, room, for: us.,",
  timestamp: '2023-10-14T11:00:00Z'
}, {
  id: 8,
  sender: 2,
  text: 'By the way, I found some great resources for our research paper!',
  timestamp: '2023-10-14T23:15:00Z'
}, {
  id: 9,
  sender: 2,
  text: 'Here are the links to the papers I mentioned. They have some really valuable insights for our project approach.',
  timestamp: '2023-10-14T23:16:00Z'
}, {
  id: 10,
  sender: 2,
  text: "Let me know what you think after you', ve, had, a, chance, to, review, them,",
  timestamp: '2023-10-14T23:17:00Z'
}];
// Format time function
const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};
// Format date for conversation list
const formatConversationDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  // If today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  // If this week, show day name
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return date.toLocaleDateString(undefined, {
      weekday: 'short'
    });
  }
  // Otherwise show date
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
};
const Messaging: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[1]); // Default to Sophia's conversation
  const [newMessage, setNewMessage] = useState('');
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);
  // Filter conversations based on search query
  const filteredConversations = MOCK_CONVERSATIONS.filter(conversation => {
    if (!searchQuery) return true;
    return conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    // In a real app, you would send this to your backend
    console.log('Sending message:', newMessage);
    // Clear the input
    setNewMessage('');
  };
  // Handle selecting a conversation
  const handleSelectConversation = (conversation: (typeof MOCK_CONVERSATIONS)[0]) => {
    setSelectedConversation(conversation);
    setIsMobileConversationOpen(true);
  };
  return <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto">
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Conversation List - Hidden on mobile when a conversation is open */}
          <div className={`w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${isMobileConversationOpen ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold mb-4">Messages</h1>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon size={18} className="text-gray-400" />
                </div>
                <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {filteredConversations.map(conversation => <button key={conversation.id} className={`w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`} onClick={() => handleSelectConversation(conversation)}>
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <img src={conversation.user.avatar} alt={conversation.user.name} className="w-12 h-12 rounded-full object-cover" />
                      {conversation.user.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">
                          {conversation.user.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {formatConversationDate(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && <span className="ml-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {conversation.unreadCount}
                      </span>}
                  </div>
                </button>)}
            </div>
          </div>
          {/* Conversation View */}
          <div className={`w-full md:w-2/3 lg:w-3/4 flex flex-col ${!isMobileConversationOpen && !selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            {selectedConversation ? <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <button className="md:hidden mr-2 text-gray-500 dark:text-gray-400" onClick={() => setIsMobileConversationOpen(false)}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="relative mr-3">
                      <img src={selectedConversation.user.avatar} alt={selectedConversation.user.name} className="w-10 h-10 rounded-full object-cover" />
                      {selectedConversation.user.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>}
                    </div>
                    <div>
                      <h2 className="font-medium">
                        {selectedConversation.user.name}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedConversation.user.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <PhoneIcon size={20} />
                    </button>
                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <VideoIcon size={20} />
                    </button>
                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <MoreVerticalIcon size={20} />
                    </button>
                  </div>
                </div>
                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="space-y-4">
                    {MOCK_MESSAGES.map(message => <div key={message.id} className={`flex ${message.sender === 0 ? 'justify-end' : 'justify-start'}`}>
                        {message.sender !== 0 && <img src={selectedConversation.user.avatar} alt={selectedConversation.user.name} className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0 self-end" />}
                        <div className={`max-w-[75%] px-4 py-2 rounded-lg ${message.sender === 0 ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'}`}>
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 text-right ${message.sender === 0 ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>)}
                  </div>
                </div>
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <form onSubmit={handleSendMessage} className="flex items-end">
                    <button type="button" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <PaperclipIcon size={20} />
                    </button>
                    <div className="flex-grow mx-2">
                      <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows={1}></textarea>
                    </div>
                    <div className="flex items-center">
                      <button type="button" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 mr-2">
                        <SmileIcon size={20} />
                      </button>
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors duration-200">
                        <SendIcon size={20} />
                      </button>
                    </div>
                  </form>
                </div>
              </> : <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    No conversation selected
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a conversation from the list to start messaging.
                  </p>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default Messaging;