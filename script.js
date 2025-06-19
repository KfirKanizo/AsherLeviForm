const form = document.getElementById('insuranceForm');
const gardenType = document.getElementById('gardenType');
const childrenCount = document.getElementById('childrenCount');
const employeesCount = document.getElementById('employeesCount');
const premiumAmount = document.getElementById('premiumAmount');
const isMemberCheckbox = document.getElementById('isMember');
const membershipSection = document.getElementById('membershipSection');
let selectedPaymentMethod = '';

const sections = [
  document.getElementById('contactDetails'),
  document.getElementById('insuranceDetails'),
  document.getElementById('contentBuildingSection'),
  document.getElementById('policyDetails'),
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
    'teacherAccidents'
  ]
};


const policyFeaturesByTrack = {
  1: [
    { title: "צד ג'", description: "כיסוי בגין נזקי גוף ורכוש שנגרמו לצד שלישי במסגרת פעילות הגן." },
    { title: "פינוי באמבולנס", description: "כולל פינוי במקרי חירום בעקבות פגיעות ילדים או צוות." },
    { title: "הרחבות ללא תוספת תשלום", description: "כיסוי להרעלת מזון, חפץ זר באוכל, פגיעת ילד בילד, פעילות מחוץ לגן, פגיעות גוף חריגות, הוצאת דיבה, הגנה פלילית ואזרחית." }
  ],
  2: [
    { title: "צד ג'", description: "כיסוי אחריות כלפי צד שלישי." },
    { title: "פינוי באמבולנס", description: "כיסוי מלא לפינוי במקרים רפואיים." },
    { title: "הרחבות ללא תוספת תשלום", description: "כיסויים נוספים כגון פגיעות גוף בלתי רגילות, השמצה ועוד." },
    { title: "תאונות אישיות לילדים", description: "כולל הוצאות רפואיות, שברים, נכות זמנית, נכות קבועה, פטירה, אובדן שכר לימוד עד 60 יום." }
  ],
  3: [
    { title: "צד ג'", description: "כיסוי לנזקי גוף או רכוש שנגרמו לגורמים חיצוניים." },
    { title: "פינוי באמבולנס", description: "כיסוי פינוי בעת תאונה או פציעה במסגרת הגן." },
    { title: "הרחבות ללא תוספת תשלום", description: "כיסוי להאשמות שווא, הוצאות משפטיות והגנה אישית." },
    { title: "תאונות אישיות לילדים", description: "פוליסת תאונות רחבה לילדים." }
  ],
  4: [
    { title: "צד ג'", description: "כיסוי לאחריות כלפי הורים, מבקרים, ספקים ועוד." },
    { title: "פינוי באמבולנס", description: "כיסוי מלא לפינוי חירום באמבולנס." },
    { title: "הרחבות ללא תוספת תשלום", description: "הגנה מפני תביעות אזרחיות ופליליות, כולל עלויות הגנה." },
    { title: "תאונות אישיות לילדים", description: "כיסוי מלא לאירועי תאונה לילדים כולל אובדן שכר לימוד." },
    { title: "חבות מעבידים", description: "כיסוי משפטי וכלכלי לתביעות מצד עובדים." }
  ],
  5: [
    { title: "צד ג'", description: "אחריות כלפי צד שלישי על פגיעות גוף או רכוש." },
    { title: "פינוי באמבולנס", description: "פינוי חירום בעת פגיעה בילד/צוות." },
    { title: "הרחבות ללא תוספת תשלום", description: "כיסויים נוספים למקרי קצה כגון פעילות חוץ או הרעלות." },
    { title: "חבות מעבידים", description: "הגנה במקרה של פגיעת עובד במהלך העבודה." }
  ],
  6: [
    { title: "צד ג'", description: "אחריות משפטית לנזקים לגורמים חיצוניים." },
    { title: "פינוי באמבולנס", description: "כולל פינוי רפואי מהיר בעת פגיעות." },
    { title: "הרחבות ללא תוספת תשלום", description: "הגנות מורחבות למצבים נדירים או תביעות מורכבות." },
    { title: "חבות מעבידים", description: "כיסוי לפגיעות של עובדים במהלך יום העבודה." },
    { title: "תכולה ומבנה", description: "כיסוי לתכולה, נזקי זכוכית, ציוד אישי של עובדים ובעלי הגן, מזומן, קלקול במקרר, גניבה, נזקי מים, רעידת אדמה ועוד." },
    { title: "אובדן הכנסות", description: "כיסוי של 5,000 ₪ ל־3 חודשים – ניתן להארכה." }
  ],
  7: [
    { title: "צד ג'", description: "אחריות צד שלישי – גוף ורכוש." },
    { title: "פינוי באמבולנס", description: "כיסוי מלא לפינוי רפואי." },
    { title: "הרחבות ללא תוספת תשלום", description: "כיסויים נוספים לפגיעות חריגות." },
    { title: "תאונות אישיות לילדים", description: "כולל טיפולים רפואיים, נכות זמנית וקבועה, פטירה." },
    { title: "חבות מעבידים", description: "פגיעות עובדים בגן." },
    { title: "תכולה ומבנה", description: "נזק לתכולה ולמבנה עד גבולות אחריות מוגדרים." },
    { title: "אובדן הכנסות", description: "כיסוי עד 5,000 ₪ למשך 3 חודשים – בתנאים מסוימים." }
  ]
};


