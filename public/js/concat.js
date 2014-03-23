// connect to our socket server
var socket = io.connect('http://127.0.0.1:3000/');
var app = app || {};


$(function () {




  //setup some common vars
  var $blastField = $('#blast'),
      $filterPids = $('#filterPids'),
      $allPostsTextArea = $('#allPosts'),
      $clearAllPosts = $('#clearAllChatter'),
      $sendBlastButton = $('#send'),
      prevMessage = '',
      $clearAllPosts2 = $('clearAllDiff');






  //SOCKET STUFF
  socket.on("blast", function (data) {

    var filterPid = $('#filter')[0].value;
    if (filterPid && filterPid == data.pid) {
      diff(data);
    } else {
      standard(data);
    }

  });


  $clearAllPosts.click(function (e) {
    $allPostsTextArea.text('');
  });

  $clearAllPosts2.click(function (e) {
    $allPostsTextArea.text('');
  });



  // this is any data row not diffed
  function standard (data) {
    var $newDiff = $('<p></p>')
        .append('<span class="pidChar">'+data.pid+'</span>');

    var $chunk = $('<span></span>')
        .text(data.msg)
        .addClass('diffChar')

    $newDiff.append($chunk);
    $allPostsTextArea.prepend($newDiff);
  }




  // every diffed data row
  function diff (data) {
    var msg = new String(data.msg);
    var $newDiff = $('<p></p>')
        .append('<span class="pidChar">'+data.pid+'</span>');

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

      cur++
    }

    $filterPids.prepend($newDiff);
    prevMessage = msg;
  }
});

