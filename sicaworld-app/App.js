import { StyleSheet, View, ScrollView } from 'react-native';
import { NavigationContainer, StackActions, NavigationActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './Home'
import { Profile } from './Profile'
import { Shop } from './Shop';
import { Support } from './Support';
import { Events } from './Events';
import { Login } from './Login';
import { MyOrders } from './MyOrders';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: '$ICAPP' }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: '登入' }}
        />
        <Stack.Screen name="Shop" component={Shop} options={{ title: '應援物市集' }}/>
        <Stack.Screen name="MyOrders" component={MyOrders} options={{ title: '我的購買紀錄' }}/>
        <Stack.Screen name="Support" component={Support} options={{ title: '應援表' }}/>
        <Stack.Screen name="Events" component={Events} options={{ title: '事件簿' }}/>
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
