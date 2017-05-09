
/*
功能：
    创建一个选项卡组 面板集合 对象
参数：
    el 要绑定到页面上的dom节点选择器
事件：
    
方法：
    createChartWrap 创建一个面板（选项卡组）
    showChartWrap 显示已经存在的面板
        参数 phoneNum客户手机号码
    createTab 在当前选项卡组中，新建一个选项卡
        参数 title选项卡标题；url选项卡加载的模块
    hasPanel 是否有该面版
        参数 phoneNum客户电话号码
属性：
    
*/
define(['Util', 'text!module/index/client.tpl','text!module/index/shortMenu.tpl'], function(Util, tpl,shortMenu){

    var defaultTabs = { items:[
        {"title":"静态测试页面","dom":"indSpace","isFrame":false,"closeable":false,"url":"js/example/test"}
    ]};

    var objClass = function(options){
        Util.eventTarget.call(this);
        this.options = options;
        $.extend(this.options._index, {
            main:this
        });
        this.$el = $(this.options.el);
        this.clientPanels = {};

        //获取tab页签信息
        // Util.svMap.add('tab','tab.json','');
        // Util.ajax.getJsonAsync(Util.svMap.get('tab'),'',$.proxy(function(json,status){
        //     if (status) {
        //         this.tabsJSON = json;
        //     }
        // },this));
        //this.listInit();
        //this.eventInit();
    };

    $.extend(objClass.prototype, Util.eventTarget.prototype, {
        template:Util.hdb.compile(tpl),
        eventInit:function(){
            /*
            this.$el.on('click','#J_clientList .panel', $.proxy(function(e){
                
            },this));
            */

        }, 
        hasPanel:function(phoneNum){
            return this.clientPanels[phoneNum];
        },
        createTab:function(title, url, businessOptions){
            var item = _.find(this.currentPanel.glbTab.items, function(item){
                return item.data.title == title;
            });
            if (!item){
                if (title && url){
                    var options = { title:title, url:url || '' };
                    var strRegex = "^((https|http)://)(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
                    if( new RegExp(strRegex).test(url)){
                        options.isFrame=true;
                    }
                    var clientPanel = this.currentPanel;
                    var tab = clientPanel.glbTab.createTab(options, businessOptions);
                    tab.show();
                }else{
                    console.log('tab create fail.');
                }
            }else{
                item.show();
            }
            
        },
        destroyTab:function(title){
            var clientGlbTab = this.currentPanel.glbTab,
                items=clientGlbTab.items;
            title=(title?title:clientGlbTab.curItem.data.title);
            $.each(items,function(key,val){
                if(val.data.title==title){
                    clientGlbTab.closeTab(key)
                }
            });
        },
        getActiveTab:function(){
            return this.currentPanel.glbTab.curItem;
        },
        hideAllChartWrap:function(){
            $.each(this.clientPanels,function(i, panel){
                if (panel.$chatWarp){
                    panel.$chatWarp.removeClass('show');
                }
            });
        },
        showChartWrap:function(phoneNum){
            this.hideAllChartWrap();
            var clientPanel = this.clientPanels[phoneNum];
            if (clientPanel){
                clientPanel.$chatWarp.addClass("show");
                this.currentPanel = clientPanel;
            }
        },
        createChartWrap:function(data){
            this.hideAllChartWrap();
            var $chatWarp = null;
            //<ul class="tab"><li class="trigger"></li></ul>
            var html = '<div class="chatWarp show">';
                html+='<div class="tabsCont"><div class="tabs"></div></div><ul class="tab"><li class="trigger"></li></div>';
            $chatWarp = $(html);
            $chatWarp.appendTo(this.$el);
            this.updateMenu();
            //"#tabs_"+index
            this.currentPanel = this.clientPanels[data.phoneNum] = {
                $chatWarp:$chatWarp,
                glbTab:new Util.tabs({ container:$chatWarp.find('.tabs'), data:defaultTabs, 
                    _index:this.options._index })
            };
            //glbTab.chatWarpIndex = index;
            //glbTabArr.push(glbTab);


        },
        //获取当前打开的iframe
        getCurrentIframe:function(){
            var curItem =this.currentPanel.glbTab.curItem;
            if(!curItem.iframe) return false;
            return {
                el:curItem.iframe,
                url:curItem.content
            }
        },
        updateMenu:function(){
            var self=this;
            // Util.svMap.add('shortMenu','shortMenu.json','/ngcs/front/sh/common!execute?uid=l0002');
            /*Util.ajax.postJson('front/sh/common!shortCntMenu?uid=l0002', '', $.proxy(function(json,status){
                if (status) {
                    var template = Util.hdb.compile(shortMenu);
                    var tips = new Util.tips({
                        container:$(".tab li"),
                        action:'mouseover',
                        content:template(json)
                    });
                    tips.$el.on("click",".subMenu a",function(e){
                        var $self=$(this);
                        $self.closest(".popLayoutWaep").hide();
                        // 获取待创建tab标签相关信息
                        var text=$self.html();
                        var url=$self.attr("data-url");
                        var id=$self.attr("data-id");
                        var options={"text":text, "url":url, "id":id};
                        self.createTab(text, url, options);
                    })

                }else{
                    console.log('查询失败')
                }
            },this));*/
        }
    });

    return objClass;
});


/*

var $chatWarp = $("#chatWarpContainer .chatWarp[dec='"+index+"']");
window.chatWarpIndex = index;

if($chatWarp.length > 0){
    $chatWarp.addClass("show");
    for(var i=0;i<glbTabArr.length;i++){
        if(glbTabArr[i].chatWarpIndex == index){
            glbTab = glbTabArr[i];
            break;
        }
    }
    $chatWarp.siblings().removeClass("show");
    if(index != 1){
        $(".navText ul").hide();
    }else{
        $(".navText ul").show();
    }
    return;
}else{
    var html = '<div class="chatWarp show" dec="'+index+'"><ul class="tab"><li class="trigger"></li></ul>';
        html+='<div class="tabsCont"><div id="tabs_'+index+'" class="tabs"></div></div></div>';
        $chatWarp = $(html).appendTo($("#chatWarpContainer"));
        glbTab = new Util.tabs({container:"#tabs_"+index,data:tabDefaultData});
        glbTab.chatWarpIndex = index;
        glbTabArr.push(glbTab);
}
$chatWarp.siblings().removeClass("show");
$chatWarp.find(".chatLeft .items > .warp").html("");//清空聊天区域
*/


        // {"title":"综合","dom":"indSpace","isFrame":false,"closeable":false,"url":"js/example/commonExample"}

        // {"title":"客户业务信息","dom":"indSpace","isFrame":false,"closeable":false,"url":"js/example/component/editor"}

                // {"title":"客户信息首页","dom":"indSpace","isFrame":false,"closeable":false,"url":"js/index/content"}
    // {"title":"账单","dom":"indSpace","isFrame":false,"closeable":false,"url":"src/module/index/bill.tpl"},
    // {"title":"业务办理","dom":"indSpace","isFrame":false,"closeable":false,"url":""},
    // {"title":"通知模板维护","dom":"indSpace","isFrame":false,"closeable":false,"url":"pages/commonSearch.html"},
    // {"title":"新增通知模板记录","dom":"indSpace","isFrame":false,"closeable":false,"url":"pages/feeRecord.html"}

