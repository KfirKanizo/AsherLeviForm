const form = document.getElementById('insuranceForm');
const gardenType = document.getElementById('gardenType');
const childrenCount = document.getElementById('childrenCount');
const premiumAmount = document.getElementById('premiumAmount');
const isMemberCheckbox = document.getElementById('isMember');
const membershipSection = document.getElementById('membershipSection');
let selectedPaymentMethod = '';

const sections = [
  document.getElementById('contactDetails'),
  document.getElementById('insuranceDetails'),
  document.getElementById('contentBuildingSection'),
  document.getElementById('coverageAddons'),
  document.getElementById('paymentSelection'),
  document.getElementById('bankTransferSection'),
  document.getElementById('creditCardSection'),
  document.getElementById('debitAuthSection'),
  document.getElementById('thankYouSection')
];
let currentSectionIndex = 0;

const availableOptions = {
  'tamah': [
    'deductibleCancellation',
    'teacherAccidents',
    'afterSchoolProgram'
  ],
  'privateFamily': [
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'afterSchoolProgram'
  ],
  'upTo3': [
    'contentBuilding',
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'incomeLoss'
  ],
  'over3': [
    'contentBuilding',
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'afterSchoolProgram'
  ],
  'afterSchool': [
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'afterSchoolProgram'
  ]
};


function showSection(index) {
  const currentSection = sections[currentSectionIndex];
  const nextSection = sections[index];
  const isForward = index > currentSectionIndex;

  if (currentSection) {
    currentSection.classList.remove('active');
    currentSection.classList.add(isForward ? 'form-section-exit-left' : 'form-section-exit-right');
  }

  setTimeout(() => {
    sections.forEach((section, i) => {
      section.classList.remove('form-section-exit-left', 'form-section-exit-right', 'active');
      if (i === index) section.classList.add('active');
    });

    if (index === 2 || index === 3) updateCoverageOptions();
    const premiumDisplay = document.getElementById('premiumDisplay');
    if (premiumDisplay) premiumDisplay.style.display = [2, 3, 4].includes(index) ? 'block' : 'none';

    calculatePremium();

    const progressFill = document.getElementById('progressBarFill');
    if (progressFill) {
      const totalSteps = 6; // Total number of steps excluding thank you section
      let stepForProgress = index;
      if ([5, 6, 7].includes(index)) stepForProgress = 4;
      const percentage = Math.min((stepForProgress / (totalSteps - 1)) * 100, 100);
      progressFill.style.width = `${percentage}%`;
    }

    // עדכון נכון לסקשנים של החתימה
    if (index === 5) initSignatureCanvas('signatureCanvasBank');
    if (index === 6) initSignatureCanvas('signatureCanvasCredit');
    if (index === 7) initSignatureCanvas('signatureCanvasDebit');

    currentSectionIndex = index;
  }, 400);
}


document.querySelectorAll('.next-button').forEach(button => {
  button.addEventListener('click', () => {
    let isValid = true;
    const currentInputs = sections[currentSectionIndex].querySelectorAll('input:required, select:required');
    currentInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      }
    });

    if (!isValid) {
      alert('אנא מלא את כל השדות הנדרשים.');
      return;
    }

    // דילוג קדימה על עמוד ביטוח תכולה ומבנה, אם הצ'קבוקס לא מסומן
    if (sections[currentSectionIndex].id === 'insuranceDetails') {
      const hasContentBuilding = document.getElementById('hasContentBuilding');
      // אם הצ'קבוקס לא מסומן – עבור ישירות לעמוד תוספות כיסוי
      if (hasContentBuilding && !hasContentBuilding.checked) {
        const contentSectionIndex = sections.findIndex(sec => sec.id === 'contentBuildingSection');
        const addonsSectionIndex = sections.findIndex(sec => sec.id === 'coverageAddons');
        // אם כרגע בעמוד insuranceDetails והבא בתור זה contentBuildingSection – מדלגים עליו
        if (contentSectionIndex === currentSectionIndex + 1 && addonsSectionIndex !== -1) {
          currentSectionIndex = addonsSectionIndex;
          showSection(currentSectionIndex);
          return;
        }
      }
    }

    // הפלואו הרגיל: עמוד תוספות כיסוי מאפשר חזרה לביטוח תכולה אם צריך (ולא משנה התנהגות אחורה)
    if (sections[currentSectionIndex].id === 'coverageAddons') {
      const hasContentBuilding = document.getElementById('hasContentBuilding');
      const contentIndex = sections.findIndex(sec => sec.id === 'contentBuildingSection');
      // במידה ובחר כן – חוזרים למסך ביטוח תכולה
      if (hasContentBuilding && hasContentBuilding.checked && contentIndex !== -1) {
        showSection(contentIndex);
        return;
      }
    }

    if (currentSectionIndex < sections.length - 1) {
      currentSectionIndex++;
      showSection(currentSectionIndex);
    }
  });
});


