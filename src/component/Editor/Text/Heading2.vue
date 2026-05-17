<template>
    <ce @align="align" tag="h2" class="font-weight-bold" :class="className" :params="[block, 'value']" />
</template>
<script>
import BaseComponent from '@/component/Editor/BaseComponent';

export default {
    name    : 'editor-h2',
    extends : BaseComponent
};
</script>
