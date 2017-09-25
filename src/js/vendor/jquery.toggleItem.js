
//toggle plugin

/*
__________________________________________________

Created by NovaVovikov

github: https://github.com/novavovikov/
e-mail: novavovikov@gmail.com
__________________________________________________

*/

(function($) {
    
        $.fn.toggleItem = function(options) {
            var defaults = {
                className: '',
                outOff: true,
                activeControl: el,
                activeItem: el,
                callback: function () { }
            }
    
            // support mutltiple elements
            if (this.length > 1) {
                this.each(function() { $(this).toggleItem(options) });
                return this;
            }
    
            var el = this, node = {}, data = {};
    
            var settings = $.extend({}, defaults, options);
    
            var methods = {
                init: function () {
                    node.link = el;
                    data.src = node.link.attr('href');
                    node.target = $(node.link.attr('href'));
                    
                    //events
                    node.link.on('click', methods.click);
    
                    //options
                    (settings.className === '') ? settings.className = 'active' : '';
                    (settings.outOff == true) ? $(document).click(methods.outOff) : '';
                },
                click: function() {
                    node.link.toggleClass(settings.className);
                    node.target.toggleClass(settings.className);
    
                    settings.callback(node.link, node.target);
                    return false;
                },
                outOff: function (event) {
                    if (event.target.closest(data.src)) return;
                        
                    node.link.removeClass(settings.className);
                    node.target.removeClass(settings.className);
                }
            };
            methods.init();
        };
    
    })(jQuery);