import React, { useState } from 'react';
import { SearchIcon, FilterIcon, UserPlusIcon, MessageSquareIcon } from 'lucide-react';
// Mock data for connections
const MOCK_CONNECTIONS = [{
  id: 1,
  name: 'Vivek Pathak',
  major: 'Computer Science',
  year: 'Junior',
  university: 'Delhi University',
  interests: ['Machine Learning', 'Web Development', 'Algorithms'],
  skills: ['Python', 'React', 'TensorFlow'],
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualConnections: 3
}, {
  id: 2,
  name: 'Nisha Sharma',
  major: 'Data Science',
  year: 'Senior',
  university: 'MIT',
  interests: ['Big Data', 'AI Ethics', 'Data Visualization'],
  skills: ['R', 'SQL', 'Tableau', 'Python'],
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualConnections: 5
}, {
  id: 3,
  name: 'Marcus Rodriguez',
  major: 'Electrical Engineering',
  year: 'Graduate Student',
  university: 'Georgia Tech',
  interests: ['Robotics', 'IoT', 'Embedded Systems'],
  skills: ['Arduino', 'C++', 'PCB Design'],
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualConnections: 2
}, {
  id: 4,
  name: 'Priya Patel',
  major: 'Biology',
  year: 'Sophomore',
  university: 'UC Berkeley',
  interests: ['Genetics', 'Molecular Biology', 'Bioinformatics'],
  skills: ['CRISPR', 'Lab Techniques', 'R'],
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualConnections: 1
}, {
  id: 5,
  name: 'David Wilson',
  major: 'Business Administration',
  year: 'Senior',
  university: 'NYU',
  interests: ['Entrepreneurship', 'Marketing', 'Finance'],
  skills: ['Market Research', 'Excel', 'Public Speaking'],
  avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualConnections: 4
}, {
  id: 6,
  name: 'Emma Thompson',
  major: 'Psychology',
  year: 'Junior',
  university: 'UCLA',
  interests: ['Cognitive Psychology', 'Research Methods', 'Mental Health'],
  skills: ['SPSS', 'Experimental Design', 'Data Analysis'],
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualConnections: 3
}];
// Mock data for universities
const UNIVERSITIES = ['All Universities', 'Stanford University', 'MIT', 'Georgia Tech', 'UC Berkeley', 'NYU', 'UCLA'];
// Mock data for majors
const MAJORS = ['All Majors', 'Computer Science', 'Data Science', 'Electrical Engineering', 'Biology', 'Business Administration', 'Psychology'];
const Connections: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
  const [selectedMajor, setSelectedMajor] = useState('All Majors');
  const [showFilters, setShowFilters] = useState(false);
  // Filter connections based on search query and filters
  const filteredConnections = MOCK_CONNECTIONS.filter(connection => {
    // Apply search query filter
    if (searchQuery && !connection.name.toLowerCase().includes(searchQuery.toLowerCase()) && !connection.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) && !connection.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    // Apply university filter
    if (selectedUniversity !== 'All Universities' && connection.university !== selectedUniversity) {
      return false;
    }
    // Apply major filter
    if (selectedMajor !== 'All Majors' && connection.major !== selectedMajor) {
      return false;
    }
    return true;
  });
  return <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Connections</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find and connect with students who share your academic interests.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button onClick={() => setShowFilters(!showFilters)} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 flex items-center transition-colors duration-200">
              <FilterIcon size={18} className="mr-2" /> Filters
            </button>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={20} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search by name, skills, or interests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          {showFilters && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  University
                </label>
                <select id="university" value={selectedUniversity} onChange={e => setSelectedUniversity(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {UNIVERSITIES.map(university => <option key={university} value={university}>
                      {university}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Major
                </label>
                <select id="major" value={selectedMajor} onChange={e => setSelectedMajor(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {MAJORS.map(major => <option key={major} value={major}>
                      {major}
                    </option>)}
                </select>
              </div>
            </div>}
        </div>
        {/* Connection Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConnections.length > 0 ? filteredConnections.map(connection => <div key={connection.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105 duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img src={connection.avatar} alt={connection.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {connection.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {connection.major} • {connection.year}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {connection.university}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {connection.interests.map((interest, index) => <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-md">
                          {interest}
                        </span>)}
                    </div>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {connection.skills.map((skill, index) => <span key={index} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-md">
                          {skill}
                        </span>)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {connection.mutualConnections} mutual connection
                      {connection.mutualConnections !== 1 ? 's' : ''}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200">
                        <MessageSquareIcon size={18} />
                      </button>
                      <button className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200">
                        <UserPlusIcon size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>) : <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-1">No connections found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters to find more students.
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
export default Connections;