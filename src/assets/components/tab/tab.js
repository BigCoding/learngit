/*
 * 组件-tab
 */
define(['backbone', 'hdb', 
        'text!assets/components/tab/tab.tpl',
        'style!assets/components/tab/tab.css'],
    function (Backbone, hdb, tpl) {

        var version = '1.0.0';
        var objClass = Backbone.View.extend({
            version:version,
            itemSelectStr:'>.sn-tab-container>.sn-tab>.sn-tab-items>li',
            initialize: function (options) {
                this.options = options;
                this.template = hdb.compile(this.options.tpl ? this.options.tpl : tpl);
                this.options.activeClass = ( this.options.activeClass ? this.options.activeClass : 'active');
                this.eventInit();
                this.render();
                setTimeout($.proxy(function () {
                    var $li = $(this.itemSelectStr, this.$el).first();
                    if ($li.length) {
                        $li.trigger("click");
                    }
                }, this), 200);
            },
            eventInit: function () {
                this.$el.unbind("click");
                this.$el.on('click', this.itemSelectStr, $.proxy(this.itemClick, this));
            },
            render: function () {
                this.$el.html(this.template(this.options.tabs));
                if(this.options.direction&&this.options.direction === "vertical"){
                    this.$el.addClass("vertical")
                };
                return this;
            },
            switchTab: function (title) {
                if ($(this.itemSelectStr, this.$el).length > 1) {
                    $(this.itemSelectStr, this.$el).each(function () {
                        var $li = $(this);
                        if ($li.html().indexOf(title)) {
                            $li.click();
                            return false;
                        }
                    })
                }
            },
            itemClick: function (e) {
                var $src = $(e.target || e.currentTarget).closest(".J_item_click");
                var index = this.$el.find(this.itemSelectStr).index($src);
                var tabData = this.options.tabs[index];
                $(this.itemSelectStr, this.$el).removeClass(this.options.activeClass);
                $src.addClass(this.options.activeClass);
                this.trigger('click', e, tabData);
                if (tabData && tabData.click) {
                    tabData.click(e, tabData);
                }
            },
            content:function(html){
                var $contentArea = $('>.sn-tab-container>.J_tab_render>.J_content_render',this.$el);
                if (this.lastDom){
                    this.lastDom.detach();
                }
                if (typeof(html) == 'object'){
                    this.lastDom = html;
                    $contentArea.empty().append(html);
                }
                else{
                    $contentArea.html(html);
                }
            },
            destroy: function () {
                this.$el.remove();
            }
        });
        return objClass;
    });


