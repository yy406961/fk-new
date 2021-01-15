<template>
    <div>
      <span>{{ gTime }}</span>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'hello',
        data () {
            return {
                gTime: '',
                gTimeFormat: ''
            }
        },
        mounted () {
            this.setTime();
        },
        methods: {
            setTime () {
                let time = new Date();
                let year = time.getFullYear().toString();
                let month = time.getMonth() + 1;

                let d = time.getDate();
                let h = time.getHours();
                let m = time.getMinutes();
                let s = time.getSeconds();

                let condition = month === 1 || month === 3 || month === 5 ||
                  month === 7 || month === 8 || month === 10 || month === 12

                let startTime = new Date().getTime();
                let count = 0;
                let me = this;
                function fixed () {
                    s++;
                    if (s === 60) {
                        s = 0
                        m++;
                    }
                    if (m === 60) {
                        m = 0;
                        h++;
                    }
                    if (h === 24) {
                        h = 0;
                        d++;
                    }
                    if (condition) {
                        if (d > 31) {
                            d = 1
                            month++
                        }
                    } else {
                      // 2 4 6 8 10
                      // 二月 特殊情况
                        if (month === 2) {
                            //  润年
                            if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
                                if (d > 29) {
                                    d = 1
                                    month++
                                }
                            } else {
                                // 非润年
                                if (d > 28) {
                                    d = 1
                                    month++
                                }
                            }
                        } else {
                            if (d > 30) {
                                d = 1
                                month++
                            }
                        }
                    }
                    if (month > 12) {
                        month = 1
                        year++
                    }
                    let seconds = s < 10 ? '0' + s : s;
                    let minites = m < 10 ? '0' + m : m;
                    let hours = h < 10 ? '0' + h : h;
                    let date = d < 10 ? '0' + d : d;
                    let month1 = month < 10 ? '0' + month : month;
                    // me.gTime = `${year}年${month1}月${date}日${hours}:${minites}:${seconds}`;
                    me.gTime = `${year}-${month1}-${date} ${hours}:${minites}:${seconds}`
                    count++;
                    let offset = new Date().getTime() - (startTime + count * 1000);
                    let nextTime = 1000 - offset;
                    if (nextTime < 0) nextTime = 0;
                    setTimeout(fixed, nextTime);
                }
                setTimeout(fixed, 1000);
            }
        }
    }
</script>

<style>
</style>