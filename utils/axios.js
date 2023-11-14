import axios from 'axios'

exports.postRating=(ratings,song)=>{
  return axios.post('https://shuffle-be-iq14.onrender.com/api/ratings',{rating,song:song.song_id})
}