document.querySelectorAll('.back-button').forEach(button => {
  button.addEventListener('click', () => {
    // בדיקה מיוחדת למסך תוספות כיסוי:
    if (sections[currentSectionIndex].id === 'coverageAddons') {
      const hasContentBuilding = document.getElementById('hasContentBuilding');
      if (hasContentBuilding && !hasContentBuilding.checked) {
        // חזור ישר למסך פרטי ביטוח
        const insuranceDetailsIndex = sections.findIndex(sec => sec.id === 'insuranceDetails');
        if (insuranceDetailsIndex !== -1) {
          currentSectionIndex = insuranceDetailsIndex;
          showSection(currentSectionIndex);
          return;
        }
      }
    }

    // הפלואו הרגיל:
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
      showSection(currentSectionIndex);
    }
  });
});


document.querySelectorAll('#bankTransferSection .back-button, #creditCardSection .back-button, #debitAuthSection .back-button')
  .forEach(button => {
    button.addEventListener('click', () => {
      showSection(4); // אינדקס של paymentSelection
    });
  });


document.querySelector('.bank-button').addEventListener('click', () => {
  selectedPaymentMethod = 'bank';
  currentSectionIndex = 5;
  showSection(5);
});

document.querySelector('.credit-button').addEventListener('click', () => {
  selectedPaymentMethod = 'credit';
  currentSectionIndex = 6;
  showSection(6);
});

document.querySelector('.debit-auth-button').addEventListener('click', () => {
  selectedPaymentMethod = 'debit';
  currentSectionIndex = 7;
  showSection(7);
});

if (isMemberCheckbox && membershipSection) {
  isMemberCheckbox.addEventListener('change', () => {
    membershipSection.style.display = isMemberCheckbox.checked ? 'block' : 'none';
    calculatePremium();
  });
  // טעינה ראשונית
  membershipSection.style.display = isMemberCheckbox.checked ? 'block' : 'none';
}

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


function updateCoverageOptions() {
  const gardenTypeValue = gardenType.value;
  const container = document.getElementById('coverageOptionsContainer');
  container.innerHTML = '';
  const templates = document.getElementById('coverageOptionsTemplates');
  const options = availableOptions[gardenTypeValue] || [];
  options.forEach(option => {
    const template = templates.querySelector(`#coverage-${option}`);
    if (template) {
      const clone = template.cloneNode(true);
      container.appendChild(clone);
      addEventListenersToOption(clone);
    }
  });
  calculatePremium();
  setupPersonalAccidentEmployees();
}

