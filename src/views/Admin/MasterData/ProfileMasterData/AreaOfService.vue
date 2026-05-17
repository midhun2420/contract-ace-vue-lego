<template>
    <vue-table-card title="Area of Service" :fields="fields" :url="listUrl" :per-page="10" ref="table">
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
            <modal no-close-on-backdrop title="Add Area of Service" ref="addModal" width="30r" header-color="primary">
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}">
                    <validated-input label="Area Of Service"
                                     v-model="model.area_of_service"
                                     :rules="rules.service"
                                     :disabled="loading"/>
                    <save-btn text="Add Area of Service" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <modal no-close-on-backdrop title="Edit Area of Service" ref="editModal" width="30r" header-color="primary">
                <b-form :save-url="addUrl" @success="formSuccess" v-slot="{model, loading}" :initial-data="editingItem">
                    <validated-input label="Area Of Service" v-model="model.area_of_service"
                                     :rules="rules.service" :disabled="loading"/>
                    <save-btn text="Save Area of Service" color="primary" size="sm" :disabled="loading">
                        <span v-if="loading"><loading-animation/><span style="vertical-align: super"> Saving...</span></span>
                    </save-btn>
                </b-form>
            </modal>

            <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
                <p>You are about to delete the Area of Service <b v-html="deletingItem && deletingItem.area_of_service"></b>. <br>Are you sure ?</p>

                <template #loading>
                    <loading-animation/>
                    Please wait while we delete <b v-html="deletingItem && deletingItem.area_of_service"></b>.
                </template>
            </delete-modal>
        </template>

    </vue-table-card>
</template>

<script>
import urls from '@/data/urls';

export default {
    name : 'AreaOfService',
    data () {
        return {
            showAddForm  : false,
            listUrl      : urls.Admin.MasterData.ProfileMasterData.AreaOfService.list,
            addUrl       : urls.Admin.MasterData.ProfileMasterData.AreaOfService.addEdit,
            deleteUrl    : urls.Admin.MasterData.ProfileMasterData.AreaOfService.delete,
            editingItem  : null,
            deletingItem : null,
            fields       : [
                {
                    name      : 'id',
                    sortField : 'id',
                    title     : 'ID'
                },
                {
                    name      : 'area_of_service',
                    sortField : 'area_of_service',
                    title     : 'Area of Service'
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
