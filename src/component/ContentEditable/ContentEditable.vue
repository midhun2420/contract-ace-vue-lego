<template>
    <component :is="tag" data-ce="true">
        <component
            :is="editorTag"
            ref="editor"
            :contenteditable="editMode"
            @focus="focus"
            @keydown="keydown"
            @paste="paste"
            @blur="blur"
            v-html="valueText"></component>
    </component>
</template>

<script>
import { mapGetters } from 'vuex';
import debounce from 'lodash.debounce';

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
    mounted () {
        const el = this.$refs.editor;
        if (el) {
            el.style.display = 'block';
            el.style.minHeight = '40px';
            el.style.minWidth = '40px';
            el.style.width = '100%';
        }
    },

    computed : {
        ...mapGetters(['editMode']),
        localValue : {
            get : function () {
                return this.value;
            },
            set : debounce(function (newValue) {
                const [a, b] = this.params;
                this.$set(a, b, newValue);
                this.$emit('update:value', newValue);
            }, 300)
        }
    },
    watch : {
        localValue (newVal) {
            if (!this.focusIn) {
                this.valueText = newVal;
            }
        },
        params () {
            const [a, b] = this.params;
            const val = a[b];
            if (this.valueText !== val) {
                this.valueText = val;
            }
        }
    },
    created () {
        const [a, b] = this.params;
        this.valueText = a[b];
    },
    methods : {
        getComponent () {
            return this.$parent;
        },

        setAlignment (value) {
            const [a, b] = this.params;
            this.$emit('align', value, a, b);
        },

        paste (e) {
            e.preventDefault();
            let contentOnBlur = e.clipboardData.getData('text/plain') || prompt('Paste something..');
            contentOnBlur = contentOnBlur.replace(/(<([^>]+)>)/ig, '');
            contentOnBlur = contentOnBlur.replace(/\n/ig, '<br />');
            document.execCommand('insertHTML', false, contentOnBlur);
        },
        update (e) {
            const target = e ? e.target : this.$refs.editor;
            this.localValue = target.innerHTML;
        },
        focus () {
            this.focusIn = true;
            this.$Globals.set('ce', this);
        },
        keydown (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                document.execCommand('insertHTML', false, '<br/> &nbsp;&nbsp;&nbsp;&nbsp;');
                //  this.update();
                return false;
            }
        },
        blur (e) {
            this.editable = false;
            this.focusIn = false;
            this.update(e);
        }
    }
};
</script>
