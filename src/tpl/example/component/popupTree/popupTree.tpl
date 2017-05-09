<div class="jf-right-outer">
    <div class="demo">
        <h3>弹出树组件</h3>
        <!--<p>根据配置项，在form表单中生成一个弹出树单元</p>-->
        <div class="demo-example">
            <!-- 组件结构 -->
            <div class="jf-form columns-4">
                <ul class="jf-form-item">
                    <li id="selectTree"></li>
                    <li id="selectTreeRadio"></li>
                </ul>
            </div>
            <!-- 组件结构 结束-->
        </div>
        <div class="demo-code">
            <h3>之前代码</h3>
            <p>取自85商品查询-分类</p>
            <pre>
            <code>
                ●html部分:
                &lt;table class="search_table"&gt;
                    &lt;tbody&gt;
                    &lt;tr&gt;
                        &lt;td&gt;&lt;label class="description"&gt;产品分类&lt;/label&gt;&lt;/td&gt;
                        &lt;td&gt;
                            &lt;input onclick="viewProCateTree()" readonly="readonly" class="inputWidth inputText" type="text"  id="PROD_CATE_NAME_SHOW" name="PROD_CATE_NAME_SHOW" maxlength="255" value="" placeholder="点击选择分类"  /&gt;
                            &lt;input type="hidden" id="prodType" name="prodType" value="" /&gt;
                        &lt;/td&gt;
                        &lt;td&gt;&nbsp;&lt;/td&gt;
                    &lt;/tr&gt;
                    &lt;/tbody&gt;
                &lt;/table&gt;

                ●js、css引用部分：
                &lt;link rel="stylesheet" href="src/assets/lib/laydate/dialog/css/ui-dialog.css" type="text/css"&gt;
                &lt;link rel="stylesheet" href="src/assets/lib/zTree_v3/css/css/zTreeStyle/zTreeStyle.css" type="text/css"&gt;

                &lt;script type="text/javascript" src="src/assets/lib/jquery/jquery.js"&gt;&lt;/script&gt;
                &lt;script type="text/javascript" src="src/assets/lib/dialog/dialog.js"&gt;&lt;/script&gt;
                &lt;script type="text/javascript" src="src/assets/lib/zTree_v3/js/jquery.ztree.all.js"&gt;&lt;/script&gt;

                ●Tpl部分:
                &lt;div id="proCateDialog" class="fn-hide formItem formArea-B moduleManage"&gt;
                    &lt;div class="form_container fn-clear onedv" style="height:300px"&gt;
                        &lt;div class="treewh" style="height:300px;overflow-y: scroll;overflow-x: hidden;"&gt;
                            &lt;div class="form_container fn-clear"&gt;
                                &lt;div class="zui"&gt;
                                &lt;ul id="J_zTree" class="ztree ability-catalog-list fn-clear"&gt;
                                &lt;/ul&gt;
                                &lt;/div&gt;
                            &lt;/div&gt;
                        &lt;/div&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
                ●js部分:
                //初始化树结构
                var initTree = function() {
                    Util.ajax.postJson(srvMap.get('queryAllUi'), '', function(json,status) {
                        if (status) {
                            Util.loading.close($el.node);
                            //选择产品分类查询的弹窗
                            $.fn.zTree.init($("#J_zTree",$el.node), setting, json.object);
                            var treeObj =  $.fn.zTree.getZTreeObj("J_zTree");
                            treeObj.expandAll(true);
                        }
                    });
                }

                function viewProCateTree(){
                    var dialog = document.getElementById("proCateDialog")||top.document.getElementById("proCateDialog");
                    var ele = $(dialog).html();
                    var params = {
                        //top:top,
                        content: ele,
                        title : '产品类目',
                        width: "350px",
                        height: "300px",
                        modal: false,
                        okVal:'确定',
                        okCallback:function(){
                        //               $("#PROD_CATE_NAME_SHOW").val($("#prodCateName").val());
                        },
                        cancelVal : '清除',
                        cancelCallback : function(){
                        $("#PROD_CATE_NAME_SHOW").val("");
                        $("#prodType").val("");
                        }
                    };
                    $el = Util.dialog.openDiv(params);
                    Util.loading.create($el.node);
                    initTree();
                }
            </code>
            </pre>
        </div>

        <div class="demo-code fr">
            <h3>现在代码</h3>
            <p>引自积分项目弹出树组件使用</p>
            <pre>
            <code>
                ●html部分:
                &lt;li class="requestTypeWrap"&gt;&lt;/li&gt;

                ●js、css引用部分
                &lt;script src="src/assets/lib/requirejs/requirejs.min.js" data-main="src/assets/common/requirejsMain"&gt; &lt;/script&gt;

                ●js部分：
                //服务请求类型
                var selectTree = new Compts.SelectTree({
                el:$('.requestTypeWrap',$el),
                    title:'部门选择',
                    codeType:'CS_SR_ASSIST_DEAL_REQ@CURR_NODE_TYPE'
                });
            </code>
            </pre>
        </div>

    </div>
</div>

