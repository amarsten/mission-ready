/**
 * The controller doesn't do much more than setting the initial data model
 */

angular.module("demo").controller("NestedListsDemoController", function($scope, $timeout) {

  $scope.models = {
    selected: null,
    templates: [{
      type: "tag",
      _id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a' // this needs to be unique
    }, {
      type: "skill",
      _id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a', // this needs to be unique
      columns: [
        []
      ]
    }],
    title: null,
    _id: null,
    dropzones: null
  };

  $scope.init = function(){
    console.log("init!")
    if (localStorage.KSAID) {
      console.log(localStorage.KSAID);
      $scope.models._id = localStorage.KSAID;
      filter = 'find={"_id":"' + localStorage.KSAID;
      filter += '"}';
      $.ajax({
        url: "/mongo/KSA",
        data: filter,
        type: 'GET',
        success: function(result) {
          if (result[0].contents){
            console.log("init() loaded model: ", result[0].contents);
            $scope.models.dropzones = {"contents" : JSON.parse(angular.toJson(result[0].contents))};
            $scope.models.title = result[0].title;
          }
        }
      });
    }
  };

  $scope.init();

  $scope.containerReady = function(readyContainer) {
    console.log(readyContainer)

    var element = document.getElementById(String(readyContainer))
    // NEED TO GET THIS WORKING
    // setupContainers(element)
  };

  $scope.createKSA = function(item) {
    console.log("adding new KSA")
    KSAID = uuid.v1();
    KSA = {contents: []};
    title = "KSA Title"
    $scope.models._id = KSAID;
    $scope.models.dropzones = KSA;
    $scope.models.title = title;
    addKSA(KSAID, KSA);
    $scope.setKSA(KSAID);
  }

  $scope.setKSA = function(KSAID) {
    localStorage.KSAID = KSAID;
    $scope.models._id = KSAID;
    console.log("set localStorage id")
    $scope.init()
  }

  $scope.createSkill = function(item) {
    console.log("adding new skill")
    var newSkill = {type: "skill", _id: uuid.v1(), title: "Skill Title", columns: [[]]}
    if ($scope.models.dropzones){
      var skillList = $scope.models.dropzones.contents
      skillList.push(newSkill)
    }
    else {
      $scope.models.dropzones = {"contents" : [{type: "skill", _id: uuid.v1(), title: "Skill Title", columns: [[]]}]}
    }
  }

  $scope.createTag = function(item) {
    console.log("adding tag to", item)
    var skillList = $scope.models.dropzones.contents
    var targetSkillIndex = skillList.indexOf(item)
    var newTag = {"type": "tag", "_id": uuid.v1(), "title": "Title"}
    // var filepath = ("./public/uploads/img/" + tag._id + "_temp.png")
    // console.log("new", newTag)
    newTag.filepath = '/img/' + newTag._id + '.png'

    // var skillContainer = document.getElementById(String(item._id))
    canScreenshot = true
    $('#screencapCanvas').css('left', '0')
    newTagID = newTag._id
    // containerToAddTo = skillContainer

    // console.log(skillContainer)
    if(targetSkillIndex >= 0){
      skillList[targetSkillIndex].columns[0].push(newTag)
      addTag(newTag)
    }
    // $scope.models.dropzones["A"][item - 1].columns[0].push(newTag)
    // console.log($scope.models.dropzones["A"][item - 1].columns[0])
    // console.log(canScreenshot)
  }

  $scope.remove = function(item) {
    console.log("REMOVING: " + item.type, "ID: " + item._id)
    var allSkills = $scope.models.dropzones.contents
    // this function is over-written at the moment. it SHOULD just be able to find the
    // index of the the item we're trying to delete, but because of the complexity of the
    // model, traversing/searching through it is sort of difficult. need to improve this for now.
    if(item.type == "tag"){
      // get the element's DOM element
      var target = angular.element(event.target)
      // find the skill it's held within
      var targetParent = angular.element($(target).parent().parent().parent().parent())
      // get the unique id of the skill its held within
      var targetParentID = targetParent[0].id
      // temp variable to store the index of said skill (so we can remove stuff from it)
      var targetParentIndex = -1
      for(i = 0; i < allSkills.length; i++){
        if($scope.models.dropzones.contents[i]._id == targetParentID){
          targetParentIndex = i
        }
      }
      // if we can find the tag's skill parent...
      if(targetParentIndex != -1){
        // get all the tags within the skill
        var tagsWithinParentSkill = allSkills[targetParentIndex].columns[0]
        // find our specific tag
        var targetIndex = tagsWithinParentSkill.indexOf(item)
        // check if we found it
        if(targetIndex == -1){
          console.log("Couldn't find this tag's, so I wasn't able to delete it.")
        } else{
          //removes the tag!
          tagsWithinParentSkill.splice(targetIndex, 1)
          // deleteTag(item._id)
        }
      } else{
        // CASE FOR ORPHAN TAGS
        var targetTagIndex = allSkills.indexOf(item)
        if(targetTagIndex >= 0){
          allSkills.splice(targetTagIndex, 1)
          // deleteTag(item._id)
        }

        console.log("Couldn't find this tag's parent container, so I wasn't able to delete it.")
      }
    }
    if(item.type == "skill"){
      var targetSkillIndex = allSkills.indexOf(item)
      if(targetSkillIndex >= 0){
        allSkills.splice(targetSkillIndex, 1)
        // deleteSkill(item._id)
      }
    }
}

  var timeoutPromise;
  var delayInMs = 500;
  $scope.$watch('models', function(model) {
    $timeout.cancel(timeoutPromise);
    timeoutPromise = $timeout(function(){
      console.log("updating model: ", model.dropzones);

      if(model.dropzones != null){
        console.log(model.title);
        editKSA(model._id, model.title, model.dropzones);
      }
      $scope.modelAsJson = angular.toJson(model, true);
      // console.log($scope.modelAsJson)
    },delayInMs);
  }, true);

});


