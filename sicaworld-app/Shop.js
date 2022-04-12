import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Image } from 'react-native';

const Shop = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
     try {
      const response = await fetch('https://fansconnect-idol.azurewebsites.net/api/shopitems/1?code=gY3gS52DMMJ8QUqAcRCtgfObruy9F0A6WuZghcaeOppC17PkB6CBQQ==');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{item.itemName}</Text>
              <Image 
                source={{uri: 'https://fansconnect-idol.azurewebsites.net/api/shopimage/' + item.itemId + '?code=NYMr/MS73CVCycagYJmwTYYSGwo864LGSgCo0dlcJ3TdWqQLmp18sQ=='}}
                style={{width:100, height:100, borderRadius: 5}}/>
              <Text>{(item.price==0)?'多多益Si':('$'+item.price)}</Text>
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
  }
});

export {Shop};