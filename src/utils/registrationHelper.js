/**
 * Helper functions for handling registration and redirection
 */

// Store registration data and redirect info
export const storeRegistrationData = (userData) => {
  try {
    // Store the complete user data
    localStorage.setItem('registeredUser', JSON.stringify(userData));
    
    // Store the role for redirection
    localStorage.setItem('pendingRedirect', userData.role);
    
    // Set a timestamp to expire this data if not used
    localStorage.setItem('registrationTimestamp', Date.now().toString());
    
    console.log('Registration data stored for redirect:', userData.role);
    return true;
  } catch (error) {
    console.error('Failed to store registration data:', error);
    return false;
  }
};

// Check if there's a pending redirect
export const hasPendingRedirect = () => {
  const pendingRedirect = localStorage.getItem('pendingRedirect');
  const timestamp = localStorage.getItem('registrationTimestamp');
  
  if (!pendingRedirect || !timestamp) {
    return false;
  }
  
  // Check if the registration data is still valid (less than 5 minutes old)
  const now = Date.now();
  const registrationTime = parseInt(timestamp, 10);
  const fiveMinutes = 5 * 60 * 1000;
  
  if (now - registrationTime > fiveMinutes) {
    // Data is too old, clear it
    clearRegistrationData();
    return false;
  }
  
  return true;
};

// Get the redirect path
export const getRedirectPath = () => {
  const role = localStorage.getItem('pendingRedirect');
  
  if (!role) {
    return null;
  }
  
  return role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
};

// Apply the registration data to the current session
export const applyRegistrationData = () => {
  try {
    const userData = localStorage.getItem('registeredUser');
    
    if (!userData) {
      return false;
    }
    
    const parsedData = JSON.parse(userData);
    
    // Set the token and user data in localStorage for the auth system
    localStorage.setItem('token', parsedData.token);
    localStorage.setItem('user', userData);
    
    console.log('Applied registration data to session');
    return true;
  } catch (error) {
    console.error('Failed to apply registration data:', error);
    return false;
  }
};

// Clear registration data
export const clearRegistrationData = () => {
  localStorage.removeItem('registeredUser');
  localStorage.removeItem('pendingRedirect');
  localStorage.removeItem('registrationTimestamp');
};

// Complete registration process
export const completeRegistration = () => {
  if (hasPendingRedirect()) {
    const redirectPath = getRedirectPath();
    applyRegistrationData();
    clearRegistrationData();
    return redirectPath;
  }
  return null;
};
