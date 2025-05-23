document.addEventListener('DOMContentLoaded', () => {
  // Form Elements
  const form = document.getElementById('insuranceForm');
  const sections = [
    document.getElementById('contactDetails'),
    document.getElementById('insuranceDetails'),
    document.getElementById('coverageAddons'),
    document.getElementById('paymentSelection'),
    document.getElementById('bankTransferSection'),
    document.getElementById('creditCardSection'),
    document.getElementById('debitAuthSection'),
    document.getElementById('thankYouSection')
  ];
  let currentSectionIndex = 0;
  let selectedPaymentMethod = ''; // 'bank', 'credit', or 'debit'

  const gardenType = document.getElementById('gardenType');
  const childrenCount = document.getElementById('childrenCount');
  const insuranceOptions = document.querySelectorAll('input[name="insuranceOptions"]');
  const contentBuildingSection = document.getElementById('contentBuildingSection');
  const thirdPartySection = document.getElementById('thirdPartySection');
  const teacherAccidentsSection = document.getElementById('teacherAccidentsSection');
  const employerLiabilitySection = document.getElementById('employerLiabilitySection');
  const incomeLossSection = document.getElementById('incomeLossSection');
  const afterSchoolProgramSection = document.getElementById('afterSchoolProgramSection');
  const isMemberCheckbox = document.getElementById('isMember');
  const membershipSection = document.getElementById('membershipSection');
  const membershipType = document.getElementById('membershipType');
  const hasLienCheckbox = document.getElementById('hasLien');
  const lienSection = document.getElementById('lienSection');
  const premiumAmount = document.getElementById('premiumAmount');
  const claimsLastYear = document.getElementById('claimsLastYear');


  // Navigation Button Text
  const nextButtonText = [
    'למעבר לפרטי הביטוח',
    'מעבר לתוספות כיסויים',
    'לצפייה בסכום ואישור'
  ];
  const backButtonText = [
    'חזור לפרטי קשר',
    'חזור לפרטי ביטוח',
    'חזור לתוספות כיסויים'
  ];

  function showSection(index) {
    console.log('Showing section index:', index);
    const currentSection = sections[currentSectionIndex];
    const nextSection = sections[index];
    const isForward = index > currentSectionIndex;

    if (currentSection) {
      // אפקט יציאה לפי כיוון
      currentSection.classList.remove('active');
      currentSection.classList.add(isForward ? 'form-section-exit-left' : 'form-section-exit-right');
    }

    // לאחר האנימציה - החלף סקשן
    setTimeout(() => {
      // הסר קלאסים של מעבר 
      sections.forEach((section, i) => {
        section.classList.remove('form-section-exit-left', 'form-section-exit-right', 'active');
        if (i === index) section.classList.add('active');
      });

      // עדכון כפתורים
      const nextButton = nextSection.querySelector('.next-button');
      const backButton = nextSection.querySelector('.back-button');
      if (nextButton) nextButton.textContent = nextButtonText[index];
      if (backButton) {
        const backText = backButtonText[index - 1];
        if (backText !== undefined) {
          backButton.textContent = backText;
        }
      }

      // עדכון פרמיה
      calculatePremium();

      // עדכון בר התקדמות
      const progressFill = document.getElementById('progressBarFill');
      if (progressFill) {
        const totalSteps = 6;

        let stepForProgress = index;

        // אם עברנו לעמוד תשלום (כרטיס אשראי, העברה בנקאית, הרשאה) – נחשב כאילו נשארנו בשלב 4
        if ([4, 5, 6].includes(index)) {
          stepForProgress = 4; // index 4 זה שלב תשלום (שלב 5 בפועל)
        }
        const percentage = Math.min((stepForProgress / (totalSteps - 1)) * 100, 100);
        progressFill.style.width = `${percentage}%`;
      }

      // 🟩 יוזם את הקאנבס רק כשהוא נטען בפועל
      if (index === 4) initSignatureCanvas('signatureCanvasBank');
      if (index === 5) initSignatureCanvas('signatureCanvasCredit');
      if (index === 6) initSignatureCanvas('signatureCanvasDebit');


      currentSectionIndex = index;
    }, 400); // זמן תואם ל־CSS transition
  }


  // Navigation Event Listeners
  document.querySelectorAll('.next-button').forEach(button => {
    button.addEventListener('click', () => {
      console.log('Next button clicked, currentSectionIndex:', currentSectionIndex);
      if (currentSectionIndex < sections.length - 1) {
        let isValid = true;
        const currentInputs = sections[currentSectionIndex].querySelectorAll('input:required, select:required');
        console.log('Required inputs:', currentInputs.length);
        currentInputs.forEach(input => {
          const value = input.value.trim();
          if (value === '') {
            isValid = false;
            input.setCustomValidity('אנא מלא את שדה החובה.');
            input.reportValidity();
            input.style.borderColor = 'red';
            console.log(`Invalid input: ${input.id}, value: "${value}"`);
          } else {
            input.setCustomValidity('');
            input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }
        });
        if (isValid) {
          currentSectionIndex++;
          console.log('Moving to section:', currentSectionIndex);
          showSection(currentSectionIndex);
        } else {
          alert('אנא מלא את כל השדות הנדרשים.');
        }
      }
    });

    // Handle payment method buttons
    document.querySelector('.credit-button').addEventListener('click', () => {
      selectedPaymentMethod = 'credit';
      currentSectionIndex = 5; // creditCardSection
      showSection(currentSectionIndex);
    });

    document.querySelector('.bank-button').addEventListener('click', () => {
      selectedPaymentMethod = 'bank';
      currentSectionIndex = 4; // bankTransferSection
      showSection(currentSectionIndex);
    });

    document.querySelector('.debit-auth-button').addEventListener('click', () => {
      selectedPaymentMethod = 'debit';
      currentSectionIndex = 6; // debitAuthSection
      showSection(currentSectionIndex);
    });

    // Handle "Back to payment selection" buttons
    document.querySelectorAll('#bankTransferSection .back-button, #creditCardSection .back-button, #debitAuthSection .back-button')
      .forEach(button => {
        button.addEventListener('click', () => {
          currentSectionIndex = 4; // paymentSelection
          showSection(currentSectionIndex);
        });
      });

  });

  document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', () => {
      if (currentSectionIndex > 0) {
        currentSectionIndex--;
        console.log('Moving back to section:', currentSectionIndex);
        showSection(currentSectionIndex);
      }
    });
  });

  document.getElementById('bankTransferProof').addEventListener('change', function () {
    const fileName = this.files[0]?.name || '';
    document.getElementById('bankFileName').textContent = fileName ? `נבחר קובץ: ${fileName}` : '';
  });

  document.getElementById('debitAuthUpload').addEventListener('change', function () {
    const fileName = this.files[0]?.name || '';
    document.getElementById('debitFileName').textContent = fileName ? `נבחר קובץ: ${fileName}` : '';
  });


  // Conditional Sections Logic
  insuranceOptions.forEach(option => {
    option.addEventListener('change', () => {
      contentBuildingSection.style.display = document.querySelector('input[value="contentBuilding"]').checked ? 'block' : 'none';
      thirdPartySection.style.display = document.querySelector('input[value="thirdParty"]').checked ? 'block' : 'none';
      teacherAccidentsSection.style.display = document.querySelector('input[value="teacherAccidents"]').checked ? 'block' : 'none';
      employerLiabilitySection.style.display = document.querySelector('input[value="employerLiability"]').checked ? 'block' : 'none';
      incomeLossSection.style.display = document.querySelector('input[value="incomeLoss"]').checked ? 'block' : 'none';
      afterSchoolProgramSection.style.display = document.querySelector('input[value="afterSchoolProgram"]').checked ? 'block' : 'none';
      calculatePremium();
    });
  });

  if (hasLienCheckbox) {
    hasLienCheckbox.addEventListener('change', () => {
      lienSection.style.display = hasLienCheckbox.checked ? 'block' : 'none';
    });
  }
  if (isMemberCheckbox) {
    isMemberCheckbox.addEventListener('change', () => {
      membershipSection.style.display = isMemberCheckbox.checked ? 'block' : 'none';
      calculatePremium();
    });
  }
  if (membershipType) {
    membershipType.addEventListener('change', calculatePremium);
  }

  // Function to toggle visibility and required attributes of sections
  function toggleSection(section, isVisible) {
    section.style.display = isVisible ? 'block' : 'none';
    const inputs = section.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.required = isVisible;
    });
  }

  // Function to update available insurance options based on garden type
  function updateInsuranceOptions() {
    const gardenTypeValue = gardenType.value;
    const options = {
      contentBuilding: false,
      thirdParty: false,
      deductibleCancellation: false,
      teacherAccidents: false,
      professionalLiability: false,
      employerLiability: false,
      cyberInsurance: false,
      incomeLoss: false,
      afterSchoolProgram: false
    };

    switch (gardenTypeValue) {
      case 'tamah': // מסלול 1
        options.deductibleCancellation = true;
        options.teacherAccidents = true;
        options.afterSchoolProgram = true;
        break;
      case 'privateFamily': // מסלול 2, 3, 4
        options.thirdParty = true;
        options.deductibleCancellation = true;
        options.teacherAccidents = true;
        options.professionalLiability = true;
        options.employerLiability = true;
        options.cyberInsurance = true;
        options.afterSchoolProgram = true;
        break;
      case 'upTo3': // מסלול 7
        options.contentBuilding = true;
        options.thirdParty = true;
        options.deductibleCancellation = true;
        options.teacherAccidents = true;
        options.professionalLiability = true;
        options.employerLiability = true;
        options.cyberInsurance = true;
        options.incomeLoss = true;
        break;
      case 'over3': // מסלול 5, 6
      case 'afterSchool':
        options.contentBuilding = gardenTypeValue === 'over3';
        options.thirdParty = true;
        options.deductibleCancellation = true;
        options.teacherAccidents = true;
        options.professionalLiability = true;
        options.employerLiability = true;
        options.cyberInsurance = true;
        options.afterSchoolProgram = true;
        break;
    }

    insuranceOptions.forEach(checkbox => {
      const isEnabled = options[checkbox.value];
      checkbox.disabled = !isEnabled;
      if (!isEnabled && checkbox.checked) {
        checkbox.checked = false;
        toggleSection(document.getElementById(`${checkbox.value}Section`), false);
      }
    });

    // Update section visibility based on enabled and checked options
    insuranceOptions.forEach(checkbox => {
      if (options[checkbox.value] && checkbox.checked) {
        toggleSection(document.getElementById(`${checkbox.value}Section`), true);
      }
    });
  }

  // Premium Calculation
  function calculatePremium() {
    const gardenTypeValue = gardenType.value;
    const childrenCountValue = parseInt(childrenCount.value) || 0;
    let premium = 0;
    let totalDiscount = 0;

    if (!gardenTypeValue || childrenCountValue < 1) {
      premiumAmount.textContent = '0 ₪';
      const discountDisplay = document.getElementById('discountDisplay');
      if (discountDisplay) discountDisplay.textContent = '';
      return;
    }

    switch (gardenTypeValue) {
      case 'tamah': // מסלול 1
        if (childrenCountValue <= 6) premium = 500;
        else if (childrenCountValue <= 10) premium = 1000;
        else premium = 1000 + (childrenCountValue - 10) * 100;
        break;

      case 'privateFamily': // מסלול 2, 3, 4
        if (childrenCountValue <= 6) premium = 650; // מסלול 2
        else if (childrenCountValue <= 8) premium = 900; // מסלול 3
        else if (childrenCountValue === 9) premium = 900 + 105; // מסלול 3
        else {
          premium = 1100 + (childrenCountValue - 10) * 110; // מסלול 4
          if (isMemberCheckbox && isMemberCheckbox.checked) {
            const discount = (childrenCountValue - 10) * 10;
            totalDiscount += discount;
            premium = Math.max(1100, premium - discount);
          }
        }
        break;

      case 'upTo3': // מסלול 7
        premium = 1400;
        if (childrenCountValue > 12) premium += (childrenCountValue - 12) * 120;
        if (isMemberCheckbox && isMemberCheckbox.checked) {
          const discount = childrenCountValue * 10;
          totalDiscount += discount;
          premium = Math.max(1400, premium - discount);
        }
        break;

      case 'over3':
      case 'afterSchool':
        const hasContentBuilding = document.querySelector('input[value="contentBuilding"]').checked;
        if (hasContentBuilding) { // מסלול 6
          premium = 1400;
          if (childrenCountValue > 17) premium += (childrenCountValue - 17) * 80;
          if (isMemberCheckbox && isMemberCheckbox.checked) {
            const discount6 = childrenCountValue * 5;
            totalDiscount += discount6;
            premium = Math.max(1400, premium - discount6);
          }
        } else { // מסלול 5
          premium = 1100;
          if (childrenCountValue > 20) premium += (childrenCountValue - 20) * 55;
          if (isMemberCheckbox && isMemberCheckbox.checked) {
            const discount5 = childrenCountValue * 5;
            totalDiscount += discount5;
            premium = Math.max(1100, premium - discount5);
          }
        }
        break;
    }

    if (document.querySelector('input[value="contentBuilding"]').checked) {
      const contentSum = parseFloat(document.getElementById('contentSum').value.replace(/[^0-9.]/g, '')) || 0;
      if (contentSum > 200000) premium += (contentSum - 200000) * 0.001;
    }

    if (document.querySelector('input[value="thirdParty"]').checked) {
      const coverage = document.getElementById('thirdPartyCoverage').value;
      if (childrenCountValue <= 20) {
        premium += coverage === '5M' ? 200 : coverage === '8M' ? 1000 : 2000;
      } else {
        premium += coverage === '5M' ? 300 : coverage === '8M' ? 1000 : 2000;
      }
    }

    if (document.querySelector('input[value="deductibleCancellation"]').checked) {
      premium += childrenCountValue <= 20 ? 200 : 300;
    }

    if (document.querySelector('input[value="teacherAccidents"]').checked) {
      const plan = document.getElementById('teacherAccidentsCoverage').value;
      premium += plan === 'A' ? 200 : plan === 'B' ? 600 : 800;
    }

    if (document.querySelector('input[value="professionalLiability"]').checked) {
      premium += 250;
    }

    if (document.querySelector('input[value="employerLiability"]').checked) {
      const employeeType = document.getElementById('employerLiabilityCoverage').value;
      premium += employeeType === 'regular' ? 105 : 500;
    }

    if (document.querySelector('input[value="cyberInsurance"]').checked) {
      premium += 450;
    }

    if (document.querySelector('input[value="incomeLoss"]').checked) {
      const duration = document.getElementById('incomeLossDuration').value;
      premium += duration === '3' ? 500 : duration === '6' ? 900 : 1500;
    }

    if (document.querySelector('input[value="afterSchoolProgram"]').checked) {
      const afterSchoolChildren = parseInt(document.getElementById('afterSchoolChildrenCount').value) || 0;
      if (afterSchoolChildren <= 20) {
        premium += 500;
      } else {
        premium += 500 + (afterSchoolChildren - 20) * 25;
      }
    }

    premiumAmount.textContent = `${premium.toLocaleString()} ₪`;

    const discountDisplay = document.getElementById('discountDisplay');
    if (discountDisplay) {
      discountDisplay.textContent = totalDiscount > 0 ? `הנחה שהתקבלה: ${totalDiscount.toLocaleString()} ₪` : '';
    }
  }

  function initSignatureCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;

    function getXY(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      const pos = getXY(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });
    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      const pos = getXY(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    });
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);

    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      drawing = true;
      const pos = getXY(touch);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });
    canvas.addEventListener('touchmove', (e) => {
      if (!drawing) return;
      const touch = e.touches[0];
      const pos = getXY(touch);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    });
    canvas.addEventListener('touchend', () => drawing = false);
  }

  window.clearSignature = function (type) {
    const canvas = document.getElementById(`signatureCanvas${type}`);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };


  function getSignatureDataURL(type) {
    const canvas = document.getElementById(`signatureCanvas${type}`);
    return canvas ? canvas.toDataURL('image/png') : '';
  }

  function isCanvasEmpty(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return true;
    const ctx = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    return !pixelBuffer.some(color => color !== 0);
  }


  gardenType.addEventListener('change', () => {
    updateInsuranceOptions();
    calculatePremium();
  });
  childrenCount.addEventListener('input', calculatePremium);
  document.querySelectorAll('#thirdPartyCoverage, #teacherAccidentsCoverage, #employerLiabilityCoverage, #incomeLossDuration, #afterSchoolChildrenCount').forEach(input => input.addEventListener('change', calculatePremium));

  // Prefill Form from URL Parameters
  const urlParams = new URLSearchParams(window.location.search);

  const fieldsToPrefill = [
    'gardenName',
    'gardenType',
    'address',
    'policyNumber',
    'childrenCount',
    'customerName',
    'emailAddress',
    'phoneNumber',
    'contentSum',
    'buildingSum',
    'yardContentSum',
    'buildingType',
    'lienHolder',
    'thirdPartyCoverage',
    'teacherAccidentsCoverage',
    'employerLiabilityCoverage',
    'incomeLossDuration',
    'afterSchoolChildrenCount',
    'membershipType'
  ];

  const checkboxFields = [
    'claimsLastYear',
    'hasLien',
    'contentBuilding',
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'incomeLoss',
    'afterSchoolProgram',
    'isMember',
  ];

  fieldsToPrefill.forEach(field => {
    const value = urlParams.get(field);
    if (value) {
      const input = document.getElementById(field);
      if (input) {
        if (input.tagName === 'SELECT') {
          const validOptions = Array.from(input.options).map(option => option.value);
          if (validOptions.includes(value)) {
            input.value = value;
          }
        } else {
          input.value = decodeURIComponent(value);
        }
      }
    }
  });

  checkboxFields.forEach(field => {
    const value = urlParams.get(field);
    if (value) {
      const input = document.getElementById(field) || document.querySelector(`input[name="insuranceOptions"][value="${field}"]`);
      if (input && input.type === 'checkbox') {
        const isChecked = ['true', '1', field].includes(value.toLowerCase());
        input.checked = isChecked;
        const event = new Event('change');
        input.dispatchEvent(event);
      }
    }
  });

  // Tooltip and Popup Logic
  const infoButtons = document.querySelectorAll('.info-button');
  let activeTooltip = null;

  infoButtons.forEach(button => {
    if (button.hasAttribute('data-tooltip')) {
      button.addEventListener('mouseenter', (e) => {
        if (activeTooltip) {
          activeTooltip.remove();
        }
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = button.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        const rect = button.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const buttonOffsetTop = rect.top + window.scrollY;
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${buttonOffsetTop - (tooltipRect.height / 2) + (rect.height / 2)}px`;
        tooltip.style.left = `${rect.left + window.scrollX - tooltipRect.width - 10}px`;
        document.body.appendChild(tooltip);

        activeTooltip = tooltip;
      });
      button.addEventListener('mouseleave', () => {
        if (activeTooltip) {
          activeTooltip.remove();
          activeTooltip = null;
        }
      });
    }
    if (button.hasAttribute('data-popup')) {
      button.addEventListener('click', () => {
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';
        document.body.appendChild(popupOverlay);
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `<div class="popup-content">${button.getAttribute('data-popup')}</div><button class="popup-close">סגור</button>`;
        document.body.appendChild(popup);
        popupOverlay.style.display = 'block';
        popup.style.display = 'block';
        popup.querySelector('.popup-close').addEventListener('click', () => {
          popup.remove();
          popupOverlay.remove();
        });
        popupOverlay.addEventListener('click', () => {
          popup.remove();
          popupOverlay.remove();
        });
      });
    }
  });

  // Function to collect form data
  function collectFormData() {
    const formData = {
      gardenName: document.getElementById('gardenName')?.value || '',
      gardenType: document.getElementById('gardenType')?.value || '',
      address: document.getElementById('address')?.value || '',
      policyNumber: document.getElementById('policyNumber')?.value || '',
      childrenCount: parseInt(document.getElementById('childrenCount')?.value) || 0,
      customerName: document.getElementById('customerName')?.value || '',
      emailAddress: document.getElementById('emailAddress')?.value || '',
      phoneNumber: document.getElementById('phoneNumber')?.value || '',
      claimsLastYear: document.querySelector('input[value="claimsLastYear"]')?.checked || false,
      isMember: isMemberCheckbox?.checked || false,
      membershipType: isMemberCheckbox?.checked ? membershipType?.value : '',
      premium: parseInt(premiumAmount?.textContent?.replace(/[^0-9]/g, '')) || 0,
      paymentMethod: selectedPaymentMethod || ''
    };

    formData.insuranceOptions = {
      contentBuilding: document.querySelector('input[value="contentBuilding"]')?.checked || false,
      thirdParty: document.querySelector('input[value="thirdParty"]')?.checked || false,
      deductibleCancellation: document.querySelector('input[value="deductibleCancellation"]')?.checked || false,
      teacherAccidents: document.querySelector('input[value="teacherAccidents"]')?.checked || false,
      professionalLiability: document.querySelector('input[value="professionalLiability"]')?.checked || false,
      employerLiability: document.querySelector('input[value="employerLiability"]')?.checked || false,
      cyberInsurance: document.querySelector('input[value="cyberInsurance"]')?.checked || false,
      incomeLoss: document.querySelector('input[value="incomeLoss"]')?.checked || false,
      afterSchoolProgram: document.querySelector('input[value="afterSchoolProgram"]')?.checked || false
    };

    // פרטי ביטוח מורכבים
    if (formData.insuranceOptions.contentBuilding) {
      formData.contentBuildingDetails = {
        contentSum: document.getElementById('contentSum')?.value || '',
        buildingSum: document.getElementById('buildingSum')?.value || '',
        yardContentSum: document.getElementById('yardContentSum')?.value || '',
        buildingType: document.getElementById('buildingType')?.value || '',
        hasLien: hasLienCheckbox?.checked || false,
        lienHolder: hasLienCheckbox?.checked ? document.getElementById('lienHolder')?.value || '' : ''
      };
    }

    if (formData.insuranceOptions.thirdParty) {
      formData.thirdPartyDetails = document.getElementById('thirdPartyCoverage')?.value || '';
    }

    if (formData.insuranceOptions.teacherAccidents) {
      formData.teacherAccidentsDetails = document.getElementById('teacherAccidentsCoverage')?.value || '';
    }

    if (formData.insuranceOptions.employerLiability) {
      formData.employerLiabilityDetails = document.getElementById('employerLiabilityCoverage')?.value || '';
    }

    if (formData.insuranceOptions.incomeLoss) {
      formData.incomeLossDetails = document.getElementById('incomeLossDuration')?.value || '';
    }

    if (formData.insuranceOptions.afterSchoolProgram) {
      formData.afterSchoolProgramDetails = document.getElementById('afterSchoolChildrenCount')?.value || '';
    }

    if (selectedPaymentMethod === 'bank') {
      formData.signatureImage = getSignatureDataURL('Bank');
    } else if (selectedPaymentMethod === 'credit') {
      formData.signatureImage = getSignatureDataURL('Credit');
    } else if (selectedPaymentMethod === 'debit') {
      formData.signatureImage = getSignatureDataURL('Debit');
    }

    return formData;
  }



  // Function to send data to webhook
  async function sendToWebhook(formValues) {
    const formData = new FormData();

    // הוספת שדות רגילים ואובייקטים מפורקים
    Object.entries(formValues).forEach(([key, value]) => {
      if (
        typeof value === 'object' &&
        value !== null &&
        !(value instanceof File)
      ) {
        // אם זה אובייקט פנימי (כמו insuranceOptions או contentBuildingDetails)
        Object.entries(value).forEach(([subKey, subValue]) => {
          formData.append(`${key}[${subKey}]`, subValue);
        });
      } else {
        formData.append(key, value);
      }
    });

    // צירוף קובץ לפי שיטת התשלום
    if (formValues.paymentMethod === 'bank') {
      const file = document.getElementById('bankTransferProof')?.files[0];
      if (file) {
        formData.append('proofFile', file);
      }
    } else if (formValues.paymentMethod === 'debit') {
      const file = document.getElementById('debitAuthUpload')?.files[0];
      if (file) {
        formData.append('proofFile', file);
      }
    }
    if (selectedPaymentMethod === 'credit' && isCanvasEmpty('signatureCanvasCredit')) {
      alert('יש לחתום לפני המשך התשלום בכרטיס אשראי');
      return;
    }
    if (selectedPaymentMethod === 'bank' && isCanvasEmpty('signatureCanvasBank')) {
      alert('יש לחתום לפני המשך תשלום בהעברה בנקאית');
      return;
    }
    if (selectedPaymentMethod === 'debit' && isCanvasEmpty('signatureCanvasDebit')) {
      alert('יש לחתום לפני המשך בהרשאה לחיוב חשבון');
      return;
    }


    // שליחה ל-Make Webhook
    try {
      const response = await fetch('https://hook.eu2.make.com/c8jk8qsq7mnwtdg5aevxvxhdg8m3yocw', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('השליחה ל-Webhook נכשלה');
      }
      showSection(7); // Show thank you section
      return await response.ok;
    } catch (error) {
      console.error('שגיאה בשליחה ל-Make:', error);
      throw error;
    }
  }



  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    const visibleInputs = form.querySelectorAll('input:required, select:required');
    visibleInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.setCustomValidity('אנא מלא את שדה החובה.');
        input.reportValidity();
        input.style.borderColor = 'red';
      } else {
        input.setCustomValidity('');
        input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      }
    });

    if (isValid) {
      try {
        const formData = collectFormData();
        await sendToWebhook(formData);

        Object.values({ contentBuildingSection, thirdPartySection, teacherAccidentsSection, employerLiabilitySection, incomeLossSection, afterSchoolProgramSection }).forEach(section => section.style.display = 'none');
        lienSection.style.display = 'none';
        premiumAmount.textContent = '0 ₪';
      } catch (error) {
        alert('שגיאה בשליחת הטופס. אנא נסה שוב.');
      }
    } else {
      alert('אנא מלא את כל השדות הנדרשים.');
    }
  });

  // Clear custom validity on input
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      input.setCustomValidity('');
      input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
  });

  // Initialize
  updateInsuranceOptions();
  calculatePremium();
  showSection(currentSectionIndex);

});



