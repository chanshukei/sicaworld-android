import { StyleSheet, View, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './Home'
import { Profile } from './Profile'
import { Shop } from './Shop';
import { Support } from './Support';
import { Events } from './Events';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home' }}
        />
        <Stack.Screen name="Shop" component={Shop} options={{ title: '應援物市集' }}/>
        <Stack.Screen name="Support" component={Support} options={{ title: '應援表' }}/>
        <Stack.Screen name="Events" component={Events} options={{ title: '事件簿' }}/>
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
