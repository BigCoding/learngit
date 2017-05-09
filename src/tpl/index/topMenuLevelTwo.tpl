{{#each beans}}
  <div class="menuItem">
    <h3 class="title">{{menuName}}</h3>
    {{#each secondMenu}}
      <div class="subMenu">
        <dl>
          <dt>{{menuName}}</dt>
          <dd>
            <ul>
              {{#each thirdMenu}}
                <li> <a href="javascript:;" data-url="{{url}}" data-id="{{menuId}}">{{menuName}}</a> </li>
              {{/each}}
            </ul>
          </dd>
        </dl>
      </div>
    {{/each}}
  </div>
{{/each}}