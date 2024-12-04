import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/(auth)/Login';
import SignUp from '../pages/(auth)/SignUp';
import Home from '../pages/Home';
import Onboarding from '../pages/Onboarding';
import Topic from '../pages/Topic';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Onboarding: undefined;
  Topic: { dungeonId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export type NavigationProps<RouteName extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, RouteName>;
};

export default function AppNavigator() {
  const { isAuthenticated, isFirstAccess } = useAuth();

  const unAuthArea = (
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
  );

  const onboarding = (
    <Stack.Screen
      name="Onboarding"
      component={Onboarding}
      options={{ headerShown: false }}
    />
  );

  const authArea = (
    <>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Topic"
        component={Topic}
        options={{ headerShown: true, title: 'Topics' }}
      />
    </>
  );

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          {isFirstAccess && onboarding}
          {!isFirstAccess && authArea}
        </>
      ) : (
        unAuthArea
      )}
    </Stack.Navigator>
  );
}
