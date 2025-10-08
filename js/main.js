document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {    
  	header: document.getElementById('header'),
    viewer: document.getElementById('viewer'),
    config: document.getElementById('config'),
    chapters: document.getElementById('chapters'),

    area: document.getElementById('area'),
    toc: document.getElementById('toc'),
    hideButtons: document.querySelectorAll('.hideButton'),
    nextButton: document.getElementById('nextButton'),
    prevButton: document.getElementById('prevButton'),
    backButton: document.getElementById('backButton'),
    addBookButton: document.getElementById('addBook'),
    configButton: document.getElementById('configButton'),
    closeChapter: document.getElementById('closeChapter'),
    chapterButton: document.getElementById('chapterButton'),
    closeConfigButton: document.getElementById('closeConfig'),
    inputFile: document.getElementById('inputFile'),
    buttonsConfig: document.querySelectorAll('.buttonConfig'),
    currentPageElement: document.getElementById('currentPage'),
    totalPageElement: document.getElementById('totalPage'),

    wakeLock: null,

    currentPage: 0,
    totalPages: 0,        

    configuration : {
      "background": "#fff",
      "color": "#000",
      "size": "100",
      "font": "Arial, Helvetica, sans-serif",
      "line": "100",
      "margin": "10",
    },

    changeSelect: function(configParam, configId) {      
        let selectorConfig = document.querySelectorAll('a[data-config='+ configParam +']');
        selectorConfig.forEach(function(btnItem) {
          btnItem.classList.remove('select');
        });
        document.getElementById(configId).classList.add('select');
    },

    changeConfig: function(e) {
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
      } else if (configParam === "line") {
        app.changeSelect(configParam, configId);

        if (configId === "plusLine") {
          app.configuration.line = parseInt(app.configuration.line) + 15;
          app.configuration.line = app.configuration.line > 200 ? 200 : app.configuration.line;
        } else if (configId === "minusLine") {
          app.configuration.line = parseInt(app.configuration.line) - 15;
          app.configuration.line = app.configuration.line < 50 ? 50 : app.configuration.line;
        } else if (configId === "normalLine") {
          app.configuration.line = "100";
        }
      } else if (configParam === "margin") {
        app.changeSelect(configParam, configId);

        if (configId === "plusMargin") {
          app.configuration.margin = parseInt(app.configuration.margin) + 5;
          app.configuration.margin = app.configuration.margin > 50 ? 50 : app.configuration.margin;
        } else if (configId === "minusMargin") {
          app.configuration.margin = parseInt(app.configuration.margin) - 5;
          app.configuration.margin = app.configuration.margin < -22 ? -22 : app.configuration.margin;
        } else if (configId === "normalMargin") {
          app.configuration.margin = "10";
        }
      }

      localStorage.setItem('_epubReader_config', JSON.stringify(app.configuration));
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

    showChapter: function() {
      app.chapters.classList.remove('hide');
    },
        
    hideChapter: function() {
      app.chapters.classList.add('hide');
    },

    toogleHideButton: function() {
      app.hideButtons.forEach(function(btn) {
        btn.classList.toggle('hide');
      });
    },

    renderTheme: function(rendition) {
      rendition.themes.register("theme", { "body": { 
          "background": app.configuration.background, 
          "color": app.configuration.color,
          "font-family":app.configuration.font,
          "line-height": app.configuration.line + "% !important",
          "line-height": app.configuration.line + "% !important",},
          "p" :{ "margin-left": app.configuration.margin + "px !important", 
                "margin-right": app.configuration.margin + "px !important" }
      });
      rendition.themes.select("theme");
      rendition.themes.fontSize(app.configuration.size+"%");
    },

    getHome: function(text) {
      //mostrar cabecera
      app.header.classList.remove('hide');
      //ocultar area
      app.viewer.classList.add('hide');

      if (app.wakeLock) {
        app.wakeLock.release();
        app.wakeLock = null;
      }
    },

    activarWakeLock: async function() {
      try {
        app.wakeLock = await navigator.wakeLock.request("screen");
        console.log("Wake Lock activado");
        
        app.wakeLock.addEventListener("release", () => {
          console.log("Wake Lock liberado");
        });
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    },


    createChapter: function(chapter, li) {
      // Limpiar label (espacios múltiples y saltos de línea)
      let cleanLabel = chapter.label.trim().replace(/\s+/g, " ");

      // Crear enlace
      let a = document.createElement("a");
      a.textContent = cleanLabel || `Capítulo ${index + 1}`;
      a.href = "#"; // Evitamos salto real
      a.addEventListener("click", (e) => {
        e.preventDefault();
        book.rendition.display(chapter.href);
        app.hideChapter();
      });

      li.appendChild(a);

      if(chapter.subitems != null && chapter.subitems.length > 0) {
        let olSub = document.createElement("ul");
        chapter.subitems.forEach((chapter, index) => {              
          let liSub = document.createElement("li");
          app.createChapter(chapter,liSub);
          olSub.appendChild(liSub);
        });

        li.appendChild(olSub);
      }
    },

    loadBook: function(text) {

      //ocultar cabecera
      app.header.classList.add('hide');
      //mostrar area
      app.viewer.classList.remove('hide');

      app.wakeLock = null;
      app.activarWakeLock();
      
      var book = ePub();
      book.open(text, "binary");
      var rendition = book.renderTo("area", {flow: "paginated"});

      app.renderTheme(rendition);

      book.ready.then(() => {

        let toc = book.navigation.toc;
        //console.log(toc);
        let ol = document.createElement("ul");

        let chaptersList = document.getElementById("chaptersList");
        chaptersList.innerHTML = "";

        toc.forEach((chapter, index) => {
          let li = document.createElement("li");
          app.createChapter(chapter,li);
          ol.appendChild(li);
          chaptersList.appendChild(ol);
        });

        book.locations.generate(1024);
        if (localStorage.getItem('_epubReader_' + book.key() + '-locations') === null) {
          rendition.display();
        } else {
          rendition.display(localStorage.getItem('_epubReader_' + book.key() + '-locations'));
        }

        app.nextButton.addEventListener("click", function(e) {
          book.package.metadata.direction === "rtl" ? rendition.prev() : rendition.next();
          e.preventDefault();
        }, false);

        app.prevButton.addEventListener("click", function(e) {
          book.package.metadata.direction === "rtl" ? rendition.next() : rendition.prev();
          e.preventDefault();
        }, false);

        app.closeConfigButton.addEventListener("click", function() {
            app.renderTheme(rendition);
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

        if (app.currentPage !== 0) {
          app.currentPageElement.innerHTML = app.currentPage;
        }
        if (app.totalPages !== 0) {
          app.totalPageElement.innerHTML = app.totalPages;
        }
        localStorage.setItem('_epubReader_' + book.key() + '-locations', locations.start.cfi);
      });
},

    getBook: function() {        
        app.inputFile.addEventListener('change',function(e) {
          app.area.innerHTML = "";

          var input = e.target.files[0];

          if (input !== null && input !== undefined) {           
            var reader = new FileReader();
            //console.log(input);
            reader.readAsArrayBuffer(input);
            reader.onload = function(){
              let text = reader.result;
              app.loadBook(text);
            }; 
          }

          app.inputFile.removeEventListener('change', function(){});
          app.inputFile.value = "";
    });
        app.inputFile.click();
  },

	init: function() {
    
    //Get book
    app.backButton.addEventListener('click', (e) => {
      app.getHome();
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


    app.chapterButton.addEventListener('click', (e) => {
      app.showChapter();
      e.preventDefault();
    });

    app.closeChapter.addEventListener('click', (e) => {
      app.hideChapter();
      e.preventDefault();
    });

    app.toc.addEventListener('click', (e) => {
      app.toogleHideButton();
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
      if (parseInt(configSave.line) == 100) {
        app.changeSelect("line", "normalLine");
      } else if (parseInt(configSave.line) > 100) {
        app.changeSelect("line", "plusLine");
      } else if (parseInt(configSave.line) < 100) {
        app.changeSelect("line", "minusLine");
      }
      if (parseInt(configSave.margin) == 10) {
        app.changeSelect("margin", "normalMargin");
      } else if (parseInt(configSave.margin) > 10) {
        app.changeSelect("margin", "plusMargin");
      } else if (parseInt(configSave.margin) < 10) {
        app.changeSelect("margin", "minusMargin");
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