angular.module("demo").directive('ngElementReady', function() {
        return {
            priority: -1000, // a low number so this directive loads after all other directives have loaded.
            restrict: "KSA", // attribute only
            link: function($scope, $element, $attributes) {
                $scope.$eval($attributes.ngElementReady); // execute the expression in the attribute.
            }
        };
    });

function setupContainers(container){
  console.log("hi")
  // attachContextMenu(container, [])
}

// function attachContextMenu(element, options){
//   element.addEventListener('contextmenu', function(e) {
//
//       var clicked = function() { alert('Item clicked!') }
//
//       let items = [
//           { title: 'Add Sites', icon: 'ion-plus-round', fn: clicked },
//           { title: 'Reset Login', icon: 'ion-person', fn: clicked },
//           { title: 'Help', icon: 'ion-help-buoy', fn: clicked },
//           { title: 'Disabled', icon: 'ion-minus-circled', fn: clicked, disabled: true },
//           { title: 'Invisible', icon: 'ion-eye-disabled', fn: clicked, visible: false },
//           { },
//           { title: 'Logout', icon: 'ion-log-out', fn: clicked }
//       ]
//
//       console.log(e)
//
//       basicContext.show(items, e)
//
//   })
// }

// These are the routes for KSA CRUD functionality

//TAG Routes
// This function takes saves a screenshot to file
// and inserts a tag into mongo with the filepath
// of the corresponding video
function addTag(tag) {
  // var canvas = document.querySelector('canvas');
  var videoPlayer = videojs("video1");
  // var id = uuid.v1();
  // var filepath = ("./public/uploads/img/" + tag._id + "_temp.png")
  var imgData = "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"

  console.log("[creating tag: " + tag._id + "]")

  // var dataURL = canvas.toDataURL();
  $.ajax({
    url: '/saveImage',
    method: 'POST',
    data: { img: imgData, tagid: newTagID, temp: true},
    success: function( msg ){console.log( "[image data saved: " + msg + "]")}
  });

  $.ajax({
      url: '/mongo/tag',
      method: 'PUT',
      data: tag,
      success: function( msg ){console.log( "[tag data saved: " + msg + "]")}
    });
}