function addEventListenersToOption(optionDiv) {
  const optionName = optionDiv.dataset.option;
  const interestedButton = optionDiv.querySelector('.interested-button');
  const notInterestedButton = optionDiv.querySelector('.not-interested-button');
  const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
  let conditionalSection = optionDiv.querySelector('.conditional-section');

  // הגנה: אם חסר אחד האלמנטים החיוניים – לא לעשות כלום
  if (!interestedButton || !notInterestedButton || !hiddenInput) {
    console.warn('יש בעיה ב-option:', optionName, optionDiv);
    return;
  }

  // מניעת listeners כפולים (במיוחד במצבים של רינדור דינאמי)
  interestedButton.replaceWith(interestedButton.cloneNode(true));
  notInterestedButton.replaceWith(notInterestedButton.cloneNode(true));
  // צריך לבחור מחדש אחרי ה-replace
  const newInterestedButton = optionDiv.querySelector('.interested-button');
  const newNotInterestedButton = optionDiv.querySelector('.not-interested-button');

  // אם אין שדות בתוך ה־conditional-section, נבטל את ההתייחסות אליו
  if (conditionalSection && conditionalSection.children.length === 0) {
    conditionalSection.remove();
    conditionalSection = null;
  }

  newInterestedButton.addEventListener('click', () => {
    hiddenInput.value = 'true';
    newInterestedButton.classList.add('selected');
    newNotInterestedButton.classList.remove('selected');
    if (conditionalSection) conditionalSection.style.display = 'block';
    // לוג לבדיקת תקינות
    console.log(`[${optionName}] -> TRUE`);
    calculatePremium();
  });

  newNotInterestedButton.addEventListener('click', () => {
    hiddenInput.value = 'false';
    newNotInterestedButton.classList.add('selected');
    newInterestedButton.classList.remove('selected');
    if (conditionalSection) conditionalSection.style.display = 'none';
    console.log(`[${optionName}] -> FALSE`);
    calculatePremium();
  });

  // טריגר חישוב בעת שינוי שדות תנאי
  optionDiv.querySelectorAll('.conditional-section input, .conditional-section select').forEach(input => {
    input.addEventListener('change', calculatePremium);
  });

  // טיפול בשעבוד (אם יש)
  const hasLienCheckbox = document.getElementById('hasLien');
  const lienHolderInput = document.getElementById('lienHolderInput');
  if (hasLienCheckbox && lienHolderInput) {
    hasLienCheckbox.addEventListener('change', () => {
      lienHolderInput.style.display = hasLienCheckbox.checked ? 'block' : 'none';
    });
    // במידה ויש ערך טעון - להראות את השדה בטעינה
    lienHolderInput.style.display = hasLienCheckbox.checked ? 'block' : 'none';
  }
}


