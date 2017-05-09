/**
 * Created by lizhao on 2016/3/30.
 *
 *
 */
define(['Util'],
function (Util) {
    var objClass=function(index){
        this.index=index;
        EventListener.call(this);
    };
    //事件监听
    function EventListener(){
        var self=this;
        if( window.addEventListener){
            window.addEventListener('message', function(e){
                handleEvent.call(self,e);
            }, false);
        }else {
            window.attachEvent('onmessage', function(e){
                handleEvent.call(self,e);
            });
        }
    }
    //事件处理
    function handleEvent(event){
        var json= JSON.parse(event.data);
        var paramArr = [];
        for(i in json.param){
            paramArr.push(json.param[i]);
        }
        if(json.type=="function"){
            if(this.index[json.name]){
                this.index[json.name].apply(this.index,paramArr)
            }else if(this.index.main[json.name]){
                this.index.main[json.name].apply(this.index.main,paramArr)
            }
        }else  if(json.type=="event"){

        }
    }
    //消息发送--总方法
    function messageSend(data){
        var iframe=this.index.main.getCurrentIframe();
        // 通过 postMessage 向子窗口发送数据
        if(iframe){
            iframe.el[0].contentWindow.postMessage(JSON.stringify(data),iframe.url)
        }
    }
    //发送事件消息
    function sendEventMsg(name,parame){
        messageSend.call(this,{
            type:"event",
            name:name,
            param:parame
        });
    }
    //发送事件消息
    function sendFunMsg(name,parame){
        messageSend.call(this,{
            type:"function",
            name:name,
            param:parame
        });
    }

    objClass.prototype={
        trigger:function(name,data){
            sendEventMsg.call(this,name,data)
        }
    };

    return objClass;
});