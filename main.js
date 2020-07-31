import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import store from './store/index.js';


Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

// 挂载一个可全局访问的音频组件
let audio = uni.createInnerAudioContext();

audio.autoplay = true;
// 音频就绪后触发的回调函数
audio.onCanplay(() => {
	let time = audio.duration;
	store.commit('getTotalTime', time);
	let m = parseInt(time / 60);
	m = m < 10 ? '0' + m : m;
	let s = parseInt(time % 60);
	s = s < 10 ? '0' + s : s;
	time = m + ':' + s;
	store.commit('getEndTime', time);
})
// 音频进度更新后触发的时间
audio.onTimeUpdate(() => {
	let nowTime = audio.currentTime;
	store.commit('getCurrentTime', nowTime);
	let m = parseInt(nowTime / 60);
	m = m < 10 ? '0' + m : m;
	let s = parseInt(nowTime % 60);
	s = s < 10 ? '0' + s : s;
	let t = m + ':' + s;
	store.commit('getnowPlayTime', t);
})
// 音频自然播放结束后触发的事件
audio.onEnded(() => {
	if (store.state.subscript < store.getters.length) {
		store.commit('addIndex');
	} else {
		store.commit('getIndex', 0);
	}
})
Vue.prototype.$audio = audio;

// 定义全局时间过滤器
Vue.filter("date", function(value) {
	let date = new Date(value);
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();
	let h = date.getHours();
	h = h < 10 ? "0" + h : h;
	let mm = date.getMinutes();
	mm = mm < 10 ? "0" + mm : mm;
	let nowDate = new Date();
	let nowY = nowDate.getFullYear();
	let nowD = nowDate.getDate();
	if (y === nowY && d === nowD) {
		return `${h}:${mm}`;
	}
	if (y === nowY) {
		return `${m}月${d}日`;
	}
	return `${y}年${m}月${d}日`;
});

// 挂载一个可供全局访问的定时器,以便处理进度条长度
let setInterval = null;
Vue.prototype.$setInterval = setInterval;

const app = new Vue({
	store,
	...App
})
// http拦截器，此为需要加入的内容
import http from './util/http.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(http, app);

app.$mount()
