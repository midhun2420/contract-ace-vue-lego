<template>
    <base-form-control v-bind="formControlAttributes" is-textarea>
        <textarea v-on="listeners" v-bind="controlAttributes" :disabled="disabled" class="control" v-model="model"
                  ref="textarea" rows="1" @focus="resize" @keyup="resize"></textarea>
    </base-form-control>
</template>

<script>
import BaseFormControl from 'lego-framework/src/forms/BaseFormControl';
import BaseInput from 'lego-framework/src/forms/BaseInput';

export default {
    name       : 'form-textarea',
    components : { BaseFormControl },
    extends    : BaseInput,
    mounted () {
        console.log('[form-textarea] $attrs on mounted:', this.$attrs);
        this.resize();
    },
    updated () {
        console.log('[form-textarea] $attrs on mounted:', this.$attrs);
        this.resize();
    },
    methods : {
        resize () {
            const { textarea } = this.$refs;
            textarea.style.height = textarea.scrollHeight - 4 + 'px';
        }
    }
};
</script>
