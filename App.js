import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Rating } from 'react-native-ratings'
import { History } from './History';
import { AudioPlayer } from './AudioPlayer';

export default function App() {
  const [historyShowing,setHistoryShowing]=useState(false)
  const [songHistory,setSongHistory]=useState([])

  useEffect(()=>{
    // console.log(songHistory)
  },[songHistory])

  return (
    <>
      <Button id='history' title={historyShowing?'Hide History':'Show History'} onPress={()=>setHistoryShowing((h)=>!h)}/>
      <AudioPlayer setSongHistory={setSongHistory}/>
      {historyShowing?(<History songHistory={songHistory}/>):<Text></Text>}
    </>
  );
}

