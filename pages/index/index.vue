<template>
	<view class="home">
		<!-- 头部导航栏 -->
		<!-- #ifndef MP-WEIXIN -->
		<u-navbar  back-icon-name='' :background="{background: '#d83d34'}" height="0" class="navbar">
		 <!-- #endif -->
		</u-navbar>
		<!-- 整屏滑动头部 -->
		<view class="tabSwiper">
			<!-- #ifndef MP-WEIXIN -->
			<u-tabs-swiper
				ref="tabSwiper"
				:list="tabsSwiper"
				gutter="60"
				active-color="#fff"
				:show-bar="false"
				:current="current"
				font-size="36"
				swiperWidth="750"
				inactive-color="rgba(255,255,255,.8)"
				bg-color="#D83D34"
				@change="tabsChange"
			></u-tabs-swiper>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<u-tabs-swiper
				ref="tabSwiper"
				:list="tabsSwiper"
				gutter="60"
				active-color="#fff"
				:show-bar="false"
				:current="current"
				font-size="36"
				swiperWidth="750"
				inactive-color="#fff"
				bg-color="#D83D34"
				@change="tabsChange"
			></u-tabs-swiper>
			<!-- #endif -->
			<text class="iconfont icon-liebiao" @click="isLogIn = true"></text>
			<text class="iconfont icon-search" @click="goSearch"></text>
			<!-- 登录弹出层 -->
			<u-popup v-model="isLogIn" width="80%">
				<view class="loginText">手机电脑多端同步，尽享海量高品质音乐</view>
				<view class="loginBtn">
					立即登录
				</view>
				<view class="loginItem">
					<view class="text-icon">
						<view class="iconfont icon-news"></view>
						<view>我的消息</view>
					</view>
					<view class="text-icon">
						<view class="iconfont icon-Buddy"></view>
						<view>我的好友</view>
					</view>
					<view class="text-icon">
						<view class="iconfont icon-myHome"></view>
						<view>个人主页</view>
					</view>
					<view class="text-icon">
						<view class="iconfont icon-dressUp"></view>
						<view>个性装扮</view>
					</view>
				</view>
				<view class="loginList">
					<view v-for="(item,index) in loginItems" :key='index' class="loginList-item">
						<text :class="'iconfont '+item.icon"></text>
						<text style="margin-left: 18rpx;">{{item.name}}</text>
					</view>
				</view>
			</u-popup>
		</view>

		<!-- 整屏滑动页面 -->
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="swiper-box">
			<!-- 我的 -->
			<swiper-item class="mine">
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item"><mine></mine></scroll-view>
			</swiper-item>
			<!-- 发现页面 -->
			<swiper-item class="find">
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item">
					<!-- banner -->
					<swiper indicator-dots circular :autoplay="isAutoplay" :interval="5000" :duration="800">
						<swiper-item v-for="item in banner" :key="item.id" class="banner-item">
							<image lazy-load :src="item.imageUrl" style="width:93%;height:100%;border-radius:8px"></image>
							<view :class="item.titleColor === 'red' ? 'typeTitle1' : 'typeTitle2'">{{ item.typeTitle }}</view>
						</swiper-item>
					</swiper>
					<!-- nav导航 -->
					<view class="nav">
						<view class="nav-item" v-for="(item, index) in navList" :key="index" @click="goNewPage(item.text)">
							<view>
								<text :class="item.icon"></text>
								<text class="nav-item-date" v-if="item.text === '每日推荐'">{{ getDay }}</text>
							</view>
							<text>{{ item.text }}</text>
						</view>
					</view>
					<!-- 推荐歌单 -->
					<view class="recommend">
						<view class="recommend-head">
							<text class="head-title">{{ getTitle }}</text>
							<view
								class="head-btn"
								@touchstart="isHeadBtn = true"
								@touchend="isHeadBtn = false"
								:style="isHeadBtn === true ? 'background-color:rgba(0,0,0,.1)' : ''"
								@click="goSongListPage"
							>
								查看更多
							</view>
						</view>
						<view class="recommend-list">
							<scroll-view class="recommend-scroll" scroll-x>
								<view class="imgBox" v-for="item in songList" :key="item.id" @click="goPlaylistDetails(item.id)">
									<u-image :src="item.picUrl" mode="widthFix" width="100%" border-radius="7px"></u-image>
									<view class="playNumber">
										<text class="iconfont icon-bofang" style="font-size: 24rpx;"></text>
										{{ isPlayCount(item.playCount) }}
									</view>
									<view class="recommendSong-title">
										<text>{{ item.name }}</text>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
					<!-- 新歌 -->
					<view class="newSong">
						<view class="newSong-head"><text class="newSong-title">新歌来袭</text></view>
						<view class="newSong-list">
							<view
								class="newSong-list-item"
								v-for="(item, index) in newSongList"
								:key="item.id"
								@click="modifyInfo(newSongList, index)"
								@touchstart="newTouchstart(index)"
								@touchend="newSongBg = null"
								:style="index === newSongBg ? 'background-color:rgba(0,0,0,.1)' : ''"
							>
								<u-image :src="item.picUrl" mode="widthFix" width="120" border-radius="7px"></u-image>
								<view class="newSong-list-info">
									<view class="newSongName">
										<view>{{ item.name }}</view>
										<view>­­­­­­­­­­{{ item.singerName }}</view>
									</view>
									<u-icon class="newSongIcon1" name="volume" color="#d83d34" size="44" v-if="index === subscript"></u-icon>
									<view class="newSongIcon" v-else><u-icon name="play-right-fill" color="#d83d34" size="24"></u-icon></view>
								</view>
							</view>
						</view>
					</view>
					<view class="bColorBox"></view>
				</scroll-view>
			</swiper-item>
			<!-- 电台 -->
			<swiper-item class="radioStation">
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item"><view>电台页面</view></scroll-view>
			</swiper-item>
		</swiper>
		<u-toast ref="uToast" />
		<play-music></play-music>
	</view>
