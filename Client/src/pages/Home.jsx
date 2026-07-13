import React from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Star, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  CheckCircle,
  BarChart3,
  Smartphone,
  Cloud
} from 'lucide-react'
import { Button, Card, CardContent, Typography, Box, Grid } from '@mui/material'

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern React and optimized for performance.',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee.',
      color: 'text-green-500'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Deploy worldwide with our global CDN network.',
      color: 'text-blue-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time collaboration.',
      color: 'text-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get insights with powerful analytics and reporting.',
      color: 'text-orange-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Responsive design that works perfectly on all devices.',
      color: 'text-pink-500'
    }
  ]

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
    { value: '150+', label: 'Countries' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO at TechCorp',
      content: 'ModernApp has transformed how we work. The performance is incredible and the features are exactly what we needed.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      content: 'The best platform we\'ve ever used. Clean interface, powerful features, and amazing support team.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Designer',
      content: 'Beautiful design and intuitive UX. It\'s made our workflow so much more efficient.',
      rating: 5
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      features: [
        'Up to 10 users',
        '10GB storage',
        'Basic analytics',
        'Email support',
        'Mobile app access'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      features: [
        'Up to 50 users',
        '100GB storage',
        'Advanced analytics',
        'Priority support',
        'API access',
        'Custom integrations'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited users',
        'Unlimited storage',
        'Custom analytics',
        'Dedicated support',
        'Advanced security',
        'Custom features',
        'SLA guarantee'
      ],
      highlighted: false
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h1" className="heading-1 mb-6">
                Build Amazing
                <span className="gradient-text"> Web Apps</span>
                <br />
                with Modern React
              </Typography>
              <Typography variant="body1" className="text-body text-muted-foreground mb-8">
                Experience the power of modern web development with our comprehensive platform. 
                Built with React, Tailwind CSS, and cutting-edge technologies to deliver exceptional user experiences.
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="contained" 
                  size="large" 
                  endIcon={<ArrowRight />}
                  className="btn-lg"
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  className="btn-lg"
                >
                  View Documentation
                </Button>
              </div>
              
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Typography variant="body2" className="text-muted-foreground">
                  <strong>4.9/5</strong> from 2,000+ reviews
                </Typography>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <Card className="shadow-2xl">
                  <CardContent className="p-8">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <Cloud className="w-16 h-16 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-xl"
              />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-secondary/30">
        <div className="container">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <Typography variant="h3" className="heading-3 gradient-text">
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" className="text-muted-foreground">
                    {stat.label}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="h2" className="heading-2 mb-4">
              Powerful Features for
              <span className="gradient-text"> Modern Teams</span>
            </Typography>
            <Typography variant="body1" className="text-body text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, deploy, and scale your applications. 
              Our platform provides the tools and infrastructure to help you succeed.
            </Typography>
          </motion.div>

          <Grid container spacing={6}>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover-lift hover-glow">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 ${feature.color}`} />
                        </div>
                        <Typography variant="h6" className="font-semibold mb-3">
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" className="text-muted-foreground">
                          {feature.description}
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

      {/* Testimonials Section */}
      <section className="section bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="h2" className="heading-2 mb-4">
              Loved by
              <span className="gradient-text"> Developers Worldwide</span>
            </Typography>
            <Typography variant="body1" className="text-body text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers who are already building amazing applications with our platform.
            </Typography>
          </motion.div>

          <Grid container spacing={6}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Typography variant="body2" className="text-muted-foreground mb-6 italic">
                        "{testimonial.content}"
                      </Typography>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <Typography variant="subtitle2" className="font-semibold">
                            {testimonial.name}
                          </Typography>
                          <Typography variant="caption" className="text-muted-foreground">
                            {testimonial.role}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Typography variant="h2" className="heading-2 mb-4">
              Simple, Transparent
              <span className="gradient-text"> Pricing</span>
            </Typography>
            <Typography variant="body1" className="text-body text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees, no surprises.
            </Typography>
          </motion.div>

          <Grid container spacing={6} alignItems="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`h-full relative ${plan.highlighted ? 'shadow-glow border-2 border-primary' : ''}`}>
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    <CardContent className="p-8">
                      <Typography variant="h5" className="font-semibold text-center mb-2">
                        {plan.name}
                      </Typography>
                      <div className="text-center mb-6">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <div className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <Typography variant="body2">{feature}</Typography>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant={plan.highlighted ? "contained" : "outlined"} 
                        fullWidth 
                        size="large"
                      >
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary to-accent">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <Typography variant="h2" className="heading-2 mb-4">
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" className="text-body mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of developers who are already building amazing applications with our platform. 
              Start your free trial today.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="contained" 
                size="large" 
                endIcon={<ArrowRight />}
                className="bg-white text-primary hover:bg-gray-100"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
