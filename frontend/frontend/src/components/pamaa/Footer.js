import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github, // ✅ Corrected here
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">LearnConnect</h3>
            <p className="text-gray-300 mb-4">
              Empowering your learning journey through community and connection.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github size={20} /> {/* ✅ Corrected usage */}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-blue-400 transition-colors">Courses</Link>
              </li>
              <li>
                <Link to="/posts" className="text-gray-300 hover:text-blue-400 transition-colors">Community Posts</Link>
              </li>
              <li>
                <Link to="/groups/view" className="text-gray-300 hover:text-blue-400 transition-colors">Groups</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Learning Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Learning Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/certificates" className="text-gray-300 hover:text-blue-400 transition-colors">Certificates</Link>
              </li>
              <li>
                <Link to="/allUsers" className="text-gray-300 hover:text-blue-400 transition-colors">Find Mentors</Link>
              </li>
              <li>
                <Link to="/notificationsPage" className="text-gray-300 hover:text-blue-400 transition-colors">Notifications</Link>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-blue-400 transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#support" className="text-gray-300 hover:text-blue-400 transition-colors">Support</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-blue-400 mr-2 mt-1" />
                <span className="text-gray-300">123 Learning Street, Education City, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-blue-400 mr-2" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-blue-400 mr-2" />
                <span className="text-gray-300">info@learnconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} LearnConnect. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/terms" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
            <div className="mt-4 md:mt-0 text-gray-400 text-sm flex items-center">
              <span className="mr-1">Made with</span>
              <Heart size={14} className="text-red-500 mx-1" />
              <span>by Team LearnConnect</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
