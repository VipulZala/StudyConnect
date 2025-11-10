import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, PlusIcon, VideoIcon, MicIcon, MonitorIcon, MessageSquareIcon, PenToolIcon, MicOffIcon, VideoOffIcon, PhoneOffIcon } from 'lucide-react';
// Mock data for study rooms
const MOCK_ROOMS = [{
  id: 1,
  name: 'Advanced Algorithms Study Group',
  course: 'CS 161: Design and Analysis of Algorithms',
  participants: 4,
  maxParticipants: 8,
  isActive: true,
  host: {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}, {
  id: 2,
  name: 'Machine Learning Project Collaboration',
  course: 'CS 229: Machine Learning',
  participants: 3,
  maxParticipants: 6,
  isActive: true,
  host: {
    id: 2,
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}, {
  id: 3,
  name: 'Biology Midterm Prep',
  course: 'BIO 101: Introduction to Biology',
  participants: 5,
  maxParticipants: 8,
  isActive: true,
  host: {
    id: 4,
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}, {
  id: 4,
  name: 'Business Case Study Analysis',
  course: 'BUS 202: Strategic Management',
  participants: 2,
  maxParticipants: 4,
  isActive: false,
  host: {
    id: 5,
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  scheduledTime: '2023-10-16T15:00:00Z'
}];
// Mock participants for the active room
const MOCK_PARTICIPANTS = [{
  id: 1,
  name: 'You',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  isHost: true,
  videoEnabled: true,
  audioEnabled: true,
  isScreenSharing: false
}, {
  id: 2,
  name: 'Sophia Chen',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  isHost: false,
  videoEnabled: true,
  audioEnabled: true,
  isScreenSharing: false
}, {
  id: 3,
  name: 'Marcus Rodriguez',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  isHost: false,
  videoEnabled: true,
  audioEnabled: false,
  isScreenSharing: false
}, {
  id: 4,
  name: 'Emma Thompson',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  isHost: false,
  videoEnabled: false,
  audioEnabled: true,
  isScreenSharing: false
}];
// Format scheduled time
const formatScheduledTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString(undefined, options);
};
const StudyRoom: React.FC = () => {
  const [isInRoom, setIsInRoom] = useState(false);
  const [activeTab, setActiveTab] = useState<'rooms' | 'create'>('rooms');
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  // Mock function to join a room
  const joinRoom = (roomId: number) => {
    console.log(`Joining room ${roomId}`);
    setIsInRoom(true);
  };
  // Mock function to leave a room
  const leaveRoom = () => {
    console.log('Leaving room');
    setIsInRoom(false);
  };
  return <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      {isInRoom ?
    // Active Study Room View
    <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Room Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold">
                  Machine Learning Project Collaboration
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  CS 229: Machine Learning
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => setShowWhiteboard(!showWhiteboard)} className={`p-2 rounded-full ${showWhiteboard ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  <PenToolIcon size={20} />
                </button>
                <button onClick={() => setShowChat(!showChat)} className={`p-2 rounded-full ${showChat ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  <MessageSquareIcon size={20} />
                </button>
                <button onClick={leaveRoom} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center">
                  <PhoneOffIcon size={18} className="mr-2" /> Leave Room
                </button>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-grow flex">
            {/* Video Grid */}
            <div className={`flex-grow ${showChat || showWhiteboard ? 'lg:w-2/3' : 'w-full'} bg-gray-900 p-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {MOCK_PARTICIPANTS.map(participant => <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                    {participant.videoEnabled ? <img src={`https://source.unsplash.com/random/640x480?sig=${participant.id}`} alt="Video feed" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                          <span className="text-2xl text-gray-400">
                            {participant.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-gray-400">
                          {participant.name}
                        </span>
                      </div>}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          {participant.name} {participant.isHost && '(Host)'}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {!participant.audioEnabled && <span className="bg-red-600 p-1 rounded">
                            <MicOffIcon size={16} className="text-white" />
                          </span>}
                        {!participant.videoEnabled && <span className="bg-red-600 p-1 rounded">
                            <VideoOffIcon size={16} className="text-white" />
                          </span>}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Side Panel (Chat or Whiteboard) */}
            {(showChat || showWhiteboard) && <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                {showChat && <div className="h-full flex flex-col">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium">Chat</h3>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4">
                      <div className="space-y-4">
                        <div className="flex">
                          <img src={MOCK_PARTICIPANTS[1].avatar} alt={MOCK_PARTICIPANTS[1].name} className="w-8 h-8 rounded-full mr-2" />
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm font-medium mb-1">
                              {MOCK_PARTICIPANTS[1].name}
                            </p>
                            <p className="text-sm">
                              Has everyone reviewed the dataset I shared
                              yesterday?
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">
                              Yes, I've looked through it. I think we should
                              focus on feature engineering first.
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          <img src={MOCK_PARTICIPANTS[2].avatar} alt={MOCK_PARTICIPANTS[2].name} className="w-8 h-8 rounded-full mr-2" />
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm font-medium mb-1">
                              {MOCK_PARTICIPANTS[2].name}
                            </p>
                            <p className="text-sm">
                              I agree. I can start working on that today.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex">
                        <input type="text" placeholder="Type a message..." className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors duration-200">
                          Send
                        </button>
                      </div>
                    </div>
                  </div>}
                {showWhiteboard && !showChat && <div className="h-full flex flex-col">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium">Collaborative Whiteboard</h3>
                    </div>
                    <div className="flex-grow bg-white p-4 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                          Whiteboard functionality
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          This would be an interactive whiteboard where students
                          can draw and collaborate in real-time.
                        </p>
                      </div>
                    </div>
                  </div>}
              </div>}
          </div>
          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="container mx-auto flex justify-center">
              <div className="flex space-x-4">
                <button onClick={() => setAudioEnabled(!audioEnabled)} className={`p-3 rounded-full ${audioEnabled ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
                  {audioEnabled ? <MicIcon size={24} /> : <MicOffIcon size={24} />}
                </button>
                <button onClick={() => setVideoEnabled(!videoEnabled)} className={`p-3 rounded-full ${videoEnabled ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
                  {videoEnabled ? <VideoIcon size={24} /> : <VideoOffIcon size={24} />}
                </button>
                <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <MonitorIcon size={24} />
                </button>
              </div>
            </div>
          </div>
        </div> :
    // Study Room List View
    <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Virtual Study Rooms</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Join or create virtual study rooms for real-time collaboration.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="#" onClick={() => setActiveTab('create')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors duration-200">
                <PlusIcon size={18} className="mr-2" /> Create Room
              </Link>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                <button onClick={() => setActiveTab('rooms')} className={`px-4 py-3 font-medium ${activeTab === 'rooms' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  Available Rooms
                </button>
                <button onClick={() => setActiveTab('create')} className={`px-4 py-3 font-medium ${activeTab === 'create' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  Create Room
                </button>
              </nav>
            </div>
            {activeTab === 'rooms' ? <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_ROOMS.map(room => <div key={room.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{room.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${room.isActive ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
                            {room.isActive ? 'Active' : 'Scheduled'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {room.course}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <img src={room.host.avatar} alt={room.host.name} className="w-6 h-6 rounded-full mr-2" />
                            <span className="text-sm">{room.host.name}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <UsersIcon size={16} className="mr-1" />
                            {room.participants}/{room.maxParticipants}
                          </div>
                        </div>
                        {room.isActive ? <button onClick={() => joinRoom(room.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors duration-200">
                            Join Room
                          </button> : <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Starts at {formatScheduledTime(room.scheduledTime!)}
                          </div>}
                      </div>
                    </div>)}
                </div>
              </div> : <div className="p-6">
                <form className="max-w-2xl mx-auto">
                  <div className="mb-4">
                    <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Room Name
                    </label>
                    <input type="text" id="roomName" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Calculus Study Group" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course
                    </label>
                    <input type="text" id="course" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., MATH 101: Calculus I" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Maximum Participants
                      </label>
                      <select id="maxParticipants" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="2">2 participants</option>
                        <option value="4">4 participants</option>
                        <option value="6">6 participants</option>
                        <option value="8">8 participants</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Room Type
                      </label>
                      <select id="roomType" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="public">Public (Anyone can join)</option>
                        <option value="private">Private (Invite only)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (Optional)
                    </label>
                    <textarea id="description" rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Describe what you'll be studying or working on..."></textarea>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Features
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          Video conferencing
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          Chat
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          Collaborative whiteboard
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          Screen sharing
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setActiveTab('rooms')} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
                      Create Room
                    </button>
                  </div>
                </form>
              </div>}
          </div>
        </div>}
    </div>;
};
export default StudyRoom;