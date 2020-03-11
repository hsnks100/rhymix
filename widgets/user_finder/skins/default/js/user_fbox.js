jQuery(function($) {
	/**
	 * 필요 전역변수 선언
	 */
	var search_target;
	var disp_info;
	var delay_time;
	var sort_order;
	var sort_list;
	var list_count;
	var page = 1;
	var t;
	var length = 0;
	var cur_select = -1;
	var dispMemberInfo = "";
	var width = 0;
	
	/**
	 * 문서 로드시 실행되는 메소드들.
	 */
	$(document).ready(function() {
		// 전역변수에 값 집어넣고 hidden input 제거
		search_target = $('.user_finder_box .search_target').val();
		disp_info = $('.user_finder_box .disp_info').val();
		delay_time = parseInt($('.user_finder_box .delay_time').val()) * 1000;
		sort_order = $('.user_finder_box .sort_order').val();
		sort_list = $('.user_finder_box .sort_list').val();
		list_count = parseInt($('.user_finder_box .list_count').val());
		page = 1;
		dispMemberInfo = $('.user_finder_box .dispMemberInfo').val();
		dispMemberInfo = dispMemberInfo.replace('z', '');
		width = parseInt($('.user_finder_box .width').val());
		$('.user_finder_box .search_target').remove();
		$('.user_finder_box .disp_info').remove();
		$('.user_finder_box .delay_time').remove();
		$('.user_finder_box .sort_order').remove();
		$('.user_finder_box .sort_list').remove();
		$('.user_finder_box .list_count').remove();
		$('.user_finder_box .dispMemberInfo').remove();
		$('.user_finder_box .width').remove();
		search_target = search_target.split(',');
		disp_info = disp_info.split(',');
		length = 0;
		cur_select = -1;
		$('.user_finder_box .inputbox').val($('.user_finder_box .inputbox').attr('default'));
		
		// 가로 길이 정리
		$('.user_finder_box').css('width', width + 'px');
		$('.user_finder_box .inputbox').css('width', width - 25 + 'px');
		$('.user_finder_box .btnClose').css('left', width - 22 + 'px');
	});
	
	$('.user_finder_box .inputbox').keyup(function(event) {
		page = 1;
		// 화살표 아래, 위 키가 눌러졌다면 선택해준다.
		// 아래 키
		if (event.keyCode == 40) {
			console.log('length = ' + length);
			console.log('cur_select = ' + cur_select);
			// 없을 때 무시, 마지막 항목이 이미 선택되었을 때 무시
			if (length < 1)
				return false;
			if (length == ++cur_select) {
				cur_select--;
				return false;
			}
			lighten_member_info($('.user_finder_box .user_info:eq(' + (cur_select - 1) + ')'));
			darken_member_info($('.user_finder_box .user_info:eq(' + cur_select + ')'));
			return false;
		}
		// 위 키
		else if (event.keyCode == 38) {
			// 하나짜리일 때 무시, 첫 번째 항목이 이미 선택되었을 때 무시
			if (length == 0)
				return false;
			if (cur_select == 0) {
				return false;
			}
			cur_select--;
			lighten_member_info($('.user_finder_box .user_info:eq(' + (cur_select + 1) + ')'));
			darken_member_info($('.user_finder_box .user_info:eq(' + cur_select + ')'));
			return false;
		}
		// 엔터키 눌렀을 때 사용자 정보 페이지로 넘어가기
		else if (event.keyCode == 13) {
			// 선택된게 없다면 취소
			if (cur_select < 0)
				return false;
			var member_srl = $('.user_finder_box .user_info:eq(' + cur_select + ')').attr('member_srl');
			location.href = dispMemberInfo + member_srl;
			return false;
		}
		//올바른 입력키가 입력되었는지 확인
		if (!isValidInputKey(event)) {
			return false;
		}
		// 키가 눌러진 후 몇 초간 간격 뒤에 찾기 알고리즘 실행
		var $that = $(this);
		clearTimeout(t);
		t = setTimeout(function() {
			var responses = ['member_list'];
			var params = {};
			params['search_keyword'] = $that.val();
			if ($that.val() == '') {
				$('.user_finder_box .user_info').remove();
				length = 0;
				cur_select = -1;
				return false;
			}
			for (var i in search_target) {
				params[search_target[i]] = $that.val();
			}
			params['sort_order'] = sort_order;
			params['sort_list'] = sort_list;
			params['list_count'] = parseInt(list_count) + 1;
			params['page'] = page;
			exec_xml('user_finder', 'getUser_finderMemberList', params, completeGetUserFinder, responses);
		}, delay_time);
	});
	
	function completeGetUserFinder(ret_obj) {
		// 만약에 기존에 사용자 정보를 담은 필다가 있다면 그 필드 모두 지우기
		if (page == 1)
			$('.user_finder_box .user_info').remove();
		length = 0;
		cur_select = -1;
		$('.user_finder_box .user_info').each(function() {
			lighten_member_info($(this));
		});
		
		// 요청 실패시 취소
		var message = ret_obj['message'];
		if (message != 'success') {
			$('.user_finder_box .inputbox').val($('.user_finder_box .inputbox').attr('default'));
			$('.user_finder_box .user_info').remove();
			length = 0;
			cur_select = -1;
			$('.user_finder_box .see_more').css('display', 'none');
			return false;
		}
		
		// 받은 사용자 정보를 넣는다.
		var member_list = ret_obj['member_list'];
		
		// 아무것도 받은 것이 없다면 취소
		if (member_list == null) {
			$('.user_finder_box .user_info').remove();
			length = 0;
			cur_select = -1;
			$('.user_finder_box .see_more').css('display', 'none');
			return false;
		}
		
		// member_list.item 이 array 형식이 아닐 경우 array로 변환
		if (!$.isArray(member_list.item)) {
			member_list.item = new Array(member_list.item);
		}
		// 받은 모든 아이템을 박스화로 만들어서 출력시켜준다.
		for (var i in member_list.item) {
			if (i >= list_count)
				break;
			
			var $user_info = $('.user_finder_box .user_info_original').clone();
			$user_info.removeClass('user_info_original');
			$user_info.addClass('user_info');
			$user_info.find('div').addClass('member_' + member_list.item[i]['member_srl']);
			$user_info.css('display', 'block');
			$user_info.attr('order', i);
			$user_info.attr('member_srl', member_list.item[i]['member_srl']);
			
			// 프로필 사진.
			if (member_list.item[i].profile_image != null) {
				$user_info.find('.profile').attr('src', member_list.item[i].profile_image['file']);
			} else {
				$user_info.find('.profile').attr('src', 'widgets/user_finder/skins/default/img/anonymous.jpg');
			}
			// disp_info 에 명시되어있는 3개의 아이템을 출력시켜준다.
			for (var j = 1; j <= 3; j++) {
				if (disp_info[j - 1] == null)
					break;
				$user_info.find('.inbox_' + j).text(member_list.item[i][disp_info[j - 1]]);
				$user_info.find('.inbox_' + j).addClass(disp_info[j - 1]);
				$user_info.find('.inbox_' + j).removeClass('inbox_' + j);
			}
			// 마우스를 올렸을 때 진해지도록 이벤트 할당
			$user_info.bind('mouseenter', onMouseEnter);
			// 마우스를 내렸을 때 연해지도록 이벤트 할당
			$user_info.bind('mouseleave', onMouseLeave);
			// html element 삽입
			$('.user_finder_box .user_info_original').before($user_info);
		}
		// list_count보다 더 많다면 더보기 버튼 보이기
		if (i >= list_count) {
			$('.user_finder_box .see_more').css('display', 'block');
		} else {
			$('.user_finder_box .see_more').css('display', 'none');
		}
		length = $('.user_finder_box .user_info').length;
	}
	
	/**
	 * 최초에 클릭하면 기존에 있던 '사용자를 찾아보세요...' 메시지 없앤다.
	 */
	$('.user_finder_box .inputbox').click(function() {
		var theVal = $(this).val().toString();
		var theDef = $(this).attr('default').toString();
		if (theVal != theDef) 
			return false;
		else
			$(this).val('');
	});
	
	/**
	 * 닫기 버튼을 클릭하면 모든 검색 결과를 없애주고 택스트 박스 글자 원위치
	 */
	$('.user_finder_box .btnClose').click(function() {
		$('.user_finder_box .user_info').remove();
		length = 0;
		cur_select = -1;
		$('.user_finder_box .inputbox').val($('.user_finder_box .inputbox').attr('default'));
		$('.user_finder_box .see_more').hide();
	});
	
	/**
	 * 더 보기를 눌렀을 때 다음 페이지를 불러오기
	 */
	$('.user_finder_box .see_more').click(function() {
		var responses = ['member_list'];
		var params = {};
		page++;
		params['search_keyword'] = $('.user_finder_box .inputbox').val();
		for (var i in search_target) {
			params[search_target[i]] = $('.user_finder_box .inputbox').val();
		}
		params['sort_order'] = sort_order;
		params['sort_list'] = sort_list;
		params['list_count'] = parseInt(list_count) + 1;
		params['page'] = page;
		console.log(params);
		
		exec_xml('user_finder', 'getUser_finderMemberList', params, completeGetUserFinder, responses);
	});
	
	/**
	 * 마우스를 올렸을 때 진하게 만듬
	 */
	function onMouseEnter(event) {
		// 일단 모든 엘리먼트들을 연하게 만듬.
		$('.user_finder_box .user_info').each(function() {
			lighten_member_info($(this));
		});
		// 마우스 올라간 녀석 진하게 만듬
		darken_member_info($(this));
		// 전역변수 정리하기
		cur_select = $(this).attr('order');
	}
	/**
	 * 마우스를 내렸을 때 연하게 만듬
	 */
	function onMouseLeave(event) {
		// 처리 안해도 되나???
	}
	
	/**
	 * 진하게 만드는 함수
	 */
	function lighten_member_info(obj) {
		obj.removeClass('darkened');
	}
	
	/**
	 * 연하게 만드는 함수
	 */
	function darken_member_info(obj) {
		obj.addClass('darkened');
	}
	
	/**
	 * 입력된 키가 올바른 값인지 확인
	 * 13(엔터)을 눌렀을 때 사용자 정보 페이지로 넘어가자.
	 */
	function isValidInputKey(e) {
		//8(bs), 32(sp), 48 ~ 57(숫자), 65 ~ 90(알파벳), 96 ~ 109(키패드:모질라)
		var k = e.keyCode;
		if ((k == 8) || ((k >= 48)&&(k <= 57)) ||
				((k >= 65)&&(k <= 90)) || ((k >= 96)&&(k <= 109))) {
			return true;
		}
		return false;
	}
});

/**
 * 학번을 받아서 뒷 자리 2자리를 *표로 가려준다.
 *
function maskStuid(stuid) {
	var t;
	t = stuid.substring(0, stuid.length - 2);
	t += "**";
	return t;
}
*/