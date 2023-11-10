import { Text, Image, View, StyleSheet } from "react-native"

export const History = ({songHistory})=>{

  

  return songHistory.map(song=>{
    return (
      <View>
        <Text>{song.title}</Text>
        <Text>{song.artist.name}</Text>
        <Image style={styles.image} source={song.album.cover_small}/>
      </View>
    )
  })
}

const styles=StyleSheet.create({
  image:{
    height:'100px',
    width:'100px'
  },
  background:{
    backgroundColor:'red'
  }
})