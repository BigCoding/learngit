define(['Util','editor','text!module/index/content.tpl'], function(Util,Editor,tpl){

	var costemerIndex = 0;
	var costemer;
	var ue;
	var initialize = function(index){
		var template = Util.hdb.compile(tpl);
		var params = $.extend({
			client:{phoneNum:17603860227}
		},index.client&&index.client.currentClientData);
		var $content = $(template(params));

		setTimeout(function(){
			ue = new Editor({
				el:$(".editor_rep_"+params.client.phoneNum,$content),
				initialFrameHeight:75,
				wordCount:false,
				elementPathEnabled : false,
				autoHeightEnabled:false,
				minFrameHeight:40,
				toolbars:[["unlink","link","preview","insertimage","snapscreen","emotion","bold","italic","underline","strikethrough","forecolor","fontsize","fontfamily"]]
			});
		},500);
		//右边菜单栏按钮hover样式
		$(".section .userInfoCont .actionItems a",$content).hover(function(e){
			$(this).addClass("hover").siblings().removeClass("hover");
		},function(e){
			$(this).removeClass("hover").siblings().removeClass("hover");
		});
		//点击余额提醒
		$content.find(".remind").click(function(e){
			index.main.createTab("短信提醒余额");
		});
		//点击未完工单提醒
		$content.find(".remindOrder").click(function(e){
			index.main.createTab("未完工单提醒");
		});
		//点击反馈提醒
		$content.find(".feedback").click(function(e){
			index.main.createTab("反馈");
		});
		//点击查看消费记录
		$content.find(".viewRecord").click(function(e){
			index.main.createTab("查看消费记录");
		});
		//右边业务选项点击
		$content.find(".chatRight h1").click(function(){
			var $self = $(this);
			var $next = $self.next(".childres");
			var delay = 500;
			$next.slideToggle(delay);
			//$self.toggleClass("hide");
		});
		//右边业务 上更多链接点击
		$content.find(".chatRight h1 .more").click(function(e){
			alert("more");
			e.preventDefault();
			e.stopPropagation();
		});
		//右边业务 逻辑业务中 更多 链接点击处理函数
		function showMore($target){
			var $more = $target.find(".more");
			var $showMore = $target.siblings(".showMore");
			$showMore.slideToggle(500,function(){
				if($more.hasClass("expend")){
					//				$more.text("更多");
					$more.removeClass("expend");
				}else{
					//				$more.text("收起");
					$more.addClass("expend");
				}
			});
		}
		//右边业务 逻辑业务中 更多 链接点击
		$content.find(".chatRight .childBar .more").click(function(e){
			showMore($(this).parent());
			e.preventDefault();
			e.stopPropagation();
		});
		//点击交谈框上面的li切换样式
		$content.find(".chatTitle ul li").click(function(e){
			$(this).addClass("on").siblings().removeClass("on");
		});
		//提示关闭按钮
		$content.find(".tipBar a.close").click(function(){
			$(this).parent().slideUp(500);
		});
		//右边业务列表的li切换样式
		$content.find(".childres .bussList li").click(function(e){
			$(this).addClass("on").siblings().removeClass("on");
			var index = $(this).index();
			var $items = $(this).parents(".childres").find(".bussItem").eq(index);
			$items.addClass("show").siblings().removeClass("show");
		});

		var over = function (e) {
			$(".chatRight .childres .expect tr", $content).removeClass("tableHover");
			$(this).addClass("tableHover");
			var offset = $(this).offset(), $historyList = $("#historyList");

			$historyList.show();
			var position = {left: offset.left - $historyList.outerWidth(true) / 2 + 135, top: offset.top};
			$historyList.css(position);
			/*if($.browser.msie && parseInt($.browser.version,10) < 8){
			 $("#content").css({
			 "position":"relative",
			 "z-index":"-1"
			 });
			 }*/
			e.stopPropagation();
			e.preventDefault();
		};
		var out = function(e){
			/*if($.browser.msie && parseInt($.browser.version,10) < 8){
			 $("#content").css({
			 "position":"static",
			 "z-index":"-1"
			 });
			 }	*/
			e.stopPropagation();
		};
		//历史记录详情单
		$(".date").parent("tr").unbind("mouseenter.historyList").unbind("mouseleave.historyList").bind("mouseenter.historyList",over).bind("mouseleave.historyList",out);
		/*$(".date").parent("tr").bind("mouseenter.historyList",function(){
		 $(this).children(".date").trigger("mouseenter.historyList");
		 }).bind("mouseleave.historyList",function(){
		 $(this).children(".date").trigger("mouseleave.historyList");
		 });*/
		$("#historyList").hover(function(e){},function(e){$(this).hide();$(".chatRight .childres .expect tr",$content).removeClass("tableHover");});
		//历史记录详情单关闭按钮
		$(".historyList a.close",$content).click(function(e){
			$(this).parents(".historyList").hide();
			e.stopPropagation();
		});
		$("#editor",$content).attr("id","editor_"+window.chatWarpIndex);
		//实例化编辑器
		//var ue = UE.getEditor("editor_"+window.chatWarpIndex);

		//自动级联输入
		/*ue.addListener('focus',function(e){
		 this.setContent("");
		 var text = ue.getContent();
		 if(/请问/.test(text)){
		 var offset = $("#editor_"+window.chatWarpIndex).offset();
		 $(".capacityPrompt").css({top:offset.top+60+"px",left:offset.left+45+"px"}).show(0);
		 }else{
		 $(".capacityPrompt").hide(0);
		 }
		 });

		 $(".capacityPrompt",top.document).undelegate("li","mousedown.capacityPrompt").delegate("li","mousedown.capacityPrompt",function(e){
		 var text = $(this).text();
		 if(text+""){
		 ue.setContent(text);
		 }
		 });
		 ue.addListener('blur',function(e){
		 setTimeout(function(){
		 $(".capacityPrompt").hide(0);
		 },100);
		 });
		 ue.addListener('keyup',function(e){
		 var text = ue.getContent();
		 if(/请问/.test(text)){
		 var offset = $("#editor_"+window.chatWarpIndex).offset();
		 $(".capacityPrompt").css({top:offset.top+60+"px",left:offset.left+45+"px"}).show(0);
		 }else{
		 $(".capacityPrompt").hide(0);
		 }
		 });
		 */

		//加载快捷菜单
		// var pop8 = new ucd.PopLayout({
		// 	container:$chatWarp.find(".tab li"),
		// 	dataType:"url",
		// 	action:'click',
		// 	content:'pages/tabmenu.html'
		// });

		//点击 客户轨迹 Iphone5 手机
		$content.find(".navText .shopping").click(function(e){
			index.main.createTab(" Iphone5 手机","pages/shopping.html");
		});
		//加载微博选择渠道
		/*var popWeiBo = new ucd.PopLayout({
		 container:$chatWarp.find(".chatTitle .weiboContainer"),
		 content:'<ul class="toolMen ch2 weiboChoose"><li><a href="javascript:void(0);" class="twitter">Twitter</a></li><li><a href="javascript:void(0);" class="facebook">Facebook</a></li></ul>'
		 });	*/

		//演示使用
		costemerIndexMap = [0,0,0,0,0,0];
		costemer = [{
			time:"08:20:10:100",
			type:0,
			cont:{time:"08:20",name:'',msg:'好的！',type:'feixin'}
		},{
			time:"08:22:10:100",
			type:0,
			cont:{time:"08:22",name:'',msg:'我没有打那么长话，是不是费用扣错了？',type:'feixin'}
		},{
			time:"08:23:10:100",
			type:0,
			cont:{time:"08:23",name:'',msg:'好的，发到我邮箱吧',type:'feixin'}
		},{
			time:"08:24:30:100",
			type:0,
			cont:{time:"08:24",name:'',msg:'已经收到了，是我自己记错了，谢谢您',type:'feixin'}
		},{
			time:"08:26:10:100",
			type:0,
			cont:{time:"08:26",name:'',msg:'没有了，谢谢',type:'feixin'}
		}];
		//如果是微信咨询则微信回复
		/*--------------------------------------------------------------------------------------------------------*/
		if(window.chatWarpIndex == 2){
			$(".shopping span").text("Ascend P1 手机");
		}else{
			$(".shopping span").text("Iphone5 手机");
		}
		if(window.chatWarpIndex == 1)	{
			costemer = [{
				time:"08:16:10:102",
				type:0,
				cont:{time:"08:16",name:'',msg:'我的设置都是正常的，就是看不了网页',type:'weixin'}
			},{
				time:"08:30:10:100",
				type:0,
				cont:{time:"08:30",name:'',msg:'可以',type:'weixin'}
			}]
		}
		if(window.chatWarpIndex == 2)	{
			costemer = [{
				time:"08:16:10:102",
				type:0,
				cont:{time:"08:16",name:'',msg:'好的，那我看一下红色外壳',type:'weixin'}
			},{
				time:"08:30:10:100",
				type:0,
				cont:{time:"08:30",name:'',msg:'好的，谢谢！',type:'weixin'}
			},{
				time:"08:40:10:100",
				type:0,
				cont:{time:"08:40",name:'',msg:'好的',type:'weixin'}
			}]
		}
		if(window.chatWarpIndex == 4)	{
			costemer = [{
				time:"08:16:10:102",
				type:0,
				cont:{time:"08:16",name:'',msg:'就是想要这个业务，帮我开通吧',type:'feixin'}
			},{
				time:"08:30:10:100",
				type:0,
				cont:{time:"08:30",name:'',msg:'没有了，谢谢！',type:'feixin'}
			}]
		}
		/*--------------------------------------------------------------------------------------------------------*/
		costemerIndex = 0;
		var clickCount = 0;
		if(window.chatWarpIndex == 4){
			clickCount = 0;
		}
		$content.on("click",".sendBtn",function(){
			debugger;
			var html = ue.ue.getContent();
			//var $content = $(this).parents(".content");
			var o = {
				time:"09:16:10:100",
				type:1,
				cont:{time:"08:16",name:'',msg:html,type:'feixin'}
			};
			//演示第一个的时候使用飞信渠道回复
			/*if(window.chatWarpIndex == 0){
			 o.cont.type = "feixin";
			 }*/
			//如果是微信咨询则微信回复
			/*--------------------------------------------------------------------------------------------------------*/
			/*if(window.chatWarpIndex == 1){
			 o.cont.type = "weixin";
			 }
			 if(window.chatWarpIndex == 2){
			 o.cont.type = "weixin";
			 }
			 if(window.chatWarpIndex == 4){
			 o.cont.type = "feixin";
			 }*/
			/*--------------------------------------------------------------------------------------------------------*/
			createMsgItem(o,1,$content);
			//重新计算等待时间
			index.client.resetTimerOfCurrentClient();
			//临时模拟的回应信息
			window.setTimeout(function(){
				createMsgItem({
					time:"09:16:20:100",
					type:0,
					cont:{time:"08:16",name:'',msg:'test info.',type:'feixin'}
				},1,$content);
			},1500);
		});

		nicesRight = Util.busiComm.createScroll($(".scrollBody>.chatRight").height(743));
		$(".scrollBody>.chatRight").delegate(".more,.trigger","click",function(){
			nicesRight.resize();
		});
		$("div.edui-editor.edui-default").width("auto");

		//交流方式
		$(".intercommunion>div").hide(0);
		$(".chatTool li .phone",$content).removeClass("hangUp").parents(".on").removeClass("on");
		var $timer = $(".intercommunion .speech .timer",$content);
		$timer.attr("timer","0").text("00:00:00");
		window.speechTimer&&clearInterval(window.speechTimer);
		$content.undelegate(".chatTool li .phone","click.speech").delegate(".chatTool li .phone","click.speech",function(){
			$timer.attr("timer","0").text("00:00:00");
			if($(this).hasClass("hangUp")){
				$(this).removeClass("hangUp").parents(".on").removeClass("on");
				$(".intercommunion .speech").hide(0);
				window.speechTimer&&clearInterval(window.speechTimer);
			}else{
				$(this).addClass("hangUp");
				$(".intercommunion .speech").show(0);
				function formatDoubleDigit(number){//格式为两位数
					return number<10?"0"+number:number;
				}
				window.speechTimer = setInterval(function(){
					var text = parseInt($timer.attr("timer"),10)||0;
					text += 1;
					var timer = [
						formatDoubleDigit(Math.floor(text/3600)),
						formatDoubleDigit(Math.floor(text%3600/60)),
						formatDoubleDigit(Math.floor(text%3600%60))
					];
					$timer.attr("timer",text).text(timer.join(":"));
				},1000);
			}
		});


		/*根据数据创建内容*/
		function createMsgItem(o,i,p){
			var time = o.time;
			var obj = o.cont;
			var t = o.type;
			var str = '';
			if(t == 1){
				str = createItemRep(obj);
			}else if(t == 0){
				str = createItem(obj);
			}
			p.find(".chatLeft .items > .warp", $content).append(str);
		}

		//创建聊天对话框 -- 客服回复
		function createItemRep(o){
			var s = msgRe(o.msg);
			var repStr = [];
			repStr.push('<div desc-type="'+o.type+'" class="repItem"><div class="msgCont"><div class="gosBox"><div class="gosBoxTop"><div class="gosBoxTopRight"><div class="gosBoxTopCenter"></div></div></div><div class="gosBoxMid"><div class="gosBoxMidRight"><div class="gosBoxMidCenter">');
			repStr.push('<div>'+s+'</div>');
			if(o.type == "weibo"){
				itemStr.push('<div class="rep"><span class="forward">转发 '+o.forward+'</span><span class="line"></span><span class="comment"><span class="repCenter">评论 <i>'+o.comment+'</i></span></span><a href="#" class="rePersonalLetter"><span class="repCenter">回私信</span></a></div>');
			}
			repStr.push('</div></div></div><div class="gosBoxButtom"><div class="gosBoxButtomRight"><div class="gosBoxButtomCenter"></div></div></div></div></div>');
			repStr.push('<div class="icon"><div class="msgType"><span class="type '+o.type+'"></span></div><p class="time">'+/*o.time*/getRepTime()+'</p></div></div>');
			return repStr.join("");
		}

		function createItem(o){
			var s = msgRe(o.msg);
			var repStr = [];
			var itemStr = [];
			itemStr.push('<div desc-type="'+o.type+'" class="item"><div class="line"><div class="icon"><div class="msgType"><span class="type '+o.type+'"></span></div><p class="time">'+/*o.time*/getRepTime()+'</p></div><div class="msgCont"><div class="cosBox"><div class="trangle"></div><div class="cosBoxTop"><div class="cosBoxTopRight"><div class="cosBoxTopCenter"></div></div></div>');
			itemStr.push('<div class="cosBoxMid"><div class="cosBoxMidRight"><div class="cosBoxMidCenter">');
			o.name&&itemStr.push('<h1><span class="name">'+o.name+'</span></h1>');
			itemStr.push('<div>'+s+'</div>');
			if(o.type == "weibo"){
				itemStr.push('<div class="rep"><span class="forward">转发 '+o.forward+'</span><span class="line"></span><span class="comment"><span class="repCenter">评论 <i>'+o.comment+'</i></span></span><a href="#" class="rePersonalLetter"><span class="repCenter">回私信</span></a></div>');
				var reps = o.reps;
				var l = reps ? reps.length : 0;
				if(l > 0){
					for(var i = 0 ; i < l ; i++){
						var oo = reps[i];
						var ss= msgRe(oo.msg);
						repStr.push('<div class="cosBox repCosBox"><div class="cosBoxTop"><div class="cosBoxTopRight"><div class="cosBoxTopCenter"></div></div></div><div class="cosBoxMid"><div class="cosBoxMidRight"><div class="cosBoxMidCenter"><div>'+ss+'</div><div class="rep"><span class="forward">转发 '+oo.forward+'</span><span class="line"></span><span class="comment"><span class="repCenter">评论 '+oo.comment+'</span></span></div></div></div></div><div class="cosBoxButtom"><div class="cosBoxButtomRight"><div class="cosBoxButtomCenter"></div></div></div></div>');
					}
				}
			}
			itemStr.push('</div></div></div><div class="cosBoxButtom"><div class="cosBoxButtomRight"><div class="cosBoxButtomCenter"></div></div></div></div>');
			itemStr.push(repStr.join(""));
			itemStr.push('</div></div></div>');
			return itemStr.join("");
		}
		/*转换内容中的图片代号*/
		function msgRe(s){
			for(var i = 0 ; i < 21/*代表有21种替换表情*/ ; i++){
				var st = "&img"+(i+1)+";";
				var reg = new RegExp(st);
				s = s.replace(reg,'<img src="resources/default/images/qq/'+(i+1)+'.gif"/>');
			}
			return s;
		}

		//回复时间获取函数
		function getRepTime(){
			function formatDoubleDigit(number){//格式为两位数
				return number<10?"0"+number:number;
			}
			var time = new Date();
			return formatDoubleDigit(time.getHours()) + ":" + formatDoubleDigit(time.getMinutes()) +":"+ formatDoubleDigit(time.getSeconds());
		}
		return $content;
	};

	return initialize;
});