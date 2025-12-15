import React from 'react';
import { Link } from 'react-router-dom';
const Footer: React.FC = () => {
  return <footer className="bg-white shadow-sm mt-auto border-top">
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-md-3">
          <Link to="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none">
            <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle" style={{ width: '32px', height: '32px' }}>
              <span className="text-white fw-bold small">SC</span>
            </div>
            <span className="fs-5 fw-bold text-primary">
              StudyConnect
            </span>
          </Link>
          <p className="small text-muted">
            Connect, collaborate, and succeed with fellow students around the
            world.
          </p>
        </div>
        <div className="col-12 col-md-3">
          <h5 className="fw-semibold mb-3">
            Platform
          </h5>
          <ul className="list-unstyled d-flex flex-column gap-2">
            <li>
              <Link to="/connections" className="text-decoration-none text-muted hover-primary">
                Find Connections
              </Link>
            </li>
            <li>
              <Link to="/projects" className="text-decoration-none text-muted hover-primary">
                Explore Projects
              </Link>
            </li>
            <li>
              <Link to="/study-room" className="text-decoration-none text-muted hover-primary">
                Virtual Study Rooms
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-12 col-md-3">
          <h5 className="fw-semibold mb-3">
            Company
          </h5>
          <ul className="list-unstyled d-flex flex-column gap-2">
            <li>
              <Link to="/about" className="text-decoration-none text-muted hover-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-decoration-none text-muted hover-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="#" className="text-decoration-none text-muted hover-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="#" className="text-decoration-none text-muted hover-primary">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-12 col-md-3">
          <h5 className="fw-semibold mb-3">
            Connect
          </h5>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted hover-primary">
              <span className="visually-hidden">Twitter</span>
              <svg className="bi" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" className="text-muted hover-primary">
              <span className="visually-hidden">GitHub</span>
              <svg className="bi" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
            </a>
            <a href="#" className="text-muted hover-primary">
              <span className="visually-hidden">LinkedIn</span>
              <svg className="bi" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" clipRule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-top mt-5 pt-4 text-center">
        <p className="small text-muted">
          © {new Date().getFullYear()} StudyConnect. All rights reserved.
        </p>
      </div>
    </div>
  </footer>;
};
export default Footer;