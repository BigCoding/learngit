
define([
	'Util', 
	'js/index/header','js/index/client', 'js/index/main','Compts',
	'js/communication/clientIntro','js/index/postMessage',
	'text!module/index/popAlert.tpl',
	'text!module/index/loading.tpl',
	'text!module/index/screen_loading.tpl',
	'style!assets/css/styles/style.css'
	],
	function (Util,Header,Client, Main,Compts,Intro,PostMessage,popAlertTpl,loadingTpl,srreeLoadingTpl) {

	var header = null, client = null, main=null,_userInfo = null,postMessage=null,
		_index = null,_dialog = null, clientIntro={};
	
	//初始化 initIndex 之前，先进行了 systemUserInfoInit
	var initIndex = function(){
		var $leftSc = $('#content .flagContainer .leftSc');
		//内容选项卡区域
		_index = {
			header:header,
			getUserInfo:function(){
				return _userInfo;
			}, 
			showDialog:$.proxy(showDialog,this),
			destroyDialog:$.proxy(destroyDialog,this),
			selectListInit:$.proxy(selectListInit,this),
			popAlert:popAlert,
			loading:loading,
			screenLoading:screenLoading()
		};
		
		//内容区域初始化
		main = new Main({ el:'#chatWarpContainer', _index:_index });

		postMessage=new PostMessage($.extend(_index, {main:main}));
//		setTimeout(function(){
//			main.createChartWrap({ phoneNum:'audioPanel' });
//		},350)
		

		//头部区域
		header = new Header({ el:'#header', _index:$.extend(_index, {main:main}) });//加载菜单
		header.on('menuItemClick', function(e,obj){
			main.createTab(obj.text, obj.url, obj);
		});

		if (header.communication && header.communication.on){
			header.communication.on('callBegin', function(clientBusiInfo){
				//clientBusiInfo = { phoneNum:'13899998888'}
				clientIntro.update(clientBusiInfo);
			});
			header.communication.on('callEnd', function(clientBusiInfo){
				// main.destroyTab('用户业务信息');
				//clientIntro.update({});
			});
		}

		
		var $content = $('#content');
		var setLayoutType = function(layoutType){
			$content.removeClass('layout1 layout2 layout3');
			var userLayout = '';
			$leftSc.removeClass('sc2');
			switch (layoutType){
				case 1:
					userLayout = 'layout1';
					$leftSc.addClass('sc2');
					break;
				case 2:
					userLayout = 'layout2';
					$leftSc.addClass('sc2');
					break;
				case 3:
					userLayout = 'layout3';
					break;
			}
			$content.addClass(userLayout);
			Util.cookie.set('userLayout',userLayout);
		};
		header.on('layoutChange', setLayoutType);
		//还原用户布局
		var userLayout = Util.cookie.get('userLayout') || 'layout2';
		if (userLayout){
			$content.addClass(userLayout);
			if (userLayout == 'layout2' || userLayout == 'layout1'){
				$leftSc.addClass('sc2');
			}
		}
		$('#content .flagContainer .leftSc').on('click', function(e){
			var $src = $(e.currentTarget);
			if ($src.hasClass('sc2')){
				setLayoutType(3);
				$src.removeClass('sc2')
			}else{
				setLayoutType(2);
				$src.addClass('sc2')
			}
		});

		//微博渠道加关注
		$content.on("click.weibo",".typesTool .weibo",function(){
			$("#weiboAttention").css({top:$(this).offset().top+24+"px",left:$(this).offset().left-$("#weiboAttention").outerWidth(true)/2+9+"px"}).show(0)
			.unbind("mouseleave").bind("mouseleave",function(){
				$(this).hide(0);
			});
		});
		$("#weiboAttention").on("click.weibo",".btnsCon .greenBtn",function(){
			$("#weiboAttention").hide(0);
		});

		//demo
		$("#content .nav > .panel:eq(2)").hide();
		window.setTimeout(function(){
			var $panel = $("#content .nav > .panel:eq(2)");
			$panel.find(".msgInfo .message h1 span").hide();
			$panel.addClass("noneBg").fadeIn(1500,function(){
				$panel.find(".msgInfo .message h1 span").text("00:00").show();
				Util.busiComm.interSetTime(0);
				var $icon = $panel.find(".feixin");
				window.firstPush = window.setInterval(function(){
					$icon.toggleClass("fade");
				},500);
				$panel.removeClass("noneBg")
			});
		},3000);
loading(false)
	};

	var selectListInit = function(options,param){
		var selectList = new Compts.SelectList(options),module;
		selectList.on('panelInit', $.proxy(function(){
			require.undef(options.url);
			require([options.url], $.proxy(function(Module){
				module = new Module(_index,param);
				selectList.setPanelContent(module.$el);
			},this));
		},this));
		selectList.on('confirm', $.proxy(function(){
			if (!module.getChecked){
				console.log('您必须为弹出列表框中的模块设置getChecked方法');
				return false;
			}
			var textStr = '',valueStr = '';
			var items = module.getChecked();
			if (items && items.length){
				textStr = _.map(items, function(item){
					return item[options.nameField || 'name'];
				}).join(',');
				valueStr = _.map(items, function(item){
					return item[options.valueField || 'value'];
				}).join(',');
			}else{
				if (typeof(items) == 'object'){
					textStr = items[options.nameField || 'name'];
					valueStr = items[options.valueField || 'value'];
				}
			}
			selectList.setText(textStr);
			selectList.setValue(valueStr);
			selectList.trigger('moduleConfirm',items);
		},this));
		return selectList;
	};

	//打开显示模块弹框
	var showDialog = function(title, url, param){
		var dialogUrl = 'js/index/dialog';
		require.undef(dialogUrl);
		require([dialogUrl], $.proxy(function(Dialog){
			var config = {};
			if (typeof(title) == 'object'){
				config = title;
				config.businessOptions = title.param;
				config.index=_index;
			}else{
				config = {
					title:title,
					url:url, 
					businessOptions:param,
					index:_index
				}
			}
			_dialog = new Dialog(config);
		},this));
	};

	//移除模块弹框
	var destroyDialog = function(){
		_dialog.dialog.remove();
		_dialog = null;
	};

	//获取用户信息
	var systemUserInfoInit = function(callback){
		var data = {};
		Util.ajax.postJson('front/sh/common!staffInfo?uid=st005',data,function(result){
			if (result.returnCode == 0){
				_userInfo = result.bean;
				// header.userCenterInit(_userInfo);
				callback();
			}
        });
	};

	//登录后的loading页面
	function loading(is_show){
		var $body=$("body"),$loading=$("#indexLoading");
		if(is_show){
			if($loading.length){
				$loading.show()
			}else{
				var loadingHtml=Util.hdb.compile(loadingTpl);
				$body.append(loadingHtml())
			}
		}else{
			$loading.remove();
		}
	}

	//提交数据的loading页面
	function screenLoading(){
		var $body=$("body"),
			loadingFun=function (is_show,text){
				var $loading=$(".Js_screen-loading");
				if(is_show){
					if($loading.length){
						$loading.eq(0).show()
					}else{
						var loadingHtml=Util.hdb.compile(srreeLoadingTpl);
						$body.append(loadingHtml({text:text}))
					}
				}else{
					$loading.remove();
				}
		};

		return {
			show:function(text){
				loadingFun(true,text)
			},
			hide:function(){
				loadingFun()
			}
		}
	}

	//弹出右下提示框 popAlert("sdfsdfsdf",'test');
	function popAlert(content,title,callback){
		var warp='<div class="pop-alert-warp" ><div id="popAlertId" class="pop-alert"></div></div>',$body=$("body"),$warp=$body.find("#popAlertId");
		var listTpl=Util.hdb.compile(popAlertTpl);
		if(!content) return false;
		if(!$warp.length){
			$body.append(warp);
			$warp=$body.find("#popAlertId");
		}
		$warp.prepend(listTpl({title:title?title:'提示',content:content}));
		var list=$warp.children().eq(0);
		list.find(".js-content").animate({"top":0},1000);
		setTimeout(function(){
			list.fadeOut(1500);
			callback&&callback();
		},4000)
	}
	
	$(function(){
		systemUserInfoInit(initIndex);
		document.onkeydown=function(e) {
			e=e||window.event;
			if (e.keyCode === 116 ) {
				e.keyCode = 0;
				// alert("This action is not allowed");
				if(e.preventDefault)e.preventDefault();
				else e.returnValue = false;
				return false;
			}
		}
	});
});
