define(['Util','Compts'], function(Util,Compts){
    var objClass = function(){
        var dialogConfig = {
            title:'公告管理',
            content:'',
            ok:function(){ },
            okValue: '关闭',
            width:600,height:400,
            modal:1,
            onremove:$.proxy(function(){
                this.dialog = null;
            },this),
            onclose:$.proxy(function (e) {
                this.dialog.remove();
            },this)
        }
        this.dialog = Util.dialog.openDiv(dialogConfig);
        this.$el = $('.ui-dialog-content',this.dialog.node);
        //var $uiDialogContent = $('.ui-dialog-content',this.dialog.node);
        tabInit.call(this);


    }

    var tabInit = function(){
        // require(['tab'], $.proxy(function(Tab){
            var config = {
                el:this.$el[0],
                tabs:[
                    {
                        title:'消息',
                        click:$.proxy(function(e, tabData){
                            listInit.call(this,function(list){
                                tab.content(list.$el);
                            });
                        },this)
                    },
                    {
                        title:'便笺',
                        click:function(){
                            tab.content('便笺内容区域');
                        }
                    },
                    {
                        title:'紧急公告',
                        click:function(){
                            tab.content('紧急公告区域');
                        }
                    },
                    {
                        title:'个人事务',
                        click:function(){
                            tab.content('个人事务区域');
                        }
                    }
                ]
            }
            var tab = new Compts.Tab(config).render();
        
        // },this));
    }
    
    var listInit = function(callback){
        Util.svMap.add('notice','notice.json','')
        // require(['assets/components/list/list'], $.proxy(function(List){
            var config = {
                //el:this.$el[0],
                field:{
                    boxType:'checkbox',
                    key:'id',
                    items:[
                        { text:'标题',name:'text',className:'w120',click:function(e,item){
                            
                        },render:function(item,val){
                            //return '<a href="###">'+val + '</a>'
                            return val;
                        } },
                        { text:'发布人',name:'publishUser',className:'w70' },
                        { text:'发布时间',name:'publishTime' }
                    ],
                    button:{
                        className:'w90',
                        items:[
                            { text:'查看',name:'viewer',click:function(e,item){ 
                                console.log('editor is checked.')
                            } }
                        ]
                    }
                },
                page:{
                    button:{
                        items:[
                            { text:'删除',name:'deleter',click:function(item){ } },
                            { text:'暂停',name:'stopToggle' }
                        ]
                    }
                },
                data:{
                    url:Util.svMap.get('notice')
                }
                
            }
            var list = new Compts.List(config);
            var searchParam = {  }
            list.search(searchParam);
            callback(list);
            //console.log(list)
        // },this));
    }
    return objClass;
});
