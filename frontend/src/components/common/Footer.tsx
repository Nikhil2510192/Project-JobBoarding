import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import Logo from './Logo'

const footerLinks: Record<string, string[]> = {
  'For Candidates': ['Overview', 'Startup Jobs', 'Web3 Jobs', 'Featured', 'Salary Calculator', 'Tech Startups', 'Remote'],
  'For Recruiters': ['Overview', 'Recruit Pro', 'Curated', 'RecruiterCloud', 'Hire Developers', 'Pricing'],
  'Company': ['About', 'Help', 'Blog', 'Terms & Risks', 'Privacy & Cookies', 'Trust'],
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-background text-foreground py-16 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-muted-foreground mb-6">
              Where startups and job seekers connect. Find your next opportunity or your next hire.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-foreground font-bold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Job Boarding Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
