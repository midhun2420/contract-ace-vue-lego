<template>
    <div class="container card">
        <div v-for='(tab, index) in data' :key="index">
            <component :canvas="that" :is="item.type" :prop="item.prop" v-for="(item, index) in tab.data" :key="index" view-only/>
        </div>
    </div>
</template>

<script>

import BaseCanvas from '@/component/Bidder/BaseCanvas';

export default {
    extends : BaseCanvas
};

</script>
