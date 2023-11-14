import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Pressable, TextInput, ScrollView } from 'react-native';
import { Rating } from 'react-native-ratings';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

  const [user, setUser] = useState(null);
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState(false);

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
        .get(`https://shufl-be.onrender.com/api/users?username=${loginInput}`)
        .then((res) => {
          if (res.data.users.length) {
            AsyncStorage.setItem('user', JSON.stringify(res.data.users[0]));
            setUser(res.data.users[0]);
            setLoginInput('');
          } else {
            setLoginError(true);
            setTimeout(() => setLoginError(false), 3000);
          }
        })
        .catch((error) => {
          console.error('Error logging in:', error);
        });
    }
  };

  const playnextSong = () => {
    
  }

  return (
    <View style={styles.container}>
      <NavigationContainer theme={MyTheme}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Pressable style={styles.historyButton} onPress={() => setHistoryShowing((h) => !h)}>
            <Text style={styles.buttonText}>{historyShowing ? 'Hide History' : 'Show History'}</Text>
          </Pressable>

          {user ? <AudioPlayer setSongHistory={setSongHistory} user={user} /> : <Text style={styles.loginText}>LOG IN PLS</Text>}

          {historyShowing && <History songHistory={songHistory} />}

          <View style={styles.inputContainer}>
            {user ? (
              <View style={styles.loggedInContainer}>
                <Text style={styles.welcomeText}>Welcome {user.username}</Text>
                <Button title='Logout' onPress={handleLogout} color='#841584' />
              </View>
            ) : (
              <>
                <TextInput
                  returnKeyType='send'
                  style={styles.input}
                  onChangeText={(text) => setLoginInput(text)}
                  value={loginInput}
                  placeholder="Enter your username"
                />
                <Button title={'Log in'} onPress={handleLogin} />
                {loginError ? <Text style={styles.errorText}>That user doesn't exist...</Text> : ''}
              </>
            )}
          </View>
        </ScrollView>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  historyButton: {
    backgroundColor: '#00AFDA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
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
