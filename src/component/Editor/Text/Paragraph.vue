<template>
    <ce @align="align" tag="div" editor-tag="p" :class="className" :params="[block, 'value']" />
</template>
<script>
import BaseComponent from '@/component/Editor/BaseComponent';

export default {
    name    : 'editor-p',
    extends : BaseComponent
};
</script>
