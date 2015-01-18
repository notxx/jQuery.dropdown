(function($) {
if (!$ || !$.fn) return;

var methods = {};
methods.init = function(options) {
	if (!this.length) return;
	if (this.length > 1) {
		var arg = arguments;
		return $.each(this, function() { methods.init.apply($(this), arg); });
	}
	if (this.is("input"))
		methods.init_input.apply(this, arguments);
	else if (this.is("a, font, span"))
		methods.init_other.apply(this, arguments);
	else
		;
};
methods.init_input = function(options) { // 为输入框产生一个下拉按钮
	var $this = this, $widget = $this.parent();
	if ($widget.data("options")) { return; }
	if (typeof options === "object")
		options = $.extend({}, defaults_input, options);
	else
		options = $.extend({}, defaults_input);
	$this.wrap("<div class='dropdown'>");
	$widget = $this.parent().data("options", options);
	var $button = $("<span class='dropdown'>").append("<span class='ui-icon ui-icon-triangle-1-s'>").click(function() {
		var $button = $(this), $icon = $button.find(".ui-icon"), 
			$widget = $button.closest("div.dropdown"), $this = $widget.find("input.dropdown");
		var options = $widget.data("options"), transform = $icon.css("transform");
		if (transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)") {
			$this.dropdown("open");
			options.open.apply($this);
			$this.trigger("dropdownopen");
		} else {
			$this.dropdown("close");
			options.close.apply($this);
			$this.trigger("dropdownclose");
		}
		options.always.apply($this);
		$this.trigger("dropdownalways");
	});
	$this.addClass("dropdown")
//	.after($('<div style="clear:both;"></div>'))
	.after($button);
	$this.each(function() {
		var $this = $(this);
		if ($this.data("ui-autocomplete")) {
			$this.on("dropdownopen", function() { $this.autocomplete("search"); });
			$this.on("dropdownclose", function() { $this.autocomplete("close"); });
			$this.on("autocompleteopen", function() { $this.dropdown("open"); });
			$this.on("autocompleteclose", function() { $this.dropdown("close"); });
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
methods.init_other = function(options) { // 为其他元件产生一个下拉三角
	var $this = this;
	if (typeof options === "object")
		options = $.extend({}, defaults_other, options);
	else
		options = $.extend({}, defaults_other);
	if (options.open == defaults_other.open) { // 使用了默认事件处理程序
		var $menu = options.menu ? $(options.menu) : $(".menu.dropdown");
		if (!$menu.length) $menu = $("<ul class='menu dropdown'>").appendTo($(document.body));
		$this.data("dropdown.menu", $menu);
	}
	$this.data("dropdown.options", options).addClass("dropdown").hover(function() {
		var $this = $(this);
		$this.addClass("hover").click(function(event) {
			$this.dropdown("open");
			options.open.apply($this);
			$this.trigger("dropdownopen");
			event.stopImmediatePropagation();
			$(document.body).one("click", function() { $menu.hide(); });
		});
	},function() {
		var $this = $(this);
		$this.removeClass("hover").off("click");
	});
};

var defaults_input = {
	open: $.noop,
	close: $.noop,
	always: $.noop
}, defaults_other = {
	menu: [],
	open: function() {
		var $this = this, $menu = $this.data("dropdown.menu"),
			options = $this.data("dropdown.options"), position = $this.position();
		// 添加菜单项
		$menu.empty();
		function __add(text, click) {
			$menu.append($("<li class='ui-menu-item'>").text(text)
			.click(function(){
				if ($.isFunction(click)) {
					click.apply($this);
				}
				$menu.hide();
			}));
		}
		if ($.isArray(options.items)) {
			$.each(options.items, function() {
				__add(this, $.noop);
			});
		} else for (var k in options.items) {
			__add(k, options.items[k]);
		}
		$menu.is(".ui-menu") ? $menu.menu("refresh") : $menu.menu();
		$menu.css({ left: event.pageX, top: event.pageY }).show();
	},
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