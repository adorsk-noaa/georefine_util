define([
		'jquery',
		'./simple_interpreter',
		'./lumberjack_interpreter',
], 
function($, SimpleInterpreter, LumberjackInterpreter){

	util = {
		'SimpleInterpreter': SimpleInterpreter,
		'LumberjackInterpreter': LumberjackInterpreter,
		'fillParent': function(el){
			$parent= $(el).parent();
			$(el).css('width', $parent.width());
			$(el).css('height', $parent.height());
		},
		"unsetWidthHeight": function(el){
			$(el).css('width', '');
			$(el).css('height', '');
		}

	};

	return util;

});
