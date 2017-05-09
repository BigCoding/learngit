/**
 * Created by lizhao on 2016/3/23.
 */
define(['Util', 
    'text!assets/components/date/date.tpl',
    'laydate',
    'style!assets/lib/laydate/skins/default/laydate'
],function (Util, tpl) {
    //version这样定义
    var version = '1.0.2';
    var objClass =function(config){
        if(!config){
            console.log('please config params for date');
            return false
        }else if(config&&!config.double){
            dateStyle(config);
        }else{
            if(config.double.start&&config.double.start.format&&config.double.start.defaultValue){
                dateStyle(config.double.start);
            };
            if(config.double.end&&config.double.end.format&&config.double.end.defaultValue){
                dateStyle(config.double.end);
            };
        }
        
        // 对this.$el赋值前对options.el类型判断，jquery对象，DOM对象，字符串
        if(config.el && config.el instanceof jQuery){
            this.$el = config.el;
        }else if(config.el && (config.el.nodeType==1 || typeof (config.el) == 'string')){
            this.$el = $(config.el);
        }else{
            window["console"]&&console.log('集成组件-下拉框 绑定容器加载失败!'); 
            this.$el = $('<div></div>');         
        }
        this.options = config; 
        Util.eventTarget.call(this);
        render.call(this);     
        //自定义事件    
        this.$el.on('focus','input',$.proxy(function(e){
            focusInput.call(this,e);
            this.trigger('focusInput',e);
        },this));
    };

    $.extend(objClass.prototype,Util.eventTarget.prototype, {
        version:version
    });

    var render = function(){
        template = Util.hdb.compile(tpl);
        this.$el.addClass("timegroup").html(template(this.options));
    };
    //判断format和defaultValue的格式是否一致
    var dateStyle = function(data){
        var format = data.format.replace(/\w/g,''),defaultValue = data.defaultValue.replace(/\w/g,'');
        if(format!==defaultValue){
            data.defaultValue='';
            console.log('defaultValue格式不正确');
            return false
        }
    };
    var focusInput = function(event){
        var config={},_this=this;
        if(!this.options.double){
            $.extend(config,this.options);
            config.choose= $.proxy(function(datas){
                _this.$el.find("input").trigger("change");
                this.choose&&this.choose.call(this,datas)
            },this.options);
        }else{
            var name=$(event.target||event.currentTarget).attr("name");
            if(this.options.double.start&&this.options.double.start.name==name){
                $.extend(config,this.options.double.start);
                config.choose= $.proxy(function(datas){
                    _this.$el.find("input[name='"+_this.options.double.start.name+"']").trigger("change");
                    this.start.choose&&this.start.choose.call(this,datas)
                },this.options.double);
            }else if(this.options.double.end&&this.options.double.end.name==name){
                $.extend(config,this.options.double.end);
                config.choose= $.proxy(function(datas){
                    _this.$el.find("input[name='"+_this.options.double.end.name+"']").trigger("change");
                    this.end.choose&&this.end.choose.call(this,datas)
                },this.options.double);
            }
        }
        //规避lay的elem和event配置
        config.elem&&delete(config.elem);
        config.event&&delete(config.event);
        laydate(config);
    };
    return objClass
});