</template>

<script>
import playMusic from '@/myComponents/common/playMusic.vue';
import mine from '@/pages/mine/mine.vue';
import { mapMutations, mapState } from 'vuex';

export default {
	data() {
		return {
			isLogIn: false,
			loginItems:[
				{
					name:'听歌识曲',
					icon:'icon-learnMusic'
				},
				{
					name:'演出',
					icon:'icon-yanchu'
				},
				{
					name:'商城',
					icon:'icon-mall'
				},
				{
					name:'游戏推荐',
					icon:'icon-game'
				},
				{
					name:'附件的人',
					icon:'icon-accessory-person'
				},
				{
					name:'我的订单',
					icon:'icon-order'
				},
				{
					name:'扫一扫',
					icon:'icon-sao'
				},
				{
					name:'音乐闹钟',
					icon:'icon-clock'
				},
				{
					name:'优惠劵',
					icon:'icon-coupon'
				},
				{
					name:'夜间模式',
					icon:'icon-night'
				},
				{
					name:'设置',
					icon:'icon-site'
				},
				{
					name:'退出',
					icon:'icon-tuichu2'
				}
			],
			// 轮播图
			banner: [],
			// 全屏选项卡配置
			tabsSwiper: [{ name: '我的' }, { name: '发现' }, { name: '电台' }],
			// 默认页面
			current: 1,
			swiperCurrent: 1,
			//nav
			navList: [
				{
					icon: 'iconfont icon-recommend',
					text: '每日推荐'
				},
				{
					icon: 'iconfont icon-songList',
					text: '歌单'
				},
				{
					icon: 'iconfont icon-ranking',
					text: '排行榜'
				}
			],
			// 推荐歌单
			songList: [],
			songListTitle: ['人气歌单推荐', '懂你的精选歌单', '发现好歌单', '歌单精选站', '宝藏歌单,值得聆听'],
			// 判断查看更多按钮被点击了
			isHeadBtn: false,
			// 新歌列表
			newSongList: [],
			//新歌列表背景控制
			newSongBg: null
		};
	},
	components: {
		playMusic,
		mine
	},
	onLoad() {
		this.getFindData();
	},
	methods: {
		...mapMutations(['getIndex', 'getPlayList', 'getIsBtn']),

		// 获取发现页面数据
		getFindData() {
			this.getBanner();
			this.getSongList();
			this.getNewSong();
		},
		// 获取banner
		async getBanner() {
			const res = await this.$u.get('/banner', { t: Date.parse(new Date()) });
			// console.log(res);
			if (res.code !== 200) {
				return this.showToast();
			}
			this.banner = res.banners;
		},
		// 获取推荐歌单
		async getSongList() {
			const res = await this.$u.get('/personalized');
			if (res.code !== 200) {
				return this.showToast();
			}
			// console.log(res);
			// 随机获取6个不重复的推荐歌单
			let recommend = res.result;
			while (this.songList.length < 6) {
				let i = Math.floor(Math.random() * recommend.length);
				if (this.songList.indexOf(recommend[i]) < 0) {
					this.songList.push(recommend[i]);
				}
			}
		},
		// 获取新歌
		async getNewSong() {
			const res = await this.$u.get('/personalized/newsong', { t: Date.parse(new Date()) });
			console.log(res);
			if (res.code !== 200) {
				return this.showToast();
			}
			this.newSongList = res.result;
			for (let i = 0, length = this.newSongList.length; i < length; i++) {
				this.getMusicUrl(i);
				this.isArtists(this.newSongList[i].song.artists, i);
			}
		},
		// 获取音乐链接
		async getMusicUrl(i) {
			const res = await this.$u.get(`/song/url?id=${this.newSongList[i].id}`);
			if (res.code !== 200) {
				return this.showToast();
			}
			// console.log(res);
			this.newSongList[i].url = res.data[0].url;
		},
		// 获得要播放音乐的索引
		modifyInfo(list, index) {
			this.getIndex(index);
			this.getPlayList(list);
			if (!this.isBtn && this.$audio.src) {
				this.$audio.play();
			}
			if (this.$audio.src === this.playList[index].url) {
				uni.navigateTo({
					url: `../musicPage/musicPage`
				});
			}
			this.getIsBtn(true);
		},
		// 得到bg index
		newTouchstart(index) {
			this.newSongBg = index;
		},
		// 处理歌手名字
		isArtists(data, i) {
			let artists = data.map(item => {
				return item.name + '/';
			});
			artists = artists.join('');
			artists = artists.slice(0, artists.length - 1);
			return (this.newSongList[i].singerName = artists);
		},
		// 处理播放数
		isPlayCount(count) {
			return count > 100000 ? (count / 10000).toFixed() + '万' : count;
		},
		showToast() {
			this.$refs.uToast.show({
				title: '网络正在开小差,稍后自动刷新~',
				position: 'top',
				type: 'error',
				icon: false,
				url: 'pages/index/index'
			});
		},
		// 跳转搜索页面
		goSearch(){
			uni.navigateTo({
				url: `../search/search`
			});
		},
		// 跳转新页面
		goNewPage(text) {
			if (text == '歌单') {
				return this.goSongListPage();
			}
		},
		// 跳转歌单页面
		goSongListPage() {
			uni.navigateTo({
				url: `../songListPage/songListPage`
			});
		},
		// 去歌单详情页
		goPlaylistDetails(id) {
			uni.navigateTo({
				url: `../songListPage/playlistDetails/playlistDetails?id=${id}`
			});
		},
		//整屏滑动 swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.tabSwiper.setDx(dx);
		},
		//整屏滑动 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.tabSwiper.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		},
		//整屏滑动 tabs通知swiper切换
		tabsChange(index) {
			this.swiperCurrent = index;
		}
	},
	computed: {
		// 控制banner的自动播放
		isAutoplay() {
			if (this.swiperCurrent !== 1) {
				return false;
			}
			return true;
		},
		// 获得现在是几日
		getDay() {
			let nowDate = new Date();
			return nowDate.getDate();
		},
		// 获得随机标题
		getTitle() {
			return this.songListTitle[Math.floor(Math.random() * 5)];
		},
		...mapState(['isBtn', 'playList', 'subscript'])
	}
};
</script>

