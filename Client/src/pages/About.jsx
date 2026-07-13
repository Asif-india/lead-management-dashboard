import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Target, 
  Lightbulb, 
  Award,
  Heart,
  Globe
} from 'lucide-react'
import { Typography, Card, CardContent, Grid, Box } from '@mui/material'

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'User-Centric',
      description: 'We put our users first in every decision we make, creating products that truly solve real problems.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and foster an environment where great ideas flourish.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from code quality to customer support.'
    },
    {
      icon: Target,
      title: 'Focus',
      description: 'We stay focused on our mission and deliver products that make a meaningful impact.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We build products that reach users across the globe, making technology accessible to everyone.'
    }
  ]

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: '/api/placeholder/300/300',
      bio: 'Visionary leader with 15+ years in tech startups.'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      image: '/api/placeholder/300/300',
      bio: 'Full-stack architect passionate about scalable systems.'
    },
    {
      name: 'Michael Davis',
      role: 'Head of Design',
      image: '/api/placeholder/300/300',
      bio: 'Creating beautiful, intuitive user experiences.'
    },
    {
      name: 'Emily Wilson',
      role: 'Head of Engineering',
      image: '/api/placeholder/300/300',
      bio: 'Leading our talented engineering team to excellence.'
    }
  ]

  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'Started with a small team and big dreams.' },
    { year: '2021', title: 'First Product Launch', description: 'Released our MVP to the public.' },
    { year: '2022', title: 'Series A Funding', description: 'Raised $5M to accelerate growth.' },
    { year: '2023', title: '10K Users Milestone', description: 'Reached our first major user milestone.' },
    { year: '2024', title: 'Global Expansion', description: 'Expanded to serve customers worldwide.' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Typography variant="h1" className="heading-1 mb-6">
              About
              <span className="gradient-text"> ModernApp</span>
            </Typography>
            <Typography variant="body1" className="text-body text-muted-foreground mb-8">
              We're on a mission to democratize web development and empower creators worldwide. 
              Our platform combines cutting-edge technology with intuitive design to help you build amazing applications.
            </Typography>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography variant="h2" className="heading-2 mb-6">
                  Our Mission
                </Typography>
                <Typography variant="body1" className="text-body text-muted-foreground mb-4">
                  To empower developers and businesses with the tools they need to create exceptional web experiences. 
                  We believe that great software should be accessible, efficient, and enjoyable to build.
                </Typography>
                <Typography variant="body1" className="text-body text-muted-foreground">
                  We're committed to fostering a community where innovation thrives and every developer has the opportunity 
                  to bring their ideas to life. Through continuous improvement and user feedback, we're building the future 
                  of web development, one line of code at a time.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-xl">
                  <CardContent className="p-8">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <Target className="w-16 h-16 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="h2" className="heading-2 mb-4">
              Our Core
              <span className="gradient-text"> Values</span>
            </Typography>
            <Typography variant="body1" className="text-body text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do, from product development to customer relationships.
            </Typography>
          </motion.div>

          <Grid container spacing={6}>
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover-lift">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <Typography variant="h6" className="font-semibold mb-3">
                          {value.title}
                        </Typography>
                        <Typography variant="body2" className="text-muted-foreground">
                          {value.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              )
            })}
          </Grid>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="h2" className="heading-2 mb-4">
              Our Journey
            </Typography>
            <Typography variant="body1" className="text-body text-muted-foreground max-w-2xl mx-auto">
              From a small startup to a global platform, here are the milestones that shaped our story.
            </Typography>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1">
                  <Card className="shadow-md">
                    <CardContent className="p-6">
                      <Typography variant="overline" className="text-primary font-semibold">
                        {milestone.year}
                      </Typography>
                      <Typography variant="h6" className="font-semibold mb-2">
                        {milestone.title}
                      </Typography>
                      <Typography variant="body2" className="text-muted-foreground">
                        {milestone.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-4 z-10">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="h2" className="heading-2 mb-4">
              Meet Our
              <span className="gradient-text"> Team</span>
            </Typography>
            <Typography variant="body1" className="text-body text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind ModernApp, dedicated to building the future of web development.
            </Typography>
          </motion.div>

          <Grid container spacing={6}>
            {team.map((member, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center hover-lift">
                    <CardContent className="p-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <Typography variant="h6" className="font-semibold mb-1">
                        {member.name}
                      </Typography>
                      <Typography variant="body2" className="text-primary mb-3">
                        {member.role}
                      </Typography>
                      <Typography variant="body2" className="text-muted-foreground">
                        {member.bio}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>
    </div>
  )
}

export default About
