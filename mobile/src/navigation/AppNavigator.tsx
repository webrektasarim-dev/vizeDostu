import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store/store';
import { setUser, clearUser, setLoading } from '../store/slices/authSlice';
import { AuthService } from '../services/auth.service';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/Home/DashboardScreen';
import DocumentListScreen from '../screens/Documents/DocumentListScreen';
import ChatScreen from '../screens/AIAssistant/ChatScreen';
import ApplicationDetailScreen from '../screens/Applications/ApplicationDetailScreen';
import ApplicationListScreen from '../screens/Applications/ApplicationListScreen';
import ApplicationCreateScreen from '../screens/Applications/ApplicationCreateScreen';
import PassportScreen from '../screens/Passport/PassportScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminUsersScreen from '../screens/Admin/AdminUsersScreen';
import AdminApplicationsScreen from '../screens/Admin/AdminApplicationsScreen';
import AdminDocumentsScreen from '../screens/Admin/AdminDocumentsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // User yoksa veya geçersizse güvenli fallback
  if (!user || !user.id) {
    return null;
  }
  
  const isAdmin = user.role === 'ADMIN';

  // Admin için sadece admin paneli ve profil
  if (isAdmin) {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#F44336',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: {
            height: 65,
            paddingBottom: 5,
            paddingTop: 5,
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: -2,
          },
          tabBarIconStyle: {
            marginTop: 3,
          },
        }}
      >
        <Tab.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{
            title: 'Admin Panel',
            tabBarIcon: ({ color, size }) => <Icon name="shield-crown" size={size} color={color} />,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="AdminUsers"
          component={AdminUsersScreen}
          options={{
            title: 'Kullanıcılar',
            tabBarIcon: ({ color, size }) => <Icon name="account-group" size={size} color={color} />,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="AdminApplications"
          component={AdminApplicationsScreen}
          options={{
            title: 'Başvurular',
            tabBarIcon: ({ color, size }) => <Icon name="clipboard-text" size={size} color={color} />,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="AdminDocuments"
          component={AdminDocumentsScreen}
          options={{
            title: 'Belgeler',
            tabBarIcon: ({ color, size }) => <Icon name="folder" size={size} color={color} />,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => <Icon name="account" size={size} color={color} />,
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  }

  // Normal kullanıcılar için tüm özellikler
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "home" : "home-outline"} size={26} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationListScreen}
        options={{
          title: 'Başvurular',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "clipboard-text" : "clipboard-text-outline"} size={26} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentListScreen}
        options={{
          title: 'Belgeler',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "folder" : "folder-outline"} size={26} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AIAssistant"
        component={ChatScreen}
        options={{
          title: 'AI Asistan',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "robot" : "robot-outline"} size={26} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "account-circle" : "account-circle-outline"} size={26} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Arkaplanda sessizce kontrol et
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await AuthService.checkAuth();
      
      if (isLoggedIn) {
        // Profile'ı arkaplanda yükle, UI'ı bloklamaz
        AuthService.getProfile()
          .then(user => {
            if (user && user.id) {
              dispatch(setUser(user));
            } else {
              dispatch(clearUser());
            }
          })
          .catch((err) => {
            // Hata olursa sessizce çık
            console.log('Profile fetch failed:', err.message);
            dispatch(clearUser());
          });
      } else {
        dispatch(clearUser());
      }
    } catch (error) {
      // Hata olsa bile UI açılır
      console.log('Auth check failed silently');
      dispatch(clearUser());
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="ApplicationDetail" 
            component={ApplicationDetailScreen}
            options={{ headerShown: true, title: 'Başvuru Detayı' }}
          />
          <Stack.Screen
            name="ApplicationCreate"
            component={ApplicationCreateScreen}
            options={{ headerShown: true, title: 'Yeni Başvuru' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ headerShown: true, title: 'Bildirimler' }}
          />
          <Stack.Screen
            name="DocumentDetail"
            component={require('../screens/Documents/DocumentDetailScreen').default}
            options={{ headerShown: true, title: 'Belge Detayı' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

