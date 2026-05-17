<template>
    <div>
        <div v-if="showStatistics">
            <div class="fl-te-c mb-2">
                <h4>{{ title }} Monthly Report</h4>
                <btn title="Cumulative" @click="showStatistics=false"/>
            </div>
            <bar-chart :chart-data="data" :options="options"></bar-chart>
        </div>
        <div v-else>
            <div class="fl-te-c mb-2">
                <h4 class="mb-3">{{ title }} Cumulative Report</h4>
                <btn title="Monthly" @click="showStatistics=true"/>
            </div>
            <line-chart :chart-data="cumulative_data" :options="options"></line-chart>
        </div>
    </div>
</template>

<script>
import BarChart from '../../../../component/BarChart';
import LineChart from '../../../../component/LineChart';

export default {
    components : {
        BarChart,
        LineChart
    },
    props : {
        title : { type : String, default : 'Company' },
        data  : {
            type    : Object,
            default : null
        },
        cumulative_data : {
            type    : Object,
            default : null
        }
    },
    data () {
        return {
            showStatistics : true,
            chartData      : '',
            options        : {
                legend              : false,
                responsive          : true,
                maintainAspectRatio : false
            }
        };
    }
};
</script>
