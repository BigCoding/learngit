var require = {
	baseUrl : "src/",
    map: {
      	'*': { 'style': 'assets/lib/requirejs/css.min' }
    },
	paths : {
		/*
		*	避免js文件名和映射名相同，防止打包时被当做js文件重命名
		*/
		'jquery' : 'assets/lib/jquery/jquery',
        'backbone':'assets/lib/backbone/1.2.1/a',
		'laydate':'assets/lib/laydate/laydate',
		'text' : 'assets/lib/requirejs/text',
        'artDialog' : 'assets/lib/dialog/6.0.4/dialog-plus',
        'zTree':'assets/lib/zTree_v3/js/jquery.ztree.all',
        'zTreeSimple':'assets/components/zTree/zTree',
        'selectivizr':'assets/lib/selectivizr-1.0.2/selectivizr',
        'ueditorConfig':'assets/lib/ueditor/ueditor.config',
        'ueditor':'assets/lib/ueditor/ueditor.all.min',
        'echarts':'assets/lib/echarts/echarts',
        'pop': 'assets/common/pop_amd',
        'tabs': 'assets/common/tab_amd',
        
        //jquery plugins begin---
        'jquery.jplayer':'assets/lib/jqueryPlugin/jPlayer/dist/jplayer/jquery.jplayer',
        'jquery.tiny':'assets/lib/jqueryPlugin/tiny-pubsub',
        "jquery.placeholder": "assets/lib/jqueryPlugin/placeholder/jquery.placeholder.min",
        "jquery.fileuploader": "assets/lib/jqueryPlugin/jQuery-File-Upload/js/jquery.fileupload",
        "jquery.ui.widget":"assets/lib/jqueryPlugin/jQuery-File-Upload/js/vendor/jquery.ui.widget",
        'jquery.timePicker':'assets/lib/jqueryPlugin/jonthornton-jquery-timepicker/jquery.timepicker',
        "jquery.pagination":"assets/lib/jqueryPlugin/pagination/1.2.1/jquery.pagination",
        //jquery plugins end---

        'cookie' : 'assets/common/cookie',
        'ajax' : 'assets/common/ajax_amd',
        'dialog' : 'assets/common/dialog_amd',
        'hdb' : 'assets/lib/handlebars/handlebars_v4.0.4',
        'eventTarget':'assets/common/eventTarget',
        'form':'assets/common/form_amd',
        'hdbHelper' : 'assets/lib/handlebars/helpers',
        'underscore':'assets/lib/underscore/underscore',
        'json2' : 'assets/lib/json2/json2',

		'tab':'assets/components/tab/tab',
		'list':'assets/components/list/list',
		'select':'assets/components/select/select',
		'date':'assets/components/date/date',
		'editor':'assets/components/editor/editor',
		'validator':'assets/components/validator/validator',
		'selectList':'assets/components/selectList/selectList',
		'selectTree':'assets/components/selectTree/selectTree',
        'voice':'assets/components/voice/voice',
        
        'Util' : 'assets/common/util',
        'Compts' : 'assets/common/components'
	},
	waitSeconds:0,
	shim:{
        'jquery.fileuploader': { deps: ['jquery.ui.widget'] },
        'jquery.fileuploader': { deps: ['jquery'] },
        'jquery.ui.widget': { deps: ['jquery'] },
        'jquery.placeholder': { deps: ['jquery'] },
        'jquery.jplayer': { deps: ['jquery'] },
        'jquery.timePicker': { deps: ['jquery'] },
        'jquery.tiny': { deps: ['jquery'] },
        'jquery.pagination': { deps: ['jquery'] },
        'validator': { deps: ['jquery'] },

        'ueditor': { deps: ['ueditorConfig'] },
        'hdb':{ exports: ['Handlebars'] },
        'hdbHelper': { deps: ['hdb'] },
        'ajax': { deps: ['jquery'] },
        'artDialog': { deps: ['jquery'] },
        // 'dialog': { deps: ['artDialog'], exports: 'dialog' },
        'zTree' : { deps:['jquery'], exports:'$.fn.zTree' }
        
        // 'pager': { deps: ['pagination'] },
        // 'blockUI': { deps: ['jquery'] },
        // 'busiComm': { deps: ['jquery'] },
	},
    // urlArgs: function(id, url) {
    //     //url.endsWith('.tpl')
    //     if (url.match("\.tpl$")) {
    //         return '?v='+Math.random();
    //     }
    //     return '';
    // }

};
