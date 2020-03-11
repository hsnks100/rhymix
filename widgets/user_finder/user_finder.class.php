<?php

/**
 * @class user_finder
 * @author wndflwr(wndflwr@gmail.com) 바람꽃 - 한동대학교CRA
 * @brief 사용자를 쉽게 찾을 수 있도록 도와주는 위젯
 * @version 0.1
 **/

class user_finder extends WidgetHandler {

	/**
	 * @brief 위젯의 실행 부분
	 *
	 * ./widgets/위젯/conf/info.xml 에 선언한 extra_vars를 args로 받는다
	 * 결과를 만든후 print가 아니라 return 해주어야 한다
	 **/
	function proc($args) {
		// 검색 대상 값 정리
		if (!$args->search_target) {
			$args->search_target = 'user_name';
		}
		if (!is_numeric($args->delay_time)) {
			$args->delay_time = 1;
		} else if ((integer)$args->delay_time < 1) {
			$args->delay_time = 1;
		} else {
			//
		}
		if (!is_numeric($args->list_count)) {
			$args->list_count = 5;
		} else if ((integer)$args->list_count < 1) {
			$args->list_count = 5;
		} else {
			//
		}
		$args->width = str_replace('px', '', $args->width);
		if (!is_numeric($args->width)) {
			$args->width = 200;
		}
		else if ((integer)$args->width < 1) {
			$args->width = 200;
		}
		else {
			//
		}
		// 템플릿에서 사용하도록 변수를 선언
		Context::set('args', $args);
		
		// 템플릿 설정
		$tpl_path = sprintf('%sskins/%s', $this->widget_path, $args->skin);
		$tpl_file = 'user_fbox';
		
		// 템플릿 컴파일
		$oTemplate = &TemplateHandler::getInstance();
		return $oTemplate->compile($tpl_path, $tpl_file);
	}
}

?>
