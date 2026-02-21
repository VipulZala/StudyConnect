import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, FilterIcon, UserPlusIcon, MessageSquareIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

interface Connection {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  major: string;
  year: string;
  university: string;
  interests: string[];
  skills: string[];
  skillsWithLevel: string[];
  avatar: string;
  mutualConnections: number;
}

// Indian Universities
const UNIVERSITIES = [
  'All Universities',
  'Indian Institute of Technology Bombay',
  'Indian Institute of Technology Delhi',
  'Indian Institute of Technology Madras',
  'Indian Institute of Technology Kanpur',
  'Indian Institute of Technology Kharagpur',
  'University of Delhi',
  'Jawaharlal Nehru University',
  'Banaras Hindu University',
  'Anna University',
  'Mumbai University',
  'BITS Pilani',
  'Vellore Institute of Technology',
  'Manipal Academy of Higher Education',
  'Amity University',
  'SRM Institute of Science and Technology'
];

// Trending Majors in India
const MAJORS = [
  'All Majors',
  'Computer Science Engineering',
  'Information Technology',
  'Electronics and Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Business Administration (MBA)',
  'Commerce (B.Com)',
  'Economics',
  'Psychology',
  'Medicine (MBBS)',
  'Law (LLB)',
  'Bi Biotechnology'
];
const Connections: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
  const [selectedMajor, setSelectedMajor] = useState('All Majors');
  const [showFilters, setShowFilters] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await apiFetch('/users');

      console.log('Fetched users:', users); // Debug log

      // Transform backend user data to Connection format
      const transformedUsers: Connection[] = users
        .filter((u: any) => u._id !== currentUser?._id && u._id !== currentUser?.id) // Exclude current user
        .map((u: any) => {
          console.log('User profile data:', u.name, u.profile); // Debug each user
          return {
            id: u._id || u.id,
            name: u.name || 'Unknown User',
            email: u.email || '',
            phone: u.phone || '',
            bio: u.profile?.bio || '',
            major: u.profile?.course || 'Not specified',
            year: u.profile?.semester || 'Not specified',
            university: u.profile?.college || 'Not specified',
            interests: u.profile?.interests || [],
            skills: (u.profile?.skills || []).map((s: string) => s.split(' - ')[0]), // Remove skill level for badges
            skillsWithLevel: u.profile?.skills || [], // Keep full skill strings with levels
            avatar: u.profile?.avatarUrl || u.avatar || u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}`,
            mutualConnections: 0 // TODO: Calculate actual mutual connections
          };
        });

      setConnections(transformedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddConnection = async (userId: string) => {
    try {
      await apiFetch('/connections/request', {
        method: 'POST',
        body: { recipientId: userId }
      });

      setNotification({ show: true, message: 'Connection request sent successfully!', type: 'success' });
      // Optionally refresh the connections list to update UI
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to send connection request:', err);
      setNotification({ show: true, message: err?.message || 'Failed to send connection request', type: 'error' });
    }
  };

  const handleMessage = (userId: string, userName: string) => {
    // Navigate to messaging page
    // You can pass state to pre-select this conversation or create a new one
    navigate('/messaging', { state: { userId, userName } });
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };
  // Filter connections based on search query and filters
  const filteredConnections = connections.filter((connection: Connection) => {
    // Apply search query filter
    if (searchQuery && !connection.name.toLowerCase().includes(searchQuery.toLowerCase()) && !connection.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase())) && !connection.interests.some((interest: string) => interest.toLowerCase().includes(searchQuery.toLowerCase()))) {
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
    {/* Notification Modal */}
    {notification.show && (
      <div
        className="modal fade show d-block"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        tabIndex={-1}
        onClick={() => setNotification({ ...notification, show: false })}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-header border-0 ${notification.type === 'success' ? 'bg-success' : 'bg-primary'} text-white`}>
              <h5 className="modal-title">
                {notification.type === 'success' ? '✓ Success' : 'StudyConnect'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setNotification({ ...notification, show: false })}
              ></button>
            </div>
            <div className="modal-body text-center py-4">
              <p className="mb-0">{notification.message}</p>
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setNotification({ ...notification, show: false })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

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
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-3">Loading connections...</p>
          </div>
        ) : filteredConnections.length > 0 ? filteredConnections.map((connection: Connection) => <div key={connection.id} className="col-md-6 col-lg-4">
          <div className="card h-100 border-0 shadow-sm overflow-hidden hover-transform transition-all">
            <div className="card-body p-4">
              {/* Header with Avatar and Name */}
              <div className="d-flex align-items-start mb-3">
                <div
                  className="position-relative cursor-pointer"
                  onClick={() => handleViewProfile(connection.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={connection.avatar} alt={connection.name} className="rounded-circle object-fit-cover me-3" style={{ width: '64px', height: '64px' }} />
                </div>
                <div
                  onClick={() => handleViewProfile(connection.id)}
                  style={{ cursor: 'pointer', flex: 1 }}
                >
                  <h3 className="h5 fw-bold mb-1 hover-primary transition-colors">
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

              {/* Interests */}
              <div className="mb-3">
                <h4 className="small fw-bold text-muted mb-2">
                  Interests
                </h4>
                <div className="d-flex flex-wrap gap-2">
                  {connection.interests.length > 0 ? connection.interests.map((interest, index) => <span key={index} className="badge bg-primary-subtle text-primary-emphasis fw-normal">
                    {interest}
                  </span>) : <span className="text-muted small">No interests listed</span>}
                </div>
              </div>

              {/* Skills - Simple Badges */}
              <div className="mb-3">
                <h4 className="small fw-bold text-muted mb-2">
                  Skills
                </h4>
                <div className="d-flex flex-wrap gap-2">
                  {connection.skills.length > 0 ? connection.skills.map((skill, index) => <span key={index} className="badge bg-success-subtle text-success-emphasis fw-normal">
                    {skill}
                  </span>) : <span className="text-muted small">No skills listed</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                <span className="small text-muted">
                  {connection.mutualConnections} mutual connection
                  {connection.mutualConnections !== 1 ? 's' : ''}
                </span>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-light rounded-circle p-2 text-primary bg-primary-subtle border-0"
                    onClick={() => handleMessage(connection.id, connection.name)}
                    title="Send Message"
                  >
                    <MessageSquareIcon size={18} />
                  </button>
                  <button
                    className="btn btn-light rounded-circle p-2 text-success bg-success-subtle border-0"
                    onClick={() => handleAddConnection(connection.id)}
                    title="Connect"
                  >
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