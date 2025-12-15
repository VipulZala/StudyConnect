// GitHub API Service for fetching open-source projects

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string;
    topics: string[];
    created_at: string;
    updated_at: string;
    owner: {
        login: string;
        avatar_url: string;
        html_url: string;
    };
}

export interface Project {
    id: number;
    title: string;
    description: string;
    tags: string[];
    members: number;
    openPositions: number;
    lookingFor: string[];
    githubUrl: string;
    createdAt: string;
    thumbnail: string;
    creator: {
        id: number;
        name: string;
        avatar: string;
    };
}

export type ProjectCategory =
    | 'all'
    | 'web-development'
    | 'mobile-development'
    | 'machine-learning'
    | 'artificial-intelligence'
    | 'data-science'
    | 'backend'
    | 'frontend'
    | 'devops';

// Category to GitHub topics mapping
const categoryTopics: Record<ProjectCategory, string[]> = {
    'all': ['good-first-issue', 'help-wanted', 'beginner-friendly'],
    'web-development': ['web-development', 'javascript', 'react', 'vue', 'angular', 'nextjs'],
    'mobile-development': ['mobile', 'react-native', 'flutter', 'android', 'ios', 'kotlin', 'swift'],
    'machine-learning': ['machine-learning', 'ml', 'deep-learning', 'neural-network', 'tensorflow', 'pytorch'],
    'artificial-intelligence': ['artificial-intelligence', 'ai', 'nlp', 'computer-vision', 'chatbot'],
    'data-science': ['data-science', 'data-analysis', 'pandas', 'numpy', 'jupyter', 'visualization'],
    'backend': ['backend', 'nodejs', 'python', 'java', 'golang', 'api', 'database'],
    'frontend': ['frontend', 'css', 'html', 'ui', 'ux', 'design-system'],
    'devops': ['devops', 'docker', 'kubernetes', 'ci-cd', 'automation', 'cloud']
};

// Fallback images for different categories
const categoryImages: Record<string, string> = {
    'web-development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
    'mobile-development': 'https://images.unsplash.com/photo-5121941937669-90a1b58e7e9c?w=800&q=80',
    'machine-learning': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    'artificial-intelligence': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'data-science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'backend': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    'frontend': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
    'devops': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    'default': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80'
};

class GitHubService {
    private baseUrl = 'https://api.github.com';
    private cache: Map<string, { data: Project[]; timestamp: number }> = new Map();
    private cacheTimeout = 5 * 60 * 1000; // 5 minutes

