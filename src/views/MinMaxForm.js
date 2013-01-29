define(
  [
    "jquery",
    "backbone",
    "underscore",
    "_s",
    "../qtipUtil",
    "../validators",
],
function($, Backbone, _,  _s, qtipUtil, validators){

  var MinMaxFormView = Backbone.View.extend({

    initialize: function(opts){
      $.extend(true, {
        attrs: {
          min: 'min',
          max: 'max',
          minAuto: 'minauto',
          maxAuto: 'maxauto',
        },
        selectors: {
          min: '.min input[type="text"]',
          minAuto: '.min input[type="checkbox"]',
          max: '.max input[type="text"]',
          maxAuto: '.max input[type="checkbox"]',
        }
      }, opts);
      this.opts = opts;

      $(this.el).addClass('minmax-form');

      // Set initial properties on inputs.
      _.each(['min', 'max'], function(minmax){
        this.setMinMaxText(minmax);
        this.setMinMaxCheckbox(minmax);
      },this);

      // Listen for model changes.
      _.each(['min', 'max'], function(minmax){
        var minmaxAttr = this.opts.attrs[minmax];
        var autoAttr = this.opts.attrs[minmax + 'Auto'];
        this.model.on('change:' + minmaxAttr, function(){
          this.setMinMaxText(minmax)
        }, this);
        this.model.on('change:' + autoAttr, function(){
          this.setMinMaxCheckbox(minmax)
        }, this);
      }, this);

      // Listen for input changes.
      _.each(['min', 'max'], function(minmax){
        var _this = this;
        $(this.opts.selectors[minmax], this.el).on('change', {minmax: minmax}, function(e){
          _this.onMinMaxTextChange(e);
        });
        $(this.opts.selectors[minmax + 'Auto'], this.el).on('change', {minmax: minmax}, function(e){
          _this.onMinMaxCheckboxChange(e);
        });
      }, this);
    },

    onMinMaxTextChange: function(e){
      var _this = this;
      var mm = ['min', 'max'];
      var els = {};
      var rawVals = {};
      var valid = true;

      $.each(mm, function(i, minmax){
        els[minmax] = _this.getMinMaxElements(minmax);
        rawVals[minmax] = els[minmax].$text.val();
        // Check for number.
        if (! validators.isNumber(rawVals[minmax])){
          var $errorMsg = $(_s.sprintf(
            '<span>"%s" is not a number. <a href="javascript:{}">undo</a></span>',
            rawVals[minmax]
          ));
          $('a', $errorMsg).on('click', function(){_this.setMinMaxText(minmax)});
          els[minmax].$text.errorTip('show', $errorMsg);
          valid = false;
        }
        else{
          els[minmax].$text.errorTip('remove');
        }
      });

      if (! valid){
        return;
      }

      var parsedVals = {};
      $.each(mm, function(i, minmax){
        parsedVals[minmax] = parseFloat(rawVals[minmax], 10);
      });

      if (parsedVals['min'] >= parsedVals['max']){
        var minmax = e.data.minmax;
        var $errorMsg = $('<span>min must be &lt; max <a href="javascript:{}">undo</a></span>');
        $('a', $errorMsg).on('click', function(){_this.setMinMaxText(minmax)});
        els[minmax].$text.errorTip('show', $errorMsg);
        return;
      }

      $.each(els, function(minmax, minmaxEls){
        minmaxEls.$text.errorTip('remove');
      });

      var setObj = {};
      _.each(parsedVals, function(val, attr){
        setObj[this.opts.attrs[attr]] = val;
      }, this);
      this.model.set(setObj);
    },

    setMinMaxText: function(minmax){
      var minmaxEls = this.getMinMaxElements(minmax);
      minmaxEls.$text.val(this.model.get(this.opts.attrs[minmax]));
      minmaxEls.$text.errorTip('remove');
    },

    getMinMaxElements: function(minmax){
      var $text = $(this.opts.selectors[minmax], this.el);
      var $checkbox = $(this.opts.selectors[minmax + 'Auto'], this.el);
      return {
        $text: $text,
        $checkbox: $checkbox
      };
    },

    onMinMaxCheckboxChange: function(e){
      var minmax = e.data.minmax;
      var minmaxEls = this.getMinMaxElements(minmax);
      var autoAttr = this.opts.attrs[minmax + 'Auto'];
      if (minmaxEls.$checkbox.is(':checked')){
        this.model.set(autoAttr, true);
        minmaxEls.$text.attr('disabled', 'true');
        minmaxEls.$text.val(this.model.get(this.opts.attrs[minmax]));
        minmaxEls.$text.errorTip('remove');
      }
      else{
        minmaxEls.$text.removeAttr('disabled');
        this.model.set(autoAttr, false);
      }
    },

    setMinMaxCheckbox: function(minmax){
      var minmaxEls = this.getMinMaxElements(minmax);
      var autoAttr = this.opts.attrs[minmax + 'Auto'];
      if (this.model.get(autoAttr)){
        minmaxEls.$checkbox.attr('checked', 'checked');
        minmaxEls.$text.attr('disabled', 'true');
      }
      else{
        minmaxEls.$checkbox.removeAttr('checked');
        minmaxEls.$text.removeAttr('disabled');
      }
    }
  });

  return MinMaxFormView;
});

