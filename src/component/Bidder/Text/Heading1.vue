<template>
    <ce tag="h1" class="font-weight-bold" :class="className" :params="[block, 'value']" />
</template>
<script>
import BaseComponent from '@/component/Bidder/BaseComponent';

export default {
    name    : 'editor-h1',
    extends : BaseComponent
};
</script>
