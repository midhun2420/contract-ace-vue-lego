<template>
    <div class="select-box" :style="style">
        <div class="select-actions">
            <i class="fa fa-caret-up" title="Up" v-if="selectBoxVisible.showUp" @click="upEvent"></i>
            <i class="fa fa-caret-down" title="Down" v-if="selectBoxVisible.showDown" @click="downEvent"></i>

            <!--            <i class="fa fa-cut" title="Cut" @click.prevent="cutEvent" v-if="selectBoxVisible.showCut"></i>-->
            <!--            <i class="fa fa-copy" title="Amend" @click.prevent="copyEvent" v-if="selectBoxVisible.showCopy"></i>-->
            <i class="fa fa-clone" title="Clone" @click.prevent="cloneEvent" v-if="selectBoxVisible.showClone"></i>

            <i class="fa fa-minus-circle" title="Remove" v-if="selectBoxVisible.showDelete" @click.prevent="deleteEvent"></i>
        </div>

        <div class="select-add-button">
            <button v-if="selectBoxVisible.showAdd" v-popover:items>Add</button>
            <button v-if="selectBoxVisible.showPaste" @click="pasteEvent">Paste</button>
        </div>

    </div>
</template>

<script>
// import mapping from '@/data/mapping';
import { mapGetters } from 'vuex';

export default {
    name : 'select-box',
    created () {
        this.$Globals.set('select-box', this);
    },

    data () {
        return {
            editor  : null,
            tagName : '',
            target  : null,
            style   : {}
        };
    },

    computed : {
        ...mapGetters(['editMode']),

        selectBoxVisible () {
            if (this.editMode) {
                return {};
            }

            const component = this.getComponent();
            if (!component) {
                return {};
            }

            // const block = component.block;
            // const parent = component.$parent;

            let showAdd = true;
            if (component) {
                showAdd = component.hasChildren;
            }

            const props = {
                showSelectParent : false,
                showUp           : false,
                showDown         : false,
                showDelete       : false,
                showSetting      : false,
                showCut          : false,
                showCopy         : false,
                showClone        : false,
                showAdd          : showAdd,
                showPaste        : showAdd && !!this.$Globals.get('clipboard')
            };

            console.log('[not-base]');
            props.showSelectParent = false;

            props.showUp = true; // parent.canMoveUp(block);
            props.showDown = true; // parent.canMoveDown(block);

            props.showDelete = true;
            props.showSetting = true;

            props.showCut = true;
            props.showCopy = true;
            props.showClone = true;

            return props;
        }
    },

    methods : {
        setEditor (e) {
            this.editor = e;
        },
        mousedown (e) {
            const target = e.target;
            console.log('Target element---inside select box:', target);
            console.log('Target node---inside select box:', target.closest('[data-element-name]'));
            const targetNode = target.closest('[data-element-name]');
            if (this.$el === target) {
                // console.log('[Highlight] Mouse Over the highlight element.');
                return;
            }

            if (!targetNode) {
                console.log('[select-box]', '[mouse-down]', 'no-target-node', targetNode);
                this.deselect();
                return;
            }

            if (this.target === targetNode) return;
            this.setTarget(targetNode);
        },

        setTarget (targetNode) {
            if (!targetNode) {
                console.log('[select-box]', '[set-target]', '[deselect]');
                this.deselect();
                return;
            }
            this.target = targetNode;
            this.$Globals.set('currentTarget', targetNode);
            this.tagName = targetNode.getAttribute('data-element-name');
            console.log('[select-box]', '[set-target]', '[current-target]', targetNode);
            this.repaintSelectBox();
        },

        setComponent (componentId) {
            const targetNode = document.getElementById(componentId);
            console.log('[select-box]', '[setComponent]', componentId, targetNode);
            this.setTarget(targetNode);
        },

        getContainerRect () {
            return this.$parent.$el.getBoundingClientRect();
        },

        deselect () {
            console.log('[select-box]', '[deselect]');
            this.$Globals.set('currentTarget', null);
            this.target = null;
            this.tagName = '';
            this.style = {
                display : 'none'
            };
        },

        repaintSelectBox () {
            if (!this.target) {
                console.log('[select-box]', 'repaint-box', 'deselect');
                this.deselect();
                return;
            }

            this.$nextTick(() => {
                const target = this.target;
                const containerRect = this.getContainerRect();
                const rect = target.getBoundingClientRect();
                const {
                    scrollTop,
                    scrollLeft
                } = this.$parent.$el;
                const top = Math.floor(rect.top - containerRect.top + scrollTop);
                const left = Math.floor(rect.left - containerRect.left + scrollLeft);
                this.style = {
                    display : 'block',
                    width   : `${Math.floor(rect.width)}px`,
                    height  : `${Math.floor(rect.height)}px`,
                    top     : `${top}px`,
                    left    : `${left}px`
                };
                this.$forceUpdate();
            });
        },

        delayedRepaint (wait = 50) {
            const that = this;
            setTimeout(function () {
                that.repaintSelectBox();
            }, wait);
        },

        getComponent () {
            const target = this.target;
            if (!target) {
                return null;
            }

            const component = target.__vue__;
            if (!component) {
                console.log('[select-box] [No Component]', target, component);
                return null;
            }
            console.log('[select-box] [Component]', target, component);

            if (component.getComponent) {
                return component.getComponent();
            }

            return component;
        },

        getBlockEditor () {
            const component = this.getComponent();

            if (!component) {
                return [null, null, null];
            }
            const block = component.block;
            const uid = block._uid;
            const editor = this.editor;
            console.log('editor', editor);

            return [block, uid, editor];
        },

        editorBlockAction (name, updateEditor = false) {
            const [block, uid, editor] = this.getBlockEditor();
            if (!editor) {
                console.log('[select-box]', '[editorBlockAction]', name, 'editor');
                return;
            }

            if (!block) {
                console.log('[select-box]', '[editorBlockAction]', name, 'No block');
                return;
            }

            editor[name](block);
            this.$nextTick(function () {
                this.setComponent(uid);
                this.delayedRepaint();

                if (updateEditor) {
                    editor.$forceUpdate();
                }
            });
        },

        upEvent () {
            this.editorBlockAction('moveUp');
        },

        downEvent () {
            this.editorBlockAction('moveDown');
        },

        pasteEvent () {
            const mapping = {};
            const component = this.getComponent();
            const addElement = component.addElement;

            if (addElement) {
                let mappingElement = mapping[name];
                mappingElement = this.$Globals.get('clipboard');
                mappingElement = JSON.parse(JSON.stringify(mappingElement));
                addElement.call(component, mappingElement);
            }

            this.repaintSelectBox();
        },

        cloneEvent () {
            this.editorBlockAction('cloneAfter', true);
        },

        deleteEvent () {
            const can = confirm('Are you sure ?');
            if (!can) {
                return;
            }
            this.editorBlockAction('delete', true);
        }
    }
};

</script>

<style scoped>

</style>
