const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'node_modules', 'expo-av', 'build', 'AV.js')

const data = fs.readFileSync(filePath, 'utf-8')

const newData = data.replace(/typeof source === 'string' && Platform.OS === 'web'/g, /typeof source === 'string'/)

try {
    fs.writeFileSync(filePath, newData, 'utf-8')
    
}
catch (err) {
    console.log(err)
}

console.log("SUCCESS")