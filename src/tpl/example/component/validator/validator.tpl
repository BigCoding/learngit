<div class="jf-right-outer">
    <div class="demo">
        <h3>验证组件</h3>
        <!--<p>根据配置项，在form表单中生成一个弹出树单元</p>-->
        <div class="demo-example">
            <!-- 组件结构 -->
            <div class="jf-form columns-4">
                <form action="" class="form">
                <ul class="jf-form-item">
                    <li  >
                        <label for="fm06">
                            email
                        </label>
                        <div>
                            <input id="fm06" type="text" name="email">
                        </div>
                    </li>
                    <li  >
                        <label for="fm05">
                            手机号
                        </label>
                        <div>
                            <input id="fm05" type="text" name="mobile">
                        </div>
                    </li>
                    <li  >
                        <label for="fm09">
                            用户品牌
                        </label>
                        <div>
                            <select name="brand" id="fm09">
                                <option value="">请选择品牌</option>
                                <option value="1">用户品牌一</option>
                                <option value="2">用户品牌二</option>
                                <option value="3">用户品牌三</option>
                            </select>
                        </div>
                    </li>
                    <li>
                        <span class=" btn-success fileinput-button">
                            <i class="glyphicon glyphicon-plus"></i>
                            <span></span>
                            <!-- The file input field used as target for the file upload widget -->
                            <input id="fileupload" type="file" name="files" multiple>
                        </span>
                    </li>
                    <li class="width-all">
                        <label for="fm09">内容</label>
                        <div>
                            <textarea class="" name="textarea" placeholder="请填写内容"></textarea>
                        </div>
                    </li>
                    <li class="width-all">
                        <a class="btn btn-blue fr btnSearch"> 验证</a>
                    </li>
                </ul>
                </form>
            </div>
            <!-- 组件结构 结束-->
        </div>

        <div class="demo-code">
            <h3>之前代码</h3>
            <!--<p>取自85商品详情 mcds/phoneDetail.html?mcdsUnitId=201603211737299414611&good=package</p>-->
      <pre>
        <code>
            ●js、css引用部分：
            &lt;link rel="stylesheet" href="src/assets/lib/laydate/dialog/css/ui-dialog.css" type="text/css"&gt;

            &lt;script type="text/javascript" src="src/assets/lib/jquery/jquery.js"&gt;&lt;/script&gt;
            &lt;script type="text/javascript" src="src/assets/lib/dialog/dialog.js"&gt;&lt;/script&gt;

            ●js部分:
            //页面加载完开始执行
            $(function () {
                var tips=function(content,delay){
                var d = dialog({
                        fixed: true,
                        quickClose: false,
                        content: content
                    });
                    d.show();
                    setTimeout(function () {
                        d.close().remove();
                    }, delay || 1500);
                };
                $(".btnSearch").on("click",function(){
                    if(!$("textarea[name='textarea']").val()){
                     tips("内容不能为空"); return false
                    }
                    if($("textarea[name='textarea']").val().length<20){
                     tips("内容不能少于20个字"); return false
                    }
                    。。。。。
                    //最后提交表单
                })
            })

        </code>
      </pre>
        </div>

        <div class="demo-code fr">
            <h3>现在代码</h3>
            <!--<p>引自积分项目弹出树组件使用</p>-->
      <pre>
        <code>

            ●js、css引用部分
            &lt;script src="src/assets/lib/requirejs/requirejs.min.js" data-main="src/assets/common/requirejsMain"&gt; &lt;/script&gt;

            ●js部分：
            var validator = new Compts.Validator({
                el: $("form", $el),
                submitBtn: $(".btnSearch", $el),
                rules:{
                    textarea:"required|min-10"
                },
                messages:{
                    textarea:{
                     min:"内容输入字数不能少于10"
                    }
                }
            });
            validator.on("success", function () {
                //提交表单
            });

        </code>
      </pre>
        </div>

    </div>
</div>