function showSection(index) {
  const currentSection = sections[currentSectionIndex];
  const nextSection = sections[index];
  const isForward = index > currentSectionIndex;

  // מעבר בין סקשנים – אנימציה
  if (currentSection) {
    currentSection.classList.remove('active');
    currentSection.classList.add(isForward ? 'form-section-exit-left' : 'form-section-exit-right');
  }

  setTimeout(() => {
    // הסתר את כולם, הצג את החדש
    sections.forEach((section, i) => {
      section.classList.remove('form-section-exit-left', 'form-section-exit-right', 'active');
      if (i === index) section.classList.add('active');
    });

    // עדכון כיסויים – מסך תוספות כיסוי
    if (index === 4) updateCoverageOptions();

    // הצגת פרטי פוליסה – לפי המסלול
    if (index === 3) {
      const track = determinePolicyTrack();
      populatePolicyDetails(track);
    }

    // הצגת פרמיה – רק במסכים הרלוונטיים
    const premiumDisplay = document.getElementById('premiumDisplay');
    if (premiumDisplay) {
      premiumDisplay.style.display = [2, 3, 4].includes(index) ? 'block' : 'none';
    }

    calculatePremium();

    // בר התקדמות (6 שלבים בפועל)
    const progressFill = document.getElementById('progressBarFill');
    if (progressFill) {
      const totalSteps = 7;
      let stepForProgress = index;
      if ([5, 6, 7, 8].includes(index)) stepForProgress = 5; // מסכי תשלום = סוף שלב 5
      const percentage = Math.min((stepForProgress / (totalSteps - 1)) * 100, 100);
      progressFill.style.width = `${percentage}%`;
    }

    // חתימה – לפי מסך תשלום
    if (index === 6) initSignatureCanvas('signatureCanvasBank');
    if (index === 7) initSignatureCanvas('signatureCanvasCredit');
    if (index === 8) initSignatureCanvas('signatureCanvasDebit');

    // עדכון אינדקס
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

    // דילוג על ביטוח תכולה אם לא מסומן — וקפיצה ל־policyDetails
    if (sections[currentSectionIndex].id === 'insuranceDetails') {
      const hasContentBuilding = document.getElementById('hasContentBuilding');
      if (hasContentBuilding && !hasContentBuilding.checked) {
        const policyIndex = sections.findIndex(sec => sec.id === 'policyDetails');
        if (policyIndex !== -1) {
          currentSectionIndex = policyIndex;
          showSection(currentSectionIndex);
          return;
        }
      }
    }

    // מסך policyDetails → coverageAddons
    if (sections[currentSectionIndex].id === 'policyDetails') {
      const addonsIndex = sections.findIndex(sec => sec.id === 'coverageAddons');
      if (addonsIndex !== -1) {
        currentSectionIndex = addonsIndex;
        showSection(currentSectionIndex);
        return;
      }
    }

    // מעבר רגיל
    if (currentSectionIndex < sections.length - 1) {
      currentSectionIndex++;
      showSection(currentSectionIndex);
    }
  });
});


