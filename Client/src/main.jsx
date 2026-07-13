import React from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from 'framer-motion'
import App from './App.jsx'
import './styles/globals.css'
import MuiThemeProvider from './components/MuiThemeProvider'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <MuiThemeProvider>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <App />
        </motion.div>
      </MuiThemeProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
