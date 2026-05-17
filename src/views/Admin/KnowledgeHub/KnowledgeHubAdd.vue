<template>
    <div class="py-1">
        <b-form :save-url="addUrl" @success="addSuccess" v-slot="{model, loading}">
            <textarea-input class="h-textarea" label="Question *:" name="question"
                             v-model="model.question" :rules="rules.question"/>
            <textarea-input class="c-textarea" label="Answer *:" name="answer"
                              v-model="model.answer" :rules="rules.question"/>
            <div class="row">
                <div class="col">
                    <validated-input label="Order :" name="Order"
                                     type="number" v-model="model.order"/>
                </div>
                <div class="col">
                    <validated-vue-select label="Status :" name="status" v-model="model.delete_flag"
                                          :options="statusOptions"/>
                </div>
            </div>

            <save-btn text="Add" loading-text="saving.." :loading="loading" color="primary"/>
        </b-form>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';

export default {
    name  : 'KnowledgeHubAdd',
    props : {
        addSuccess : Function
    },
    data () {
        return {
            loading       : false,
            addUrl        : urls.Admin.Website.KnowledgeHub.add,
            statusOptions : [
                { label : 'Enabled', value : false },
                { label : 'Disabled', value : true }
            ],
            model : {
                question    : '',
                answer      : '',
                delete_flag : '',
                order       : ''
            },
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
                that.$emit('success');
                that.$notify('success', 'Successfully added', {
                    type : 'success'
                });
            } else {
                this.form_errors = response.data.errors;
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
