<template>
    <component :is="tag">
        <component
            :is="editorTag"
            v-html="valueText"></component>
    </component>
</template>

<script>

export default {
    props : {
        params : {
            type    : Array,
            default : null
        },
        tag : {
            type    : String,
            default : 'div'
        },
        editorTag : {
            type    : String,
            default : 'span'
        }
    },
    data () {
        return {
            editable  : false,
            focusIn   : false,
            valueText : ''
        };
    },
    computed : {
        localValue : {
            get : function () {
                return this.value;
            }
        }
    },
    watch : {
        localValue (newVal) {
            if (!this.focusIn) {
                this.valueText = newVal;
            }
        },
        params (value) {
            const [a, b] = this.params;
            this.valueText = a[b];
        }
    },
    created () {
        const [a, b] = this.params;
        this.valueText = a[b];
    },
    methods : {
        getComponent () {
            return this.$parent;
        }
    }
};
</script>
