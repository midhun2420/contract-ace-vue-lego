<template>
    <vue-table-card title="Industry" :fields="fields" :url="listUrl" :per-page="10" ref="table">
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
            <modal no-close-on-backdrop title="Add Industry" ref="addModal" width="30r" header-color="primary">
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}">
                    <validated-input label="Industry Type"
                                     v-model="model.industry_type"
                                     :rules="rules.industry"
                                     :disabled="loading"/>
                    <save-btn text="Add Industry" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <modal no-close-on-backdrop title="Edit Industry" ref="editModal" width="30r" header-color="primary">
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}" :initial-data="editingItem">
                    <validated-input label="Industry Type"
                                     v-model="model.industry_type"
                                     :rules="rules.industry"
                                     :disabled="loading"/>
                    <save-btn text="Save Industry" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                <p>You are about to delete the Industry <b v-html="deletingItem && deletingItem.industry_type"></b>. Are you sure ?</p>

                <template #loading>
                    <loading-animation/>
                    Please wait while we delete <b v-html="deletingItem && deletingItem.industry_type"></b>.
                </template>
            </delete-modal>
        </template>

    </vue-table-card>
</template>

<script>
import urls from '@/data/urls';

export default {
    name : 'Industry',
    data () {
        return {
            showAddForm  : false,
            listUrl      : urls.Admin.MasterData.ProfileMasterData.Industry.list,
            addUrl       : urls.Admin.MasterData.ProfileMasterData.Industry.addEdit,
            deleteUrl    : urls.Admin.MasterData.ProfileMasterData.Industry.delete,
            editingItem  : null,
            deletingItem : null,
            fields       : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'industry_type',
                    sortField : 'industry_type',
                    title     : 'Industry'
                },
                {
                    name       : '__slot:actions',
                    titleClass : 'center aligned text-right',
                    dataClass  : 'aligned text-right'
                }
            ],
            rules : {
                industry : {
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
            const data = response.data || response;
            console.log(data);
            if (data.success === true) {
                this.$notify(
                    data.message || 'Deleted Successfully',
                    'Success',
                    { type : 'success' }
                );
                this.$refs.table.refreshTable();
            } else {
                this.$notify(
                    data.message || 'Unable to delete record',
                    'Warning',
                    { type : 'warning' }
                );
            }
            this.$refs.deleteModal.close();
        }
    }
};
</script>

<style scoped>

</style>
