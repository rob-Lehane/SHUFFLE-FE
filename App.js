import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Pressable, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Rating } from 'react-native-ratings';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

import { History } from './History';
import { AudioPlayer } from './AudioPlayer';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
  },
};

export default function App() {
  const [historyShowing, setHistoryShowing] = useState(false);
  const [songHistory, setSongHistory] = useState([]);
  const [registerInput, setRegisterInput] = useState('')
  const [user, setUser] = useState(null);
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [registerError, setRegisterError] = useState(false)

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const storedUser = JSON.parse(userString);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error reading user from storage:', error);
    }
  };

  const handleLogout = () => {
    AsyncStorage.removeItem('user');
    setUser(null);
  };

  const handleLogin = () => {
    if (loginInput) {
      axios
        .get(`https://shuffle-be-iq14.onrender.com/api/users?username=${loginInput}`)
        .then((res) => {
          AsyncStorage.setItem('user', JSON.stringify(res.data.users[0]));
          setUser(res.data.users[0]);
          setLoginInput('');
        })
        .catch((error) => {
          setLoginError(true);
          setTimeout(() => setLoginError(false), 3000);
        });
    }
  };

  const handleRegistration = () => {
    if (registerInput) {
      axios
        .get(`https://shuffle-be-iq14.onrender.com/api/users?username=${registerInput}`)
        .then((res) => {
          setRegisterError(true)
          setTimeout(() => setRegisterError(false), 3000)
        })
        .catch((err) => {
          return axios.post(`https://shuffle-be-iq14.onrender.com/api/users`, { username: registerInput })
            .then((res) => {
              setUser(res.data.users)
            }).catch((err) => console.log('woof'))
        })
    }
  }

  const playnextSong = () => {

  }

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.background}
      />
      <NavigationContainer theme={MyTheme}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>



          {user ? (<AudioPlayer songHistory={songHistory} setSongHistory={setSongHistory} user={user} />) : <Text style={styles.title}>shufl.fm</Text>}
          {historyShowing ? <History songHistory={songHistory} /> : <Text></Text>}

          <View style={styles.inputContainer}>
            

            {user ? (
              <>
                <Text style={styles.userText}>
                  Welcome {user.username}{' '}
                </Text>
                <Button title={historyShowing ? 'HIDE HISTORY' : 'SHOW HISTORY'} onPress={() => setHistoryShowing((h) => !h)} color='#841584' />
                <View style={styles.gap}/>
                <Button title='Logout' onPress={handleLogout} color='#841584' />
              </>
            ) : (
              <>
                <TextInput
                  returnKeyType='send'
                  style={styles.input}
                  onChangeText={(e) => setLoginInput(e)}
                  value={loginInput}
                />
                <Button title={'Log in'} onPress={handleLogin} color='#841584' />
                {loginError ? <Text>That user doesnt exist... </Text> : <Text></Text>}
                {historyShowing && <History songHistory={songHistory} />}
                <View style={styles.inputContainer}>
                  <Text>Don't have a username yet? Register:</Text>
                  <TextInput
                    returnKeyType='send'
                    style={styles.input}
                    onChangeText={(e) => setRegisterInput(e)}
                    value={registerInput}
                  />
                  <Button title={'Register'} onPress={handleRegistration} color='#841584' />
                  {registerError ? (<Text>Sorry, that name is already taken...</Text>) : (<Text></Text>)}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  title:{
    color:'#ffffff',
    fontWeight:'bold',
    textAlign:'center',
    fontSize:30
  },
  container: {
    flex: 1,
    marginTop: 0,
  },
  gap:{
    height:10
  },
  userText:{
    fontSize:15,
    marginBottom:5,
    fontWeight:'bold'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 800
  },
  scrollContainer: {
    marginTop: 30,
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  loggedInContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  loginText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
