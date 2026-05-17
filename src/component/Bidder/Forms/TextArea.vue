<template>
    <div>
        <div class="form-group" v-if="viewOnly">
            {{ getValue() }}
        </div>
        <CustomTextArea @input="input" :value="getValue()"/>
    </div>
</template>

<script>
import BaseComponent from '@/component/Bidder/BaseComponent';
import CustomTextArea from '../../CustomTextArea';

export default {
    name       : 'editor-text-area',
    components : {
        CustomTextArea
    },
    extends : BaseComponent
};
</script>
