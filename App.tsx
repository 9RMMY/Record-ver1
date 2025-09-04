/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


import MainPage from './src/pages/MainPage';
import AddTicketPage from './src/pages/AddTicketPage';
import ReviewOptions from './src/pages/ReviewOptions';
import ImageOptions from './src/pages/ImageOptions';
import AddReviewPage from './src/pages/AddReviewPage';
import AIImageSettings from './src/pages/AIImageSettings';
import AIImageResults from './src/pages/AIImageResults';
import TicketCompletePage from './src/pages/TicketCompletePage';
import MyPage from './src/pages/MyPage';
import CalenderScreen from './src/pages/CalenderScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Wrapper component for Add Tickets tab that opens modal
function AddTicketTabWrapper({ navigation }: { navigation: any }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e: any) => {
      e.preventDefault();
      navigation.navigate('AddTicket', {
        isFirstTicket: false,
        fromAddButton: true
      });
    });

    return unsubscribe;
  }, [navigation]);

  // Return empty view since this tab should only trigger modal
  return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
          paddingBottom: insets.bottom,
          paddingTop: 5,
          height: 60 + insets.bottom,
          borderRadius: 8,
        },
        tabBarActiveTintColor: '#B11515',
        tabBarInactiveTintColor: '#7F8C8D',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen 
        name="Home" 
        component={MainPage}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }: { color: string }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color, fontSize: 20 }}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Add Tickets" 
        component={AddTicketTabWrapper}
        options={{
          tabBarLabel: 'Add Tickets',
          tabBarIcon: ({ color }: { color: string }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color, fontSize: 20 }}>⊕</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="CalenderScreen" 
        component={CalenderScreen}
        options={{
          tabBarLabel: 'Calender',
          tabBarIcon: ({ color }: { color: string }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color, fontSize: 20 }}>📆</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="MyTickets" 
        component={MyPage}
        options={{
          tabBarLabel: 'My Tickets',
          tabBarIcon: ({ color }: { color: string }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color, fontSize: 20 }}>📋</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen 
          name="AddTicket" 
          component={AddTicketPage}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="ReviewOptions" 
          component={ReviewOptions}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="AddReview" 
          component={AddReviewPage}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="ImageOptions" 
          component={ImageOptions}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="AIImageSettings" 
          component={AIImageSettings}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="AIImageResults" 
          component={AIImageResults}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="TicketComplete" 
          component={TicketCompletePage}
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
