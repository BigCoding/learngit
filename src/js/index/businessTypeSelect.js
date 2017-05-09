/**
 * Created by 利召 on 2016/1/8.
 * 使用基于jquery的多功能 “树插件”ztree
 */
define([
    'text!module/index/businessTypeSelect.tpl',
    // 'style!assets/lib/zTree_v3/css/zTreeStyle/zTreeStyle.css',
    'style!assets/css/index/businessTypeSelect.css',
    'assets/lib/zTree_v3/js/jquery.ztree.core-3.5.min',
    'assets/lib/zTree_v3/js/jquery.ztree.excheck-3.5.min'
],function(tpl){

    var $el = $(tpl);

    var getZtree=function(json){
        this.content = $el;
        this.json=this.manageJson(json.beans);
        this.getLeftTree(this.json);
        this.eventInit();
    };

    var initialize = function(index){
        var complaintTree;
        index.Util.svMap.add('complaintTree','complaintTree.json','');
        
        index.Util.ajax.postJson('front/sh/queryStaticData!queryServiceType?uid=StaticData003',{},$.proxy(function(json,status){
            if (status) {
                complaintTree=new getZtree(json)
            }else{
                console.log('客户列表初始化失败.')
            }
        }, this));
        index._self.on("ok",function(){
            $("#hasChoose li").each(function(key,val){
                var $val=$(val);
                index.main.createTab($val.attr("data-name"), $val.attr("data-url"));
            })
        });
        return $el;
    };

    $.extend(getZtree.prototype,{
        eventInit:function(){
            var self=this;
            //搜索事件
            this.content.on('click', '#BillSearchBtn', $.proxy(this.treeSearch, this));
            //搜索事件
            this.content.on('click', '#hasChoose li i',function(){self.removeHasChoose($(this).closest('li'),self)});
        },
        //bean 循环当前节点  callback回调（返回每次循环的节点 以及其父节点） Pbean 父节点
        LoopArr: function (bean, callback, Pbean) {
            //tier 节点层级  顶层层级 为1  后面子集递增
            for ( a in bean) {
                bean[a].tier=((Pbean&&Pbean.tier)?(Pbean.tier+1):1);
                var back=callback(bean[a], Pbean);
                if ((bean[a].children || bean[a].subChildren)&&(back!=false)) {
                    this.LoopArr((bean[a].children ? bean[a].children : bean[a].subChildren), callback, bean[a])
                }
            }
        },
        //json 处理方法
        manageJson:function(data){
            this.LoopArr(data,function(arr,Parr){
                if(!arr.title){
                    if(Parr){
                        arr.title=Parr.title+"→"+arr.name;
                    }else{
                        arr.title=arr.name;
                    }
                }
                if(arr.tier<=2||arr.tier>3){arr.open=true}
                if(arr.tier>3){
                    if( arr.subChildren||arr.children){
                        arr.nocheck=true;
                    }
                }
                if(arr.tier==3){
                    arr.subChildren=arr.children;
                    arr.children=false;
                }
            });
            console.log(data);
            return data;
        },
        //获取 左树
        getLeftTree:function(jsonArr){
            var self=this;
            $.fn.zTree.init(this.content.find("#billLeftTree"), {
                callback: {
                    onClick: function(ev,tree,treeNode){
                        if(!treeNode.children){
                            self.getRightTree(jsonArr,false,treeNode.id);
                        }
                    }
                }
            },jsonArr);

            self.LoopArr(jsonArr,function(arr,Parr){
                if(!arr.children&&arr.subChildren){
                    self.createRightTree(arr.subChildren);
                    return false;
                }
            });

        },
        //获取 右树 注;is_title 是否以 title显示 name
        getRightTree:function(jsonArr,is_title,id){
            var self=this;
            var getRightData=function(id){
                var childrenData;
                self.LoopArr(jsonArr,function(arr,Parr){
                    if(arr.id==id){
                        childrenData= arr.subChildren;
                        return false;
                    }
                });
                return childrenData;
            };
           self.createRightTree(id?getRightData(id):jsonArr,is_title)
        },
        //生成 右树
        createRightTree:function(json,is_title){
            var self=this;
            $.fn.zTree.init(this.content.find("#billRightTree"), {
                view: {
                    showTitle:false,
                    showIcon:false,
                    dblClickExpand: false,
                    showLine: false,
                    addDiyDom: function(treeId, treeNode) {
                        if(treeNode.url){
                            var $li= $("#" + treeNode.tId),$ul=$li.closest("ul");
                            $ul.css({"padding-top":"6px"});
                            if(treeNode.level!=0){$li.css({"width":$ul.width()/2,"display":"inline-block"})}
                            $("#" + treeNode.tId + "_span").css({"color":"#777"});
                            $("#" + treeNode.tId + "_a").attr("href","javascript:;")
                        }else{
                            $("#" + treeNode.tId + "_span").css({"color":"#333"});
                            $("#" + treeNode.tId).css({"padding":"6px 0 0"})
                        }
                       /* var aObj = $("#" + treeNode.tId + "_a");
                        if ($("#diyBtn_"+treeNode.id).length>0) return;
                        var editStr = "<span id='diyBtn_space_" +treeNode.id+ "' > </span>"
                            + "<button type='button' class='diyBtn1' id='diyBtn_" + treeNode.id
                            + "' title='"+treeNode.name+"' onfocus='this.blur();'></button>";
                        aObj.append(editStr);
                        var btn = $("#diyBtn_"+treeNode.id);
                        if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});*/
                    }
                },
                data: {
                    simpleData: {
                        enable: true
                    },
                    key:{
                        name:is_title?"title":"name"
                    }
                },
                check:{
                    enable: true,
                    chkboxType:{ "Y":"ps", "N":"ps"}
                },
                callback: {
                    onCheck: function(ev,tree,treeNode){
                        !(treeNode.children&&treeNode.subChildren)&&self.addHasChoose(treeNode,treeNode.checked);
                        self.LoopArr(self.json,function(arr,Parr){
                            if(arr.id==treeNode.id){
                                arr.checked=(treeNode.checked);
                                return false;
                            }
                        });
                    }
                }
            },json);
        },
        //树搜索
        treeSearch:function(){
            var searchContent=this.content.find("#BillSearch").val(),
                searchResult=[];
            this.LoopArr(this.json,function(arr,Parr){
                if (!(arr.children || arr.subChildren)&&(arr.title.indexOf(searchContent)!=-1) ){
                    searchResult.push(arr)
                }
            });
            this.getRightTree(searchResult,true)
        },
        //创建 已选择
        addHasChoose:function(option,is_add){
            var $content=this.content.find("#hasChoose");
            if(is_add){
                var liTpl='<li data-id="'+option.id+'" data-name="'+option.name+'" data-url="'+option.url+'" data-tid="'+option.tId+'">' +
                    '<a href="javascript:;">'+option.name+
                    '<i class="iconfont icon-chahao"></i>' +
                    '</a>' +
                    '</li>';
                $content.append(liTpl);
            }else{
                //var $contentSelf= $content.find("li[data-id="+option.id+"]");
                $content.find("li[data-id="+option.id+"]").remove();
            }
        },
        //修改 checked属性 ，移除对应dom
        removeHasChoose:function(li,_self){
            var $li=$(li);
            _self.addHasChoose({id:$li.attr("data-id")},false);
            $("#"+$li.attr("data-tid")+"_check").trigger("click");
        }
    });

    return initialize;
});