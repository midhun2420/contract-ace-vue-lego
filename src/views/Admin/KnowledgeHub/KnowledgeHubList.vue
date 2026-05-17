<template>
<div class="card bs-5">
    <vue-table-card title="Knowledge Hub" :fields="fields" :url="listUrl" :per-page="10" ref="table">
        <template #buttons>
            <btn color="primary" icon="fa fa-plus" @click="showAddModal" size="sm" text="New"/>
        </template>

        <template #actions="{rowData}">
            <div class="btn-group-tight">
                <btn color="primary" size="xs" text="Edit" @click="viewDetails(rowData)" icon="fa fa-pencil"/>
                <btn color="danger" size="xs" text="Delete" @click="setDelete(rowData)" icon="fa fa-trash"/>
            </div>
        </template>

    </vue-table-card>

    <modal ref="addModal" title="Knowledge Hub Create" width="70r" class="pt-5" header-color="primary" no-close-on-backdrop>
        <knowledge-hub-add :addSuccess="addSuccess"></knowledge-hub-add>
    </modal>

    <delete-modal ref="deleteModal" :url="deleteUrl" :params="deletingItem" @response="deleteComplete">
            <p>You are about to delete the question <b v-html="deletingItem && deletingItem.question"></b>. Are you
                sure
                ?</p>

            <template #loading>
                <loading-animation/>
                Please wait while we delete <b v-html="deletingItem && deletingItem.name"></b>.
            </template>
    </delete-modal>

    <modal ref="editModal" title="Knowledge Hub Details" width="70r" header-color="primary" no-close-on-backdrop>
        <knowledge-hub-edit :editingItem="editModel" :editedItem="editedItem"></knowledge-hub-edit>
    </modal>
</div>
</template>

<script>
import urls from '@/data/urls';
// import axios from 'secure-axios';
import KnowledgeHubAdd from '@/views/Admin/KnowledgeHub/KnowledgeHubAdd';
import KnowledgeHubEdit from '@/views/Admin/KnowledgeHub/KnowledgeHubEdit';

export default {
    name       : 'KnowledgeHubList',
    components : {
        KnowledgeHubAdd,
        KnowledgeHubEdit
    },
    data () {
        return {
            loading      : false,
            listUrl      : urls.Admin.Website.KnowledgeHub.Vuelist,
            deleteUrl    : urls.Admin.Website.KnowledgeHub.delete,
            deletingItem : null,
            editModel    : {},
            fields       : [
                {
                    name      : 'order',
                    title     : 'Sl No',
                    sortField : 'order'
                },
                {
                    name      : 'question',
                    title     : 'Question',
                    sortField : 'question'
                },
                // {
                //     name      : 'answer',
                //     title     : 'Answer',
                //     sortField : 'answer'
                // },
                {
                    name      : 'order',
                    title     : 'Order',
                    sortField : 'order'
                },
                {
                    name      : 'status',
                    title     : 'Status',
                    sortField : 'status'
                },
                // {
                //     name      : 'created_at',
                //     title     : 'Created At',
                //     sortField : 'created_at'
                // },
                {
                    name  : '__slot:actions',
                    title : 'Actions'
                }
            ]
        };
    },
    methods : {
        showAddModal () {
            this.$refs.addModal.show();
        },
        viewDetails (data) {
            this.$refs.editModal.show();
            this.editModel = { ...data };
            // this.editModel.id = data.id;
            // this.editModel.question = data.question;
            // this.editModel.answer = data.answer;
            // this.editModel.delete_flag = data.delete_flag;
            // this.editModel.order = data.order;
        },
        editedItem () {
            this.$refs.editModal.close();
            this.$refs.table.refreshTable();
            this.$refs.editedModel = null;
        },
        addSuccess () {
            this.$refs.addModal.close();
            this.$refs.table.refreshTable();
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
