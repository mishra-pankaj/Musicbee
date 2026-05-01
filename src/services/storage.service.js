const { ImageKit } = require("@imagekit/nodejs")
const imageKitClient = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL,
})
    
async function uploadFile(file) {
    const result = await imageKitClient.files.upload({
        file: file.buffer.toString("base64"),
        fileName: file.originalname,
        folder: "/musicbee",
    })
    console.log(result)
    return result
}

module.exports =  { uploadFile }
