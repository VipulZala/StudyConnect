import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, FilterIcon, PlusIcon, GithubIcon, UsersIcon, TagIcon, XIcon } from 'lucide-react';
import { githubService, Project, ProjectCategory } from '../services/githubService';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

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
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'open', 'closed'
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [category, setCategory] = useState<ProjectCategory>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // New Project Modal State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    ownerName: '',
    tags: [] as string[],
    categories: [] as string[],
    members: 1,
    openPositions: 0
  });
  const [currentTag, setCurrentTag] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageFile, setGeneratedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageKeyword, setImageKeyword] = useState(''); // Custom keyword for AI image generation

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
    { value: 'devops', label: 'DevOps' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'cloud-computing', label: 'Cloud Computing' },
    { value: 'iot', label: 'Internet of Things' },
    { value: 'game-development', label: 'Game Development' }
  ];

  // Map backend project to frontend Project interface
  const mapBackendProject = (backendProject: any): Project => {
    return {
      id: backendProject._id || backendProject.id,
      title: backendProject.title,
      description: backendProject.description,
      tags: backendProject.tags || [],
      members: backendProject.members || 1,
      openPositions: backendProject.openPositions || 0,
      lookingFor: [], // Backend doesn't have this field
      githubUrl: backendProject.githubUrl || backendProject.githubRepo,
      createdAt: backendProject.createdAt,
      thumbnail: backendProject.thumbnail || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
      creator: {
        id: backendProject.author?._id || backendProject.author?.id || 0,
        name: backendProject.author?.name || backendProject.ownerName || 'Unknown',
        avatar: backendProject.author?.avatarUrl || backendProject.author?.profile?.avatarUrl || 'https://ui-avatars.com/api/?name=' + (backendProject.ownerName || 'User')
      }
    };
  };

  // Fetch projects when category changes
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch GitHub projects
        const githubProjects = await githubService.fetchProjects(category, 30);

        // Fetch user-created projects from backend
        let userProjects: Project[] = [];
        try {
          const response = await apiFetch('/projects', {
            method: 'GET'
          });
          console.log('=== BACKEND PROJECTS DEBUG ===');
          console.log('Raw response:', response);

          // Backend returns array directly, not wrapped in {projects: [...]}
          let backendProjects = [];
          if (Array.isArray(response)) {
            backendProjects = response;
          } else if (response.projects && Array.isArray(response.projects)) {
            backendProjects = response.projects;
          }

          console.log('Backend projects array:', backendProjects);
          console.log('Number of backend projects:', backendProjects.length);

          if (backendProjects.length > 0) {
            console.log('First project (raw):', backendProjects[0]);

            // Map backend projects to frontend format
            userProjects = backendProjects.map(mapBackendProject);
            console.log('Mapped user projects:', userProjects);
            console.log('First mapped project:', userProjects[0]);
          }
        } catch (err) {
          console.error('Error fetching user projects:', err);
        }

        // Combine both lists (user projects first)
        const allProjects = [...userProjects, ...githubProjects];
        console.log('Total projects:', allProjects.length);
        setProjects(allProjects);
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterTags, category]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle category toggle
  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => {
      const newCategories = prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: newCategories };
    });
    if (formErrors.categories) {
      setFormErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  // Add tag
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      if (formData.tags.length >= 10) {
        setFormErrors(prev => ({ ...prev, tags: 'Maximum 10 tags allowed' }));
        return;
      }
      setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }));
      setCurrentTag('');
      setFormErrors(prev => ({ ...prev, tags: '' }));
    }
  };

  // Remove tag
  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim() || formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    if (formData.title.length > 100) {
      errors.title = 'Title must not exceed 100 characters';
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    if (formData.description.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }
    if (!formData.githubUrl.trim()) {
      errors.githubUrl = 'GitHub URL is required';
    } else if (!/^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/.test(formData.githubUrl)) {
      errors.githubUrl = 'Please provide a valid GitHub repository URL (https://github.com/owner/repo)';
    }
    if (!formData.ownerName.trim()) {
      errors.ownerName = 'Project owner name is required';
    }
    if (formData.categories.length === 0) {
      errors.categories = 'Please select at least one category';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate AI image based on title or custom keyword
  const handleGenerateImage = async () => {
    // Use custom keyword if provided, otherwise use title
    const searchTerm = imageKeyword.trim() || formData.title;

    if (!searchTerm || searchTerm.length < 3) {
      return; // Don't generate for very short inputs
    }

    setGeneratingImage(true);
    try {
      // Create a prompt based on custom keyword or project title and categories
      const categoryHints = formData.categories.length > 0
        ? formData.categories.join(', ')
        : 'technology';

      const prompt = imageKeyword.trim()
        ? `A modern, professional project card thumbnail for "${imageKeyword}". Technology-themed, vibrant gradient colors, abstract geometric shapes, clean and minimalist design, suitable for a developer portfolio. High quality, 16:9 aspect ratio.`
        : `A modern, professional project card thumbnail for a ${categoryHints} project titled "${formData.title}". Technology-themed, vibrant gradient colors, abstract geometric shapes, clean and minimalist design, suitable for a developer portfolio. High quality, 16:9 aspect ratio.`;

      console.log('Generating image with prompt:', prompt);

      // Try to generate image using DALL-E 3 API
      let imageUrl = '';
      const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (openaiApiKey) {
        try {
          console.log('Calling DALL-E 3 API...');
          const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: "dall-e-3",
              prompt: prompt,
              n: 1,
              size: "1792x1024", // 16:9 aspect ratio
              quality: "standard",
              style: "vivid" // More vibrant and hyper-real
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('DALL-E 3 API error:', errorData);
            throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
          }

          const data = await response.json();
          imageUrl = data.data[0].url;
          console.log('DALL-E 3 image generated successfully!');
        } catch (apiError) {
          console.error('Failed to generate image with DALL-E 3:', apiError);
          console.log('Falling back to category-based images...');
          // Fall through to fallback logic below
        }
      } else {
        console.log('No OpenAI API key found, using fallback images');
      }

      // Fallback to category-based Unsplash images if DALL-E fails or no API key
      if (!imageUrl) {
        // Multiple images per category for variety when regenerating
        const categoryImages: Record<string, string[]> = {
          'web-development': [
            'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
            'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80'
          ],
          'mobile-development': [
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
            'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
            'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&q=80',
            'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&q=80'
          ],
          'machine-learning': [
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
            'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
            'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&q=80',
            'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&q=80'
          ],
          'artificial-intelligence': [
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
            'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
            'https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?w=800&q=80',
            'https://images.unsplash.com/photo-1676277791608-ac5c30be1b0e?w=800&q=80'
          ],
          'data-science': [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80'
          ],
          'backend': [
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
            'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
            'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'
          ],
          'frontend': [
            'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
            'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=800&q=80',
            'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80'
          ],
          'devops': [
            'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
            'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
            'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80',
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'
          ],
          'blockchain': [
            'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
            'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80',
            'https://images.unsplash.com/photo-1644143379190-08a5f055de1d?w=800&q=80',
            'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80'
          ],
          'cybersecurity': [
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
            'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80'
          ],
          'cloud-computing': [
            'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
            'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80',
            'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80'
          ],
          'iot': [
            'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
            'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
            'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80'
          ],
          'game-development': [
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
            'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
            'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
            'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&q=80'
          ]
        };

        // Default fallback images
        const defaultImages = [
          'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
          'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&q=80',
          'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80'
        ];

        // Helper function to get random image from array
        const getRandomImage = (images: string[]) => {
          return images[Math.floor(Math.random() * images.length)];
        };

        if (imageKeyword.trim()) {
          const keyword = imageKeyword.toLowerCase();
          const matchedCategory = Object.keys(categoryImages).find(cat =>
            keyword.includes(cat.replace('-', ' ')) || cat.replace('-', ' ').includes(keyword)
          );

          if (matchedCategory) {
            imageUrl = getRandomImage(categoryImages[matchedCategory]);
          } else if (formData.categories[0] && categoryImages[formData.categories[0]]) {
            imageUrl = getRandomImage(categoryImages[formData.categories[0]]);
          } else {
            imageUrl = getRandomImage(defaultImages);
          }
        } else {
          if (formData.categories[0] && categoryImages[formData.categories[0]]) {
            imageUrl = getRandomImage(categoryImages[formData.categories[0]]);
          } else {
            imageUrl = getRandomImage(defaultImages);
          }
        }
      }

      setImagePreviewUrl(imageUrl);

      console.log('Image generated successfully');
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setGeneratingImage(false);
    }
  };

  // Auto-generate image when title changes (with debounce)
  useEffect(() => {
    if (formData.title.length >= 5 && formData.categories.length > 0) {
      const timer = setTimeout(() => {
        handleGenerateImage();
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timer);
    }
  }, [formData.title, formData.categories]);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      setSuccessMessage('Please log in to create a project');
      setShowSuccessModal(true);
      setShowNewProjectModal(false);
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await apiFetch('/projects', {
        method: 'POST',
        body: {
          ...formData,
          thumbnail: imagePreviewUrl || undefined
        }
      });

      console.log('Project created:', response);

      // Reset form
      setFormData({
        title: '',
        description: '',
        githubUrl: '',
        ownerName: '',
        tags: [],
        categories: [],
        members: 1,
        openPositions: 0
      });
      setImagePreviewUrl('');
      setGeneratedImageFile(null);
      setShowNewProjectModal(false);

      // Refresh projects list to include new project
      const githubProjects = await githubService.fetchProjects(category, 30);

      // Fetch updated user projects
      let userProjects: Project[] = [];
      try {
        const userProjectsResponse = await apiFetch('/projects', { method: 'GET' });

        // Backend returns array directly
        let backendProjects = [];
        if (Array.isArray(userProjectsResponse)) {
          backendProjects = userProjectsResponse;
        } else if (userProjectsResponse.projects && Array.isArray(userProjectsResponse.projects)) {
          backendProjects = userProjectsResponse.projects;
        }

        if (backendProjects.length > 0) {
          userProjects = backendProjects.map(mapBackendProject);
        }
      } catch (err) {
        console.warn('Could not fetch user projects after creation:', err);
      }

      const allProjects = [...userProjects, ...githubProjects];
      setProjects(allProjects);
      console.log('Projects refreshed, total:', allProjects.length);

      setSuccessMessage('Project created successfully! Your project is now visible to others.');
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Failed to create project:', err);

      // Handle specific error cases
      if (err.message?.includes('No token') || err.message?.includes('Unauthorized')) {
        setSuccessMessage('Please log in to create a project');
        setShowSuccessModal(true);
        setShowNewProjectModal(false);
      } else if (err.errors && Array.isArray(err.errors)) {
        // Show validation errors from backend
        setSuccessMessage('Validation errors:\n' + err.errors.join('\n'));
        setShowSuccessModal(true);
      } else {
        setSuccessMessage(err.message || 'Failed to create project. Please try again.');
        setShowSuccessModal(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle opening modal with auth check
  const handleOpenModal = () => {
    if (!user) {
      setSuccessMessage('Please log in to create a project');
      setShowSuccessModal(true);
      return;
    }
    setShowNewProjectModal(true);
  };

  return <div className="w-100 min-vh-100">
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
          <button onClick={handleOpenModal} className="btn btn-primary d-flex align-items-center">
            <PlusIcon size={18} className="me-2" /> New Project
          </button>
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
          {currentProjects.length > 0 ? currentProjects.map((project: Project) => <div key={project.id} className="col-md-6 col-lg-4">
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

      {/* Pagination Controls */}
      {!loading && !error && filteredProjects.length > 0 && (
        <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
          >
            &lt;
          </button>

          <span className="fw-medium text-muted">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
          >
            &gt;
          </button>
        </div>
      )}
    </div>

    {/* New Project Modal */}
    {showNewProjectModal && (
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Create New Project</h5>
              <button type="button" className="btn-close" onClick={() => setShowNewProjectModal(false)}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Title */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="My Awesome Project"
                    maxLength={100}
                  />
                  {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                </div>

                {/* Custom Keyword for AI Image Generation */}
                <div className="mb-3">
                  <label className="form-label fw-medium">AI Image Keyword (Optional)</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={imageKeyword}
                      onChange={(e) => setImageKeyword(e.target.value)}
                      placeholder="e.g., blockchain, cloud, gaming, AI..."
                      maxLength={50}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleGenerateImage}
                      disabled={generatingImage || (!imageKeyword.trim() && formData.title.length < 3)}
                    >
                      {generatingImage ? 'Generating...' : '🎨 Generate Image'}
                    </button>
                  </div>
                  <small className="text-muted">
                    Enter a keyword to generate a custom AI thumbnail, or leave blank to auto-generate based on title and categories
                  </small>
                </div>

                {/* AI Generated Image Preview */}
                {(imagePreviewUrl || generatingImage) && (
                  <div className="mb-3">
                    <label className="form-label fw-medium">Project Thumbnail</label>
                    <div className="border rounded p-3 bg-light">
                      {generatingImage ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary mb-2" role="status">
                            <span className="visually-hidden">Generating image...</span>
                          </div>
                          <p className="text-muted small mb-0">Generating AI image...</p>
                        </div>
                      ) : (
                        <>
                          <img
                            src={imagePreviewUrl}
                            alt="Generated thumbnail"
                            className="w-100 rounded mb-2"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary w-100"
                            onClick={handleGenerateImage}
                          >
                            🔄 Regenerate Image
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Description *</label>
                  <textarea
                    name="description"
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project..."
                    rows={3}
                    maxLength={500}
                  />
                  <small className="text-muted">{formData.description.length}/500</small>
                  {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                </div>

                {/* GitHub URL */}
                <div className="mb-3">
                  <label className="form-label fw-medium">GitHub Repository URL *</label>
                  <input
                    type="url"
                    name="githubUrl"
                    className={`form-control ${formErrors.githubUrl ? 'is-invalid' : ''}`}
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repository"
                  />
                  {formErrors.githubUrl && <div className="invalid-feedback">{formErrors.githubUrl}</div>}
                </div>

                {/* Project Owner Name */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Project Owner Name *</label>
                  <input
                    type="text"
                    name="ownerName"
                    className={`form-control ${formErrors.ownerName ? 'is-invalid' : ''}`}
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                  <small className="text-muted">Give credit to the project owner/creator</small>
                  {formErrors.ownerName && <div className="invalid-feedback">{formErrors.ownerName}</div>}
                </div>

                {/* Categories */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Categories * (Select at least one)</label>
                  <div className="d-flex flex-wrap gap-2">
                    {categories.filter(c => c.value !== 'all').map(cat => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.value)}
                        className={`btn btn-sm rounded-pill ${formData.categories.includes(cat.value) ? 'btn-primary' : 'btn-light border'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  {formErrors.categories && <small className="text-danger">{formErrors.categories}</small>}
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <label className="form-label fw-medium">Tags (Optional, max 10)</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag..."
                    />
                    <button type="button" className="btn btn-outline-primary" onClick={handleAddTag}>
                      Add
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="badge bg-light text-dark border d-flex align-items-center gap-1">
                        {tag}
                        <XIcon size={14} className="cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                      </span>
                    ))}
                  </div>
                  {formErrors.tags && <small className="text-danger">{formErrors.tags}</small>}
                </div>

                <div className="row">
                  {/* Members */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">Current Members</label>
                    <input
                      type="number"
                      name="members"
                      className="form-control"
                      value={formData.members}
                      onChange={handleInputChange}
                      min={1}
                    />
                  </div>

                  {/* Open Positions */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">Open Positions</label>
                    <input
                      type="number"
                      name="openPositions"
                      className="form-control"
                      value={formData.openPositions}
                      onChange={handleInputChange}
                      min={0}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button type="button" className="btn btn-light" onClick={() => setShowNewProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}

    {/* Success/Error Modal */}
    {
      showSuccessModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {successMessage.includes('success') ? '✓ Success' : 'Notice'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSuccessModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                  {successMessage}
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowSuccessModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  </div >;
};
export default Projects;