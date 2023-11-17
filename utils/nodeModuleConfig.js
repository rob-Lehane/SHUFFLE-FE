const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'node_modules', 'expo_av', 'build', 'AV.js')

const data = fs.readFileSync(filePath, 'utf-8')

const newData = data.replace(/typeof source === 'string' && Platform.OS === 'web'/g, /typeof source === 'string'/)

fs.writeFile(filePath, newData, 'utf-8', (err) => console.log(err))