/**
 * Created by 利召 on 2016/1/9.
 */
define(['Util'], function(Util){


    var objClass = function(options){
        Util.eventTarget.call(this);
        options._index=$.extend(options._index, {
            popWin:this
        });
        this.options =$.extend({modal:true}, options);
        this.init();
    };

    $.extend(objClass.prototype, Util.eventTarget.prototype, {
        init:function(){
            var params=this.options;
            var d = dialog({
                id:params.id,
                fixed:true,
                title: params.title,
                okValue: params.okVal?params.okVal:"确定",
                cancelValue: params.cancelVal?params.cancelVal:"取消",
                ok:$.proxy(function(){this.trigger("ok")},this),
                cancel: $.proxy(function(){this.trigger("cancel")},this),
                onclose: $.proxy(function(){this.trigger("close")},this)
            });
            d.width(params.width?params.width:800);
            d.height(params.height?params.height:400);
            //$.extend(params._index, {popWin:d});
            require.undef(params.url);
            require([params.url], $.proxy(function(_html){
                if (typeof(_html) === 'function'){
                    var result = _html(params._index);
                    d.content(result);
                }else{
                    d.content(_html.content);
                }
                (params.modal)?d.showModal():d.show();
            }, this));
        },
        close: function(id){
            dialog.get(id).close();
        }
    });

    return objClass;
});