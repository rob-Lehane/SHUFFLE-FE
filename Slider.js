
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { Rating } from 'react-native-ratings'
import { Audio } from 'expo-av';


export function Slider({playingSong}) {
    //check what the milisecond of the song played is
    //change the value on the slider if time has increased by one second 

    const [ count, setCount ] = useState(0)

    function displayTime() {
        let seconds = (count/1000).toFixed(0)
        if (seconds < 10) seconds = '0' + seconds

        return (
            <>
            00:{seconds}
            </>
        ) 

    }


    useEffect(() => {

        setTimeout( async () => {
            const status = await playingSong.getStatusAsync()
            setCount(status.positionMillis)
        }, 1000)
    })

    return (
        <>
            <input type="range" name="time-slider" value={count} min="0" max="30000" onChange={(e) => {
                setCount(e.target.value)
                playingSong.setPositionAsync(e.target.value)}}/>
            {displayTime()}
        </>
    )



}