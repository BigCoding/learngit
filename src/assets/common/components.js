/*
*	@author: fany
*	@date:2016-02-15
*	@desc:组件收敛模块，将组件统一收敛至该文件
*/
define([
        'zTreeSimple', 
        'list', 
        'selectList', 
        'tab', 
        'select', 
        'selectTree',
        'validator',
        'date',
        'js/components/select',
        'js/components/selectTree'
], function(
        zTree, 
        list, 
        selectList, 
        tab, 
        select,
        selectTree,
        validator,
        date, 
        businessSelect,
        businessSelectTree
        ) {

        return {
                zTree: zTree,
                List: list,
                SelectList: selectList,
                Tab: tab,
                Select: select,
                SelectTree: selectTree,
                Validator: validator,
                date:date,

                BusinessSelect: businessSelect,
                BusinessSelectTree: businessSelectTree
        }
});