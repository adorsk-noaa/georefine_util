define([
        'jquery'
        ], 
function($){

    util = {
        fillParent: function(el){
            $parent= $(el).parent();
            $(el).css('width', $parent.width());
            $(el).css('height', $parent.height());
        },
        unsetWidthHeight: function(el){
            $(el).css('width', '');
            $(el).css('height', '');
        },

        expandContractTab: function(opts){
            var expand = opts.expand;
            var $tc = opts.tab_container;
            var $table = opts.table;
            var dim = opts.dimension;

            // Calculate how much to change dimension.
            var delta = parseInt($tc.css('max' + _s.capitalize(dim)), 10) - parseInt($tc.css('min' + _s.capitalize(dim)), 10);
            if (! expand){
                delta = -1 * delta;
            }

            // Animate field container dimension.
            $tc.addClass('changing');

            // Toggle button text
            var button_text = ($('button.toggle', $tc).html() == '\u25B2') ? '\u25BC' : '\u25B2';
            $('button.toggle', $tc).html(button_text);

            // Execute animations and save deferreds.
            var deferreds = [];

            // first animate the tab container.
            var tc_dim_opts = {};
            tc_dim_opts[dim] = parseInt($tc.css(dim),10) + delta;
            var tcDeferred = $tc.animate(
                    tc_dim_opts,
                    {
                        complete: function(){
                            $tc.removeClass('changing');

                            if (expand){
                                $tc.addClass('expanded')
                            }
                            else{
                                $tc.removeClass('expanded');
                                fillParent($table);
                            }
                        }
                    }
                    ).promise();
            deferreds.push(tcDeferred);

            // Animate cell dimension.
            var parentDeferred = $tc.parent().animate(tc_dim_opts).promise();
            deferreds.push(parentDeferred);

            // Animate table dimension.
            var table_dim_opts = {};
            table_dim_opts[dim] = parseInt($table.css(dim),10) + delta;
            var tableDeferred = $table.animate(table_dim_opts).promise();

            // Return combined deferred.
            return $.when.apply($, deferreds);
        },

        resizeVerticalTab: function($vt){
            var $rc = $('.rotate-container', $vt);
            $rc.css('width', $rc.parent().height());
            $rc.css('height', $rc.parent().width());
        },

        friendlyNumber: function(number, decPlaces, use_long) {
            decPlaces = Math.pow(10,decPlaces);
            number = parseFloat(number);
            var sign = (number < 0) ? -1 : 1;
            var absNumber = Math.abs(number);
            var long_suffixes = ["", " thousand", " million", " billion", " trillion", " quadrillion", " quintillion"];
            var short_suffixes = " kMGTPE";
            var suffixes = use_long ? long_suffixes : short_suffixes;
            var size = 0
                var i = 0;
            for (i=suffixes.length-1; i>=-1; i--) {
                size = Math.pow(10,(i+1)*3);
                if (size <= absNumber) {
                    break;
                }
            }
            number = sign * Math.round(absNumber*decPlaces/size)/decPlaces;
            var suffix = (i == -2) ? suffixes[0] : suffixes[i+1];
            return number.toString() + suffix;
        },
    };

    return util;

});
