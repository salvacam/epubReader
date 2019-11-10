document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {    
  	header: document.getElementById('header'),
    viewer: document.getElementById('viewer'),
    config: document.getElementById('config'),

    nextButton: document.getElementById('nextButton'),
    prevButton: document.getElementById('prevButton'),
    backButton: document.getElementById('backButton'),
    addBookButton: document.getElementById('addBook'),
    configButton: document.getElementById('configButton'),
    closeConfigButton: document.getElementById('closeConfig'),
    inputFile: document.getElementById('inputFile'),
    buttonsConfig: document.querySelectorAll('.buttonConfig'),

    currentPage: 0,
    totalPages: 0,        

    configuration : {
      "background": "#fff",
      "color": "#000",
      "size": "100",
      "font": "Arial, Helvetica, sans-serif",
      "line-height": "",
      "margin": "",
    },

    changeSelect: function(configParam, configId) {      
        let selectorConfig = document.querySelectorAll('a[data-config='+ configParam +']');
        selectorConfig.forEach(function(btnItem) {
          btnItem.classList.remove('select');
        });
        document.getElementById(configId).classList.add('select');
    },

    changeConfig: function(e) {


//debugger;

      let configParam = e.target.getAttribute('data-config');
      let configId = e.target.getAttribute('id');
      
      if (configParam === "theme") {
        app.changeSelect(configParam, configId);

        if (configId === "themeDark") {
          app.configuration.background = "#000";
          app.configuration.color = "#fff";
        } else if (configId === "themeLight") {
          app.configuration.background = "#fff";
          app.configuration.color = "#000";
        }

      } else if (configParam === "font") {
        app.changeSelect(configParam, configId);

        if (configId === "serifFont") {
          app.configuration.font = "Times, serif";
        } else if (configId === "sansFont") {
          app.configuration.font = "Arial, Helvetica, sans-serif";
        }

      } else if (configParam === "size") {
        app.changeSelect(configParam, configId);

        if (configId === "plusSize") {
          app.configuration.size = parseInt(app.configuration.size) + 15;
          app.configuration.size = app.configuration.size > 200 ? 200 : app.configuration.size;
        } else if (configId === "minusSize") {
          app.configuration.size = parseInt(app.configuration.size) - 15;
          app.configuration.size = app.configuration.size < 50 ? 50 : app.configuration.size;
        } else if (configId === "normalSize") {
          app.configuration.size = "100";
        }

      }

      localStorage.setItem('_epubReader_config', JSON.stringify(app.configuration));

    /*
    rendition.themes.default({
      h2: {
        'font-size': '32px',
        color: 'purple'
      },
      p: {
        "margin": '10px'
      }
    });
    rendition.themes.select("tan");
    rendition.themes.fontSize("140%");


    

    rendition.themes.register("purple", { "body": { "background": "purple"}, "p":{ "margin-left":"0em !important" } });
    rendition.themes.select("purple");

    padding-left padding-right

    rendition.themes.register("purple", { "body": { "background": "purple", "line-height":"1em", "padding-left":"1em", "padding-right":"0em"}, "p":{ "margin-left":"0em !important" } });
    rendition.themes.select("purple");
      */
    },

    showConfig: function() {
      app.config.classList.remove('hide');

      app.buttonsConfig.forEach(function(btn) {
        btn.addEventListener('click', app.changeConfig);
      });
    },
        
    hideConfig: function() {
      app.config.classList.add('hide');

      app.buttonsConfig.forEach(function(btn) {
        btn.removeEventListener('click', app.changeConfig);
      });
    },

    renderTheme: function(rendition) {
      rendition.themes.register("theme", { "body": { 
          "background": app.configuration.background, 
          "color": app.configuration.color,
          "font-family":app.configuration.font}
      });
      rendition.themes.select("theme");
      rendition.themes.fontSize(app.configuration.size+"%");
    },

    loadBook: function(text) {

      //ocultar cabecera
      app.header.classList.add('hide');
      //mostrar area
      app.viewer.classList.remove('hide');

      var book = ePub();
      book.open(text, "binary");
      var rendition = book.renderTo("area", {flow: "paginated"});

      //render theme
      app.renderTheme(rendition);

      book.ready.then(() => {

        book.locations.generate(1024);
        if (localStorage.getItem('_epubReader_' + book.key() + '-locations') === null) {
          rendition.display();
        } else {
          rendition.display(localStorage.getItem('_epubReader_' + book.key() + '-locations'));
        }

        app.nextButton.addEventListener("click", function(e){
          book.package.metadata.direction === "rtl" ? rendition.prev() : rendition.next();
          e.preventDefault();
        }, false);

        app.prevButton.addEventListener("click", function(e){
          book.package.metadata.direction === "rtl" ? rendition.next() : rendition.prev();
          e.preventDefault();
        }, false);

        app.closeConfigButton.addEventListener("click", function(){          
            //render theme
            app.renderTheme(rendition);
      /*
          //Render theme
          rendition.themes.register("theme", { "body": { 
            "background": app.configuration.background, 
            "color": app.configuration.color,
            "font-family":app.configuration.font}
          });
          rendition.themes.select("theme");
          rendition.themes.fontSize(app.configuration.size+"%");
*/

        }, false);

        let keyListener = function(e) {
          // Left Key
          if ((e.keyCode || e.which) == 37) {
            book.package.metadata.direction === "rtl" ? rendition.next() : rendition.prev();
          }

          // Right Key
          if ((e.keyCode || e.which) == 39) {
            book.package.metadata.direction === "rtl" ? rendition.prev() : rendition.next();
          }
        };

        rendition.on("keyup", keyListener);
        document.addEventListener("keyup", keyListener, false);
      });

      rendition.on('relocated', function(locations) {
        app.currentPage = book.locations.locationFromCfi(locations.start.cfi);
        app.totalPages = book.locations.total;
        //console.log('Current Page:', app.currentPage); //book.locations.locationFromCfi(locations.start.cfi));
        //console.log('Total Pages:', app.totalPages); //book.locations.total);
        localStorage.setItem('_epubReader_' + book.key() + '-locations', locations.start.cfi);//book.locations.save());
      });
},

    getBook: function() {
      //TODO leer libro del disco duro
        
        app.inputFile.addEventListener('change',function(e) {

/*
          if(window.FileReader) {
                    var file  = e.target.files[0];
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        var image = new Image;
                        image.src = e.target.result;
                        image.onload = function() {// Do something}
                    }
          }
*/
          var input = e.target.files[0];

          //TODO check tipo
          //input.type
          //"application/epub+zip"

          var reader = new FileReader();
          console.log(input);
          reader.readAsArrayBuffer(input);
          reader.onload = function(){
            //debugger;
            let text = reader.result;
            app.loadBook(text);
              
            //debugger;
          };
          //reader.readAsArrayBuffer(input);
          //reader.readAsText(input.files[0]);
          app.inputFile.removeEventListener('change', function(){});
          app.inputFile.value = "";
    });
        app.inputFile.click();
  },

	init: function() {
    
    //Get book
    app.backButton.addEventListener('click', (e) => {
      app.getBook();
      e.preventDefault();
    });      
    app.addBookButton.addEventListener('click', (e) => {
      app.getBook();
      e.preventDefault();
    });

    app.configButton.addEventListener('click', (e) => {
      app.showConfig();
      e.preventDefault();
    });

    app.closeConfigButton.addEventListener('click', (e) => {
      app.hideConfig();
      e.preventDefault();
    });

    if(localStorage.getItem('_epubReader_config')) {
      let configSave = JSON.parse(localStorage.getItem('_epubReader_config'))
      app.configuration = configSave;
      if (parseInt(configSave.size) == 100) {
        app.changeSelect("size", "normalSize");
      } else if (parseInt(configSave.size) > 100) {
        app.changeSelect("size", "plusSize");
      } else if (parseInt(configSave.size) < 100) {
        app.changeSelect("size", "minusSize");
      }
      if (configSave.color === "#fff") {
        app.changeSelect("theme", "themeDark");
      } else if (configSave.color === "#000") {
        app.changeSelect("theme", "themeLight");
      }
      if (configSave.font === "Times, serif") {
        app.changeSelect("font", "serifFont");
      } else if (configSave.font === "Arial, Helvetica, sans-serif") {
        app.changeSelect("font", "sansFont");
      }
    }
      

		if ('serviceWorker' in navigator) {
      		navigator.serviceWorker
        		.register('service-worker.js')
        		.then(function() {
          		//console.log('Service Worker Registered');
        	});
		}
	}
};
