/*************************************
//
// rolling-diff app
//
**************************************/


// use a query parameter to select starting pid
// or look for all of them.
var search = document.location.search;
var pidMatch = search.match(/[?&]pid=([^&$]+)/) || [];
var trafficid = pidMatch[1] || 'obd';



// connect to our socket server
var socket = io.connect('http://127.0.0.1:3000/', {query: "pid="+trafficid});
var app = app || {};


$(function () {

  //setup some common vars
  var $blastField = $('#blast'),
      $filterPids = $('#filterPids'),
      $allPostsTextArea = $('#allPosts'),
      $clearAllPosts = $('#clearAllChatter'),
      $clearAllPosts2 = $('#clearAllDiff');
      $sendBlastButton = $('#send'),
      prevMessage = '',
      knownPids = [];








  //SOCKET STUFF
  socket.on('pids', function (data) {
    var len = data.msg.length;

    $allPostsTextArea.text('');
    while (len--) {
      var id = data.msg[len];
      var $newPid = $('<p><a href="/?pid='+id+'">'+id+'</a></p>');

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

