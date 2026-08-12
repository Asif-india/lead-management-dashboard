import React from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from 'framer-motion'
import App from './App.jsx'
import './styles/globals.css'
import MuiThemeProvider from './components/MuiThemeProvider'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { AnalyticsProvider } from './context/AnalyticsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <AnalyticsProvider>
          <MuiThemeProvider>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <App />
            </motion.div>
          </MuiThemeProvider>
        </AnalyticsProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