function deleteTag(tagID) {
  filter = 'find={"_id":"' + tagID;
  filter += '"}';
  $.ajax({
    url: "/mongo/tag",
    data: filter,
    type: 'DELETE',
    success: function(result) {
      console.log(result);
    }
  });

  $.ajax({
    url: "/deleteImage",
    data: { filepath: filepath, "tagID": tagID},
    type: 'DELETE',
    success: function(result) {
      console.log(result);
    }
  });
}

function editTag(tag) {
  filter = 'find={"_id":"' + tag._id;
  filter += '"}&update={"$set":' + angular.toJson(tag) + '}';
  $.ajax({
    url: "/mongo/tag/",
    data: filter,
    type: 'POST',
    success: function(result) {
      console.log('[editTag Success]');

    }
  });

}

function getTag(tagID){
  filter = 'find={"_id":"' + tagID;
  filter += '"}';
  $.ajax({
    url: "/mongo/tag",
    data: filter,
    type: 'GET',
    success: function(result) {
      console.log(result);
    }
  });
}


//Skill Routes
function addSkill(skill){
  $.ajax({
      url: '/mongo/skill',
      method: 'PUT',
      data: skill,
      success: function( msg ){alert( "Data Saved: " + msg );}
    });
}

function deleteSkill(skillID){
  filter = 'find={"_id":"' + skillID;
  filter += '"}';
  $.ajax({
    url: "/mongo/skill",
    data: filter,
    type: 'DELETE',
    success: function(result) {
      console.log(result);
    }
  });
}

function editSkill(skill){
  filter = 'find={"_id":"' + skill._id;
  filter += '"}&update={"$set":'+ angular.toJson(skill) +'}';
  $.ajax({
    url: "/mongo/skill/",
    data: filter,
    type: 'POST',
    success: function(result) {
      console.log('updated');

    }
  });
}

function getSkill(skillID){
  filter = 'find={"_id":"' + skillID;
  filter += '"}';
  $.ajax({
    url: "/mongo/skill",
    data: filter,
    type: 'GET',
    success: function(result) {
      console.log(result);
    }
  });
}

//KSA Routes
function addKSA(KSAID, title, KSA){
  KSA.contents.forEach(function(element, index, array){
    addSkill(element);
    element.columns.forEach(function(element, index, array){
      element.forEach(function(element, index, array){
        addTag(element);
      });
    });
  });
  KSA.title = title;
  KSA._id = KSAID;
  console.log(KSA)
  $.ajax({
      url: '/mongo/KSA',
      method: 'PUT',
      data: KSA,
      success: function( msg ){alert( "Data Saved: " + msg );}
    });
}

function deleteKSA(KSAID){
  filter = 'find={"_id":"' + KSAID;
  filter += '"}';
  $.ajax({
    url: "/mongo/KSA",
    data: filter,
    type: 'DELETE',
    success: function(result) {
      console.log(result);
    }
  });
}

function editKSA(KSAID, title, KSA){
  KSA.contents.forEach(function(element, index, array){
    editSkill(element);
    if(element.columns){
      element.columns.forEach(function(element, index, array){
        element.forEach(function(element, index, array){
          editTag(element);
        });
      });
    }
  });
  KSA.title = title;
  filter = 'find={"_id":"' + KSAID;
  filter += '"}&update={"$set":'+ angular.toJson(KSA) +'}';
  $.ajax({
    url: "/mongo/KSA/",
    data: filter,
    type: 'POST',
    success: function(result) {
      console.log('[editKSA Success]');

    }
  });
}

function getKSA(KSAID){
  filter = 'find={"_id":"' + KSAID;
  filter += '"}';
  $.ajax({
    url: "/mongo/KSA",
    data: filter,
    type: 'GET',
    success: function(result) {
      console.log(result);
    }
  });
}