import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

export default function App() {
  
  return (
    <View style={styles.container}>
      <View class="music-widget">
        <View class="song-info">
            <Image src="album-cover.jpg" alt="Album Cover"/>
            <h2>Song Title</h2>
            <p>Artist Name</p>
        </View>
        <View class="player-controls">
            <Button id="play-button" title='Play' onPress={()=>{
               let audio = document.getElementById('music-player');
               audio.play();
            }}/>
            <Button id="pause-button" title='Pause' onPress={()=>{
              let audio = document.getElementById('music-player');
              audio.pause();
            }}/>
        </View>
      </View>
      <audio id='music-player' src='https://cdns-preview-6.dzcdn.net/stream/c-67cc9a21a99509f600d285378314110b-3.mp3'/>
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