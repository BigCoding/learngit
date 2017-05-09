<div class="shortBox">
    <div class="navRightMenu" style="margin: 0;">
        <div class="menuItem" style="display: block;">
            {{#each beans}}
            <div class="subMenu">
                <dl>
                    <dt>{{menuName}}</dt>
                    <dd>
                        <ul>
                            {{#each secondMenu}}
                            <li> <a href="javascript:;" data-url="{{url}}" data-id="{{menuId}}">{{menuName}}</a> </li>
                            {{/each}}
                        </ul>
                    </dd>
                </dl>
            </div>
          {{/each}}
        </div>        
    </div>
</div>