<style lang="scss" scoped>
$bColor: #d83d34;
.navbar {
	/deep/ .u-border-bottom:after {
		border-bottom-width: 0px;
	}
}
.tabSwiper {
	margin-top: -1px;

	/deep/ .u-tabs-scroll-box {
		text-align: center;
		height: 90rpx;
		line-height: 90rpx;
	}
	.icon-liebiao {
		position: absolute;
		top: 17rpx;
		/* #ifdef APP-PLUS */
		top: 4.5%;
		/* #endif */
		left: 35rpx;
		color: #fff;
		font-size: 44rpx;
		z-index: 99;
	}
	.icon-search {
		position: absolute;
		top: 17rpx;
		/* #ifdef APP-PLUS */
		top: 4.5%;
		/* #endif */
		right: 35rpx;
		color: #fff;
		font-size: 44rpx;
		z-index: 99;
	}
	.loginText{
		margin: 40rpx 0 25rpx 0;
		font-size: 24rpx;
		text-align: center;
	}
	.loginBtn{
		margin: 0 auto;
		width: 200rpx;
		height: 52rpx;
		color: #fff;
		text-align: center;
		line-height: 50rpx;
		background-color: $bColor;
		border-radius: 20px;
	}
	.loginItem{
		margin: 40rpx 0;
		display: flex;
		justify-content: space-around;
		width: 100%;
		font-size: 24rpx;
		.text-icon{
			text-align: center;
		}
		.text-icon view:nth-child(1) {
			font-size: 44rpx;
			color: $bColor;
		}
	}
	.loginList{
		font-size: 34rpx;
		padding-left: 28rpx;
		.loginList-item{
			margin-bottom: 40rpx;
		}
		.iconfont{
			font-size: 34rpx;
		}
	}
}
.banner-item {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	.typeTitle1 {
		position: absolute;
		bottom: 0;
		right: 26rpx;
		color: #fff;
		font-size: 24rpx;
		padding: 10rpx 20rpx;
		// font-weight: 500;
		border-radius: 8px 0 8px 0;
		background-color: rgba($color: $bColor, $alpha: 0.9);
	}
	.typeTitle2 {
		position: absolute;
		bottom: 0;
		right: 26rpx;
		color: #fff;
		font-size: 24rpx;
		padding: 10rpx 20rpx;
		border-radius: 8px 0 8px 0;
		background-color: rgba($color: #4b8bcb, $alpha: 0.9);
	}
}

.nav {
	position: relative;
	display: flex;
	margin: 26rpx 0 32rpx 0;
	justify-content: space-around;
	.nav-item {
		display: flex;
		flex-flow: column;
		justify-content: space-around;
		align-items: center;
		width: 140rpx;
		height: 132rpx;
		// text-align: center;
		text {
			font-size: 24rpx;
		}
		view {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			background-color: $bColor;
			.iconfont {
				font-size: 52rpx;
				color: #fff;
			}
			.nav-item-date {
				margin-top: 3px;
				position: absolute;
				// top: 0;
				font-size: 24rpx;
				color: $bColor;
				font-weight: 800;
				z-index: 9;
			}
		}
	}
}
.recommend {
	display: flex;
	flex-flow: column;
	justify-content: space-between;
	align-items: center;
	height: 360rpx;
	.recommend-head {
		width: 697.5rpx;
		.head-title {
			float: left;
			font-size: 38rpx;
			font-weight: 800;
		}
		.head-btn {
			float: right;
			width: 130rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			font-size: 24rpx;
			color: #555;
			border: 1px solid #ccc;
			border-radius: 25px;
		}
	}
	.recommend-list {
		width: 100%;
		.recommend-scroll {
			width: 100%;
			white-space: nowrap;
			position: relative;
			.imgBox {
				margin-left: 26.5rpx;
				position: relative;
				display: inline-block;
				width: 208rpx;
				.playNumber {
					padding: 4rpx 10rpx;
					position: absolute;
					top: 0;
					right: 0;
					font-size: 24rpx;
					color: #fff;
				}
			}
			.imgBox:last-child {
				margin-right: 26.5rpx;
			}
			.recommendSong-title {
				position: relative;
				width: 100%;
				height: 68rpx;
				font-size: 24rpx;
				overflow: hidden;
				white-space: normal;
				word-wrap: break-word;
				word-break: break-all; /* break-all(允许在单词内换行。) */
				text-overflow: ellipsis; /* 超出部分省略号 */
				display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
				-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
				-webkit-line-clamp: 2; /** 显示的行数 **/
			}
		}
	}
}
.newSong {
	margin: 40rpx 26.5rpx 160rpx 26.5rpx;
	.newSong-head {
		margin-bottom: 20rpx;
		.newSong-title {
			font-size: 34rpx;
			font-weight: 800;
		}
	}
	.newSong-list {
		.newSong-list-item {
			display: flex;
			margin-bottom: 28rpx;
			border-radius: 7px;
			height: 120rpx;
			.newSong-list-info {
				position: relative;
				flex: 1;
				display: flex;
				// flex-flow: column;
				line-height: 50rpx;
				margin-left: 22rpx;
				padding-top: 8rpx;
				.newSongIcon {
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-55%);
					display: flex;
					justify-content: center;
					align-items: center;
					padding-left: 5rpx;
					// padding-bottom: 2rpx;
					width: 46rpx;
					height: 46rpx;
					border-radius: 50%;
					border: 1px solid #e3e3e3;
				}
				.newSongIcon1 {
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-55%);
				}
				.newSongName view:nth-child(1) {
					font-size: 30rpx;
					font-weight: 600;
					width: 440rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.newSongName view:nth-child(2) {
					width: 440rpx;
					font-size: 24rpx;
					color: #777;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}
}

.bColorBox {
	position: absolute;
	top: -2px;
	width: 100%;
	height: 100px;
	background-color: $bColor;
	z-index: -1;
}

.home {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.swiper-box {
	flex: 1;
}
.swiper-item {
	height: 100%;
}
</style>
