import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
const About: React.FC = () => {
  return <div className="w-100">
    {/* Hero Section */}
    <section className="bg-primary text-white">
      <div className="container py-5 text-center">
        <h1 className="display-4 fw-bold mb-4">
          About StudyConnect
        </h1>
        <p className="lead mx-auto" style={{ maxWidth: '768px' }}>
          We're on a mission to transform how students collaborate, learn, and
          succeed together.
        </p>
      </div>
    </section>
    {/* Our Story Section */}
    <section className="py-5 bg-white">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-5 mb-md-0 pe-md-5">
            <h2 className="h2 fw-bold mb-4">Our Story</h2>
            <p className="text-muted mb-3 text-justify">
              StudyConnect was founded in 2023 by a group of graduate students
              who experienced firsthand the challenges of finding compatible
              study partners and project collaborators.
            </p>
            <p className="text-muted mb-3 text-justify">
              Our core mission is to simplify the learning process. By focusing on mutual support, high-quality knowledge sharing, and accessibility, we provide a service that genuinely impacts your academic success. Every function is designed to efficiently bring you closer to your educational achievements.            </p>
            <p className="text-muted text-justify">
              We are a dedicated team of developers and educators passionate about effective learning and technology. We are committed to constantly evolving and improving our platform to offer practical, reliable solutions for all learners. We value your trust and encourage you to be an active part of our growing community</p>
          </div>
          <div className="col-md-6">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Team collaboration" className="img-fluid rounded-3 shadow-lg" />
          </div>
        </div>
      </div>
    </section>
    {/* Mission & Values Section */}
    <section className="py-5 bg-light">
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          Our Mission & Values
        </h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h5 fw-semibold mb-3">Collaboration</h3>
                <p className="text-muted mb-0 text-justify">
                  We believe that learning is enhanced through meaningful
                  collaboration. Our platform is designed to facilitate
                  connections that lead to deeper understanding and better
                  outcomes.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h5 fw-semibold mb-3">Accessibility</h3>
                <p className="text-muted mb-0 text-justify">
                  Education should be accessible to everyone. We're committed to
                  creating tools that break down barriers and create opportunities
                  for all students to connect and learn together.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h5 fw-semibold mb-3">Innovation</h3>
                <p className="text-muted mb-0 text-justify">
                  We continuously evolve our platform based on student feedback
                  and emerging technologies to provide the most effective
                  collaboration tools for academic success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Features Section */}
    <section className="py-5 bg-white">
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          What Makes Us Different
        </h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="d-flex">
              <div className="flex-shrink-0 mt-1">
                <CheckIcon size={24} className="text-success" />
              </div>
              <div className="ms-3">
                <h3 className="h5 fw-semibold mb-2">
                  Smart Matching Algorithm
                </h3>
                <p className="text-muted">
                  Our platform uses advanced algorithms to connect you with
                  students who complement your learning style, share your
                  academic interests, and can help you grow.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex">
              <div className="flex-shrink-0 mt-1">
                <CheckIcon size={24} className="text-success" />
              </div>
              <div className="ms-3">
                <h3 className="h5 fw-semibold mb-2">
                  Integrated Project Tools
                </h3>
                <p className="text-muted">
                  Seamlessly create and manage projects with built-in task
                  boards, GitHub integration, and collaborative document
                  editing.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex">
              <div className="flex-shrink-0 mt-1">
                <CheckIcon size={24} className="text-success" />
              </div>
              <div className="ms-3">
                <h3 className="h5 fw-semibold mb-2">
                  Virtual Study Rooms
                </h3>
                <p className="text-muted">
                  Our state-of-the-art virtual study rooms include video
                  conferencing, screen sharing, and interactive whiteboards to
                  make remote collaboration feel like you're in the same room.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex">
              <div className="flex-shrink-0 mt-1">
                <CheckIcon size={24} className="text-success" />
              </div>
              <div className="ms-3">
                <h3 className="h5 fw-semibold mb-2">
                  Skills Development
                </h3>
                <p className="text-muted">
                  Track your progress, showcase your skills, and build a
                  portfolio of projects that demonstrates your abilities to
                  future employers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Team Section */}
    <section className="py-5 bg-light">
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          Meet Our Team
        </h2>
        <div className="row g-4 justify-content-center">
          <div className="col-md-6 col-lg-6">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Team member" className="rounded-circle mx-auto mb-3 object-fit-cover" style={{ width: '128px', height: '128px' }} />
              <h3 className="h5 fw-semibold mb-1">Vipul Zala</h3>
              <p className="text-muted mb-2">
                Co-Founder
              </p>
              <p className="small text-muted mb-0">
                Specializes in Back-End Architecture and System Engineering, maintaining the reliability and robust functionality of the application.</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-6">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Team member" className="rounded-circle mx-auto mb-3 object-fit-cover" style={{ width: '128px', height: '128px' }} />
              <h3 className="h5 fw-semibold mb-1">Shubham Gawade</h3>
              <p className="text-muted mb-2">
                Co-Founder
              </p>
              <p className="small text-muted mb-0">
                Focuses on Front-End Development and User Experience design, ensuring the platform is intuitive and accessible.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* CTA Section */}
    <section className="py-5 bg-primary text-white">
      <div className="container py-5 text-center">
        <h2 className="h2 fw-bold mb-4">
          Join the StudyConnect Community
        </h2>
        <p className="lead mb-5 mx-auto" style={{ maxWidth: '768px' }}>
          Connect with fellow students, collaborate on projects, and take your
          academic journey to the next level.
        </p>
        <Link to="/contact" className="btn btn-light btn-lg fw-medium d-inline-flex align-items-center">
          Get in Touch <ChevronRightIcon size={20} className="ms-2" />
        </Link>
      </div>
    </section>
  </div>;
};
export default About;