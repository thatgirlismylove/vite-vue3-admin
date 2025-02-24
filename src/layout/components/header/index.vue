<template>
	<div class="h-[60px] w-full flex items-center border-b border-solid border-inherit box-border">
		<div class="w-[232px] h-full flex items-center pl-[24px]">
			<img class="w-[142px] h-[32px]" src="@/assets/images/buffalo.png" />
		</div>

		<div class="flex-1 flex items-center justify-between pl-[24px] pr-[20px] box-border">
			<span class="text-[24px] leading-[38px] text-[var(--title-color)] font-bold">Overseas</span>
			<div class="flex items-center gap-[16px]">
				<SwitchLanguage />

				<div class="flex items-center">
					<!-- 自动导入图标 -->
					<el-icon>
						<i-ep-setting />
					</el-icon>
					<span>{{ t('message.hello') }}</span>
				</div>
				<span class="cursor-pointer">log out</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
