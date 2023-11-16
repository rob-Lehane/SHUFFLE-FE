import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slider } from '@react-native-assets/slider';
import { Audio } from 'expo-av';

export function SongSlider({ playingSong }) {
  const [count, setCount] = useState(0);

  function displayTime() {
    let seconds = (count / 1000).toFixed(0);
    if (seconds < 10) seconds = '0' + seconds;

    return (
      <>
        00:{isNaN(seconds) ? '00' : seconds}
      </>
    );
  }

  // useEffect(() => {
  //   if (playingSong._loaded) {const interval = setInterval(async () => {
  //     const status = await playingSong.getStatusAsync();
  //     setCount(status.positionMillis);
  //   }, 1000);

  //   return () => clearInterval(interval);}
  // }, [playingSong]);

  return (
    <>
      <Slider
        value={count}
        style={styles.slider}
        minimumValue={0}
        maximumValue={30000}
        step={0}
        minimumTrackTintColor="grey"
        maximumTrackTintColor="grey"
        thumbTintColor="darkcyan"
        trackHeight={4}
        thumbSize={15}
        slideOnTap={true}
        onValueChange={(value) => {
          setCount(value);
          if (playingSong) playingSong.setPositionAsync(value);
        }}
      />
      <Text>{displayTime()}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  slider: {
    
  }
})