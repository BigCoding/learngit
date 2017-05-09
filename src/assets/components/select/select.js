/*
 * 组件-select
 */
define(['Util',
        'style!assets/components/select/select.css'
    ],
    function (Util) {
    var version = '1.0.0';
    var arr = [];

    var objClass = function(options){
        // 对this.$el赋值前对options.el类型判断，jquery对象，DOM对象，字符串
        if(options.el && options.el instanceof jQuery){
            this.$el = options.el;
        }else if(options.el && (options.el.nodeType==1 || typeof (options.el) == 'string')){
            this.$el = $(options.el);
        }else{
            window["console"]&&console.log('集成组件-下拉框 绑定容器加载失败!'); 
            this.$el = $('<div></div>');         
        }
        this.$el.addClass('sn-select'); 
        Util.eventTarget.call(this);
        this.initialize(options);  
        this.eventInit();               
    }
    
    $.extend(objClass.prototype, {
        version:version,
        initialize:function(options){              
            if(options.datas && typeof (options.datas) == "object" && Object.prototype.toString.call(options.datas) == "[object Array]" && ( options.datas.length > 0)){
                //若配置项中默认选项为空时，添加下拉框提供首选择“请选择”，选中该首选项。
                if(!options.value){
                    options.value='';
                    options.datas.splice(0, 0, {value:"",name:options.topOption?options.topOption:"请选择"})
                }
                arr = options.datas;
                render(this.$el, options, options.datas);                
                this.setValue(options.value);
                this.$el.find("select").prop("disabled",options.disabled);
            }else if(options && options.url && typeof (options.url) == 'string' && options.url.length > 0){
                $.ajax({
                    type:'post',
                    dataType:'json',
                    url:options.url, 
                    data:{},
                    success:$.proxy(function(result){
                        if (result.returnCode == '0'){
                            //若配置项中默认选项为空时，添加下拉框提供首选择“请选择”，
                            //选中该首选项“请选择”，避免歧义。
                            if(!options.value){
                                options.value='';
                                result.beans.splice(0, 0, {value:"",name:options.topOption?options.topOption:"请选择"})
                            }
                            arr = result.beans;
                            $.extend( result, options);
                            render(this.$el, options, result.beans);   
                            this.setValue(result.value);     
                            this.$el.find("select").prop("disabled",options.disabled);
                        }
                    },this),
                    error:function(err){
                        console.log('集成组件-下拉框 数据加载失败!');
                    }
                });
            }else{
                console.log('集成组件-下拉框 数据加载失败!');
            };
        },
        // 设置下拉框选中项
        setValue : function(value){
            if(!(this.$el.find("select").prop('disabled'))){
                if(value !=''){
                    if(typeof value == 'string'){
                        this.$el.find("option[value="+value+"]").prop("selected",true);
                    }else if(typeof value == 'number'){
                        this.$el.find("option:eq("+value+")").prop("selected",true);
                    }else if(Object.prototype.toString.apply(value)=== "[object Array]"){
                        var pro = value[0];
                        var val = value[1];
                        $.each(arr, $.proxy(function(i, item){                           
                            if(item[pro] == val){
                                this.$el.find("option[value="+item.value+"]").prop("selected",true);
                            }        
                        },this))
                    }
                }else{
                    this.$el.find("option:eq(0)").prop("selected",true);
                }
            }else{
                Util.dialog.tips("当前下拉框已禁用！");
            }
                                  
        },
        // 获取下拉框的值
        getSelected : function(){
            var ind = this.$el.find("option:selected").prop('index');           
            var obj = arr[ind];
            return obj;
        },
        // 启用下拉框
        enable:function(e){
            this.$el.find("select").prop("disabled",false);
        },   
        disabled:function(){
            this.$el.find("select").prop("disabled",true);
        },
        eventInit:function(){
            // 组件事件select.on("change",function(e,valueObj){ })
            this.$el.on("change","select",$.proxy(function(e){            
                this.trigger("change",e,this.getSelected());     //trigger这里change也可以命名为xx，
                                                                 //调用的时候select.on("xx",function(e,valueObj){ })即可
            },this))
        }
    },Util.eventTarget.prototype);   
    var render = function($ele,options,result){
        // 渲染html内容
        $ele.append('<label>'+options.label+'</label>');
        $ele.append('<div><select name="'+options.name+'" class="'+options.className+'"></div>');
        $.each(result, $.proxy(function(i, item){  
            $ele.find('select').append('<option value='+item.value+'>'+item.name+'</option>');    
        },this));
    };

    return objClass;
    
});


