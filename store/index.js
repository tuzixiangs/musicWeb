import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		// 点击音乐的索引
		subscript: null,
		// 播放列表信息
		playList: null,
		// 控制播放
		isBtn: false,
		// 控制播放列表出现与隐藏
		isShow: false,
		// 音频总时长
		totalTime: null,
		endTime: '00:00',
		// 正在播放的时间
		nowPlayTime: '00:00',
		// 音量
		volume:100,
		// 当前播放时间
		currentTime:0
	},
	getters: {
		length(state) {
			return state.playList.length - 1;
		},
	},
	mutations: {
		//音乐的索引
		getIndex(state, i) {
			state.subscript = i;
		},
		addIndex(state) {
			state.subscript += 1;
		},
		reduceIndex(state) {
			state.subscript -= 1;
		},
		// 播放列表信息
		getPlayList(state, list) {
			state.playList = list;
		},
		// 控制播放
		getIsBtn(state, btn) {
			state.isBtn = btn ? btn : !state.isBtn;
		},
		// 控制播放列表出现与隐藏
		getIsShow(state, show) {
			state.isShow = show;
		},
		// 总时长
		getEndTime(state, time) {
			state.endTime = time;
		},
		getTotalTime(state, time) {
			state.totalTime = time;
		},
		// 正在播放的时间
		getnowPlayTime(state, t) {
			state.nowPlayTime = t;
		},
		getCurrentTime(state, t) {
			state.currentTime = t;
		},
		// 音量
		getVolume(state, v){
			state.volume = v;
		}	
	}
})
export default store
