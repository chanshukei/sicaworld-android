import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Image, Button, Linking } from 'react-native';

const MyOrders = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  
  const getMyOrders = async () => {
     try {
      var logonUserStr = await AsyncStorage.getItem('@logonUser');
      if(logonUserStr!='' && logonUserStr!=null){
        console.log(logonUserStr);
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: logonUserStr
        };
        fetch('https://fansconnect-idol.azurewebsites.net/api/myorders/1?code=/cT6tf0KJhp5aOuV8cYXyEdXC6SwIDhWtLazJyoaXnbevH3lVRUWjw==', requestOptions)
            .then(response => response.json())
            .then(data => {
              var count = data.length;
              data.forEach(element => {
                fetch('https://fansconnect-idol.azurewebsites.net/api/orderlines/'+element.orderId+'?code=zSlD7g/44S4LmrVdNQjTnunIrr3GCB5B3KaRZxFoWtnVp3hJWWPsLQ==')
                  .then(response => response.json())
                  .then(data2 => {
                    element.orderLines = data2;
                    count--;
                    if(count==0){
                      setData(data);
                    }
                  });
              });
            });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMyOrders();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.orderId}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{item.createDate.substring(0, 10)}</Text>
              <FlatList 
                data={item.orderLines}
                keyExtractor={(item) => item.lineId}
                renderItem={({item}) => (
                  <Text>{item.itemName} x {item.itemCount} ${item.totalAmount}</Text>
                )}
              />
              <Text style={styles.link}
                    onPress={() => {
                      Linking.openURL("https://fansconnect-idol.azurewebsites.net/api/orderimage/" + item.orderId + "?code=shj0Rkq93vQ0jHmV8Z8alfUCcQrHdysOaZBw0od/8yD4/chO3LwAyg==");
                    }}>下載入數紙</Text>
            </View>
          )}
        />
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

export {MyOrders};