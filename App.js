import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Rating } from 'react-native-ratings'

export default function App() {
  const [album, setAlbum] = useState([])
  const [currentlyPlaying, setCurrently] = useState(0)
  const [rating,setRating]=useState(1)

  useEffect(() => {
    axios.get('https://corsproxy.io/?https://api.deezer.com/album/302127')
      .then((res) => {
        setAlbum(res.data.tracks.data.map(track => track.preview))
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    let audio = document.getElementById('music-player');
    audio.play()
  }, [currentlyPlaying])

  useEffect(()=>{
    console.log(rating)
  },[rating])


  return (
    <View style={styles.container}>
      <View class="music-widget">
        <View class="song-info">
          <Image src="album-cover.jpg" alt="Album Cover" />
          <h2>Song Title</h2>
          <p>Artist Name</p>
        </View>
        <View class="player-controls">
          <Button id="play-button" title='Play' onPress={() => {
            let audio = document.getElementById('music-player');
            audio.play();
          }} />
          <Button id="pause-button" title='Pause' onPress={() => {
            let audio = document.getElementById('music-player');
            audio.pause();
          }} />
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
      <audio id='music-player' src={album[currentlyPlaying]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});