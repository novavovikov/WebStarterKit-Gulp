//selectStyler plugin

/*
__________________________________________________

Created by NovaVovikov

github: https://github.com/novavovikov/
e-mail: novavovikov@gmail.com
__________________________________________________

*/


(function($) {

    var defaults = {
        className: 'select',
        defaultIndex: 0,
        zIndex: 10,
        activeClass: 'active',
        search: false,
        placeholderSearch: 'Введите текст...',
        onChange: function() {

        }
    };

    $.fn.selectStyler = function(options) {

        if (this.length == 0) return this;

        // support mutltiple elements
        if (this.length > 1) {
            this.each(function() { $(this).selectStyler(options) });
            return this;
        }

        var select = {};

        var el = this;

        var settings = $.extend({}, defaults, options);

        var methods = {
            init: function() {
                el.options = el.children('option');

                methods.createPseudo();

                //css
                el.css({
                    opacity: '0',
                    position: 'absolute',
                    width: '100%',
                    'z-index': '-1'
                });

                select.css({
                    position: 'relative'
                });

                select.dropdown.css({
                    position: 'absolute',
                    top: '100%',
                    'z-index': settings.zIndex
                });

                //

                $(window).on('mouseup', methods.hideDropdown);

                (settings.search) ? methods.initSearch() : '';

            },

            initSearch: function() {
                $('<div class="select-search"><input type="text" placeholder="' + settings.placeholderSearch + '"></div>').prependTo(select.dropdown);

                select.search = select.dropdown.find('input');
                select.search.bind('keyup', methods.handleSearch);
            },

            handleSearch: function() {
                var text = select.search.val().toLowerCase();

                settings.indexes = [];

                settings.values.forEach( function(element, index) {
                    if (element.search(text) !== -1) {
                        settings.indexes.push(index);
                    }
                });

                select.dropdown.list.option.hide();


                settings.indexes.forEach( function(index) {
                    select.dropdown.list.option.eq(index).show();
                });
            },

            createElement: function(className, wrap, descriptor, text) {
                wrap.append('<div class="' + settings.className + className + '">' + text + '</div>');
                wrap[descriptor] = wrap.children('.' + settings.className + className);
            },

            createPseudo: function() {

                el.wrap('<div class=' + settings.className + '></div>');
                select = el.closest('.' + settings.className);
                select.addClass(el["0"].className);
                el.removeClass();

                this.createElement('-text', select, 'text', '');
                this.createElement('-text__value', select.text, 'value', '');
                this.createElement('-text__trigger', select.text, 'trigger', '');
                this.createElement('-dropdown', select, 'dropdown', '');
                this.createElement('-list', select.dropdown, 'list', '');

                select.options = [];
                settings.values = [];

                el.options.each(function(index, el) {
                    methods.createElement('-list__item', select.dropdown.list, 'option', $(this).text());
                    settings.values.push(el.childNodes[0].textContent.toLowerCase());
                    select.options.push(select.dropdown.list.option);
                });

                //events
                select.dropdown.list.children().bind('click', methods.selectItem);
                select.text.value.bind('click', methods.toggleDropdown);
                select.text.trigger.bind('click', methods.toggleDropdown);
                el.change(methods.changeSelect);
                methods.resetForm();

                //state
                select.text.value.text(select.options[settings.defaultIndex].text());
                select.options[settings.defaultIndex].addClass(settings.activeClass);
                select.dropdown.hide();
            },

            selectItem: function() {
                var $this = $(this),
                text = $this.text(),
                index = $this.index();

                el.options.eq(index).prop('selected', true).siblings().prop('selected', false);
                $this.addClass(settings.activeClass).siblings().removeClass(settings.activeClass);
                select.text.value.text(text);
                select.dropdown.hide();
                select.removeClass(settings.activeClass);
                settings.onChange();
            },

            toggleDropdown: function() {
                select.dropdown.toggle();
                select.toggleClass(settings.activeClass);

                (settings.search) ? select.search.focus() : '';
            },

            hideDropdown: function(e) {
                if (!$(e.target).closest(select).length) {
                    select.dropdown.hide();
                    select.removeClass(settings.activeClass);
                }
            },

            changeSelect: function() {
                var index = $(this).children('option:selected').index();

                select.options[index].trigger('click');
            },

            resetForm: function() {
                select.closest('form').on('reset', function(e) {
                    select.options[settings.defaultIndex].trigger('click');
                });
            }
        };

        methods.init();

    };

})(jQuery);
