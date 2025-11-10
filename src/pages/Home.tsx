import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, UsersIcon, BookIcon, MessageSquareIcon, VideoIcon } from 'lucide-react';
const Home: React.FC = () => {
  return <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connect, Collaborate, Succeed
            </h1>
            <p className="text-xl mb-8">
              Join StudyConnect to find study partners, collaborate on projects,
              and excel in your academic journey.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/about" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors duration-200">
                Learn More
              </Link>
              <Link to="/connections" className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors duration-200">
                Find Connections <ChevronRightIcon size={20} className="ml-2" />
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" alt="Students collaborating" className="rounded-lg shadow-xl" />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How StudyConnect Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <UsersIcon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find and connect with students who share your interests,
                courses, or career goals.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <BookIcon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create or join projects, share resources, and work together on
                assignments.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <MessageSquareIcon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communicate</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Message your connections, discuss projects, and share ideas in
                real-time.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <VideoIcon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Study Together</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join virtual study rooms with video, audio, and collaborative
                whiteboards.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to boost your academic success?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of students already using StudyConnect to find study
            partners, collaborate on projects, and achieve their academic goals.
          </p>
          <Link to="/about" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-medium inline-flex items-center transition-colors duration-200">
            Get Started Today <ChevronRightIcon size={20} className="ml-2" />
          </Link>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student profile" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Computer Science Major
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "StudyConnect helped me find the perfect team for my senior
                project. The collaboration tools made working together seamless,
                even remotely."
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student profile" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Business Administration
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The virtual study rooms are a game-changer. Being able to
                collaborate on the whiteboard while discussing concepts has
                improved my grades significantly."
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student profile" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold">Priya Patel</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Biology Major
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "I connected with students in my same courses, and we've been
                study buddies for two semesters now. StudyConnect made finding
                compatible study partners so easy."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Home;