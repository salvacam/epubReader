document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {  
  	note: document.getElementById('note'),
  	clearNotes: document.getElementById('clearNotes'),
  	modalClear: document.getElementById('modalClear'),
  
  	init: function() {  		
  		app.note.addEventListener('keyup',
  			() => { setTimeout(function(){ localStorage.setItem("_note", app.note.value); }, 500) }
		);
		
  		if(localStorage.getItem("_note") && localStorage.getItem("_note")!=''){
    		var noteItem = localStorage.getItem("_note");
    		app.note.value = noteItem;
  		}

	  	app.clearNotes.addEventListener('click', () => {
	  		app.modalClear.classList.remove('hide');
        app.note.blur();

  			document.getElementById('okClear').addEventListener('click', () => {
				  app.modalClear.classList.add('hide');
		    	app.note.value = '';
		    	localStorage.setItem("_note", '');
          app.note.focus();
				  document.getElementById('okClear').removeEventListener('click', ()=> {});
  			});

  			document.getElementById('closeClear').addEventListener('click', () => {  				
				  app.modalClear.classList.add('hide');
          app.note.focus();
				  document.getElementById('closeClear').removeEventListener('click', ()=> {});
  			});


		    
		});

		if ('serviceWorker' in navigator) {
      		navigator.serviceWorker
        		.register('service-worker.js')
        		.then(function() {
          		//console.log('Service Worker Registered');
        	});
		}
  	}
};
