import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, UsersIcon, BookIcon, MessageSquareIcon, VideoIcon } from 'lucide-react';
const Home: React.FC = () => {
  return <div className="w-100">
    {/* Hero Section */}
    <section className="bg-primary bg-gradient text-white">
      <div className="container py-5">
        <div className="row align-items-center py-5">
          <div className="col-md-6 mb-5 mb-md-0">
            <h1 className="display-4 fw-bold mb-4">
              Connect, Collaborate, Succeed
            </h1>
            <p className="lead mb-5 text-justify">
              Join StudyConnect to find study partners, collaborate on projects,
              and excel in your academic journey.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Link to="/about" className="btn btn-light btn-lg fw-medium d-flex align-items-center justify-content-center">
                Learn More
              </Link>
              <Link to="/connections" className="btn btn-dark btn-lg fw-medium d-flex align-items-center justify-content-center">
                Find Connections <ChevronRightIcon size={20} className="ms-2" />
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" alt="Students collaborating" className="img-fluid rounded-4 shadow-lg" />
          </div>
        </div>
      </div>
    </section>
    {/* Features Section */}
    <section className="py-5 bg-light">
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          How StudyConnect Works
        </h2>
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-4" style={{ width: '48px', height: '48px' }}>
                  <UsersIcon size={24} className="text-primary" />
                </div>
                <h3 className="h5 fw-semibold mb-2">Connect</h3>
                <p className="text-muted mb-0 text-justify">
                  Find and connect with students who share your interests,
                  courses, or career goals.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-4" style={{ width: '48px', height: '48px' }}>
                  <BookIcon size={24} className="text-primary" />
                </div>
                <h3 className="h5 fw-semibold mb-2">Collaborate</h3>
                <p className="text-muted mb-0 text-justify">
                  Create or join projects, share resources, and work together on
                  assignments.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-4" style={{ width: '48px', height: '48px' }}>
                  <MessageSquareIcon size={24} className="text-primary" />
                </div>
                <h3 className="h5 fw-semibold mb-2">Communicate</h3>
                <p className="text-muted mb-0 text-justify">
                  Message your connections, discuss projects, and share ideas in
                  real-time.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-4" style={{ width: '48px', height: '48px' }}>
                  <VideoIcon size={24} className="text-primary" />
                </div>
                <h3 className="h5 fw-semibold mb-2">Study Together</h3>
                <p className="text-muted mb-0 text-justify">
                  Join virtual study rooms with video, audio, and collaborative
                  whiteboards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* CTA Section */}
    <section className="py-5 bg-white">
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-4">
          Ready to boost your academic success?
        </h2>
        <p className="lead text-muted mb-5 mx-auto text-justify" style={{ maxWidth: '768px' }}>
          Join thousands of students already using StudyConnect to find study
          partners, collaborate on projects, and achieve their academic goals.
        </p>
        <Link to="/about" className="btn btn-primary btn-lg d-inline-flex align-items-center">
          Get Started Today <ChevronRightIcon size={20} className="ms-2" />
        </Link>
      </div>
    </section>
    {/* Testimonials Section */}
    <section className="py-5 bg-light">
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          What Students Say
        </h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student profile" className="rounded-circle me-3" style={{ width: '48px', height: '48px' }} />
                  <div>
                    <h4 className="h6 fw-bold mb-0">Sarah Johnson</h4>
                    <p className="small text-muted mb-0">
                      Computer Science Major
                    </p>
                  </div>
                </div>
                <p className="text-muted mb-0 text-justify">
                  "StudyConnect helped me find the perfect team for my senior
                  project. The collaboration tools made working together seamless,
                  even remotely."
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student profile" className="rounded-circle me-3" style={{ width: '48px', height: '48px' }} />
                  <div>
                    <h4 className="h6 fw-bold mb-0">Michael Chen</h4>
                    <p className="small text-muted mb-0">
                      Business Administration
                    </p>
                  </div>
                </div>
                <p className="text-muted mb-0 text-justify">
                  "The virtual study rooms are a game-changer. Being able to
                  collaborate on the whiteboard while discussing concepts has
                  improved my grades significantly."
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Student profile" className="rounded-circle me-3" style={{ width: '48px', height: '48px' }} />
                  <div>
                    <h4 className="h6 fw-bold mb-0">Priya Patel</h4>
                    <p className="small text-muted mb-0">
                      Biology Major
                    </p>
                  </div>
                </div>
                <p className="text-muted mb-0 text-justify">
                  "I connected with students in my same courses, and we've been
                  study buddies for two semesters now. StudyConnect made finding
                  compatible study partners so easy."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>;
};
export default Home;