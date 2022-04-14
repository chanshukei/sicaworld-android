import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Image, Button, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Payment = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

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
      <View style={{flex: 2, alignItems: 'center', backgroundColor: '#fff', padding: 10}}>
        <Text style={styles.shopTitle}>付款表格</Text>
        {!image && <Button title="提供圖片證明" onPress={pickImage} />}
        {image && <Button title="更換圖片證明" onPress={pickImage} />}
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Button disabled={!image} title='完成付款'/>
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
    color: '#000', 
    fontSize: 16, 
    textAlign: 'center', 
    fontWeight: 'bold'
  }
});

export {Payment};