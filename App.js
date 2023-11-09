import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Rating } from 'react-native-ratings'
import { History } from './History';
import { AudioPlayer } from './AudioPlayer';
import { TextInput } from 'react-native-web';

export default function App() {
  const [historyShowing, setHistoryShowing] = useState(false)
  const [songHistory, setSongHistory] = useState([])
  const [user, setUser] = useState()
  const [loginInput, setLoginInput] = useState('')
  const [loginError, setLoginError] = useState(false)


  return (
    <>
      <Button id='history' title={historyShowing ? 'Hide History' : 'Show History'} onPress={() => setHistoryShowing((h) => !h)} />
      <AudioPlayer setSongHistory={setSongHistory} user={user}/>
      {historyShowing ? (<History songHistory={songHistory} />) : <Text></Text>}
      <View>
        {user ? `Welcome ${user.username}` : (<><TextInput style={styles.input} onChange={(e) => setLoginInput(e.target.value)} value={loginInput} />
          <Button title={'Log in'} onPress={() => {
            axios.get('https://shufl-be.onrender.com/api/users')
              .then((res) => {
                let testUser = res.data.users.find(user => user.username === loginInput)
                if (res.data.users.map(user => user.username).includes(loginInput)) {
                  setUser(testUser)
                  setLoginInput('')
                } else {
                  setLoginError(true)
                  setTimeout(() => setLoginError(false), 3000)
                }
              })
          }} />
          {loginError?'That user doesnt exist...':''}
          </>)}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    border: 'solid black 1px'
  }
})