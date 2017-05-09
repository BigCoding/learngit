<div class="jf-right-outer">
    <div class="demo">
        <h3>列表组件</h3>
        <!--<p>根据配置项，在form表单中生成一个弹出树单元</p>-->
        <div class="demo-example">
            <!-- 组件结构 -->
            <div class="jf-form columns-4">
                <div class="listContainer"></div>
            </div>
            <!-- 组件结构 结束-->
        </div>

        <div class="demo-code">
            <h3>之前代码</h3>
            <p>引自官方demo http://jplayer.org/latest/quick-start-guide/step-7-audio/html</p>
      <pre>
        <code>
            ●html部分：
            &lt;!--列表开始--&gt;
            &lt;div class="tablewidth mg_t_10"&gt;
                &lt;table class="ui-record-table table_radius table-bordered table-striped"  &gt;
                &lt;thead&gt;
                    &lt;tr&gt;
                        &lt;th width="100"&gt;工单流水号&lt;/th&gt;
                        &lt;th width="50"&gt;紧急程度&lt;/th&gt;
                        &lt;th&gt;建单工号&lt;/th&gt;
                        &lt;th&gt;认领工号&lt;/th&gt;
                        &lt;th&gt;工单创建时间&lt;/th&gt;
                        &lt;th&gt;客户姓名&lt;/th&gt;
                        &lt;th width="50"&gt;所属省份&lt;/th&gt;
                        &lt;th&gt;所属地市&lt;/th&gt;
                        &lt;th&gt;所属区县&lt;/th&gt;
                        &lt;th width="80"&gt;主叫号码&lt;/th&gt;
                        &lt;th&gt;受理号码&lt;/th&gt;
                        &lt;th&gt;关联订单&lt;/th&gt;
                        &lt;th width="60"&gt;状态&lt;/th&gt;
                        &lt;th width="50"&gt;中途意见&lt;/th&gt;
                        &lt;th width="50"&gt;操作&lt;/th&gt;
                    &lt;/tr&gt;
                &lt;/thead&gt;
                &lt;tbody id="J_tabletpl"&gt;
                    &lt;tr&gt;
                    &lt;/tr&gt;
                &lt;/tbody&gt;
                &lt;/table&gt;
            &lt;/div&gt;
            &lt;!--列表结束--&gt;
            ●tpl部分:
            &lt;!-- 查询列表模版 --&gt;
            &lt;script id="T_tabletpl" type="text/x-handlebars-template"&gt;
            {{#if beans}}
                {{#each beans}}
                    &lt;tr&gt;
                        &lt;td&gt;&lt;a href="javascript:;" onclick="complaintContent('{{COMPLAINT_ID}}')"&gt;{{COMPLAINT_ID}}&lt;/a&gt;&lt;/td&gt;
                        &lt;td&gt;{{EMERGENCY_LEVEL}}&lt;/td&gt;
                        &lt;td&gt;{{CRT_PTY_NO}}&lt;/td&gt;
                        &lt;td&gt;{{RES_PTY_NO}}&lt;/td&gt;
                        &lt;td&gt;{{CRT_TIME}}&lt;/td&gt;
                        &lt;td&gt;{{CUST_NM}}&lt;/td&gt;
                        &lt;td&gt;{{BELG_PROVINCE}}&lt;/td&gt;
                        &lt;td&gt;{{BELG_CITY}}&lt;/td&gt;
                        &lt;td&gt;{{BELG_DISTRICT}}&lt;/td&gt;
                        &lt;td&gt;{{CUST_PHONE_NO}}&lt;/td&gt;
                        &lt;td&gt;{{ACCEPTANCE_PHONE_NO}}&lt;/td&gt;
                        &lt;td&gt;{{REL_ORDER_ID}}&lt;/td&gt;
                        &lt;td&gt;{{COMPLAINT_STS_CD}}&lt;/td&gt;
                        &lt;td&gt;{{process FLAG}}&lt;/td&gt;
                        &lt;td&gt;
                        {{addComponent COMPLAINT_ID COMPLAINT_STS_CD}}
                        &lt;/td&gt;
                    &lt;/tr&gt;
                {{/each}}
            {{else}}
                &lt;tr&gt;
                    &lt;td colspan="14"&gt;
                        &lt;div class="ui-tips-box tipsBox"&gt;
                            &lt;div class="ui-icon-noData"&gt;&lt;/div&gt;
                            &lt;div class="ui-tips-text"&gt;暂无数据记录！&lt;/div&gt;
                        &lt;/div&gt;
                    &lt;/td&gt;
                &lt;/tr&gt;
            {{/if}}
            &lt;/script&gt;
            &lt;!-- 详情页面模版 --&gt;
            ●js、css引用部分：
            &lt;link  rel="stylesheet"  href="src/assets/lib/pagination/pagination.css"&gt;

            &lt;script type="text/javascript" src="src/assets/lib/jquery/jquery.js"&gt;&lt;/script&gt;
            &lt;script  type="text/javascript"  src="src/assets/lib/pagination/jquery.pagination.js"&gt;

            ●js部分:
            $(document).ready(function(){
                //列表分页数据
                var G_params = {
                    url : srvMap.get('complaintList'),
                    items_per_page : 10,        // 每页数     @param : limit
                    page_index : 0 ,                //当前页  @param : start
                    pagination : "Pagination" ,     //分页id
                    searchformId : "J_formSearch",  //搜索表单的id
                    tabletpl : "T_tabletpl",        //表格模板
                    tablewrap : "J_tabletpl", //表格容器
                    pageCallback:function(json){
                    $('#excelButton').show();
                    }
                };
                Util.pagination(0, true , G_params , str );
            });


        </code>
      </pre>
        </div>

        <div class="demo-code fr">
            <h3>现在代码</h3>
            <p>引自积分项目列表组件使用</p>
      <pre>
        <code>
            ●js、css引用部分
            &lt;div class="wrapper"&gt;&lt;/div&gt;
            ●js、css引用部分
            &lt;script src="src/assets/lib/requirejs/requirejs.min.js" data-main="src/assets/common/requirejsMain"&gt; &lt;/script&gt;

            ●js部分：
            var config = {
                el:$('.listContainer',$el),
                field:{
                    boxType:'checkbox',
                    key:'id',
                    popupLayer:{
                        groups:[
                                {
                                    items: [
                                        [
                                            {text:'发布人',name:'publishUser'},
                                            { text:'发布时间',name:'publishTime' }
                                        ]
                                    ]
                                }
                            ]
                        },
                        items:[
                            { text:'标题',title:'text',name:'text',className:'w120'},
                            { text:'发布人',title:'content',name:'publishUser',className:'w70'},
                            { text:'发布时间',name:'publishTime' }
                        ],
                        button:{
                            items:[
                                { text:'查看',name:'viewer'}
                            ]
                    }
                },
                page:{
                    button:{
                    items:[
                        { text:'删除',name:'deleter',click:function(item){ } },
                        { text:'暂停',name:'stopToggle' }
                    ],
                    url:'../src/js/example/component/list/autoRefresh'
                    }
                },
                data:{
                    url:"/front?key=001"
                }
            };
            var list = new Compts.List(config);
            list.search({});

        </code>
      </pre>
        </div>

    </div>
</div>

