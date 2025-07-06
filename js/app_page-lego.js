'use strict';

/**
 * 레고
**/


//< 레디
mm.ready(function () {

	var $lego = mm.find('.m_lego')[0];
	var $build = mm.find('.m_lego-build', $lego)[0];
	var $canvases = mm.find('.m_lego-build-canvas', $build);

	var $info = mm.find('.m_lego-build-info', $build)[0];
	var $device = mm.find('.m\\.\\.\\.info-device', $info)[0];

	var _classOn = 'S=on';
	var _classCanvas = 'S=canvas-on';

	// 템플릿 보기
	mm.event.on('.btn_template', 'click', function () {

		var $template = mm.find('.m_lego-template', $lego)[0];
		var $clone = $template.cloneNode(true);

		document.body.append($clone);
		$clone.classList.add(_classOn);

		mm.lazyload.update($clone);
		mm.event.on(mm.find('.btn_close', $clone), 'click', function () {

			$clone.remove();

		}, { _isOnce: true });

	});

	// 디바이스 전환
	mm.event.on(mm.find('button', $device), 'click', function (__e) {

		var $this = this;
		var _classDevice = 'S=device-on';
		var _device;

		if ($this.classList.contains(_classDevice)) return;

		mm.class.remove(mm.find('button', $device), _classDevice);
		$this.classList.add(_classDevice);

		_.forEach($canvases, function (__$canvas) {

			if (!__$canvas.classList.contains(_classCanvas)) {
				__$canvas.classList.add(_classCanvas);
				_device = __$canvas.classList.contains('T=canvas-pc') ? 'pc' : 'mobile';
			}
			else __$canvas.classList.remove(_classCanvas);

		});

		var $sidebar = mm.find('.m_lego-sidebar', $lego)[0];
		if (_device === 'mobile') $sidebar.classList.add('S=gnb-hide');
		else $sidebar.classList.remove('S=gnb-hide');

		mm.scroll.to(0, { _time: 0, scroller : mm.scroll.find('.m_lego-build') });
		sidebar.popupClose();

	});

	// 페이지 클릭 시 블록 선택 해제
	mm.delegate.on($lego, '.m_lego-build', 'click', function (__e) {

		if (__e.target.closest('.m_lego-build-canvas') || __e.target.closest('.m_lego-block-modal') || __e.target.closest('.mm_dropdown')) return;

		var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
		if ($canvas.classList.contains('T=canvas-pc')) mm.element.show('.m\\.\\.\\.canvas-header > .m_lego-controller, .m\\.\\.\\.canvas-footer > .m_lego-controller');
		else mm.element.show('.m\\.\\.\\.canvas-toolbar > .m_lego-controller');

		canvasDim.off();
		mm.event.off(mm.find('.m\\.\\.\\.canvas-block', $canvas), 'mouseenter');

		sidebar.popupClose();
		mm.dropdown.close($info);

		var $onContainer = Array.from(mm.find('.m\\.\\.\\.canvas-container', $canvas)).filter(__$container => __$container.classList.contains(_classOn))[0];
		if ($onContainer) $onContainer.classList.remove(_classOn);

	});

	// 템플릿 새로 저장
	mm.event.on(mm.find('.btn_save', $info), 'click', function () {

		var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
		var _device = $canvas.classList.contains('T=canvas-pc') ? 'pc' : 'mobile';
		var $template = mm.find('.m_lego-template', $lego)[0];
		var $myTemplate = mm.find('.m_lego-template-user', $template)[0];

		var $templateList = mm.find('.m_lego-template-list', $myTemplate)[0];
		if (!$templateList) {
			$templateList = mm.element.create(mm.string.template([
				'<div class="m_lego-template-list">',
					'<ul>',
						'<li><a class="btn_create" href="javascript:void(0);"><i class="ico_add"></i><b>나만의 템플릿 만들기</b></a></li>',
					'</ul>',
				'</div>'
			]))[0];

			mm.find('.m_lego-template-empty', $template)[0].remove();
			$myTemplate.append($templateList);
		}

		// 사용된 블록 이미지 캔버스 변환하여 이미지 변환 처리
		var $buildCanvas = mm.find(mm.string.template('.m_lego-build-canvas.T\\=canvas-${DEVICE}', { DEVICE: _device }))[0];
		var $canvasElement = document.createElement('canvas');

		var _imageWidth = (_device === 'pc') ? 1920 : 752;
		$canvasElement.width = _imageWidth;
		$canvasElement.height = $buildCanvas.offsetHeight * (_imageWidth / $buildCanvas.offsetWidth );

		var $images = mm.find('img', $canvas);
		var srcArray = [];

		for (const __$images of $images) srcArray.push(__$images.src);

		var ctx = $canvasElement.getContext("2d");
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, $canvasElement.width, $canvasElement.height);

		var $tempImg = new Image();
		$tempImg.src = '../image/common/watermark.png'; // 워터마크 이미지
		$tempImg.onload = function(__e) {

			var _y = 0;
			var _index = 0;
			for (const _src of srcArray) {
				var $img = new Image();
				$img.onload = function(__e) {

					var $target = __e.currentTarget;
					var _ratio = $target.naturalHeight / $target.naturalWidth;

					if (_index >= 2) {
						if (_device === 'pc') {
							if (srcArray.length - 1 === _index) _y = $canvasElement.height - (_imageWidth * _ratio); // footer 배치
							else _y += 130; // 블록간 간격
						}
						else {
							if (srcArray.length - 1 === _index) _y = $canvasElement.height - (_imageWidth * _ratio); // footer 배치
							else if (srcArray.length - 2 === _index) _y += 100; // footer 배치
							else _y += 140; // 블록간 간격
						}
					}

					var _width = $target.naturalWidth;
					var _x = ($target.naturalWidth > ((_device === 'pc') ? 1362 : 750)) ? 0 : (_imageWidth - $target.naturalWidth) / 2;
					ctx.drawImage($target, _x, _y,  _width, $target.naturalHeight);
					_y += $target.naturalHeight;

					// 마지막 이미지 로드
					if (srcArray.length - 1 === _index) {
						ctx.save();
						ctx.rect(0, 0, $canvasElement.width, $canvasElement.height);
						ctx.fillStyle = ctx.createPattern($tempImg, 'repeat-y');
						ctx.globalAlpha = 0.05;
						ctx.fill();

						ctx.restore();

						var dataURL = $canvasElement.toDataURL("image/jpg");
						dataURL = dataURL.replace('data:image/jpeg;base64,', '');

						const $a = document.createElement('a');

						$a.href = dataURL;
						$a.download = mm.string.template('template_${DATE}.jpg', { DATE: new Date().getTime() });
						$a.click();
					}

					_index++;

				}

				$img.src = _src;
			}

		}

		var $template = mm.element.create(mm.string.template([
			'<li>',
				'<i class="mm_bg-cover image_template"></i>',
				'<b>내가 만든 템플릿 ${INDEX}</b>',
				'<div class="mm_btn_box">',
					'<button type="button" class="mm_btn T=line T=round"><i class="ico_select"></i><b>선택하기</b></button>',
					'<a class="mm_btn T=line T=round" href="javascript:void(0);"><i class="ico_preview"></i><b>미리보기</b></a>',
				'</div>',
			'</li>'
		], { INDEX: String(mm.find('li', $templateList).length).padStart(4, 0) }))[0];

		mm.find('ul', $templateList)[0].append($template);
		mm.dropdown.close(this.closest('.mm_dropdown'));

	});

});
//> 레디

