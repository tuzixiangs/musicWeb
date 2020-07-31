<template name='sunui-omitted'>
	<view :style="sty">
		<text class='sunui-omitted-uncontent' :style='"-webkit-line-clamp:"+clamp+";"'>{{text}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		name: 'uni-text',
		props: {
			sty:{
				type:String,
				default(){
					return `font-weight:100`;
				}
			},
			text: {
				type: String
			},
			clamp: {
				type: [String, Number],
				default(){
					return `2`;
				}
			}
		}
	}
</script>

<style>
	.sunui-omitted-uncontent {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
