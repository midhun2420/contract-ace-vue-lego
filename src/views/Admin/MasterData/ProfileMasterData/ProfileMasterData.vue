<template>
    <div class="row">
        <div class="col-md-6">
            <service class="bs-5"/>
        </div>
        <div class="col-md-6">
            <industry class="bs-5"/>
        </div>
    </div>
</template>

<script>
import Service from './Service';
import Industry from './Industry';

export default {
    name       : 'ProfileMasterData',
    components : {
        Industry,
        Service
    }
};
</script>

<style scoped>

</style>
