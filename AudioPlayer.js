
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Rating } from 'react-native-ratings'
import { Audio } from 'expo-av';

export const AudioPlayer=({setSongHistory, user})=>{
  const [album, setAlbum] = useState([])
  const [currentlyPlaying, setCurrently] = useState(0)
  const [rating,setRating]=useState(1)
  const [pinging,setPinging]=useState(true)
  const [playingSong,setPlayingSong] = useState()
  const [isPlaying, setIsPlaying] = useState(false)

  async function playSound(){
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: true
    })
    const { sound } = await Audio.Sound.createAsync(album[currentlyPlaying].preview)
    setIsPlaying(true)
    setPlayingSong(sound)

    await sound.playAsync()
  }

  async function pauseSound(){
    if (playingSong) await playingSong.pauseAsync()
    setIsPlaying(false)
  }

  useEffect(() => {
    axios.get('https://shufl-be.onrender.com/api/songs?random=true&limit=5')
      .then((res) => {
        setAlbum(res.data.songs)
        setPinging(false)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    console.log(album[currentlyPlaying])
    async function nextSong(){
      pauseSound()
    await playingSong.unloadAsync()
    playSound()
    }
    if (playingSong) {
      nextSong()
      setSongHistory((h)=>[...h,album[currentlyPlaying]])
    }
    if (album.length-currentlyPlaying<=2){
      axios.get('https://shufl-be.onrender.com/api/songs?random=true&limit=1')
      .then((res) => {
        setAlbum(a=>[...a,...res.data.songs])
        setPinging(false)
      })
    }
  }, [currentlyPlaying])

  return (
    <View style={styles.container}>
      <View class="music-widget">
        <View class="song-info">
          <Image src="album-cover.jpg" alt="Album Cover" />
          <Text>
            {album[currentlyPlaying]?album[currentlyPlaying].title:'title'}
            {album[currentlyPlaying]?album[currentlyPlaying].artist:'artist'}
          </Text>
          
        </View> 
        <View class="player-controls">
           {isPlaying ? <Button id="pause-button" title='Pause' onPress={pauseSound} /> : 
          <Button style={styles.playButton} title='Play' onPress={playSound} />}
          <Button id="skip-button" title='Submit Rating' onPress={() => {
            axios.post(`https://shufl-be.onrender.com/api/users/${user.user_id}/ratings`,{user_id:user.user_id,song_id:album[currentlyPlaying].song_id,ranking:rating*2})
              .then((res)=>console.log(res.data))
            setCurrently((curr) => curr + 1)
          }} />
          <Rating
            type='star'
            ratingCount={5}
            imageSize={60}
            showRating
            onFinishRating={(r)=>setRating(r)}
            jumpValue={0.5}
            fractions={1}
            minValue={0.5}
          />
        </View> 
      </View>
      <View style={styles.playSymbol}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playSymbol: {
    height:0,
    width:0,
    borderTopWidth:'60px',
    borderTopColor:'white',
    borderLeftWidth:'103px',
    borderLeftColor:'green',
    borderBottomWidth:'60px',
    borderBottomColor:'white'
  },
  playButton:{
    marginBottom:'30px'
  }
});