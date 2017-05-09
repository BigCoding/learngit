/*
, 'js/index/communicationUI'
, CommunicationUI
*/
define(['Util', 'text!module/index/topMenu.tpl',
		'text!module/index/header.tpl',
		
		'text!module/index/topMenuLevelOne.tpl',
		'text!module/index/topMenuLevelTwo.tpl',
		'text!module/index/userInfo.tpl'], 
	function(Util, topMenu,headerTpl,
		topMenuLevelOne,topMenuLevelTwo,userInfo){

	//var $_this = null;//???
	var _$el = null;
	var _tips = null;
	var _userInfoLayer = null;
	var topNavLoad = function(keyword,callback){
		// Util.svMap.add('topMenu','topMenu.json','/ngcs/front/sh/common!sysMenu?uid=l0001');
		Util.ajax.postJson('/ngcs/front/sh/common!sysMenu?uid=l0001', {'keyword':keyword}, $.proxy(function(json,status){
			if (status) {
				var menuLevelOneTemplate = Util.hdb.compile(topMenuLevelOne);
				var menuLevelTwoTemplate = Util.hdb.compile(topMenuLevelTwo);

				$('.topNavMenu',_tips.$el).html(menuLevelOneTemplate(json));
				$('.navRightMenu',_tips.$el).html(menuLevelTwoTemplate(json));
				var $menuItems = $(".navRightMenu .menuItem", _tips.$el);
				$menuItems.eq(0).show();
				$('.topNavMenu li',_tips.$el).eq(0).addClass('selected');
				callback && callback();
			}else{
				console.log('查询失败')
			}
		},this));
	};
	var topNavInit = function(main){
		var template = Util.hdb.compile(topMenu);
		var tips = new Util.tips({
			container:$("#menu1"),
			action:'mouseover',
			content:template({})	//handlebars模板数据渲染
		});
		_tips = tips;

		// 张志勇  搜索菜单  start
		tips.$el.on('keyup','#J_memu_key',function(){
			var keyword = $('#J_memu_key',tips.$el).val();
			topNavLoad.call(this,keyword);
		});
		// 张志勇  搜索菜单  end

		//左边菜单切换
		_tips.$el.on('mouseenter','.topNavMenu li',function(e){
			var $menuItems = $(".navRightMenu .menuItem", _tips.$el);
			var $src = $(e.currentTarget);
			$src.addClass("selected").siblings().removeClass("selected");
			var index = $src.index();
			$menuItems.eq(index).show().siblings().hide();
		});
		_tips.$el.on('click','.navRightMenu .menuItem .subMenu dl dd a', $.proxy(function(e){
			var $item = $(e.currentTarget);
			$item.closest(".popLayoutWaep").hide();
			var text = $item.text();
			var url = $item.attr('data-url');
			var id = $item.attr('data-id');
			//main.createTab(text,'');
			e.stopPropagation();
			this.trigger('menuItemClick', e, { text:text, url:url, id:id})
		},this));
		topNavLoad.call(this);
		// Util.busiComm.bindInpEvent($(".navLeftMenu .sBtn input", _tips.$el),"搜索菜单");
	};



	//知识搜索
	var searchKnowledge = function(main){
		var is_show=function(is_show){
			var $warp=$(".top-search .search");
			if(is_show){
				$warp.show();
			}else{
				$warp.hide();
			}
		};

		// Util.busiComm.bindInpEvent($(".search > input"),"搜索知识");
		//点击 搜索按钮 显示搜索
		_$el.on("click","a.js-search",function(){
			Util.dialog.tips('该模块正在开发中',3000);
			// is_show(true);
			// $('.search>input',_$el).placeholder();
		});
		$(window).on("click",function(event){
			var $target=$(event.target);
			if(!$target.closest(".top-search").length){
				is_show(false);
			}
		});
		//搜索知识框按钮
		_$el.on('click',".js-knowledge",function(){
			var $box = $('.layout .menu .search .normal');
			main.createTab("搜索知识","js/temp/knowledge");
			is_show(false);
		})
	};

/*
	//显示公告弹出层
	var showNoticeDialog = function(e){
		require(['js/index/notice'], function(Notice){
			new Notice();
		});

	};*/
	//事件初始化
	var eventInit = function(main){

		//邮件图标点击事件
		_$el.on('click','.js-notepad',$.proxy(function(){
			this.options._index.main.createTab("未读便签","js/notepad/notepadReadInfo");
		},this));

		//我的收藏夹
		_$el.on('click',".js-favorite", $.proxy(function(){
			Util.dialog.tips('该模块正在开发中',3000);
			// this.options._index.main.createTab("收藏夹","js/temp/myFavorite");
		},this));

	};

	var userCenterInit = function(){
		var userInfoJson = this.options._index.getUserInfo();
//詹聪请在这里写代码 
//模拟登陆时间
var myDate = new Date();
var loginStartTime=myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds();
userInfoJson.loginStartTime=loginStartTime;
var main = this.options._index.main;
$('#J_userName').text(userInfoJson.staffName);

var template = Util.hdb.compile(userInfo);//handlebars模板编译
var userLayout = Util.cookie.get('userLayout');
$.extend(userInfoJson, { userLayout:userLayout });
_userInfoLayer = new Util.tips({
	container:$(".userName"),//这里是用户角色，不是什么用户名
	dataType:"url",
	content:template(userInfoJson)	//handlebars模板数据渲染
});

//样式切换
$(".myPerform li").click(function(){
	//$(this).addClass("selected").siblings().removeClass("selected");
	main.createTab($(this).text(),'js/temp/myCoinOfK');
});
$(".tempType li", _userInfoLayer.$el).on("click",$.proxy(function(e){
	var $src = $(e.currentTarget);
	$src.addClass('hover').siblings().removeClass('hover');
	cvthis.trigger('layoutChange', Number($src.attr('data-layout')));
},this));

		
		
	    //退出登录时触发事件
		$("#loginOut", _userInfoLayer.$el).on("click",function(){
			var stauts = confirm("确定退出?");
			if(stauts){
				Util.ajax.postJson('/ngcs/front/sh/logout!index?uid=l0001', '', function(json,status){
					if (status) {
						window.close();
					}else{
						alert("退出失败");
					}
				});
			}
		});
		//注销时触发的事件
		$("#logCancel", _userInfoLayer.$el).on("click",function(){
			var stauts = confirm("确定注销?");
			if(stauts){
				Util.ajax.postJson('/ngcs/front/sh/logout!index?uid=l0001', '', function(json,status){
					if (status) {
						location.href="login.html";
					}else{
						alert("注销失败");
					}
				});
			}
		});


		//接续统计详情单击事件
		$(".js-stat", _userInfoLayer.$el).on("click",$.proxy(function(e){
			new Util.dialog.popWin({
				title:'接续统计详情',
				id:'statDetail',
				okVal:'确定',
				cancelVal:'取消',
				url:'js/common/statistics/detail',
				_index:{Util:Util,main:main}
			});
		 },this));
		//工作日志详情单击事件
		$(".js-record", _userInfoLayer.$el).on("click",$.proxy(function(e){
			this.options._index.showDialog('工作日志详情','js/common/loginLog/staffLoglog',{Util:Util,main:main})
//			new Util.dialog.popWin({
//				title:'工作日志详情',
//				id:'recordDetail',
//				okVal:'确定',
//				cancelVal:'取消',
//				url:'js/common/loginLog/staffLoglog',
//				_index:{Util:Util,main:main}
//			});
		},this));
		
	};



	var objClass = function(options){

		if (options.el){
			_$el = $(options.el);
			_$el.html(headerTpl);
		}else{
			console.log('未设置el属性');
		}
		this.options = options;
		this.userInfo=this.options._index.getUserInfo();

		//this.noticeArr=[];
		//eventInit.call(this);
		Util.eventTarget.call(this);
        topNavInit.call(this,options._index.main);
        //userCenterInit.call(this);
		//new notice($(".flowTools",_$el),this.options._index);
		//searchKnowledge.call(this,options._index.main);
		// this.communication={timer:timer.call(this,options._index.clientIntro)};
		Util.eventTarget.call(this.communication);
		
		
		//实例化 接续接口
		// $.extend(this.communication,new CommunicationUI($.extend(options._index,{ el:$('.follow',_$el),header:this })),Util.eventTarget.prototype);
		//----------------根据登录时所选择的接续厂家决定启动的接续程序-----------
		var manufacturePath = {
			1:'js/communication/huawei/comUI',
			2:'',
			3:'js/communication/xinfang/comUI'
		};
		/*Util.ajax.postJson('front/sh/common!queryCTIInfo?uid=CTI02',{}, $.proxy(function(data,status){
			var comUIPath = manufacturePath[3];
			require([comUIPath],$.proxy(function(CommunicationUI){
				var config = $.extend(options._index,{ 
					el:$('.follow',_$el),
					header:this,
					data:data
				});
				this.communication = new CommunicationUI(config);
			},this));
		},this));*/

		//加载main下 的tab页
		options._index.header=this;
		options._index.main.createChartWrap({ phoneNum:'audioPanel' });
	};

	$.extend(objClass.prototype,Util.eventTarget.prototype);

	//公布消息事件
	var notice = function (el,option) {
		this.$el=el;
		this.index=option;
		this.userInfo=this.index.getUserInfo();
		this.noticeArr=[];
		this.eventInit();
		this.init()
	};

	$.extend(notice.prototype,{
		init:function(){
			var _self=this;
			_self.getNotice(function(beans){
				_self.noticeArr=beans;
				_self.noticeRender()
			});
			setInterval(function(){
				_self.getNotice(function(beans){
					if(JSON.stringify(_self.noticeArr)!=JSON.stringify(beans)){
						_self.noticeArr=beans;
						_self.noticeRender.call(_self)
					}
				});
			},300000);

		},
		eventInit:function(){
			//点击单条公告消息打开该公告事件
			this.$el.on('click','.js-noticeText',$.proxy(function(event){
				var $self=$(event.target||event.currentTarget);
				this.index.main.createTab($self.html(),"js/affiche/afficheDetail",{afficheId:$self.attr("data-id")});
			},this));
			//鼠标悬停单条公告消息打开该公告事件
			this.$el.on('mouseenter','.js-noticeText',$.proxy(function(event){
				clearInterval(this.noticeInterval)
			},this));
			//鼠标悬停单条公告消息打开该公告事件
			this.$el.on('mouseleave','.js-noticeText',$.proxy(function(event){
				this.noticeSetInterval();
			},this));
			//单击公告喇叭打开公告管理事件
			this.$el.on('click','a img',$.proxy(function(event){
				this.index.main.createTab("公告列表","js/affiche/afficheList");
			},this));
		},
		getNotice:function(callback){
			Util.ajax.postJson('front/sh/afficheList!execute?uid=queryAfficheForPortal',{loginStaffId:this.userInfo.staffId}, function(json,status){
				if (status) {
					callback&&callback(json.beans);
				}
			})
		},
		noticeRender:function(){
			var arr=[];
			this.$noticeText=this.$el.find(".js-noticeText");
			$.each(this.noticeArr,function(k,v){
				arr.push('<a title="'+v.title+'" style="margin-right:5px" href="javascript:;" data-id="'+ v.afficheId+'">'+v.title+'</a>')
			});
			this.$noticeText.html(arr.join(" "));
			this.noticeInterval&&clearInterval(this.noticeInterval);
			this.noticeSetInterval();
		},
		noticeSetInterval:function(){
			var _self=this,maxLeft=-_self.$noticeText.width()+90;
			_self.left=_self.left?_self.left:0;
			_self.noticeInterval=setInterval(function(){
				_self.left--;
				if(_self.left<=maxLeft){
					_self.$noticeText.css("margin-left",0);
					_self.left=0;
				}else {
					_self.$noticeText.css("margin-left",_self.left+"px");
				}
			},60);
		}
	});


	//以下是关于 结续的实现方法 add 2016-02-03
	Util.hdb.registerHelper('is_enable', function(value) {
		return value.is_enable?"enable":"disabled";
	});
	Util.hdb.registerHelper('getValue', function(item) {
		var value;
		if(item.value){
			for(var i=0;i<item.options.length;i++){
				var curItem=item.options[i];
				(curItem.value==item.value)&&(value=curItem.text);
			}
		}else{
			value=item.text;
		}
		return value
	});
	Util.hdb.registerHelper('if_mute', function(value,options) {
		if(value=='Mute') {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	Util.hdb.registerHelper('if_selected', function(item,value,options) {
		if(value== item['value']) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	Util.hdb.registerHelper('getColor', function(value) {
		var color='';
		/*
		 签出状态 CheckOut 灰色 未登记
		 忙碌 Busying 红色 禁止呼入
		 空闲 FreeTime 绿色 可以接电话
		 通话中 Dialoging 红色
		 来电待接听 WaitToAnswer 黄色
		 整理态 Tidying 紫色
		 */
		switch (value){
			case "CheckOut":
				color='#ccc';
				break;
			case "Busying":
				color='#ff0048';
				break;
			case "FreeTime":
				color='#9ccd2b';
				break;
			case "Dialoging":
				color='#ff0048';
				break;
			case "WaitToAnswer":
				color='#fff04d';
				break;
			case "Tidying":
				color='#c065ff';
				break;
		}
		return "color:"+color+";"
	});

	return objClass;

});


/*

	var loadTopNav2 = function(main, keyword){
		Util.svMap.add('topMenu','topMenu.json','');
		//ajax请求，详细注释见ajax_amd.js
		//全局菜单
		Util.ajax.postJson(Util.svMap.get('topMenu'), keyword?'keyword='+keyword:'r='+Math.random(), $.proxy(function(json,status){
			if (status) {
				var template = Util.hdb.compile(topMenu);//handlebars模板编译
				Util.tips({
					container:$("#menu1"),
					dataType:"url",
					action:'click',
					content:template(json)	//handlebars模板数据渲染
				});
				//左边菜单切换
				$(".topNavMenu li").hover(function(e){
					$(this).addClass("selected").siblings().removeClass("selected");
					var index = $(this).index();
					$(".navRightMenu .menuItem").eq(index).show().siblings().hide();
					//e.stopPropagation();
				}).eq(0).addClass('selected');
				$(".navRightMenu .menuItem").eq(0).show();
				//按钮失去焦点显示的文字
				Util.busiComm.bindInpEvent($(".navLeftMenu .sBtn input"),"搜索菜单");
				//点击全局菜单的二级菜单添加标签页
				$(".shortBox .subMenu dl dd a").off('click').on("click",$.proxy(function(e){
					var $item = $(e.currentTarget);
					$item.parents(".popLayoutWaep").hide();
					var text = $item.text();
					main.createTab(text,'');
					e.stopPropagation();
					this.trigger('menuItemClick', e, { text:text })
				},this));
				//防止冒泡
				$(".navLeftMenu .sBtn input").off('click').on('click', function(e){
					e.stopPropagation();
				})
				//搜索菜单
				$('#J_searchMenu_btn').off('click').on('click', function(){
					var keyword = $('#J_memu_key').val();
					loadTopNav(main, keyword);
				})
			};
		},this));
	}
*/
