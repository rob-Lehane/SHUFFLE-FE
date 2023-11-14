import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Rating } from 'react-native-ratings';
import { History } from './History';
import { AudioPlayer } from './AudioPlayer';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  return (
    <>
      <NavigationContainer theme={MyTheme}>
        <Pressable style={styles.history} id='history' onPress={() => setHistoryShowing((h) => !h)}>
          {historyShowing ? <Text>Hide History</Text> : <Text>Show History</Text>}
          {historyShowing ? <History songHistory={songHistory} /> : <Text></Text>}
        </Pressable>
        {user?(<AudioPlayer setSongHistory={setSongHistory} user={user} />):<Text>LOG IN PLS</Text>}
        {historyShowing ? <History songHistory={songHistory} /> : <Text></Text>}
        <View style={styles.inputContainer}>
          {user ? (
            <Text>
              Welcome {user.username}{' '}
              <Button title='Logout' onPress={handleLogout} color='#841584' />
            </Text>
          ) : (
            <>
              <TextInput
                returnKeyType='send'
                style={styles.input}
                onChange={(e) => setLoginInput(e.target.value)}
                value={loginInput}
              />
              <Button title={'Log in'} onPress={handleLogin} />
              {loginError ? 'That user doesnt exist...' : ''}

            </>
          )}
        </View>
      </NavigationContainer>
    </>
  );

  function handleLogin() {
    if (loginInput) {
      axios.get(`https://shuffle-be-iq14.onrender.com/api/users?username=${loginInput}`).then((res) => {
        if (res.data.users.length) {
          setUser(res.data.users[0]);
          setLoginInput('');
        } else {
          setLoginError(true);
          setTimeout(() => setLoginError(false), 3000);
        }
      });
    }
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  input: {
    width: '50%',
    height: '10%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  history: {
    color: 'white',
    backgroundColor: '#00AFDA',
  },
});

