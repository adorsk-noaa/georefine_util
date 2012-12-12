if (typeof ASSETS_PATH == 'undefined'){
  ASSETS_PATH = '';
}

if (typeof BASE_URL == 'undefined'){
  BASE_URL = '';
}

var config= {
  baseUrl: BASE_URL,
  deps: [],
  paths: {
    requireLib: ASSETS_PATH + "/js/require",
    text: ASSETS_PATH + "/js/requirejs-text",
    rless: ASSETS_PATH + "/js/rless",
    less: ASSETS_PATH + "/js/less.js/dist/less-1.3.1",
    jquery: ASSETS_PATH + "/js/jquery",
  },

  shim: {
    qtip: {
      deps: ["jquery"]
    }
  },

  packages: [
  {
    "name": "Util",
    "location": BASE_URL + "/../src"
  },
  {
    "name": "qtip",
    "location": ASSETS_PATH + "/js/jquery.qtip",
    "main": "jquery.qtip",
  }
  ]

};

if (typeof require == 'undefined'){
  require = {};
}
for (var k in config){
  require[k] = config[k]
}
