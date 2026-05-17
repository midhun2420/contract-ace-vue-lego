<!--<template>-->
<!--    <ol :class="className" class="ml-4">-->
<!--        <li v-for="(value, i) in block.rows" :key="i" class="mb-2">-->
<!--            <ce @align="align" tag="span" :params="[block.rows, i]" />-->
<!--        </li>-->
<!--    </ol>-->
<!--</template>-->
<!--<script>-->
<!--import ListCommon from '@/component/Bidder/BaseComponent';-->

<!--export default {-->
<!--    name    : 'editor-ol',-->
<!--    extends : ListCommon-->
<!--};-->
<!--</script>-->
<template>
    <div :class="className" class="ml-1">
        <div v-for="(value, i) in block.rows" :key="i" class="mb-2">
            <span class="fl-te-c">
                <span>
                    <span :class="'ml-' + (2 * value.level)" class="mr-2">
                        <span v-if="value.prefix" v-html="value.prefix + '.' + value.index"></span>
                        <span v-else v-html="value.index"></span>
                        <span>.</span>
                    </span>
                    <ce @align="align" tag="span" :params="[value, 'text']"/>
                </span>
            </span>
        </div>
    </div>
</template>
<script>

import ListCommon from '@/component/Editor/Lists/ListCommons';

export default {
    name    : 'editor-ol',
    extends : ListCommon
};
</script>
