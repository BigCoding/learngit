define(['Util', 'text!module/communication/clientIntro.tpl'], function (Util, tpl) {

    var objClass = function (options) {
        Util.eventTarget.call(this);
        this.options = options;
        this.$el=this.options.el;
        this.waitNum=0;
        this.template=Util.hdb.compile(tpl);
        this.$el = $(this.options.el);
        eventInit.call(this);
        render.call(this,{});
    };

    $.extend(objClass.prototype, Util.eventTarget.prototype, {
        //更新客户信息
        update: function (data) {
            render.call(this,data);
        },
        //更新等待人数
        updateWaitNumber: function (num) {
            this.waitNum=num;
            this.$el.find(".js-waitNum").html(num);
        },
        updateNameAndCity:function(data){
            debugger;
            this.$el.find(".name").html(data.name);
            this.$el.find(".region").html(data.address);
        }
    });

    //更新模板html
    function render(data){
        this.json= $.extend({
            name:"暂无",//姓名
            phoneNum:"",//主叫电话号码
            region:"",//地区
            waitNum:this.waitNum?this.waitNum:0,//等待人数
            contactId:"",//接触编码
            serialNo:""//流水
        },data);
        this.$el.html(this.template(this.json));
    }

    //事件
    function eventInit(){
        var _self=this;
        //输入框回车事件
        this.$el.on("keydown","input",function(event){
            var $input=$(this);
            if(event.keyCode==13){
                var val=$input.val();
                if(RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(val)){
                    var topT = _self.$el.find(".js-input-tips").find(".topT");
                    topT.removeAttr("data-phone");
                    topT.attr("data-phone",val);
                    topT.find("a").text(val);
                    _self.$el.find(".js-input-tips").hide();
                    _self.trigger("acceptNumberChange",val);
                }else{
                    Util.dialog.tips("手机号码不正确");
                }

            }
        });

        //显示隐藏输号框事件
        this.$el.on("click",".js-down",function(event){
           _self.$el.find(".js-input-tips").toggle();
        });

        //点击主动呼叫
        this.$el.on("click",".js-input-tips",$.proxy(function(event){
            var $target=$(event.target||event.currentTarget);
            var phoneNum = $target.text();
            var oldPhoneNum = this.$el.find(".inputpicNum").val();
            debugger;
            if(!(phoneNum == oldPhoneNum)){
                _self.trigger("acceptNumberChange",phoneNum);
                this.$el.find(".inputpicNum").val(phoneNum);
            }
            this.$el.find(".js-input-tips").hide();
        },this));
    }

    return objClass;
});
