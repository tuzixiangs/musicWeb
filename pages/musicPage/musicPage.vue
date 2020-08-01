<template>
	<view class="musicPage">
		<!-- 头部导航栏 -->
		
		<!-- 歌曲信息 -->
		<view class="pageHead">
			<!-- #ifndef MP-WEIXIN -->
			<text class="iconfont icon-left" style="margin: 0 26rpx;color: #F1F1F1;font-size: 60rpx;" @click="backPage"></text>
			<!-- #endif -->
			<view class="info">
				<view class="name">{{ playList[subscript].name }}</view>
				<view class="singer">
					{{ playList[subscript].singerName }}
					<u-icon name="arrow-right" color="#DFDFDF" size="26"></u-icon>
				</view>
			</view>
		</view>
		<!--歌词及唱片机 -->
		<view class="pageMain" @click.self="isLyrics = !isLyrics">
			<view class="recordPlayer" v-if="isLyrics">
				<swiper
					class="pageSwiper"
					:duration="duration"
					:circular="circular"
					:current="subscript"
					@change="getCurrent"
					@transition="pageTransition"
					@animationfinish="pageAnimationfinish"
				>
					<swiper-item v-for="(item, i) in playList" :key="item.id" @click="isLyrics = !isLyrics">
						<view class="imgBox" :class="[isBtn && i === subscript && isSpin ? 'spin' : 'noSpin', i === subscript ? '' : 'rotate']">
							<image style="width: 540rpx;height: 540rpx;" src="../../static/image/play_disc.png"></image>
							<image class="songImg" style="width: 320rpx;height: 320rpx;border-radius: 50%;" :src="item.picUrl"></image>
						</view>
					</swiper-item>
				</swiper>
				<image class="pointer" :class="isBtn && isSpin ? 'angle' : ''" src="../../static/image/play_needle.png"></image>
			</view>
			<!-- 歌词 -->
			<view class="lyricsBox" v-else>
				<!-- 音量调节 -->
				<view class="volume">
					<text class="iconfont icon-volume"></text>
					<u-slider
						class="slider"
						v-model="volumes"
						block-width="20"
						step="10"
						height="4"
						active-color="#f1f1f1"
						inactive-color="rgba(255,255,255,.5)"
						@moving="setVolume"
					></u-slider>
				</view>
				<!-- 歌词滚动区 -->
				<view class="lyrics" @click="isLyrics = !isLyrics">
					<bing-lyric :lyrics="lyrics.lrc.lyric" :curTime="currentTime" :areaStyle="areaStyle" :centerStyle="centerStyle"></bing-lyric>
				</view>
			</view>
		</view>
		<!-- 进度条及功能区 -->
		<view class="pageFeatures">
			<!-- 播放进度条 -->
			<view class="progress-bar">
				<text>{{ nowPlayTime }}</text>
				<view class="linBox">
					<text class="line" ref="linRef"></text>
					<view class="activityLine">
						<view class="activityLineItem" :style="isWidth"><text class="iconfont icon-dots"></text></view>
					</view>
				</view>
				<text>{{ endTime }}</text>
			</view>
			<!-- 按钮功能区 -->
			<view class="play-btn">
				<text class="iconfont icon-like"></text>
				<text class="iconfont icon-listLoop"></text>
				<text class="iconfont icon-top-music" @click="topMusic"></text>
				<!-- 播放与暂停 -->
				<view class="playPause">
					<text class="iconfont icon-pause" v-if="isBtn" @click="pause"></text>
					<text class="iconfont icon-play" v-else @click="play"></text>
				</view>
				<text class="iconfont icon-next-music" @click="nextMusic"></text>
				<text class="iconfont icon-playList" @click="getIsShow(true)"></text>
				<view class="comments" @click="goCommentPage">
					<text class="iconfont icon-comment"></text>
					<text class="total">{{ total }}</text>
				</view>
			</view>
		</view>
		<!-- 背景 -->
		<view class="bg" :style="isBg"></view>
		<!-- 播放列表 -->
		<play-list></play-list>
	</view>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import playList from '../../myComponents/common/playList.vue';

