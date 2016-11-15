var socket = io.connect();
var sortable;

//this local variable determines if the user is coming here after an upload
//this allows us to have a single page expierence while using multer responses

$(function() {
  console.log(localStorage.uploadSuccesful);
  if (localStorage.uploadSuccesful == "true") {

    showUploadComplete();
  }
});

//display message that the last upload was successfull
function showUploadComplete() {
  localStorage.uploadSuccesful = "false";
  alert("Last upload was successfull");
}

//set variable for upload complete and submit form
$("#videoSubmit").click(function(e) {
  //prevent submission before we set var
  e.preventDefault();
  localStorage.uploadSuccesful = true;
  $("#f1").submit();
});


//this function set the current playing video to the time given
//this is used with the chapter system to jump to points of interest
function setVideoTotime(timestamp) {
  //timestamp is in seconds format
  var videoPlayer = videojs("video1");
  videoPlayer.currentTime(timestamp);
}


var modal = new vanillaModal.VanillaModal({
  onBeforeOpen: function(e) {
    getAllVideos();
    getAllKSA();
    // console.log('onBeforeOpen hook', e, this);
  },
  onOpen: function(e) {
    // console.log('onOpen hook', e, this);
  },
  onBeforeClose: function(e) {
    // console.log('onBeforeClose hook', e, this);
  },
  onClose: function(e) {
    var videoFileContainers = document.getElementsByClassName('videoFileContainer');
    for (i = videoFileContainers.length - 1; i > 0; i--) {
      console.log("Removing" + videoFileContainers[i])
      videoFileContainers[i].parentNode.removeChild(videoFileContainers[i]);
    }
    // console.log('onClose hook', e, this);
  }
});

function makeSortable(element, options) {
  sortable = Sortable.create(element, options);
  return sortable
}

// TEMP FUNCTION TO DEMONSTRATE NESTED SKILLS, TAGS, ETC
function initializeTagGroups() {
  var rubricSkills = document.getElementsByClassName('rubricSkill')
  for (i = 0; i < rubricSkills.length; i++) {
    makeSortable(rubricSkills[i], {
      group: "tags",
      draggable: ".rubricTag",
      onEnd: function( /**Event*/ evt) {
        console.log("tag moved from index " + evt.oldIndex + " to index " + evt.newIndex)
        // evt.oldIndex;  // element's old index within parent
        // evt.newIndex;  // element's new index within parent
        console.log(sortable.toArray())

      },
      animation: 150
    })
  }
}

//This code was poorly writen in a hury. Video library needs to be changed to KSA
//these changes need to happen in the index file right now
//I will get this later if we finish this feature
function makeKSAFileContainer(ksa) {


  var videoFileContainer = document.createElement("div");
  videoFileContainer.className = "videoFileContainer"
  videoFileContainer.setAttribute('filename', ksa._id)

  var actions = document.createElement("ul");
  actions.className = "actions"

  var attributes = document.createElement("div");
  attributes.className = "attributes"

  var metadata = document.createElement("div");
  metadata.className = "metadata"

  var title = document.createElement("span");
  title.className = "title"
  title.innerHTML = ksa.title

  var useButton = document.createElement("li")
  useButton.className = "use"
  useButton.innerHTML = "<a>Use</a>"

  useButton.addEventListener("click", function() {
    var scope = angular.element(document.getElementById("angularView")).scope()
    scope.$apply(function() {
      scope.setKSA(ksa._id);
    });

    modal.close()
  });




  attributes.appendChild(metadata);
  attributes.appendChild(title);
  actions.appendChild(useButton);


  videoFileContainer.appendChild(actions);
  videoFileContainer.appendChild(attributes);

  var videoLibraryContainer = document.getElementById("KSALibraryContainer");

  videoLibraryContainer.appendChild(videoFileContainer);



}

function getAllKSA() {
  filter = 'find={}';
  $.ajax({
    url: "/mongo/KSA",
    data: filter,
    type: 'GET',
    success: function(result) {
      console.log(result);
      for (var i = 0; i < result.length; i++) {
        makeKSAFileContainer(result[i]);
      }
    }
  });
}



