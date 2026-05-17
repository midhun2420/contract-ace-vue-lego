<template>
    <ce @align="align" tag="h5" class="font-weight-bold" :class="className" :params="[block, 'value']" />
</template>
<script>
import BaseComponent from '@/component/Editor/BaseComponent';

export default {
    name    : 'editor-h5',
    extends : BaseComponent
};
</script>
