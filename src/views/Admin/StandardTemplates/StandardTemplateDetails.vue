<template>
    <div>
        <div v-if="loading" class="bg-primary p-3 mb-4" style="border-radius: 6px;">
            <loading-animation/>
            <span style=" vertical-align: super"> Loading details....</span>
        </div>
        <div v-if="!loading && details && permission">
            <Canvas :json="initial_json" @save="onSave"  @back="backButtonClicked" :title="details.name" :number="details.id"/>
        </div>

        <delete-modal okButton="ok" cancelButton="cancel" no-close-on-backdrop headerColor="primary"
                      bodyColor="primary" okButtonColor="primary" url="aaa"
                      ref="confirmModal" title="Confirm Exit" @okClicked="confirmExit">
            <p>Changes you made is not saved.</p>
            <b>Exit without saving?</b>
        </delete-modal>
        <div v-if="!permission" class="card text-center bg-primary">Page not found!</div>
    </div>
</template>

<script>
import urls from '@/data/urls';
import axios from 'secure-axios';
import { mapGetters } from 'vuex';
import Canvas from '@/component/Editor/Canvas';

export default {
    name       : 'StandardTemplateDetailsPage',
    components : { Canvas },
    data () {
        return {
            permission   : true,
            loading      : false,
            id           : this.$route.params.id,
            initial_json : null,
            details      : [],
            editingItem  : {
                id   : this.$route.params.id,
                name : ''
            }
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
                    that.details.json = json.json;
                    that.$notify('Template saved', 'Success', {
                        type : 'success'
                    });
                    that.formSuccess();
                }
            });
        },
        backButtonClicked (json) {
            const baseData = '[\n' +
                '    {\n' +
                '        "tabName": "First Tab",\n' +
                '        "data": []\n' +
                '    }\n' +
                ']';
            const currentJson = JSON.parse(JSON.stringify(this.details.json));
            console.log(currentJson);
            const newJson = JSON.parse(json);
            console.log(newJson);
            if ((JSON.stringify(currentJson) === JSON.stringify(newJson)) || (json === baseData)) {
                this.$router.push('/app/standard-templates/');
            } else {
                this.$refs.confirmModal.show();
            }
        },
        confirmExit (response) {
            this.$refs.confirmModal.close();
            this.$router.push('/app/standard-templates/');
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
                } else if (json.permission === false) {
                    that.permission = json.permission;
                    that.loading = false;
                } else if (json.error === true) {
                    that.permission = json.permission;
                    that.loading = false;
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