document.querySelectorAll('.back-button').forEach(button => {
  button.addEventListener('click', () => {
    // חזרה מ־coverageAddons → policyDetails
    if (sections[currentSectionIndex].id === 'coverageAddons') {
      const policyIndex = sections.findIndex(sec => sec.id === 'policyDetails');
      if (policyIndex !== -1) {
        currentSectionIndex = policyIndex;
        showSection(currentSectionIndex);
        return;
      }
    }

    // חזרה מ־policyDetails → insuranceDetails
    if (sections[currentSectionIndex].id === 'policyDetails') {
      const insuranceIndex = sections.findIndex(sec => sec.id === 'insuranceDetails');
      if (insuranceIndex !== -1) {
        currentSectionIndex = insuranceIndex;
        showSection(currentSectionIndex);
        return;
      }
    }

    // במידה ותכולה לא מסומנת - חזור ישירות ל־insuranceDetails (דילוג אחורה)
    if (sections[currentSectionIndex].id === 'coverageAddons') {
      const hasContentBuilding = document.getElementById('hasContentBuilding');
      if (hasContentBuilding && !hasContentBuilding.checked) {
        const insuranceDetailsIndex = sections.findIndex(sec => sec.id === 'insuranceDetails');
        if (insuranceDetailsIndex !== -1) {
          currentSectionIndex = insuranceDetailsIndex;
          showSection(currentSectionIndex);
          return;
        }
      }
    }

    // רגיל
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
      showSection(currentSectionIndex);
    }
  });
});




document.querySelectorAll('#bankTransferSection .back-button, #creditCardSection .back-button, #debitAuthSection .back-button')
  .forEach(button => {
    button.addEventListener('click', () => {
      showSection(5); // חוזר למסך בחירת אמצעי תשלום
    });
  });


document.querySelector('.bank-button').addEventListener('click', () => {
  selectedPaymentMethod = 'bank';
  showSection(6);
});

document.querySelector('.credit-button').addEventListener('click', () => {
  selectedPaymentMethod = 'credit';
  showSection(7);
});

document.querySelector('.debit-auth-button').addEventListener('click', () => {
  selectedPaymentMethod = 'debit';
  showSection(8);
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

function populatePolicyDetails(trackNumber) {
  const container = document.getElementById('policyCardsContainer');
  container.innerHTML = '';

  const features = policyFeaturesByTrack[trackNumber] || [];
  features.forEach(feature => {
    const card = document.createElement('div');
    card.className = 'policy-card';
    card.innerHTML = `<h3>${feature.title}</h3><p>${feature.description}</p>`;
    container.appendChild(card);
  });
}


function updateCoverageOptions() {
  const gardenTypeValue = gardenType.value;
  const container = document.getElementById('coverageOptionsContainer');
  container.innerHTML = '';
  const templates = document.getElementById('coverageOptionsTemplates');
  const options = availableOptions[gardenTypeValue] || [];
  const employees = parseInt(employeesCount.value) || 0;

  options.forEach(option => {
    // הסתרת חבות מעבידים אם אין עובדים
    if (option === 'employerLiability' && employees === 0) return;
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
    // ודא שאתה משנה תמיד את input הכי קרוב (ולא input כללי שכבר לא בתוקף)
    const hiddenInput = newInterestedButton.closest('.coverage-option').querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    hiddenInput.value = 'true';
    newInterestedButton.classList.add('selected');
    newNotInterestedButton.classList.remove('selected');
    if (conditionalSection) conditionalSection.style.display = 'block';
    console.log(`Clicked Interested: [${optionName}], value now:`, hiddenInput.value);
    calculatePremium();
  });

  newNotInterestedButton.addEventListener('click', () => {
    const hiddenInput = newNotInterestedButton.closest('.coverage-option').querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    hiddenInput.value = 'false';
    newNotInterestedButton.classList.add('selected');
    newInterestedButton.classList.remove('selected');
    if (conditionalSection) conditionalSection.style.display = 'none';
    console.log(`Clicked Not Interested: [${optionName}], value now:`, hiddenInput.value);
    calculatePremium();
  });


  // טריגר חישוב בעת שינוי שדות תנאי
  optionDiv.querySelectorAll('.conditional-section input, .conditional-section select').forEach(input => {
    input.addEventListener('change', calculatePremium);
  });

  const hasLien = document.getElementById("hasLien");
  const lienTypeSection = document.getElementById("lienTypeSection");
  const lienDetailsBank = document.getElementById("lienDetailsBank");
  const lienDetailsCompany = document.getElementById("lienDetailsCompany");

  if (hasLien) {
    hasLien.addEventListener("change", () => {
      const show = hasLien.checked;
      lienTypeSection.style.display = show ? "block" : "none";
      lienDetailsBank.style.display = "none";
      lienDetailsCompany.style.display = "none";
    });
  }

  document.querySelectorAll(".lien-type-button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".lien-type-button").forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
      if (button.dataset.type === "bank") {
        lienDetailsBank.style.display = "block";
        lienDetailsCompany.style.display = "none";
      } else {
        lienDetailsBank.style.display = "none";
        lienDetailsCompany.style.display = "block";
      }
    });
  });

}