//< 사이드바
var sidebar = function () {

	var $lego = mm.find('.m_lego')[0];
	var $build = mm.find('.m_lego-build', $lego)[0];
	var $canvases = mm.find('.m_lego-build-canvas', $build);
	var $blockModal = mm.find('.m_lego-block-modal', $build)[0];

	var $sidebar = mm.find('.m_lego-sidebar', $lego)[0];
	var $gnb = mm.find('.m_lego-gnb', $sidebar)[0];
	var $gnbList = mm.find('> ul > li', $gnb);
	var $gnbBlock = mm.find('.m_lego-gnb-block', $gnb)[0];

	var $popupContainer = mm.find('.m_lego-sidebar-popup', $sidebar)[0];

	var _classOn = 'S=on';
	var _classPopup = 'S=popup-on';
	var _classCanvas = 'S=canvas-on';
	var _classGnb = 'S=gnb-on';

	var base = {
		getType() { // 헤더,푸터,툴바 체크

			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			var $header = mm.find('.m\\.\\.\\.canvas-header', $canvas)[0];
			var $footer = mm.find('.m\\.\\.\\.canvas-footer', $canvas)[0];
			var $toolbar = mm.find('.m\\.\\.\\.canvas-toolbar', $canvas)[0];

			var _result = 'content';
			[$header, $footer, $toolbar].filter(function (__$el) {
				if (!__$el || !__$el.classList.contains(_classOn)) return;

				_result = (__$el === $header) ? 'header' : (__$el === $footer) ? 'footer' : 'toolbar';
			});

			return _result;
		},
		setBlockList(__category) {

			var $blockList = mm.find('.m_lego-block-list', $gnbBlock)[0];
			var $sort = mm.find('.mm_dropdown', $blockList)[0];

			var _classOn = 'S=gnb-on';

			var _beforeCategory = mm.find(mm.selector(_classOn, '.'), $gnb)[0].getAttribute('name');
			var _category = (__category) ? __category : Object.keys(globalBlocks.pc)[0];

			if (globalGnbBlocks[_beforeCategory]) {
				if (_beforeCategory === _category) return;
				else mm.find('> ul', $blockList)[0].remove();
			}

			var groups = globalBlocks.pc[_category];
			var sorts = ['all'];
			var names = ['전체'];
			for (const __block of groups) {
				if (sorts.indexOf(__block.sort) < 0) sorts.push(__block.sort);

				var _name = __block.name.split(' ').splice(0, __block.name.split(' ').map(Number).length - 1).join(' ');
				if (names.indexOf(_name) < 0) names.push(_name);
			}

			// 정렬 셀렉트 세팅
			if (sorts.length > 1) {
				if ($sort.style.display === 'none') $sort.style.display = '';
				mm.find('.mm_dropdown-item ul', $sort)[0].innerHTML = '';

				var $selectTemplate = mm.element.create(mm.string.template('<li><a href="javascript:void(0);"><b></b></a></li>'))[0];
				for (const [__index, __sort] of sorts.entries()) {
					var $clone = $selectTemplate.cloneNode(true);
					mm.find('> a', $clone)[0].setAttribute('name', __sort);
					mm.find('> a > b', $clone)[0].innerText = names[__index];

					mm.find('.mm_dropdown-item ul', $sort)[0].append($clone);
				}
			}
			else $sort.style.display = 'none'

			if (globalGnbBlocks[_category]) $blockList.append(globalGnbBlocks[_category]);
			else {
				var $list = mm.find('> ul', $blockList)[0];
				if (!$list) {
					$list = mm.element.create(mm.string.template('<ul></ul>'))[0];
					$blockList.append($list);
				}

				var $itemTemplate = mm.element.create(mm.string.template([
					'<li>',
						'<div class="m_lego-block-item" data-block>',
							'<p class="text_title"></p>',
							'<i class="image_block"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-lazyload alt=""></i>',
							'<button type="button" class="btn_zoom"><i class="ico_zoom"></i><b class="mm_ir-blind">확대보기</b></button>',
						'</div>',
					'</li>'
				]))[0];

				for (const __block of groups) {
					var $clone = $itemTemplate.cloneNode(true);

					mm.find('.text_title', $clone)[0].innerText = __block.name;
					var $image = mm.find('.image_block > img', $clone)[0];
					mm.element.attribute($image, { 'data-lazyload': { _src: __block.thumbnail }});
					mm.data.set(mm.find('.m_lego-block-item', $clone)[0], 'data-block', { initial: __block });

					$list.append($clone);
				}

				globalGnbBlocks[_category] = $list;
			}

			mm.lazyload.update($list);
			$blockList.classList.add(_classOn);

		}
	};

	(function () {

		// GNB 클릭
		mm.event.on(mm.find('button', $gnbList), 'click', function () {

			var $this = this;
			var _category = $this.getAttribute('name');

			base.setBlockList(_category);

			mm.dropdown.close($gnbBlock);
			mm.find(mm.selector(_classGnb, '.'), $gnbList)[0].classList.remove(_classGnb);
			$this.classList.add(_classGnb);

		});

		// 블록 확대보기
		mm.delegate.on($sidebar, '.btn_zoom', 'click', function () {

			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			var $blockList = this.closest('.m_lego-block-list');
			var $blockItem = this.closest('.m_lego-block-item');

			var $blockModal = mm.find('.m_lego-block-modal', $build)[0];
			var $modalTitle = mm.find('.text_title', $blockModal)[0];
			var $modalImage = mm.find('.image_block', $blockModal)[0];

			var _type = base.getType();
			var _device = $canvas.classList.contains('T=canvas-pc') ? 'pc' : 'mobile'; // 디바이스 체크
			var data = mm.data.get($blockItem, 'data-block');

			var _classModal = 'S=block-modal-on';

			// 모달 타이틀 세팅
			$modalTitle.innerText = (_type === 'content') ? data.name : data[_device].name;

			if (!mm.find('.image_block', $blockItem)[0].classList.contains('mm_image-none')) {
				// 모달 이미지 세팅
				var _imageSrc = (_type === 'content') ? data.thumbnail : data[_device].thumbnail;
				if ($modalImage.childElementCount >= 1) mm.find('img', $modalImage)[0].setAttribute('src', _imageSrc);
				else $modalImage.append(mm.element.create(mm.string.template('<img src=${SRC}>', { SRC: _imageSrc }))[0]);
			}

			mm.class.remove(mm.find(mm.selector(_classOn, '.'), $blockList), _classOn);
			mm.class.add([$blockModal, $blockItem], _classOn);
			$blockList.classList.add(_classModal);

			mm.event.off(mm.find('.btn_add, .btn_close', $blockModal), 'click');

			// 적용하기
			mm.event.on(mm.find('.btn_add', $blockModal), 'click', function () {

				// 블록 변경 체크
				var _isBlockChange = $blockList.closest('.m_lego-sidebar-popup') ? true : false;
				if (_isBlockChange) {
					var $target = _.filter(mm.find('.m\\.\\.\\.canvas-container', $canvas), function (__$block) { return __$block.classList.contains(_classOn) })[0];

					if (_type != 'content') $target = mm.find(mm.selector(mm.string.template('.m\\.\\.\\.canvas-${TYPE}', { TYPE: _type })), $canvas)[0];
					block.change($target, data, _type);
				}
				else block.add(data);

				canvasDim.off();
				mm.event.dispatch(mm.find('.btn_close', $blockModal)[0], 'click');
				mm.scroll.to($target, { _time: 0, scroller : mm.scroll.find('.m_lego-build'), _margin: 100 });

			});

			// 닫기
			mm.event.on(mm.find('.btn_close', $blockModal), 'click', function () {

				$modalTitle.innerText = '';
				if ($modalImage.childElementCount >= 1) $modalImage.innerHTML = '';

				mm.class.remove([$blockModal, $blockItem], _classOn);
				$blockList.classList.remove(_classModal);

				mm.event.off(mm.find('.btn_add, .btn_close', $blockModal), 'click');

			});

		});

		// 블록 드래그 & 드롭
		mm.delegate.on($lego, '.m_lego-block-item', 'mousedown', function (__e) {

			__e.preventDefault();

			var $this = this;
			var _isBlockChange = $this.closest('.m_lego-sidebar-popup') ? true : false; // 블록 변경인지 체크

			// 블록 모달 노출중일 때는 드래그 사용 안함
			if ($this.closest('.m_lego-block-list').classList.contains('S=block-modal-on')) return;

			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			var $canvasBody = mm.find('.m\\.\\.\\.canvas-body', $canvas)[0];
			var $containers = mm.find('.m\\.\\.\\.canvas-container:not(.T\\=container-empty)', $canvas);
			var $ghost;

			var canvacRect = $canvas.getBoundingClientRect();
			var _classGhost = 'S=image_ghost';
			var _isDraging = false;
			var _isCanvas = false;

			var $containerEmpty = mm.find('.m\\.\\.\\.canvas-container.T\\=container-empty', $canvasBody)[0];
			var $containerGuide = mm.element.create(mm.string.template('<div class="m...canvas-container T=container-guide"></div>'))[0];
			var $cursor = mm.element.create(mm.string.template('<i class="ico_cursor"></i>'))[0];

			// 블록 드래그
			mm.event.on($lego, 'mousemove', function (__e) {

				if (!_isDraging) {
					if (!_isBlockChange) mm.class.remove($containers, _classOn);
					canvasDim.on();

					var $blockImage = mm.find('.image_block', $this)[0];
					$ghost = $blockImage.cloneNode(true);
					$ghost.classList.add('S=image_dragging');
					mm.find('.m_lego-build', $lego)[0].append($ghost);
					mm.find('.m_lego-build', $lego)[0].append($cursor);

					// 클릭한 블록의 위치로 커서를 두기 위해 위치 보정
					var rect = $blockImage.getBoundingClientRect();
					var _left = -($ghost.offsetWidth * ((__e.x - rect.x) / $blockImage.offsetWidth));
					var _top = -($ghost.offsetHeight * ((__e.y - rect.y) / $blockImage.offsetHeight));
					mm.element.style($ghost, { 'margin-left': mm.number.unit(_left), 'margin-top': mm.number.unit(_top) });
				}

				$this.classList.add(_classGhost);

				// 마우스가 캔버스 안으로 들어 왔을 때
				if (canvacRect.x <= __e.clientX && (canvacRect.x + $canvas.offsetWidth >= __e.clientX)) {
					_isCanvas = true;
					var $img = mm.find('img', $ghost)[0];

					if ($containerEmpty) $containerEmpty.remove();
					if (!_isBlockChange) {
						var _width = ($img.naturalWidth <= 1362) ? 770 : $canvasBody.offsetWidth;
						mm.element.style($containerGuide, { 'height': mm.number.unit(_width * ($img .naturalHeight / $img .naturalWidth) + 208) });

						if ($containerEmpty) $canvasBody.prepend($containerGuide);
						else {
							for (const __$el of $containers) {
								var _index = mm.element.index($containers, __$el);
								var _containerTop = mm.element.offset(__$el).top;
								var _containerHeight = __$el.offsetHeight;

								if (_containerTop <= __e.clientY && _containerTop + _containerHeight >= __e.clientY) {
									if (_containerTop + (_containerHeight / 2) >= __e.clientY) mm.element.before(__$el, $containerGuide);
									else mm.element.after(__$el, $containerGuide);

									break;
								}
								else if ($containers.length === _index + 1 && (_containerTop + __$el.offsetHeight) < __e.clientY) $canvasBody.append($containerGuide);
							}
						}
					}
				}
				else {
					_isCanvas = false;
					if (!_isBlockChange) $containerGuide.remove();
				}

				mm.element.style($cursor, { 'top': mm.number.unit(__e.clientY - ($cursor.offsetHeight / 2)), 'left': mm.number.unit(__e.clientX - ($cursor.offsetWidth / 2)) });
				mm.element.style($ghost, { 'top': mm.number.unit(__e.clientY), 'left': mm.number.unit(__e.clientX) });
				_isDraging = true;

			});

			mm.event.on($lego, 'mouseup', function () {

				mm.event.off($lego, 'mousemove');
				_isDraging = false;

				$this.classList.remove(_classGhost);
				if ($ghost) $ghost.remove();
				$cursor.remove();
				canvasDim.off();

				// 블록 드래그앤 드랍으로 추가
				if (_isCanvas) {
					if (_isBlockChange) {
						var _type = base.getType();
						var $target = (_type === 'content') ? _.filter(mm.find('.m\\.\\.\\.canvas-container', $canvas), function (__$block) { return __$block.classList.contains(_classOn) })[0] : mm.find(mm.selector(mm.string.template('.m\\.\\.\\.canvas-${TYPE}', { TYPE: _type })), $canvas)[0];

						block.change($target, mm.data.get($this, 'data-block'), _type);
					}
					else block.add(mm.data.get($this, 'data-block'), $containerGuide);
				}

				if ($canvasBody.childElementCount === 0) {
					var $emptyContainer = mm.element.create(mm.string.template([
						'<div class="m...canvas-container T=container-empty">',
							'<p>왼쪽 메뉴에서 블록을 선택<br> 또는 템플릿을 사용하여 페이지를 만들어보세요</p>',
						'</div>'
					]))[0];

					$canvasBody.prepend($emptyContainer);
				}

			}, { _isOnce: true });

		});

		// 블록리스트 정렬
		mm.delegate.on($gnbBlock, '.m_lego-block-list > .mm_dropdown a[name]', 'click', function () {

			var $this = this;
			var $dropdown = $this.closest('.mm_dropdown');
			var _type = $this.name;

			var $blockList = mm.find('.m_lego-block-list', $gnbBlock)[0];
			var $items = mm.find('.m_lego-block-item', $blockList);

			for (const __$item of $items) {
				var data = mm.data.get(__$item, 'data-block');
				if (_type === 'all') __$item.style.display = '';
				else {
					if (_type != data.sort) __$item.style.display = 'none';
					else if (__$item.style.display === 'none') __$item.style.display = '';
				}
			}

			mm.find('.btn_dropdown > b', $dropdown)[0].innerText = $this.innerText;
			mm.dropdown.close($dropdown);

		});

	})();

	return {
		// 팝업 열기
		popupOpen: function (__$popup, __option) {

			var $popup = __$popup;
			var $popupItems = mm.find('.m\\.\\.\\.popup-item', $popupContainer);
			var $beforePopup = _.filter($popupItems, function (__$el) { return __$el.classList.contains(_classOn) } )[0];

			if (!$popup || $beforePopup === $popup) return;

			if (!$popupContainer.classList.contains(_classPopup)) $popupContainer.classList.add(_classPopup);
			$popup.classList.add(_classOn);

			// 기존에 열린 팝업이 있으면 닫기 처리
			if ($beforePopup) {
				mm.element.style($beforePopup, { 'z-index': '' });
				mm.element.style($popup, { 'z-index': 1 });

				mm.delay.on(function () { $beforePopup.classList.remove(_classOn) }, { _time: 200 });
			}

			mm.event.on(mm.find('.m\\.\\.\\.popup-item-header .btn_close', $popup), 'click', function () {

				sidebar.popupClose($popup);

			}, { _isOnce: true });

		},
		// 팝업 닫기
		popupClose: function (__$popup) {

			if (!$popupContainer.classList.contains(_classPopup)) return;

			var $popup = __$popup;
			var $popupItems = mm.find('.m\\.\\.\\.popup-item', $popupContainer);
			var $popupOption = mm.find('.m\\.\\.\\.popup-option', $popupContainer)[0];

			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];

			if ($blockModal.classList.contains(_classOn)) mm.event.dispatch(mm.find('.btn_close', $blockModal)[0], 'click');

			// 옵션변경 팝업 리셋
			if ($popupOption.classList.contains(_classOn)) {
				var $formTitle = mm.find('.m\\.\\.\\.popup-option-title', $popupOption)[0];
				var $formSize = mm.find('.m\\.\\.\\.popup-option-size', $popupOption)[0];

				if (mm.is.display($formTitle)) {
					mm.form.value(mm.find('.textfield', $formTitle), '');
					mm.find('[data-radio][name="dev_radio-align"]', $popupOption)[0].checked = true;
					mm.form.value(mm.find('> .mm_form-check.T\\=switch input', $formTitle)[0], false);
				}

				if (mm.is.display($formSize)) {
					var $onContainer = Array.from(mm.find('.m\\.\\.\\.canvas-container', $canvas)).filter(__$container => __$container.classList.contains(_classOn))[0];
					var $blockTarget = mm.find('.m\\.\\.\\.canvas-block', $onContainer)[0];
					var dataBlock = mm.data.get($blockTarget, 'data-block');

					var $img = mm.find('.image_block > img', $blockTarget)[0];
					if ($img.classList.contains('S=loaded')) $img.classList.remove('S=loaded');
					mm.data.extend($img, 'data-lazyload', { _src: dataBlock.src });
					mm.lazyload.update($img);
				}

				mm.event.off(mm.find('.btn_apply, .btn_reset', $popup));
			}

			if (!$popup) mm.class.remove($popupItems, _classOn);
			else $popup.classList.remove(_classOn);

			mm.class.remove(mm.find('.S=on[data-block]', $canvas), _classOn);
			$popupContainer.classList.remove(_classPopup);
			canvasDim.off();

		},
		setBlockList: function () {

			base.setBlockList();

		}
	}

}();
//> 사이드바

