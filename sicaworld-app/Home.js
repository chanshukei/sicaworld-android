import {StyleSheet, Text, Image, View, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

const Home = ({ navigation, route }) => {
    const [user, setUser] = useState(null);
    const [isLogon, setLogon] = useState(false);
    
    const logout = () =>{
        AsyncStorage.removeItem('@logonUser');
        setUser(null);
        setLogon(false);
    }

    const getUser = async () => {
        var logonUserStr = await AsyncStorage.getItem('@logonUser');
        if(logonUserStr!='' && logonUserStr!=null){
            setUser(JSON.parse(logonUserStr));
            setLogon(true);
        }else{
            setLogon(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    if(route.params!=undefined && !isLogon){
        getUser();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>$ICAPP</Text>            
            <Image
                source={
                    require('./assets/images/logo-ar.gif')
                }
                style={{ width: 150, height: 200 }}
            />
            {
                isLogon?(
                <View>
                    <Button style={styles.menuBtn}
                            title='應援物市集' 
                            onPress={() =>{
                                navigation.navigate('Shop', {})
                            }} />
                    <Button style={styles.menuBtn}
                            title='應援表' 
                            onPress={() =>{
                                navigation.navigate('Support', {})
                            }}/>
                    <Button style={styles.menuBtn}
                            title='事件簿' 
                            onPress={() =>{
                                navigation.navigate('Events', {})
                            }}/>
                    <Button style={styles.menuBtn}
                            title={'登出 ['+user.usernameEmail+']'} 
                            onPress={logout}/>
                </View>)
                :(
                    <Button title='登入' 
                            onPress={() =>{
                                navigation.navigate('Login', {})
                            }} />
                )
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center'
    },
    title: {        
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        margin: 10
    }
});

export {Home};