function determinePolicyTrack() {
  const gardenTypeValue = gardenType.value;
  const children = parseInt(childrenCount.value) || 0;
  const hasContent = document.getElementById('hasContentBuilding')?.checked;
  const employeesCount = parseInt(document.getElementById('employeesCount')?.value) || 0;


  if (gardenTypeValue === 'tamah') return 1;
  if (gardenTypeValue === 'privateFamily' || gardenTypeValue === 'upTo3') {
    if (children <= 6 && employeesCount === 0) return 2;
    if (children <= 9 && !hasContent) return 3;
    if (children >= 10 && !hasContent) return 4;
  }
  if ((gardenTypeValue === 'over3' || gardenTypeValue === 'afterSchool') && !hasContent) return 5;
  if ((gardenTypeValue === 'over3' || gardenTypeValue === 'afterSchool') && hasContent) return 6;
  if (gardenTypeValue === 'upTo3' && hasContent) return 7; // מסלול 7 כולל תכולה ומבנה
}



function calculatePremium() {
  const gardenTypeValue = gardenType.value;
  const childrenCountValue = parseInt(childrenCount.value) || 0;
  let basePremium = 0;

  // משתנה עזר - האם בחר ביטוח תכולה ומבנה
  const hasContentBuilding = document.getElementById('hasContentBuilding');
  const includeContentBuilding = hasContentBuilding ? hasContentBuilding.checked : false;

  // אם אין גן או אין ילדים, תמיד 0
  if (!gardenTypeValue || childrenCountValue < 1) {
    premiumAmount.textContent = '0 ₪';
    const discountDisplay = document.getElementById('discountDisplay');
    if (discountDisplay) discountDisplay.textContent = '';
    return;
  }

  // חישוב basePremium לפי סוג גן ומבנה/תכולה:
  switch (gardenTypeValue) {
    case 'tamah': // מסלול 1 - תמ"ת
      if (childrenCountValue <= 6) basePremium = 500;
      else if (childrenCountValue <= 10) basePremium = 1000;
      else basePremium = 1000 + (childrenCountValue - 10) * 100;
      break;

    case 'privateFamily': // מסלול 2/3/4
      if (childrenCountValue <= 6) basePremium = 650; // מסלול 2 - עד 6 ילדים, ללא עובדים
      else if (childrenCountValue <= 8) basePremium = 900; // מסלול 3 - עד 8 ילדים ללא מבנה/תכולה
      else if (childrenCountValue === 9) basePremium = 900 + 105; // מסלול 3 - 9 ילדים (ילד אחד נוסף)
      else if (childrenCountValue <= 10) basePremium = 1100; // מסלול 4 - עד 10 ילדים, ללא מבנה/תכולה
      else basePremium = 1100 + (childrenCountValue - 10) * 110; // מסלול 4 - מעל 10 ילדים, ללא מבנה/תכולה
      break;

    case 'upTo3':
      if (includeContentBuilding) {
        if (childrenCountValue <= 12) basePremium = 1400; // מסלול 7 - כולל תכולה ומבנה
        else basePremium = 1400 + (childrenCountValue - 12) * 120;
      } else {
        if (childrenCountValue <= 10) basePremium = 1100; // מסלול 4 - עד 10 ילדים
        else basePremium = 1100 + (childrenCountValue - 10) * 110; // מסלול 4 - מעל 10 ילדים
      }
      break;

    case 'over3': // מסלול 5/6
    case 'afterSchool':
      // מבדילים לפי checkbox של תכולה/מבנה (מסלול 6 אם יש, 5 אם לא)
      if (includeContentBuilding) {
        if (childrenCountValue <= 17) basePremium = 1400; // מסלול 6 - עד 17 ילדים
        else basePremium = 1400 + (childrenCountValue - 17) * 80; // מסלול 6 - מעל 17 ילדים
      } else {
        if (childrenCountValue <= 20) basePremium = 1100; // מסלול 5 - עד 20 ילדים
        else basePremium = 1100 + (childrenCountValue - 20) * 55; // מסלול 5 - מעל 20 ילדים
      }
      break;
  }

  // הנחות מועדון
  const isMemberCheckbox = document.getElementById('isMember');
  let totalDiscount = 0;
  let minPremium = basePremium;
  if (isMemberCheckbox && isMemberCheckbox.checked) {
    // מסלול 4+7: 10 ש"ח לילד, מסלול 5+6: 5 ש"ח לילד
    if (
      (gardenTypeValue === 'privateFamily' && childrenCountValue >= 10) ||
      (gardenTypeValue === 'upTo3' && childrenCountValue >= 10 && !includeContentBuilding) // upTo3 = מסלול 4 רק בלי תכולה
    ) {
      totalDiscount = childrenCountValue * 10;
      minPremium = 1100;
    }

    if (
      (gardenTypeValue === 'over3' || gardenTypeValue === 'afterSchool')
    ) {
      if (includeContentBuilding) {
        totalDiscount = childrenCountValue * 5; // מסלול 6
        minPremium = 1400;
      } else {
        totalDiscount = childrenCountValue * 5; // מסלול 5
        minPremium = 1100;
      }
    }
  }

  let totalPremium = Math.max(basePremium - totalDiscount, minPremium);

  // הוספת תוספות (הרחבות) לפי בחירות
  document.querySelectorAll('.coverage-option').forEach(optionDiv => {
    const optionName = optionDiv.dataset.option;
    const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    const cost = getOptionCost(optionName, gardenTypeValue, childrenCountValue, includeContentBuilding);

    // כיסוי תכולה ומבנה (במסלולים בהם הוא תוספת)
    if (optionName === 'contentBuilding') {
      // במסלול 7 תמיד כלול ואין צורך להוסיף. במסלול 6 גם כלול בתעריף.
      if (gardenTypeValue === 'upTo3' || (gardenTypeValue === 'over3' && includeContentBuilding && childrenCountValue <= 17)) {
        optionDiv.querySelector('.option-cost').textContent = `כלול במסלול`;
        return;
      }
      if (!includeContentBuilding) {
        optionDiv.querySelector('.option-cost').textContent = `מחיר: ₪0`;
        return;
      }
    }
    if (hiddenInput?.value === 'true') totalPremium += cost;
    if (optionDiv.querySelector('.option-cost')) {
      optionDiv.querySelector('.option-cost').textContent = `מחיר: ₪${cost.toLocaleString()}`;
    }
  });

  premiumAmount.textContent = `${totalPremium.toLocaleString()} ₪`;

  // תצוגת הנחה
  const discountDisplay = document.getElementById('discountDisplay');
  if (discountDisplay) {
    discountDisplay.textContent = totalDiscount > 0 ? `הנחת מועדון: ₪${totalDiscount}` : '';
  }
}




