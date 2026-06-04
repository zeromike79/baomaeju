/* franchise.js — 가맹 문의 폼 유효성 검사 */

(function () {
  'use strict';

  const form = document.getElementById('franchiseForm');
  if (!form) return;

  /* 전화번호 자동 포맷 (010-XXXX-XXXX) */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let val = this.value.replace(/[^0-9]/g, '');
      if (val.length > 11) val = val.slice(0, 11);
      if (val.length >= 8) {
        val = val.replace(/(\d{3})(\d{4})(\d{0,4})/, function (_, a, b, c) {
          return c ? a + '-' + b + '-' + c : a + '-' + b;
        });
      } else if (val.length >= 4) {
        val = val.replace(/(\d{3})(\d{0,4})/, '$1-$2');
      }
      this.value = val;
    });
  }

  /* 단일 필드 유효성 검사 */
  function validateField(input) {
    const group    = input.closest('.form-group');
    const errorMsg = group && group.querySelector('.form-error-msg');
    let   message  = '';

    if (input.hasAttribute('required') && !input.value.trim()) {
      message = '필수 입력 항목입니다.';
    } else if (input.id === 'phone' && input.value) {
      const phoneReg = /^010-\d{4}-\d{4}$/;
      if (!phoneReg.test(input.value)) {
        message = '010-XXXX-XXXX 형식으로 입력해 주세요.';
      }
    } else if (input.id === 'name' && input.value.trim().length < 2) {
      message = '이름을 2자 이상 입력해 주세요.';
    }

    if (input.type === 'checkbox') {
      if (input.required && !input.checked) message = '개인정보 수집 및 이용에 동의해 주세요.';
    }

    const isValid = !message;

    if (group)     group.classList.toggle('has-error', !isValid);
    if (input.type !== 'checkbox') input.classList.toggle('error', !isValid);
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.classList.toggle('show', !isValid);
    }

    return isValid;
  }

  /* 실시간 검사 (blur 시) */
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.classList.contains('error') || field.closest('.has-error')) {
        validateField(field);
      }
    });
  });

  /* 폼 제출 */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields    = form.querySelectorAll('input, select, textarea');
    let   allValid  = true;
    let   firstFail = null;

    fields.forEach(function (field) {
      if (!validateField(field)) {
        allValid = false;
        if (!firstFail) firstFail = field;
      }
    });

    if (!allValid) {
      if (firstFail) {
        firstFail.focus();
        firstFail.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    /* 제출 버튼 로딩 상태 */
    const submitBtn = form.querySelector('.form-submit');
    const origText  = submitBtn.textContent;
    submitBtn.disabled   = true;
    submitBtn.textContent = '전송 중…';

    /* 실제 API가 없으므로 1초 딜레이 후 완료 처리 */
    setTimeout(function () {
      alert('문의가 접수되었습니다.\n2영업일 내 연락드리겠습니다.\n감사합니다 🙏');
      form.reset();
      submitBtn.disabled   = false;
      submitBtn.textContent = origText;
    }, 1000);
  });

})();
