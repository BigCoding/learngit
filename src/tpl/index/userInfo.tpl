<div class="user-panel">
    <ul>
        <li>
            <i class="ic ic-user"></i>
            {{ staffName }}{{ staffId }}
        </li>
        <li>
            <i class="ic ic-ip"></i>
            {{ operIp }}
        </li>
    </ul>
    <ul>
        <li class="noicon">
            <a href="javascript:;" class="js-stat">
                接续统计详情&gt;
            </a>
        </li>
    </ul>
    <ul>
        <li>
            <i class="ic ic-time"></i>
            {{ loginStartTime }}
        </li>
        <li class="noicon">
            登录系统成功
        </li>
        <li class="noicon">
            <a href="javascript:;" class="js-record">
                工作日志详情&gt;
            </a>
        </li>
    </ul>
    <ul class="pointer">
        <li class="layoutSetting" onclick="layoutBox.style.display='block'">
            <a href="#nogo">
                <i class="ic ic-monitor"></i>屏显模式
            </a>
            <ul id="layoutBox">
                <li>
                    <a href="">
                        <img src="src/assets/img/appNew/layout_a.png" alt="管理员视图">
                        <p>管理员视图</p>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="src/assets/img/appNew/layout_b.png" alt="语音客服视图">
                        <p>语音客服视图</p>
                    </a>
                </li>
                <li class="checked">
                    <a href="">
                        <img src="src/assets/img/appNew/layout_c.png" alt="多媒体客服视图">
                        <p>多媒体客服视图</p>
                    </a>
                </li>
            </ul>
        </li>
        <!--合并时请不要删除id="loginOut"注销时需要绑定事件-->
        <li onclick="" id="loginOut">
            <a href="#nogo">
                <i class="ic ic-exit"></i>退出
            </a>

        </li>
        <!--合并时请不要删除id="logCancel"注销时需要绑定事件-->
        <li onclick="" id="logCancel">
            <a href="#nogo">
                <i class="ic ic-logoff"></i>注销
            </a>
        </li>
    </ul>
</div>