function getOptionCost(optionName, gardenTypeValue, childrenCountValue, includeContentBuilding) {
  let cost = 0;

  switch (optionName) {
    case 'contentBuilding':
      // במסלול 7 ו-6 כלול, בשאר - תוספת לפי מדיניות
      if (gardenTypeValue === 'upTo3' || (gardenTypeValue === 'over3' && includeContentBuilding && childrenCountValue <= 17)) {
        return 0; // כלול במסלול!
      }
      // תוספת לפי שווי תכולה
      cost = 300;
      const contentSum = parseFloat(document.querySelector('.contentSum')?.value.replace(/[^0-9.]/g, '')) || 0;
      if (contentSum > 200000) cost += (contentSum - 200000) * 0.001; // תוספת פר ש"ח
      return cost;

    case 'thirdParty':
      // צד ג': מחיר לפי סכום ובחירה
      const coverage = document.querySelector('.thirdPartyCoverage')?.value || '5M';
      if (coverage === '5M')
        return childrenCountValue <= 20 ? 200 : 300;
      if (coverage === '6M') return 400;
      if (coverage === '8M') return 1000;
      if (coverage === '10M') return 2000;
      return 0;

    case 'deductibleCancellation':
      // ביטול השתתפות עצמית: לפי כמות ילדים
      return childrenCountValue <= 20 ? 200 : 300;

    case 'teacherAccidents':
      // תאונות אישיות, מוות ונכות לגננת: לפי תכנית
      const plan = document.querySelector('.teacherAccidentsCoverage')?.value || 'A';
      let basePrice = plan === 'A' ? 200 : plan === 'B' ? 600 : 800;
      // מספר גננות
      const paCount = document.querySelectorAll('input[name="personalAccidentEmployeeName[]"]').length || 1;
      return basePrice * paCount;

    case 'professionalLiability':
      return 500; // מחיר קבוע

    case 'employerLiability':
      const employeesCount = parseInt(document.getElementById('employeesCount')?.value) || 0;
      return employeesCount * 105;  // מחיר קבוע


    case 'cyberInsurance':
      return 450;

    case 'incomeLoss':
      const duration = document.querySelector('.incomeLossDuration')?.value || '3';
      return duration === '3' ? 500 : duration === '6' ? 900 : 1500;

    case 'afterSchoolProgram':
      // צהרון: עד 20 ילדים 500 ש"ח, כל ילד נוסף 25 ש"ח
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
      showSection(9); // מעבר לעמוד תודה
    } catch (error) {
      alert('שגיאה בשליחת הטופס. אנא נסה שוב.');
    }
  } else {
    alert('אנא מלא את כל השדות הנדרשים.');
  }
});

