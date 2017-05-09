
/*
功能：
    在页面上显示客户列表
参数：
    el 要绑定到页面上的dom节点选择器
事件：
    itemClick 话务员点击客户列表中客户时触发（列表首次初始化，默认触发）
方法：
    
属性：
    
*/
define(['Util','js/index/popWin', 'text!module/index/client.tpl', 'text!module/index/clientItem.tpl'],
    function(Util,popWin, tpl,itemTpl){

    var objClass = function(options){
        Util.eventTarget.call(this);
        this.options = options;
        this.$el = $(this.options.el);
        //初始化左侧列表dom
        this.$el.html(this.template({}));
        this.listInit();
        this.eventInit();
    };
    var seeHistory;
    
    $.extend(objClass.prototype, Util.eventTarget.prototype, {
        constructor:objClass, 
        template:Util.hdb.compile(tpl),
        eventInit:function(){
            //点击下一个请求
            this.$el.on('click', ".tirggerRequest", $.proxy(this.nextRequest,this))
            //查看历史
            this.$el.on("click", ".seeHistory", $.proxy(this.seeHistory,this));
        }, 
        seeHistory:function(){
            var seeHistory = new popWin({
                title:'查看历史',
                id:'seeHistory',
                url:'js/temp/seeHistory',
                _index:{dialog:Util.dialog}
            });
            seeHistory.on("close",function(){
                console.log("close")
            });
            seeHistory.on("clickBtn",function(){
                console.log("clickBtn")
            });
           
        },
        nextRequest:function(){
            var keepMessage = new popWin({
                title:'留言记录',
                id:'keepMessage',
                url:'js/temp/keepMessage'
            });
            
        },
        resetTimerOfCurrentClient:function(){
            this.list[this.currentClientData.phoneNum].interSetTime();
        },
        itemClick:function(e,data, index, timeObj){
            var $src = $(e.currentTarget);
            var index = $src.index();
            this.currentClientData = data;
            this.trigger('itemClick', e, data,index,timeObj);
            var $msgInfo = $src.find('.msgInfo');
            $msgInfo.addClass("select").parents(".panel").siblings().find(".msgInfo").removeClass("select");
        },
        listInit:function(){
            Util.svMap.add('clientInfo','clientInfo.json','');
            Util.ajax.postJson(Util.svMap.get('clientInfo'),'',$.proxy(function(json,status){
                this.json = json;
                if (status) {
                    var $clientContainer = this.$el.find('#J_clientList');
                    $clientContainer.html('');
                    this.list = {}
                    $('.waiting-num .num', this.$el).text(json.bean.waitPersonNum);
                    $.each(json.beans, $.proxy(function(i, data){
                        var clientItem = new ClientItem(data);
                        this.list[data.phoneNum] = clientItem;
                        $clientContainer.append(clientItem.$el);
                        clientItem.on('itemClick', $.proxy(this.itemClick,this));
                    },this));
                    var data = json.beans[0];
                    this.trigger('itemClick', {}, data, 0,{
                        minutes:0,
                        seconds:0
                    });
                    $('#J_clientList>.panel').eq(0).find('.msgInfo').addClass("select");
                    this.currentClientData = data;
                }else{
                    console.log('客户列表初始化失败.')
                }
            }, this));
        }
    });

    var ClientItem = function(options){

        Util.eventTarget.call(this);
        this.options = options;
        this.$el = $(this.template(options));
        this.eventInit();
        this.interSetTime();
    };
    $.extend(ClientItem.prototype, Util.eventTarget.prototype, {
        template:Util.hdb.compile(itemTpl),
        eventInit:function(){
            this.$el.on('click', $.proxy(this.itemClick,this));
        },
        itemClick:function(e){
            this.trigger('itemClick', e, this.options,null,{
                minutes:this.odd.getMinutes(),
                seconds:this.odd.getSeconds()
            });
        }, 
        interSetTime:function(){
            if (this.timer){
                clearInterval(this.timer);
            }
            this.odd = new Date(0,0,0,0,0,0);
            var $text = $('.msgInfo .message h1 span',this.$el);
            this.timer = setInterval($.proxy(function(){
                var s = this.odd.getSeconds();
                this.odd.setSeconds(s+1);
                var m = this.odd.getMinutes();
                var mText = m<10?"0"+m:m;
                var sText = s<10?"0"+s:s;
                var text = mText+":"+sText;
                $text.text(text);
            },this),1000)
        }
    });

    Util.hdb.registerHelper('_channel', function(channelNo) {
        return { '1':'sms','2':'weixin','3':'weibo','4':'feixin','5':'email' }[channelNo];
    });

    return objClass;
});


/*var time = [];
            this.$el.find("#J_clientList .panel .msgInfo .message h1 span").each(function(index, element) {
                var $this = $(this);
                var text = $this.text();
                var str = text.split(":");
                var minutes = parseInt(str[0]);
                var seconds = parseInt(str[1]);
                var date = new Date();
                var odd = new Date(date.getYear(),date.getMonth(),date.getDay(),date.getHours(),minutes,seconds);
                time.push(odd.getTime());
            });
            var nextIndex = 0;
            var temp = time[0];
            for(var i=1;i<time.length;i++){
                if(temp<time[i]){
                    temp = time[i];
                    nextIndex = i;
                }
            }
            nextIndex = nextIndex+2;
            this.$el.find('#J_clientList .panel').eq(nextIndex).click();*/


            /*  seeHistory = new ucd.PopWin({
                 title: '查看历史',
                 isMode:true,
                 isHandFlex:false,
                 closeAction:"hide",
                 width:925,
                 loadType:"ajax",
                 url:"pages/popwin/seeHistory.html",
                 btns:'<a class="grayBtn" href="javascript:void(0);"><span><b>关闭</b></span></a>',
                 callback:function(){
                     var self = this;
                     self.$dom.delegate(".popWin .closeBtn, .popWin .buttons .greenBtn, .popWin .buttons .grayBtn","click",function(){
                         self.remove();
                     });
                 }
             });
             seeHistory.show();*/
