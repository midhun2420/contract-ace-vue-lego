<template>
    <login-page-layout>

        <div class="text-white">
            <h1 class="font-weight-bold underline">YOUR CONTRACT <br> EXPERT</h1>
            <p class="mt-3">360 Degree solution for your Tendering, Contract Management and
                Procurement
                Needs</p>

            <div class="fl-x">
                <btn color="secondary" border-radius="custom" class="w-10r font-weight-bold"
                     @click="$router.push('/auth/register/')"
                     text="REGISTER"/>
                <btn color="secondary" border-radius="custom" class="w-10r ml-4 font-weight-bold"
                     @click="$router.push('/auth/login/')"
                     text="LOGIN"/>
            </div>
        </div>

    </login-page-layout>

</template>

<script>
import LoginPageLayout from './LoginPageLayout';

export default {
    name       : 'Landing',
    components : { LoginPageLayout },
    // metaInfo   : {
    //     title         : 'Login',
    //     titleTemplate : 'ContractAce - %s',
    //     htmlAttrs     : {
    //         lang : 'en',
    //         amp  : true
    //     },
    //     meta : [
    //         {
    //             name    : 'description',
    //             content : 'Register Now.'
    //         },
    //         {
    //             name    : 'keywords',
    //             content : 'contract ace, e-tendering in India, e-tenders, contract management services , contract management in India, procurement software, construction software, procurement service , procurement process in India'
    //         }
    //     ]
    // },
    data () {
        return {
            window : {
                height : window.innerHeight
            }
        };
    }
};

</script>

<style scoped>
.underline {
    position: relative;
    padding-bottom: 20px;
}

.underline::after {
    content: "";
    position: absolute;
    bottom: 0;
    height: 5px;
    width: 80px;
    left: 0;
    background-color: #e8ae0e;
}
</style>
