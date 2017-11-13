/*******************************************************
 MODULE test
 *******************************************************/
(function($) {
    "use strict";
    var methods = {
        init : function(params) {
            var options = $.extend({
                speed: 400
            }, params);
            $(this).on("click", function() {
              console.log('test');
            });
        },
        update : function( content ) {
            console.log('update');
            console.log(content);
            return this.each(function () {

            })
        }
    };

    $.fn.test = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error('Метод "' + method + '" в плагине не найден');
        }
    };
})(jQuery);