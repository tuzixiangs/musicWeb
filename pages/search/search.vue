<template>
	<view class='search'>
		<!-- 头部导航栏 -->
		<u-navbar back-icon-color="#fff" back-icon-size="40" :background="{background: '#d83d34'}">
			<view class="slot-wrap">
				<u-search @search="getSearch" :show-action="false" color="rgba(255,255,255,.9)" placeholder-color="rgba(255,255,255,.5)" bg-color="" search-icon="" :placeholder="defaultSearch" v-model="search"></u-search>
				<text class="iconfont icon-singer"></text>
			</view>
		</u-navbar>
		<!-- 热搜榜 -->
		<view class="hotSearch" v-if="searchResult===null">
			<view class="hotSearch-title">
				热搜榜
			</view>
			<view 
			class="hotSearch-itme" 
			:class="hotSearchBg === index ? 'hotSearchBg' : ''"
			v-for="(item,index) in hotSearch" 
			:key='item.score' 
			@click="searchClick(item.searchWord)"
			@touchstart="touchstart(index)"
			@touchend="touchend">
				<view class="item-index" :class="index<3 ? 'top-threeC' : ''">{{index+1}}</view>
				<view class="item-info">
					<view class="item-name" :class="index<3 ? 'top-three' : ''">
						{{item.searchWord}}
						<image :src="item.iconUrl" v-if="item.iconUrl!==null" mode="widthFix" class='item-icon'></image>
					</view>
					<view class="item-content">{{item.content}}</view>
				</view>
				<view class="item-score">{{item.score}}</view>
			</view>
		</view>
		
		<view class="song-list" v-else>
			<view class="song-list-head">
				<u-icon name="play-circle" color="#333" size="36" style="margin-right: 15rpx;"></u-icon>
				播放全部
			</view>
			<view 
			class="song-list-item" 
			:class="hotSearchBg === index ? 'hotSearchBg' : ''"
			v-for="(item, index) in searchResult" 
			:key="item.id"
			@touchstart="touchstart(index)" 
			@touchend="touchend" 
			@click="goPlayMusic(searchResult,index)">
				<view class="song-list-info">
					<view class="songName">
						<view>
						{{ item.name }}
						 <text v-if="item.alias.length!==0" style="color: #666;">({{item.alias[0]}})</text>
						 </view>
						<view>­­­­­­­­­­{{ item.singerName + ' - ' +item.name}}</view>
					</view>
				</view>
				<text class="iconfont icon-gengduo"></text>
			</view>
		</view>
		<play-music></play-music>
	</view>
</template>

<script>
import playMusic from '@/myComponents/common/playMusic.vue';
import {mapMutations,mapState} from 'vuex';
	
