import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export type NavigationProps<RouteName extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, RouteName>;
};

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
      {isAuthenticated ? (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
