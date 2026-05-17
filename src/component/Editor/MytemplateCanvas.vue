<template>
    <div class="pos-r editor-canvas">
        <div class="editor-header bgc-primary-700 py-3 px-3 bs-4 fl-te-c round-1 pt-4"
             style="margin-top: -2.75rem; position: sticky; top: 3rem; z-index: 999;">
            <div>
                <span :title="tenderNumber" class="h5 my-0" v-html="number + ' - '">
                    <slot name="number"></slot>
                </span>
                <span :title="tenderName" class="help-tooltip h5 my-0" v-html="title">
                    <slot name="title"></slot>
                </span>
                <span class="ml-2" style="vertical-align: text-bottom">
                    <slot name="status"></slot>
                </span>
            </div>
            <div>
                <div v-if="editMode" class="btn-group">
                    <btn color="primary" design="basic-a" text="" icon="fa fa-subscript" size="xs" @click="exec('subscript')"/>
                    <btn color="primary" design="basic-a" text="" icon="fa fa-superscript" size="xs" @click="exec('superscript')"/>
                    <span style="display: inline-block; width: 1rem"></span>

                    <btn color="primary" design="basic-a" text="" icon="fa fa-list-ol" size="xs" @click="exec('insertOrderedList')"/>
                    <btn color="primary" design="basic-a" text="" icon="fa fa-list-ul" size="xs" @click="exec('insertUnorderedList')"/>
                    <span style="display: inline-block; width: 1rem"></span>

                    <btn color="primary" design="basic-a" text="" icon="fa fa-bold" size="xs" @click="exec('bold')"/>
                    <btn color="primary" design="basic-a" text="" icon="fa fa-italic" size="xs"
                         @click="exec('italic')"/>
                    <btn color="primary" design="basic-a" text="" icon="fa fa-underline" size="xs"
                         @click="exec('underline')"/>
                    <span style="display: inline-block; width: 1rem"></span>

                    <btn color="primary" design="basic-a" text="" icon="fa fa-align-left" size="xs"
                         @click="exec('justifyLeft')"/>
                    <btn color="primary" design="basic-a" text="" icon="fa fa-align-right" size="xs"
                         @click="exec('justifyRight')"/>
                    <btn color="primary" design="basic-a" text="" icon="fa fa-align-center" size="xs"
                         @click="exec('justifyCenter')"/>
                    <btn color="primary" design="basic-a" text="" icon="fa fa-align-justify" size="xs"
                         @click="exec('justifyFull')"/>

                    <span style="display: inline-block; width: 1rem"></span>
                    <btn color="primary" design="basic-a" text="" icon="fa fa-indent" size="xs" @click="exec('indent')"/>
                    <btn color="primary" design="basic-a" text="" icon="fa fa-outdent" size="xs" @click="exec('outdent')"/>

                    <span style="display: inline-block; width: 1rem"></span>
                    <btn color="success" design="basic-a" text="" icon="fa fa-paint-brush" size="xs" @click="color('success')"/>
                    <btn color="danger" design="basic-a" text="" icon="fa fa-paint-brush" size="xs" @click="color('danger')"/>
                    <btn color="info" design="basic-a" text="" icon="fa fa-paint-brush" size="xs" @click="color('info')"/>
                    <btn color="dark" design="basic-a" text="" icon="fa fa-paint-brush" size="xs" @click="color('default')"/>

                    <span style="display: inline-block; width: 1rem"></span>
                    <btn color="success" design="basic-a" text="" icon="fa fa-tint" size="xs" @click="color('success', 'backColor')"/>
                    <btn color="danger" design="basic-a" text="" icon="fa fa-tint" size="xs" @click="color('danger', 'backColor')"/>
                    <btn color="info" design="basic-a" text="" icon="fa fa-tint" size="xs" @click="color('info', 'backColor')"/>
                    <btn color="dark" design="basic-a" text="" icon="fa fa-tint" size="xs" @click="color('default', 'backColor')"/>

                    <span style="display: inline-block; width: 1rem"></span>
                    <btn color="danger" text="Stop Editing Content" icon="fa fa-check" size="xs" @click="stopEditing()"/>

                    <span style="display: inline-block; width: 1rem"></span>
                </div>

                <div v-else class="btn-group">
                    <drop-down-button text="Headings" size="xs" enter-animation="zoomIn" exit-animation="zoomOut"
                                      icon="fa fa-plus">
                        <drop-down-item @click="add('h1')" text="Heading 1" icon="fa fa-plus"/>
                        <drop-down-item @click="add('h2')" text="Heading 2" icon="fa fa-plus"/>
                        <drop-down-item @click="add('h3')" text="Heading 3" icon="fa fa-plus"/>
                        <drop-down-item @click="add('h4')" text="Heading 4" icon="fa fa-plus"/>
                        <drop-down-item @click="add('h5')" text="Heading 5" icon="fa fa-plus"/>
                        <drop-down-item @click="add('h6')" text="Heading 6" icon="fa fa-plus"/>
                    </drop-down-button>

                    <span style="display: inline-block; width: 1rem"></span>
                    <drop-down-button text="Forms" size="xs" enter-animation="zoomIn" exit-animation="zoomOut"
                                      icon="fa fa-plus">
                        <drop-down-item @click="add('text-input')" text="Text Input" icon="fa fa-plus"/>
                        <drop-down-item @click="add('password-input')" text="Password Input" icon="fa fa-plus"/>
                        <drop-down-item @click="add('text-area')" text="Text Area" icon="fa fa-plus"/>
                    </drop-down-button>

                    <span style="display: inline-block; width: 1rem"></span>

                    <btn color="primary" text="Paragraph" icon="fa fa-plus" size="xs" @click="add('p')"/>

                    <span style="display: inline-block; width: 1rem"></span>

                    <drop-down-button text="Tables" size="xs" enter-animation="zoomIn" exit-animation="zoomOut"
                                      dropdown-width="15r">
                        <drop-down-item text="Table" icon="fa fa-plus" size="xs" @click="add('table')"/>
                        <drop-down-item text="BOQ Table" icon="fa fa-plus" size="xs" @click="add('boq-table')"/>
                        <drop-down-item text="BOQ WO QTY Table" icon="fa fa-plus" size="xs"
                                        @click="add('boq-wo-qty-table')"/>
                        <drop-down-item text="SOR Table" icon="fa fa-plus" size="xs" @click="add('sot-table')"/>
                        <drop-down-item text="MS Pmnt Table" icon="fa fa-plus" size="xs" @click="add('msp-mnt-table')"/>
                    </drop-down-button>
                    <span style="display: inline-block; width: 1rem"></span>

                    <btn color="success" text="Start Editing Content" icon="fa fa-pencil" size="xs" @click="startEditing()"/>
                    <span style="display: inline-block; width: 1rem"></span>
                </div>
                <div class="btn-group">
                    <btn color="success" text="Save" icon="" size="xs" @click="saveClicked()"/>
                    <slot></slot>
                </div>

                <btn type="button" class="ml-4" color="primary" size="xs" @click="backButtonClicked" text="Back"/>
            </div>
        </div>

        <div class="container mt-4 card bs-3">
            <ul class='tabs-header'>
                <li v-for='(tab, index) in data' :key='index' @click='selectTab(index)'
                    :class='{"tab-selected": (index === selectedIndex)}'>
                    {{ tab.tabName }}
                    <a href="#" class="ml-2" @click.prevent="changeTabName(index)"><i class="fa fa-pencil"></i></a>
                    <a href="#" class="ml-2" v-if="data.length > 1" @click.prevent="deleteTab(index)"><i class="fa fa-trash"></i></a>
                </li>
                <li class="fl-gr-1" style="border: 0"></li>
                <li @click="addNewTab">
                    <i class="fa fa-plus mr-1"></i>
                    Add New Tab
                </li>
            </ul>

            <div class="tabs-container p-3" @click="onClicked" @mousemove="onMouseMove">
                <component :is="item.type" :prop="item.prop" v-for="(item, index) in selectedData" :key="index"/>
            </div>
        </div>

        <highlight-box ref="highlight"/>
        <select-box ref="selectBox"/>

    </div>