function calculatePremium() {
  const gardenTypeValue = gardenType.value;
  const childrenCountValue = parseInt(childrenCount.value) || 0;
  let basePremium = 0;

  // בדיקת ביטוח תכולה ומבנה
  const hasContentBuilding = document.getElementById('hasContentBuilding');
  const includeContentBuilding = hasContentBuilding ? hasContentBuilding.checked : true;

  // אם אין גן או אין ילדים, תמיד 0
  if (!gardenTypeValue || childrenCountValue < 1) {
    premiumAmount.textContent = '0 ₪';
    const discountDisplay = document.getElementById('discountDisplay');
    if (discountDisplay) discountDisplay.textContent = '';
    return;
  }

  // חישוב פרמיה בסיסית — רק אם יש ביטוח תכולה ומבנה
  if (includeContentBuilding) {
    switch (gardenTypeValue) {
      case 'tamah': // מסלול 1
        basePremium = childrenCountValue <= 6 ? 500 : childrenCountValue <= 10 ? 1000 : 1000 + (childrenCountValue - 10) * 100;
        break;
      case 'privateFamily': // מסלול 2, 3, 4
        if (childrenCountValue <= 6) basePremium = 650; // מסלול 2
        else if (childrenCountValue <= 8) basePremium = 900; // מסלול 3
        else if (childrenCountValue === 9) basePremium = 900 + 105; // מסלול 3
        else basePremium = 1100 + (childrenCountValue - 10) * 110; // מסלול 4
        break;
      case 'upTo3': // מסלול 7
        basePremium = 1400 + (childrenCountValue > 12 ? (childrenCountValue - 12) * 120 : 0);
        break;
      case 'over3': // מסלול 5, 6
      case 'afterSchool':
        basePremium = 1100 + (childrenCountValue > 20 ? (childrenCountValue - 20) * 55 : 0);
        break;
    }
  } else {
    basePremium = 0; // אין פרמיה בסיסית כלל
  }

  // חישוב הנחת מועדון
  const isMemberCheckbox = document.getElementById('isMember');
  let totalDiscount = 0;
  let minPremium = basePremium;

  if (includeContentBuilding && isMemberCheckbox && isMemberCheckbox.checked) {
    // בדיקה – באילו מסלולים יש הנחה
    if (gardenTypeValue === 'privateFamily' && childrenCountValue > 8) {
      // מסלול 4 – כל ילד (מעל 8)
      totalDiscount = childrenCountValue * 10;
      minPremium = 1100;
    } else if (gardenTypeValue === 'upTo3') {
      // מסלול 7
      totalDiscount = childrenCountValue * 10;
      minPremium = 1400;
    } else if (gardenTypeValue === 'over3' || gardenTypeValue === 'afterSchool') {
      // מסלול 5,6
      totalDiscount = childrenCountValue * 5;
      minPremium = 1100;
    }
  }

  let totalPremium = Math.max(basePremium - totalDiscount, minPremium);

  // תוספות כיסויים
  document.querySelectorAll('.coverage-option').forEach(optionDiv => {
    const optionName = optionDiv.dataset.option;
    const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    const cost = getOptionCost(optionName);

    // כיסוי ביטוח תכולה ומבנה — לא להוסיף אם לא נבחר בכלל הביטוח
    if (optionName === 'contentBuilding' && !includeContentBuilding) {
      optionDiv.querySelector('.option-cost').textContent = `מחיר: ₪0`;
      return;
    }

    if (hiddenInput?.value === 'true') totalPremium += cost;
    optionDiv.querySelector('.option-cost').textContent = `מחיר: ₪${cost.toLocaleString()}`;
  });

  premiumAmount.textContent = `${totalPremium.toLocaleString()} ₪`;

  // תצוגת הנחה
  const discountDisplay = document.getElementById('discountDisplay');
  if (discountDisplay) {
    discountDisplay.textContent = totalDiscount > 0 ? `הנחת מועדון: ₪${totalDiscount}` : '';
  }
}


function getOptionCost(optionName) {
  const gardenTypeValue = gardenType.value;
  const childrenCountValue = parseInt(childrenCount.value) || 0;
  let cost = 0;

  switch (optionName) {
    case 'contentBuilding':
      cost = gardenTypeValue === 'over3' ? 300 : 0;
      const contentSum = parseFloat(document.querySelector('.contentSum')?.value.replace(/[^0-9.]/g, '')) || 0;
      if (contentSum > 200000) cost += (contentSum - 200000) * 0.001;
      return cost;

    case 'thirdParty':
      const coverage = document.querySelector('.thirdPartyCoverage')?.value || '5M';
      return childrenCountValue <= 20 ? (coverage === '5M' ? 200 : coverage === '8M' ? 1000 : 2000)
        : (coverage === '5M' ? 300 : coverage === '8M' ? 1000 : 2000);

    case 'deductibleCancellation':
      return childrenCountValue <= 20 ? 200 : 300;

    case 'teacherAccidents':
      const plan = document.querySelector('.teacherAccidentsCoverage')?.value || 'A';
      // חישוב מחיר בסיסי
      let basePrice = plan === 'A' ? 200 : plan === 'B' ? 600 : 800;
      // כמות גננות
      const paCount = document.querySelectorAll('input[name="personalAccidentEmployeeName[]"]').length || 1;
      return basePrice * paCount;


    case 'professionalLiability':
      return 250;

    case 'employerLiability':
      // חישוב עבור עובדים נוספים
      let countRegular = 1; // תמיד עובד אחד לפחות (ברירת מחדל)
      let countCertified = 0;
      const allTypes = Array.from(document.querySelectorAll('select[name="employeeType[]"]')).map(e => e.value);
      countRegular += allTypes.filter(type => type === 'regular').length;
      countCertified += allTypes.filter(type => type === 'certified').length;
      // חישוב על פי סוג
      return (countRegular * 105) + (countCertified * 500);


    case 'cyberInsurance':
      return 450;

    case 'incomeLoss':
      const duration = document.querySelector('.incomeLossDuration')?.value || '3';
      return duration === '3' ? 500 : duration === '6' ? 900 : 1500;

    case 'afterSchoolProgram':
      const afterSchoolChildren = parseInt(document.querySelector('.afterSchoolChildrenCount')?.value) || 0;
      return afterSchoolChildren <= 20 ? 500 : 500 + (afterSchoolChildren - 20) * 25;

    default:
      return 0;
  }
}


function initSignatureCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;

  function getXY(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
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

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let isValid = true;
  const visibleInputs = sections[currentSectionIndex].querySelectorAll('input:required, select:required');
  visibleInputs.forEach(input => {
    // בדיקה חכמה: checkboxes לא דורשים ערך טקסט
    if ((input.type === 'checkbox' && !input.checked) || (input.type !== 'checkbox' && !input.value.trim())) {
      isValid = false;
      input.style.borderColor = 'red';
    } else {
      input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }
  });

  if (isValid) {
    try {
      const formValues = collectFormData();
      await sendToWebhook(formValues); // כולל הכל: חתימה, קבצים, ערכים
      showSection(8); // מעבר לעמוד תודה
    } catch (error) {
      alert('שגיאה בשליחת הטופס. אנא נסה שוב.');
    }
  } else {
    alert('אנא מלא את כל השדות הנדרשים.');
  }
});

function collectFormData() {
  const payload = {};

  // קלטים רגילים (input, select, textarea)
  document.querySelectorAll('input, select, textarea').forEach(el => {
    if (el.type === 'file') return;
    let name = el.name || el.id;
    if (!name) return;
    if (el.type === 'checkbox') {
      payload[name] = el.checked ? 'true' : 'false';
    } else if (el.type === 'radio') {
      if (el.checked) payload[name] = el.value;
    } else if (name.endsWith('[]')) {
      // דילוג - נטפל בהם בנפרד (עובדים נוספים)
    } else {
      payload[name] = el.value;
    }
  });

  // עובדים דינמיים (employeeName[], employeeId[], employeeType[])
  const employeeNames = Array.from(document.querySelectorAll('input[name="employeeName[]"]')).map(e => e.value);
  const employeeIds = Array.from(document.querySelectorAll('input[name="employeeId[]"]')).map(e => e.value);
  const employeeTypes = Array.from(document.querySelectorAll('select[name="employeeType[]"]')).map(e => e.value);

  employeeNames.forEach((name, i) => {
    payload[`employeeName[${i}]`] = name;
    payload[`employeeId[${i}]`] = employeeIds[i] || '';
    payload[`employeeType[${i}]`] = employeeTypes[i] || '';
  });

  // איסוף גננות תאונות אישיות
  const paNames = Array.from(document.querySelectorAll('input[name="personalAccidentEmployeeName[]"]')).map(e => e.value);
  const paIds = Array.from(document.querySelectorAll('input[name="personalAccidentEmployeeId[]"]')).map(e => e.value);
  paNames.forEach((name, i) => {
    payload[`personalAccidentEmployeeName[${i}]`] = name;
    payload[`personalAccidentEmployeeId[${i}]`] = paIds[i] || '';
  });

  // שליחת כל כיסוי באופן שטוח: insuranceOptions[optionName] + value נוסף אם רלוונטי
  document.querySelectorAll('.coverage-option').forEach(optionDiv => {
    const optionName = optionDiv.dataset.option;
    const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    const isInterested = hiddenInput && hiddenInput.value === 'true';

    // כיסוי ביטוח תכולה ומבנה — לא לשמור אם אין ביטוח תכולה ומבנה
    if (optionName === 'contentBuilding') {
      const hasContentBuilding = document.getElementById('hasContentBuilding');
      if (hasContentBuilding && !hasContentBuilding.checked) {
        payload[`insuranceOptions[${optionName}]`] = 'false';
        return;
      }
    }

    payload[`insuranceOptions[${optionName}]`] = isInterested ? 'true' : 'false';

    // איסוף ערך מהתנאי, רק אם "מעוניין" ורק אם קיים ערך
    if (isInterested) {
      const condInput = optionDiv.querySelector('.conditional-section select, .conditional-section input[type="number"], .conditional-section input[type="text"]');
      if (condInput && condInput.value !== '') {
        payload[`insuranceOptionsDetails[${optionName}]`] = condInput.value;
      }
    }
  });

  // אפשרויות לחצני button-group (כמו building size וכו')
  document.querySelectorAll('.button-group').forEach(group => {
    let selected = group.querySelector('button.selected');
    if (selected && selected.dataset.value) {
      let groupName = group.closest('[data-option]')?.dataset.option ||
        group.closest('.form-group')?.querySelector('label')?.innerText ||
        selected.innerText;
      if (groupName) payload[`buttonGroup_${groupName}`] = selected.dataset.value;
    }
  });

  // תכולה/מבנה/חצר — רק אם יש ביטוח תכולה ומבנה
  const hasContentBuilding = document.getElementById('hasContentBuilding');
  if (hasContentBuilding && hasContentBuilding.checked) {
    payload['contentBuildingDetails[contentSum]'] = document.querySelector('.contentSum')?.value || '';
    payload['contentBuildingDetails[buildingSum]'] = document.querySelector('.buildingSum')?.value || '';
    payload['contentBuildingDetails[yardContentSum]'] = document.querySelector('.yardContentSum')?.value || '';
    payload['contentBuildingDetails[buildingType]'] = document.querySelector('.buildingType')?.value || '';
    payload['contentBuildingDetails[hasLien]'] = document.querySelector('.hasLien')?.checked ? 'true' : 'false';
    payload['contentBuildingDetails[lienHolder]'] = document.querySelector('.hasLien')?.checked ? (document.querySelector('.lienHolder')?.value || '') : '';
  }

  payload['premium'] = parseInt(document.getElementById('premiumAmount').textContent.replace(/[^0-9]/g, '')) || 0;
  payload['paymentMethod'] = window.selectedPaymentMethod || '';

  return payload;
}


