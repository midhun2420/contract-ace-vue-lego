<template>
    <div class="py-1">
        <b-form :save-url="addUrl" v-slot="{model, loading}"
                        :initial-data="editingItem" @success="editedItem">
            <textarea-input class="h-textarea" label="Question *:" name=" question"
                             v-model="model.question"/>
            <textarea-input class="c-textarea" label="Answer *:" name="answer"
                              v-model="model.answer"/>
            <div class="row">
                <div class="col">
                    <validated-input label="Order *:" name="Order"
                                     type="number" v-model="model.order"/>
                </div>
                <div class="col">
                    <span>Status :</span>
                    <validated-vue-select name="status" v-model="model.delete_flag"
                                          :options="statusOptions"/>
                </div>
                <div class="col">
                    <span>Created At :</span>
                    <span class="form-control">
                        {{ editingItem.created_at }}
                    </span>
                </div>
            </div>

            <save-btn text="Update" loading-text="updating.." :loading="loading" color="primary"/>
        </b-form>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name  : 'KnowledgeHubAdd',
    props : {
        editingItem : null,
        editedItem  : Function
    },
    data () {
        return {
            addUrl        : urls.Admin.Website.KnowledgeHub.add,
            loading       : false,
            statusOptions : [
                { label : 'Enabled', value : false },
                { label : 'Disabled', value : true }
            ],
            rules : {
                question : { required : true }
            }
        };
    },
    methods : {
        async submit () {
            const that = this;
            that.loading = true;
            const response = await axios.form(urls.Admin.Website.KnowledgeHub.add, that.model);
            if (response.data.success) {
                console.log('add form response', response);
                that.$emit('success');
                that.$notify('success', 'Successfully saved', {
                    type : 'success'
                });
            } else {
                that.$notify('error', 'Something went wrong', {
                    type : 'danger'
                });
            }
            that.loading = false;
        }
    }
};

</script>

<style scoped>
<style>
