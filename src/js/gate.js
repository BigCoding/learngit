define(['Util', 'selectList',
		'text!module/index/screen_loading.tpl',
		'style!assets/css/styles/style.css'],
	function (Util,SelectList,srreeLoadingTpl) {
		//初始化 initIndex 之前，先进行了 systemUserInfoInit
		var _index= $.extend({},crossAPI),_dialog,_param,_dialogId,_objClass;
		var Root = window.location.href.split("#")[0];
		var initIndex = function(){
			var $contentArea=$('#contentArea');
			if(!$contentArea.html().length){
				_index.getIndexInfo(function(param){
					_param=param;
				var moduleUrl = window.location.hash.substr(1);
				//console.log('');
				moduleUrl=(moduleUrl?moduleUrl.split("&")[0]:_param.iframe.url.split("#")[1]);
				//console.log("window:"+window.location.href);
				require([moduleUrl],function(objClass){
					// console.log("当前js模块:"+moduleUrl+".类型是:"+typeof(objClass));
					_objClass=objClass;
						//console.log("当前js模块:"+moduleUrl+".类型是:"+typeof(_objClass));
						if (typeof(_objClass) === 'function'){
							var result = new _objClass(extendIndex(param), param.iframe.businessOptions,param);
							//console.log("new之后的类型:"+typeof(result));
							if (typeof(result) === 'object'){
								if (result.hasOwnProperty('content')){
									$contentArea.empty().append(result.content);
								}else{
									$contentArea.empty().append(result);
								}
							}else{
								$contentArea.html(result);
							}
						}
				},function(){
					//console.log("当前js模块:"+moduleUrl+"加载失败");
				});

				})
			}
		};

		function extendIndex(param){

			$.extend(_index,{
				showDialog:function(title, url, param){
					var config = {};
					if (typeof(title) == 'object') {
						config = title;
						config.businessOptions = title.param;
						config.index = _index;
					} else {
						config = {
							title: title,
							url: url,
							businessOptions: param,
							index: _index
						}
					}
					config.url=(Root+"#"+config.url);
					config.id=_dialogId=config.id?config.id:"ngwfDialog"+Math.random();
					crossAPI.showDialog(config)
				},
				destroyDialog:function(id,param){
					crossAPI.destroyDialog(id?id:_dialogId,param);
				},
//				iframeDialog:function(){
//					arguments[0].url=Root+"#"+arguments[0].url;
//					crossAPI.iframeDialog.apply(crossAPI, agtDeal(arguments));
//				},
				//destroyDialog:destroyDialog,
				main:{
					createTab:function(){
						if(!arguments[3]){
							arguments[1]=Root+"#"+arguments[1];
						}
						crossAPI.createTab.apply(crossAPI, agtDeal(arguments));
					},
					destroyTab:function(){
						crossAPI.destroyTab.apply(crossAPI, agtDeal(arguments));
					},
					getActiveTab:function(){
						return param.iframe
					},
					currentPanel:currentPanel(param)
				},
				getUserInfo:function(){
					return $.extend({},param.userInfo,{
						/*sysNo:"185k",
					    staffId:"HA00011",
					    deptId:"001050001"*/
					});
				},
				selectListInit:selectListInit,
				screenLoading:screenLoading()
			});
			return _index
		}
		function agtDeal(agt){
			if(agt.length>1){
				var tmp=[];
			/*	for(var key in agt){
					//key是属性,object[key]是值
					tmp.push(agt[key]);//往数组中放属性
				}*/
				for(var i=0;i<agt.length;i++){
					tmp.push(agt[i])
				}
				return tmp;
			}else {
				return agt
			}

		}

		function currentPanel(param){

			return {
				glbTab:{
					curItem:{
						data:param.iframe
					}
				}
			}
		}

		function selectListInit(options,param){
			var selectList = new SelectList(options), module = null;
			//options.url=Root+"#"+options.url;
			selectList.on('panelInit', $.proxy(function(){
				require.undef(options.url);
				require([options.url], $.proxy(function(Module){
					//_index.getIndexInfo(function(param){
						module = new Module(extendIndex(_param),$.extend(_param.iframe.businessOptions,param));
						selectList.setPanelContent(module.$el);
//					});
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

		function showDialog(title, url, param){
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
			if( new RegExp("^(http(s|)://)").test(config.url)){
				crossAPI.showDialog(config);
				return false
			}
			var dialogUrl = 'js/index/dialog';
			require.undef(dialogUrl);
			require([dialogUrl], $.proxy(function(Dialog){
				_dialog = new Dialog(config);
			},this));
		}

	/*	//移除模块弹框
		function destroyDialog(){
			crossAPI.destroyDialog();
			_dialog.dialog.remove();
			_dialog = null;
		};*/
		$(initIndex);
	});

