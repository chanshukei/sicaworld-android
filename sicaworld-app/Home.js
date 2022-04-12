import {StyleSheet, Text, Image, View, TextInput, Button} from 'react-native';

const Home = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SICA WORLD</Text>
            <Image
                source={
                    require('./assets/logo-ar.gif')
                }
                style={{ width: 150, height: 200 }}
            />
            <Button style={styles.menuBtn} color='#fff' 
                    title='應援物市集' 
                    onPress={() =>{
                        navigation.navigate('Shop', {})
                    }} />
            <Button style={styles.menuBtn} color='#fff' 
                    title='應援表' 
                    onPress={() =>{
                        navigation.navigate('Support', {})
                    }}/>
            <Button style={styles.menuBtn} color='#fff' 
                    title='事件簿' 
                    onPress={() =>{
                        navigation.navigate('Events', {})
                    }}/>
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
