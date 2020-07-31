<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar
			class="navbar"
			:background="{ backgroundColor: '#D83D34' }"
			back-icon-color="#fff"
			back-icon-size="38"
			back-text="歌单"
			:back-text-style="{ color: '#fff', fontSize: '34rpx', marginLeft: '10rpx' }"
		></u-navbar>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN-->
		<u-navbar
			class="navbar"
			:background="{ backgroundColor: '0' }"
			back-icon-color="#fff"
			back-icon-size="38"
			back-text="歌单"
			:back-text-style="{ color: '#fff', fontSize: '34rpx', marginLeft: '10rpx' }"
		></u-navbar>
		<!-- #endif -->
		<view v-if="playlistDetails" class="scroll">
			<!-- 歌单信息 -->
			<view class="playListInfo">
				<image :src="playlistDetails.coverImgUrl" class="img" mode="widthFix"></image>
				<view class="playListName">{{ playlistDetails.name }}</view>
			</view>
			<!-- 歌单列表 -->
			<scroll-view scroll-y class="popup" @scrolltolower="onreachBottom">
				<view class="song-list">
					<view class="song-list-item" v-for="(item, index) in songList" :key="item.id" @click="modifyInfo(songList,index)"
					@touchstart="newTouchstart(index)" @touchend="songBg = null" :style="index === songBg ? 'background-color:rgba(0,0,0,.1)' : ''"
					>
						<view class="song-list-info">
							<view class="songName">
								<view>{{ item.name }} <text v-if="item.alia.length!==0" style="color: #666;">({{item.alia[0]}})</text></view>
								<view>­­­­­­­­­­{{ item.singerName + ' - ' +item.name}}</view>
							</view>
							<u-icon class="songIcon1" name="volume" color="#d83d34" size="44" v-if="index===subscript"></u-icon>
							<view class="songIcon" v-else>
								<u-icon name="play-right-fill" color="#d83d34" size="24"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<play-music></play-music>
	</view>
</template>

<script>
import playMusic from '@/myComponents/common/playMusic.vue';
import {mapMutations,mapState} from 'vuex'

export default {
	data() {
		return {
			// 歌单ID
			id: null,
			playlistDetails: null,
			isPopup: true,
			trackIds:[],
			musicId:'',
			start:0,
			end:50,
			PlaysList:[],
			songList:[],
			songBg:null,
			
		};
	},
	onLoad(option) {
		uni.showLoading({
			title: '努力加载中~',
			mask: false
		});
		this.id = option.id;
		this.getPlaylistDetails();
	},
	components: {
		playMusic
	},
	methods: {
		...mapMutations(['getIndex','getPlayList','getIsBtn']),
		// 获得歌单数据
		async getPlaylistDetails() {
			const res = await this.$u.get(`/playlist/detail?id=${this.id}`);
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~稍后再试!');
			}
			this.playlistDetails = res.playlist;
			this.trackIds = res.playlist.trackIds.map(item =>{
				return item.id;
			})
			if(this.trackIds.length>50){
				this.musicId = this.trackIds.slice(this.start,this.end).join(',')
			}else{
				this.musicId = this.trackIds.join(',');
			}
			this.getSongDetail()
			
			// console.log(this.musicId);
		},
		// 获取音乐详情
		async getSongDetail(){
			const res = await this.$u.get(`/song/detail?ids=${this.musicId}`)
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~稍后再试!');
			}
			this.playsList = res.songs;
			this.playsList.map((item,index)=>{
				item.singerName = this.isArtists(item.ar)
				item.picUrl = item.al.picUrl
				return 
			})
			this.getSongUrl()
			// console.log(this.playList);
			this.songList = [...this.songList,...this.playsList];
			console.log(this.songList);
		},
		// 获取音乐链接
		async getSongUrl(){
			const res = await this.$u.get(`/song/url?id=${this.musicId}`)
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~稍后再试!');
			}
			console.log(res);
			this.playsList.map(item =>{
				res.data.map(i => {
					if(item.id === i.id){
						return item.url = i.url
					}
				})
			})
		},
		// 获得要播放音乐的索引
		modifyInfo(list,index) {
			this.getIndex(index);
			this.getPlayList(list);
			if(!this.isBtn && this.$audio.src){
				this.$audio.play();
			}
			if(this.$audio.src===this.playList[index].url){
				uni.navigateTo({
					url:`../../musicPage/musicPage`
				})
			}
			this.getIsBtn(true);
		},
		// 得到bg index
		newTouchstart(index){
			this.songBg = index;
		},
		// 处理歌手名字
		isArtists(data) {
			let artists = data.map(item => {
				return item.name + '/';
			});
			artists = artists.join('');
			artists = artists.slice(0, artists.length - 1);
			return artists;
		},
		// scroll-view到底部加载更多
		onreachBottom() {
			if(this.trackIds.length<=this.songList.length) return;
			this.start += 50;
			this.end += 50;
			if(this.trackIds.length>this.end){
				this.musicId = this.trackIds.slice(this.start,this.end).join(',')
				this.getSongDetail()
			}else{
				this.musicId = this.trackIds.slice(this.start).join(',');
				this.getSongDetail()
			}
			console.log("到底了");
		}
	},
	computed:{
		...mapState(['isBtn','playList','subscript'])
	}
};
</script>

<style lang="scss" scoped>
.navbar {
	/deep/ .u-border-bottom:after {
		border-bottom-width: 0px;
	}
}
.playListInfo {
	position: relative;
	/* #ifndef MP-WEIXIN */
	margin-top: -88rpx;
	/* #endif */
	.img {
		width: 100%;
	}
	.playListName {
		position: absolute;
		width: 90%;
		margin-left: 40rpx;
		top: 330rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
		overflow: hidden;
		text-overflow: ellipsis; 
		white-space: nowrap;
	}
}
.scroll {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.popup {
	position: absolute;
	top: calc(30vh - var(--window-top));
	 /* #ifdef MP-WEIXIN */
	top: calc(40vh - var(--window-top));
	 /* #endif */
	width: 100%;
	height: 80%;
	background-color: #fff;
	padding: 20rpx;
	border-radius: 30rpx 30rpx 0 0;
	box-sizing: border-box;
}
.song-list {
		.song-list-item {
			display: flex;
			margin-bottom: 20rpx;
			border-radius: 7px;
			height: 120rpx;
			.song-list-info {
				position: relative;
				flex: 1;
				display: flex;
				// flex-flow: column;
				line-height: 50rpx;
				margin-left: 22rpx;
				padding-top: 8rpx;
				.songIcon {
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
				.songIcon1 {
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-55%);
				}
				.songName view:nth-child(1) {
					font-size: 30rpx;
					font-weight: 600;
					width: 440rpx;
					overflow: hidden;
					white-space:nowrap;
					text-overflow: ellipsis;
				}
				.songName view:nth-child(2) {
					width: 440rpx;
					font-size: 24rpx;
					color: #777;
					overflow: hidden;
					white-space:nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>
