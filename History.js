import { Text, Image, View, StyleSheet } from "react-native"

export const History = ({ songHistory }) => {


  if (!songHistory.length) return <Text>No History</Text>


  console.log(songHistory, "song history")

  return (
    <View style={styles.historyParent}>
      <Text style={styles.myRatings}>My Ratings</Text>
      {songHistory.map((song, index) => {
        return (
          <View key={index} style={styles.songCard}>
            <View style={styles.subCard}>
              <Text style={styles.songs}>{song.title}</Text>
              <Text style={styles.artists}>{song.artist}</Text>
              <Text style={styles.ratings}>{song.rating} stars</Text>
              <Text style={styles.networkGuess}>Predicted: {song.networkGuess/2} stars</Text>
            </View>
            <Image source={{ uri: song.albumCover }} style={styles.albumCover} />
          </View>
        )
      }
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  myRatings: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 300,
    margin: 10
  },
  subCard:{
    height:80,
    margin:3,
    width:139
  },
  albumCover: {
    height: 100,
    width: 100,
    margin: 22.5
  },
  historyParent: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  songCard: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    margin: 7,
    width: 145,
    height: 220
  },
  songs: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  artists: {
    textAlign: 'center',
    color: '#474747'
  },
  ratings: {
    textAlign: 'center',
    color: '#fcba03'
  },
  image: {
    height: 100,
    width: 100
  },
  networkGuess:{
    textAlign:'center',
    fontSize:10
  },
  background: {
    backgroundColor: 'red'
  }
})