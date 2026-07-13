/**
 * Global State Management
 * 
 * Lightweight state management solution with React Context and performance optimizations
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks'

/**
 * Initial state
 */
const initialState = {
  // User state
  user: null,
  isAuthenticated: false,
  
  // UI state
  theme: 'dark',
  sidebarCollapsed: false,
  notifications: [],
  
  // Data state
  leads: [],
  analytics: null,
  loading: {
    leads: false,
    analytics: false,
    user: false
  },
  
  // Error state
  errors: {},
  
  // Pagination state
  pagination: {
    leads: {
      page: 1,
      pageSize: 10,
      total: 0
    }
  }
}

/**
 * Action types
 */
const ACTION_TYPES = {
  // User actions
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  LOGOUT: 'LOGOUT',
  
  // UI actions
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_COLLAPSED: 'SET_SIDEBAR_COLLAPSED',
  
  // Notification actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  
  // Data actions
  SET_LEADS: 'SET_LEADS',
  SET_ANALYTICS: 'SET_ANALYTICS',
  
  // Loading actions
  SET_LOADING: 'SET_LOADING',
  
  // Error actions
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Pagination actions
  SET_PAGINATION: 'SET_PAGINATION'
}

/**
 * Reducer function
 */
const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      }
    
    case ACTION_TYPES.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload
      }
    
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        leads: [],
        analytics: null
      }
    
    case ACTION_TYPES.SET_THEME:
      return {
        ...state,
        theme: action.payload
      }
    
    case ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed
      }
    
    case ACTION_TYPES.SET_SIDEBAR_COLLAPSED:
      return {
        ...state,
        sidebarCollapsed: action.payload
      }
    
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    case ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      }
    
    case ACTION_TYPES.SET_LEADS:
      return {
        ...state,
        leads: action.payload
      }
    
    case ACTION_TYPES.SET_ANALYTICS:
      return {
        ...state,
        analytics: action.payload
      }
    
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      }
    
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value
        }
      }
    
    case ACTION_TYPES.CLEAR_ERROR:
      const { [action.payload]: removed, ...rest } = state.errors
      return {
        ...state,
        errors: rest
      }
    
    case ACTION_TYPES.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [action.payload.key]: action.payload.value
        }
      }
    
    default:
      return state
  }
}

/**
 * Create context
 */
const StateContext = createContext()
const DispatchContext = createContext()

/**
 * State Provider Component
 */
export const StateProvider = ({ children }) => {
  // Initialize state with localStorage persistence
  const [persistedState, setPersistedState] = useLocalStorage('app-state', {
    theme: initialState.theme,
    sidebarCollapsed: initialState.sidebarCollapsed,
    user: initialState.user,
    isAuthenticated: initialState.isAuthenticated
  })
  
  // Combine persisted state with initial state
  const combinedInitialState = useMemo(() => ({
    ...initialState,
    ...persistedState
  }), [persistedState])
  
  const [state, dispatch] = useReducer(reducer, combinedInitialState)
  
  // Persist state changes to localStorage
  React.useEffect(() => {
    const stateToPersist = {
      theme: state.theme,
      sidebarCollapsed: state.sidebarCollapsed,
      user: state.user,
      isAuthenticated: state.isAuthenticated
    }
    setPersistedState(stateToPersist)
  }, [state.theme, state.sidebarCollapsed, state.user, state.isAuthenticated, setPersistedState])
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

/**
 * Custom hooks for state management
 */
export const useState = () => {
  const context = useContext(StateContext)
  if (!context) {
    throw new Error('useState must be used within a StateProvider')
  }
  return context
}

export const useDispatch = () => {
  const context = useContext(DispatchContext)
  if (!context) {
    throw new Error('useDispatch must be used within a StateProvider')
  }
  return context
}

/**
 * Action creators
 */
export const actions = {
  setUser: (user) => ({ type: ACTION_TYPES.SET_USER, payload: user }),
  setAuthenticated: (isAuthenticated) => ({ type: ACTION_TYPES.SET_AUTHENTICATED, payload: isAuthenticated }),
  logout: () => ({ type: ACTION_TYPES.LOGOUT }),
  
  setTheme: (theme) => ({ type: ACTION_TYPES.SET_THEME, payload: theme }),
  toggleSidebar: () => ({ type: ACTION_TYPES.TOGGLE_SIDEBAR }),
  setSidebarCollapsed: (collapsed) => ({ type: ACTION_TYPES.SET_SIDEBAR_COLLAPSED, payload: collapsed }),
  
  addNotification: (notification) => ({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: { ...notification, id: Date.now() } }),
  removeNotification: (id) => ({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id }),
  clearNotifications: () => ({ type: ACTION_TYPES.CLEAR_NOTIFICATIONS }),
  
  setLeads: (leads) => ({ type: ACTION_TYPES.SET_LEADS, payload: leads }),
  setAnalytics: (analytics) => ({ type: ACTION_TYPES.SET_ANALYTICS, payload: analytics }),
  
  setLoading: (key, value) => ({ type: ACTION_TYPES.SET_LOADING, payload: { key, value } }),
  
  setError: (key, error) => ({ type: ACTION_TYPES.SET_ERROR, payload: { key, value: error } }),
  clearError: (key) => ({ type: ACTION_TYPES.CLEAR_ERROR, payload: key }),
  
  setPagination: (key, pagination) => ({ type: ACTION_TYPES.SET_PAGINATION, payload: { key, value: pagination } })
}

/**
 * Selector hooks for optimized state access
 */
export const useUser = () => {
  const state = useState()
  return useMemo(() => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated
  }), [state.user, state.isAuthenticated])
}

