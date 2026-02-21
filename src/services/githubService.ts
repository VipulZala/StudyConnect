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
    | 'devops'
    | 'blockchain'
    | 'cybersecurity'
    | 'cloud-computing'
    | 'iot'
    | 'game-development';

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
    'devops': ['devops', 'docker', 'kubernetes', 'ci-cd', 'automation', 'cloud'],
    'blockchain': ['blockchain', 'cryptocurrency', 'ethereum', 'smart-contracts', 'web3'],
    'cybersecurity': ['security', 'cybersecurity', 'encryption', 'penetration-testing', 'vulnerability'],
    'cloud-computing': ['cloud', 'aws', 'azure', 'gcp', 'serverless', 'cloud-native'],
    'iot': ['iot', 'internet-of-things', 'embedded', 'arduino', 'raspberry-pi'],
    'game-development': ['game-development', 'unity', 'unreal-engine', 'gamedev', 'gaming']
};

// Fallback images for different categories
const categoryImages: Record<string, string> = {
    'web-development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
    'mobile-development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    'machine-learning': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    'artificial-intelligence': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'data-science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'backend': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    'frontend': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
    'devops': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    'blockchain': 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80',
    'cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    'cloud-computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    'iot': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'game-development': 'https://images.unsplash.com/photo-1552820728-8b83bb6d773f?w=800&q=80',
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

        // Diverse set of 30 distinct project templates with verified unique images
        const templates: (Partial<Project> & { category: ProjectCategory })[] = [
            // Web Development
            {
                title: 'E-Commerce Platform',
                description: 'Full-stack e-commerce solution with Next.js, Stripe integration, and admin dashboard.',
                tags: ['Next.js', 'React', 'Stripe', 'Tailwind'],
                lookingFor: ['Frontend Developer', 'Backend Developer'],
                thumbnail: categoryImages['web-development'],
                category: 'web-development'
            },
            {
                title: 'Real-time Collaboration Tool',
                description: 'Google Docs alternative with real-time editing using WebSockets and Operational Transformation.',
                tags: ['WebSocket', 'Node.js', 'React', 'Redis'],
                lookingFor: ['Full Stack Developer', 'DevOps Engineer'],
                thumbnail: categoryImages['web-development'],
                category: 'web-development'
            },
            {
                title: 'Personal Finance Tracker',
                description: 'Track expenses, visualize budgets, and manage investments with this privacy-first application.',
                tags: ['Vue.js', 'D3.js', 'Firebase', 'PWA'],
                lookingFor: ['Vue Developer', 'Data Visualization Expert'],
                thumbnail: categoryImages['web-development'],
                category: 'web-development'
            },

            // Artificial Intelligence & ML
            {
                title: 'OpenCV Face Recognition',
                description: 'Real-time face detection and recognition system using OpenCV and Deep Learning.',
                tags: ['Python', 'OpenCV', 'Deep Learning', 'Computer Vision'],
                lookingFor: ['Computer Vision Engineer', 'Python Developer'],
                thumbnail: categoryImages['artificial-intelligence'],
                category: 'artificial-intelligence'
            },
            {
                title: 'Sentiment Analysis API',
                description: 'REST API for analyzing text sentiment in social media posts and product reviews.',
                tags: ['Python', 'NLP', 'FastAPI', 'BERT'],
                lookingFor: ['NLP Engineer', 'Backend Developer'],
                thumbnail: categoryImages['machine-learning'],
                category: 'machine-learning'
            },
            {
                title: 'Autonomous Drone Flight',
                description: 'Flight controller software for quadcopters with obstacle avoidance and path planning.',
                tags: ['C++', 'ROS', 'Robotics', 'Embedded'],
                lookingFor: ['Robotics Engineer', 'C++ Developer'],
                thumbnail: categoryImages['iot'],
                category: 'iot'
            },

            // Mobile Development
            {
                title: 'Fitness & Workout Companion',
                description: 'Track workouts, set goals, and share progress. Supports Apple Health and Google Fit.',
                tags: ['Flutter', 'Dart', 'Firebase', 'HealthKit'],
                lookingFor: ['Flutter Developer', 'UI Designer'],
                thumbnail: categoryImages['mobile-development'],
                category: 'mobile-development'
            },
            {
                title: 'Augmented Reality Interior Design',
                description: 'Visualize furniture in your home using AR. Built with ARKit and ARCore.',
                tags: ['Unity', 'C#', 'AR', 'Mobile'],
                lookingFor: ['Unity Developer', '3D Artist'],
                thumbnail: categoryImages['mobile-development'],
                category: 'mobile-development'
            },
            {
                title: 'Podcast Player & Discovery',
                description: 'Open source podcast player with smart recommendations and offline playback.',
                tags: ['Kotlin', 'Android', 'Audio', 'Material Design'],
                lookingFor: ['Android Developer', 'UX Designer'],
                thumbnail: categoryImages['mobile-development'],
                category: 'mobile-development'
            },

            // DevOps & Cloud
            {
                title: 'Kubernetes Cluster Monitor',
                description: 'Lightweight dashboard for monitoring Kubernetes cluster health and resource usage.',
                tags: ['Go', 'Kubernetes', 'Prometheus', 'Grafana'],
                lookingFor: ['Go Developer', 'DevOps Engineer'],
                thumbnail: categoryImages['devops'],
                category: 'devops'
            },
            {
                title: 'Serverless Deployment CLI',
                description: 'CLI tool to easily deploy static sites and functions to AWS Lambda and S3.',
                tags: ['Node.js', 'AWS', 'Serverless', 'CLI'],
                lookingFor: ['Node.js Developer', 'Cloud Architect'],
                thumbnail: categoryImages['cloud-computing'],
                category: 'cloud-computing'
            },

            // Blockchain
            {
                title: 'DeFi Lending Protocol',
                description: 'Decentralized lending and borrowing platform on Ethereum with flash loan support.',
                tags: ['Solidity', 'Ethereum', 'Web3.js', 'DeFi'],
                lookingFor: ['Smart Contract Developer', 'Blockchain Auditor'],
                thumbnail: categoryImages['blockchain'],
                category: 'blockchain'
            },
            {
                title: 'NFT Marketplace Template',
                description: 'Whitelabel NFT marketplace supporting ERC-721 and ERC-1155 standards.',
                tags: ['Solidity', 'IPFS', 'Next.js', 'Hardhat'],
                lookingFor: ['Blockchain Developer', 'Frontend Developer'],
                thumbnail: categoryImages['blockchain'],
                category: 'blockchain'
            },

            // Data Science
            {
                title: 'COVID-19 Global Tracker',
                description: 'Interactive dashboard tracking global pandemic statistics with predictive modeling.',
                tags: ['Python', 'Pandas', 'Plotly', 'Streamlit'],
                lookingFor: ['Data Scientist', 'Python Developer'],
                thumbnail: categoryImages['data-science'],
                category: 'data-science'
            },
            {
                title: 'Stock Market Predictor',
                description: 'LSTM-based neural network model for predicting stock price movements.',
                tags: ['Python', 'TensorFlow', 'Keras', 'Finance'],
                lookingFor: ['ML Engineer', 'Quantitative Analyst'],
                thumbnail: categoryImages['data-science'],
                category: 'data-science'
            },

            // Cybersecurity
            {
                title: 'Network Traffic Analyzer',
                description: 'Packet sniffer and protocol analyzer for identifying network vulnerabilities.',
                tags: ['Rust', 'Networking', 'Security', 'Wireshark'],
                lookingFor: ['Rust Developer', 'Security Analyst'],
                thumbnail: categoryImages['cybersecurity'],
                category: 'cybersecurity'
            },
            {
                title: 'Encrypted Password Manager',
                description: 'Zero-knowledge password manager with cross-device sync and biometric unlock.',
                tags: ['Electron', 'React', 'Cryptography', 'Security'],
                lookingFor: ['Security Engineer', 'Full Stack Developer'],
                thumbnail: categoryImages['cybersecurity'],
                category: 'cybersecurity'
            },

            // IoT
            {
                title: 'Smart Home Hub',
                description: 'Central hub for connecting Zigbee, Z-Wave, and WiFi smart home devices.',
                tags: ['Python', 'IoT', 'Zigbee', 'Home Assistant'],
                lookingFor: ['IoT Developer', 'Python Developer'],
                thumbnail: categoryImages['iot'],
                category: 'iot'
            },
            {
                title: 'Arduino Weather Station',
                description: 'DIY weather station measuring temperature, humidity, and pressure with cloud logging.',
                tags: ['C++', 'Arduino', 'ESP32', 'Sensors'],
                lookingFor: ['Embedded Developer', 'Hardware Engineer'],
                thumbnail: categoryImages['iot'],
                category: 'iot'
            },
            // Game Development
            {
                title: 'OpenRPG Engine',
                description: '2D RPG game engine with tilemap editor and scripting support.',
                tags: ['C++', 'SDL2', 'Lua', 'Game Engine'],
                lookingFor: ['Game Engine Developer', 'C++ Developer'],
                thumbnail: categoryImages['game-development'],
                category: 'game-development'
            },
            {
                title: 'Space Shooter Concept',
                description: 'Generative space shooter with endless levels and boss fights.',
                tags: ['Unity', 'C#', 'Procedural Generation', 'Gaming'],
                lookingFor: ['Unity Developer', 'Game Designer'],
                thumbnail: categoryImages['game-development'],
                category: 'game-development'
            },

            // Backend
            {
                title: 'High-Performance GraphQL Gateway',
                description: 'Federated GraphQL gateway written in Rust for microservices architecture.',
                tags: ['Rust', 'GraphQL', 'Microservices', 'Performance'],
                lookingFor: ['Rust Developer', 'Backend Architect'],
                thumbnail: categoryImages['backend'],
                category: 'backend'
            },
            {
                title: 'Distributed Job Queue',
                description: 'Reliable background job processing system backed by Redis and PostgreSQL.',
                tags: ['Go', 'Redis', 'PostgreSQL', 'System Design'],
                lookingFor: ['Go Developer', 'Database Engineer'],
                thumbnail: categoryImages['backend'],
                category: 'backend'
            },

            // Extra varied projects
            {
                title: 'Video Streaming Server',
                description: 'Scalable video streaming server supporting HLS and DASH protocols.',
                tags: ['Go', 'FFmpeg', 'HLS', 'Streaming'],
                lookingFor: ['Go Developer', 'Video Engineer'],
                thumbnail: categoryImages['backend'],
                category: 'backend'
            },
            {
                title: 'Social Media Dashboard',
                description: 'Unified dashboard for managing multiple social media accounts.',
                tags: ['React', 'Redux', 'API', 'Social'],
                lookingFor: ['Frontend Developer', 'API Specialist'],
                thumbnail: categoryImages['frontend'],
                category: 'frontend'
            },
            {
                title: '3D Model Viewer',
                description: 'Web-based 3D model viewer supporting GLTF and OBJ formats.',
                tags: ['Three.js', 'WebGL', 'JavaScript', '3D'],
                lookingFor: ['Graphics Programmer', 'Frontend Developer'],
                thumbnail: categoryImages['game-development'],
                category: 'game-development'
            },
            {
                title: 'Language Learning App',
                description: 'Gamified language learning application with speech recognition.',
                tags: ['React Native', 'Speech API', 'Education', 'Mobile'],
                lookingFor: ['Mobile Developer', 'Linguist'],
                thumbnail: categoryImages['mobile-development'],
                category: 'mobile-development'
            },
            {
                title: 'Recipe & Meal Planner',
                description: 'Smart recipe manager that generates shopping lists and meal plans.',
                tags: ['Vue.js', 'Node.js', 'Food', 'Lifestyle'],
                lookingFor: ['Full Stack Developer', 'Nutritionist'],
                thumbnail: categoryImages['web-development'],
                category: 'web-development'
            },
            {
                title: 'Travel Itinerary Builder',
                description: 'Collaborative tool for planning trips and sharing travel itineraries.',
                tags: ['React', 'Maps API', 'Travel', 'Social'],
                lookingFor: ['Frontend Developer', 'UX Designer'],
                thumbnail: categoryImages['web-development'],
                category: 'web-development'
            }
        ];

        let filteredTemplates = templates;
        if (category !== 'all') {
            filteredTemplates = templates.filter(t => t.category === category);
        }

        const projects: Project[] = [];
        const templateCount = filteredTemplates.length;

        if (templateCount === 0 && category !== 'all') {
            console.warn(`No templates found for category ${category}`);
        }

        // Show only unique projects available for this category
        const count = Math.min(limit, templateCount);

        const creatorNames = [
            'Alex Johnson', 'Sarah Lee', 'Mike Chen', 'Emily Davis', 'Chris Wilson',
            'Jessica Taylor', 'David Brown', 'Laura Martin', 'Daniel White', 'Rachel Green',
            'James Anderson', 'Sophia Martinez', 'Robert Clark', 'Olivia Lewis', 'William Hall',
            'Ethan King', 'Ava Scott', 'Mason Young', 'Isabella Adams', 'Lucas Baker',
            'Mia Nelson', 'Benjamin Carter', 'Charlotte Mitchell', 'Henry Perez', 'Amelia Roberts',
            'Alexander Turner', 'Harper Phillips', 'Sebastian Campbell', 'Evelyn Parker', 'Jack Evans'
        ];

        for (let i = 0; i < count; i++) {
            const template = filteredTemplates[i];

            projects.push({
                id: i + 1,
                title: template.title || 'Untitled Project',
                description: template.description || 'Open source project',
                tags: template.tags || ['Open Source'],
                members: 5 + (i * 3) % 40,
                openPositions: 1 + (i * 2) % 10,
                lookingFor: template.lookingFor || ['Developer'],
                githubUrl: `https://github.com/topics/${(template.tags?.[0] || 'opensource').toLowerCase().replace('.', '')}?q=${encodeURIComponent(template.title || 'project')}`,
                createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
                thumbnail: template.thumbnail || categoryImages['default'],
                creator: {
                    id: (i % 30) + 1,
                    name: creatorNames[i % creatorNames.length],
                    avatar: `https://avatars.githubusercontent.com/u/${(i % 30) + 1}?v=4`
                }
            });
        }

        return projects;
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
    }
}

export const githubService = new GitHubService();
