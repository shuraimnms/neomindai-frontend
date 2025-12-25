// This file is no longer needed since useAuth is exported from AuthContext.jsx
// You can delete this file or keep it as a wrapper

import { useAuth as useAuthContext } from '../context/AuthContext'

export const useAuth = () => {
  return useAuthContext()
}