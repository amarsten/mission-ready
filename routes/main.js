exports.init = function(app) {
    app.get('/', home);

    //TODO: This method is not yet implemented
    //When called it creates an FFMPEG object of the video being
    //viewed, and a time stamp, then it returns an image to the client
    //for cropping, we might need sockets to do this as 1 interaction
    app.post('/takeScreenshot', doScreenshot);

    //this code handles file upload storage with multer
    //later this should likely be refactored to a module
    function fileFilter(req, file, cb) {
        if (file.mimetype == 'video/mp4' || file.mimetype == 'video.webm') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }

    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/uploads/video');
        },
        filename: function(req, file, cb) {
            console.log(file.originalname);
            cb(null, file.originalname);
        }
    })
    var upload = multer({
        storage: storage,
        fileFilter: fileFilter
    });

    app.post('/uploadVideo', upload.single('video'), function(req, res, next) {
        console.log("uploading video...");
        if (req.file) {
            res.render("index");
        } else res.send("Unsupported file type")
    })

    app.post('/saveImage', function(req, res){
        console.log("Saving image to disk")
        var base64Data = req.body.img;
        fs.writeFile('./public/img/' + req.body.tagid + ".png", base64Data, 'base64', function(err){
            if (err){
              console.log(err)
            } else{
              res.sendStatus(200)
            }
        });
    });

    app.delete('/deleteImage', function(req, res){
        fs.unlink('./public/img/' + req.body.tagid + ".png", function(err){
            if (err) console.log(err);
        });
    });


}


//Index

function home(request, response) {
    response.render('index');
}

function doScreenshot(req, res) {


}
