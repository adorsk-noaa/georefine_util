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

  var PlusMinusFormView = Backbone.View.extend({

    initialize: function(opts){
      $.extend(true, {
        attrs: {
          mid: 'mid',
          r: 'r',
          auto: 'auto',
        },
        selectors: {
          mid: '.mid input[type="text"]',
          r: '.r input[type="text"]',
          auto: '.auto input[type="checkbox"]',
        }
      }, opts);
      this.opts = opts;

      $(this.el).addClass('plusminus-form');

      // Set initial properties on inputs.
      _.each(['mid', 'r'], function(attr){
        this.setText(attr);
      }, this);
      this.setCheckbox('auto');

      // Listen for model changes.
      _.each(this.opts.attrs, function(attr, mappedAttr){
        var fn;
        if (attr == 'auto'){
          fn = function(){this.setCheckbox(attr)};
        }
        else{
          fn = function(){this.setText(attr)};
        }
        this.model.on('change:' + mappedAttr, fn, this);
      }, this);

      // Listen for input changes.
      _.each(this.opts.attrs, function(attr){
        var _this = this;
        if (attr == 'auto'){
          $(this.opts.selectors[attr], this.el).on('change', {attr: attr}, function(e){
            _this.onCheckboxChange(e);
          });
        }
        else{
          $(this.opts.selectors[attr], this.el).on('change', {attr: attr}, function(e){
            _this.onTextChange(e);
          });
        }
      }, this);
    },

    onTextChange: function(e){
      var _this = this;
      var els = {};
      var rawVals = {};
      var valid = true;

      _.each(['mid', 'r'], function(attr){
        els[attr] = _this.getElements(attr);
        rawVals[attr] = els[attr].$text.val();
        // Check for number.
        if (! validators.isNumber(rawVals[attr])){
          var $errorMsg = $(_s.sprintf(
            '<span>"%s" is not a number. <a href="javascript:{}">undo</a></span>',
            rawVals[attr]
          ));
          $('a', $errorMsg).on('click', function(){_this.setText(attr)});
          els[attr].$text.errorTip('show', $errorMsg);
          valid = false;
        }
        else{
          els[attr].$text.errorTip('remove');
        }
      });

      if (! valid){
        return;
      }

      var parsedVals = {};
      _.each(this.opts.attrs, function(attr){
        parsedVals[attr] = parseFloat(rawVals[attr], 10);
      }, this);

      $.each(els, function(attr, attrEls){
        attrEls.$text.errorTip('remove');
      });

      var setObj = {};
      _.each(parsedVals, function(val, attr){
        setObj[this.opts.attrs[attr]] = val;
      }, this);
      this.model.set(setObj);
    },

    setText: function(attr){
      var attrEls = this.getElements(attr);
      attrEls.$text.val(this.model.get(this.opts.attrs[attr]));
      attrEls.$text.errorTip('remove');
    },

    getElements: function(attr){
      if (attr == 'auto'){
        return {
          $checkbox: $(this.opts.selectors[attr], this.el),
        };
      }
      else{
        return {
          $text: $(this.opts.selectors[attr], this.el),
        };
      }
    },

    disableTextEls: function(){
      _.each(['mid', 'r'], function(textAttr){
        var textEls = this.getElements(textAttr);
        textEls.$text.attr('disabled', 'true');
        textEls.$text.errorTip('remove');
      }, this);
    },

    enableTextEls: function(){
      _.each(['mid', 'r'], function(textAttr){
        var textEls = this.getElements(textAttr);
        textEls.$text.removeAttr('disabled');
      }, this);
    },

    onCheckboxChange: function(e){
      var attr = e.data.attr;
      var attrEls = this.getElements(attr);
      var checked = attrEls.$checkbox.is(':checked');
      if (checked){
        this.disableTextEls();
      }
      else{
        this.enableTextEls();
      }
      this.model.set(this.opts.attrs[attr], checked);
    },

    setCheckbox: function(attr){
      var attrEls = this.getElements(attr);
      if (this.model.get(this.opts.attrs[attr])){
        attrEls.$checkbox.attr('checked', 'checked');
        this.disableTextEls();
      }
      else{
        attrEls.$checkbox.removeAttr('checked');
        this.enableTextEls();
      }
    }
  });

  return PlusMinusFormView;
});

