import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Image, Linking } from 'react-native';

const Support = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [arrayHolder, setArrayHolder] = useState([]);
  const [data, setData] = useState([]);

  const handleItemChange = (pItemType) => {
    setLoading(true);
    var newData = arrayHolder.filter(item =>{
      if('所有'==pItemType){
        return true;
      }
      return item.supportType==pItemType;
    });
    setData(newData);
    setLoading(false);
  }

  const getSupportItem = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fansconnect-idol.azurewebsites.net/api/items/1?code=xX0a6l0lKxdBojDNk0FGNUMIg0W8Sx4zjqtd2oUn8R2/KkeuBGX2Lg==');
      const json2 = await response.json();
      setArrayHolder(json2);
      setData(json2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSupportItem();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.select}>
        應援店種類      
      </Text>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Text style={styles.itemTypeSelected} onPress={() => {handleItemChange('所有')}}>所有</Text>
        <Text style={styles.itemType} onPress={() => {handleItemChange('應援店')}}>食店</Text>
        <Text style={styles.itemType} onPress={() => {handleItemChange('應援茶飲店')}}>茶飲店</Text>
        <Text style={styles.itemType} onPress={() => {handleItemChange('應援書店')}}>書店</Text>
      </View>
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <Text style={styles.itemType} onPress={() => {handleItemChange('應援音樂店')}}>音樂店</Text>
        <Text style={styles.itemType} onPress={() => {handleItemChange('應援玩店')}}>玩具店</Text>
        <Text style={styles.itemType} onPress={() => {handleItemChange('海外應援店')}}>海外</Text>
      </View>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.itemId}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{item.itemName}</Text>
              <Text style={{color: 'blue'}}
                onPress={() => {
                Linking.openURL('http://www.google.com/maps/place/'+item.coord);
              }}>{item.releaseLocation}</Text>
              <Text style={styles.descr}>${item.itemDescription}</Text>
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
  select:{
    fontSize: 14,
    color: '#fff'
  },
  itemTypeSelected:{
    backgroundColor: 'green',
    color: '#fff',
    margin: 5,
    padding: 5,
    width: 80,
    textAlign: 'center'
  },
  itemType:{
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
    margin: 5,
    padding: 5,
    width: 80,
    textAlign: 'center'
  },
  link: {
    color: 'blue'
  }
});

export {Support};