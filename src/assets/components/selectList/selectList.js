/*
 * 组件-selectList
 */
//'sn-style!'+_baseUrl+'css/selectTree.css', 
//,'sn-style!'+_baseUrl+'lib/zTree_v3/css/zTreeStyle/zTreeStyle.css'
define(['backbone', 'hdb', 'dialog',
    'text!assets/components/selectList/selectList.tpl',
    'style!assets/lib/dialog/6.0.4/css/ui-dialog.css'], 
    function (Backbone, hdb, Dialog, tpl) {

    var template = hdb.compile(tpl);

    var dialogInit=function(){
        var options = _.pick(this.options, ['width','height','title']);
        var params = _.extend({
            skin:'zx-popup-tree', 
            fixed:true, 
            padding: 3, 
            modal:true,
            content:'<div class="ztree"></div>',
            button: [
                {
                    value: '确定',
                    callback: $.proxy(confirm,this),
                    autofocus: true
                },
                {
                    value: '清空',
                    callback: $.proxy(clear,this)
                },
                {
                    value: '取消',
                    callback: function () { }
                }
            ], 
            onclose:$.proxy(function(){
                this.trigger('panelClose');
                this.dialog = null;
            },this),
            width : '630',  //对话框宽度
            height : '380'  //对话框高度
        },options);
        this.dialog = Dialog.openDiv(params);
        this.dialog.show();

        var node = this.dialog.node;
        var content = this.options.content;
        if (typeof(content) == 'object'){
            $('.ui-dialog-content',node).append(content);
        }else{
            $('.ui-dialog-content',node).html(content);
        }
    };
    var panelInit = function(e){
        if (!this.dialog){
            dialogInit.call(this);
            this.trigger('panelInit');
        }
    };

    var objClass = Backbone.View.extend({
        initialize:function(options){
            this.options = options;
            this.$el.addClass('sn-selectList');
            this.$el.html(template(options));
            $('.texts', this.el).on('click', $.proxy(panelInit,this));
        }, 
        setText:function(str){
            $('.texts',this.el).val(str);
        }, 
        setValue:function(str){
            $('.values',this.el).val(str);
        },
        setPanelContent:function(content){
            var node = this.dialog.node;
            if (typeof(content) == 'object'){
                $('.ui-dialog-content',node).append(content);
            }else{
                $('.ui-dialog-content',node).html(content);
            }
            
        }

    });

    var confirm = function(){
        this.trigger('confirm');
    };

    var clear = function(){
        $('.texts', this.$el).val('');
        $('.values', this.$el).val('');
    }

    return objClass;
});