//< 캔버스 DIM
var canvasDim = function () {

	var $lego = mm.find('.m_lego')[0];
	var $build = mm.find('.m_lego-build', $lego)[0];
	var $canvases = mm.find('.m_lego-build-canvas', $build);
	var _classDim = 'S=dim-on';
	var _classCanvas = 'S=canvas-on';

	return {
		on: function () {

			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			var $dim = mm.find('.m\\.\\.\\.canvas-dim', $canvas)[0];

			$dim.classList.add(_classDim);

		},
		off: function () {

			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			var $dim = mm.find('.m\\.\\.\\.canvas-dim', $canvas)[0];

			$dim.classList.remove(_classDim);

		}
	}

}();
//> 캔버스 DIM

//< 블록
var block = function () {

	var $lego = mm.find('.m_lego')[0];
	var $build = mm.find('.m_lego-build', $lego)[0];
	var $canvases = mm.find('.m_lego-build-canvas', $build);
	var $info = mm.find('.m_lego-build-info', $build)[0];
	var $sidePopup = mm.find('.m_lego-sidebar-popup', $lego)[0];

	var _classOn = 'S=on';
	var _classCanvas = 'S=canvas-on';

	var $containerTemplate = mm.element.create(mm.string.template([
		'<div class="m...canvas-container" data-block>',
			'<p class="text_block"></p>',
			'<div class="m...canvas-container-inner"></div>',
			'<ul class="m_lego-controller">',
				'<li><button type="button" class="btn_remove"><i class="ico_remove"></i></button><b>삭제하기</b></li>',
				'<li><button type="button" class="btn_option"><i class="ico_option"></i></button><b>옵션 변경</b></li>',
				'<li><button type="button" class="btn_up"><i class="ico_arrow-up"></i></button><b>위로 이동</b></li>',
				'<li><button type="button" class="btn_down"><i class="ico_arrow-down"></i></button><b>아래로 이동</b></li>',
			'</ul>',
		'</div>'
	]))[0];

	var $blockTemplate = mm.element.create(mm.string.template([
		'<div class="m...canvas-block" data-block>',
			'<p class="text_block"></p>',
			'<i class="image_block"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-lazyload></i>',
		'</div>',
	]))[0];

	var $horizonController = mm.element.create(mm.string.template([
		'<ul class="m_lego-controller T=controller-horizontal">',
			'<li><button type="button" class="btn_left"><i class="ico_arrow-left"></i></button><b>좌측 이동</b></li>',
			'<li><button type="button" class="btn_right"><i class="ico_arrow-right"></i></button><b>우측 이동</b></li>',
			'<li><button type="button" class="btn_option"><i class="ico_option"></i></button><b>옵션 변경</b></li>',
		'</ul>',
	]))[0];

	var base = {
		get _dataName() { return 'data-block'; },// 데이타 속성 이름
		get _device() { // 디바이스 리턴
			return mm.find(mm.selector(_classCanvas, '.'), $build)[0].classList.contains('T=canvas-pc') ? 'pc' : 'mobile';
		},
		getMobileMatchBlock(__data, __matchId) { // 모바일 매칭 블록 찾기

			return globalBlocks.mobile[__data.type].filter(__block => __block.match_id === __matchId)[0];

		},
		getReplaceBlocks(__data, __device) { // 변경 가능한 블록 검색

			var result = [];
			if (__device === 'mobile') {
				for (const __id of __data.mobile.replace) {
					var replaceData = globalBlocks[__device][__data.type].filter(__block => __block.match_id === __id)[0];
					if (!mm.is.empty(replaceData)) result.push(replaceData);
				}
			}

			return result;

		},
		create(__data, __$containerGuide) { // 블록 생성

			// ? 드래그 & 드랍을 이용한 블록 추가 시 __$containerGuide 파라미터가 전달되고 __$containerGuide 안에 컨테이너 생성 후 unwrap 합니다.
			// ? pc의 추가된 블록의 index 값을 기준으로 모바일도 동일한 index 위치에 컨테이너를 생성합니다.

			var $result;
			var _addIndex; // 드래그&드롭으로 추가시 추가된 블록의 위치를 index 값으로 저장하여 모바일에 동일한 index 위치에 추가
			for (const __$canvas of $canvases) {
				var $canvasBody = mm.find('.m\\.\\.\\.canvas-body', __$canvas)[0];
				var $container = $containerTemplate.cloneNode(true);
				var $controller = mm.find('> .m_lego-controller', $container)[0];

				var _device = __$canvas.classList.contains('T=canvas-pc') ? 'pc' : 'mobile';

				if (mm.find('.T=container-empty', $canvasBody)[0]) mm.find('.T=container-empty', $canvasBody)[0].remove();

				mm.find('.text_block', $container)[0].innerText = __data.name;
				mm.data.set($container, base._dataName, { initial: __data });

				if (_device === 'mobile') {
					if (__data.mobile.replace.length >= 1) $controller.innerHTML = mm.string.template('<li><button type="button" class="btn_block-change"><i class="ico_change"></i><b>변경</b></button></li>');
					else if (base.getMobileMatchBlock(__data, __data.mobile.block).sizes.length >= 1) mm.element.remove(mm.find('button:not(.btn_option)', $controller));
					else $controller.remove();
				}
				else $result = $container;

				// 컨테이너 append
				if (__$containerGuide) { // 드래그&드랍으로 추가
					if (_device === 'pc') {
						__$containerGuide.append($container);
						mm.element.unwrap($container, true);
						_addIndex = mm.element.index(mm.find('.m\\.\\.\\.canvas-container', $canvasBody), $container);
					}
					else {
						if (_addIndex <= 0) $canvasBody.prepend($container);
						else mm.element.after(mm.find('.m\\.\\.\\.canvas-container', $canvasBody)[_addIndex - 1], $container);
					}
				}
				else $canvasBody.append($container);

				// 블록 append
				var matchBlocks = (_device === 'pc') ? __data.block : base.getMobileMatchBlock(__data, __data.mobile.block).block;
				for (const [__index, __block] of matchBlocks.entries()) {
					var $block = $blockTemplate.cloneNode(true);
					mm.find('.text_block', $block)[0].innerText = mm.string.template('${NAME}-${INDEX}', { NAME: __data.name, INDEX: __index + 1 });
					mm.data.set($block, base._dataName, { initial: __block });

					if (_device === 'pc' && matchBlocks.length > 1) {
						$block.append($horizonController.cloneNode(true));
						$block.classList.add('T\=grid-column');
					}

					mm.element.attribute(mm.find('.image_block img', $block)[0], { 'data-lazyload': { _src: __block.src }});
					mm.find('.m\\.\\.\\.canvas-container-inner', $container)[0].append($block);
				}

				mm.lazyload.update($container, { onComplete: function () {

					if (base._device === 'pc' && this.naturalWidth > 1362) this.closest('.m\\.\\.\\.canvas-container').classList.add('S=container-full');

				}});
			}

			if (__data.paid) base.priceUpdate(__data.paid);

			return $result;

		},
		priceUpdate(__data) { // 비용 계산

			var $price = mm.find('.m\\.\\.\\.info-price', $info)[0];
			var _dataName = 'data-paid';

			var $ul = mm.find('.mm_scroller > ul', $price)[0];
			if (!$ul) {
				$ul = mm.element.create(mm.string.template('<ul></ul>'))[0];
				mm.find('.mm_scroller', $price)[0].append($ul);
			}

			var _dataPaid = mm.data.get($price, _dataName);
			if (mm.is.empty(_dataPaid)) _dataPaid = mm.data.set($price, _dataName, { initial: { features: [], price: 0 } });

			// var $template = mm.element.create(mm.string.template('<li><b></b><p class="text_price"><strong></strong></p></li>'))[0];
			var $template = mm.element.create(mm.string.template('<li><b></b></li>'))[0];
			var result = [];

			if (__data) {
				if (mm.is.empty(_dataPaid.features.filter(__feature => __feature.product === __data.product))) result.push(__data);
			}
			else {
				var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
				var $containers = mm.find('.m\\.\\.\\.canvas-container', $canvas);

				for (const __$container of $containers) {
					var data = mm.data.get(__$container, base._dataName);
					if (!data || !data.paid) return;

					if (mm.is.empty(result.filter(__feature => __feature.product === data.paid.product))) result.push(data.paid);
				}

				_dataPaid.features = [];
				_dataPaid.price = 0;
				$ul.innerHTML = '';
			}

			for (const __paid of result) {
				_dataPaid.features.push(__paid);
				_dataPaid.price += __paid.price;

				var $feature = $template.cloneNode(true);
				mm.find('b', $feature)[0].innerText = __paid.product;
				//mm.find('.text_price > strong', $feature)[0].innerText = mm.number.comma(__paid.price);
				$ul.append($feature);
			}
			// mm.find('.text_price > strong', $price)[0].innerText = mm.number.comma(_dataPaid.price);
			mm.find('.text_price > strong', $price)[0].innerText = _dataPaid.features.length;
			// mm.find('dl .text_price', $price)[0].innerText = mm.number.comma(_dataPaid.price);
			mm.find('dl .text_price > strong', $price)[0].innerText = _dataPaid.features.length;
			mm.data.extend($price, _dataName, _dataPaid);
		},
		setBlockOption(__$block) {

		}
	};

	(function () {

		// 블록 선택
		mm.delegate.on($build, '.m\\.\\.\\.canvas-container', 'click', function (__e) {

			var $this = this;
			if (__e.target.closest('.m_lego-controller') || $this.classList.contains(_classOn)) return;

			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			mm.class.remove(mm.find('.m\\.\\.\\.canvas-container, .m\\.\\.\\.canvas-block', $canvas), _classOn);
			$this.classList.add(_classOn);

			if (base._device === 'pc') mm.element.hide('.m\\.\\.\\.canvas-header > .m_lego-controller, .m\\.\\.\\.canvas-footer > .m_lego-controller');
			else mm.element.hide('.m\\.\\.\\.canvas-toolbar > .m_lego-controller');

			canvasDim.on();
			sidebar.popupClose(); // 팝업 닫기

		});

		// 블록 위치 이동
		mm.delegate.on($build, ['.btn_up', '.btn_down', '.btn_left', '.btn_right'], 'click', function (__e) {

			var $this = this;
			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			var $container = $this.closest('.m\\.\\.\\.canvas-container');
			var $blocks = mm.find('.m\\.\\.\\.canvas-block', $container);

			var _direction = $this.classList[0].split('_')[1];
			var _isVertical = (_direction === 'up' || _direction === 'down');
			var _containerIndex = mm.element.index(mm.find('.m\\.\\.\\.canvas-container', $canvas), $container);

			if (_isVertical) mm.class.remove($blocks, _classOn);
			else {
				var $block = $this.closest('.m\\.\\.\\.canvas-block');
				var _blockIndex = mm.element.index($blocks, $block);

				mm.class.remove($blocks, _classOn);
				$block.classList.add(_classOn);

				mm.event.on($blocks, 'mouseenter', function (__e) {

					mm.class.remove($blocks, _classOn);
					mm.event.off($blocks, 'mouseenter');

				});
			}

			for (const __$canvas of $canvases) {
				var $item = mm.find('.m\\.\\.\\.canvas-container', __$canvas)[_containerIndex];
				var $el = _isVertical ? $item : mm.find('.m\\.\\.\\.canvas-block', $item)[_blockIndex];

				switch (_direction) {
					case 'up':
					case 'left':
						if ($el.previousElementSibling) mm.element.before($el.previousElementSibling, $el);

						break;

					case 'down':
					case 'right':
						if ($el.nextElementSibling) mm.element.after($el.nextElementSibling, $el);

						break;
				}
			}

			sidebar.popupClose();
			mm.scroll.to($container, { _time: 0, scroller : mm.scroll.find('.m_lego-build'), _margin: 100 });

		});

		// 블록 변경
		mm.delegate.on($lego, '.btn_block-change', 'click', function (__e) {

			var $this = this;
			var $target = $this.closest(mm.selector(base._dataName, '[]'));

			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			var $header = mm.find('.m\\.\\.\\.canvas-header', $canvas)[0];
			var $footer = mm.find('.m\\.\\.\\.canvas-footer', $canvas)[0];
			var $toolbar = mm.find('.m\\.\\.\\.canvas-toolbar', $canvas)[0];

			var $popupBlock = mm.find('.m\\.\\.\\.popup-block', $sidePopup)[0];
			var $list = mm.find('.m_lego-block-list', $popupBlock)[0];
			var $ul = mm.find('> ul', $list)[0];

			if (!$ul) {
				$ul = mm.element.create(mm.string.template('<ul></ul>'))[0];
				$list.append($ul);
			}
			else $ul.innerHTML = '';

			var _type = ($target === $header) ? 'header' : ($target === $footer) ? 'footer' : ($target === $toolbar) ? 'toolbar' : 'content';
			var data = mm.data.get($target, base._dataName);

			var $onContainer = mm.find('.m\\.\\.\\.canvas-container.S=on', $canvas)[0];
			if (_type != 'content') {
				if ($onContainer) {
					$onContainer.classList.remove(_classOn);
					canvasDim.off();
				}
				else canvasDim.on();

				if (_type === 'header') mm.find('.m_lego-controller', $footer)[0].style.display = 'none';
				else if (_type === 'footer') mm.find('.m_lego-controller', $header)[0].style.display = 'none';
			}

			// 사이드바 리스트에 변경 가능한 세트 블록 생성
			var replace = (_type === 'content') ? base.getReplaceBlocks(data, base._device) : data.replace;
			var $liTemplate = mm.element.create(mm.string.template([
				'<li>',
					'<div class="m_lego-block-item" data-block>',
						'<p class="text_title"></p>',
						'<i class="image_block"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-lazyload alt=""></i>',
						'<button type="button" class="btn_zoom"><i class="ico_zoom"></i><b class="mm_ir-blind">확대보기</b></button>',
					'</div>',
				'</li>'
			]))[0];

			for (const __block of replace) {
				var $li = $liTemplate.cloneNode(true);
				mm.find('.text_title', $li)[0].innerText = (_type === 'content') ?  __block.name : __block[base._device].name;

				// 현재 블록에 클래스 추가
				var _isSelected = (_type === 'content') ? (data[base._device].block === __block.match_id) : __block.mui_id === data.mui_id;
				if (_isSelected) mm.find('.m_lego-block-item', $li)[0].classList.add('S=item-selected');

				mm.element.attribute(mm.find('.image_block > img', $li)[0], { 'data-lazyload': { _src: (_type === 'content') ? __block.thumbnail : __block[base._device].thumbnail }});
				mm.data.set(mm.find('.m_lego-block-item', $li)[0], base._dataName, { initial: __block });
				$ul.append($li);
			}

			$target.classList.add(_classOn);
			mm.lazyload.update($popupBlock);
			sidebar.popupOpen($popupBlock);

		});

		// 옵션 변경
		mm.delegate.on($lego, '.btn_option', 'click', function (__e) {

			var $this = this;
			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			var $popupOption = mm.find('.m\\.\\.\\.popup-option', $sidePopup)[0];

			var $containers = mm.find('.m\\.\\.\\.canvas-container', $canvas);
			var $container = $this.closest('.m\\.\\.\\.canvas-container');
			var $blocks = mm.find('.m\\.\\.\\.canvas-block', $container);
			var $block = $this.closest('.m\\.\\.\\.canvas-block');

			var _isCombineBlock = ($block) ? true : false;
			var _device = $canvas.classList.contains('T=canvas-pc') ? 'pc' : 'mobile';

			var $target = (_isCombineBlock) ? $block : ($blocks.length > 1) ? $container : $blocks[0];

			var data = mm.data.get($target, base._dataName);
			var dataContainer = mm.data.get($container, base._dataName);
			var dataTitle = data.title;// 타이틀

			// 블록의 data값을 기준으로 옵션 변경 팝업의 입력폼 세팅
			var $formBlock = mm.find('.m\\.\\.\\.popup-option-block', $popupOption)[0]; // 팝업 > 블록명 입력폼
			var $formTitle = mm.find('.m\\.\\.\\.popup-option-title', $popupOption)[0]; // 팝업 > 타이틀 폼 영역
			var $formSize = mm.find('.m\\.\\.\\.popup-option-size', $popupOption)[0]; // 팝업 > 배너높이 영역

			mm.element.show([$formBlock, $formTitle, $formSize]);

			// 초기 세팅
			if (_isCombineBlock) {
				mm.class.remove($blocks, _classOn);
				$block.classList.add(_classOn);
				mm.element.show($formTitle);
			}
			else {
				if ($blocks.length > 1) {
					mm.class.remove($blocks, _classOn);
					mm.element.hide($formTitle);
				}
			}

			// 블록명
			mm.find('.textfield', $formBlock)[0].value = (_isCombineBlock) ? mm.find('.text_block', $block)[0].innerText : dataContainer.name;

			// 타이틀
			if (mm.is.display($formTitle)) {
				if (dataTitle.includeTitle) $formTitle.style.display = 'none'; // 디자인 타이틀 사용 시 타이틀 영역 숨김 처리
				else setOptionTitle(dataTitle);
			}

			// 배너 높이
			if (dataContainer.sizes.length <= 0 || $block) $formSize.style.display = 'none';
			else {
				if (_device === 'mobile') mm.element.hide([$formBlock, $formTitle]);
				setOptionSize();
			}

			// 타이틀 옵션 설정
			function setOptionTitle(__data) {

				var title = null;
				var $titleCheck = mm.find('> .mm_form-check.T\\=switch input', $formTitle)[0];
				var $titleMain = mm.find('.m\\.\\.\\.title-main .textfield', $formTitle)[0];
				var $titleSub = mm.find('.m\\.\\.\\.title-sub .textfield', $formTitle)[0];
				var $titleAlign = mm.find('.m\\.\\.\\.title-sub-align', $formTitle)[0];

				if (__data) {
					$titleCheck.checked = __data.useTitle;
					$titleMain.value = __data.main;
					$titleSub.value = __data.sub;
					mm.find(mm.string.template('input[value=${VALUE}]', { VALUE: (__data.align) ? __data.align : 'left' }), $titleAlign)[0].checked = true;
				}

				var _containerIndex = mm.element.index($containers, $container);
				var _blockIndex = mm.element.index($blocks, $block);

				var $title = mm.find('> .m\\.\\.\\.canvas-block-title', $target)[0];
				if ($titleCheck.checked) {
					title = {
						useTitle: (!$titleMain.value && !$titleSub.value) ? false : $titleCheck.checked,
						main: $titleMain.value,
						sub: $titleSub.value,
						align: mm.find('input:checked', $titleAlign)[0].value
					};

					if (!$titleMain.value && !$titleSub.value) return;

					if (!$title) {
						$title = mm.element.create(mm.string.template([
							'<div class="m...canvas-block-title">',
								'<p class="title_main"></p>',
								'<p class="title_sub"></p>',
							'</div>'
						]))[0];
						mm.element.after(mm.find('> .text_block', $target)[0], $title);
					}
					else $title.classList.remove($title.classList[1]); // T=정렬 클래스 삭제

					mm.find('.title_main', $title)[0].innerText = title.main;
					mm.find('.title_sub', $title)[0].innerText = title.sub;
					$title.classList.add(mm.string.template('T=${ALIGN}', { ALIGN: title.align }));

					if (dataTitle.margin) $title.style.margin = dataTitle.margin;

					// 모바일 세팅
					var $mobileCanvas = Array.from($canvases).filter(__$el => __$el.classList.contains('T=canvas-mobile'))[0];
					var $mobileContainer = mm.find('.m\\.\\.\\.canvas-container', $mobileCanvas)[_containerIndex];
					var $mobileBlock = mm.find('.m\\.\\.\\.canvas-block', $mobileContainer)[_isCombineBlock ? _blockIndex : 0];

					var $mobileTitle = mm.find('.m\\.\\.\\.canvas-block-title', $mobileBlock)[0];
					if ($mobileTitle) $mobileTitle.remove();
					$mobileTitle = $title.cloneNode(true);

					var dataMobileTitle = mm.data.get($mobileBlock, base._dataName).title;
					$mobileTitle.style.margin = (dataMobileTitle.margin) ? dataMobileTitle.margin : '';

					mm.element.after(mm.find('> .text_block', $mobileBlock)[0], $mobileTitle);
					mm.form.update($formTitle);
				}
				else {
					if ($title) $title.remove();
					mm.form.update($titleCheck);
				}

				// 조합형 블록의 타이틀 추가시 다른 블록에도 동일한 여백 부여
				if ($blocks.length > 1) {
					for (const __$block of $blocks) {
						var $containerTitle = mm.find('.m\\.\\.\\.canvas-block-title', $container)[0];
						var $blockTitle = mm.find('> .m\\.\\.\\.canvas-block-title', __$block)[0];
						var _paddingTop = 0;

						if ($titleCheck.checked && !$blockTitle) _paddingTop = $title.clientHeight + 29;
						else if ($containerTitle && !$blockTitle) _paddingTop = $containerTitle.clientHeight + 29;

						__$block.style.paddingTop = mm.number.unit(_paddingTop, 'px');
					}
				}

				return title;

			}

			// 배너 높이 옵션 설정
			function setOptionSize(__isReset) {

				var $radioTemplate = mm.element.create(mm.string.template([
					'<li>',
						'<label class="mm_form-radio" data-block>',
							'<input type="radio" name="dev_radio-banner-size" data-radio>',
							'<b class="mm_block">',
								'<i class="ico_form-radio"></i>',
								'<span class="text_label"></span>',
							'</b>',
						'</label>',
					'</li>'
				]))[0];

				var $radioList = mm.find('.mm_radio-list', $formSize)[0];
				var $ul = mm.find('> ul', $radioList)[0];
				if (!$ul) {
					$ul = mm.element.create(mm.string.template('<ul></ul>'))[0];
					$radioList.append($ul);
				}
				else if (!__isReset) $ul.innerHTML = '';

				var sizes = (_device === 'pc') ? dataContainer.sizes : base.getMobileMatchBlock(dataContainer, dataContainer.mobile.block).sizes;
				for (const __key in sizes[0]) {
					var $radio = mm.find('.mm_form-radio', $radioList)[Object.keys(sizes[0]).indexOf(__key)];
					if (!__isReset) {
						$radio = $radioTemplate.cloneNode(true);
						mm.find('.text_label', $radio)[0].innerText = __key;
						mm.data.set(mm.find('.mm_form-radio', $radio)[0], base._dataName, { initial: { size: sizes[0][__key] } });

						$ul.append($radio);
					}

					if (data.mui_id === sizes[0][__key].mui_id) mm.form.value(mm.find('input', $radio)[0], true);
				}

				// 배너 높이 변경
				mm.event.on(mm.find('input[type="radio"]', $formSize), 'change', function sizeOptionChange() {

					var $this = this;
					var $radio = $this.closest('.mm_form-radio');

					var dataSize = mm.data.get($radio, base._dataName);
					var $img = mm.find('.image_block > img', $target)[0];
					$img.classList.remove('S=loaded');
					mm.data.extend($img, 'data-lazyload', { _src: dataSize.size.src });
					mm.lazyload.update($blocks);

				}, { _isOverwrite: true });

			}

			// 이벤트 초기화
			mm.event.off(mm.find('.btn_reset, .btn_apply', $popupOption), 'click');

			// 초기화
			mm.event.on(mm.find('.btn_reset', $popupOption), 'click', function () {

				// 블록명 초기화
				mm.find('.textfield', $formBlock)[0].value = (_isCombineBlock) ? data.name : dataContainer.name;

				// 타이틀 옵션 초기화
				if (mm.is.display($formTitle)) setOptionTitle(dataTitle);

				// 배너높이 초기화
				if (mm.is.display($formSize)) setOptionSize(true);

				mm.form.update($popupOption);

			});

			// 적용하기
			mm.event.on(mm.find('.btn_apply', $popupOption), 'click', function () {

				var option = {
					name: mm.find('.textfield', $formBlock)[0].value,
					title: setOptionTitle()
				};

				// 블록명
				var _blockIndex = mm.element.index($blocks, $block);
				mm.find('> .text_block', (_isCombineBlock) ? $blocks[_blockIndex] : $container)[0].innerText = mm.find('.textfield', $formBlock)[0].value;

				// 배너 높이
				if (mm.is.display($formSize)) {
					var $sizeRadio = mm.find('input[type="radio"]:checked', $formSize)[0].closest('.mm_form-radio');
					var dataSize = mm.data.get($sizeRadio, base._dataName).size;
					var blockData = mm.data.get($target, base._dataName);
					blockData.mui_id = dataSize.mui_id;
					blockData.src = dataSize.src;
				}

				mm.data.extend($target, base._dataName, option);
				if (!_isCombineBlock) mm.data.extend($container, base._dataName, { name: option.name});

				sidebar.popupClose($popupOption);

			});

			sidebar.popupOpen($popupOption);
			mm.form.update($popupOption);

		});

		// 블록 삭제
		mm.delegate.on($build, '.btn_remove', 'click', function (__e) {

			block.remove(this.closest('.m\\.\\.\\.canvas-container'));

		});

	})();

	return {
		add: function (__data, __$containerGuide) { // 블록 추가

			var $container = base.create(__data, __$containerGuide);

			mm.scroll.to($container, { _time: 0, scroller : mm.scroll.find('.m_lego-build'), _margin: 100 });
			mm.event.dispatch($container, 'click');

		},
		remove: function (__$block) {

			if (!__$block) return;

			var $canvas = Array.from($canvases).filter(__$el => __$el.classList.contains(_classCanvas))[0];
			var $canvasBody = mm.find('.m\\.\\.\\.canvas-body', $canvas)[0];

			var _removeIndex = mm.element.index(mm.find('.m\\.\\.\\.canvas-container', $canvas), __$block);
			for (const __$canvas of $canvases) mm.find('.m\\.\\.\\.canvas-container', __$canvas)[_removeIndex].remove();

			if ($canvasBody.childElementCount === 0) {
				var $emptyContainer = mm.element.create(mm.string.template([
					'<div class="m...canvas-container T=container-empty">',
						'<p>왼쪽 메뉴에서 블록을 선택<br> 또는 템플릿을 사용하여 페이지를 만들어보세요</p>',
					'</div>'
				]))[0];

				$canvasBody.prepend($emptyContainer);
			}

			canvasDim.off();
			sidebar.popupClose();
			base.priceUpdate();

		},
		change: function (__$el, __data, __type) { // 블록 변경

			if (__type === 'content') { // 헤더/푸터
				var $title = mm.find('.text_block', __$el)[0];
				var $inner = mm.find('.m\\.\\.\\.canvas-container-inner', __$el)[0];

				$title.innerText = __data.name;
				$inner.innerHTML = ''

				for (const [__index, __block] of __data.block.entries()) {
					var $block = $blockTemplate.cloneNode(true);
					$block.append($horizonController.cloneNode(true));
					mm.find('.text_block', $block)[0].innerText = mm.string.template('${NAME}-${INDEX}', { NAME: __data.name, INDEX: __index + 1 });

					if (__data.block.length > 1) $block.classList.add('T\=grid-column');
					mm.element.attribute(mm.find('.image_block img', $block)[0], { 'data-lazyload': { _src: __block.src }});

					$inner.append($block);
				}

				if (base._device === 'mobile') mm.data.extend($block.closest('.m\\.\\.\\.canvas-container'), base._dataName, { mobile: { block: __data.match_id }});
				mm.lazyload.update(__$el, { onComplete: function () {

					if (this.naturalWidth > 1362) __$el.classList.add('S=container-full');
					else __$el.classList.remove('S=container-full');

				}});
			}
			else {
				for (const __$canvas of $canvases) {
					var $target = mm.find(mm.selector(mm.string.template('.m\\.\\.\\.canvas-${TYPE}', { TYPE: __type })), __$canvas)[0];
					var _device = __$canvas.classList.contains('T=canvas-pc') ? 'pc' : 'mobile';

					if (__type === 'toolbar' && _device === 'pc') continue;

					mm.find('> i', $target)[0].remove();
					var $image = mm.element.create(mm.string.template('<i><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-lazyload></i>'))[0];
					mm.element.attribute(mm.find('img', $image)[0], { 'data-lazyload': { _src: __data[_device].thumbnail }});

					if (_device === 'pc') {
						if (__type === 'header') mm.find('.m\\.\\.\\.canvas-footer .m_lego-controller', __$canvas)[0].style.display = 'block';
						else mm.find('.m\\.\\.\\.canvas-header .m_lego-controller', __$canvas)[0].style.display = 'block';
					}

					mm.data.extend(__$el, base._dataName, { mui_id: __data.mui_id });
					$target.prepend($image);
				}

				mm.lazyload.update($build);
			}

			sidebar.popupClose();

		}
	}

}();
//> 블록

