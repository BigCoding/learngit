define([ 'Util', 'Compts','style!assets/css/styles/index_new.css'],function(Util, Compts) {
	var _indexModule = null;

	var initialize = function(index, options) {
		_indexModule = index;
		var $el = $('<div class="index_panel"><div></div></div>');
		var tab = null;
		var clientBusinessInfoModule = null,abilityQueryNewModule = null,abilityHandleNewModule = null;
		var config = {
			el : $('>div',$el),
			tabs : [ 
				{
					title : '客户信息',
					click : function(e, tabData) {
						var clientBusinessInfoUrl = 'js/common/contact/clientBusinessInfo';
						require.undef(clientBusinessInfoUrl);
						require([clientBusinessInfoUrl], $.proxy(function(Module){
							clientBusinessInfoModule = new Module(_indexModule);
							tab.content(clientBusinessInfoModule.content);
						},this));	
					}
				}, 
				{
					title : '夜间业务查询',
					click : function(e, tabData) {
						var abilityQueryNewUrl = 'js/globalAbility/abilityQueryNew';
						require.undef(abilityQueryNewUrl);
						require([abilityQueryNewUrl], $.proxy(function(AbilityQueryNew){
							abilityQueryNewModule = new AbilityQueryNew(_indexModule);
							tab.content(abilityQueryNewModule.content);
						},this));						
					}
				}, 
				{
					title : '夜间业务办理',
					click : function(e, tabData) {
						var abilityHandleNewUrl = 'js/globalAbility/abilityHandleNew';
						require.undef(abilityHandleNewUrl);
						require([abilityHandleNewUrl], $.proxy(function(AbilityHandleNew){
							abilityHandleNewModule = new AbilityHandleNew(_indexModule);
							tab.content(abilityHandleNewModule.content);
						},this));						
					}
				} 
			]
		};
		_indexModule.header.on('communicationFinish',function(){
			tab = new Compts.Tab(config);
		});
		
		this.content = $el;
		// indexModule.clientIntro.on('acceptNumberChange',function(phoneNum){
		// 	console.log(phoneNum);
		// });
	};

return initialize;
});