function collectFormData() {
  console.log('--- collectFormData called ---');
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

  // ---------- גננות תאונות אישיות ----------
  const paNames = Array.from(document.querySelectorAll('input[name="personalAccidentEmployeeName[]"]')).map(e => e.value);
  const paIds = Array.from(document.querySelectorAll('input[name="personalAccidentEmployeeId[]"]')).map(e => e.value);
  let paArr = [];
  for (let i = 0; i < paNames.length; i++) {
    if (paNames[i] || paIds[i]) {
      paArr.push(
        [paNames[i] || '', paIds[i] || ''].join('|')
      );
    }
  }
  payload['personalAccidentsRaw'] = paArr.join(';');

  // ---------- תוספות כיסוי ----------
  // שים לב – רק מהקונטיינר שמוצג בפועל!
  document.querySelectorAll('#coverageOptionsContainer .coverage-option').forEach(optionDiv => {
    const optionName = optionDiv.dataset.option;
    const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    const isInterested = hiddenInput && hiddenInput.value === 'true';
    console.log(`collectFormData: option [${optionName}] = ${hiddenInput?.value}`);
    payload[`insuranceOptions[${optionName}]`] = isInterested ? 'true' : 'false';

    // details - רק אם יש ערך
    if (isInterested) {
      const condInput = optionDiv.querySelector('.conditional-section select, .conditional-section input[type="number"], .conditional-section input[type="text"]');
      if (condInput && condInput.value !== '') {
        payload[`insuranceOptionsDetails[${optionName}]`] = condInput.value;
      }
    }
  });

  // ---------- button-groups ----------
  document.querySelectorAll('.button-group').forEach(group => {
    let selected = group.querySelector('button.selected');
    if (selected && selected.dataset.value) {
      // עדיף להגדיר groupName באנגלית ב-data-attribute
      let groupName = group.closest('[data-option]')?.dataset.option ||
        group.closest('.form-group')?.querySelector('label')?.innerText?.replace(/[^\w]/g, '') || // הסר תווים לא רצויים
        selected.innerText;
      if (groupName) payload[`buttonGroup_${groupName}`] = selected.dataset.value;
    }
  });

  // ---------- מבנה ותכולה - כל הערכים תחת contentBuildingDetails בלבד ----------
  const hasContentBuilding = document.getElementById('hasContentBuilding');
  if (hasContentBuilding && hasContentBuilding.checked) {
    payload['contentBuildingDetails[contentSum]'] = document.querySelector('.contentSum')?.value || '';
    payload['contentBuildingDetails[buildingSum]'] = document.querySelector('.buildingSum')?.value || '';
    payload['contentBuildingDetails[yardContentSum]'] = document.querySelector('.yardContentSum')?.value || '';
    payload['contentBuildingDetails[buildingType]'] = document.querySelector('.buildingType')?.value || '';
    payload['contentBuildingDetails[hasLien]'] = document.querySelector('.hasLien')?.checked ? 'true' : 'false';
    payload['contentBuildingDetails[lienHolder]'] = document.querySelector('.hasLien')?.checked ? (document.querySelector('.lienHolder')?.value || '') : '';
  }

  // ---------- פרמיה, תשלום, חתימה, קבצים ----------
  payload['premium'] = parseInt(document.getElementById('premiumAmount').textContent.replace(/[^0-9]/g, '')) || 0;
  payload['paymentMethod'] = window.selectedPaymentMethod || '';
  // ---------- automation מתוך URL ----------
  payload['automation'] = window.formAutomationFlag || 'true';
  // ---------- renewal מתוך URL ----------
  payload['renewal'] = window.formRenewalFlag || 'true';

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
  // Production URL: https://hook.eu2.make.com/9ubikqsvbfewa5nrv4452fhxui1ikpel
  console.log('Sending data to webhook:', payload);
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

  // --- קביעת ערך automation עם ברירת מחדל true ---
  const automationParam = urlParams.get('automation');
  window.formAutomationFlag = (automationParam === null || automationParam === 'true') ? 'true' : 'false';

  // --- קביעת ערך renewal עם ברירת מחדל true --- 
  const renewalParam = urlParams.get('renewal');
  window.formRenewalFlag = (renewalParam === null || renewalParam === 'true') ? 'true' : 'false';

  urlParams.forEach((value, key) => {
    const policyStartDateParam = urlParams.get('policyStartDate');
    if (policyStartDateParam) {
      const el = document.getElementById('policyStartDate');
      if (el) el.value = policyStartDateParam;
    }

    const policyEndDateParam = urlParams.get('policyEndDate');
    if (policyEndDateParam) {
      const el = document.getElementById('policyEndDate');
      if (el) el.value = policyEndDateParam;
    }

    const waiverCheckboxParam = urlParams.get('waiverCheckbox');
    const propertyOwnerNameParam = urlParams.get('propertyOwnerName');
    const propertyOwnerIdParam = urlParams.get('propertyOwnerId');

    if (waiverCheckboxParam === 'true') {
      const waiverCheckbox = document.getElementById('waiverCheckbox');
      if (waiverCheckbox) waiverCheckbox.checked = true;
    }

    if (propertyOwnerNameParam) {
      const nameField = document.getElementById('propertyOwnerName');
      if (nameField) nameField.value = propertyOwnerNameParam;
    }

    if (propertyOwnerIdParam) {
      const idField = document.getElementById('propertyOwnerId');
      if (idField) idField.value = propertyOwnerIdParam;
    }

    // --- כיסויי תאונות אישיות דינמיים ---
    // --- תפעול personalAccidentsRaw לפני שדות אחרים ---
    if (urlParams.has('personalAccidentsRaw')) {
      const value = urlParams.get('personalAccidentsRaw');
      const rows = value.split(';');

      // סימון והצגה
      const coverageBtn = document.querySelector('.coverage-option[data-option="teacherAccidents"] .interested-button');
      const paContainer = document.querySelector('.pa-employee-rows');
      const addPaBtn = document.getElementById('addPersonalAccidentEmployeeButton');
      if (coverageBtn) coverageBtn.click();
      if (paContainer) paContainer.innerHTML = '';

      // הוסף שורה לכל ערך ב-rows
      rows.forEach(() => { if (addPaBtn) addPaBtn.click(); });

      // מלא ערכים בכל שורה
      const allPaRows = paContainer.querySelectorAll('.pa-employee-row');
      allPaRows.forEach((el, index) => {
        const [name, id] = rows[index].split('|');
        const nameInp = el.querySelector('input[name="personalAccidentEmployeeName[]"]');
        const idInp = el.querySelector('input[name="personalAccidentEmployeeId[]"]');
        if (nameInp) nameInp.value = name;
        if (idInp) idInp.value = id;
      });
    }

    // --- קלטים רגילים ---
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
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // --- לחצנים עם data-value (כמו תכולה/מבנה) ---
    let btn = document.querySelector(`button[data-value="${value}"]`);
    if (btn) {
      btn.click();
    }
  });
}
window.addEventListener('DOMContentLoaded', prefillFromUrl);


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

  // הצגת שדות בעלי נכס אם מסומן "ויתור זכות שיבוב"
  const waiverCheckbox = document.getElementById('waiverCheckbox');
  const waiverDetails = document.getElementById('waiverDetails');

  if (waiverCheckbox && waiverDetails) {
    waiverCheckbox.addEventListener('change', () => {
      waiverDetails.style.display = waiverCheckbox.checked ? 'block' : 'none';
    });

    // הצגה ראשונית אם כבר מסומן (למקרה של טעינה מ־URL)
    waiverDetails.style.display = waiverCheckbox.checked ? 'block' : 'none';
  }


  // --- טיפול בצ'קבוקס שעבוד קבוע בסקשן ביטוח תכולה ומבנה בלבד ---
  const hasLien = document.getElementById("hasLien");
  const lienTypeSection = document.getElementById("lienTypeSection");
  const lienDetailsBank = document.getElementById("lienDetailsBank");
  const lienDetailsCompany = document.getElementById("lienDetailsCompany");

  if (hasLien) {
    hasLien.addEventListener("change", () => {
      const show = hasLien.checked;
      lienTypeSection.style.display = show ? "block" : "none";
      lienDetailsBank.style.display = "none";
      lienDetailsCompany.style.display = "none";
    });
  }

  document.querySelectorAll(".lien-type-button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".lien-type-button").forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");

      // 💾 שמירת הערך לשדה החבוי
      const lienTypeInput = document.getElementById("lienType");
      if (lienTypeInput) lienTypeInput.value = button.dataset.type;

      if (button.dataset.type === "bank") {
        lienDetailsBank.style.display = "block";
        lienDetailsCompany.style.display = "none";
      } else {
        lienDetailsBank.style.display = "none";
        lienDetailsCompany.style.display = "block";
      }
    });
  });


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

  document.querySelectorAll('.needsApprovalCheckbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const infoDiv = this.closest('.form-group').querySelector('.approval-info-text');
      if (infoDiv) {
        infoDiv.style.display = this.checked ? 'block' : 'none';
      }
    });
  });

});
