
//../node_modules/compts_npm/components/list/
define(['backbone', 'hdbHelper', 'dialog',
        'text!assets/components/list/list.tpl',
        'text!assets/components/list/listTips.tpl',
        'text!assets/components/list/noRecord.tpl',
        'style!assets/components/list/list.css',
        'style!assets/lib/dialog/6.0.4/css/ui-dialog.css',
        'jquery.pagination','style!assets/lib/jqueryPlugin/pagination/1.2.1/pagination.css'],
    function(Backbone, hdb, dialog, tpl,listTipsTpl,no_recordTpl){
    var Model = Backbone.Model.extend({});
    var ListItemCellModel = Backbone.Model.extend({});
    var Collection = Backbone.Collection.extend({
        model:Model
    });

    var checkAll=function(e){
        var $checkAllBox = $(e.currentTarget);
        var checked = $checkAllBox.is(":checked");
        $.each(this.collection.models, function(i,item){
            item.set('checked',checked);
        });
    };
    var addOne = function(i,model){
        var listItem = new ListItem({ model:model, listOptions:this.options });
        $('tbody',this.el).append(listItem.render().el);
        listItem.on('rowClick',$.proxy(function(e, data){
            if (this.options.field.boxType == "radio"){
                $('tbody tr',this.el).removeClass('selected');
                this.selectedData = data;
            }
            this.trigger('rowClick',e,data);
        },this));
        listItem.on('cellClick',$.proxy(function(e, data,text){
            this.trigger('cellClick',e,data,text);
        },this));
        listItem.on('checkboxChange',$.proxy(function(e, checked){
            this.trigger('checkboxChange',e,model.toJSON(),checked);
        },this));
        listItem.on('rowDoubleClick',$.proxy(function(e){
            this.trigger('rowDoubleClick',e,model.toJSON());
        },this));
        
    };

    var pageInit=function(result){
        var $pagination = this.$pagination = $('tfoot .pagination',this.el);
        var total = result.bean.total || 0;
        var optTotal = null;
        if(this.options.page.total){
            optTotal = '共'+total+'条';
        }
        if (!this.loaded){
            this.loaded = 1;
            this.objPagination = $pagination.pagination(total, {
                'items_per_page'      : this.options.page.perPage || 10,
                'current_page': typeof this.pageIndex == 'undefined' ? 0 : this.pageIndex,
                'num_display_entries' : 3,
                'num_edge_entries'    : 1,
                'skip_page':"跳转",
                //'link_to': '#tradeRecordsIndex' ,
                'link_to':'javascript:;',
                'total': optTotal,
                'prev_text'           : "上一页",
                'next_text'           : "下一页",
                'call_callback_at_once' : false,  //控制分页控件第一次不触发callback.
                'custom_pages':this.options.page.customPages,
                'callback': $.proxy(function(pageIndex, $page){
                    loading.call(this,pageIndex);
                    //Util.pagination(page_index , false , pageParams , str );  
                },this)
            });
        }
    };
    var loading=function(pageIndex){
        var isLoad=(typeof pageIndex!="number");
        var url ="";
        this.pageIndex = pageIndex;
        if(this.options.data){
            url=this.options.data.url;
        }
        if(isLoad){
            var result={
                bean:{total:1},
                beans:pageIndex
            };
        }else{
            pageIndex = pageIndex || 0;
        }
        var perPage = ((this.objPagination && this.objPagination.perPage) || (this.options.page&&this.options.page.perPage)) || 3;
        var start = pageIndex*perPage;
        // start limit
        // if (url.indexOf('?') < 0){
        //     url+='?';
        // }else{
        //     url+='&';
        // }
        // url += 'start='+start+'&limit='+perPage+'&_='+Math.random();
        var colspan = this.options.field.items.length + 
            (this.options.field.button && this.options.field.button.items && this.options.field.button.items.length ? 1 : 0) +
            (this.options.field&&this.options.field.popupLayer&&this.options.field.popupLayer.groups ? 1 : 0) +
            (this.options.field.boxType == 'checkbox'?1:0);
        // var loadingTemplate = hdb.compile(loadingTpl);
        $('.sn-list',this.$el).addClass('sn-list-loading');
        if(isLoad){
            ajaxHandle.call(this,result,colspan);
        }else{
            if (this.searchParam){
                $.extend(this.searchParam,{
                    start:start,
                    limit:perPage,
                    _:Math.random()
                });
            }
            $.ajax({
                url:url,
                type:'post',
                dataType:'json',
                data:this.searchParam,
                success:$.proxy(function(result){
                    var content=result;
                    ajaxHandle.call(this,result,colspan);
                },this),
                error:function(err){
                    console.log('集成组件-列表 数据加载失败');
                }
            });
        }
    };
    var no_recordTemplate = hdb.compile(no_recordTpl);
    var ajaxHandle=function(result,colspan){
        $('tbody',this.el).empty();
        $('.sn-list',this.$el).removeClass('sn-list-loading');
        this.total=result.bean.total;
        loadHandle.call(this,result,colspan);
        this.options.page&&pageInit.call(this,result);
        this.trigger('success', result);
    };
    var loadHandle=function(result,colspan){
        this.collection = new Collection(result.beans);
        if(this.collection.models.length){
            $.each(this.collection.models, $.proxy(addOne,this));
        }else{
            $('tbody',this.el).html(no_recordTemplate({colspan:colspan}));
        }
        //events对象已废弃
        // if (this.options && this.options.events && this.options.events.afterBuild){
        //     this.options.events.afterBuild.call(this,this.collection.models);
        // }
        this.trigger('afterBuild', this,this.collection.models);
    };

    // ListItem define
    var changeSelectStatus = function(e){
        var $box = $(e.currentTarget);
        var checked = $box.is(':checked')?1:0;
        this.model.set('checked', checked);
        this.trigger('checkboxChange',e,checked);
        return false;
    };
    var ListItem = Backbone.View.extend({
        tagName:'tr',
        events:{
            'click    td>input':changeSelectStatus,
            'click    ':'rowClick',
            'dblclick ':'rowDoubleClick',
            'click    .boxWraper':'boxWrapperClick',
            'mouseenter  td.tooltip':"hover",    
        },
        eventInit:function(){
            $('td>.btns>input[name="deleter"]'.$el).on('click',$.proxy(deleterClick,this))
            $('td>input', $el).on('click', $.proxy(changeSelectStatus,this))
        },
        initialize:function(options){
            this.options = options;
            this.model.on('change:checked', $.proxy(function(model,checked,p2){
                this.render();
                if (this.options.listOptions.field.boxType =='checkbox' && checked){
                    this.$el.addClass('selected');
                }else{
                    this.$el.removeClass('selected');
                }
            },this));
        },
        render:function(){
            var json = this.model.toJSON();
            var boxType = this.options.listOptions.field.boxType;
            this.$el.html('');
            if (boxType){
                switch (boxType){
                    case 'checkbox':
                    	var $boxWraper = $('<td class="boxWraper"></td>');
                        $boxWraper.append('<input type="checkbox" value="'+ json[this.options.listOptions.field.key] +'" '+ (json.checked?'checked=checked':'') +' />');
                        break;
                }
                this.$el.append($boxWraper);
            }
            var listOptions = this.options.listOptions;
            listOptions.field.items&&$.each(listOptions.field.items,$.proxy(function(i,item){
                var cellView = new ListItemCellView({ config:item,data:json });
                this.$el.append(cellView.render().el);
            },this));

            var className = listOptions.field.button&&listOptions.field.button.className?listOptions.field.button.className:'';
            var $buttonCell = $('<td class="btnStyles '+className+'"></td>');
            if (listOptions.field &&
                listOptions.field.button && listOptions.field.button.items &&
                listOptions.field.button.items.length){
                this.$el.append($buttonCell);
                listOptions.field.button&&$.each(listOptions.field.button.items,$.proxy(function(i,item){
                    var buttonView = new ListItemButtonView({ config:item,data:json});
                    $buttonCell.append(buttonView.render().el);
                },this));
            }
            if(listOptions.field &&
               listOptions.field.button && listOptions.field.button.render){
                var item = json;
                var btnRender = listOptions.field.button.render;
                var $result = $(btnRender($buttonCell,item));
                if(!$('.btnStyles',this.el).length){ 
                    this.$el.append($buttonCell);
                }
                $('.btnStyles',this.el).append($result);
            }
            if(listOptions.field&&listOptions.field.popupLayer&&listOptions.field.popupLayer.groups){
                var lastText = listOptions.field.popupLayer.text?listOptions.field.popupLayer.text:"更多";
                this.$el.append('<td class="tooltip"><a href="javascript:;"><i class="ic ic-detail"></i>'+lastText+'</a></td>');
            }

            return this;
        },
        boxWrapperClick:function(e){
            var $box = $('input',e.currentTarget);
            var checked = $box.is(':checked')?0:1;
            this.model.set('checked', checked);
            this.trigger('checkboxChange',e,checked);
            return false;
        },
        hover:function(e){
            var $Tr = $(e.currentTarget)[0];
            var popupLayer=this.options.listOptions.field.popupLayer;
            var json=this.model.toJSON();
            hdb.registerHelper('deal_item', function(items,options) {
                var arr=[];
                for(var i=0;i<items.length;i++){
                    var fieldConfig = items[i];
                    var fieldName = items[i].name;
                    var fieldValue = json[fieldName];
                    if(fieldValue){
                        var text = fieldConfig.render ? fieldConfig.render(fieldConfig,fieldValue) : fieldValue;
                        // if(fieldConfig.render){
                        //     text=fieldConfig.render(fieldConfig,fieldValue);
                        // }else {
                        //     text=fieldValue;
                        // }
                        arr.push({name:fieldConfig.text,text:text,width:100/items.length+'%'})
                    }
                    //字段为空时，不再显示该字段
                    // else{
                    //     arr.push({name:fieldConfig.text,text:"没有数据",width:100/items.length+'%'})
                    // }
                }
                return options.fn(arr);
            });
            var id="sn-tr-hover";
            if(e.type=="mouseenter"){
                if(popupLayer&&popupLayer.groups.length){
                    var tempDialog = dialog.get(id);
                    if (tempDialog){
                        tempDialog.close().remove();
                    }
                    var dialogConfig = {
                        id:id,
                        align: 'left',
                        content:hdb.compile(listTipsTpl)(popupLayer.groups)
                    }
                    if (popupLayer.width){
                        _.extend(dialogConfig,{width:popupLayer.width});
                    }
                    if (popupLayer.height){
                        _.extend(dialogConfig,{height:popupLayer.height});
                    }
                    var d=dialog.openDiv(dialogConfig);
                    this.dialog = d;
                    d.show($Tr);
                    $(d.node).on('mouseleave',function(){
                        d.close().remove();
                    });
                }
            }
        },
        cellClick:function(e, cellConfig){
            var $src = $(e.currentTarget);
            this.trigger('cellClick', e, cellConfig);
        },
        rowDoubleClick:function(e){
            this.trigger('rowDoubleClick', e,this.model.toJSON());

        },
        rowClick:function(e){
            var $src = $(e.currentTarget);
            this.trigger('rowClick', e, this.model.toJSON());
            if (this.options.listOptions.field.boxType == "radio"){
                this.$el.addClass('selected');
            }
            
        }
    });
    var ListItemButtonView = Backbone.View.extend({
        tagName:'a',
        events:{
            'click':'buttonClick'
        },
        initialize:function(options){
            this.$el.attr('href','javascript:;');
            this.options = options;
            if(this.options.config.name){
                this.$el.attr('name',this.options.config.name);
            }
        },
        render:function(){
            this.$el.html(this.options.config&&this.options.config.text);
            return this;
        },
        buttonClick:function(e){
            if (this.options && this.options.config && this.options.config.click){
                this.options.config.click.call(this,e,this.options);
            }


        }
    });

    var ListItemCellView = Backbone.View.extend({
        tagName:'td',
        events:{
            'click':'cellClick'
        },
        initialize:function(options){
            this.options = options;
        },
        render:function(){
            var cellVal = this.options.data[this.options.config.name];
            if (this.options.config.render){
                cellVal = this.options.config.render.call(this,this.options.data,cellVal,this.$el);
            }
            this.$el.html(cellVal);
            if (this.options.config && this.options.config.className){
               this.$el.addClass(this.options.config.className)
            }
            if (this.options.config && this.options.config.title){
                this.$el.attr("title",this.options.data[this.options.config.title])
            }
            return this;
        },
        cellClick:function(e){
            if (this.options && this.options.config && this.options.config.click){
                this.options.config.click.call(this,e,this.options);
            }
            //this.trigger('click', e,this.options);
        }
    });
    var version = '1.0.1';
    var objClass = Backbone.View.extend({
        version:version,
        events:{
            'click  thead .checkAllWraper>input':checkAll,
            'click tfoot .btns>.btn':'btnClick'
        },
        template:hdb.compile(tpl),
        initialize:function(options){
            if (!options){
                console.log('please config params for list.');
                return this;
            }
            this.options = options;
            hdb.registerHelper('footerColspanCount', function(field) {
                if (!field){
                    return 0;
                }
                return field.items.length + (typeof(field.boxType)=='string'?1:0) +
                    (field&&field.popupLayer&&field.popupLayer.groups ? 1 : 0) +
                    (typeof(field.button)=='object'?1:0);
            });
            this.$el.html(this.template(options));
            // $('table',this.el).addClass('sn-list');
            if (options.page && options.page.align && options.page.align == 'left'){
                $('tfoot .pagination',this.el).addClass('align-left');
            }
            if (options.page && options.page.button &&options.page.button.url){
                require([options.page.button.url],$.proxy(function(Module){
                    var module = new Module(options.page.button.param || {});
                    $('tfoot .buttons', this.el).append(module.content);
                },this));
            }
        },
        getSelected:function(){
            return this.selectedData;
        },
        getCheckedRows:function(){
            var models = _.filter(this.collection.models,function(item) { 
                return item.toJSON().checked == '1';
            });
            return _.map(models, function(item){
                return item.toJSON();
            });
        },
        refresh:function(){
            // this.loaded = 0;
            loading.call(this, this.objPagination.currentPage || 0);
        },
        search:function(searchParam, pageIndex){
            this.loaded = 0;
            this.searchParam = searchParam;
            loading.call(this,pageIndex || 0);
        },
        load:function(beans){
            loading.call(this,beans);
        },
        btnClick:function(e){
            var target = e.target||e.currentTarget,
                items = this.options.page.button.items,
                i = target.className.slice(13,14);
            if(items[i].click){
                items[i].click();
            }
        }       
    });
    return objClass;
});

