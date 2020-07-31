<template name="Mine">
	<view class="mine">
		<!-- user info -->
		<view class="mine-user">
			<view class="user-info">
				<view class="user-ico"><text class="user-icon text-black iconfont icon-yonghu"></text></view>
				<view class="user-msg">登录立享手机电脑多端同步</view>
			</view>
			<view class="user-login" style="font-size: 24rpx;padding: 6rpx;">立即登录</view>
		</view>
		<!-- user category -->
		<view class="user-category">
			<view class="cate-class" v-for="(item, index) in cateList" :key="index">
				<text class="cate-icon text-black" :class="'iconfont '+item.icon"></text>
				<view class="cate-name">{{ item.title }}</view>
			</view>
		</view>
		<!-- my new -->
		<view class="user-new-title">
			<view class="new-title">我的音乐</view>
			<text class="new-title-icon text-black"></text>
		</view>
		<view class="mine-new-card">
			<view class="new-card">
				<text class="new-card-icon iconfont icon-like1"></text>
				<view class="new-msg">我喜欢的音乐</view>
			</view>
			<view class="new-card">
				<text class="new-card-icon iconfont icon-fm"></text>
				<view class="new-msg">私人FM</view>
				<view class="new-bott">你的私人曲库</view>
			</view>
			<view class="new-card">
				<text class="new-card-icon iconfont icon-FM"></text>
				<view class="new-msg">最嗨电音</view>
				<view class="new-bott">专业电音平台</view>
			</view>
		</view>
		<!-- 最近播放 -->
		<view class="user-new-title">
			<view class="new-title">最近播放</view>
			<text class="new-title-icon text-black"></text>
		</view>
		<view class="res-play">
			<image src="http://p2.music.126.net/JRNj03dPHidbM4jQ-HFK0A==/18826937604631903.jpg?param=200y200" mode=""></image>
			<view class="res-title">
				<view class="res-name">全部已播歌曲</view>
				<view class="res-num">3首</view>
			</view>
		</view>
		<!-- 创建歌单 -->
		<view class="user-new-title">
			<view class="new-title">创建歌单 0</view>
			<view class="new-coll">收藏歌单 0</view>
			<text class="new-title-icon text-black cuIcon-moreandroid"></text>
		</view>
		<view class="mine-create"><view class="create">+ &nbsp;&nbsp;&nbsp;导入外部歌单</view></view>
		
		<!-- last -->
		<view class="last">到底啦&nbsp;~</view>
	</view>
</template>

<script>
export default {
	name: 'Mine',
	props: {},
	data() {
		return {
			cateList: [
				{
					id: 0,
					title: '本地音乐',
					icon: 'icon-yinyueclick'
				},
				{
					id: 1,
					title: '下载管理',
					icon: 'icon-xiazaiguanli_xiazaizhong_'
				},
				{
					id: 2,
					title: '我的电台',
					icon: 'icon-diantai'
				},
				{
					id: 3,
					title: '我的收藏',
					icon: 'icon-shoucang'
				},
				{
					id: 4,
					title: '关注新歌',
					icon: 'icon-xinge'
				}
			],
		};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.mine{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.mine .mine-user{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 100upx;
}
.mine-user .user-info{
	display: flex;
	align-items: center;
	justify-content: center;
}
.mine-user .user-ico{
	margin-left: 45upx;
	width: 100upx;
	height: 100upx;
	border-radius: 50%;
	background-color: #c0c0c0;
	text-align: center;
	line-height: 110upx;
}
.user-info .user-icon{
	font-size: 36px;
	color: #666;
}
.mine-user .user-msg{
	margin-left: 25upx;
	font-size: 12px;
}
.mine-user .user-login{
	
	margin: 35upx;
	border: 1px solid #c0c0c0;
	border-radius: 10px;
}
.user-category{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 60upx;
	padding: 0 25upx;
}
.user-category .cate-class{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.cate-class .cate-icon{
	font-size: 28px;
	color: #444;
}
.cate-class .cate-name{
	font-size: 13px;
	text-align: center;
	font-weight: 300;
}
.user-new-title{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 45upx;
}
.user-new-title .new-title{
	margin-left: 25upx;
	font-size: 16px;
}
.user-new-title .new-title-icon{
	margin-right: 25upx;
	font-size: 24px;
}
.mine-new-card{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 45upx;
	padding: 0 25upx;
}
.mine-new-card .new-card{
	width: 220upx;
	height: 290upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #ababab;
	color: #FFFFFF;
	border-radius: 10px;
}
.new-card .new-card-icon{
	font-size: 28px;
	
}
.icon-like1{
		color: #FA3534;
}
.icon-FM{
	color: #333;
}
.new-card:first-child .new-card-icon{
	margin-top: -60upx;
}
.new-card .new-msg{
	font-size: 15px;
	margin-top: 10upx;
}
.new-card .new-bott{
	font-size: 12px;
	margin-top: 30upx;
}
.res-play{
	width: 100%;
	display: flex;
	align-items: center;
	margin-top: 10upx;
}
.res-play image{
	width: 100upx;
	height: 100upx;
	margin-left: 25upx;
}
.res-play .res-title{
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-left: 10upx;
}
.res-title .res-name{
	font-size: 16px;
}
.res-title .res-num{
	font-weight: 300;
}
.new-coll{
	margin-left: -280upx;
	font-size: 16px;
	color: #ababab;
}
.mine-create{
	width: 100%;
	padding: 10upx 50upx;
	margin-top: 20upx;
}
.mine-create .create{
	height: 80upx;
	border: 1px solid #ababab;
	text-align: center;
	font-size: 16px;
	color: #ababab;
	line-height: 36px;
	border-radius: 8px;
}
.mine-recommend{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	padding: 0 25upx;
	margin-top: 45upx;
}
.recommend{
	width: 350upx;
	display: flex;
	align-items: center;
	margin-top: 25upx;
}
.recommend image{
	width: 130upx;
	height: 130upx;
}
.recommend .recommend-title{
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-left: 10upx;
}
.recommend-title .title-name{
	width: 200upx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.recommend-title .title-msg{
	font-size: 12px;
	font-weight: 300;
	width: 200upx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-top: 20upx;
}
.last{
	width: 100%;
	height: 80upx;
	margin-top: 55upx;
	text-align: center;
	font-size: 12px;
	color: #ababab;
}
</style>
