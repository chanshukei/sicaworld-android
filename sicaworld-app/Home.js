import {Button, StyledButton, ButtonText} from 'react-native';
import { Fontisto } from "@expo/vector-icons";
import * as Google from 'expo-google-app-auth';
import { useState } from 'react';
import { ScreenContainer } from 'react-native-screens';

const Home = ({ navigation }) => {
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
                console.log('Email:'+email+' Name:'+name);
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
        <ScreenContainer>
            <Button
                title="Go to Jane's profile"
                onPress={() =>
                    navigation.navigate('Profile', { name: 'Jane' })
                }
            />
            <Button
                title="Sign in with Google"
                onPress={handleGoogleSignIn}
            />
      </ScreenContainer>
    );
  }
  
export {Home};
