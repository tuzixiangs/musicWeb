<template>
	<view class="songListPage">
		<u-navbar
			:background="{ backgroundColor: '#d83d34' }"
			back-icon-color="#fff"
			back-icon-size="38"
			back-text="歌单广场"
			:back-text-style="{ color: '#fff', fontSize: '34rpx', marginLeft: '10rpx' }"
		></u-navbar>

		<!-- 整屏滑动头部 -->
		<view class="tabSwiper">
			<u-tabs-swiper
				ref="tabSwiper"
				:list="tabsSwiper"
				gutter="65"
				:current="current"
				active-color="#D83D34"
				font-size="28"
				swiperWidth="750"
				bar-width="60"
				@change="tabsChange"
			></u-tabs-swiper>
		</view>

		<!-- 整屏滑动页面 -->
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="swiper-box">
			<!-- 推荐歌单 -->
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item" v-if="recommendList.length !== 0" @scrolltolower="onreachBottom">
					<view class="imgBox" v-for="item in recommendList" :key="item.id" @click="goPlaylistDetails(item.id)">
						<u-image :src="item.picUrl" mode="widthFix" width="100%" height="100%" border-radius="7px"></u-image>
						<view class="playNumber">
							<text class="iconfont icon-bofang" style="font-size: 24rpx;"></text>
							{{ isPlayCount(item.playCount) }}
						</view>
						<view class="recommendSong-title">
							<text>{{ item.name }}</text>
						</view>
					</view>
					<u-divider style="margin-bottom: 20rpx ;">到底啦</u-divider>
				</scroll-view>
			</swiper-item>
			<!-- 官方 -->
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item" v-if="officialList.length !== 0" @scrolltolower="onreachBottom">
					<view class="imgBox" v-for="item in officialList" :key="item.id" @click="goPlaylistDetails(item.id)">
						<u-image :src="item.coverImgUrl" mode="widthFix" width="100%" height="100%" border-radius="7px"></u-image>
						<view class="playNumber">
							<text class="iconfont icon-bofang" style="font-size: 24rpx;"></text>
							{{ isPlayCount(item.playCount) }}
						</view>
						<view class="recommendSong-title">
							<text>{{ item.name }}</text>
						</view>
					</view>
					<u-divider v-if="showDivider">到底啦</u-divider>
				</scroll-view>
			</swiper-item>
			<!-- 精品 -->
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item" v-if="boutiqueList.length !== 0" @scrolltolower="onreachBottom">
					<view class="imgBox" v-for="item in boutiqueList" :key="item.id" @click="goPlaylistDetails(item.id)">
						<u-image :src="item.coverImgUrl" mode="widthFix" width="100%" height="100%" border-radius="7px"></u-image>
						<view class="playNumber">
							<text class="iconfont icon-bofang" style="font-size: 24rpx;"></text>
							{{ isPlayCount(item.playCount) }}
						</view>
						<view class="recommendSong-title">
							<text>{{ item.name }}</text>
						</view>
					</view>
					<u-divider v-if="showDivider">到底啦</u-divider>
				</scroll-view>
			</swiper-item>
			<!-- 华语 -->
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item" v-if="chineseList.length !== 0" @scrolltolower="onreachBottom">
					<view class="imgBox" v-for="item in chineseList" :key="item.id" @click="goPlaylistDetails(item.id)">
						<u-image :src="item.coverImgUrl" mode="widthFix" width="100%" height="100%" border-radius="7px"></u-image>
						<view class="playNumber">
							<text class="iconfont icon-bofang" style="font-size: 24rpx;"></text>
							{{ isPlayCount(item.playCount) }}
						</view>
						<view class="recommendSong-title">
							<text>{{ item.name }}</text>
						</view>
					</view>
					<u-divider v-if="showDivider">到底啦</u-divider>
				</scroll-view>
			</swiper-item>
			<!-- 欧美 -->
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item" v-if="occidentList.length !== 0" @scrolltolower="onreachBottom">
					<view class="imgBox" v-for="item in occidentList" :key="item.id" @click="goPlaylistDetails(item.id)">
						<u-image :src="item.coverImgUrl" mode="widthFix" width="100%" height="100%" border-radius="7px"></u-image>
						<view class="playNumber">
							<text class="iconfont icon-bofang" style="font-size: 24rpx;"></text>
							{{ isPlayCount(item.playCount) }}
						</view>
						<view class="recommendSong-title">
							<text>{{ item.name }}</text>
						</view>
					</view>
					<u-divider v-if="showDivider">到底啦</u-divider>
				</scroll-view>
			</swiper-item>
			<!-- 摇滚 -->
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item" v-if="rockList.length !== 0" @scrolltolower="onreachBottom">
					<view class="imgBox" v-for="item in rockList" :key="item.id" @click="goPlaylistDetails(item.id)">
						<u-image :src="item.coverImgUrl" mode="widthFix" width="100%" height="100%" border-radius="7px"></u-image>
						<view class="playNumber">
							<text class="iconfont icon-bofang" style="font-size: 24rpx;"></text>
							{{ isPlayCount(item.playCount) }}
						</view>
						<view class="recommendSong-title">
							<text>{{ item.name }}</text>
						</view>
					</view>
					<u-divider v-if="showDivider">到底啦</u-divider>
				</scroll-view>
			</swiper-item>
			<!-- ACG -->
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item" v-if="ACGList.length !== 0" @scrolltolower="onreachBottom">
					<view class="imgBox" v-for="item in ACGList" :key="item.id" @click="goPlaylistDetails(item.id)">
						<u-image :src="item.coverImgUrl" mode="widthFix" width="100%" height="100%" border-radius="7px"></u-image>
						<view class="playNumber">
							<text class="iconfont icon-bofang" style="font-size: 24rpx;"></text>
							{{ isPlayCount(item.playCount) }}
						</view>
						<view class="recommendSong-title">
							<text>{{ item.name }}</text>
						</view>
					</view>
					<u-divider v-if="showDivider">到底啦</u-divider>
				</scroll-view>
			</swiper-item>
			<!-- 轻音乐 -->
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;" class="swiper-item" v-if="lightMusic.length !== 0" @scrolltolower="onreachBottom">
					<view class="imgBox" v-for="item in lightMusic" :key="item.id" @click="goPlaylistDetails(item.id)">
						<u-image :src="item.coverImgUrl" mode="widthFix" width="100%" height="100%" border-radius="7px"></u-image>
						<view class="playNumber">
							<text class="iconfont icon-bofang" style="font-size: 24rpx;"></text>
							{{ isPlayCount(item.playCount) }}
						</view>
						<view class="recommendSong-title">
							<text>{{ item.name }}</text>
						</view>
					</view>
					<u-divider v-if="showDivider">到底啦</u-divider>
				</scroll-view>
			</swiper-item>
		</swiper>
		<play-music></play-music>
	</view>
