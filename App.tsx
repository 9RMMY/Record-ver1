/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import MainPage from './src/pages/MainPage';
import AddTicketPage from './src/pages/AddTicketPage';
import AddReviewPage from './src/pages/AddReviewPage';
import AddImagePage from './src/pages/AddImagePage';
import TicketCompletePage from './src/pages/TicketCompletePage';
import MyPage from './src/pages/MyPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#3498DB',
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
          name="AddReview" 
          component={AddReviewPage}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="AddImage" 
          component={AddImagePage}
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
