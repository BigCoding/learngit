
/*
 * 组件-selectTree
 */
define(['Util', 'dialog', 
    'text!assets/components/selectTree/selectTree.tpl', 
    'style!assets/components/selectTree/selectTree.css', 
    'style!assets/lib/dialog/6.0.4/css/ui-dialog.css', 
    'style!assets/lib/zTree_v3/css/zTreeStyle/zTreeStyle.css', 
    'zTree'], 
    function (Util, Dialog, tpl) {

    var template = Util.hdb.compile(tpl);

    var confirm = function(){
        var nodes = [];
        if (this.zTree.setting && this.zTree.setting.check && 
            this.zTree.setting.check.enable){
            if(this.options.childNodeOnly){
                var checkNodes=this.zTree.getCheckedNodes();
                $.each(checkNodes,function(key,val){
                    val.isParent||nodes.push(val);
                })
            }else{
                nodes = this.zTree.getCheckedNodes();
            }
        }else{
            nodes = this.zTree.getSelectedNodes();
            if (this.options.childNodeOnly == false){
                var parentNode = nodes[0].getParentNode();
                while (parentNode){
                    nodes.push(parentNode);
                    parentNode = parentNode.getParentNode();
                }
            }
            
        }
        if(this._events&&this._events['confirm']&&(this._events['confirm'][0].callback(nodes)==false)) return false;
        this.json=this.zTree.getNodes();
        var textField = this.options.textField;
        var valueFiled = this.options.valueFiled;
        var nameStr = _.map(nodes, function(item) { return (textField && item[textField]) || item.name || item.value || item.id }).join(',');
        var valueStr = _.map(nodes, function(item) { return (valueFiled&&item[valueFiled]) || item.value || item.id }).join(',');
        //renderInput.call(this,nameStr,valueStr);
        if(this.options.enableButtonMode != true){
            $('.texts', this.$el).val(nameStr);
        }
        $('.values', this.$el).val(valueStr).trigger("change");
    };

    var clear = function(){
        var that = this;
        $.each(this.json,function(key,v){
            v.checked = false;
            $.each(v.children,function(i,c){
                c.checked = false;
            })
            that.zTree.updateNode(v);
        });
        if(this.options.enableButtonMode != true){
            $('.texts', this.$el).val('');
        }
        $('.values', this.$el).val('');
    }

   /*
    *add by zhanglizhao 2016-03-02
    * 数据循环
    */
   var dateFilter=function(data,callback){
       for(var index in data){
           callback&&callback(data[index]);
           if(data[index].children&&data[index].children.length){
               dateFilter(data[index].children,callback)
           }
       }
   };


    var treeInit=function(callback){
        var defaultValue = this.$valueBox.val();
        var defaultCheckedArr = (defaultValue && defaultValue.split(",")) || [];
        var asyncTreeInit = function(){
            var asyncConfig = {
                enable:true,
                autoParam:["id=id","name=name","value=value"]
            };
            var setting={
                check:{
                    enable:(this.options && this.options.check) || false
                },
                async:$.extend(asyncConfig,this.options.async), 
                callback:{
                    onAsyncSuccess:$.proxy(function(event, treeId, treeNode, msg){
                        treeCheckStatusInit.call(this);
                    },this)
                }
            };
            setting.async.url= this.options.url;
            setting.async.dataFilter=function(treeId, parentNode, childNodes){
                return childNodes.beans;
            };
            this.zTree = $.fn.zTree.init($zTreeWrap,setting);

        }

        /*
         *add by zhanglizhao 2016-03-02
         * 生成 树方法
         */
        var normalTreeInit = function($zTreeWrap,is_first){
            var isCheck=(this.options && this.options.check) || false;

            if(is_first&&isCheck&&this.options.value){
                dateFilter(this.json,function(bean){
                    if(_.indexOf(defaultCheckedArr,bean.value)!=-1){
                        bean.checked=true;
                    }
                });
            }
            //$zTreeWrap.addClass('ztree');
            this.zTree = $.fn.zTree.init($zTreeWrap, {
                check:{
                    enable:isCheck
                }
            },this.json);
            if (this.options.expandAll){
                this.zTree.expandAll(true);
            }
        };
        var treeCheckStatusInit = function(){
            if (this.options.expandAll){
                this.zTree.expandAll(true);
            }
            var nodes = this.zTree.getNodesByFilter(function(node){
                return !node.isParent && _.indexOf(defaultCheckedArr,node.value) >= 0;
            });
            //在异步模式加逐一初始化树节点选中状态
            _.each(nodes,$.proxy(function(node,i){
                this.zTree.checkNode(nodes[i], true, !this.options.childNodeOnly);
            },this));
        }
        if (this.options && this.options.url){
            var $zTreeWrap = $('.ztree', this.dialog.node);
            if(this.options.async){
                asyncTreeInit.call(this);
            }else{
                if(this.json){
                    normalTreeInit.call(this,$zTreeWrap);
                }else{
                    $.getJSON(this.options.url,{},$.proxy(function(json,status){
                        if (status && json.returnCode == '0') {
                            this.json=json.beans;
                            normalTreeInit.call(this,$zTreeWrap,true);
                        }else{
                            console.log('the component of select tree init bad. search error')
                        }
                    },this));
                }
            }

        }else{
            console.log('the component of select tree init bad. please set url for data.');
        }
        /*else{
            zTree = $.fn.zTree.init($('.ztree', d.node), setting, userSetting.zNodes);
            zTree.selectNode(zTree.getNodeByParam('value', userSetting.defaultValue));
        }*/
    };

    var dialogInit=function(){
        var arrBtn = [
            {
                value: '确定',
                callback: $.proxy(confirm,this),
                autofocus: true
            },
            {
                value: '取消',
                callback: function () { }
            }
        ];
        if(this.options.showEmptyButton||this.options.showEmptyButton===undefined){
            arrBtn.splice(1,0,
                {
                    value: '清空',
                    callback: $.proxy(clear,this)
            });
        };
        var params = {
            skin:'zx-popup-tree', 
            fixed:true, 
            padding: 3, 
            modal:true,
            title : this.options.title, 
            //content : $('#dialogContent').html(),
            content:'<div class="ztree"></div>',
            button: arrBtn, 
            onclose:$.proxy(function(){
                this.dialog = null;
            },this),
            width : this.options.panelWidth || 270,  //对话框宽度
            height : this.options.panelHeight || 400 //对话框高度
        };
        if (this.options.checkAllNodes){
            $.extend(params,{
                statusbar: '<label><input type="checkbox">全选</label>'
            });
        }
        this.dialog = new Dialog.openDiv(params);
        this.dialog.show();
        var $box = $('input[type=checkbox]',this.dialog.node)
        $box.on('click',$.proxy(function(e){
            var checkedAll = $(e.currentTarget).is(':checked');
            this.zTree.checkAllNodes(checkedAll);
        },this));
        //callback && callback();
    };
    var panelInit = function(e){
        var $textBox = $(e.currentTarget);
        this.$valueBox = $textBox.siblings('.values');
        if (!this.dialog){
            dialogInit.call(this);
            treeInit.call(this);
        }
    };

    var version = '1.0.1';
    var objClass = function(config){
    	initialize.call(this,config);
    };
        //tagName:'div',
        //className:'sn-selectTree', 
    var initialize = function(options){
        // 对this.$el赋值前对options.el类型判断，jquery对象，DOM对象，字符串
        if(options.el && options.el instanceof jQuery){
            this.$el = options.el;
        }else if(options.el && (options.el.nodeType==1 || typeof (options.el) == 'string')){
            this.$el = $(options.el);
        }else{
            window["console"]&&console.log('集成组件-下拉框 绑定容器加载失败!'); 
            this.$el = $('<div></div>');         
        }
        this.options = options;
        //renderInput.call(this,this.options.text,this.options.value);
        Util.eventTarget.call(this);
        this.$el.addClass('sn-selectTree');
        this.$el.html(template(this.options));
        var $input = $('.texts',this.$el);
        if(this.options.enableButtonMode == true){
            $('label',this.$el).html('');
            // $input.attr("type","button").val(this.options.label).removeClass('textStyle').addClass('btnStyle');
            $input.removeClass('textStyle').addClass('btnStyle');
            var btnClass = $input.attr("class");
            var btnName = $input.attr("name");
            var $inputParentDiv = $input.closest("div");
            var btnInput = "<input type='button' class="+ btnClass +" name="+ btnName +" value="+ this.options.label +">";
            $inputParentDiv.children("input[type=text]").remove();
            $inputParentDiv.prepend(btnInput);
        }
        //自定义事件
        this.$el.on('click','.texts',$.proxy(function(e){
            panelInit.call(this,e);
            this.trigger('panelInit',e);
        },this));
    };
    $.extend(objClass.prototype,Util.eventTarget.prototype, {
        version:version
    });
    return objClass;
});


/*

        render:function(){
            //this.$el.html(template(this.options));
            return this;
        }, 


*/