</template>

<script>

import Paragraph from '@/component/Editor/Text/Paragraph';
import Heading1 from '@/component/Editor/Text/Heading1';
import Heading2 from '@/component/Editor/Text/Heading2';
import Heading3 from '@/component/Editor/Text/Heading3';
import Heading4 from '@/component/Editor/Text/Heading4';
import Heading5 from '@/component/Editor/Text/Heading5';
import Heading6 from '@/component/Editor/Text/Heading6';

import BOQTable from '@/component/Editor/Tables/BOQTable';
import BOQWOQTYTable from '@/component/Editor/Tables/BOQWOQTYTable';
import MSPMntTable from '@/component/Editor/Tables/MSPMntTable';
import SoTTable from '@/component/Editor/Tables/SoTTable';
import Table from '@/component/Editor/Tables/Table';

import TextInput from '@/component/Editor/Forms/TextInput';
import PasswordInput from '@/component/Editor/Forms/PasswordInput';
import TextArea from '@/component/Editor/Forms/TextArea';

import HighlightBox from '@/component/Editor/Highlight';
import SelectBox from '@/component/Editor/SelectBox';

import data from '@/data/Editor';

import { mapActions, mapGetters } from 'vuex';
import uuid from '@/utils/uuid';

export default {
    components : {
        'select-box'    : SelectBox,
        'highlight-box' : HighlightBox,

        'editor-p'  : Paragraph,
        'editor-h1' : Heading1,
        'editor-h2' : Heading2,
        'editor-h3' : Heading3,
        'editor-h4' : Heading4,
        'editor-h5' : Heading5,
        'editor-h6' : Heading6,

        'editor-text-input'     : TextInput,
        'editor-password-input' : PasswordInput,
        'editor-text-area'      : TextArea,

        'editor-boq-table'        : BOQTable,
        'editor-boq-wo-qty-table' : BOQWOQTYTable,
        'editor-sot-table'        : SoTTable,
        'editor-table'            : Table,
        'editor-msp-mnt-table'    : MSPMntTable
    },

    props : {
        json : {
            type    : String,
            default : ''
        },
        title : {
            type    : String,
            default : 'Editor Canvas'
        },
        status : {
            type    : String,
            default : 'Draft'
        },
        number : {
            type    : String,
            default : '#0'
        }
    },

    data () {
        return {
            selectedIndex : null,
            selectedData  : [],
            data          : [],
            tenderNumber  : '',
            tenderName    : ''
        };
    },

    created () {
        this.setJSON(this.json);
        this.cleanTitle(this.title);
        this.cleanTenderNumber(this.number);
    },

    computed : {
        ...mapGetters(['editMode']),
        ...mapGetters(['currentUser'])
    },

    methods : {
        ...mapActions(['startEditing', 'stopEditing']),

        deselect () {
            const refs = this.$refs;
            refs.selectBox && refs.selectBox.deselect();
            refs.highlight && refs.highlight.deselect();
        },

        cleanTitle (title) {
            this.tenderName = title;
            if (title.length > 20) {
                this.title = title.substring(0, 20) + '... ';
            }
        },

        cleanTenderNumber (number) {
            this.tenderNumber = number;
            if (number.length > 3) {
                this.number = number.substring(0, 3) + '... ';
            }
        },

        cleanUpBlock (block, clone) {
            if (clone === true) {
                block = JSON.parse(JSON.stringify(block));
            }

            if (block._uid) {
                block._uid = uuid();
            }

            return JSON.parse(JSON.stringify(block));
        },

        getChildIndex (block) {
            if (!block) {
                console.log('[BaseComponent][getChildIndex] No Block', block);
                return -1;
            }

            const children = this.selectedData;
            if (!children) {
                console.log('[BaseComponent][getChildIndex]', 'no children found');
                return -1;
            }

            const uuid = block._uid;
            console.log('[BaseComponent][getChildIndex][Block UUID]', uuid, this.cleanUpBlock(block, true));
            let index = 0;
            let child;

            for (child of children) {
                const childUUID = child.prop._uid;
                console.log(index, childUUID, uuid);
                if (childUUID === undefined) {
                    console.log('[BaseComponent][getChildIndex][No UUID child]', this.cleanUpBlock(child, true));
                }

                if (childUUID === uuid) {
                    console.log('[BaseComponent][getChildIndex][found][index]', index);
                    return index;
                }
                index += 1;
            }

            console.log('[BaseComponent][getChildIndex] Not found in children.');
            console.log(block);
            return -1;
        },

        cloneAfter (block) {
            const index = this.getChildIndex(block);
            if (index < 0) {
                console.log('[BaseComponent][cloneAfter] index < 0.');
                return null;
            }
            console.log('[BaseComponent][cloneAfter] [index]', index);

            const children = this.selectedData;
            const oldChild = children[index];
            console.log('[BaseComponent][cloneAfter] [oldChild]', oldChild);
            const type = oldChild.type;
            const newBlock = this.cleanUpBlock(block, true);
            children.splice(index + 1, 0, {
                type : type,
                prop : newBlock
            });

            const selectedIndex = this.selectedIndex;
            this.data[selectedIndex].data = [...children];
            this.selectedData = this.data[selectedIndex].data;

            // console.log('newBlock', JSON.stringify(newBlock, null, 4));
            // console.log(JSON.stringify(this.data, null, 4));
            return newBlock;
        },

        moveDown (block) {
            const children = this.selectedData;
            const index = this.getChildIndex(block);

            if (index < 0) {
                return 0;
            }
            // Remove block
            const data = children.splice(index, 1);

            // Add to children array
            children.splice(index + 1, 0, data[0]);
        },

        moveUp (block) {
            const children = this.selectedData;
            const index = this.getChildIndex(block);

            if (index < 0) {
                return 0;
            }
            // Remove block
            const data = children.splice(index, 1);

            // Add to children array
            children.splice(index - 1, 0, data[0]);
        },

        delete (block) {
            const children = this.selectedData;
            const index = this.getChildIndex(block);

            if (index < 0) {
                console.log('[canvas]', '[delete]', '[block not found]', block);
                return 0;
            }
            // Remove block
            children.splice(index, 1);
        },

        sendUpdate () {
            const element = document.activeElement;
            const component = element.__vue__;
            if (component && component.update) {
                component.update();
            }
        },

        exec (command, value = null) {
            document.execCommand(command, null, value);
            this.sendUpdate();
        },

        color (value, type = 'foreColor') {
            document.execCommand('styleWithCSS', false, true);
            document.execCommand(type, false, 'var(--color-' + value + ')');
            this.sendUpdate();
        },

        add (name) {
            this.selectedData.push({
                type : 'editor-' + name,
                prop : { ...data[name] }
            });
        },

        getJSON () {
            return JSON.stringify(this.data, null, 4);
        },

        setJSON (json) {
            const defaultValue = [{
                tabName : 'First Tab',
                data    : []
            }];
            try {
                const data = JSON.parse(json);

                if (!Array.isArray(data) || data.length === 0) {
                    this.data = defaultValue;
                } else if (data[0].tabName === undefined) {
                    // Automatically convert the no tab layout to tab layout
                    console.log('[canvas]', '[set-json]', 'no tab name');
                    this.data = [{
                        tabName : 'First Tab',
                        data    : data
                    }];
                } else {
                    this.data = data;
                }
            } catch (e) {
                console.log(e);
                this.data = defaultValue;
            }
            this.selectTab(0, true);
        },

        saveClicked () {
            this.$emit('save', this.getJSON());
        },

        backButtonClicked () {
            this.$emit('back', this.getJSON());
        },

        saveMyTemplateClicked () {
            this.$emit('saveTemplate');
        },

        publishClicked () {
            this.$emit('publish');
        },

        uploadFileClicked () {
            this.$emit('upload');
        },

        onClicked (e) {
            this.$refs.selectBox.mousedown(e);
        },

        onMouseMove (e) {
            this.$refs.highlight.mousemove(e);
        },

        selectTab (index = 0, force = false) {
            if (this.selectedIndex === index && force === false) {
                return;
            }
            this.selectedIndex = index;
            this.selectedData = this.data[index].data;

            // console.log(JSON.stringify(this.data, null, 4));
            // console.log(JSON.stringify(this.data[index].data, null, 4));
            this.deselect();
        },

        addNewTab () {
            const name = prompt('Enter the name of the tab ?');
            if (!name) {
                alert('Name is needed.');
                return;
            }
            this.data.push({
                tabName : name,
                data    : []
            });
            this.deselect();
        },

        changeTabName (index) {
            const data = this.data;
            if (!data[index]) {
                return;
            }
            const oldName = data[index].tabName;
            const name = prompt('Enter the name of the tab ?', oldName);
            if (!name) {
                alert('Name is needed.');
                return;
            }
            this.data[index].tabName = name;
            this.deselect();
        },

        deleteTab (index) {
            const data = this.data;
            if (!data[index]) {
                return;
            }

            if (data.length === 1) {
                alert('You cannot delete the only tab.');
                return;
            }
            const oldName = data[index].tabName;
            const canDelete = confirm('Are you sure about deleting ' + oldName + ' ?');
            if (canDelete) {
                data.splice(index, 1);
            }
            // this.data = [...data];
            this.selectTab(0);
        }

    },

    mounted () {
        this.$refs.selectBox.setEditor(this);
    },

    watch : {
        json (newValue) {
            this.setJSON(newValue);
        }
    }
};

</script>

<style>
.text-col {
    width: 8rem;
}
.editor-canvas .table th {
    text-align: center !important;
}
</style>
