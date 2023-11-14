import { StyleSheet, Text, View, Image, Button, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Rating } from 'react-native-ratings'
import { Audio } from 'expo-av';
import { SongSlider } from './SongSlider';

export const AudioPlayer=({setSongHistory, user})=>{
  const [album, setAlbum] = useState([])
  const [rating,setRating]=useState(1)
  const [next,setNext]=useState(true)
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
    const { sound } = await Audio.Sound.createAsync(album[0].preview)
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
    async function nextSong(){
      pauseSound()
    await playingSong.unloadAsync()
    playSound()
    }
    if (playingSong) {
      nextSong()
    }
    if (album.length<=2){
      axios.get('https://shuffle-be-iq14.onrender.com/api/songs?random=true&limit=1')
      .then((res) => {
        setAlbum(a=>[...a,...res.data.songs])
      })
      .catch((err)=> console.log(err, 'get recco'))
    }
  }, [next])

  const playNextTrack = async () => {
    
    await playingSong.unloadAsync();
    setAlbum((prevAlbum) => prevAlbum.slice(1));
    setNext(true);
  };

  const playPreviousTrack = async () => {
    
    await playingSong.unloadAsync();
    setAlbum((prevAlbum) => [prevAlbum[prevAlbum.length - 1], ...prevAlbum.slice(0, -1)]);
    setNext(true);
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.musicWidget}>
      <View style={styles.songInfo}>
          <Text>
            {album[0]?album[0].title:'title'}
          </Text>
          <Text>
            {album[0]?album[0].artist:'artist'}
          </Text>
          <View style={styles.navigationButtons}>
          <Button title="Previous Track" onPress={playPreviousTrack} />
          <Button title="Next Track" onPress={playNextTrack} />
        </View>
          {album[0]? console.log(album[0].albumcover) : console.log(null)}
          <Image source={{ uri: album[0] ? album[0].albumcover : null}} style={styles.albumCover}/>
        </View> 
        <View style={styles.playerControls}>
          <SongSlider style={styles.songSlider} playingSong={playingSong}></SongSlider>
          <View style={styles.flexDiv}>
           {isPlaying ?
              
              <Pressable id="pause-button" title='Pause' onPress={pauseSound} style={styles.playButton}>
                <View style={styles.pauseSymbol}></View>
              </Pressable> 
            : 
              <Pressable style={styles.playButton} title='Play' onPress={playSound}><View style={styles.playSymbol}></View></Pressable>
          }
          </View>
          <Button id="skip-button" style={styles.playButton} title='Submit Rating' onPress={() => {
            axios.post(`https://shuffle-be-iq14.onrender.com/api/users/ratings`,{user_id:user.user_id, song_id:album[0].song_id,ranking:rating*2})
              .then((res)=>console.log(res.data))
              .catch((err)=>console.log('i broke'))
            const newSong = { "title": album[0].title,
              "artist": album[0].artist,
              "rating": rating
              }
            setSongHistory((h)=>[...h, newSong ])
            setAlbum((a)=>a.slice(1))
            setNext((curr)=>!curr)
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
    borderTopWidth:18,
    borderTopColor:'#474747',
    borderLeftWidth:31.2,
    borderLeftColor:'#dedede',
    borderBottomWidth:18,
    borderBottomColor:'#474747',
    position:'absolute',
    marginLeft:18,
    marginTop:11
  },
  pauseSymbol:{
    height:31.2,
    width:28,
    backgroundColor:'#474747',
    marginLeft:16,
    marginTop:14,
    borderLeftWidth:9,
    borderRightWidth:9,
    borderColor:'#dedede'
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
    backgroundColor: '#474747',
    margin: 10,
    padding: 0,
    borderRadius: 30,
    width: 60,
    height: 60
  },
  flexDiv:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});