define([
	"jquery",
	"use!backbone",
	"use!underscore",
	"use!ui",
	"_s",
	"text!./templates/info_select.html"
		],
function($, Backbone, _, ui, _s, template){

	var InfoSelectView = Backbone.View.extend({

		events: {
			'change select': 'onSelectChange'
		},

		initialize: function(){
			$(this.el).addClass('info-select');
			this.initialRender();
			this.model.on("change:selection", this.onChangeSelection, this);
		},

		initialRender: function(){
			$(this.el).html(_.template(template));
            this.$select = $('.info-select-select', this.el);
            this.$info_list = $('.info-select-info-list', this.el);
            this.renderChoices();
        },

        renderChoices: function(){
            this.$select.empty();
            this.$info_list.empty();

            _.each(this.model.get('choices'), function(choice){
                var $opt = $(_s.sprintf('<option value="%s">%s</option>', choice.id, choice.label));
                $opt.appendTo(this.$select);
                var $info = $(_s.sprintf('<li>%s</li>', choice.info));
                $info.appendTo(this.$info_list);
            }, this);
        },

        onSelectChange: function(){
            this.model.set('selection', this.$select.val());
        },

        onChangeSelection: function(arguments){
            this.$select.val(this.model.get('selection'));
        }

	});

	return InfoSelectView;
});
		
