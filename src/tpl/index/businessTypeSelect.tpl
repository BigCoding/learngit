<div class="request-accept business-content">
    <div class="popup-left">
        <ul id="billLeftTree" class="ztree"></ul>
    </div>
    <div class="popup-right">
        <div class="request-type">
            <div class="telnumber">
                <p>
                    受理号码：
                    <span id="BillTel">158 2666 3769</span>
                </p>
                <input type="text" class="input01" placeholder="类型检索" id="BillSearch">
                <input type="button" class="btn" value="查询" id="BillSearchBtn">
            </div>
            <!-- 闭合子项：设置dl class="close"-->
            <ul id="billRightTree" class="ztree"></ul>

        </div>
        <div class="request-type-selected">
            <span>已选类型：</span>
            <ul id="hasChoose"> </ul>
        </div>
    </div>
    <!--<div class="popup-bottom">
        <a class="btn btn-blue">填单</a>
        <a class="btn btn-dark">直接答复</a>
        <a class="btn" href="javascript:void(0)" >取消</a>
    </div>-->
    <div id="json"> </div>
</div>