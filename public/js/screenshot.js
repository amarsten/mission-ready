var screencapCanvas
var isDragging = false
var dragStart
var dragEnd
var mouseX
var mouseY
var draggingSquare
var canScreenshot = false
var newTagID

document.addEventListener("DOMContentLoaded", function() {
  var videoElement = document.getElementById("video1_html5_api");

screencapCanvas = new paper.PaperScope();
screencapCanvas.setup($("#screencapCanvas")[0]);
// var paper = screencapCanvas;
screencapCanvas.install(window);
// console.log(screencapCanvas.view.size)
var bg = new Path.Rectangle(new Point(0, 0), new Point(screencapCanvas.view.size.width, screencapCanvas.view.size.height))
bg.fillColor = new Color(0, 0, 0, 0)
// var cursor = new Path.Circle(screencapCanvas.view.center, 8)
// cursor.fillColor = 'black'

$(window).resize(resizeAndRedrawCanvas)

function resizeAndRedrawCanvas(){
    console.log("Window has been resized. Redrawing the canvas to the following dimensions: ", $("#screencapCanvas").width(), $("#screencapCanvas").height())
    screencapCanvas.view.setViewSize($("#screencapCanvas").width(), $("#screencapCanvas").height())
}

var screenshotResult = document.getElementById('screenshotResult');
var context = screenshotResult.getContext('2d');
// Define some vars required later
var w, h, ratio;

// set canvas to correct size
videoElement.addEventListener('loadedmetadata', function() {
  // Calculate the ratio of the video's width to height
  ratio = videoElement.videoWidth / videoElement.videoHeight;
  // Define the required width as 100 pixels smaller than the actual video's width
  w = videoElement.videoWidth - 100;
  // Calculate the height based on the video's width and the ratio
  h = parseInt(w / ratio, 10);
  // Set the canvas width and height to the values just calculated
  screenshotResult.width = w;
  screenshotResult.height = h;
}, false);


function trim(c) {
  var ctx = c.getContext('2d'),
    copy = document.createElement('canvas').getContext('2d'),
    pixels = ctx.getImageData(0, 0, c.width, c.height),
    l = pixels.data.length,
    i,
    bound = {
      top: null,
      left: null,
      right: null,
      bottom: null
    },
    x, y;

  for (i = 0; i < l; i += 4) {
    if (pixels.data[i+3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~((i / 4) / c.width);

      if (bound.top === null) {
        bound.top = y;
      }

      if (bound.left === null) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (bound.right === null) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  var trimHeight = bound.bottom - bound.top,
      trimWidth = bound.right - bound.left,
      trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

  copy.canvas.width = trimWidth;
  copy.canvas.height = trimHeight;
  copy.putImageData(trimmed, 0, 0);

  // open new window with trimmed image:
  return copy.canvas;
}


// Takes a snapshot of the video
function snap(dragFrom, dragTo) {
  console.log("TAKING A PICTURE!!!")
  var scaleRatio = (videoElement.videoWidth/screencapCanvas.view.size.width)
  // console.log(scaleRatio)
  // var dragFrom = dragFrom
  // var dragTo = dragTo
  dragFrom.x = dragFrom.x * scaleRatio
  dragFrom.y = dragFrom.y * scaleRatio
  dragTo.x = dragTo.x * scaleRatio
  dragTo.y = dragTo.y * scaleRatio
  // var dragFrom.y = pxDragFrom.y * scaleRatio
  // var dragTo = pxDragTo * scaleRatio
  // console.log(dragFrom, dragTo)
  // Define the size of the rectangle that will be filled (basically the entire element)
  context.clearRect(0, 0, 1000000, 1000000);
  // context.fillRect(dragFrom.x, dragFrom.y, Math.abs(dragTo.x - dragFrom.x), Math.abs(dragTo.y - dragFrom.y));
  // Grab the image from the video
  context.drawImage(videoElement, dragFrom.x, dragFrom.y, Math.abs(dragTo.x - dragFrom.x), Math.abs(dragTo.y - dragFrom.y), dragFrom.x, dragFrom.y, Math.abs(dragTo.x - dragFrom.x), Math.abs(dragTo.y - dragFrom.y));
  // var imgData = screenshotResult.toDataURL("image/png")
  var tempImgData = trim(screenshotResult).toDataURL("image/png")
  var imgData = tempImgData.replace(/^data:image\/(png|jpg);base64,/, '')

  // convert canvas to image
  // var imgData = screenshotResult.toDataURL("image/png");

  //create new image to be added
  // var screenShot = document.createElement("img");
  // screenShot.src = imgData
  // var screenshotFilePath = "./public/uploads/img/" + newTagID + ".png"
  // console.log("filepath", screenshotFilePath)

  // console.log(imgData)
  $.ajax({
    url: '/saveImage',
    method: 'POST',
    data: { img: imgData, tagid: newTagID, temp: false },
    success: endScreenshot()
  });

  function endScreenshot(){
    $('#screencapCanvas').css('left', '-200%')
    console.log("screenshot done")
    var ang = angular.element(document.getElementById('angularView')).scope().models
    ang.selected = null
    angular.element(document.getElementById('angularView')).scope().$apply()
    // console.log($("#" + String(newTagID)).children('img')[0].src)
    $("#" + String(newTagID)).children('img')[0].src = tempImgData
    // console.log($(newTagID))
    // console.log(angular.element(document.getElementById('angularView')).scope().models.selected = null)
    // canScreenshot = false
  }

  //add in image to canvas
  // var rubricCanvas = $(document.getElementById('1')).children('.c0lumn').children().children().last().children()[0];
  // console.log(rubricCanvas)
  // containerToAddTo.appendChild(img)
  // console.log(img)

  // need it to populate a rubric tag like this
// .rubricTag
//   img(src="/img/test_tag.png")
//   aside
//     span(class="action") ACTION
//     h2 This


}

// bg.onMouseDrag = function(event){
//     // if(isDragging == true){
//       console.log("draggin!")
//       draggingSquare.segments[1].point = event.point
//     // }
// }

  bg.onMouseDown = function(event) {
      if(canScreenshot == true && isDragging == false){
        // path.position += event.delta;
        dragStart = event.point
        // performDrag(dragStart)
        // console.log(event.point)
        draggingSquare = new Path.Rectangle(new Point(event.point.x, event.point.y), new Point(event.point.x, event.point.y))
        // draggingSquare = new Path.Rectangle(event.point.x, event.point.y, mouseX, mouseY)
        draggingSquare.strokeColor = 'white'
        draggingSquare.fillColor = new Color(0, 0, 0, 0.2)
      }
      else if(isDragging == true){
        dragEnd = event.point
        draggingSquare.locked = false
        snap(new Point (draggingSquare.bounds.x, draggingSquare.bounds.y), new Point (draggingSquare.bounds.x + draggingSquare.bounds.width, draggingSquare.bounds.y + draggingSquare.bounds.height))
        isDragging = false
        context.clearRect(0, 0, 1000000, 1000000);
        draggingSquare.remove()
      }
  }

  bg.onMouseUp = function(event) {
    if(canScreenshot == true){
      // console.log("hey")
      dragEnd = event.point
      console.log("Drag start: ", dragStart, " and Drag end: ", dragEnd)
      // console.log(event.point)
      // snap(dragStart, dragEnd)
      if(isDragging == true){
        // snap(dragStart, dragEnd)
        draggingSquare.locked = false
        // console.log(draggingSquare.bounds.x)
        snap(new Point (draggingSquare.bounds.x, draggingSquare.bounds.y), new Point (draggingSquare.bounds.x + draggingSquare.bounds.width, draggingSquare.bounds.y + draggingSquare.bounds.height))
        isDragging = false
        context.clearRect(0, 0, 1000000, 1000000);
        draggingSquare.remove()
      }
    }
  }

  bg.onMouseDrag = function(event) {
    if(canScreenshot == true){
    isDragging = true
    dragEnd = event.point
    // draggingSquare.segments[0].point = event.point
    // draggingSquare = new Path.Rectangle(new Point(event.point.x, event.point.y), new Point(event.point.x, event.point.y))
  }
  }

  // draggingSquare.onMouseUp = function(event) {
  //   console.log("SCORE")
  // }

  bg.onMouseMove = function(event){
    mouseX = event.point.x
    mouseY = event.point.y
    // console.log("moving")
    if(canScreenshot == true){
      if(isDragging == true){
        draggingSquare.remove()
        draggingSquare = new Path.Rectangle(new Point(dragStart.x, dragStart.y), new Point(event.point.x, event.point.y))
        draggingSquare.strokeColor = 'white'
        draggingSquare.fillColor = new Color(0, 0, 0, 0.2)
        draggingSquare.locked = true
      }
    }
  }


});
