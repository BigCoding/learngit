<ul>
{{#if beans.length}}
  {{#each beans}}
  <li menuId="{{menuId}}">{{menuName}}</li>
  {{/each}}
{{else}}
  <li>对不起，没有菜单。</li>
{{/if}}
</ul>