export const useUI = () => {
  const state = useState()
  return useMemo(() => ({
    theme: state.theme,
    sidebarCollapsed: state.sidebarCollapsed,
    notifications: state.notifications
  }), [state.theme, state.sidebarCollapsed, state.notifications])
}

export const useData = () => {
  const state = useState()
  return useMemo(() => ({
    leads: state.leads,
    analytics: state.analytics
  }), [state.leads, state.analytics])
}

export const useLoading = () => {
  const state = useState()
  return useMemo(() => state.loading, [state.loading])
}

export const useErrors = () => {
  const state = useState()
  return useMemo(() => state.errors, [state.errors])
}

export const usePagination = (key) => {
  const state = useState()
  return useMemo(() => state.pagination[key] || {}, [state.pagination, key])
}

/**
 * Combined hooks for common use cases
 */
export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useUser()
  
  const login = useCallback((userData) => {
    dispatch(actions.setUser(userData))
    dispatch(actions.setAuthenticated(true))
  }, [dispatch])
  
  const logout = useCallback(() => {
    dispatch(actions.logout())
  }, [dispatch])
  
  return {
    user,
    isAuthenticated,
    login,
    logout
  }
}

export const useNotifications = () => {
  const dispatch = useDispatch()
  const { notifications } = useUI()
  
  const addNotification = useCallback((notification) => {
    dispatch(actions.addNotification(notification))
  }, [dispatch])
  
  const removeNotification = useCallback((id) => {
    dispatch(actions.removeNotification(id))
  }, [dispatch])
  
  const clearNotifications = useCallback(() => {
    dispatch(actions.clearNotifications())
  }, [dispatch])
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  }
}

export const useTheme = () => {
  const dispatch = useDispatch()
  const { theme } = useUI()
  
  const setTheme = useCallback((newTheme) => {
    dispatch(actions.setTheme(newTheme))
  }, [dispatch])
  
  const toggleTheme = useCallback(() => {
    dispatch(actions.setTheme(theme === 'dark' ? 'light' : 'dark'))
  }, [dispatch, theme])
  
  return {
    theme,
    setTheme,
    toggleTheme
  }
}

export const useSidebar = () => {
  const dispatch = useDispatch()
  const { sidebarCollapsed } = useUI()
  
  const toggleSidebar = useCallback(() => {
    dispatch(actions.toggleSidebar())
  }, [dispatch])
  
  const setSidebarCollapsed = useCallback((collapsed) => {
    dispatch(actions.setSidebarCollapsed(collapsed))
  }, [dispatch])
  
  return {
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed
  }
}

export default {
  StateProvider,
  useState,
  useDispatch,
  actions,
  useUser,
  useUI,
  useData,
  useLoading,
  useErrors,
  usePagination,
  useAuth,
  useNotifications,
  useTheme,
  useSidebar
}
