<div class="sn-list {{className}}">
    <table>
        <thead>
            {{#if_checkbox field.boxType compare='checkbox'}}
            <th class="checkAllWraper"><input type="checkbox" /></th>
            {{/if_checkbox}}
            {{#each field.items}}
            <th class="{{className}}">{{text}}</th>
            {{/each}}
            {{#if_object field.button compare='object'}}
            <th>操作</th>
            {{/if_object}}
            {{#if field.popupLayer}}
                {{#if_object field.popupLayer.groups compare='object'}}
                <th></th>
                {{/if_object}}
            {{/if}}

        </thead>
        <tbody></tbody>
        <tfoot>
            <tr>
                <td colspan="{{footerColspanCount field}}">
                    <!--
                    <div class="checkAllContainer">
                        <input type="checkbox" />
                    </div>
                    
                    -->
                    <div class="buttons btns {{page.button.className}}">
                        {{#if_object page.button compare='object'}}
                        {{#each page.button.items}}
                        <input type="button" value="{{text}}" class="btn btnCustom{{@key}}"/>
                        {{/each}}
                        {{/if_object}}
                    </div>
                    <div class="pagination"></div>
                </td>
            </tr>
            
        </tfoot>
    </table>

    <div class="blockOverlay">
        <div>
            <img src="src/assets/img/appNew/cmcc_loading.gif" alt="">
            <span>加载中...</span>
        </div>
    </div>
</div>