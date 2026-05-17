<template>
    <div>
        <div v-if="loading" class="text-center">
            <loading-animation/>
            <p>Loading data...</p>
        </div>
        <user-acquisition-chart :title="title" v-if="details && !loading" :data="details" :cumulative_data="cumulative_details"/>
        <p class="text-center" v-if="!details && !loading">No data available.</p>
    </div>
</template>

<script>
import UserAcquisitionChart from './UserAcquisitionChart';
import { colors } from '../../../../assets/chart-colors';
import urls from '../../../../data/urls';
// eslint-disable-next-line no-unused-vars
import axios from 'secure-axios';

export default {
    name  : 'Statistics',
    props : {
        title : { type : String, default : 'Company' }
    },
    components : { UserAcquisitionChart },
    data () {
        return {
            colors  : colors,
            loading : false,
            listUrl : urls.Admin.Reports.userAcquisitionChartList,
            details : {
                labels   : [],
                datasets : [
                    {
                        label           : '',
                        data            : [],
                        backgroundColor : []
                    }
                ]
            },
            cumulative_details : {
                labels   : [],
                datasets : [{
                    label       : '',
                    data        : [],
                    fill        : false,
                    borderColor : 'rgb(255,0,0)',
                    tension     : 0.1
                }]
            },
            data            : '',
            cumulative_data : ''

        };
    },
    mounted () {
        this.loadData();
    },
    methods : {
        loadData () {
            const that = this;
            that.loading = true;
            axios.get(this.listUrl).then(function (response) {
                const json = response.data;
                if (json.success === true) {
                    if (that.title === 'Company') {
                        that.data = json.data.company;
                        that.cumulative_data = json.cumulative_data.company;
                    }
                    if (that.title === 'Users') {
                        that.data = json.data.users;
                        that.cumulative_data = json.cumulative_data.users;
                    }
                    if (that.title === 'Tenders') {
                        that.data = json.data.tenders;
                        that.cumulative_data = json.cumulative_data.tenders;
                    }
                    if (that.title === 'Bids') {
                        that.data = json.data.bids;
                        that.cumulative_data = json.cumulative_data.bids;
                    }
                    that.setChartData(that.data, 1);
                    that.setChartData(that.cumulative_data, 2);
                    that.loading = false;
                } else {
                    that.$notify('Could not load the data, Please try again later.', '', {
                        type : 'danger'
                    });
                    that.loading = false;
                }
                that.loading = false;
            });
        },
        setChartData (data, type) {
            const labels = [];
            const values = [];
            const bgColor = [];
            for (const [key, value] of Object.entries(data)) {
                labels.unshift(key);
                values.unshift(value);
            }
            for (let i = 0; i < Object.keys(data).length; i++) {
                bgColor.push(this.colors[i]);
            }
            if (type === 1) {
                this.details.labels = labels;
                this.details.datasets[0].data = values;
                this.details.datasets[0].backgroundColor = bgColor;
            } else {
                this.cumulative_details.labels = labels;
                this.cumulative_details.datasets[0].data = values;
            }
        }
    }
};
</script>

<style scoped>

</style>
