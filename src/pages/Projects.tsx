import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, FilterIcon, PlusIcon, GithubIcon, UsersIcon, TagIcon } from 'lucide-react';
import { githubService, Project, ProjectCategory } from '../services/githubService';

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
  const [category, setCategory] = useState<ProjectCategory>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category options
  const categories: { value: ProjectCategory; label: string }[] = [
    { value: 'all', label: 'All Projects' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'App Development' },
    { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'backend', label: 'Backend' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'devops', label: 'DevOps' }
  ];

  // Fetch projects when category changes
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProjects = await githubService.fetchProjects(category, 30);
        setProjects(fetchedProjects);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category]);

  // Get unique tags from all projects
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags))).sort();
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };
  // Filter projects based on search query and filters
  const filteredProjects = projects.filter((project: Project) => {
    // Apply search query filter
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && !project.description.toLowerCase().includes(searchQuery.toLowerCase()) && !project.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
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
    if (filterTags.length > 0 && !filterTags.some((tag: string) => project.tags.includes(tag))) {
      return false;
    }
    return true;
  });
  return <div className="w-100 bg-light min-vh-100">
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-2">Open Source Projects</h1>
          <p className="text-muted text-justify">
            Discover and contribute to real open-source projects from GitHub.
          </p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-light border d-flex align-items-center">
            <FilterIcon size={18} className="me-2" /> Filters
          </button>
          <Link to="#" className="btn btn-primary d-flex align-items-center">
            <PlusIcon size={18} className="me-2" /> New Project
          </Link>
        </div>
      </div>
      {/* Category Filter */}
      <div className="card border-0 shadow-sm p-3 mb-3">
        <h3 className="h6 fw-medium mb-3">Project Categories</h3>
        <div className="d-flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`btn btn-sm rounded-pill ${category === cat.value ? 'btn-primary' : 'btn-light border'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      {/* Search and Filters */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="position-relative">
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 pointer-events-none">
            <SearchIcon size={20} className="text-muted" />
          </div>
          <input type="text" placeholder="Search projects by title, description, or tags..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="form-control ps-5" />
        </div>
        {showFilters && <div className="mt-3">
          <h3 className="h6 fw-medium mb-2">Filter by status:</h3>
          <div className="d-flex gap-3 mb-3">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="status" id="statusAll" checked={filterStatus === 'all'} onChange={() => setFilterStatus('all')} />
              <label className="form-check-label" htmlFor="statusAll">
                All Projects
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="status" id="statusOpen" checked={filterStatus === 'open'} onChange={() => setFilterStatus('open')} />
              <label className="form-check-label" htmlFor="statusOpen">
                Open Positions
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="status" id="statusClosed" checked={filterStatus === 'closed'} onChange={() => setFilterStatus('closed')} />
              <label className="form-check-label" htmlFor="statusClosed">
                No Open Positions
              </label>
            </div>
          </div>
          <h3 className="h6 fw-medium mb-2">Filter by tags:</h3>
          <div className="d-flex flex-wrap gap-2">
            {allTags.map((tag: string) => <button key={tag} onClick={() => toggleTag(tag)} className={`btn btn-sm rounded-pill ${filterTags.includes(tag) ? 'btn-primary' : 'btn-light border'}`}>
              {tag}
            </button>)}
          </div>
        </div>}
      </div>
      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading amazing open-source projects...</p>
        </div>
      )}
      {/* Error State */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Oops!</strong> {error}
        </div>
      )}
      {/* Projects Grid */}
      {!loading && !error && (
        <div className="row g-4">
          {filteredProjects.length > 0 ? filteredProjects.map((project: Project) => <div key={project.id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm overflow-hidden">
              <div className="position-relative" style={{
                height: '200px',
                backgroundImage: `url(${project.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                <div className="position-absolute bottom-0 start-0 p-3">
                  <span className={`badge ${project.openPositions > 0 ? 'bg-primary' : 'bg-secondary'}`}>
                    {project.openPositions > 0 ? `${project.openPositions} Open Position${project.openPositions !== 1 ? 's' : ''}` : 'Team Complete'}
                  </span>
                </div>
              </div>
              <div className="card-body d-flex flex-column p-4">
                <h2 className="h5 fw-bold mb-2">
                  {project.title}
                </h2>
                <p className="text-muted small mb-3 flex-grow-1 text-justify" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {project.description}
                </p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {project.tags.slice(0, 3).map((tag: string, index: number) => <span key={index} className="badge bg-light text-dark border fw-normal d-flex align-items-center">
                    <TagIcon size={12} className="me-1" /> {tag}
                  </span>)}
                  {project.tags.length > 3 && <span className="badge bg-light text-muted border fw-normal">
                    +{project.tags.length - 3} more
                  </span>}
                </div>
                <div className="d-flex align-items-center justify-content-between small text-muted">
                  <div className="d-flex align-items-center">
                    <UsersIcon size={16} className="me-1" />
                    {project.members} member{project.members !== 1 ? 's' : ''}
                  </div>
                  <div>Created {formatDate(project.createdAt)}</div>
                </div>
              </div>
              <div className="card-footer bg-white border-top p-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img src={project.creator.avatar} alt={project.creator.name} className="rounded-circle me-2" style={{ width: '32px', height: '32px' }} />
                  <span className="small fw-medium">
                    {project.creator.name}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover-text-dark">
                    <GithubIcon size={20} />
                  </a>
                  <Link to={`/projects/${project.id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>) : <div className="col-12 text-center py-5">
            <div className="text-muted mb-3">
              <svg className="mx-auto" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="h5 fw-medium mb-1">No projects found</h3>
            <p className="text-muted">
              Try adjusting your search or filters to find projects.
            </p>
          </div>}
        </div>
      )}
    </div>
  </div>;
};
export default Projects;