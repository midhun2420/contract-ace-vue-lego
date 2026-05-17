<template>
    <ce tag="div" editor-tag="p" :class="className" :params="[block, 'value']" />
</template>
<script>
import BaseComponent from '@/component/Bidder/BaseComponent';

export default {
    name    : 'editor-p',
    extends : BaseComponent
};
</script>