// --- הוספת גננות לכיסוי תאונות אישיות ---
function setupPersonalAccidentEmployees() {
  document.querySelectorAll('.coverage-option[data-option="teacherAccidents"]').forEach(optionDiv => {
    const interestedBtn = optionDiv.querySelector('.interested-button');
    const notInterestedBtn = optionDiv.querySelector('.not-interested-button');
    const condSection = optionDiv.querySelector('.conditional-section');
    // מצא/צור את ה־div לגננות
    let employeesSection = condSection.querySelector('.personal-accidents-employees-section');
    if (!employeesSection) return;

    const rowsContainer = employeesSection.querySelector('#personalAccidentEmployeesRows');
    const addButton = employeesSection.querySelector('#addPersonalAccidentEmployeeButton');
    if (!rowsContainer || !addButton) return;

    // פתיחה/סגירה דינמית
    interestedBtn.addEventListener('click', () => {
      employeesSection.style.display = 'block';
      if (rowsContainer.children.length === 0) addPersonalAccidentEmployeeRow(rowsContainer);
    });
    notInterestedBtn.addEventListener('click', () => {
      employeesSection.style.display = 'none';
      rowsContainer.innerHTML = '';
    });

    // תמיד בהתחלה
    employeesSection.style.display = interestedBtn.classList.contains('selected') ? 'block' : 'none';

    addButton.onclick = () => addPersonalAccidentEmployeeRow(rowsContainer);
  });
}

// יוצר שורה של גננת
function addPersonalAccidentEmployeeRow(container, data = {}) {
  const row = document.createElement('div');
  row.className = 'form-group pa-employee-row';
  row.style.display = 'flex';
  row.style.gap = '8px';
  row.style.alignItems = 'center';
  row.innerHTML = `
    <input type="text" name="personalAccidentEmployeeName[]" placeholder="שם הגננת" value="${data.name || ''}" style="flex:2">
    <input type="text" name="personalAccidentEmployeeId[]" placeholder="ת.ז גננת" value="${data.id || ''}" style="flex:1">
    <button type="button" class="removePersonalAccidentEmployee" aria-label="הסר גננת"
      style="background: #e74c3c; color: #fff; border:none; border-radius:6px; padding:6px 10px; margin-right:3px;">X</button>
  `;
  container.appendChild(row);

  row.querySelector('.removePersonalAccidentEmployee').onclick = () => {
    row.remove();
    calculatePremium();
  };
  calculatePremium();
}




