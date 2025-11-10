import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserIcon, BriefcaseIcon, BookOpenIcon, MessageSquareIcon, UserPlusIcon, CalendarIcon } from 'lucide-react';
// Mock user data
const USER_DATA = {
  id: 'me',
  name: 'Alex Johnson',
  title: 'Computer Science Student',
  university: 'Stanford University',
  year: 'Junior',
  location: 'Palo Alto, CA',
  bio: 'Passionate about machine learning and web development. Looking to collaborate on projects that make a positive impact.',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  skills: [{
    name: 'React',
    level: 'Advanced'
  }, {
    name: 'Python',
    level: 'Advanced'
  }, {
    name: 'TensorFlow',
    level: 'Intermediate'
  }, {
    name: 'Node.js',
    level: 'Intermediate'
  }, {
    name: 'SQL',
    level: 'Intermediate'
  }, {
    name: 'UI/UX Design',
    level: 'Beginner'
  }],
  interests: ['Machine Learning', 'Web Development', 'Open Source', 'Data Science', 'Mobile Apps'],
  courses: [{
    code: 'CS 224N',
    name: 'Natural Language Processing with Deep Learning'
  }, {
    code: 'CS 231N',
    name: 'Convolutional Neural Networks for Visual Recognition'
  }, {
    code: 'CS 161',
    name: 'Design and Analysis of Algorithms'
  }],
  projects: [{
    id: 1,
    name: 'AI Study Assistant',
    description: 'A machine learning tool that helps students organize study materials and create personalized quizzes.',
    tags: ['Python', 'TensorFlow', 'NLP'],
    collaborators: 3,
    githubUrl: '#'
  }, {
    id: 2,
    name: 'Campus Navigation App',
    description: 'Mobile app that helps students find the fastest routes between classes and locate study spaces.',
    tags: ['React Native', 'Node.js', 'MongoDB'],
    collaborators: 2,
    githubUrl: '#'
  }],
  activities: [{
    id: 1,
    type: 'project',
    action: 'started a new project',
    target: 'AI Study Assistant',
    timestamp: '2023-10-15T14:30:00Z'
  }, {
    id: 2,
    type: 'connection',
    action: 'connected with',
    target: 'Sophia Chen',
    timestamp: '2023-10-12T09:15:00Z'
  }, {
    id: 3,
    type: 'course',
    action: 'enrolled in',
    target: 'CS 224N: Natural Language Processing with Deep Learning',
    timestamp: '2023-09-25T11:45:00Z'
  }, {
    id: 4,
    type: 'project',
    action: 'completed',
    target: 'Campus Navigation App',
    timestamp: '2023-09-10T16:20:00Z'
  }]
};
// Format date function
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const Profile: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'courses'>('overview');
  // In a real app, you would fetch the user data based on the id
  // For this example, we'll just use the mock data
  const userData = USER_DATA;
  return <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-cover bg-center" style={{
      backgroundImage: `url(${userData.coverImage})`
    }}>
        <div className="h-full w-full bg-black bg-opacity-30"></div>
      </div>
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end">
            <div className="ml-4 md:ml-8">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800">
                <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="mt-4 md:mt-0 ml-4 md:ml-6 flex-grow">
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {userData.title}
              </p>
              <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center mr-4 mb-2">
                  <BookOpenIcon size={16} className="mr-1" />{' '}
                  {userData.university}
                </span>
                <span className="flex items-center mr-4 mb-2">
                  <UserIcon size={16} className="mr-1" /> {userData.year}
                </span>
                <span className="flex items-center mb-2">
                  <BriefcaseIcon size={16} className="mr-1" />{' '}
                  {userData.location}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 ml-4 md:ml-0 flex space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors duration-200">
                <MessageSquareIcon size={18} className="mr-2" /> Message
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md font-medium flex items-center transition-colors duration-200">
                <UserPlusIcon size={18} className="mr-2" /> Connect
              </button>
            </div>
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('overview')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('projects')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'projects' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              Projects
            </button>
            <button onClick={() => setActiveTab('courses')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              Courses
            </button>
          </nav>
        </div>
        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-8">
            {/* About */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-600 dark:text-gray-300">{userData.bio}</p>
            </div>
            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Skills</h2>
              <div className="space-y-4">
                {userData.skills.map((skill, index) => <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {skill.level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{
                    width: skill.level === 'Advanced' ? '90%' : skill.level === 'Intermediate' ? '65%' : '40%'
                  }}></div>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Interests */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {userData.interests.map((interest, index) => <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>)}
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="md:col-span-2 space-y-8">
            {activeTab === 'overview' && <>
                {/* Activity Feed */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                  <div className="space-y-6">
                    {userData.activities.map(activity => <div key={activity.id} className="flex">
                        <div className="mr-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                            {activity.type === 'project' && <BriefcaseIcon size={20} />}
                            {activity.type === 'connection' && <UserIcon size={20} />}
                            {activity.type === 'course' && <BookOpenIcon size={20} />}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-800 dark:text-gray-200">
                            <span className="font-medium">{userData.name}</span>{' '}
                            {activity.action}{' '}
                            <span className="font-medium">
                              {activity.target}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                            <CalendarIcon size={14} className="mr-1" />{' '}
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>)}
                  </div>
                </div>
                {/* Featured Projects */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Featured Projects</h2>
                    <button onClick={() => setActiveTab('projects')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="space-y-6">
                    {userData.projects.map(project => <div key={project.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                        <h3 className="text-lg font-semibold mb-2">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tags.map((tag, index) => <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="mr-4">
                            {project.collaborators} collaborator
                            {project.collaborators !== 1 ? 's' : ''}
                          </span>
                          <a href={project.githubUrl} className="text-blue-600 dark:text-blue-400 hover:underline">
                            View on GitHub
                          </a>
                        </div>
                      </div>)}
                  </div>
                </div>
                {/* Current Courses */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Current Courses</h2>
                    <button onClick={() => setActiveTab('courses')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="space-y-4">
                    {userData.courses.map((course, index) => <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                            <BookOpenIcon size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold">{course.code}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {course.name}
                          </p>
                        </div>
                      </div>)}
                  </div>
                </div>
              </>}
            {activeTab === 'projects' && <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">All Projects</h2>
                <div className="space-y-8">
                  {userData.projects.map(project => <div key={project.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-8 last:pb-0">
                      <h3 className="text-xl font-semibold mb-2">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, index) => <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-4">
                          {project.collaborators} collaborator
                          {project.collaborators !== 1 ? 's' : ''}
                        </span>
                        <a href={project.githubUrl} className="text-blue-600 dark:text-blue-400 hover:underline">
                          View on GitHub
                        </a>
                      </div>
                    </div>)}
                </div>
              </div>}
            {activeTab === 'courses' && <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">All Courses</h2>
                <div className="space-y-6">
                  {userData.courses.map((course, index) => <div key={index} className="flex items-start border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                          <BookOpenIcon size={20} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">{course.code}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {course.name}
                        </p>
                      </div>
                    </div>)}
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default Profile;