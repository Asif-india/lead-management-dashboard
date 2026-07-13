import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Home, 
  ArrowLeft, 
  Search,
  Bug,
  RefreshCw
} from 'lucide-react'
import { Typography, Button, Box } from '@mui/material'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <Typography 
                variant="h1" 
                className="text-9xl font-bold gradient-text opacity-20"
              >
                404
              </Typography>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Bug className="w-24 h-24 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Typography variant="h3" className="heading-3 mb-4">
              Oops! Page Not Found
            </Typography>
            <Typography variant="body1" className="text-body text-muted-foreground mb-8">
              The page you're looking for seems to have vanished into the digital void. 
              Don't worry, even the best explorers get lost sometimes!
            </Typography>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              component={Link}
              to="/"
              className="min-w-[160px]"
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowLeft />}
              onClick={() => window.history.back()}
              className="min-w-[160px]"
            >
              Go Back
            </Button>
            <Button
              variant="text"
              size="large"
              startIcon={<RefreshCw />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <Typography variant="h6" className="font-semibold mb-4">
              Maybe you're looking for:
            </Typography>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="text"
                component={Link}
                to="/"
                className="text-primary hover:bg-primary/10"
              >
                Home
              </Button>
              <Button
                variant="text"
                component={Link}
                to="/about"
                className="text-primary hover:bg-primary/10"
              >
                About
              </Button>
              <Button
                variant="text"
                component={Link}
                to="/contact"
                className="text-primary hover:bg-primary/10"
              >
                Contact
              </Button>
              <Button
                variant="text"
                component={Link}
                to="/dashboard"
                className="text-primary hover:bg-primary/10"
              >
                Dashboard
              </Button>
              <Button
                variant="text"
                component={Link}
                to="/profile"
                className="text-primary hover:bg-primary/10"
              >
                Profile
              </Button>
            </div>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8"
          >
            <Box className="inline-flex items-center gap-2 p-4 bg-secondary/30 rounded-lg">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Typography variant="body2" className="text-muted-foreground">
                Try using the search bar or navigation menu to find what you need.
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
