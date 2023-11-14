import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Rating } from 'react-native-ratings';
import { History } from './History';
import { AudioPlayer } from './AudioPlayer';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

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
  const [user, setUser] = useState();
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState(false);


  return (
    <>
      <NavigationContainer theme={MyTheme}>
        <Pressable style={styles.history} id='history' onPress={() => setHistoryShowing((h) => !h)}>

          {historyShowing ? <Text>'Hide History'</Text> : <Text>'Show History'</Text>}
        </Pressable>
        <AudioPlayer setSongHistory={setSongHistory} user={user} />
        {historyShowing ? <History songHistory={songHistory} /> : <Text></Text>}
        <View style={styles.inputContainer}>
          {user ? (
            <Text>Welcome {user.username}</Text>
          ) : (
            <>
              <TextInput
                returnKeyType="send"
                style={styles.input}
                onChangeText={(text) => setLoginInput(text)}
                value={loginInput}
                placeholder="Enter username"
              />
              <Button title={'Log in'} onPress={() => handleLogin()} />
              {loginError ? <Text style={{ color: 'red' }}>That user doesn't exist...</Text> : null}
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
    color: 'black',
    backgroundColor: 'grey',
    padding: 10,
    marginTop: 45,
    marginBottom: 10,
  },
});

