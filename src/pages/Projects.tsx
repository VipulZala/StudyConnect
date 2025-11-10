import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, FilterIcon, PlusIcon, GithubIcon, UsersIcon, TagIcon } from 'lucide-react';
// Mock data for projects
const MOCK_PROJECTS = [{
  id: 1,
  title: 'AI Study Assistant',
  description: 'A machine learning tool that helps students organize study materials and create personalized quizzes based on their learning patterns.',
  tags: ['Machine Learning', 'Python', 'TensorFlow', 'NLP'],
  members: 4,
  openPositions: 2,
  lookingFor: ['Frontend Developer', 'UI/UX Designer'],
  githubUrl: 'https://github.com/example/ai-study-assistant',
  createdAt: '2023-09-15T14:30:00Z',
  thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  creator: {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}, {
  id: 2,
  title: 'Campus Navigation App',
  description: 'Mobile application that helps students find the fastest routes between classes, locate study spaces, and get real-time updates on building accessibility.',
  tags: ['React Native', 'Node.js', 'MongoDB', 'Maps API'],
  members: 3,
  openPositions: 1,
  lookingFor: ['Backend Developer'],
  githubUrl: 'https://github.com/example/campus-nav',
  createdAt: '2023-08-28T09:45:00Z',
  thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  creator: {
    id: 2,
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}, {
  id: 3,
  title: 'Collaborative Research Paper Editor',
  description: 'A specialized editor for academic papers with real-time collaboration features, citation management, and integration with academic databases.',
  tags: ['React', 'Firebase', 'WebSockets', 'Academic APIs'],
  members: 5,
  openPositions: 0,
  lookingFor: [],
  githubUrl: 'https://github.com/example/research-editor',
  createdAt: '2023-10-05T16:20:00Z',
  thumbnail: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  creator: {
    id: 3,
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}, {
  id: 4,
  title: 'Study Group Finder',
  description: 'Platform for finding and organizing study groups based on courses, interests, and proximity. Includes scheduling and resource sharing features.',
  tags: ['Vue.js', 'Express', 'PostgreSQL', 'Google Calendar API'],
  members: 2,
  openPositions: 3,
  lookingFor: ['Frontend Developer', 'Backend Developer', 'Mobile Developer'],
  githubUrl: 'https://github.com/example/study-group-finder',
  createdAt: '2023-09-20T11:15:00Z',
  thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  creator: {
    id: 4,
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}, {
  id: 5,
  title: 'Academic Resource Aggregator',
  description: 'Tool that aggregates and organizes academic resources from multiple sources, including open courseware, research papers, and educational videos.',
  tags: ['Python', 'Django', 'ElasticSearch', 'Web Scraping'],
  members: 3,
  openPositions: 2,
  lookingFor: ['Data Scientist', 'Backend Developer'],
  githubUrl: 'https://github.com/example/academic-resources',
  createdAt: '2023-10-12T13:40:00Z',
  thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  creator: {
    id: 5,
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}, {
  id: 6,
  title: 'Virtual Study Room Environment',
  description: 'A 3D virtual environment where students can create personalized study spaces, collaborate on projects, and share resources in an immersive setting.',
  tags: ['Three.js', 'WebGL', 'Socket.IO', 'React'],
  members: 4,
  openPositions: 1,
  lookingFor: ['3D Designer'],
  githubUrl: 'https://github.com/example/virtual-study-rooms',
  createdAt: '2023-09-08T10:25:00Z',
  thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  creator: {
    id: 6,
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}];
// Format date function
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'open', 'closed'
  const [filterTags, setFilterTags] = useState<string[]>([]);
  // Get unique tags from all projects
  const allTags = Array.from(new Set(MOCK_PROJECTS.flatMap(project => project.tags))).sort();
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };
  // Filter projects based on search query and filters
  const filteredProjects = MOCK_PROJECTS.filter(project => {
    // Apply search query filter
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && !project.description.toLowerCase().includes(searchQuery.toLowerCase()) && !project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    // Apply status filter
    if (filterStatus === 'open' && project.openPositions === 0) {
      return false;
    }
    if (filterStatus === 'closed' && project.openPositions > 0) {
      return false;
    }
    // Apply tags filter
    if (filterTags.length > 0 && !filterTags.some(tag => project.tags.includes(tag))) {
      return false;
    }
    return true;
  });
  return <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover and collaborate on student-led projects.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <button onClick={() => setShowFilters(!showFilters)} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 flex items-center transition-colors duration-200">
              <FilterIcon size={18} className="mr-2" /> Filters
            </button>
            <Link to="#" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors duration-200">
              <PlusIcon size={18} className="mr-2" /> New Project
            </Link>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={20} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search projects by title, description, or tags..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          {showFilters && <div className="mt-4">
              <h3 className="font-medium mb-2">Filter by status:</h3>
              <div className="flex space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="status" checked={filterStatus === 'all'} onChange={() => setFilterStatus('all')} className="form-radio h-4 w-4 text-blue-600" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    All Projects
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="status" checked={filterStatus === 'open'} onChange={() => setFilterStatus('open')} className="form-radio h-4 w-4 text-blue-600" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Open Positions
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="status" checked={filterStatus === 'closed'} onChange={() => setFilterStatus('closed')} className="form-radio h-4 w-4 text-blue-600" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    No Open Positions
                  </span>
                </label>
              </div>
              <h3 className="font-medium mb-2">Filter by tags:</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded-full text-sm ${filterTags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'} transition-colors duration-200`}>
                    {tag}
                  </button>)}
              </div>
            </div>}
        </div>
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? filteredProjects.map(project => <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="h-48 bg-cover bg-center" style={{
            backgroundImage: `url(${project.thumbnail})`
          }}>
                  <div className="h-full w-full bg-black bg-opacity-20 p-4 flex flex-col justify-end">
                    <div className="bg-blue-600 text-white text-xs uppercase font-bold px-2 py-1 rounded-md inline-block w-max">
                      {project.openPositions > 0 ? `${project.openPositions} Open Position${project.openPositions !== 1 ? 's' : ''}` : 'Team Complete'}
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => <span key={index} className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                        <TagIcon size={12} className="mr-1" /> {tag}
                      </span>)}
                    {project.tags.length > 3 && <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        +{project.tags.length - 3} more
                      </span>}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <UsersIcon size={16} className="mr-1" />
                      {project.members} member{project.members !== 1 ? 's' : ''}
                    </div>
                    <div>Created {formatDate(project.createdAt)}</div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={project.creator.avatar} alt={project.creator.name} className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-sm font-medium">
                      {project.creator.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      <GithubIcon size={20} />
                    </a>
                    <Link to={`/projects/${project.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>) : <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-1">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters to find projects.
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
export default Projects;