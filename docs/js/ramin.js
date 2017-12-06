
$( document ).ready(function() {
	
	// used to simulate click function on the element
	var timer = '';
	$( document ).on( 'mouseover', '.hoverClickable', function(e){	
		var hoveredElement = $(this).attr('id');
			timer2 =  setTimeout(function() {
			   // trigger the click after 1.5 seconds
				console.log(hoveredElement);
				$("#" + hoveredElement)[0].click();

	}, 1500);
	});
		$( document ).on( 'mouseout', '.hoverClickable', function(e){
			clearInterval(timer);
	});
	
	
});