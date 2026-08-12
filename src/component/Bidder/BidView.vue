<template>
    <div class="">
        <ul class='tabs-header'>
            <li v-for='(tab, index) in data' :key='index' @click='selectTab(index)'
                :class='{"tab-selected": (index === selectedIndex)}'>
                {{ tab.tabName }}
            </li>
        </ul>

        <div class="tabs-container p-3">
            <component :canvas="that" :is="item.type" :prop="item.prop" v-for="(item, index) in selectedData"
                       :key="index" view-only/>
        </div>
    </div>
</template>

<script>

import BaseCanvas from '@/component/Bidder/BaseCanvas';

export default {
    extends : BaseCanvas,
    data () {
        return {
            selectedIndex : null,
            selectedData  : []
        };
    },
    mounted () {
        this.selectTab();
    },
    methods : {
        selectTab (index = 0, force = false) {
            if (this.selectedIndex === index && force === false) {
                return;
            }
            this.selectedIndex = index;
            this.selectedData = this.data[index].data;
        }
    }
};

</script>
<style scoped>
:deep(.form-group) {
    white-space: pre-line !important;
}
</style>
