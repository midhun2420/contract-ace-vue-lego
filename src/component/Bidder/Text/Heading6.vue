<template>
    <ce tag="h6" class="font-weight-bold" :class="className" :params="[block, 'value']" />
</template>
<script>
import BaseComponent from '@/component/Bidder/BaseComponent';

export default {
    name    : 'editor-h6',
    extends : BaseComponent
};
</script>
