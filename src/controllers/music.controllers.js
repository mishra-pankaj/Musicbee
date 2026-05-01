const musicModel = require("../models/music.model")
const albumModel = require("../models/album.model")
const {upload, uploadFile} = require("../services/storage.service")
const jwt = require("jsonwebtoken")
const authArtist = require("../middlewares/auth.middleware")


async  function createmusic(req,res){

    const {title} = req.body
    const file = req.file

   
    
    const result = await uploadFile(file)

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id,
    })
    return res.status(201).json({
        message: "Music created successfully",
        music:{
            id: music._id,
            title: music.title,
            artist: music.artist,
            uri: music.uri
        }
    })
}

async function createAlbum(req,res){
    
        const {title,musics} = req.body
        const album = await albumModel.create({
            title,
            artist: req.user.id,
            musics: musics
        })
        res.status(201).json({
            message: "Album created successfully",
            album:{
                id:album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics
            }
        })

}

async function getAllMusic(req,res){
    const music = await musicModel
    .find()
    .limit(10) //set a limit only 10 song will be returned
    .populate("artist","username email")
    return res.status(200).json({
        message: "Music fetched successfully",
        music: music,
    })
}

async function getAllAlbum(req,res){
    const album = await albumModel.find().select("title artist").populate("artist","username email")
    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    })
}

async function getAlbumById(req,res){
    const album = await albumModel.findById(req.params.albumId).populate("artist","username email").populate("musics","title uri")

    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    })
}


module.exports = {createmusic,createAlbum,getAllMusic,getAllAlbum,getAlbumById}
