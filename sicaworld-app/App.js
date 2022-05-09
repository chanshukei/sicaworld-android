import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { Home } from './Home'
import { Profile } from './Profile'
import { Shop } from './Shop';
import { Support } from './Support';
import { Events } from './Events';
import { Login } from './Login';
import { MyOrders } from './MyOrders';
import { Payment } from './Payment';
import { MyOrderQrCode } from './MyOrderQrCode';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
        <Stack.Screen name="Payment" component={Payment} options={{ title: '付款' }}/>
        <Stack.Screen name="MyOrders" component={MyOrders} options={{ title: '我的購買紀錄' }}/>
        <Stack.Screen name="MyOrderQrCode" component={MyOrderQrCode} options={{ title: '我的購買紀錄QR碼' }}/>
        <Stack.Screen name="Support" component={Support} options={{ title: '應援表' }}/>
        <Stack.Screen name="Events" component={Events} options={{ title: '事件簿' }}/>
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}