function makeVideoFileContainer(filename) {
  console.log(filename)

  var videoFileContainer = document.createElement("div");
  videoFileContainer.className = "videoFileContainer"
  videoFileContainer.setAttribute('filename', filename)

  var thumbnail = document.createElement("div");
  thumbnail.className = "thumbnail"

  var attributes = document.createElement("div");
  attributes.className = "attributes"

  var metadata = document.createElement("div");
  metadata.className = "metadata"

  var date = document.createElement("span");
  date.className = "date"
  date.innerHTML = "2/8/16"

  var length = document.createElement("span");
  length.className = "length"
  length.innerHTML = "2h10m32s"

  var title = document.createElement("span");
  title.className = "title"
  title.innerHTML = String(filename)

  var actions = document.createElement("ul");
  actions.className = "actions"

  var useButton = document.createElement("li")
  useButton.className = "use"
  useButton.innerHTML = "<a>Use</a>"

  useButton.addEventListener("click", function() {
    var videoPlayer = document.getElementById("video1_html5_api");
    // var video = .lastModifiedDate
    videoPlayer.setAttribute('src', 'uploads/video/' + filename)
    // console.log(filename + " has been clicked!")
    modal.close()
  });

  // var editButton = document.createElement("li")
  // editButton.className = "edit"
  // editButton.innerHTML = '<a><i class="fa fa-pencil"></i></a>'

  var deleteButton = document.createElement("li")
  deleteButton.className = "delete"
  deleteButton.innerHTML = '<a><i class="fa fa-trash-o"></i></a>'

  deleteButton.addEventListener("click", function() {
    // var userPW = prompt("Please enter admin password to delete:", "")
    // // data.password = String(userPW);
    // console.log(userPW)
    // if(userPW != null){
    //   // console.log("userPW: " + userPW)
    //   deleteVideo(filename, userPW)
    // }
    // var videoPlayer = document.getElementById("video1_html5_api");
    // var video = .lastModifiedDate
    // videoPlayer.setAttribute('src', 'uploads/video/' + filename)
    // console.log(filename + " has been clicked!")
    // modal.close()

    swal({
      title: "Confirm deletion of " + filename,
      text: "If you are sure, type in your administrator password",
      type: "input",
      inputType: "password",
      confirmButtonText: "Delete",
      animation: "slide-from-top",
      showCancelButton: true,
      closeOnConfirm: false
    }, function(typedPassword) {
      deleteVideo(filename, typedPassword)
    });
  });


  actions.appendChild(useButton);
  // actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  metadata.appendChild(date);
  metadata.appendChild(length);
  attributes.appendChild(metadata);
  attributes.appendChild(title);

  videoFileContainer.appendChild(thumbnail);
  videoFileContainer.appendChild(attributes);
  videoFileContainer.appendChild(actions);

  var videoLibraryContainer = document.getElementById("videoLibraryContainer");

  videoLibraryContainer.appendChild(videoFileContainer);




}

initializeTagGroups()

//These function are for the video chapter feature

//This function takes an chapter and adds it to the DB with
//a timestamp of the current video time
//should be attach to front end function so that on chapter video is paused
//and text box appears with submit button.
//timestamp id is a combination of time + videoname
function makeChapter(note) {
  var videoPlayer = videojs("video1");
  var timestamp = videoPlayer.currentTime();
  chapter = {};
  chapter.timestamp = timestamp;
  chapter.text = note;
  chapter.video = videoPlayer.currentSrc();
  chapter.id = (timestamp + "-" + videoPlayer.currentSrc());
  console.log("chapter to add", chapter);
  //this is where this is sent to the DB
  addChapter(chapter);

}


function addChapter(chapter) {

  $.ajax({
    url: "/mongo/chapter",
    data: chapter,
    type: 'PUT',
    success: function(result) {
      alert("chapter Added ");
    }
  });
}

