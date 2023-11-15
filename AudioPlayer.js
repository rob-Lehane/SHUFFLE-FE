import { StyleSheet, Text, View, Image, Button, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Rating } from 'react-native-ratings'
import { Audio } from 'expo-av';
import { SongSlider } from './SongSlider';

export const AudioPlayer=({songHistory, setSongHistory, user})=>{
  const [album, setAlbum] = useState([])
  const [rating,setRating]=useState(1)
  const [next,setNext]=useState(true)
  const [playingSong,setPlayingSong] = useState({ _loaded: false })
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  async function loadSound(){
    setLoading(true)
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: true,
    })
    const { sound } = await Audio.Sound.createAsync(album[0].preview) 
    setPlayingSong(sound)
    setLoading(false)
  }

  useEffect(()=>{
    if (isPlaying) playSound()
  },[playingSong])

  async function pauseSound(){
    if (playingSong._loaded) await playingSong.pauseAsync()
  }

  async function playSound(){
    setIsPlaying(true)
    if(playingSong._loaded){
    await playingSong.playAsync()
    }
  }

  useEffect(()=> {
    if(album.length) {
      
      loadSound()
    }
  }, [album])

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
    }
    if (playingSong._loaded) {
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
    setNext((curr)=>!curr);
  };

  const playPreviousTrack = async () => {
    
    await playingSong.unloadAsync();
    setAlbum((prevAlbum) => [songHistory.at(-1), ...prevAlbum.slice(0, -1)]);
    setNext((curr)=>!curr);
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.musicWidget}>
      <View style={styles.songInfo}>
          <Text style={styles.songTitle}>
            {album[0]?album[0].title:'title'}
          </Text>
          <Text style={styles.artistName}>
            {album[0]?album[0].artist:'artist'}
          </Text>
          <View style={styles.navigationButtons}>
        </View>
          <Image source={{ uri: album[0] ? album[0].albumcover : null}} style={styles.albumCover}/>
        </View> 
        <View style={styles.playerControls}>
          <SongSlider style={styles.songSlider} playingSong={playingSong}></SongSlider>
          <View style={styles.flexDiv}>
          <Pressable style={styles.skipButton} onPress={playPreviousTrack} disabled={loading}>
          <View style={styles.backwardSymbol1}/>
            <View style={styles.backwardSymbol2}/>
          </Pressable>
           {isPlaying ?
              
              <Pressable id="pause-button" title='Pause' onPress={()=>{
                pauseSound()
                setIsPlaying(false)
              }
              } style={styles.playButton} disabled={loading}>
                <View style={styles.pauseSymbol}></View>
              </Pressable> 
            : 
              <Pressable style={styles.playButton} title='Play' onPress={playSound}><View style={styles.playSymbol} disabled={loading}></View></Pressable>
          }
          <Pressable style={styles.skipButton} onPress={playNextTrack}>
            <View style={styles.forwardSymbol1}/>
            <View style={styles.forwardSymbol2}/>
          </Pressable>
          </View>
          <Button id="skip-button" style={styles.playButton} title='Submit Rating' disabled={loading} onPress={() => {
            axios.post(`https://shuffle-be-iq14.onrender.com/api/users/ratings`,{user_id:user.user_id, song_id:album[0].song_id,ranking:rating*2})
              .catch((err)=>console.log('i broke'))
            const newSong = { "title": album[0].title,
              "artist": album[0].artist,
              "rating": rating
              }
            setSongHistory((h)=>[...h, newSong ])
            setAlbum((a)=>a.slice(1))
            setNext((curr)=>!curr)
          }} color='#841584'/>
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
    position: 'fixed',
    borderRadius:10,
    padding:5
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
  skipButton:{
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 0,
    borderRadius: 30,
    width: 60,
    height: 60
  },
  flexDiv:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  forwardSymbol1: {
    height:0,
    width:0,
    borderTopWidth:18,
    borderTopColor:'#ffffff',
    borderLeftWidth:31.2,
    borderLeftColor:'#474747',
    borderBottomWidth:18,
    borderBottomColor:'#ffffff',
    position:'absolute',
    marginLeft:14,
    marginTop:11
  },
  forwardSymbol2:{
    backgroundColor:'#474747',
    height: 32,
    width:7,
    position: 'absolute',
    marginTop: 13,
    marginLeft: 40,
    borderRadius:1
  },
  backwardSymbol1: {
    height:0,
    width:0,
    borderTopWidth:18,
    borderTopColor:'#ffffff',
    borderRightWidth:31.2,
    borderRightColor:'#474747',
    borderBottomWidth:18,
    borderBottomColor:'#ffffff',
    position:'absolute',
    marginLeft:18,
    marginTop:11
  },
  backwardSymbol2:{
    backgroundColor:'#474747',
    height: 32,
    width:7,
    position: 'absolute',
    marginTop: 13,
    marginLeft: 17,
    borderRadius:1
  },
  songTitle:{
    fontSize:30,
    fontWeight:'bold',
    marginTop:5
  },
  artistName:{
    color:'#4a4a4a',
    marginBottom:5
  }
});