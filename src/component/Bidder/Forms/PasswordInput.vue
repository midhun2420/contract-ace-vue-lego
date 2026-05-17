<template>
    <div>
        <div class="form-group" v-if="viewOnly">
            {{ getValue() }}
        </div>
        <custom-password-input v-else @input="input" :value="getValue()" />
    </div>
</template>

<script>
import BaseComponent from '@/component/Bidder/BaseComponent';
export default {
    name    : 'editor-password-input',
    extends : BaseComponent

};
</script>
