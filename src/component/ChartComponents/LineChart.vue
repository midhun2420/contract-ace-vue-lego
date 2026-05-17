<script>
import { Line } from 'vue-chartjs';

export default {
    extends : Line,
    props   : { data : { type : Object } },
    data () {
        return {
            chartData : {
                labels   : [],
                datasets : []
            },
            chartOptions : {
                responsive : false,
                legend     : {
                    display : true
                },
                tooltips : {
                    titleFontSize : 12,
                    bodyFontSize  : 12
                },
                scales : {
                    xAxes : [],
                    yAxes : [
                        {
                            ticks : {
                                beginAtZero : false
                            }
                        }
                    ]
                }
            }
        };
    },
    mounted () {
        this.chartData.labels = this.data.label;
        this.chartData.datasets = this.data.datasets;
        this.renderChart(this.chartData, this.chartOptions);
    }
};
</script>
