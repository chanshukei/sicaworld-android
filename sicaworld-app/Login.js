import {Button, StyleSheet, View, Text} from 'react-native';
import * as Google from 'expo-google-app-auth';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const [googleSubmitting, setGoogleSubmitting] = useState(false);
    
    const handleGoogleSignIn = () => {
        setGoogleSubmitting(true);

        const config = {
            androidClientId: '941729682379-3jfperv7ae155ttm3k9cs2qlkrd71406.apps.googleusercontent.com',
            iosClientId: '941729682379-uf3ns9n8udfgou5qhegjtd0gsfd8pie7.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
        };
        
        Google.logInAsync(config)
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
                        AsyncStorage.setItem('@logonUser', JSON.stringify(data));
                        AsyncStorage.removeItem('@shoppingCart');
                        navigation.navigate('Home');
                    });
                }else{
                    console.log('Google signin was cancelled');
                }
                setGoogleSubmitting(false);
            })
            .catch((error) => {
                console.log(error);
                setGoogleSubmitting(false);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>$ICAPP</Text>
            <Button
                title="Sign in with Google"
                onPress={handleGoogleSignIn}
            />
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

export {Login};
