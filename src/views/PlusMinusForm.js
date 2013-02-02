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
      var mergedOpts = {};
      $.extend(true, mergedOpts, {
        attrs: {
          mid: 'vmid',
          r: 'r',
          midAuto: 'midAuto',
          rAuto: 'rAuto',
        },
        selectors: {
          mid: '.mid input[type="text"]',
          midAuto: '.mid input[type="checkbox"]',
          r: '.r input[type="text"]',
          rAuto: '.r input[type="checkbox"]',
        }
      }, opts);
      this.opts = mergedOpts;

      this.attrs = ['mid', 'r'];

      $(this.el).addClass('plusminus-form');

      // Set initial properties on inputs.
      _.each(this.attrs, function(attr){
        this.setText(attr);
        this.setCheckbox(attr);
      },this);

      // Listen for model changes.
      _.each(this.attrs, function(attr){
        var mappedAttr = this.opts.attrs[attr];
        var autoAttr = this.opts.attrs[attr + 'Auto'];
        this.model.on('change:' + mappedAttr, function(){
          this.setText(attr)
        }, this);
        this.model.on('change:' + autoAttr, function(){
          this.setCheckbox(attr)
        }, this);
      }, this);

      // Listen for input changes.
      _.each(this.attrs, function(attr){
        var _this = this;
        $(this.opts.selectors[attr], this.el).on('change', {attr: attr}, function(e){
          _this.onTextChange(e);
        });
        $(this.opts.selectors[attr+ 'Auto'], this.el).on('change', {attr: attr}, function(e){
          _this.onCheckboxChange(e);
        });
      }, this);
    },

    onTextChange: function(e){
      var _this = this;
      var els = {};
      var rawVals = {};
      var valid = true;

      $.each(this.attrs, function(i, attr){
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
      _.each(this.attrs, function(attr){
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
      var $text = $(this.opts.selectors[attr], this.el);
      var $checkbox = $(this.opts.selectors[attr + 'Auto'], this.el);
      return {
        $text: $text,
        $checkbox: $checkbox
      };
    },

    onCheckboxChange: function(e){
      var attr = e.data.attr;
      var attrEls = this.getElements(attr);
      var autoAttr = this.opts.attrs[attr + 'Auto'];
      if (attrEls.$checkbox.is(':checked')){
        this.model.set(autoAttr, true);
        attrEls.$text.attr('disabled', 'true');
        attrEls.$text.val(this.model.get(this.opts.attrs[attr]));
        attrEls.$text.errorTip('remove');
      }
      else{
        attrEls.$text.removeAttr('disabled');
        this.model.set(autoAttr, false);
      }
    },

    setCheckbox: function(attr){
      var attrEls = this.getElements(attr);
      var autoAttr = this.opts.attrs[attr + 'Auto'];
      if (this.model.get(autoAttr)){
        attrEls.$checkbox.attr('checked', 'checked');
        attrEls.$text.attr('disabled', 'true');
      }
      else{
        attrEls.$checkbox.removeAttr('checked');
        attrEls.$text.removeAttr('disabled');
      }
    }
  });

  return PlusMinusFormView;
});

