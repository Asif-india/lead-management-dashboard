import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ArrowUp
} from 'lucide-react'
import { Button } from '@mui/material'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact', href: '/contact' },
      { name: 'Status', href: '/status' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'GitHub', href: 'https://github.com', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { name: 'Email', href: 'mailto:hello@modernapp.com', icon: Mail },
  ]

  return (
    <footer className="bg-secondary/50 border-t border-border/40">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl gradient-text">ModernApp</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Building the future of web applications with modern React, beautiful design, and exceptional user experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-border/40 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">hello@modernapp.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Office</p>
                <p className="text-sm text-muted-foreground">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2024 ModernApp. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>by the ModernApp team</span>
              </span>
            </div>
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowUp className="w-4 h-4" />}
              onClick={scrollToTop}
              className="no-print"
            >
              Back to top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
