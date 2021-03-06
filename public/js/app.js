/*************************************
//
// rolling-diff app
//
**************************************/


// use a query parameter to select starting pid
// or look for all of them.
var search = document.location.search;
var pidMatch = search.match(/[?&]id=([^&$]+)/) || [];
var trafficid = pidMatch[1] || 'id:*';



// connect to our socket server
var socket = io.connect('http://socketio-node-hydro.herokuapp.com', {query: "id="+trafficid});
var app = app || {};


$(function () {
  'use strict';

  //setup some common vars
  var $blastField = $('#blast'),
      $filterPids = $('#filterPids'),
      $allPostsTextArea = $('#allPosts'),
      $clearAllPosts = $('#clearAllChatter'),
      $clearAllPosts2 = $('#clearAllDiff'),
      $sendBlastButton = $('#send'),
      prevMessage = '',
      knownPids = [];








  //SOCKET STUFF
  socket.on('ids', function (data) {
    var len = data.msg.length;

    $allPostsTextArea.text('');
    while (len--) {
      var id = data.msg[len];
      var $newPid = $('<p><a href="/?id='+id+'">'+id+'</a></p>');

      $allPostsTextArea.append($newPid);
    }
  });

  socket.on(trafficid, diff);

  $clearAllPosts.click(function (e) {
    $allPostsTextArea.text('');
  });

  $clearAllPosts2.click(function (e) {
    $filterPids.text('');
  });


  // capture known pids
  function pid (data) {

    var len = data.known.length;
    while (len--) {

      $allPostsTextArea.append($newPid);

    }
  }

  // every diffed data row
  function diff (data) {
    var msg = new String(data.msg);
    var $newDiff = $('<p></p>')
        .append('<span class="pidChar">'+trafficid+'</span>');

    var cur = 0;
    var len = msg.length;


    while (cur <= len) {
      var color;
      var newchar = msg[cur];
      var prevchar = prevMessage[cur];

      var $chunk = $('<span></span>')
          .text(newchar)
          .addClass('diffChar');

      if (newchar != prevchar) {
        $chunk.addClass('newChar');
      }

      $newDiff.append($chunk);

      cur++;
    }

    $filterPids.prepend($newDiff);
    prevMessage = msg;
  }
});