export default {
	data() {
		return {
			// 动画时间
			duration: 0,
			// 判断动画是否暂停
			isSpin: true,
			// 判断是否采取循环
			circular: true,
			// 播放进度条宽度
			offsetWidth: 0,
			// 每秒前进的宽度
			Swidth: 0,
			// 当前进度条长度
			activeWidth: 0,
			isLyrics: true,
			// 歌词
			lyrics: '',
			// 歌词背景设置
			areaStyle: {
				background: '0'
			},
			centerStyle: {
				btnImg: '../../static/image/btn.png'
			},
			// 总评论数
			total: ''
		};
	},
	components: {
		playList
	},
	onLoad() {
		this.getLyrics(), this.getComment();
	},
	onReady() {
		this.getTime();
		// 获取进度条长度
		let line = uni
			.createSelectorQuery()
			.in(this)
			.select('.line');
		line
			.fields(
				{
					size: true
				},
				data => {
					// console.log("节点的宽为" + data.width);
					this.offsetWidth = data.width;
				}
			)
			.exec();
		// 初始化每秒前进的宽度
		this.getSwindth();
		// 初始化当前进度条长度
		this.activeWidth = this.Swidth * parseFloat(this.$audio.currentTime);
		// 初始化定时器
		if (this.isBtn && this.$setInterval === null) {
			this.$setInterval = setInterval(() => {
				this.getActiveWidth();
			}, 1000);
		}
	},
	onUnload() {
		clearInterval(this.$setInterval);
	},
	methods: {
		...mapMutations(['getIsBtn', 'getIsShow', 'getIndex', 'addIndex', 'reduceIndex', 'getEndTime', 'getTotalTime', 'getVolume']),
		// 返回上一页
		backPage() {
			uni.navigateBack();
		},
		// 播放与暂停
		play() {
			this.$audio.play();
			this.getIsBtn(true);
		},
		pause() {
			this.$audio.pause();
			this.getIsBtn(false);
		},
		// current值发生改变时触发的事件
		getCurrent(e) {
			if (e.detail.source === 'touch') {
				this.getIndex(e.detail.current);
				this.getIsBtn(true);
			}
		},
		// swiper-item位置发生变化时触发的事件
		pageTransition() {
			this.duration = 500;
			this.isSpin = false;
		},
		// 动画结束后触发的事件
		pageAnimationfinish() {
			this.duration = 0;
			this.isSpin = true;
		},
		// 上一首
		topMusic() {
			this.circular = false;
			this.getIsBtn(true);
			this.duration = 1000;
			if (this.subscript === 0) {
				this.circular = true;
				this.getIndex(this.length);
				return;
			}
			this.reduceIndex();
		},
		// 下一首
		nextMusic() {
			this.getIsBtn(true);
			this.duration = 1000;
			if (this.subscript === this.length) {
				this.circular = true;
				this.getIndex(0);
				return;
			}
			this.addIndex();
		},
		// 获取每秒前进的宽度
		getSwindth() {
			this.Swidth = this.offsetWidth / this.totalTime;
			// console.log(this.Swidth);
		},
		// 当前进度条长度
		getActiveWidth() {
			this.activeWidth += this.Swidth;
			// console.log(this.activeWidth);
		},

		//重复代码,不想改了
		// 获取初始化评论数据
		async getComment() {
			const res = await this.$u.get(`/comment/music?id=${this.playList[this.subscript].id}&limit=1`);
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~稍后再试!');
			}
			// console.log(res);
			if (res.total > 999) {
				return (this.total = '999+');
			} else if (res.total > 10000) {
				return (this.total = '1W+');
			} else if (res.total > 100000) {
				return (this.total = '10W+');
			} else {
				return (this.total = res.total);
			}
		},

		// 跳转评论页面
		goCommentPage() {
			uni.navigateTo({
				url: `songComment/songComment?id=${this.playList[this.subscript].id}`
			});
		},
		// 改变音量
		setVolume() {
			this.$audio.volume = this.volumes / 100;
			// console.log(this.val);
		},
		// 获取歌词
		async getLyrics() {
			const res = await this.$u.get(`/lyric?id=${this.playList[this.subscript].id}`);
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~请稍后再试');
			}
			// console.log(res)
			res.lrc.lyric = res.lrc.lyric.replace(/\[/g, 'sb[').split('sb');
			this.lyrics = res;
		},
		// 兼容微信小程序
		getTime() {
			let time = this.$audio.duration;
			this.getTotalTime(time);
			let m = parseInt(time / 60);
			m = m < 10 ? '0' + m : m;
			let s = parseInt(time % 60);
			s = s < 10 ? '0' + s : s;
			time = m + ':' + s;
			this.getEndTime(time);
		}
	},
	computed: {
		...mapState(['playList', 'subscript', 'isBtn', 'endTime', 'nowPlayTime', 'totalTime', 'currentTime']),
		...mapGetters(['length']),
		isBg() {
			return `background: url(${this.playList[this.subscript].picUrl}) center;`;
		},
		isWidth() {
			return `width: ${this.activeWidth}px`;
		},
		volumes: {
			set(val) {
				this.getVolume(val);
			},
			get() {
				return this.$store.state.volume;
			}
		}
	},
	watch: {
		// 监听subscript变化更改url
		subscript() {
			this.$audio.src = this.playList[this.subscript].url;
			this.getLyrics();
			this.getComment();
			// 兼容微信小程序
			this.activeWidth = 0;
			this.getSwindth();
		},
		// 监听总时长的变化重新计算每秒宽度
		totalTime() {
			this.activeWidth = 0;
			this.getSwindth();
		},
		// 监听播放与暂停,判断定时器启用和消除
		isBtn(val) {
			if (!val) {
				clearInterval(this.$setInterval);
			} else {
				this.$setInterval = setInterval(() => {
					this.getActiveWidth();
				}, 1000);
			}
		},
		volumes() {
			this.setVolume();
		}
	}
};
</script>

