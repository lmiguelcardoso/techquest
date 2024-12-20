import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import ForgotPassword from '../pages/(auth)/ForgotPassword';
import Login from '../pages/(auth)/Login';
import Main from '../pages/(auth)/Main';
import SignUp from '../pages/(auth)/SignUp';
import Home from '../pages/Home';
import Onboarding from '../pages/Onboarding';
import Quiz from '../pages/Quiz';
import Topic from '../pages/Topic';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  RecoverPassword: undefined;
  SignUp: undefined;
  Home: undefined;
  Onboarding: undefined;
  Topic: { dungeonId: string };
  Quiz: { topic_id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export type NavigationProps<RouteName extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, RouteName>;
};

export default function AppNavigator() {
  const { isAuthenticated, isFirstAccess } = useAuth();
  const screenOptions = { headerShown: false };
  const unAuthArea = (
    <>
      <Stack.Screen name="Main" component={Main} options={screenOptions} />
      <Stack.Screen name="Login" component={Login} options={screenOptions} />
      <Stack.Screen name="SignUp" component={SignUp} options={screenOptions} />
      <Stack.Screen
        name="RecoverPassword"
        component={ForgotPassword}
        options={screenOptions}
      />
    </>
  );

  const onboarding = (
    <Stack.Screen
      name="Onboarding"
      component={Onboarding}
      options={screenOptions}
    />
  );

  const authArea = (
    <>
      <Stack.Screen name="Home" component={Home} options={screenOptions} />
      <Stack.Screen
        name="Topic"
        component={Topic}
        options={{ headerShown: true, title: 'Topics' }}
      />
      <Stack.Screen name="Quiz" component={Quiz} options={screenOptions} />
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
