import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';
import {
  Briefcase, Calendar, User as UserIcon, BookOpen,
  Edit2, Save, X, Building, GraduationCap,
  Mail, Phone, Plus, Camera, Check, XCircle
} from 'lucide-react';

interface ProfileData {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  profile?: {
    bio?: string;
    skills?: string[];
    college?: string;
    course?: string;
    semester?: string;
    interests?: string[];
    avatarUrl?: string;
  };
}

interface ConnectionRequest {
  _id: string;
  requester: {
    _id: string;
    name: string;
    email: string;
    profile?: { avatarUrl?: string };
    avatarUrl?: string;
  };
  status: string;
  createdAt: string;
}

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: [] as string[],
    college: '',
    course: '',
    semester: '',
    interests: [] as string[],
    avatarUrl: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Beginner');
  const [newInterest, setNewInterest] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = !id || id === currentUser?._id || id === currentUser?.id;

  useEffect(() => {
    fetchProfile();
    if (isOwnProfile) {
      fetchConnectionRequests();
      fetchConnections();
    }
  }, [id, currentUser]);

  const fetchConnectionRequests = async () => {
    try {
      const requests = await apiFetch('/connections/requests');
      setConnectionRequests(requests);
    } catch (err) {
      console.error('Failed to fetch connection requests:', err);
    }
  };

  const fetchConnections = async () => {
    try {
      const data = await apiFetch('/connections');
      setConnections(data || []);
    } catch (err) {
      console.error('Failed to fetch connections:', err);
      setConnections([]);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');

      let data;
      if (isOwnProfile) {
        // Fetch own profile
        const token = localStorage.getItem('sc_token');
        data = await apiFetch('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Fetch other user's profile
        data = await apiFetch(`/users/${id}`);
      }

      setProfileData(data);

      // Initialize form data
      setFormData({
        name: data.name || '',
        bio: data.profile?.bio || '',
        skills: data.profile?.skills || [],
        college: data.profile?.college || '',
        course: data.profile?.course || '',
        semester: data.profile?.semester || '',
        interests: data.profile?.interests || [],
        avatarUrl: data.profile?.avatarUrl || data.avatar || ''
      });
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const token = localStorage.getItem('sc_token');
      const updated = await apiFetch('/users/me', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          name: formData.name,
          profile: {
            bio: formData.bio,
            skills: formData.skills,
            college: formData.college,
            course: formData.course,
            semester: formData.semester,
            interests: formData.interests,
            avatarUrl: formData.avatarUrl
          }
        }
      });

      setProfileData(updated);
      setEditMode(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile data
    setFormData({
      name: profileData?.name || '',
      bio: profileData?.profile?.bio || '',
      skills: profileData?.profile?.skills || [],
      college: profileData?.profile?.college || '',
      course: profileData?.profile?.course || '',
      semester: profileData?.profile?.semester || '',
      interests: profileData?.profile?.interests || [],
      avatarUrl: profileData?.profile?.avatarUrl || profileData?.avatar || ''
    });
    setEditMode(false);
    setError('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      const response = await apiFetch('/upload', {
        method: 'POST',
        body: data,
        isFormData: true
      });
      setFormData(prev => ({ ...prev, avatarUrl: response.url }));
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    }
  };

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

  const addSkill = () => {
    if (newSkill.trim()) {
      const skillString = `${newSkill.trim()} - ${newSkillLevel}`;
      if (!formData.skills.includes(skillString)) {
        setFormData({ ...formData, skills: [...formData.skills, skillString] });
        setNewSkill('');
      }
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      await apiFetch(`/connections/accept/${connectionId}`, { method: 'PUT' });
      // Refresh connection requests
      fetchConnectionRequests();
      alert('Connection request accepted!');
    } catch (err: any) {
      console.error('Failed to accept request:', err);
      alert(err?.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    try {
      await apiFetch(`/connections/reject/${connectionId}`, { method: 'PUT' });
      // Refresh connection requests
      fetchConnectionRequests();
      alert('Connection request rejected');
    } catch (err: any) {
      console.error('Failed to reject request:', err);
      alert(err?.message || 'Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container py-5 text-center">
        <h3>Profile not found</h3>
        <Link to="/" className="btn btn-primary mt-3">Go Home</Link>
      </div>
    );
  }

  const displayAvatar = formData.avatarUrl || profileData.avatar || '';
  const displayName = editMode ? formData.name : profileData.name;
  const displayBio = editMode ? formData.bio : (profileData.profile?.bio || 'No bio yet.');
  const displaySkills = editMode ? formData.skills : (profileData.profile?.skills || []);
  const displayInterests = editMode ? formData.interests : (profileData.profile?.interests || []);

  // Mock activities (you can fetch real data later)
  const activities = [
    { id: 1, text: `${profileData.name} started a new project`, date: 'Recently', icon: <Briefcase size={18} /> },
    { id: 2, text: `${profileData.name} connected with others`, date: 'This week', icon: <UserIcon size={18} /> },
    { id: 3, text: `${profileData.name} joined a study group`, date: 'Last week', icon: <BookOpen size={18} /> },
  ];

  return (
    <div className="container py-5">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Connection Requests Section - Only show on own profile */}
      {isOwnProfile && connectionRequests.length > 0 && (
        <div className="alert alert-info border-0 shadow-sm mb-4">
          <h5 className="alert-heading mb-3">
            <UserIcon size={20} className="me-2" />
            Connection Requests ({connectionRequests.length})
          </h5>
          <div className="d-flex flex-column gap-3">
            {connectionRequests.map((request) => (
              <div key={request._id} className="d-flex align-items-center justify-content-between bg-white rounded p-3">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={request.requester.profile?.avatarUrl || request.requester.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.requester.name)}`}
                    alt={request.requester.name}
                    className="rounded-circle"
                    width="48"
                    height="48"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-0">{request.requester.name}</h6>
                    <small className="text-muted">{request.requester.email}</small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleAcceptRequest(request._id)}
                  >
                    <Check size={16} />
                    Accept
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleRejectRequest(request._id)}
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex align-items-start gap-4">
            {/* Avatar */}
            {/* Avatar */}
            <div className="position-relative">
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div
                className={`position-relative ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && fileInputRef.current?.click()}
                style={{ cursor: editMode ? 'pointer' : 'default' }}
              >
                {displayAvatar ? (
                  <img
                    src={getImageUrl(displayAvatar)}
                    alt={displayName}
                    className="rounded-circle border border-3 border-primary"
                    width="120"
                    height="120"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center border border-3 border-primary"
                    style={{ width: 120, height: 120, fontSize: '3rem', fontWeight: 'bold' }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {editMode && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-opacity" style={{ transition: 'opacity 0.2s' }}>
                    <Camera className="text-white" size={32} />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-grow-1">
              {editMode ? (
                <input
                  type="text"
                  className="form-control form-control-lg fw-bold mb-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              ) : (
                <h2 className="mb-2 fw-bold">{displayName}</h2>
              )}

              <div className="d-flex flex-wrap gap-3 text-muted small mb-3">
                {profileData.email && (
                  <span><Mail size={16} className="me-1" />{profileData.email}</span>
                )}
                {profileData.phone && (
                  <span><Phone size={16} className="me-1" />{profileData.phone}</span>
                )}
                {(editMode ? formData.college : profileData.profile?.college) && (
                  <span><Building size={16} className="me-1" />{editMode ? formData.college : profileData.profile?.college}</span>
                )}
                {(editMode ? formData.course : profileData.profile?.course) && (
                  <span><GraduationCap size={16} className="me-1" />{editMode ? formData.course : profileData.profile?.course}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                {isOwnProfile ? (
                  editMode ? (
                    <>
                      <button
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => setEditMode(true)}
                      >
                        <Edit2 size={18} />
                        Edit Profile
                      </button>
                      <button
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        onClick={() => setShowConnectionsModal(true)}
                      >
                        <UserIcon size={18} />
                        Connections ({connections.length})
                      </button>
                    </>
                  )
                ) : (
                  <>
                    <button className="btn btn-primary">Message</button>
                    <button className="btn btn-outline-primary">Connect</button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* Connections Modal */}
      {
        showConnectionsModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">My Connections ({connections.length})</h5>
                  <button type="button" className="btn-close" onClick={() => setShowConnectionsModal(false)}></button>
                </div>
                <div className="modal-body p-0">
                  {connections.length === 0 ? (
                    <div className="text-center p-5 text-muted">
                      <UserIcon size={48} className="mb-3 opacity-50" />
                      <p>No connections yet.</p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {connections.map((conn) => (
                        <div key={conn.connectionId} className="list-group-item d-flex align-items-center justify-content-between p-3">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={conn.user.profile?.avatarUrl || conn.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conn.user.name)}`}
                              alt={conn.user.name}
                              className="rounded-circle object-fit-cover"
                              width="48"
                              height="48"
                            />
                            <div>
                              <h6 className="mb-0 fw-semibold">{conn.user.name}</h6>
                              <small className="text-muted">{conn.user.email}</small>
                            </div>
                          </div>
                          <Link
                            to={`/profile/${conn.user._id || conn.user.id}`}
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setShowConnectionsModal(false)}
                          >
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-md-4">
          {/* About */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">About</h5>
              {editMode ? (
                <textarea
                  className="form-control"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="card-text text-muted text-justify" style={{ whiteSpace: 'pre-line' }}>{displayBio}</p>
              )}
            </div>
          </div>

          {/* Education Details */}
          {(editMode || profileData.profile?.college || profileData.profile?.course) && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Education</h5>
                {editMode ? (
                  <div className="d-flex flex-column gap-3">
                    <div>
                      <label className="form-label small text-muted">College/University</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g., Stanford University"
                      />
                    </div>
                    <div>
                      <label className="form-label small text-muted">Course</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <label className="form-label small text-muted">Semester/Year</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        placeholder="e.g., 3rd Year"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {profileData.profile?.college && (
                      <div><Building size={16} className="me-2 text-primary" />{profileData.profile.college}</div>
                    )}
                    {profileData.profile?.course && (
                      <div><GraduationCap size={16} className="me-2 text-primary" />{profileData.profile.course}</div>
                    )}
                    {profileData.profile?.semester && (
                      <div><Calendar size={16} className="me-2 text-primary" />{profileData.profile.semester}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Skills</h5>
              {editMode ? (
                <div>
                  <div className="d-flex gap-2 mb-3">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                    />
                    <select
                      className="form-select form-select-sm"
                      style={{ width: '130px' }}
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value)}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button className="btn btn-sm btn-primary" onClick={addSkill}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.skills.map((skill, i) => {
                      const [name, level] = skill.includes(' - ') ? skill.split(' - ') : [skill, ''];
                      return (
                        <span key={i} className="badge bg-primary d-flex align-items-center gap-1">
                          {name} {level && <span className="opacity-75 small">({level})</span>}
                          <X size={14} className="cursor-pointer" onClick={() => removeSkill(skill)} style={{ cursor: 'pointer' }} />
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : displaySkills.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {displaySkills.map((skill, i) => {
                    const [name, level] = skill.includes(' - ') ? skill.split(' - ') : [skill, ''];
                    let barColor = 'bg-primary';
                    let width = '50%';

                    if (level === 'Beginner') { barColor = 'bg-info'; width = '33%'; }
                    else if (level === 'Intermediate') { barColor = 'bg-warning'; width = '66%'; }
                    else if (level === 'Expert') { barColor = 'bg-success'; width = '100%'; }

                    return (
                      <div key={i}>
                        <div className="d-flex justify-content-between mb-1">
                          <span>{name}</span>
                          {level && <span className={`badge ${barColor} text-white`}>{level}</span>}
                        </div>
                        <div className="progress" style={{ height: 6 }}>
                          <div className={`progress-bar ${barColor}`} style={{ width }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted small">No skills added yet.</p>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Interests</h5>
              {editMode ? (
                <div>
                  <div className="d-flex gap-2 mb-3">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                      placeholder="Add an interest"
                    />
                    <button className="btn btn-sm btn-primary" onClick={addInterest}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.interests.map((interest, i) => (
                      <span key={i} className="badge bg-body-secondary text-body border d-flex align-items-center gap-1">
                        {interest}
                        <X size={14} className="cursor-pointer" onClick={() => removeInterest(interest)} style={{ cursor: 'pointer' }} />
                      </span>
                    ))}
                  </div>
                </div>
              ) : displayInterests.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {displayInterests.map((interest, i) => (
                    <span key={i} className="badge bg-body-secondary text-body border rounded-pill px-3 py-2">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No interests added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-8">
          {/* Recent Activity */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Recent Activity</h5>
              <div className="d-flex flex-column gap-4">
                {activities.map(act => (
                  <div key={act.id} className="d-flex gap-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40 }}>
                      {act.icon}
                    </div>
                    <div>
                      <div className="mb-1">{act.text}</div>
                      <div className="text-muted small"><Calendar size={12} className="me-1" /> {act.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}