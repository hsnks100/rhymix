<?php
/**
 * @class  user_finderAdminView
 * @author wndflwr (wndflwr@gmail.com)
 * @brief  user_finder 의 관리자 페이지 view
 **/

class user_finderAdminView extends user_finder {

	/**
	 * @brief 초기화
	 **/
	function init() {
	}

	/**
	 * @brief 설정
	 **/
	function dispUser_finderAdminConfig() {
		// 모듈 설정 값 던지기
		
		
		// 템플릿 파일 지정
		$this->setTemplatePath($this->module_path.'tpl');
		$this->setTemplateFile('config');
	}
}
?>