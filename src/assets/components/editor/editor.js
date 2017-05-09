/**
 * Created by lizhao on 2016/2/29.
 */

define(['backbone', 'ueditor'],function (Backbone) {

    var objClass = Backbone.View.extend({
        initialize:function(option){
            this.option = option;
            var editorID = 'sn-editor-' + Math.random();
            this.$el.attr('id', editorID);
            // if (option.homeUrl){
            //     window.UEDITOR_HOME_URL = option.homeUrl;
            // }
            var opt= $.extend({
                initialFrameHeight:400, //初始化编辑器高度,默认320
                autoHeightEnabled:false // 是否自动长高,默认true
       /*         ,toolbars: [
                    [
                        'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'formatmatch', 'autotypeset', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'indent', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                        'link', 'unlink', '|',
                        'simpleupload', 'attachment', 'background', '|',
                        'horizontal', 'date', 'time', 'spechars', 'snapscreen', '|',
                        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                        'print', 'preview', 'searchreplace'
                    ]

                ]*/
            },option);
            this.ue=UE.getEditor(editorID,opt);
            this.ue.ready($.proxy(function() {
                //设置编辑器的内容
                this.ue.setContent('hello');
                //获取html内容，返回: <p>hello</p>
                var html = this.ue.setContent(option.content);
                //获取纯文本内容，返回: hello
                // var txt = ue.getContentTxt();
            },this));

            this.content = this.el;
        }, 
        setContent:function(html){
            return this.ue.setContent(html);
        },
        getContent:function(){
            return this.ue.getContent();
        }
    });


    return objClass;

});