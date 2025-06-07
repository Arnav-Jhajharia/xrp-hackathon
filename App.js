// App.js
import 'react-native-get-random-values';    // ↳ adds crypto.getRandomValues
import 'react-native-url-polyfill/auto';    // ↳ adds global URL & URLSearchParams
import 'fast-text-encoding';                // ↳ adds TextEncoder, TextDecoder
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AuthProvider } from './auth/AuthProvider';
import HomeScreen from './screens/HomeScreen';
import { ApolloProvider } from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient } from '@apollo/client';
import { useAuth } from './auth/AuthProvider';
import OnboardXRPL from './screens/OnboardXRPL';



export default function App() {
  const ApolloWrapper = ({ children }) => {
    const { accessToken } = useAuth();

    const httpLink = createHttpLink({ uri: 'http://localhost:3001/graphql' });
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      }
    }));

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  };
  return (
    <>
     <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <AuthProvider>
          <ApolloWrapper>
            <HomeScreen />
            <OnboardXRPL />
          </ApolloWrapper>
        </AuthProvider>
      </ApplicationProvider>
    </>
  );
}
