(function($) {
if (!$ || !$.fn) return;

var methods = {};
methods.init = function(options) {
	var $input = this, $widget = $input.parent();
	if ($widget.data("options")) { return; }
	if (typeof options === "object")
		options = $.extend({}, defaults, options);
	else
		options = $.extend({}, defaults);
	$input.wrap("<div class='dropdown'>");
	$widget = $input.parent().data("options", options);
	var $button = $("<span class='dropdown'>").append("<span class='ui-icon ui-icon-triangle-1-s'>").click(function() {
		var $button = $(this), $icon = $button.find(".ui-icon"), 
			$widget = $button.closest("div.dropdown"), $input = $widget.find("input.dropdown");
		var options = $widget.data("options"), transform = $icon.css("transform");
		if (transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)") {
			$input.dropdown("open");
			options.open.apply($input);
			$input.trigger("dropdownopen");
		} else {
			$input.dropdown("close");
			options.close.apply($input);
			$input.trigger("dropdownclose");
		}
		options.always.apply($input);
		$input.trigger("dropdownalways");
	});
	$input.addClass("dropdown")
//	.after($('<div style="clear:both;"></div>'))
	.after($button);
	$input.each(function() {
		var $input = $(this);
		if ($input.data("ui-autocomplete")) {
			$input.on("dropdownopen", function() { $input.autocomplete("search"); });
			$input.on("dropdownclose", function() { $input.autocomplete("close"); });
			$input.on("autocompleteopen", function() { $input.dropdown("open"); });
			$input.on("autocompleteclose", function() { $input.dropdown("close"); });
		}
	});
	return this;
};
methods.open = function() {
	var $this = this, $widget = $this.closest("div.dropdown");
	var $icon = $widget.find(".ui-icon"), transform = $icon.css("transform");
	$icon.css("transform", "rotate(180deg)");
};
methods.close = function() {
	var $this = this, $widget = $this.closest("div.dropdown");
	var $icon = $widget.find(".ui-icon"), transform = $icon.css("transform");
	$icon.css("transform", "none");
};

var defaults = {
	open: $.noop,
	close: $.noop,
	always: $.noop
}

$.fn.dropdown = function(method) {
	if(!this.length) return this;
	if (typeof(method) == 'string' && method.charAt(0) != '_' && methods[method]) {
		return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else if (typeof method == 'object' || !method) {
		methods.init.apply(this, arguments);
	} else {
		$.error('Method ' + method + ' does not exist in jQuery.dropdown');
	}
	return this;
};

})(jQuery);