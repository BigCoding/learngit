<div class="sorting-box" id="selectedId">
	<!-- 禁用: ul class="disabled" -->
	<ul>
		<li data-id="TidyStatus">
			<a class="{{#if_selected StatusType "TidyStatus" }}current{{/if_selected}}" >整理态</a>
		</li>
		<li data-id="FreeStatus">
			<a class="{{#if_selected StatusType "FreeStatus"}}current{{/if_selected}}">空闲态</a>
		</li>
	</ul>
	<ul>
		<li data-id="ManAnswer">
			<a class="{{#if_selected AnswerType "ManAnswer"}}current{{/if_selected}}" >人答</a>
		</li>
		<li  data-id="AutoAnswer">
			<a class="{{#if_selected AnswerType "AutoAnswer"}}current{{/if_selected}}">自答</a>
		</li>
	</ul>
</div>