export default {
	data() {
		return {
			search:'',
			defaultSearch:'输入要搜索的歌曲名称',
			realkeyword:'',
			hotSearch:[],
			// 控制背景
			hotSearchBg:'',
			// 搜索结果
			searchResult:null,
		};
	},
	components: {
		playMusic
	},
	onLoad(){
		this.getSearchDefault();
		this.getHotSearch();
	},
	methods:{
		...mapMutations(['getIndex','getPlayList','getIsBtn']),
		// 获得默认搜索词
		async getSearchDefault(){
			const res = await this.$u.get('/search/default');
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~稍后再试!');
			}
			// console.log(res);
			this.defaultSearch = res.data.showKeyword;
			this.realkeyword = res.data.realkeyword;
		},
		// 获取热搜排行榜
		async getHotSearch(){
			const res = await this.$u.get('/search/hot/detail');
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~稍后再试!');
			}
			// console.log(res);
			this.hotSearch = res.data;
		},
		// 搜索触发事件
		getSearch(){
			if(this.search === ''){
				this.search = this.realkeyword;
			}
			this.getSongs();
		},
		searchClick(item){
			this.search = item;
			this.getSongs()
		},
		// 搜索歌曲
		async getSongs(){
			const res = await this.$u.get(`/search?keywords=${this.search}`)
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~稍后再试!');
			}
			console.log(res);
			res.result.songs.map(async (item,index)=>{
				item.singerName = this.isArtists(item.artists)
				item.picUrl = await this.getSongInfo(item.id)
				item.url = await this.getSongUrl(item.id)
				return 
			})
			this.searchResult = res.result.songs;
		},
		// 获取歌曲详情
		async getSongInfo(id){
			const res = await this.$u.get(`/song/detail?ids=${id}`)
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~稍后再试!');
			}
			
			return res.songs[0].al.picUrl
		},
		// 获取歌曲url
		async getSongUrl(id){
			const res = await this.$u.get(`/song/url?id=${id}`)
			if (res.code !== 200) {
				return this.$u.toast('网络正在开小差~稍后再试!');
			}
			return res.data[0].url
		},
		// 去歌曲页面
		goPlayMusic(list,i){
			if(this.searchResult[i].url==null){
				return this.$u.toast('暂时无法播放，换一首吧');
			}
			this.getIndex(i);
			this.getPlayList(list);
			if (!this.isBtn && this.$audio.src) {
				this.$audio.play();
			}
			uni.navigateTo({
				url: `/pages/musicPage/musicPage`
			});
			this.getIsBtn(true);
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
		// 触摸事件
		touchstart(index){
			this.hotSearchBg=index;
		},
		touchend(){
			this.hotSearchBg='';
		}
	},
	computed:{
		...mapState(['isBtn','playList','subscript'])
	}
};
</script>

<style lang="scss" scoped>
	$bColor: #d83d34;
	.slot-wrap{
		width: 85%;
		/deep/.u-content{
			border-radius: 0 !important;
			padding: 0;
			border-bottom: 1px solid rgba($color: #fff, $alpha: .5);
		}
	}
	.icon-singer{
		position: absolute;
		color: #fff;
		font-size: 40rpx;
		right: 38rpx;
		top: 50%;
		transform: translateY(-50%);
	}
	.hotSearch{
		margin-top: 30rpx;
		.hotSearch-title{
			font-weight: 600;
			margin-left: 30rpx;
		}
	}
	.hotSearch-itme{
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 120rpx;
		.item-index{
			margin: 0 30rpx;
		}
		.item-score{
			font-size: 24rpx;
			color: #666;
			margin-right: 30rpx;
		}
		.item-info{
			width: 500rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			.item-name{
				display: flex;
				align-items: center;
				color: #333;
				font-size: 28rpx;
			}
			.item-icon{
				margin-left: 12rpx;
				width: 60rpx;
				height: 60rpx;
			}
			.item-content{
				font-size: 24rpx;
				color: #666;
			}
		}
	}
	.song-list {
		.song-list-head{
			margin:20rpx 0 24rpx 34rpx;
			font-size: 32rpx;
			line-height: 32rpx;
		}
		.song-list-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 120rpx;
			.song-list-info {
				line-height: 50rpx;
				margin-left: 48rpx;
				padding-top: 8rpx;
				width: 600rpx;
				overflow: hidden;
				white-space:nowrap;
				text-overflow: ellipsis;
				.songName view:nth-child(1) {
					font-size: 28rpx;
					font-weight: 600;
					overflow: hidden;
					white-space:nowrap;
					text-overflow: ellipsis;
				}
				.songName view:nth-child(2) {
					font-size: 24rpx;
					color: #777;
					overflow: hidden;
					white-space:nowrap;
					text-overflow: ellipsis;
				}
			}
		}
		.icon-gengduo{
			margin-right: 40rpx;
			color: #666;
		}
	}
	.top-three{
		font-weight: 600;
	}
	.top-threeC{
		color: $bColor;
	}
	.hotSearchBg{
		background-color:rgba(0,0,0,.1);
	}
	
</style>
