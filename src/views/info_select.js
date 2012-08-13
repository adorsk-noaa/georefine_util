define([
	"jquery",
	"use!backbone",
	"use!underscore",
	"use!ui",
	"_s",
	"use!uiExtras",
	"text!./templates/info_select.html"
		],
function($, Backbone, _, ui, _s, uiExtras, template){

	var InfoSelectView = Backbone.View.extend({

		events: {
			'change select': 'onSelectChange'
		},

		initialize: function(){
			$(this.el).addClass('info-select');
			this.initialRender();
			this.model.on("change:selection", this.onChangeSelection, this);
			this.model.on("change:choices", this.renderChoices, this);

            this.on("ready resizeStop", this.resize, this);
		},

		initialRender: function(){
			$(this.el).html(_.template(template));
            this.$select = $('.info-select-select', this.el);
            this.$info_list = $('.info-select-info-list', this.el);
            this.resize();
            this.renderChoices();
        },

        renderChoices: function(){
            this.$select.empty();
            this.$info_list.empty();

            _.each(this.model.get('choices'), function(choice){
                var $opt = $(_s.sprintf('<option value="%s">%s</option>', choice.value, choice.label));
                $opt.appendTo(this.$select);
                var $info = $(_s.sprintf('<li>%s</li>', choice.info));
                $info.appendTo(this.$info_list);
            }, this);

            this.$select.selectmenu({});
        },

        onSelectChange: function(){
            this.model.set('selection', this.$select.val());
        },

        onChangeSelection: function(arguments){
            this.$select.selectmenu("value", this.model.get('selection'));
        },

        resize: function(){
            // Set widths explicitly.
            var $inner = $('> .inner', this.el);
            var info_width = $('.info-container', this.el).outerWidth(true);
            var select_width = $inner.width() - info_width;
            $('.select-container', this.el).outerWidth(select_width);
            this.$select.width(select_width);
            $selectMenu = $('.select-container .ui-selectmenu', this.el);
            $selectMenu.outerWidth(select_width);
            this.$select.selectmenu({'width': $selectMenu.width()});
        },

	});

	return InfoSelectView;
});
		