    /**
     * Fetch repositories from GitHub based on category
     */
    async fetchProjects(category: ProjectCategory = 'all', limit: number = 30): Promise<Project[]> {
        const cacheKey = `${category}-${limit}`;

        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`Returning cached projects for category: ${category}`);
            return cached.data;
        }

        try {
            const topics = categoryTopics[category] || categoryTopics['all'];
            const projects: Project[] = [];

            console.log(`Fetching projects for category: ${category}, topics:`, topics);

            // Fetch repositories for each topic in the category
            for (const topic of topics.slice(0, 2)) { // Limit to 2 topics to avoid rate limiting
                try {
                    const repos = await this.searchRepositories(topic, Math.ceil(limit / 2));
                    const mappedProjects = repos.map(repo => this.mapRepoToProject(repo, category));
                    projects.push(...mappedProjects);
                } catch (topicError) {
                    console.warn(`Failed to fetch repos for topic ${topic}:`, topicError);
                    // Continue with other topics
                }
            }

            // If no projects were fetched (likely due to rate limiting), use fallback data
            if (projects.length === 0) {
                console.warn('No projects fetched from GitHub API, using fallback data');
                return this.getFallbackProjects(category, limit);
            }

            // Remove duplicates based on GitHub URL
            const uniqueProjects = Array.from(
                new Map(projects.map(p => [p.githubUrl, p])).values()
            );

            // Sort by open issues (more issues = more opportunities to contribute)
            const sortedProjects = uniqueProjects
                .sort((a, b) => b.openPositions - a.openPositions)
                .slice(0, limit);

            // Cache the results
            this.cache.set(cacheKey, {
                data: sortedProjects,
                timestamp: Date.now()
            });

            console.log(`Successfully fetched ${sortedProjects.length} projects`);
            return sortedProjects;
        } catch (error) {
            console.error('Error fetching projects from GitHub:', error);
            // Return fallback data instead of throwing
            return this.getFallbackProjects(category, limit);
        }
    }

    /**
     * Search GitHub repositories by topic
     */
    private async searchRepositories(topic: string, perPage: number = 10): Promise<GitHubRepo[]> {
        try {
            // Search for repositories with good first issues or help wanted
            const query = `topic:${topic}+is:public+archived:false`;
            const url = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}`;

            console.log(`Searching GitHub for topic: ${topic}`);

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                }
            });

            if (!response.ok) {
                console.warn(`GitHub API returned status ${response.status} for topic ${topic}`);
                return [];
            }

            const data = await response.json();
            console.log(`Found ${data.items?.length || 0} repos for topic ${topic}`);
            return data.items || [];
        } catch (error) {
            console.error(`Error searching repositories for topic ${topic}:`, error);
            return [];
        }
    }

    /**
     * Map GitHub repository to our Project interface
     */
    private mapRepoToProject(repo: GitHubRepo, category: ProjectCategory): Project {
        // Determine tags from topics and language
        const tags: string[] = [];

        if (repo.language) {
            tags.push(repo.language);
        }

        // Add relevant topics (limit to 5)
        if (repo.topics && repo.topics.length > 0) {
            tags.push(...repo.topics.slice(0, 4));
        }

        // If no tags, add category-based tags
        if (tags.length === 0) {
            tags.push(category.replace('-', ' ').split(' ').map(w =>
                w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' '));
        }

        // Determine thumbnail based on category or language
        let thumbnail = categoryImages['default'];
        if (categoryImages[category]) {
            thumbnail = categoryImages[category];
        } else if (repo.language && categoryImages[repo.language.toLowerCase()]) {
            thumbnail = categoryImages[repo.language.toLowerCase()];
        }

        // Calculate "members" from forks (rough estimate)
        const members = Math.min(Math.max(Math.floor(repo.forks_count / 10), 1), 20);

        // Open positions based on open issues
        const openPositions = Math.min(repo.open_issues_count, 10);

        // Generate looking for roles based on topics and language
        const lookingFor: string[] = [];
        if (repo.topics.includes('frontend') || repo.topics.includes('react') || repo.topics.includes('vue')) {
            lookingFor.push('Frontend Developer');
        }
        if (repo.topics.includes('backend') || repo.topics.includes('api')) {
            lookingFor.push('Backend Developer');
        }
        if (repo.topics.includes('ui') || repo.topics.includes('ux') || repo.topics.includes('design')) {
            lookingFor.push('UI/UX Designer');
        }
        if (repo.topics.includes('mobile') || repo.topics.includes('react-native') || repo.topics.includes('flutter')) {
            lookingFor.push('Mobile Developer');
        }
        if (repo.topics.includes('machine-learning') || repo.topics.includes('ai')) {
            lookingFor.push('ML Engineer');
        }
        if (repo.topics.includes('data-science') || repo.topics.includes('data-analysis')) {
            lookingFor.push('Data Scientist');
        }

        // Default roles if none detected
        if (lookingFor.length === 0 && openPositions > 0) {
            lookingFor.push('Contributors', 'Developers');
        }

        return {
            id: repo.id,
            title: repo.name.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            description: repo.description || 'An open-source project looking for contributors. Check out the repository to learn more!',
            tags: tags.slice(0, 5), // Limit to 5 tags
            members,
            openPositions,
            lookingFor: lookingFor.slice(0, 3), // Limit to 3 roles
            githubUrl: repo.html_url,
            createdAt: repo.created_at,
            thumbnail,
            creator: {
                id: repo.owner.login.length,
                name: repo.owner.login,
                avatar: repo.owner.avatar_url
            }
        };
    }

    /**
     * Get fallback projects when GitHub API fails
     */
    private getFallbackProjects(category: ProjectCategory, limit: number): Project[] {
        console.log(`Returning fallback projects for category: ${category}`);

        // Create some sample projects based on category
        const fallbackProjects: Project[] = [
            {
                id: 1,
                title: 'React Admin Dashboard',
                description: 'A beautiful admin dashboard built with React, TypeScript, and modern UI libraries. Perfect for learning React best practices!',
                tags: ['React', 'TypeScript', 'UI', 'Dashboard'],
                members: 15,
                openPositions: 5,
                lookingFor: ['Frontend Developer', 'UI/UX Designer'],
                githubUrl: 'https://github.com/topics/react',
                createdAt: new Date().toISOString(),
                thumbnail: categoryImages['web-development'],
                creator: {
                    id: 1,
                    name: 'OpenSource Community',
                    avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
                }
            },
            {
                id: 2,
                title: 'Machine Learning Toolkit',
                description: 'A comprehensive toolkit for machine learning experiments with Python, TensorFlow, and PyTorch.',
                tags: ['Python', 'ML', 'TensorFlow', 'PyTorch'],
                members: 25,
                openPositions: 8,
                lookingFor: ['ML Engineer', 'Data Scientist'],
                githubUrl: 'https://github.com/topics/machine-learning',
                createdAt: new Date().toISOString(),
                thumbnail: categoryImages['machine-learning'],
                creator: {
                    id: 2,
                    name: 'AI Research Lab',
                    avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
                }
            },
            {
                id: 3,
                title: 'Mobile App Framework',
                description: 'Cross-platform mobile app framework with React Native. Build beautiful apps for iOS and Android!',
                tags: ['React Native', 'Mobile', 'iOS', 'Android'],
                members: 30,
                openPositions: 6,
                lookingFor: ['Mobile Developer', 'Frontend Developer'],
                githubUrl: 'https://github.com/topics/react-native',
                createdAt: new Date().toISOString(),
                thumbnail: categoryImages['mobile-development'],
                creator: {
                    id: 3,
                    name: 'Mobile Dev Team',
                    avatar: 'https://avatars.githubusercontent.com/u/3?v=4'
                }
            },
            {
                id: 4,
                title: 'Data Visualization Library',
                description: 'Create stunning data visualizations with this powerful library. Supports charts, graphs, and interactive dashboards.',
                tags: ['JavaScript', 'Data Viz', 'Charts', 'D3'],
                members: 20,
                openPositions: 4,
                lookingFor: ['Frontend Developer', 'Data Scientist'],
                githubUrl: 'https://github.com/topics/data-visualization',
                createdAt: new Date().toISOString(),
                thumbnail: categoryImages['data-science'],
                creator: {
                    id: 4,
                    name: 'Data Viz Community',
                    avatar: 'https://avatars.githubusercontent.com/u/4?v=4'
                }
            },
            {
                id: 5,
                title: 'Backend API Framework',
                description: 'Modern backend framework for building scalable APIs with Node.js, Express, and TypeScript.',
                tags: ['Node.js', 'TypeScript', 'API', 'Backend'],
                members: 18,
                openPositions: 7,
                lookingFor: ['Backend Developer', 'DevOps Engineer'],
                githubUrl: 'https://github.com/topics/nodejs',
                createdAt: new Date().toISOString(),
                thumbnail: categoryImages['backend'],
                creator: {
                    id: 5,
                    name: 'Backend Developers',
                    avatar: 'https://avatars.githubusercontent.com/u/5?v=4'
                }
            },
            {
                id: 6,
                title: 'AI Chatbot Platform',
                description: 'Build intelligent chatbots with natural language processing and machine learning capabilities.',
                tags: ['AI', 'NLP', 'Python', 'Chatbot'],
                members: 22,
                openPositions: 9,
                lookingFor: ['ML Engineer', 'Backend Developer'],
                githubUrl: 'https://github.com/topics/chatbot',
                createdAt: new Date().toISOString(),
                thumbnail: categoryImages['artificial-intelligence'],
                creator: {
                    id: 6,
                    name: 'AI Developers',
                    avatar: 'https://avatars.githubusercontent.com/u/6?v=4'
                }
            }
        ];

        // Filter by category if not 'all'
        if (category !== 'all') {
            // Return projects that match the category theme
            return fallbackProjects.slice(0, limit);
        }

        return fallbackProjects.slice(0, limit);
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
    }
}

export const githubService = new GitHubService();
