import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Image, Button, Linking , Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Payment = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [image, setImage] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);

  const pay = async () => {        
    var logonUserStr = await AsyncStorage.getItem('@logonUser');  
    var user = JSON.parse(logonUserStr);
    var order = {
      idolId: 1,
      orderId: '',
      fileContent: imageInfo.base64,
      fileType: 'image/jpeg',
      filename: imageInfo.uri.substring(imageInfo.uri.lastIndexOf('/')+1),
      createBy: user.usernameEmail,
      orderlines: shoppingCart
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    };
    console.log('start');
    fetch('https://fansconnect-idol.azurewebsites.net/api/order/1', requestOptions)
        .then(response => {
          Alert.alert(
            "付款成功",
            "",
            [
              {
                text: "回到主頁", 
                onPress: async() => {
                  await AsyncStorage.removeItem('@shoppingCart');
                  navigation.navigate('Home');        
                }
              }
            ]
          );
        });
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: true
    });
    if (!result.cancelled) {
      setImageInfo(result);
      setImage(result.uri);
    }
  };

  const getShoppingCart = async () => {
     try {
      var shoppingCartStr = await AsyncStorage.getItem('@shoppingCart');
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
        <Text style={styles.formTitle}>付款表格</Text>
        {!image && <Button title="提供圖片證明" onPress={pickImage} />}
        {image && <Button title="更換圖片證明" onPress={pickImage} />}
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Button disabled={!image} title='完成付款' onPress={pay}/>
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
    fontWeight: 'bold',
    margin: 10
  },
  formTitle: {
    color: '#000', 
    fontSize: 16, 
    textAlign: 'center', 
    fontWeight: 'bold'
  }
});

export {Payment};