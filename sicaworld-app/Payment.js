import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Image, Button, Linking } from 'react-native';

const Payment = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [shoppingCart, setShoppingCart] = useState([]);
  
  const getShoppingCart = async () => {
     try {
      var shoppingCartStr = await AsyncStorage.getItem('@shoppingCart');
      console.log(shoppingCartStr);
      setShoppingCart(JSON.parse(shoppingCartStr));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getShoppingCart();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.shopTitle}>購物車</Text>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList 
          data={shoppingCart}
          keyExtractor={(item) => item.lineId}
          renderItem={({item}) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item.itemName} x {item.itemCount}</Text>
              <Text style={styles.descr}>{(item.totalAmount==0)?'多多益Si':('$'+item.totalAmount)}</Text>
            </View>
          )}
        />
      )}
      <View style={styles.item}>
        <Text style={styles.title}>入數紙</Text>
        <Button title='完成'/>
      </View>
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
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10
  },
  descr: {
    fontSize: 10
  },
  shopTitle: {
    color: '#fff', 
    fontSize: 16, 
    textAlign: 'center', 
    fontWeight: 'bold'
  }
});

export {Payment};