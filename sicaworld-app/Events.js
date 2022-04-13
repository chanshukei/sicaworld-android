import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Image, Button, Linking } from 'react-native';

const Events = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getEvents = async () => {
     try {
      const response = await fetch('https://fansconnect-event.azurewebsites.net/api/events/1?code=MggMIyybaGbznNOdl/5asw21tWaw5o8QxtmJkjzcgtPSVXwnzgQQQA==');
      var json = await response.json();      
      json.forEach(element => {
        var names = element.videoNames.split(',');
        var urls = element.videoUrls.split(',');
        element['videos'] = [];
        for(var i=0; i<names.length; i++){
          if(names[i]!=''){
            element['videos'].push({name: names[i], url: urls[i]});          
          }
        }
      });
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  getVideoName = (item) =>{
    return item.videoNames;
  }

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.eventId}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.title}>{item.eventName}</Text>
              <Text>{item.eventDate.substring(0, 10)} {item.eventTime}</Text>
              <Text style={styles.descr}>${item.eventDescription}</Text>
              <FlatList
                data={item.videos}
                keyExtractor={(item) => item.name}
                renderItem={({item}) =>  (
                  <Button title={item.name} onPress={() =>{Linking.openURL(item.url)}}/>
                )}
              />
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

export {Events};