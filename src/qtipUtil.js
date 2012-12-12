define(
  [
    "jquery",
    "qtip"
],
function($, qtip){
  $.fn.errorTip = function(){
    var action = arguments[0];
    if (action == 'show'){
      this.qtip({
        content: {
          text: arguments[1]
        },
        position: {
          my: 'top center',
          at: 'bottom center',
          adjust: {y: 5}
        },
        show: {
          ready: true
        },
        hide: false,
        style: {
          classes: 'errortip'
        }
      });
    }
    else if (action == 'remove'){
      this.qtip('destroy');
    }
  }
  return {};
});

