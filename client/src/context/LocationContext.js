import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the location
const LocationContext = createContext();

// Create a provider component
export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setError(null); // Clear any previous errors
        },
        (error) => {
          console.error('Error watching position:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              setError('The request to get user location timed out.');
              break;
            case error.UNKNOWN_ERROR:
              setError('An unknown error occurred.');
              break;
            default:
              setError('An unknown error occurred.');
              break;
          }
        }
      );

      // Cleanup function to stop watching the position
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, error }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the LocationContext
export const useLocation = () => useContext(LocationContext);
