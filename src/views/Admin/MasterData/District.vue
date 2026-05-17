<template>

    <vue-table-card title="District" :fields="fields" :url="listUrl" :per-page="10" ref="table">
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
            <modal title="Add District" ref="addModal" width="30r" header-color="primary" no-close-on-backdrop>
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}">
                    <validated-input label="District"
                                     v-model="model.name"
                                     :rules="rules.district"
                                     :disabled="loading"/>
                    <validated-ajax-vue-select :url="stateOptions"
                                               label="State"
                                               v-model="model.state"
                                               :rules="rules.state"
                                               :disabled="loading"/>
                    <save-btn text="Add District" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <modal title="Edit State" ref="editModal" width="30r" header-color="primary" no-close-on-backdrop>
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}" :initial-data="editingItem">
                    <validated-input label="District" v-model="model.name"
                                     :rules="rules.district" :disabled="loading"/>
                    <validated-ajax-vue-select :url="stateOptions"
                                               label="State"
                                               v-model="model.state"
                                               :rules="rules.state"
                                               :disabled="loading"/>
                    <save-btn text="Save District" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                <p>You are about to delete the district <b v-html="deletingItem && deletingItem.name"></b>. Are you sure ?</p>

                <template #loading>
                    <loading-animation/>
                    Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
                </template>
            </delete-modal>
        </template>

    </vue-table-card>
</template>

<script>
import urls from '@/data/urls';

export default {
    name : 'District',
    data () {
        return {
            showAddForm  : false,
            listUrl      : urls.Admin.MasterData.District.list,
            addUrl       : urls.Admin.MasterData.District.addEdit,
            deleteUrl    : urls.Admin.MasterData.District.delete,
            stateOptions : urls.Admin.MasterData.District.stateOptions,
            editingItem  : null,
            deletingItem : null,
            fields       : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'name',
                    sortField : 'name',
                    title     : 'District'
                },
                {
                    name      : 'state_name',
                    sortField : 'state_name',
                    title     : 'State'
                },
                {
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            rules : {
                district : {
                    required : true
                },
                state : {
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
