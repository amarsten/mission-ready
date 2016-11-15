exports.init = function(io) {


  //THIS  IS  IMPORTANT
  //to prevent accidental operations, certain operations require a sudo password
  //THIS  PASSWORD IS SET  HERE
  //This is done this was to allow some sort of authentication without actually implementing users
  //This requries no DB interaction and is easily changed by an admin
  ADMINPASSWORD = "password";

  console.log("IO initialized");

  io.on('connection', function(socket) {
    socket.on('getVideos', getLibraryArray);
    socket.on('deleteVideo', deleteVideo);
    socket.on('getVideoSearch', getLibraryArraySearch);


  });



  function getLibraryArraySearch(data) {
    var query = data.query;
    fs.readdir("./public/uploads/video", function(err, files) {
      //iterate over array, only keep those that have substring in title
      var filteredFiles = [];
      for (var i = 0; i < files.length; i++) {
        if (files[i].indexOf(query) > -1) {
          filteredFiles.push(files[i]);
        }
      }
      io.emit('videoArraySearch', filteredFiles);
    });
  }



  function getLibraryArray() {
    fs.readdir("./public/uploads/video", sendArray);

  }

  function sendArray(err, files) {
    io.emit('videoArray', files);
  }

  function deleteVideo(data) {
    //check if file exsists, if it does delete
    //else return file doesn't exsist
    var path = data.path;
    var password = data.password;
    path = './public/uploads/video/' + path; //real file path
    console.log(path + " requested for deletion");
    if (password === ADMINPASSWORD) {
      fs.exists(path, function(exists) {
        console.log(exists);
        console.log(path);
        if (exists) {
          console.log('deleting file at ' + path);
          fs.unlink(path);
          msg = "video succesfully deleted";
          io.emit('deleteSuccesful', msg);

        } else {
          //file not found
          io.emit('noFile', 'file not found :(');
          console.log('no file at ' + path);
        }

      });
    } else {
      io.emit('noRights', 'You gave an incorrect password');
      console.log("incorrect password supplied");
    }


  }
}