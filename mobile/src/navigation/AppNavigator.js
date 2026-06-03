import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { COLORS } from '../utils/constants';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PublicFeedScreen from '../screens/PublicFeedScreen';
import ReportIssueScreen from '../screens/ReportIssueScreen';
import IssueDetailScreen from '../screens/IssueDetailScreen';
import MyIssuesScreen from '../screens/MyIssuesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrackIssueScreen from '../screens/TrackIssueScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Feed: focused ? 'list' : 'list-outline',
            Report: focused ? 'add-circle' : 'add-circle-outline',
            MyIssues: focused ? 'clipboard' : 'clipboard-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={route.name === 'Report' ? 32 : size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tab_home') }} />
      <Tab.Screen name="Feed" component={PublicFeedScreen} options={{ title: t('tab_feed') }} />
      <Tab.Screen
        name="Report"
        component={ReportIssueScreen}
        options={{
          title: 'Report',
          tabBarLabel: '',
          tabBarIconStyle: { marginBottom: -6 },
        }}
      />
      <Tab.Screen name="MyIssues" component={MyIssuesScreen} options={{ title: t('tab_my_issues') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('tab_profile') }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  const navTheme = {
    ...(theme.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="IssueDetail"
              component={IssueDetailScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="ReportIssue"
              component={ReportIssueScreen}
              options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
            />
            <Stack.Screen name="TrackIssue" component={TrackIssueScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
