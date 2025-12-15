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
  return <div className="w-100 min-vh-100">
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-2">Connections</h1>
          <p className="text-muted">
            Find and connect with students who share your academic interests.
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-light border d-flex align-items-center">
            <FilterIcon size={18} className="me-2" /> Filters
          </button>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="position-relative">
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 pointer-events-none">
            <SearchIcon size={20} className="text-muted" />
          </div>
          <input type="text" placeholder="Search by name, skills, or interests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="form-control ps-5" />
        </div>
        {showFilters && <div className="row g-3 mt-2">
          <div className="col-md-6">
            <label htmlFor="university" className="form-label small fw-medium text-muted mb-1">
              University
            </label>
            <select id="university" value={selectedUniversity} onChange={e => setSelectedUniversity(e.target.value)} className="form-select">
              {UNIVERSITIES.map(university => <option key={university} value={university}>
                {university}
              </option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="major" className="form-label small fw-medium text-muted mb-1">
              Major
            </label>
            <select id="major" value={selectedMajor} onChange={e => setSelectedMajor(e.target.value)} className="form-select">
              {MAJORS.map(major => <option key={major} value={major}>
                {major}
              </option>)}
            </select>
          </div>
        </div>}
      </div>
      {/* Connection Results */}
      <div className="row g-4">
        {filteredConnections.length > 0 ? filteredConnections.map(connection => <div key={connection.id} className="col-md-6 col-lg-4">
          <div className="card h-100 border-0 shadow-sm overflow-hidden hover-transform transition-all">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <img src={connection.avatar} alt={connection.name} className="rounded-circle object-fit-cover me-3" style={{ width: '64px', height: '64px' }} />
                <div>
                  <h3 className="h5 fw-bold mb-1">
                    {connection.name}
                  </h3>
                  <p className="text-muted small mb-1">
                    {connection.major} • {connection.year}
                  </p>
                  <p className="text-muted small mb-0">
                    {connection.university}
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <h4 className="small fw-bold text-muted mb-2">
                  Interests
                </h4>
                <div className="d-flex flex-wrap gap-2">
                  {connection.interests.map((interest, index) => <span key={index} className="badge bg-primary-subtle text-primary-emphasis fw-normal">
                    {interest}
                  </span>)}
                </div>
              </div>
              <div className="mb-4">
                <h4 className="small fw-bold text-muted mb-2">
                  Skills
                </h4>
                <div className="d-flex flex-wrap gap-2">
                  {connection.skills.map((skill, index) => <span key={index} className="badge bg-success-subtle text-success-emphasis fw-normal">
                    {skill}
                  </span>)}
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-auto">
                <span className="small text-muted">
                  {connection.mutualConnections} mutual connection
                  {connection.mutualConnections !== 1 ? 's' : ''}
                </span>
                <div className="d-flex gap-2">
                  <button className="btn btn-light rounded-circle p-2 text-primary bg-primary-subtle border-0">
                    <MessageSquareIcon size={18} />
                  </button>
                  <button className="btn btn-light rounded-circle p-2 text-success bg-success-subtle border-0">
                    <UserPlusIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>) : <div className="col-12 text-center py-5">
          <div className="text-muted mb-3">
            <svg className="mx-auto" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="h5 fw-medium mb-1">No connections found</h3>
          <p className="text-muted">
            Try adjusting your search or filters to find more students.
          </p>
        </div>}
      </div>
    </div>
  </div>;
};
export default Connections;