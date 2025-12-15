import React, { useState } from 'react';
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon } from 'lucide-react';
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus({
        success: true,
        message: 'Thank you! Your message has been sent successfully.'
      });
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };
  return <div className="w-100">
    {/* Hero Section */}
    <section className="bg-primary text-white">
      <div className="container py-5 text-center">
        <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
        <p className="lead mx-auto" style={{ maxWidth: '768px' }}>
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>
    </section>
    {/* Contact Form & Info Section */}
    <section className="py-5 bg-body">
      <div className="container py-5">
        <div className="row">
          {/* Contact Information */}
          <div className="col-lg-4 mb-5 mb-lg-0 pe-lg-5">
            <h2 className="h2 fw-bold mb-4">Get in Touch</h2>
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0 mt-1">
                  <MailIcon size={20} className="text-primary" />
                </div>
                <div className="ms-3">
                  <h3 className="h5 fw-semibold mb-1">Email</h3>
                  <p className="text-muted mb-0">
                    support@studyconnect.com
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0 mt-1">
                  <PhoneIcon size={20} className="text-primary" />
                </div>
                <div className="ms-3">
                  <h3 className="h5 fw-semibold mb-1">Phone</h3>
                  <p className="text-muted mb-0">
                    +91 1234567890
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0 mt-1">
                  <MapPinIcon size={20} className="text-primary" />
                </div>
                <div className="ms-3">
                  <h3 className="h5 fw-semibold mb-1">Address</h3>
                  <p className="text-muted mb-0">
                    123 Education Lane
                    <br />
                    Hanuman Road , Vile Parle - 400057
                    <br />
                    Mumbai , India
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="h5 fw-semibold mb-3">Follow Us</h3>
              <div className="d-flex gap-3">
                <a href="#" className="text-muted hover-text-primary">
                  <span className="visually-hidden">Twitter</span>
                  <svg className="bi" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted hover-text-primary">
                  <span className="visually-hidden">Facebook</span>
                  <svg className="bi" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted hover-text-primary">
                  <span className="visually-hidden">Instagram</span>
                  <svg className="bi" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted hover-text-primary">
                  <span className="visually-hidden">LinkedIn</span>
                  <svg className="bi" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="col-lg-8 ps-lg-5 border-start-lg border-light">
            <h2 className="h2 fw-bold mb-4">Send Us a Message</h2>
            {submitStatus && <div className={`mb-4 p-3 rounded-3 ${submitStatus.success ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
              {submitStatus.message}
            </div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label fw-medium">
                    Your Name
                  </label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label fw-medium">
                    Email Address
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="form-label fw-medium">
                  Subject
                </label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="form-select" required>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">
                    Partnership Opportunities
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="form-label fw-medium">
                  Message
                </label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} className="form-control" required></textarea>
              </div>
              <div>
                <button type="submit" disabled={isSubmitting} className={`btn btn-primary px-4 py-2 d-flex align-items-center justify-content-center ${isSubmitting ? 'disabled' : ''}`}>
                  {isSubmitting ? <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </> : <>
                    Send Message <SendIcon size={18} className="ms-2" />
                  </>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    {/* FAQ Section */}
    <section className="py-5 bg-body-tertiary">
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto" style={{ maxWidth: '768px' }}>
          <div className="vstack gap-4">
            <div className="pb-4 border-bottom">
              <h3 className="h5 fw-semibold mb-2">
                How do I create an account?
              </h3>
              <p className="text-muted mb-0">
                You can sign up for StudyConnect by clicking the "Get Started"
                button on our homepage. Follow the multi-step onboarding process
                to create your profile and start connecting with other students.
              </p>
            </div>
            <div className="pb-4 border-bottom">
              <h3 className="h5 fw-semibold mb-2">
                Is StudyConnect free for students?
              </h3>
              <p className="text-muted mb-0">
                Yes, StudyConnect is completely free for students. We offer all
                core features at no cost to ensure accessibility for all
                students.
              </p>
            </div>
            <div className="pb-4 border-bottom">
              <h3 className="h5 fw-semibold mb-2">
                How does the matching algorithm work?
              </h3>
              <p className="text-muted mb-0">
                Our algorithm considers your academic interests, courses,
                learning style preferences, and skills to suggest potential
                connections that would be most beneficial for your academic
                journey.
              </p>
            </div>
            <div className="pb-4 border-bottom">
              <h3 className="h5 fw-semibold mb-2">
                Can I use StudyConnect for group projects?
              </h3>
              <p className="text-muted mb-0">
                Absolutely! StudyConnect is designed to facilitate collaboration
                on group projects. You can create project spaces, assign tasks,
                share resources, and communicate with your team all in one
                place.
              </p>
            </div>
            <div className="pb-4 border-bottom">
              <h3 className="h5 fw-semibold mb-2">
                How many people can join a virtual study room?
              </h3>
              <p className="text-muted mb-0">
                Our standard virtual study rooms can accommodate up to 8
                participants simultaneously with full video, audio, and
                whiteboard collaboration features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>;
};
export default Contact;