async function sendToWebhook(payload) {
  const formData = new FormData();

  // מוסיפים כל שדה בדיוק בשם ובערך כפי שצריך
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // טיפול באסמכתא
  if (selectedPaymentMethod === 'bank') {
    const file = document.getElementById('bankTransferProof').files[0];
    if (file) formData.append('proofFile', file);
  } else if (selectedPaymentMethod === 'debit') {
    const file = document.getElementById('debitAuthUpload').files[0];
    if (file) formData.append('proofFile', file);
  }

  // הוספת חתימה
  await appendSignatureToFormData(formData, selectedPaymentMethod);

  // שליחה ל-Webhook
  const response = await fetch('https://hook.eu2.make.com/c8jk8qsq7mnwtdg5aevxvxhdg8m3yocw', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Network response was not ok');
}

// עוזר – מוסיף את החתימה כקובץ לתוך ה-FormData
function appendSignatureToFormData(formData, method) {
  return new Promise(resolve => {
    let canvasId = '';
    if (method === 'bank') canvasId = 'signatureCanvasBank';
    if (method === 'credit') canvasId = 'signatureCanvasCredit';
    if (method === 'debit') canvasId = 'signatureCanvasDebit';

    if (canvasId) {
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        canvas.toBlob(blob => {
          if (blob) formData.append('signature', blob, 'signature.png');
          resolve();
        });
        return;
      }
    }
    resolve();
  });
}
;

// --- Content Building Logic משופר ---
// הגדרת הכפתורים עבור גודל מבנה
function setupBuildingSizeButtons() {
  const buttons = document.querySelectorAll('.building-size-button');
  const extraInput = document.getElementById('buildingSizeExtraInput');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      button.classList.add('selected');

      if (button.dataset.value === 'over100') {
        extraInput.style.display = 'block';
      } else {
        extraInput.style.display = 'none';
        document.getElementById('buildingSizeExact').value = '';
      }

      calculatePremium();
    });
  });
}

// סכום ביטוח תכולה
function setupContentValueButtons() {
  const buttons = document.querySelectorAll('.content-value-button');
  const extraInput = document.getElementById('contentSumExtraInput');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      button.classList.add('selected');

      if (button.dataset.value === 'over200k') {
        extraInput.style.display = 'block';
      } else {
        extraInput.style.display = 'none';
        document.getElementById('contentSumExact').value = '';
      }

      calculatePremium();
    });
  });
}

// סכום תכולת חצר
function setupYardValueButtons() {
  const buttons = document.querySelectorAll('.yard-value-button');
  const extraInput = document.getElementById('yardContentSumExtraInput');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      button.classList.add('selected');

      if (button.dataset.value === 'over20k') {
        extraInput.style.display = 'block';
      } else {
        extraInput.style.display = 'none';
        document.getElementById('yardContentSumExact').value = '';
      }

      calculatePremium();
    });
  });
}

function prefillFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);

  // מעבר על כל input/select/checkbox לפי name/id
  urlParams.forEach((value, key) => {
    let el = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
    if (el) {
      if (el.type === 'checkbox') {
        el.checked = (value === 'true' || value === '1');
      } else if (el.type === 'radio') {
        let radio = document.querySelector(`[name="${key}"][value="${value}"]`);
        if (radio) radio.checked = true;
      } else {
        el.value = value;
      }
      // טריגר שינוי לכל שדה שהוזן
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // טיפול בכפתורים (לפי data-value, לדוג' בבחירות תכולה/גודל)
    let btn = document.querySelector(`button[data-value="${value}"]`);
    if (btn) {
      btn.click();
    }
  });
}


