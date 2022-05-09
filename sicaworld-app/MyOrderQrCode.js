import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, Image, Button, Linking } from 'react-native';

const MyOrderQrCode = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  const getMyOrderQrCode = async () => {
    setLoading(true);
    try {
      var myOrderQrCode = await AsyncStorage.getItem('@myOrderQrCode');
      setData(JSON.parse(myOrderQrCode));
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  useEffect(() => {
    getMyOrderQrCode();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (
        <View style={styles.itemContainer}>
          <Image style={{ width: 300, height: 300 }} source={{
            uri: 'data:image/png;base64,'+data.qrCode,
          }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000'
  },
  itemContainer:{
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    alignItems: 'center'
  },
  title: {        
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000'
  },
  item: {
    color: '#fff'
  },
  descr: {
    fontSize: 10
  },
  link: {
    color: '#fff',
    backgroundColor: 'green',
    margin: 10,
    padding: 10,
    fontSize: 18    
  },
  qr: {
    color: '#fff',
    backgroundColor: 'blue',
    margin: 10,
    padding: 10,
    fontSize: 18
  }
});

export {MyOrderQrCode};