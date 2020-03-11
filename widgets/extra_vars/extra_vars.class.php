<?php
    /**
     * @class extra_var
     * @author sol (sol@ngleader.com)
     * @brief extar_var를 출력하는 위젯
     * @version 0.1
     **/

    class extra_vars extends WidgetHandler {

        /**
         * @brief 위젯의 실행 부분
         *
         * ./widgets/위젯/conf/info.xml 에 선언한 extra_vars를 args로 받는다
         * 결과를 만든후 print가 아니라 return 해주어야 한다
         **/

        function proc($args) {

			// 출력된 목록 수
            $args->list_count = (int)$args->list_count;
            if(!$args->list_count) $args->list_count = 5;

			// 게시물을 가져옴
			$obj->module_srl = $args->selected_module_srl;
			$obj->list_count = $args->list_count;

            $oDocumentModel = &getModel('document');
			$output = $oDocumentModel->getDocumentList($obj, true);
			if(!$output->toBool()) return '';
			Context::set('oDocumentItemList',$output->data);

			// 확장변수 정보를 가져옴
			$selected_extra_keys = explode(',',$args->extra_vars_list);
			$selected_extra_keys_list = array();
			$extra_keys = $oDocumentModel->getExtraKeys($args->selected_module_srl);
			if($extra_keys){
				foreach($extra_keys as $k => $extra_key){
					$i = array_search($extra_key->eid, $selected_extra_keys);
					if($i!==false){
						$selected_extra_key_list[$i] = $extra_key;
					}
				}
			}
			Context::set('extra_key_list',$selected_extra_key_list);

			// 템플릿의 스킨 경로를 지정 (skin, colorset에 따른 값을 설정)
            $tpl_path = sprintf('%sskins/%s', $this->widget_path, $args->skin);

            // 템플릿 파일을 지정
            $tpl_file = 'extra_vars';

            $args = new stdClass();

            $zd = zDate(date('YmdHis'), "Ym");
            $args->s_regdate_more = $zd . '00000000';
            $args->s_regdate_less = ($zd + 1) . '00000000';
            $rr =  executeQuery('attendance.getWinRating', $args);
            $month = zDate(date('YmdHis'), "m");
            $year = zDate(date('YmdHis'), "Y");
            // echo "<pre>";
            // print_r($rr);
            // echo "</pre>";
            $rr->month = $month;
            $rr->year = $year;
			Context::set('oWinRating', $rr);

            // echo '</pre>';
            // 템플릿 컴파일
            $oTemplate = &TemplateHandler::getInstance();
            return $oTemplate->compile($tpl_path, $tpl_file);
        }
	}

?>
