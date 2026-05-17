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
            <span class="btn-group btn-group-tight">
                <btn size="xs" icon="fa fa-chevron-left" class="mx-0" color="info" @click="decreaseLevel(i)"/>
                <btn size="xs" icon="fa fa-chevron-up" class="mx-0" color="info" @click="moveRowUp(i)"/>
                <btn size="xs" icon="fa fa-trash" class="mx-0" color="danger" @click="deleteRow(i)"/>
                <btn size="xs" icon="fa fa-chevron-down" class="mx-0" color="info" @click="moveRowDown(i)"/>
                <btn size="xs" icon="fa fa-chevron-right" class="mx-0" color="info" @click="increaseLevel(i)"/>
            </span>
            </span>
        </div>
        <div>
            <btn size="xs" text="Add Row" color="secondary" @click="addRow"/>
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
