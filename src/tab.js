var $ = codebox.require("jquery");
var dialogs = codebox.require("utils/dialogs");

var Tab = codebox.tabs.Panel.extend({
    className: "component-image-previewer",

    initialize: function() {
        var that = this;
        Tab.__super__.initialize.apply(this, arguments);

        this.$range = $("<input>", {
            'type': "range",
            'step': 0.1,
            'max': 100,
            'min': 0,
            'value': 100
        });
        this.$range.change(this.onZoomChange.bind(this));


        this.$img = $("<img>", {

        });
        this.$img.hide();

        this.$img.appendTo(this.$el);
        this.$range.appendTo(this.$el);

        this.listenTo(this.model, "change", this.onFileChange);
        this.onFileChange();
    },

    ready: function() {
        var that = this;

        setTimeout(function() {
            that.onResetZoom();
        }, 100);
        return Tab.__super__.ready.apply(this, arguments);
    },


    // Return size of the image
    getNaturalWidth: function() {
        return this.$img.get(0).naturalWidth;
    },

    // Update image
    onFileChange: function() {
        var that = this;

        this.model.read({ base64: true })
        .then(function(content) {
            that.$img.attr("src", "data:"+that.model.get("mime")+";base64,"+content);
            that.onResetZoom();
        })
        .fail(dialogs.error);
    },

    // Initialize zoom
    onResetZoom: function() {
        var viewWidth = 0.70*this.$el.width();
        var imageWidth = this.getNaturalWidth();
        var zoom = 100;

        if (imageWidth > viewWidth && viewWidth > 0) {
            zoom = 100*(viewWidth/imageWidth);
        }

        this.$range.val(zoom);
        this.onZoomChange();
        this.$img.show();
    },

    // Update zoon
    onZoomChange: function(e) {
        var zoom = this.$range.val();
        this.$img.width(
            this.getNaturalWidth()*(zoom/100)
        );
    }
});

module.exports = Tab;
