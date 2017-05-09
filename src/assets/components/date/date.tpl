{{#if double}}
    {{#if label}}
        <label>
            {{{label}}}
        </label>
    {{/if}}
    <div>
        {{#if double.start}}
            <div>
                <input name="{{double.start.name}}" type="text" value="{{double.start.defaultValue}}">
            </div>
        {{/if}}
        <span>~</span>
        {{#if double.end}}
            <div>
                <input name="{{double.end.name}}" type="text" value="{{double.end.defaultValue}}">
            </div>
        {{/if}}
    </div>
{{else}}
    {{#if label}}
        <label>
            {{{label}}}
        </label>
    {{/if}}
    <div>
        <input type="text" name="{{name}}" value="{{defaultValue}}">
        <i class="iconfont icon-riqi"></i>
    </div>
{{/if}}