</template>

<script>
import playMusic from '@/myComponents/common/playMusic.vue';
export default {
	data() {
		return {
			tabsSwiper: [{ name: '推荐' }, { name: '官方' }, { name: '精品' }, { name: '华语' }, { name: '欧美' }, { name: '摇滚' }, { name: 'ACG' }, { name: '轻音乐' }],
			current: 0,
			swiperCurrent: 0,
			// 歌单
			recommendList: [],
			officialList: [],
			boutiqueList: [],
			chineseList: [],
			occidentList: [],
			rockList: [],
			ACGList: [],
			lightMusic: [],
			// 页数
			offset: 1,
			before: 0,
			total: {
				official: '',
				boutique: '',
				chinese: '',
				occident: '',
				rock: '',
				ACG: '',
				light: ''
			},
			showDivider: false,
			
		};
	},
	components: {
		playMusic
	},
	onLoad() {
		uni.showLoading({
			title: '努力加载中~',
			mask: true
		});
	},
	mounted() {
		if (this.current === 0) {
			this.getRecommendList();
		}
	},
	methods: {
		// 获取推荐歌单
		async getRecommendList() {
			const res = await this.$u.get('/personalized?limit=36');
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~请稍后再试');
			}
			// console.log(res);
			this.recommendList = res.result;
		},
		async getList() {
			const res = await this.$u.get(`top/playlist?cat=${this.tabsSwiper[this.current].name}&limit=24&offset=${this.offset}`);
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~请稍后再试');
			}
			console.log(res);
			switch (this.current) {
				case 1:
					this.officialList = [...this.officialList, ...res.playlists];
					if (this.total.official) return;
					this.total.official = res.total;
					return;
				case 3:
					this.chineseList = [...this.chineseList, ...res.playlists];
					if (this.total.chinese) return;
					this.total.chinese = res.total;
					return;
				case 4:
					this.occidentList = [...this.occidentList, ...res.playlists];
					if (this.total.occident) return;
					this.total.occident = res.total;
					return;
				case 5:
					this.rockList = [...this.rockList, ...res.playlists];
					if (this.total.rock) return;
					this.total.rock = res.total;
					return;
				case 6:
					this.ACGList = [...this.ACGList, ...res.playlists];
					if (this.total.ACG) return;
					this.total.ACG = res.total;
					return;
				case 7:
					this.lightMusic = [...this.lightMusic, ...res.playlists];
					if (this.total.light) return;
					this.total.light = res.total;
					return;
			}
			
		},
		async getBoutiqueList() {
			const res = await this.$u.get(`/top/playlist/highquality?before=${this.before}&limit=24`);
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~请稍后再试');
			}
			console.log(res);
			this.boutiqueList = [...this.boutiqueList, ...res.playlists];
			if (res.playlists.length < 24) return;
			this.before = res.playlists[23].updateTime;
			if (this.total.boutique) return;
			this.total.boutique = res.total;
		},
		// scroll-view到底部加载更多
		onreachBottom() {
			
			console.log('到底了');
			// if(this.current===0) return;
			if (this.current === 2) {
				if (this.total.boutique <= this.boutiqueList.length) return;
				return this.getBoutiqueList();
			}
			this.offset += 24;
			switch (this.current) {
				case 1:
					if (this.total.official <= this.offset * 24) {
						return (this.showDivider = true);
					}
					return this.getList();
				case 3:
					if (this.total.chinese <= this.offset * 24) {
						return (this.showDivider = true);
					}
					return this.getList();
				case 4:
					if (this.total.occident <= this.offset * 24) {
						return (this.showDivider = true);
					}
					return this.getList();
				case 5:
					if (this.total.rock <= this.offset * 24) {
						return (this.showDivider = true);
					}
					return this.getList();
				case 6:
					if (this.total.ACGList <= this.offset * 24) {
						return (this.showDivider = true);
					}
					return this.getList();
				case 7:
					if (this.total.lightMusic <= this.offset * 24) {
						return (this.showDivider = true);
					}
					return this.getList();
			}
		},
		// 去歌单详情页
		goPlaylistDetails(id){
			uni.navigateTo({
				url:`playlistDetails/playlistDetails?id=${id}`
			})
		},
		// 处理播放数
		isPlayCount(count) {
			return count > 100000 ? (count / 10000).toFixed() + '万' : count;
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
		isList() {
			switch (this.current) {
				case 0:
					return this.recommendList;
				case 1:
					return this.officialList;
				case 2:
					return this.boutiqueList;
				case 3:
					return this.chineseList;
				case 4:
					return this.occidentList;
				case 5:
					return this.rockList;
				case 6:
					return this.ACGList;
				case 7:
					return this.lightMusic;
			}
		}
	},
	watch: {
		current() {
			this.isList;
			this.offset = 1;
			this.showDivider = false;
			if (this.isList.length !== 0) return;
			uni.showLoading({
				title: '努力加载中~'
			});
			if (this.tabsSwiper[this.current].name === '精品') {
				return this.getBoutiqueList();
			}
			this.getList();
			// console.log(1);
		}
	}
};
</script>

<style lang="scss" scoped>
.songListPage {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
	.tabSwiper {
		position: relative;
		margin-bottom: 20rpx;
	}
	.imgBox {
		margin-left: 31rpx;
		margin-bottom: 32rpx;
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
.swiper-box {
	flex: 1;
}
.swiper-item {
	// padding: 40rpx 0;
}
</style>