// קריאה לפונקציות לאחר טעינת העמוד
document.addEventListener('DOMContentLoaded', () => {
  // מעבר בין עמודים
  showSection(0);
  gardenType.addEventListener('change', calculatePremium);
  childrenCount.addEventListener('input', calculatePremium);
  prefillFromUrl();

  // הגדרות לסקשן ביטוח תכולה ומבנה
  setupBuildingSizeButtons();
  setupContentValueButtons();
  setupYardValueButtons();

  // --- טיפול בצ'קבוקס שעבוד קבוע בסקשן ביטוח תכולה ומבנה בלבד ---
  const hasLienCheckbox = document.getElementById('hasLien');
  const lienHolderInput = document.getElementById('lienHolderInput');
  if (hasLienCheckbox && lienHolderInput) {
    hasLienCheckbox.addEventListener('change', () => {
      lienHolderInput.style.display = hasLienCheckbox.checked ? 'block' : 'none';
    });
    lienHolderInput.style.display = hasLienCheckbox.checked ? 'block' : 'none';
  }

  // --- טיפול בילדים מעל גיל 3 בספטמבר ---
  const hasOver3Checkbox = document.getElementById('hasOver3Children');
  const over3CountGroup = document.getElementById('over3ChildrenCountGroup');
  const over3CountInput = document.getElementById('over3ChildrenCount');
  if (hasOver3Checkbox && over3CountGroup) {
    hasOver3Checkbox.addEventListener('change', () => {
      over3CountGroup.style.display = hasOver3Checkbox.checked ? 'block' : 'none';
      if (!hasOver3Checkbox.checked && over3CountInput) over3CountInput.value = '';
    });
    over3CountGroup.style.display = hasOver3Checkbox.checked ? 'block' : 'none';
  }

  // --- עובדים נוספים דינמיים ---
  const hasEmployeesCheckbox = document.getElementById('hasAdditionalEmployees');
  const employeesSection = document.getElementById('employeesSection');
  const employeeRows = document.getElementById('employeeRows');
  const addEmployeeButton = document.getElementById('addEmployeeButton');

  if (hasEmployeesCheckbox && employeesSection && addEmployeeButton && employeeRows) {
    hasEmployeesCheckbox.addEventListener('change', () => {
      employeesSection.style.display = hasEmployeesCheckbox.checked ? 'block' : 'none';
      if (!hasEmployeesCheckbox.checked) {
        employeeRows.innerHTML = '';
      }
    });

    addEmployeeButton.addEventListener('click', () => addEmployeeRow());

    // אוטומטית עובד ראשון אם הצ'קבוקס נבחר (גם ב-prefill)
    if (hasEmployeesCheckbox.checked) employeesSection.style.display = 'block';
  }
  // הוספת שורה לעובד
  function addEmployeeRow(data = {}) {
    const rowId = `employeeRow${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const row = document.createElement('div');
    row.className = 'form-group employee-row';
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';
    row.innerHTML = `
    <input type="text" name="employeeName[]" placeholder="שם העובד" value="${data.name || ''}" style="flex:2">
    <input type="text" name="employeeId[]" placeholder="ת.ז עובד" value="${data.id || ''}" style="flex:1">
    <select name="employeeType[]" style="flex:1">
      <option value="">סוג העובד</option>
      <option value="regular" ${data.type === 'regular' ? 'selected' : ''}>ללא תעודה</option>
      <option value="certified" ${data.type === 'certified' ? 'selected' : ''}>עם תעודה</option>
    </select>
    <button type="button" class="removeEmployee" aria-label="הסר עובד" style="background: #e74c3c; color: #fff; border:none; border-radius:6px; padding:6px 10px; margin-right:3px;">X</button>
  `;
    employeeRows.appendChild(row);

    row.querySelector('.removeEmployee').onclick = () => {
      row.remove();
    };
  }

  document.querySelectorAll('.needsApprovalCheckbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const infoDiv = this.closest('.form-group').querySelector('.approval-info-text');
      if (infoDiv) {
        infoDiv.style.display = this.checked ? 'block' : 'none';
      }
    });
  });

});