<style lang="scss" scoped>
.bg {
	position: fixed;
	top: 0px;
	left: 0px;
	height: 110%;
	width: 110%;
	margin: -5%;
	background-size: cover;
	-webkit-filter: blur(10px) brightness(0.6);
	-moz-filter: blur(10px) brightness(0.6);
	filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false); /* IE6~IE9 */
	z-index: -1;
}
.musicPage{
	height: 100%;
	.navbar {
		/deep/ .u-border-bottom:after {
			border-bottom-width: 0px;
		}
	}
}
.pageHead {
	flex: 1;
	display: flex;
	height: calc(11vh - var(--window-top));
	align-items: center;
	.info {
		width: 70%;
		/* #ifdef MP-WEIXIN */
		margin: 0 auto;
		text-align: center;
		/* #endif */
		.name {
			font-size: 32rpx;
			color: #f1f1f1;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.singer {
			font-size: 26rpx;
			color: #dfdfdf;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
}
.pageMain {
	// margin: 0 auto;
	flex: 1;
	height: calc(70.5vh - var(--window-top));
	/* #ifdef MP-WEIXIN */
	height: calc(70.5vh - var(--window-top));
	/* #endif */
	overflow: hidden;
	.pageSwiper {
		margin: 200rpx auto 0;
		height: 540rpx;
	}
	.imgBox {
		position: relative;
		margin: 0 auto;
		width: 540rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.songImg {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
	.pointer {
		position: absolute;
		top: 130rpx;
		left: 44%;
		width: 210rpx;
		height: 330rpx;
		transform: rotate(-30deg);
		transform-origin: 20px 20px;
		transition: transform 0.8s;
	}
	.volume {
		display: flex;
		height: 40rpx;
		align-items: center;
		.icon-volume {
			color: #ccc;
			margin: 0 30rpx 0 50rpx;
			font-size: 36rpx;
		}
		.slider {
			width: 560rpx;
		}
	}
}
.pageFeatures {
	height: calc(18.5vh - var(--window-top));
	/* #ifdef MP-WEIXIN */
	height: calc(18.5vh - var(--window-top));
	/* #endif */
	color: #f1f1f1;
	padding-top: 60rpx;
	/* #ifdef MP-WEIXIN */
	padding-top: 10rpx;
	/* #endif */
	.play-btn {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 40rpx;
		text {
			font-size: 38rpx;
		}
		.playPause {
			text {
				font-size: 80rpx;
			}
		}
		.comments{
			position: relative;
			width: 80rpx;
			.total{
				position: absolute;
				display: inline-block;
				width: 64rpx;
				height: 34rpx;
				// background-color:#7F7D7C;
				font-size: 24rpx;
				right: -8rpx;
				top: -10rpx;
			}
		}
	}
	.progress-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40rpx;
		text {
			font-size: 24rpx;
		}
		.linBox {
			display: flex;
			position: relative;
			margin: 0 30rpx;
		}
		.line {
			width: 500rpx;
			height: 1px;
			background-color: rgba($color: #fff, $alpha: 0.6);
		}
		.activityLine {
			position: absolute;
			left: 0;
			.activityLineItem {
				position: relative;
				height: 1px;
				background-color: #fff;
				.icon-dots {
					position: absolute;
					right: -32rpx;
					top: -40rpx;
					font-size: 60rpx;
				}
			}
		}
	}
}

/* 动画 */
@keyframes rotate-disk {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
@keyframes rotate-disk1 {
	100% {
		transform: rotate(0deg);
	}
}
.spin {
	animation: rotate-disk 20s infinite normal linear;
	animation-play-state: play;
}
.noSpin {
	animation: rotate-disk 20s infinite normal linear;
	animation-play-state: paused;
}
.rotate {
	animation: rotate-disk1 0s infinite normal linear;
}
.pageMain .angle {
	transform: rotateZ(-2deg);
}
</style>
