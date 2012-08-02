define([
        'jquery'
        ], 
function($){

    util = {
        'fillParent': function(el){
            $parent= $(el).parent();
            $(el).css('width', $parent.width());
            $(el).css('height', $parent.height());
        },
        "unsetWidthHeight": function(el){
            $(el).css('width', '');
            $(el).css('height', '');
        },

        "friendlyNumber": function(number, decPlaces, use_long) {
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
        }
    };

    return util;

});
