<template>
    <vue-table-card title="Service" :fields="fields" :url="listUrl" :per-page="10" ref="table">
        <template #buttons>
            <btn color="success" icon="fa fa-plus" size="sm" @click="$refs.addModal.show()" text="Add"/>
        </template>

        <template #actions="{rowData}">
            <div class="btn-group-tight">
                <delete-btn @click="setDelete(rowData)"/>
                <edit-btn @click="setEdit(rowData)"/>
            </div>
        </template>

        <template #footer>
            <modal no-close-on-backdrop title="Add Service" ref="addModal" width="30r" header-color="primary">
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}">
                    <validated-input label="Service Name"
                                     v-model="model.service_name"
                                     :rules="rules.service"
                                     :disabled="loading"/>
                    <save-btn text="Add Service" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <modal no-close-on-backdrop title="Edit Service" ref="editModal" width="30r" header-color="primary">
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}" :initial-data="editingItem">
                    <validated-input label="Service Name"
                                     v-model="model.service_name"
                                     :rules="rules.service"
                                     :disabled="loading"/>
                    <save-btn text="Save Service" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                <p>You are about to delete the service <b v-html="deletingItem && deletingItem.service_name"></b>. Are you sure ?</p>

                <template #loading>
                    <loading-animation/>
                    Please wait while we delete <b v-html="deletingItem && deletingItem.service_name"></b>.
                </template>
            </delete-modal>
        </template>

    </vue-table-card>
</template>

<script>
import urls from '@/data/urls';

export default {
    name : 'Service',
    data () {
        return {
            showAddForm  : false,
            listUrl      : urls.Admin.MasterData.ProfileMasterData.Service.list,
            addUrl       : urls.Admin.MasterData.ProfileMasterData.Service.addEdit,
            deleteUrl    : urls.Admin.MasterData.ProfileMasterData.Service.delete,
            editingItem  : null,
            deletingItem : null,
            fields       : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'service_name',
                    sortField : 'service_name',
                    title     : 'Service'
                },
                {
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            rules : {
                service : {
                    required : true
                }
            }
        };
    },
    methods : {
        formSuccess () {
            const refs = this.$refs;
            refs.addModal.close();
            refs.editModal.close();
            refs.table.refreshTable();

            this.editingItem = null;
        },

        setEdit (item) {
            this.editingItem = { ...item };
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
        }
    }
};
</script>

<style scoped>

</style>
