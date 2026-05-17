<template>
    <div class="container-fluid body-container bg-1"
         :style="{ 'height': `${window.height}px`, 'min-height': `${window.height}px`}">
        <div class="container-fluid pl-md-6 h-100">
            <div class="row position-relative z-1">
                <div class="col-md-7 position-relative">
                    <img src="../../assets/images/Shape2.png" class="top-content-line" alt="">
                    <div class="container p-0">
                        <div class="header">
                            <router-link to="/auth/design/" class="text-white fs-6">ContactAce</router-link>
                        </div>
                        <div class="text-white content-container pr-md-6"
                             :style="{ 'height': `calc(${window.height}px - 160px)`}">
                            <div class="xeo-card-1 bs-l-semi-m">
                                <p class="card-head mb-0">
                                    O<span class="font-weight-normal">ne</span>
                                    T<span class="font-weight-normal">ime</span>
                                    P<span class="font-weight-normal">assword</span>
                                </p>
                                <small>Please enter the varification code send to
                                    <span class="font-weight-bold">+91 7788994455</span>
                                </small>
                                <form class="mt-3">
                                    <div class="form-group xeo-input-1">
                                        <input type="text" class="form-control" placeholder="Enter the OTP">
                                    </div>
                                    <div class="text-right text-custom">
                                        <a href="#" class="mr-2">Resend OTP</a>
                                    </div>
                                    <div class="row fl-cc mt-4">
                                        <div class="col-xl-3 col-lg-4 col-6">
                                            <button type="submit" class="btn xeo-btn-1 btn-block">Validate</button>
                                        </div>
                                        <p class="mb-0 mt-3">Not a member? <a href="#">Register now</a></p>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
            <div class="row bg-main d-none d-md-block" :style="{ 'height': `${window.height}px`, 'min-height': `${window.height}px`}">
                <div class="col-5 p-0 h-100">
                    <img class="img-fluid" src="../../assets/images/bg.png" alt="">
                    <p class="bg-text">HIRE THE <br> BEST TEAMS</p>
                </div>
            </div>
            <p class="content-text pl-6">POST JOBS.BID.HIRE</p>
        </div>

        <img src="../../assets/images/Shape1.png" class="bottom-content-line" alt="">
    </div>
</template>

<script>
export default {
    name : 'OTP-Design',
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

</style>
