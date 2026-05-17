<template>
    <base-form-control v-bind="formControlAttributes" @clear-clicked="clear">
        <slot name="prepend"></slot>
        <input v-on="listeners" v-bind="controlAttributes"
               :disabled="disabled" v-model="model" :type="passwordFieldType"
               class="control"/>
        <div @click="togglePasswordVisibility">
            <btn type="button" v-if="model && passwordFieldType === 'password'"
                 color="" icon="fa fa-eye text-muted" class="bs-none" size="sm"/>
            <btn type="button" v-if="model && passwordFieldType !== 'password'"
                 color="" icon="fa fa-eye-slash text-muted" class="bs-none" size="sm"/>
        </div>
    </base-form-control>
</template>

<script>
import BaseFormControl from 'lego-framework/src/forms/BaseFormControl';
import BaseInput from 'lego-framework/src/forms/BaseInput';

export default {
    name       : 'CustomPasswordInput',
    components : { BaseFormControl },
    extends    : BaseInput,
    props      : {
        type : { type : String, default : 'text' }
    },
    data () {
        return {
            passwordFieldType : 'password'
        };
    },
    methods : {
        togglePasswordVisibility () {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        }
    }

};
</script>
<style>
/* Hide the default Edge password visibility button */
input::-ms-reveal {
    display: none;
}
</style>
