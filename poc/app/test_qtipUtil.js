require(
  [
    "jquery",
    "rless!Util/styles/qtipUtil.less",
    "Util/qtipUtil"
  ],
  function($, qtipUtilCSS, qtipUtil){
    $(document).ready(function(){
      $(document.body).append('<p id="stylesLoaded" style="display: none;"></p>');
      cssEl = document.createElement('style');
      cssEl.id = 'rless';
      cssEl.type = 'text/css';
      cssText = qtipUtilCSS + "\n#stylesLoaded {position: fixed;}\n";
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
        var $text1 = $('#text1');
        var text1Counter = 0;
        $text1.on('change', function(e){
          text1Counter += 1;
          if (text1Counter % 2){
            $text1.errorTip('show', $text1.attr('value'));
          }
          else{
            $text1.errorTip('remove');
          }
        });
      });
    });
  }
);
