<div class="sn-tab-container">
    <div class="sn-tab J_tab_render">
        <ul class="sn-tab-items">
            {{#each this}}
                <li class="J_item_click">
                    <a href="javascript:;">
                    {{#if icon}}
                        <i class="{{icon}}"></i>
                    {{/if}}
                    {{title}}
                    </a>
                </li>
            {{/each}}
        </ul>
        <div class="contentArea J_content_render"></div>
    </div>
</div>