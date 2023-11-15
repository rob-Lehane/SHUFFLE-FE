import { Text, Image, View, StyleSheet } from "react-native"

export const History = ({songHistory})=>{

  
  if (!songHistory.length) return <Text>No History</Text>


  console.log(songHistory, "song history")

  return songHistory.map((song, index) =>{
    return (
      <View key={index}>
        <Text>{song.title}</Text>
        <Text>{song.artist}</Text>
        <Text>{song.rating}</Text>
      </View>
    )
  })
}

const styles=StyleSheet.create({
  image:{
    height:100,
    width:100
  },
  background:{
    backgroundColor:'red'
  }
})