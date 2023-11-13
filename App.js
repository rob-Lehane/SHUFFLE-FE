import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Rating } from 'react-native-ratings'
import { History } from './History';
import { AudioPlayer } from './AudioPlayer';
import { TextInput } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)',
  },
};


export default function App() {
  const [historyShowing, setHistoryShowing] = useState(false)
  const [songHistory, setSongHistory] = useState([])
  const [user, setUser] = useState()
  const [loginInput, setLoginInput] = useState('')
  const [loginError, setLoginError] = useState(false)





  return (
    <>
      <NavigationContainer theme={MyTheme}>
        <Pressable style={styles.history} id='history' onPress={() => setHistoryShowing((h) => !h)}>
          {historyShowing ? 
          <Text>'Hide History'</Text> : 
          <Text>'Show History'</Text>}
          </Pressable>
      <AudioPlayer setSongHistory={setSongHistory} user={user}/>
      {historyShowing ? (<History songHistory={songHistory} />) : <Text></Text>}
      <View>
        {user ? <Text>Welcome {user.username}</Text> : (<><TextInput returnKeyType="send" style={styles.input} onChange={(e) => setLoginInput(e.target.value)} value={loginInput} />
          <Button title={'Log in'} onPress={() => {
            if (loginInput){
              axios.get(`https://shufl-be.onrender.com/api/users?username=${loginInput}`)
              .then((res) => {
                if (res.data.users.length){
                  setUser(res.data.users[0])
                  setLoginInput('')
                } else {
                  setLoginError(true)
                  setTimeout(()=>setLoginError(false),3000)
                }
              })
            }
            
          }} />
          {loginError?'That user doesnt exist...':''}
          </>)}
      </View>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'black',
  },
  history: {
    color: 'black',
    backgroundColor: 'grey',
  }

})