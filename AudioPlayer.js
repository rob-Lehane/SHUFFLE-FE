import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Rating } from 'react-native-ratings'
import { Audio } from 'expo-av';
import { SongSlider } from './SongSlider';

export const AudioPlayer=({setSongHistory, user})=>{
  const [album, setAlbum] = useState([])
  const [currentlyPlaying, setCurrently] = useState(0)
  const [rating,setRating]=useState(1)
  const [playingSong,setPlayingSong] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  async function playSound(){
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: true,
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
    axios.get('https://shuffle-be-iq14.onrender.com/api/songs?random=true&limit=5')
      .then((res) => {
        setAlbum(res.data.songs)
      })
      .catch((err) => console.log(err, "get rand songs"))
  }, [])

  useEffect(() => {
    if (currentlyPlaying >= album.length){
      setLoading(true)
    }
    async function nextSong(){
      pauseSound()
    await playingSong.unloadAsync()
    playSound()
    }
    if (playingSong) {
      nextSong()
    }
    if (album.length-currentlyPlaying<=4 && user){
      console.log(user.user_id)
      axios.get(`https://shuffle-be-iq14.onrender.com/api/users/${user.user_id}/recs`)
      .then((res) => {
        setAlbum(a=>[...a,...res.data.songs])
        setLoading(false)
      })
      .catch((err)=> console.log(err, 'get recco'))
    }
  }, [currentlyPlaying])

  return (
    <View style={styles.container}>
      <View style={styles.musicWidget}>
      <View style={styles.songInfo}>
          <Text>
            {album[currentlyPlaying]?album[currentlyPlaying].title:'title'}
          </Text>
          <Text>
            {album[currentlyPlaying]?album[currentlyPlaying].artist:'artist'}
          </Text>
          {album[currentlyPlaying]? console.log(album[currentlyPlaying].albumcover) : console.log(null)}
          <Image source={{ uri: album[currentlyPlaying] ? album[currentlyPlaying].albumcover : null}} style={styles.albumCover}/>
        </View> 
        <View style={styles.playerControls}>
           {isPlaying ?
           <View>
              <SongSlider style={styles.songSlider} playingSong={playingSong}></SongSlider>
              <Button id="pause-button" title='Pause' onPress={pauseSound} style={styles.playButton}/> 
           </View>
            : 
              <Button style={styles.playButton} title='Play' onPress={playSound} />
          }
          {loading ? <><Text>Loading...</Text></>: <Button id="skip-button" style={styles.playButton} title='Submit Rating' onPress={() => {
            axios.post('https://shuffle-be-iq14.onrender.com/api/users/ratings',{song_id:album[currentlyPlaying].song_id,ranking:rating*2,user_id:user.user_id})
              .then((res)=>console.log(res.data))
              .catch((err)=> console.log(err, "post rating"))
            const newSong = { "title": album[currentlyPlaying].title,
              "artist": album[currentlyPlaying].artist,
              "rating": rating
              }
            setSongHistory((h)=>[...h, newSong ])
            setCurrently((curr) => curr + 1)
          }} />}
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
      {/* <View style={styles.playSymbol}></View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed'
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
  albumCover:{
    height: 300,
    width: 300
  },
  musicWidget: {
    flex: 2,
    flexDirection: 'column'
  },
  songInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playerControls: {
    flex: 1,
  },
  playButton: {
    margin: 0,
    padding: 0
  }
});