import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Image, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Shop = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [nextLineId, setNextLineId] = useState(0);

  const payment = async () => {
    var shoppingCartStr = JSON.stringify(shoppingCart);
    AsyncStorage.setItem('@shoppingCart', shoppingCartStr);
    navigation.navigate('Payment');
  }

  const getShopItems = async () => {
    console.log('getShopItems');
    try {
      const response = await fetch('https://fansconnect-idol.azurewebsites.net/api/shopitems/1?code=gY3gS52DMMJ8QUqAcRCtgfObruy9F0A6WuZghcaeOppC17PkB6CBQQ==');
      const json = await response.json();
      json.forEach(element => {
        element.itemCount = 0;
      });
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (shopItem) => {
    Alert.alert(
      "你確認將"+shopItem.itemName+"放入購物車?",
      "",
      [
        {
          text: "取消",
          onPress: () => {}
        },
        {
          text: "確認", 
          onPress: () => addToCartInternal(shopItem)
        }
      ]
    );
  };

  const addToCartInternal = (shopItem) => {
    setLoading(true);
    shopItem.itemCount++;
    setTotalItemCount(totalItemCount+1);
    var isNewItem = true;
    shoppingCart.forEach(element => {
      if(element.itemId==shopItem.itemId){
        element.itemCount++;
        element.totalAmount = element.price * element.itemCount;
        isNewItem = false;
      }
    });

    //handle new item
    if(isNewItem){
      var orderline = {
        itemId: shopItem.itemId,
        itemName: shopItem.itemName,
        price: shopItem.price,
        itemCount: 1,
        totalAmount: shopItem.price,
        lineId: nextLineId
      };
      setNextLineId(nextLineId+1);
      shoppingCart.push(orderline);
    }
    setLoading(false);
  };

  const removeFromCart = (shopItem) => {
    Alert.alert(
      "你確認把"+shopItem.itemName+"從購物車中掉走?",
      "",
      [
        {
          text: "取消",
          onPress: () => {}
        },
        {
          text: "確認", 
          onPress: () => removeFromCartInternal(shopItem)
        }
      ]
    );
  };

  const removeFromCartInternal = (shopItem) => {
    setLoading(true);
    shoppingCart.forEach(element => {
      if(element.itemId==shopItem.itemId){
        element.itemCount--;
        element.totalAmount = element.price * element.itemCount;
        shopItem.itemCount--;
        setTotalItemCount(totalItemCount-1);
        setLoading(false);
        return;
      }
    });
  };

  useEffect(() => {
    getShopItems();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.menu}
            onPress={() => {navigation.navigate('MyOrders')}}>我的購買紀錄</Text>
      <Text style={styles.shopTitle}>所有應援物</Text>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.itemId}
          renderItem={({ item }) => (            
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{item.itemName}</Text>
              <Image 
                source={{uri: 'https://fansconnect-idol.azurewebsites.net/api/shopimage/' + item.itemId + '?code=NYMr/MS73CVCycagYJmwTYYSGwo864LGSgCo0dlcJ3TdWqQLmp18sQ=='}}
                style={{width:100, height:100, borderRadius: 5}}/>
              <Text>{(item.price==0)?'多多益Si':('$'+item.price)}</Text>
              <Text style={styles.descr}>${item.itemDescription}</Text>
              {
                item.itemCount==0?(
                <Button title='加入購物車' onPress={()=>{
                  addToCart(item);
                }}/>):(<View style={{flexDirection:'row', alignItems:'center'}}>
                  <Button title='-' onPress={()=>{
                    removeFromCart(item);
                  }}/>
                  <Text style={{color: '#000'}}>已選{item.itemCount}件</Text>
                  <Button title='+' onPress={()=>{
                    addToCart(item);
                  }}/>
                </View>)
              }            
            </View>
          )}
        />
      )}
      <Text style={styles.pay}
            onPress={payment}>付款 ({totalItemCount})</Text>
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
  shopTitle: {
    color: '#fff', 
    fontSize: 16, 
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  menu: {
    backgroundColor: 'white', 
    color: 'blue', 
    textAlign:'right', 
    textDecorationLine: 'underline',
    margin: 5,
    padding: 5,
    fontSize: 12
  },
  pay: {
    backgroundColor: 'green', 
    fontSize: 16, 
    textAlign: 'right', 
    fontWeight: 'bold', 
    padding: 10,
    textDecorationLine: 'underline',
    color: '#fff',
    margin: 10
  }
});

export {Shop};