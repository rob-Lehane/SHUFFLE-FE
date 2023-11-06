import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
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

document.getElementById('play-button').addEventListener('click', function() {
  let audio = document.getElementById('music-player');
  audio.play();
});

document.getElementById('pause-button').addEventListener('click', function() {
  let audio = document.getElementById('music-player');
  audio.pause();
});

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <div class="music-widget">
        <div class="song-info">
            <img src="album-cover.jpg" alt="Album Cover">
            <h2>Song Title</h2>
            <p>Artist Name</p>
        </div>
        <div class="player-controls">
            <button id="play-button">Play</button>
            <button id="pause-button">Pause</button>
        </div>
    </div>

    <audio id="music-player" controls>
        <source src="song.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    
    <script src="script.js"></script>
</body>
</html>
