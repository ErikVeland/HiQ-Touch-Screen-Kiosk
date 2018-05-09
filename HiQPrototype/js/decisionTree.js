var timeout = 200000; // Default timeoutout
var t;

$(document).ready(function()
    {
var branchHistory = []; // for storing history

// gather querystring params
var params = document.location.search.substr(1).split('&');
if(params[0] != ''){ loadData(params[0]); }

setActive();

function smoothScroll(targetBranch){
	console.log(targetBranch);
	  
}

clearTimeout(t);
resetTimer(timeout);


// to be replaced with Motti keyboard
$("#name").click(function() {
  $("#virtualKeyboard").show("fast");
  console.log('Keyboard');
});

// handle branch link clicks
$('.nav-button').click(function(e){
  e.preventDefault();
  targetBranch = $(this).attr('href');
  
  if (undefined == targetBranch) {
  	targetBranch = $(e.target).attr('href');
  	console.log(targetBranch + ' activated');
  }
  console.log(targetBranch + ' activated');
  
  branchHistory.push('#'+$('.tree li.active').attr('id'));
  console.log(branchHistory);
  
  $('.tree li.active').removeClass('active').removeClass('inactive').addClass('previous');
  $(targetBranch).addClass('active').removeClass('inactive');
  addBackTo(targetBranch);
  
  
  
  setTime = $(targetBranch).attr('data-timeout');
  console.log("This screen has a new timeout of: " + setTime/1000) + " seconds";
  inactivityTime(setTime);

});

// handle back link clicks


$('.tree').on('click', 'a.back-branch', function(e){
  e.preventDefault();
  $('.tree li.active').removeClass('active').addClass('inactive');
  targetBranch = branchHistory.pop();
  console.log(branchHistory);
  
  $(targetBranch).removeClass('previous').addClass('active');
  addBackTo(targetBranch);
});

function addBackTo(targetBranch){
  $('a.back-branch').remove();
  $('a.cancel').remove();
  if(branchHistory.length > 0){
    $(targetBranch).append(
      '<a href="#" class="back-branch"><i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i></a><a href="#" class="cancel"><i class="fa fa-times-circle-o" aria-hidden="true"></i></a>'
    );
  }
}

// jump to specified branch, if provided
function setActive(){
  if(params.length > 1){
    $('#'+params[1]).addClass('active');
    console.log(params[1]);
  }else{
    $('.tree>li:first-child').addClass('active');
  }
}

$(window).on('hashchange', function (e) {
	e.preventDefault();
	targetBranch = location.hash;
	
	console.log(targetBranch);
	  branchHistory.push('#'+$('.tree li.active').attr('id'));
	  $('.tree li.active').removeClass('active').removeClass('inactive').addClass('previous');
	  $(targetBranch).addClass('active').removeClass('inactive');
	  addBackTo(targetBranch);
	  $('.tree li').each(function() {
	        if (!$(this).hasClass('inactive') && !$(this).hasClass('active') && !$(this).hasClass('previous')) {
	            $(this).addClass('inactive')
	        }
	    });
});


});


// WIP - Doesn't reset to anything but default

$(document).on('mousemove', function() {
	clearTimeout(t);
	if (typeof setTime === 'undefined') {
		var timeout = 20000;
		resetTimer(timeout);
	}
	else {
		    var time = setTime;
		    console.log("New time set: " + timeout/1000 + " seconds");
		    resetTimer(timeout);
	}
});

$(document).on('keypress', function() {	
	clearTimeout(t);
	inactivityTime(setTime);
	resetTimer(timeout);
});

$(document).on('mousedown', function() {
	clearTimeout(t);
	if (typeof setTime === 'undefined') {
		var timeout = 20000;
	}
	else {
		    var timeout = setTime;
		    console.log("New time set: " + timeout/1000 + " seconds");
		    resetTimer(timeout);
	}
});

var inactivityTime = function () {
	
		if (typeof setTime === 'undefined') {
			var timeout = 20000;
		}
		else {
			    var timeout = setTime;
			    console.log("New time set: " + timeout/1000 + " seconds");
		}
};

function logout() {
	console.log("You were logged out after " + timeout/1000 + " seconds of inactivity" );
	location.href = 'showTree.html';
}

function resetTimer() {
			console.log("Resetting time to " + timeout/1000);
			t = setTimeout(logout, timeout);
			// 1000 milisec = 1 sec
		}




if (window.location.hash) {
    $(window).trigger('hashchange')
}


// load XML data
function loadData(id){
  $.ajax({
    type: "GET", 
    url: "xml/tree" + id + ".xml", 
    dataType: "xml", 
    success: function(xml){
      buildHTML(xml);
    }
  });
}

// construct HTML from XML (likely can be simplfied)
function buildHTML(xml){
  $('.tree').empty();
  $(xml).find('branch').each(
    function(){
      branchID = dasherize($(this).attr('id'));
      $('.tree').append(
        '<li id="branch-'+branchID+'">'
          +'<p>'+$(this).find('content').html()+'</p>'
        +'</li>'
      );
      if($(this).find('fork').length > 0){
        html = '<ul>';
        $(this).find('fork').each(
          function(){
            targetID = dasherize($(this).attr('target'));
            html += '<li><a href="#branch-'+targetID+'">';
            html += $(this).text();
            html += '</a></li>';
          }
        );
        html += '</ul>';
        $('#branch-'+branchID).append(html);
      }
    }
  );
  setActive();
}

// helper to remove dots from branchIDs so jQuery doesn't try to be too clever
function dasherize(str){
  return str.replace(/\.+/g,'-');
}


$(function(){
    $('.keyboard-name1').keyboard({
        usePreview: false,
        layout: 'custom',
        autoAccept: true,
        enterNavigation:true,
        appendTo: '.onScreenKeyboard1',
        stayOpen : true,
        customLayout : {
            'normal': [
                'q w e r t y u i o p {b}',
                'a s d f g h j k l {enter}',
                '{shift} z x c v b n m - \' {shift}',
                '{space}'
            ],
            'shift': [
                'Q W E R T Y U I O P {b}',
                'A S D F G H J K L {enter}',
                '{shift} Z X C V B N M - \' {shift} ',
                '{space}'
            ]
        }
    })
});


$(function(){
    $('.keyboard-name2').keyboard({
        usePreview: false,
        layout: 'custom',
        autoAccept: true,
        enterNavigation:true,
        appendTo: '.onScreenKeyboard2',
        stayOpen : true,
        customLayout : {
            'normal': [
                'q w e r t y u i o p {b}',
                'a s d f g h j k l {enter}',
                '{shift} z x c v b n m - \' {shift}',
                '{space}'
            ],
            'shift': [
                'Q W E R T Y U I O P {b}',
                'A S D F G H J K L {enter}',
                '{shift} Z X C V B N M - \' {shift} ',
                '{space}'
            ]
        }
    })
});

$(function(){
    $('.keyboard-numpad').keyboard({
        usePreview: false,
        layout: 'custom',
        autoAccept: true,
        enterNavigation:true,
        stayOpen : true,
        appendTo: '.onScreenKeyboard1',
        customLayout : {
            'normal': [
                '7 8 9',
                '4 5 6',
                '1 2 3',
                '{empty} 0 {b}'
            ]
        }
    })
});
