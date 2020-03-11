<?php
/**
 * @class  user_finderModel
 * @author wndflwr (wndflwr@gmail.com)
 * @brief  모듈들에 사용되는 함수 모음
 **/

class user_finderModel extends user_finder {
	
	/**
	 * @brief 초기화
	 **/
	function init() {
	}
	
	/**
	 * @brief 사용자 검색
	 */
	function getUser_finderMemberList() {
		// 비회원일 경우 사용 중지
		$logged_info = Context::get('logged_info');
		if (!$logged_info) {
			return new Object(0, 'msg_not_logged');
		}
		$args;
		$vars = Context::getRequestVars();
		$search_keyword = $vars->search_keyword;
		if (!$search_keyword) {
			return new Object(0, 'msg_invalid_request');
		}
		$args->sort_order = $vars->sort_order;
		$args->sort_list = $vars->sort_list;
		$args->page = $vars->page;
		$args->list_count = $vars->list_count;
		$args->page_count = 1;
		unset($vars->body);
		unset($vars->module);
		unset($vars->act);
		unset($vars->search_keyword);
		unset($vars->sort_order);
		unset($vars->sort_list);
		unset($vars->list_count);
		unset($vars->page);
		foreach($vars as $key => $val) {
			$args->{$key} = '%'.str_replace(' ', '%', $val).'%';
		}
		unset($vars);
		$output = executeQueryArray('member.getMemberList', $args);
		// 보내기 전에 데이터를 정제하고 보내기. (암호같은거 다 빼기)
		$oMemberModel = &getModel('member');
		$member_list = array();
		foreach($output->data as $key => $val) {
			$member_list[$key] = $oMemberModel->arrangeMemberInfo($val);
			// 필요없는 정보 다 지우기
			unset($member_list[$key]->password);
			unset($member_list[$key]->email_id);
			unset($member_list[$key]->email_host);
			unset($member_list[$key]->allow_mailing);
			unset($member_list[$key]->allow_message);
			unset($member_list[$key]->birthday);
			unset($member_list[$key]->blog);
			unset($member_list[$key]->change_password_date);
			unset($member_list[$key]->denied);
			unset($member_list[$key]->description);
			unset($member_list[$key]->find_account_answer);
			unset($member_list[$key]->find_account_question);
			unset($member_list[$key]->group_list);
			unset($member_list[$key]->homepage);
			unset($member_list[$key]->is_admin);
			unset($member_list[$key]->last_login);
			unset($member_list[$key]->limit_date);
			unset($member_list[$key]->list_order);
			unset($member_list[$key]->regdate);
			unset($member_list[$key]->signature);
		}
		$this->add('member_list', $member_list);
	}
}
?>