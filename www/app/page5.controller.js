const firebase = require("firebase");

module.exports = function ($scope) {

  //Create Prototype to generate hash code from string
  String.prototype.hashCode = function () {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
      var char = this.charCodeAt(i);
      hash = char + (hash << 6) + (hash << 16) - hash;
    }
    return hash;
  }

  $scope.currentroom = document.domain;
  $scope.nick = "Anon";
  $scope.rooms = [];
  $scope.messages = [];
  $scope.newMessage = {};

  //For localhost testing to add the port
  if (document.domain == 'localhost') {
    $scope.currentroom = $scope.currentroom + ':8080';
  }

  //Push the current domain to $scope.rooms so that the ng-model on ng-select selects the current room 
  $scope.rooms.push({
    url: $scope.currentroom,
    key: $scope.currentroom.hashCode()
  });

  //Firebase Config used to connect to your firebase app (cant download this under Firebase Project Settings)
  var config = {
    apiKey: "AIzaSyBnRqWBvsbR-5bnvaRAZZbJc_DQK2JzxHo",
    authDomain: "rabbiteer-bbb91.firebaseapp.com",
    databaseURL: "https://rabbiteer-bbb91.firebaseio.com",
    storageBucket: "rabbiteer-bbb91.appspot.com"
  };

  //Provider used to log into firebase (Can enable multipe providers under the Firebase Auth Section)
  //var providerGitHub = new firebase.auth.GithubAuthProvider();

  //Check if App is initialized if not initialize 
  if (firebase.apps.length == 0)
    firebase.initializeApp(config);

  //Database Reference to current chatroom
  var messagesdbRef = firebase.database().ref('/messages/').child($scope.currentroom.hashCode());
  //Database Reference to list of chat rooms
  var roomsRef = firebase.database().ref('/chat_rooms/');

  //Listen for authentication state changes
  firebase.auth().onAuthStateChanged(function (user) {

    //If the user is not undefined
    if (user) {
      // If the user is logged in, set the nickname and store the Firebase User for later use 
      if (user.displayName != undefined && user.displayName != null)
        $scope.nick = user.displayName;
      // If the user does not have a Displayname in Firebase lets use the email
      else if (user.email != undefined && user.email != null)
        $scope.nick = user.email;
      // If the user does not have a email either there is a good chance that the user logged in with Anonymous Authentication
      else
        $scope.nick = user.uid;

      $scope.user = user;
      $scope.$apply();

      //Register char room for current room (Domain)
      roomsRef.child($scope.currentroom.hashCode()).update({
        url: $scope.currentroom
      });

      //Add Listener for rooms when user has been authenticated
      roomsRef.on('child_added', function (data) {
        let room = data.val()

        //Push room info to rooms array
        if ($scope.currentroom != room.url) {
          $scope.rooms.push({
            key: data.key,
            url: room.url
          });
          $scope.$apply();
        }
      });

      //Add Listener for currentroom's messages when user has been authenticated
      messagesdbRef.on('child_added', function (data) {
        let message = data.val()

        //Push message info to messages array
        $scope.messages.push({
          id: data.key,
          current: message.userid == $scope.user.uid ? true : false,
          nick: message.nick,
          message: message.message
        });
        $scope.$apply();

      });

    }
  });

  //Saves a message to the current rooms message list on Firebase
  $scope.sendMessage = function (newMessage) {
    firebase.database().ref('/messages/').child($scope.currentroom.hashCode()).child($scope.randomCode()).set({
      userid: $scope.user.uid,
      nick: $scope.nick,
      message: newMessage.message
    }, function (e) {
      if (e != null)
        alert(e.message);
    });
    $scope.newMessage.message = "";
  }

  //Saves a message if the user presses enter on the input to the current rooms message list on Firebase
  $scope.sendMessageOnEnter = function (event, newMessage) {
    if (event.key === "Enter") {
      $scope.sendMessage(newMessage);
    }
  }

  /**
   * Firebase allows you to sign in with mutiple Provider`
   * 
   * Sign-in providers
   * Provider	Status	 
   * Email/Password  
   * Google  
   * Facebook  
   * Twitter  
   * GitHub  
   * Anonymous 
   * 
   * GitHub limits you to One Domain so for this demo we will use Anonymous Authentication
    //Call Auth for GitHub
    $scope.signInWithGitHub = function () {
      // Sign them in with GitHub
      firebase.auth().signInWithRedirect(providerGitHub);
    }
  **/

  //Call Auth for Anonymous sign in
  $scope.signInAnonymously = function () {
    // Sign them in with GitHub
    firebase.auth().signInAnonymously();
  }

  //Sign out from Firebase
  $scope.signOut = function () {
    firebase.auth().signOut();
    $scope.user = undefined;
  }

  //Change the chatroom to selected room
  $scope.changeChatRoom = function (room) {
    window.location.href = 'http://' + room.url + '/#/page5';
  }

  //Generate a Random Code to idetify the chat message
  $scope.randomCode = function () {
    return new Date().getTime();
  };

  //Check if user id Logged in
  $scope.isLoggedIn = function () {
    return $scope.user != undefined;
  }

  //Change your Displayname on your Firebase user
  $scope.changeDisplayName = function (displayname) {
    $scope.user.updateProfile({
      displayName: displayname
    }).then(function () {
      // Profile updated successfully!
      var displayName = $scope.user.displayName;
      $scope.nick = displayName;
      alert('Name successfully changed to ' + displayName);
    }, function (/*error*/) {
      // An error happened.
    });
  }


  //Change your Displaynameif the user presses enter on the input on your Firebase user
  $scope.changeDisplayNameOnEnter = function (event, displayname) {
    if (event.key === "Enter") {
      $scope.changeDisplayName(displayname);
    }
  }

}