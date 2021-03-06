require(
  [
    "jquery",
    "rless!Util/styles/qtipUtil.less",
    "Util/views/PlusMinusForm",
],
function($, qTipUtilCSS, MinMaxFormView){
  $(document).ready(function(){
    $(document.body).append('<p id="stylesLoaded" style="display: none;"></p>');
    cssEl = document.createElement('style');
    cssEl.id = 'rless';
    cssEl.type = 'text/css';
    cssText = qTipUtilCSS + "\n#stylesLoaded {position: fixed;}\n";
    if (cssEl.styleSheet){
      cssEl.styleSheet.cssText = cssText;
    }
    else{
      cssEl.appendChild(document.createTextNode(cssText));
    }
    document.getElementsByTagName("head")[0].appendChild(cssEl);

    var cssDeferred = $.Deferred();
    var cssInterval = setInterval(function(){
      $testEl = $('#stylesLoaded');
      var pos = $testEl.css('position');
      if (pos == 'fixed'){
        clearInterval(cssInterval);
        cssDeferred.resolve();
      }
      else{
        console.log('loading styles...', pos);
      }
    }, 500);

    cssDeferred.done(function(){
      var mmModel = new Backbone.Model({
        mid: 0,
        r: 1
      });
      var mmView = new MinMaxFormView({
        model: mmModel,
        el: $('#main'),
        attrs: {
          mid: 'mid',
          r: 'r',
          midAuto: 'midAuto',
          rAuto: 'rAuto'
        },
        selectors: {
          mid: '.mid input[type="text"]',
          r: '.r input[type="text"]',
          midAuto: '.mid input[type="checkbox"]',
          rAuto: '.r input[type="checkbox"]',
        }
      });
    });
  });
}
);
