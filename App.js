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
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    border: 'solid black 1px'
  }
})