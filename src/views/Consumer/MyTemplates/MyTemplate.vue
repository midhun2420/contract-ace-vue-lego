<template>
    <div>
        <check-permission/>
        <vue-table-card title="My Template" class="card bs-5" :url="listUrl" :fields="fields" :per-page="10"
                        ref="table">
            <template #buttons>
                <btn v-if="currentUser.features.create_save_to_my_template" color="success" icon="fa fa-plus" size="sm"
                     @click="$refs.addModal.show()" text="Add"/>
            </template>
            <template #actions="{rowData}">
                <div class="btn-group-tight">
                    <edit-btn v-if="currentUser.features.create_save_to_my_template" size="xs"
                              @click="setEdit(rowData)"/>
                    <delete-btn v-if="currentUser.features.create_save_to_my_template" size="xs"
                                @click="setDelete(rowData)"/>
                    <edit-btn v-if="currentUser.features.create_save_to_my_template" icon="" color="primary"
                              @click="viewDetails(rowData)" text="View"/>
                    <btn v-if="rowData.is_suspend && currentUser.role==='owner'" color="success" size="xs"
                         @click="suspendTemplate(rowData)" text="Retrieve"/>
                    <btn v-if="!rowData.is_suspend && currentUser.role==='owner'" color="warning" size="xs"
                         @click="suspendTemplate(rowData)" text="Suspend"/>
                    <btn v-if="!rowData.is_suspend" color="primary" size="xs" @click="preview(rowData)"
                         text="Preview"/>
                </div>
            </template>
            <template #footer>
                <modal no-close-on-backdrop title="Add Template" ref="addModal" width="30r" header-color="primary">
                    <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}"
                            :save-params="{json: json}">
                        <validated-input label="Template Name" v-model="model.name" :disabled="loading"/>
                        <!--                    <textarea-input label="Json" v-model="model.json" :disabled="loading"/>-->
                        <save-btn icon="" text="Save" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Saving...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <modal no-close-on-backdrop title="Edit Template" ref="editModal" width="30r"
                       header-color="primary">
                    <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}"
                            :initial-data="editingItem">
                        <validated-input label="Name" v-model="model.name" :disabled="loading"/>
                        <save-btn icon="" text="Update" color="primary" size="sm" :disabled="loading">
                            <span v-if="loading"><loading-animation/><span
                                style="vertical-align: super"> Updating...</span></span>
                        </save-btn>
                    </b-form>
                </modal>

                <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                    <p>You are about to delete the Template <b
                        v-html="deletingItem && deletingItem.name"></b>.
                        Are
                        you sure ?</p>
                    <template #loading>
                        <loading-animation/>
                        Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
                    </template>
                </delete-modal>
            </template>
        </vue-table-card>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';

export default {
    name : 'MyTemplate',
    data () {
        return {
            listUrl   : urls.Consumer.MyTemplate.list,
            addUrl    : urls.Consumer.MyTemplate.addEdit,
            deleteUrl : urls.Consumer.MyTemplate.delete,
            fields    : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'name',
                    sortField : 'name',
                    title     : 'Tender'
                },
                {
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            json        : '',
            editingItem : {
                id   : '',
                name : ''
            },
            deletingItem : null
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    methods : {
        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            refs.editModal.close();
            refs.table.refreshTable();
        },
        setEdit (item) {
            this.editingItem.id = item.id;
            this.editingItem.name = item.name;
            this.$refs.editModal.show();
        },
        setDelete (item) {
            this.deletingItem = { ...item };
            this.$refs.deleteModal.show();
        },
        deleteComplete (response) {
            this.deletingItem = null;
            this.$refs.deleteModal.close();
            this.$refs.table.refreshTable();
        },
        suspendTemplate (item) {
            const that = this;
            axios.form(urls.Consumer.MyTemplate.suspend, { id : item.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.suspendSuccess(json);
                } else {
                    that.suspendFailure(json);
                }
            });
        },
        suspendSuccess () {
            this.$refs.table.refreshTable();
        },
        suspendFailure () {
            this.$refs.table.refreshTable();
        },
        preview (rowData) {
            this.$router.push('/app/my-template/' + rowData.id + '/preview/');
        },
        viewDetails (rowData) {
            this.$router.push('/app/my-template/' + rowData.id + '/details/');
        }
    }
};
</script>
