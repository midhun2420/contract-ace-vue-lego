<template>
    <div>
        <div class="form-group" v-if="viewOnly">
            {{ getValue() }}
        </div>
        <validated-input v-else type="text" @input="input" :value="getValue()"/>
    </div>
</template>

<script>
import BaseComponent from '@/component/Bidder/BaseComponent';

export default {
    name    : 'editor-text-input',
    extends : BaseComponent

};
</script>
