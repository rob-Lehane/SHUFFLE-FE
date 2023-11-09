import axios from 'axios'

exports.postRating=(ratings,song)=>{
  return axios.post('https://shufl-be.onrender.com/api/ratings',{rating,song:song.song_id})
}