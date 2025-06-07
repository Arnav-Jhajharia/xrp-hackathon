import React, { createContext, useEffect, useState, useContext } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

// Define the base URL for your API
// IMPORTANT: Replace with your actual backend URL if different (e.g., for staging or production).
const API_BASE_URL = 'http://localhost:3001';

const AuthContext = createContext();

const auth0Domain = 'dev-viq34dlda0ygwot5.us.auth0.com';
const auth0ClientId = 'PdLO50VOpydVDwmYRBIYeJkSkYoHXHQf';
const auth0Audience = 'https://xrp-api';

const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/v2/logout`,
};

const redirectUri = AuthSession.makeRedirectUri({ useProxy: false, path: 'redirect' });

const ID_TOKEN_KEY = 'auth_id_token';
const ACCESS_TOKEN_KEY = 'auth_access_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authResult, setAuthResult] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0ClientId,
      redirectUri,
      responseType: 'token', // ✅ Get access_token instead of id_token
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        audience: auth0Audience,
      },
    },
    discovery
  );

  // Load tokens from storage on app start
  useEffect(() => {
    (async () => {

      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
      
      const storedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const storedIdToken = await SecureStore.getItemAsync(ID_TOKEN_KEY);
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        console.log('🔑 Access Token (from storage):', storedAccessToken);
        const decoded = jwtDecode(storedAccessToken);
        setUser(decoded);
      }
      if (storedIdToken) {
        try {
          const decoded = jwtDecode(storedIdToken);
          setUser(decoded);
          setAuthResult({ params: { id_token: storedIdToken }, type: 'success' });
        } catch (e) {
          console.error('❌ Invalid ID token found in storage:', e);
          await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
        }
      }
    })();
  }, []);

  // Handle login result
  useEffect(() => {
    if (!result) return;
    console.log('✅ AuthSession result:', result);

    if (result.type === 'success' && result.params?.access_token) {
      const accessToken = result.params.access_token;
      console.log('🔑 Access Token:', accessToken);
      setAccessToken(accessToken);
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);

      // Optionally decode user info from access token if it's JWT
      try {
        const decoded = jwtDecode(accessToken);
        setUser(decoded);
      } catch (e) {
        console.warn('⚠️ Access token could not be decoded as JWT');
      }

      // Call the backend API to sync/create user using axios
      const callApi = async () => {
        try {
          const apiUrl = `${API_BASE_URL}/protected/`; // Using base URL and endpoint
          console.log(`📞 Calling backend API (axios) to sync user at ${apiUrl}...`);
          const response = await axios.get(apiUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          const responseData = response.data; // axios puts response data in `data` property
          console.log('✅ API call successful (axios), user synced/verified:', responseData);
          // If your API returns the user object and you want to update the frontend state with it:
          // if (responseData.currentUser) {
          //   setUser(prevUser => ({ ...prevUser, ...responseData.currentUser }));
          //   console.log('🔄 User state updated with API data (axios).');
          // }
        } catch (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('❌ API call failed (axios) with status:', error.response.status, error.response.data);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('❌ API call error (axios): No response received. Is the server running at ' + API_BASE_URL + '?', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('❌ Error setting up API call (axios):', error.message);
          }
        }
      };
      callApi();

      setAuthResult(result);
    }
  }, [result]);

  const login = () => {
    console.log('🌐 Logging in via Auth0 →', redirectUri);
    promptAsync({ useProxy: false });
  };

  const logout = async () => {
    setUser(null);
    setAuthResult(null);
    setAccessToken(null);
    await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, request, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
