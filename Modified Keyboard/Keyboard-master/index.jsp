<!DOCTYPE html>
<html>
<head>
<style>  
button.ui-keyboard-button {
  margin: 4px;
  height: 4em; 
  width : 4em;
}
.ui-keyboard button.ui-keyboard-space {
	width: 30em;
}

.ui-keyboard button.ui-keyboard-accept {
	width: 6em;
}
.ui-keyboard button.ui-keyboard-cancel {
	width: 6em;
}
.ui-keyboard button.ui-keyboard-enter {
	width: 10em;
}
.ui-keyboard button.ui-keyboard-tab {
	width: 6em;
}

.ui-keyboard button.ui-keyboard-bksp {
	width: 6em;
}
.ui-keyboard button.ui-keyboard-shift {
	width: 6em;
}
</style>
<meta charset="utf-8">
	<title>Virtual Keyboard</title>
	<!-- jQuery (required) & jQuery UI + theme (optional) -->
	<link href="docs/css/jquery-ui.min.css" rel="stylesheet">
	<!-- still using jQuery v2.2.4 because Bootstrap doesn't support v3+ -->
	<script src="docs/js/jquery-latest.min.js"></script>
	<script src="docs/js/jquery-ui.min.js"></script>
	<script src="docs/js/jquery-migrate-3.0.0.min.js"></script> 

	<!-- keyboard widget css & script (required) -->
	<link href="css/keyboard.css" rel="stylesheet">
	<script src="js/jquery.keyboard.js"></script>

	<!-- keyboard extensions (optional)-->
	<script src="js/jquery.mousewheel.js"></script>
	<script src="js/jquery.keyboard.extension-typing.js"></script>
	<script src="js/jquery.keyboard.extension-autocomplete.js"></script>
	<script src="js/jquery.keyboard.extension-caret.js"></script> 

	<!-- demo only -->
	<link rel="stylesheet" href="docs/css/bootstrap.min.css">
	<link rel="stylesheet" href="docs/css/font-awesome.min.css">
	<link href="docs/css/demo.css" rel="stylesheet">
	<link href="docs/css/tipsy.css" rel="stylesheet">
	<link href="docs/css/prettify.css" rel="stylesheet">
	<script src="docs/js/bootstrap.min.js"></script>
	<script src="docs/js/demo.js"></script>
	<script src="docs/js/jquery.tipsy.min.js"></script>
	<script src="docs/js/prettify.js"></script> <!-- syntax highlighting -->
		
</head>
<body>
<div id="page-wrap">
	<h1>
		Virtual Keyboard<br>
	</h1>
	<div id="wrap">
  <input id="keyboard" type="text" />
</div>
	<div id="showcode"></div>
	<div id="footer"></div>
</div>
<script>
$(function(){
  // milliseconds before a hovered key is first typed
  var regularKeyHoverTimer = 200;
  
  // milliseconds (ms) unitl the hover key starts repeating
  var regularKeyHoverRepeat = 1000;
  // approximate repeat rate in characters per second
  var regularKeyRepeatRate = 3;
  // milliseconds before an action (shift, accept & cancel) is performed
  // we don't want to repeat action keys!
  var actionKeyHoverTimer = 1000;

  var internalTimer, lastKey;

  function startTimer($key, isAction) {
    clearTimeout(internalTimer);
    // if it's an action key, wait longer AND do not repeat
    internalTimer = setTimeout(function() {
      // use 'mousedown' to trigger typing
      $key.trigger('mousedown');
    }, isAction ? actionKeyHoverTimer : regularKeyHoverTimer);
  }
  
  $('#keyboard').keyboard({
    // open the keyboard popup on input mouseenter
    //openOn: 'mouseenter',
    repeatDelay: regularKeyHoverRepeat,
    repeatRate: regularKeyRepeatRate,
    visible: function(event, keyboard) {
      keyboard.$keyboard.find('button')
        .on('mouseenter', function(event) {
          var $key = $(this),	  
            action = $key.attr('data-action'),
            isAction = action in $.keyboard.keyaction;
          // don't repeat action keys
          if (isAction && keyboard.last.key === action) return;
          startTimer($key, isAction);
        })
        .on('mouseleave', function() {
          clearTimeout(internalTimer);
        });
      },
      hidden: function() {
        clearTimeout(internalTimer);
      }
    });
});
</script>
</body>
</html>
