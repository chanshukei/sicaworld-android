import {StyleSheet, Text, Image, View, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';

const Home = ({ navigation, route }) => {
    const [user, setUser] = useState(null);
    const [isLogon, setLogon] = useState(false);
    const [isLoading, setLoading] = useState(false);
    
    const logout = () =>{
        AsyncStorage.removeItem('@logonUser');
        setUser(null);
        setLogon(false);
    }

    const login = async () => {
        setLoading(true);

        const config = {
            androidClientId: '941729682379-3jfperv7ae155ttm3k9cs2qlkrd71406.apps.googleusercontent.com',
            iosClientId: '941729682379-uf3ns9n8udfgou5qhegjtd0gsfd8pie7.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
        };
        
        const result = await Google.logInAsync(config)
        .then((result) =>{
            const{type, user} = result;
            if(type=='success'){
                const {email, name} = user;
                console.log('Google signin successful');
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usernameEmail: email })
                };
                fetch('https://fansconnect-idol.azurewebsites.net/api/login', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                    setUser(data);
                    AsyncStorage.setItem('@logonUser', JSON.stringify(data));
                    AsyncStorage.removeItem('@shoppingCart');
                    setLogon(true);
                    setLoading(false);
                });
            }else{
                console.log('Google signin was cancelled');
                setLoading(false);
            }
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
    };

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
                    <Button title='登入' onPress={login} />
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
