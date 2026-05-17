<template>
    <div>
        <div v-if="details">
            <Canvas :json="initial_json" :variable-json="variablesJson" @save="onSave" :title="details.name + ' # ' + details.id"/>
        </div>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import Canvas from '@/component/Bidder/BidView';
import OneBid from '@/data/Samples/OneBid';

export default {
    name       : 'StandardTemplateDetailsPage',
    components : { Canvas },
    data () {
        return {
            loading      : false,
            id           : this.$route.params.id,
            initial_json : null,
            details      : [],
            editingItem  : {
                id   : this.$route.params.id,
                name : ''
            },
            variablesJson : JSON.stringify(OneBid)
        };
    },
    computed : {
        ...mapGetters(['currentUser'])
    },
    beforeMount () {
        this.loadDetails();
    },
    methods : {
        onSave (json) {
            // Implement save here.
            this.editingItem.json = json;
            const that = this;
            axios.form(urls.Admin.StandardTemplate.addEdit, that.editingItem).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.$notify('My template saved', 'Success', {
                        type : 'success'
                    });
                    that.formSuccess();
                }
            });
        },
        loadDetails () {
            const that = this;
            that.loading = true;
            axios.form(urls.Admin.StandardTemplate.details, { id : this.id }).then(function (response) {
                const json = response.data;
                if (json.error === false) {
                    that.details = json.template;
                    that.initial_json = JSON.stringify(json.template.json);
                    that.loading = false;
                    that.setEdit(that.details);
                } else {
                    console.log('Error', json);
                }
            });
        },
        setEdit (details) {
            this.editingItem.name = details.name;
        },
        formSuccess (response) {
            this.details = response.data.details;
        }
    }
}
;
</script>

<style scoped>
.text-small {
    font-weight: 500;
}

.form-control {
    border-radius: 5px;
}
</style>