//takes an chapter, and a revised text body and updates text body
function editChapter(chapter, note) {
  filter = 'find={"id":"' + chapter.id;
  filter += '"}&update={"$set":{"note":"' + note + '"}}';
  $.ajax({
    url: "/mongo/chapter/",
    data: filter,
    type: 'POST',
    success: function(result) {
      console.log('updated');

    }
  });

}



function deleteChapter(chapterId) {
  filter = 'find={"id":"' + chapterId;
  filter += '"}';
  $.ajax({
    url: "/mongo/chapter",
    data: filter,
    type: 'DELETE',
    success: function(result) {
      console.log(result);
    }
  });

}

//this function takes a video title and returns an array containing chapter objects
//video string is path so "uploads/video/title.mp4"
function getVideoChapters() {
  var videoPlayer = videojs("video1");
  video = videoPlayer.currentSrc()
  filter = 'find={"video":"' + video;
  filter += '"}';
  var markersFinal;
  $.ajax({
    url: "/mongo/chapter",
    data: filter,
    type: 'GET',
    success: function(result) {
      //set chapter for video
      marks = [];
      for (var i = result.length - 1; i >= 0; i--) {
        temp = {};
        temp.time = result[i].timestamp;
        temp.text = result[i].text;
        marks.push(temp);
      }
      markersFinal = {};
      markersFinal.markers = marks;
      markersFinal.onMarkerClick = function(marker) {
        console.log("clicked", marker)
      }
      videoPlayer.markers(markersFinal);
      return markersFinal
    }
  });
  return markersFinal


}

//this should be tied to a gui element in the deletion process
//feed name in the format video.mp4 full path is done on the backend
function deleteVideo(name, password) {
  var pathData = {}
  pathData.path = name;
  pathData.password = password;
  socket.emit('deleteVideo', pathData);
}
//call this function with the file name in format name.mp4
//player will then start playing video from start
function playSelectedVideo(vName) {
  var videoPlayer = videojs("video1");
  var video = {}
  video.type = "video/mp4";
  vName = 'uploads/video/' + vName;
  video.src = vName;
  videoPlayer.src(video);
  videoPlayer.play();


  //   videoPlayer.markers({
  //   markers: [
  //      {time: 9.5, text: "this"},
  //      {time: 16,  text: "is"},
  //      {time: 23.6,text: "so"},
  //      {time: 28,  text: "cool"}
  //   ]
  // });

}
//search for video titles containing query
//returns array of file names that match

function searchVideos(query) {
  var data = {}
  data.query = query;
  socket.emit('getVideoSearch', data);
}

//response code from search query
//should update dom with search results
socket.on('videoArraySearch', function(videoArray) {
  //logs results of search to console. Should be added to dom at some point
  console.log(videoArray);
});


//returns entire video gallery in array
//of format file.mp4 (not full path)
function getAllVideos() {
  //this code should later be tied to a button, its on load for now to test
  socket.emit("getVideos");
}

// getAllVideos()

socket.on('videoArray', function(videoArray) {
  //later this code will be used to change the dom
  //for now its just proof the data gets to the client
  console.log("socket connect");
  var videoFileContainers = document.getElementsByClassName('videoFileContainer');
  //
  for (i = 0; i < videoArray.length; i++) {
    // console.log(videoArray[i])
    makeVideoFileContainer(videoArray[i])
  }
});

socket.on('noFile', function(res) {
  console.log(res);
});

socket.on('deleteSuccesful', function(res) {
  swal({
    title: "File deleted",
    timer: 1500,
    showConfirmButton: false
  });
  modal.close()
  console.log(res);
});

socket.on('uploadComplete', function(videoArray) {
  //used for debugging socket signals
  alert("uploadComplete");
});

socket.on('noRights', function(res) {
  swal({
    title: "Wrong password",
    timer: 1500,
    showConfirmButton: false
  });
  //used for debugging socket signals
  console.log(res);
});