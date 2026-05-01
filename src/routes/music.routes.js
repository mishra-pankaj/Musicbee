const express = require("express");
const router = express.Router();
const musicController = require("../controllers/music.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });



router.post("/upload", upload.single("music"),authMiddleware.authArtist, musicController.createmusic)
router.post("/album",authMiddleware.authArtist, musicController.createAlbum)


router.get("/",authMiddleware.authUser, musicController.getAllMusic)
router.get("/album",authMiddleware.authUser, musicController.getAllAlbum)
router.get("/albums/:albumId",authMiddleware.authUser, musicController.getAlbumById)
module.exports = router 