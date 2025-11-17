import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserIcon, BriefcaseIcon, BookOpenIcon, MessageSquareIcon, UserPlusIcon, CalendarIcon } from 'lucide-react';
import { supabase, Profile, Skill, Interest, Course, Project } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const ProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'courses'>('overview');

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      const [skillsRes, interestsRes, coursesRes, projectsRes, activitiesRes] = await Promise.all([
        supabase.from('skills').select('*').eq('user_id', id),
        supabase.from('interests').select('*').eq('user_id', id),
        supabase.from('courses').select('*').eq('user_id', id),
        supabase
          .from('projects')
          .select(`
            *,
            project_tags(tag),
            project_members(id)
          `)
          .eq('creator_id', id),
        supabase.from('activities').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(10)
      ]);

      setSkills(skillsRes.data || []);
      setInterests(interestsRes.data || []);
      setCourses(coursesRes.data || []);
      setProjects(projectsRes.data || []);
      setActivities(activitiesRes.data || []);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <p className="text-gray-600 dark:text-gray-400">The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className={`h-48 md:h-64 w-full bg-cover bg-center ${!profile.cover_image_url ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : ''}`} style={profile.cover_image_url ? { backgroundImage: `url(${profile.cover_image_url})` } : {}}>
        <div className="h-full w-full bg-black bg-opacity-30"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end">
            <div className="ml-4 md:ml-8">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-blue-600">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0 ml-4 md:ml-6 flex-grow">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              {profile.title && <p className="text-gray-600 dark:text-gray-400">{profile.title}</p>}
              <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                {profile.university && (
                  <span className="flex items-center mr-4 mb-2">
                    <BookOpenIcon size={16} className="mr-1" /> {profile.university}
                  </span>
                )}
                {profile.year && (
                  <span className="flex items-center mr-4 mb-2">
                    <UserIcon size={16} className="mr-1" /> {profile.year}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center mb-2">
                    <BriefcaseIcon size={16} className="mr-1" /> {profile.location}
                  </span>
                )}
              </div>
            </div>
            {!isOwnProfile && (
              <div className="mt-4 md:mt-0 ml-4 md:ml-0 flex space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors duration-200">
                  <MessageSquareIcon size={18} className="mr-2" /> Message
                </button>
                <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md font-medium flex items-center transition-colors duration-200">
                  <UserPlusIcon size={18} className="mr-2" /> Connect
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Courses
            </button>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1 space-y-8">
            {profile.bio && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">About</h2>
                <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
              </div>
            )}

            {skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Skills</h2>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{skill.level}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: skill.level === 'Advanced' ? '90%' : skill.level === 'Intermediate' ? '65%' : '40%'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {interests.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span
                      key={interest.id}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <>
                {activities.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex">
                          <div className="mr-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                              {activity.type === 'project' && <BriefcaseIcon size={20} />}
                              {activity.type === 'connection' && <UserIcon size={20} />}
                              {activity.type === 'course' && <BookOpenIcon size={20} />}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-800 dark:text-gray-200">
                              <span className="font-medium">{profile.name}</span> {activity.action}{' '}
                              <span className="font-medium">{activity.target}</span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                              <CalendarIcon size={14} className="mr-1" /> {formatDate(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {projects.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Featured Projects</h2>
                      <button onClick={() => setActiveTab('projects')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        View all
                      </button>
                    </div>
                    <div className="space-y-6">
                      {projects.slice(0, 2).map((project) => (
                        <div key={project.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                          <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.project_tags?.slice(0, 5).map((tagObj: any, index: number) => (
                              <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                                {tagObj.tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="mr-4">
                              {project.project_members?.length || 0} collaborator{project.project_members?.length !== 1 ? 's' : ''}
                            </span>
                            {project.github_url && (
                              <a href={project.github_url} className="text-blue-600 dark:text-blue-400 hover:underline">
                                View on GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {courses.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Current Courses</h2>
                      <button onClick={() => setActiveTab('courses')} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        View all
                      </button>
                    </div>
                    <div className="space-y-4">
                      {courses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                              <BookOpenIcon size={20} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold">{course.code}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{course.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'projects' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">All Projects</h2>
                {projects.length > 0 ? (
                  <div className="space-y-8">
                    {projects.map((project) => (
                      <div key={project.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-8 last:pb-0">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.project_tags?.map((tagObj: any, index: number) => (
                            <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                              {tagObj.tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="mr-4">
                            {project.project_members?.length || 0} collaborator{project.project_members?.length !== 1 ? 's' : ''}
                          </span>
                          {project.github_url && (
                            <a href={project.github_url} className="text-blue-600 dark:text-blue-400 hover:underline">
                              View on GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No projects yet.</p>
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">All Courses</h2>
                {courses.length > 0 ? (
                  <div className="space-y-6">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-start border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                            <BookOpenIcon size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold">{course.code}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{course.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No courses yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
