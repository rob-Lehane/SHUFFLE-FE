
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Rating } from 'react-native-ratings'
import { Audio } from 'expo-av';

export const AudioPlayer=({setSongHistory})=>{
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
    axios.get('https://corsproxy.io/?https://api.deezer.com/album/302127')
      .then((res) => {
        setAlbum(res.data.tracks.data)
        setPinging(false)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    async function nextSong(){
      pauseSound()
    await playingSong.unloadAsync()
    playSound()
    }
    if (playingSong) {
      nextSong()
      setSongHistory((h)=>[...h,album[currentlyPlaying]])
    }
  }, [currentlyPlaying])




  return (
    <View style={styles.container}>
      <View class="music-widget">
        <View class="song-info">
          <Image src="album-cover.jpg" alt="Album Cover" />
          <Text>
            Song Title
            Artist Name
          </Text>
          
        </View> 
        <View class="player-controls">
           {isPlaying ? <Button id="pause-button" title='Pause' onPress={pauseSound} /> : 
          <Button id="play-button" title='Play' onPress={playSound} />}
          <Button id="skip-button" title='Skip' onPress={() => {
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
});