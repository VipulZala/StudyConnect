import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
const About: React.FC = () => {
  return <div className="w-full">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About StudyConnect
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to transform how students collaborate, learn, and
            succeed together.
          </p>
        </div>
      </section>
      {/* Our Story Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                StudyConnect was founded in 2023 by a group of graduate students
                who experienced firsthand the challenges of finding compatible
                study partners and project collaborators.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                What started as a simple tool to connect students in the same
               
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Today, StudyConnect serves thousands of students across hundreds
                of educational institutions, helping them connect, collaborate,
                and succeed together.
              </p>
            </div>
            <div className="md:w-1/2">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Team collaboration" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>
      {/* Mission & Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Mission & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We believe that learning is enhanced through meaningful
                collaboration. Our platform is designed to facilitate
                connections that lead to deeper understanding and better
                outcomes.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Accessibility</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Education should be accessible to everyone. We're committed to
                creating tools that break down barriers and create opportunities
                for all students to connect and learn together.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We continuously evolve our platform based on student feedback
                and emerging technologies to provide the most effective
                collaboration tools for academic success.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckIcon size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">
                  Smart Matching Algorithm
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our platform uses advanced algorithms to connect you with
                  students who complement your learning style, share your
                  academic interests, and can help you grow.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckIcon size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">
                  Integrated Project Tools
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Seamlessly create and manage projects with built-in task
                  boards, GitHub integration, and collaborative document
                  editing.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckIcon size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">
                  Virtual Study Rooms
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our state-of-the-art virtual study rooms include video
                  conferencing, screen sharing, and interactive whiteboards to
                  make remote collaboration feel like you're in the same room.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <CheckIcon size={24} className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">
                  Skills Development
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Track your progress, showcase your skills, and build a
                  portfolio of projects that demonstrates your abilities to
                  future employers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Team member" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold mb-1">David Wilson</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Co-Founder & CEO
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Former education technology researcher with a passion for
                collaborative learning environments.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Team member" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold mb-1">Sophia Chen</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Co-Founder & CTO
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Computer science PhD with expertise in educational technology
                and peer-to-peer learning systems.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Team member" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold mb-1">Marcus Johnson</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Head of Product
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Former educator with a focus on designing intuitive user
                experiences for educational tools.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Team member" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold mb-1">Elena Rodriguez</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Community Director
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Specializes in building engaged learning communities and
                fostering meaningful student connections.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join the StudyConnect Community
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect with fellow students, collaborate on projects, and take your
            academic journey to the next level.
          </p>
          <Link to="/contact" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-md font-medium inline-flex items-center transition-colors duration-200">
            Get in Touch <ChevronRightIcon size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>;
};
export default About;