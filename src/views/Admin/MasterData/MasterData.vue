<template>
    <div class="row">
        <div class="col-md-6 mb-5">
            <vendor-category class="bs-4"/>
            <state class="bs-5"/>
        </div>
        <div class="col-md-6 mb-5">
            <country class="bs-5"/>
            <district class="bs-4"/>
        </div>
    </div>
</template>

<script>
import Country from '@/views/Admin/MasterData/Country';
import VendorCategory from '@/views/Admin/MasterData/VendorCategory';
import State from '@/views/Admin/MasterData/State';
import District from '@/views/Admin/MasterData/District';

export default {
    name       : 'MasterData',
    components : {
        Country,
        VendorCategory,
        State,
        District
    }
};
</script>

<style scoped>

</style>
