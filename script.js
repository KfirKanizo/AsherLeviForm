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
    'birthdayActivities',
    'afterSchoolProgram'
  ],
  'privateFamily': [
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'birthdayActivities',
    'afterSchoolProgram'
  ],
  'upTo3': [
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'incomeLoss',
    'birthdayActivities'
  ],
  'over3': [
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'birthdayActivities',
    'afterSchoolProgram'
  ],
  'afterSchool': [
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'birthdayActivities'
  ]
};

const descriptions = {
  "צד ג'": "3,000,000 למקרה, 6,000,000 לתקופה",
  "צד ג' מסלול 1": "2,000,000 למקרה ולתקופה ",
  "פינוי באמבולנס": "",
  "הרחבות ללא תוספת תשלום": `
כיסוי בגין הרעלה או גוף זר במזון<br>
פעילות חוץ אשר התקיימה מטעם הגן<br>
פגיעת ילד בילד<br>
חריג אחריות מקצועית מבוטל בהתייחס לנזקי גוף בלבד<br>
פגיעה אישית, הוצאת דיבה, מעצר שווא עד ל־50,000 ש"ח<br>
הגנה בהליכים פליליים עד 120,000 למקרה ותקופה (השתתפות עצמית 2,000 ש"ח)<br>
הגנה משפטית גם במקרה של תביעה אזרחית עד 10,000 ש"ח
  `.trim(),
  "תאונות אישיות לילדים": `
כפוף לרשימה שמית וכפוף לפוליסה לביטוח תאונות אישיות מהדורת אוקטובר 2017.<br>
הוצאות רפואיות<br>
על פגיעה בשיניים, שבר במשקפיים עקב תאונה<br>
פיצוי על אשפוז מעל 3 ימים ועד 30 יום<br>
נכות מתאונה<br>
מוות מתאונה<br>
אובדן שכר לימוד בגין ילד שנפגע מתאונה – עד 60 יום
  `.trim(),
  "חבות מעבידים": "",
  "תכולה ומבנה": `
ביטוח חפצים אישיים של ילדי הגן – עד 2,000 ש"ח למקרה, אך לא יותר מ־5,000 ש"ח בכלל המקרים לכל תקופת הביטוח<br>
ביטוח שבר זכוכית, כלים סניטריים, לוחות שיש – עד 10,000 ש"ח, השתתפות עצמית 650 ש"ח<br>
ביטוח שבר חפצים אישיים של בעלי הגן ועובדים – עד 2,000 ש"ח למקרה, 5,000 ש"ח לתקופה, השתתפות עצמית 300 ש"ח<br>
ביטוח כספים – עד 2,500 ש"ח, השתתפות עצמית 2,500 ש"ח<br>
שבר תאונתי טלוויזיה, מחשבים, מערכות אודיו/וידאו<br>
קלקול תכולת מקררים בעקבות שריפה<br>
ביטוח גניבה פשוטה, למעט רכוש מקובע בחצר – עד 20,000 ש"ח למקרה ולתקופה<br>
ביטוח נזקי מים, נזקי טבע, רעידת אדמה<br>
ביטוח חפצים אישיים של ילדי הגן – 2,000 ש"ח למקרה ו־5,000 ש"ח לתקופה
  `.trim(),
  "אובדן הכנסות": `
במקרה בו לא ניתן להפעיל את המסגרת החינוכית עקב פגיעה במבנה (כמו הצפה, פיצוץ צינור, שריפה) – כלול בפוליסה פיצוי של 5,000 ש"ח למשך שלושה חודשי שיפוי<br>
ניתן להרחיב את הכיסוי ומשך הזמן
  `.trim(),
};



const policyFeaturesByTrack = {
  1: [
    { title: "צד ג' מסלול 1", description: "" },
    { title: "פינוי באמבולנס", description: "" },
    { title: "הרחבות ללא תוספת תשלום", description: "" }
  ],
  2: [
    { title: "צד ג'", description: "" },
    { title: "פינוי באמבולנס", description: "" },
    { title: "הרחבות ללא תוספת תשלום", description: "" },
    { title: "תאונות אישיות לילדים", description: "" }
  ],
  3: [
    { title: "צד ג'", description: "" },
    { title: "פינוי באמבולנס", description: "" },
    { title: "הרחבות ללא תוספת תשלום", description: "" },
    { title: "תאונות אישיות לילדים", description: "" }
  ],
  4: [
    { title: "צד ג'", description: "" },
    { title: "פינוי באמבולנס", description: "" },
    { title: "הרחבות ללא תוספת תשלום", description: "" },
    { title: "תאונות אישיות לילדים", description: "" },
    { title: "חבות מעבידים", description: "" }
  ],
  5: [
    { title: "צד ג'", description: "" },
    { title: "פינוי באמבולנס", description: "" },
    { title: "הרחבות ללא תוספת תשלום", description: "" },
    { title: "חבות מעבידים", description: "" }
  ],
  6: [
    { title: "צד ג'", description: "" },
    { title: "פינוי באמבולנס", description: "" },
    { title: "הרחבות ללא תוספת תשלום", description: "" },
    { title: "חבות מעבידים", description: "" },
    { title: "תכולה ומבנה", description: "" },
    { title: "אובדן הכנסות", description: "" }
  ],
  7: [
    { title: "צד ג'", description: "" },
    { title: "פינוי באמבולנס", description: "" },
    { title: "הרחבות ללא תוספת תשלום", description: "" },
    { title: "תאונות אישיות לילדים", description: "" },
    { title: "חבות מעבידים", description: "" },
    { title: "תכולה ומבנה", description: "" },
    { title: "אובדן הכנסות", description: "" }
  ]
};

for (const trackArr of Object.values(policyFeaturesByTrack)) {
  for (const feature of trackArr) {
    if (descriptions.hasOwnProperty(feature.title)) {
      feature.description = descriptions[feature.title];
    }
  }
}


let urlPrefillData = {};

function parseUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  urlPrefillData = {};
  for (const [key, value] of urlParams.entries()) {
    urlPrefillData[key] = value;
  }
}



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

    // הצגת פרטי פוליסה – לפי המסלול
    if (index === 3) {
      const track = determinePolicyTrack();
      console.log(`Determined policy track: ${track}`);
      populatePolicyDetails(track);
    }

    // עדכון כיסויים – מסך תוספות כיסוי
    if (index === 4) {
      updateCoverageOptions();

      const gardenTypeValue = gardenType.value;
      const expectedOptions = (availableOptions[gardenTypeValue] || []);

      const waitUntilOptionsReady = () => {
        const allPresent = expectedOptions.every(opt => {
          return document.querySelector(`.coverage-option[data-option="${opt}"]`);
        });

        if (allPresent) {
          prefillCoverageAddonsFromUrl();
        } else {
          setTimeout(waitUntilOptionsReady, 50);
        }
      };

      waitUntilOptionsReady();
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

    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput && phoneInput.closest('.form-section').classList.contains('active')) {
      if (!isValidPhoneNumber(phoneInput.value)) {
        isValid = false;
        phoneInput.style.borderColor = 'red';
        alert('אנא הזן מספר טלפון תקין בפורמט ישראלי.');
        return;
      }
    }

    // וידוא בחירה בשדה סוג מבנה
    const buildingTypeSelect = document.getElementById('buildingType');
    if (buildingTypeSelect && buildingTypeSelect.closest('.form-section').classList.contains('active')) {
      if (!buildingTypeSelect.value) {
        isValid = false;
        buildingTypeSelect.style.borderColor = 'red';
      } else {
        buildingTypeSelect.style.borderColor = 'rgba(255,255,255,0.3)';
      }
    }

    if (!isValid) {
      alert('אנא מלא את כל השדות הנדרשים.');
      return;
    }

    // דילוג על ביטוח תכולה אם לא מסומן — וקפיצה ל־policyDetails
    if (sections[currentSectionIndex].id === 'insuranceDetails') {
      const hasContentBuilding = document.getElementById('hasContentBuilding');
      if (hasContentBuilding && hasContentBuilding.value === "false") {
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
      if (hasContentBuilding && hasContentBuilding.value === "false") {
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
  const track = determinePolicyTrack();
  container.innerHTML = '';
  const templates = document.getElementById('coverageOptionsTemplates');
  const options = availableOptions[gardenTypeValue] || [];

  options.forEach(option => {
    // הסתרת חבות מעבידים אם אין עובדים או אם הכיסוי כלול במסלול
    if (option === 'employerLiability') {
      if ([4, 5, 6, 7].includes(track)) return; // מסלולים שבהם זה כלול
    }

    const template = templates.querySelector(`#coverage-${option}`);
    if (template) {
      const clone = template.cloneNode(true);
      container.appendChild(clone);
      addEventListenersToOption(clone);
    }
  });

  calculatePremium();
  setupPersonalAccidentEmployees();
  setupProfessionalLiabilityEmployees();
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
    if (optionName === 'afterSchoolProgram') {
      const input = document.querySelector('.afterSchoolChildrenCount');
      if (input) input.required = true;
    }

    if (optionName === 'teacherAccidents') {
      document.querySelectorAll('input[name="personalAccidentEmployeeName[]"], input[name="personalAccidentEmployeeId[]"], input[name="personalAccidentEmployeeBirthdate[]"]').forEach(input => {
        input.required = true;
      });
    }

    if (optionName === 'professionalLiability') {
      document.querySelectorAll('input[name="professionalLiabilityEmployeeName[]"], input[name="professionalLiabilityEmployeeId[]"], input[name="professionalLiabilityEmployeeBirthdate[]"]').forEach(input => {
        input.required = true;
      });
    }

    calculatePremium();
    updateCoverageOptionPrices();
  });

  newNotInterestedButton.addEventListener('click', () => {
    const hiddenInput = newNotInterestedButton.closest('.coverage-option').querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    hiddenInput.value = 'false';
    newNotInterestedButton.classList.add('selected');
    newInterestedButton.classList.remove('selected');
    if (conditionalSection) conditionalSection.style.display = 'none';
    console.log(`Clicked Not Interested: [${optionName}], value now:`, hiddenInput.value);
    if (optionName === 'afterSchoolProgram') {
      const input = document.querySelector('.afterSchoolChildrenCount');
      if (input) input.required = false;
    }

    if (optionName === 'teacherAccidents') {
      document.querySelectorAll('input[name="personalAccidentEmployeeName[]"], input[name="personalAccidentEmployeeId[]"], input[name="personalAccidentEmployeeBirthdate[]"]').forEach(input => {
        input.required = false;
      });
    }

    if (optionName === 'professionalLiability') {
      document.querySelectorAll('input[name="professionalLiabilityEmployeeName[]"], input[name="professionalLiabilityEmployeeId[]"], input[name="professionalLiabilityEmployeeBirthdate[]"]').forEach(input => {
        input.required = false;
      });
    }

    calculatePremium();
    updateCoverageOptionPrices();
  });

  if (optionName === 'birthdayActivities') {
    // ברירת מחדל: הסתר/הצג את השדה
    const conditionalSection = optionDiv.querySelector('.conditional-section');
    const interestedButton = optionDiv.querySelector('.interested-button');
    const notInterestedButton = optionDiv.querySelector('.not-interested-button');
    if (interestedButton && notInterestedButton) {
      interestedButton.addEventListener('click', () => {
        conditionalSection.style.display = 'block';
      });
      notInterestedButton.addEventListener('click', () => {
        conditionalSection.style.display = 'none';
      });
    }
  }


  // טריגר חישוב בעת שינוי שדות תנאי
  optionDiv.querySelectorAll('.conditional-section input, .conditional-section select').forEach(input => {
    input.addEventListener('change', () => {
      calculatePremium();
      updateCoverageOptionPrices();
    });
    input.addEventListener('input', () => {
      calculatePremium();
      updateCoverageOptionPrices();
    });
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

  if (optionName === 'employerLiability') {
    const conditionalSection = optionDiv.querySelector('.conditional-section');
    const interestedButton = optionDiv.querySelector('.interested-button');
    const notInterestedButton = optionDiv.querySelector('.not-interested-button');
    const employeesInput = optionDiv.querySelector('#employerLiabilityEmployeesCount');
    if (interestedButton && notInterestedButton && conditionalSection) {
      interestedButton.addEventListener('click', () => {
        conditionalSection.style.display = 'block';
        if (employeesInput) employeesInput.required = true;
        calculatePremium();
        updateCoverageOptionPrices();
      });
      notInterestedButton.addEventListener('click', () => {
        conditionalSection.style.display = 'none';
        if (employeesInput) employeesInput.required = false;
        calculatePremium();
        updateCoverageOptionPrices();
      });
      // Always trigger premium calculation on input change
      if (employeesInput) {
        employeesInput.addEventListener('input', calculatePremium);
      }
      // Set initial state
      if (interestedButton.classList.contains('selected')) {
        conditionalSection.style.display = 'block';
        if (employeesInput) employeesInput.required = true;
      } else {
        conditionalSection.style.display = 'none';
        if (employeesInput) employeesInput.required = false;
      }
    }
  }
}

function determinePolicyTrack() {
  const gardenTypeValue = gardenType.value;
  const children = parseInt(childrenCount.value) || 0;
  const hasContentBuildingElem = document.getElementById('hasContentBuilding');
  const hasContent = hasContentBuildingElem ? (hasContentBuildingElem.checked || hasContentBuildingElem.value === "true") : false;
  const employeesCount = parseInt(document.getElementById('employeesCount')?.value) || 0;


  if (gardenTypeValue === 'tamah') return 1;
  if (gardenTypeValue === 'privateFamily' || gardenTypeValue === 'upTo3') {
    if (children <= 6 && employeesCount === 0 && !hasContent) return 2;
    if (children <= 9 && !hasContent) return 3;
    if (children >= 10 && !hasContent) return 4;
    if (hasContent) return 7; // מסלול 7 כולל תכולה ומבנה 
  }
  if ((gardenTypeValue === 'over3' || gardenTypeValue === 'afterSchool') && !hasContent) return 5;
  if ((gardenTypeValue === 'over3' || gardenTypeValue === 'afterSchool') && hasContent) return 6;
}



function calculatePremium() {
  const gardenTypeValue = gardenType.value;
  const childrenCountValue = parseInt(childrenCount.value) || 0;
  let basePremium = 0;

  // משתנה עזר - האם בחר ביטוח תכולה ומבנה
  const hasContentBuilding = document.getElementById('hasContentBuilding');
  const includeContentBuilding = hasContentBuilding ? (hasContentBuilding.value === "true" || hasContentBuilding.checked) : false;

  // אם אין גן או אין ילדים, תמיד 0
  if (!gardenTypeValue || childrenCountValue < 1) {
    premiumAmount.textContent = '0 ₪';
    const discountDisplay = document.getElementById('discountDisplay');
    if (discountDisplay) discountDisplay.textContent = '';
    return;
  }

  // חישוב לפי מסלול
  const track = determinePolicyTrack();
  if ([3, 4, 5, 6, 7].includes(track)) {
    // טבלת מחירים חדשה
    let min = 0, perChild = 0;
    switch (track) {
      case 3:
        min = 900;
        perChild = 112.5;
        break;
      case 4:
        min = 1100;
        perChild = 110;
        break;
      case 5:
        min = 1100;
        perChild = 55;
        break;
      case 6:
        min = 1400;
        perChild = 80;
        break;
      case 7:
        min = 1400;
        perChild = 120;
        break;
    }
    basePremium = Math.max(childrenCountValue * perChild, min);
  } else {
    // חישוב basePremium לפי סוג גן ומבנה/תכולה (לשאר המסלולים, כולל מדרגות)
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
          if (childrenCountValue <= 6) basePremium = 650; // מסלול 2 - עד 6 ילדים, ללא עובדים
          else if (childrenCountValue <= 8) basePremium = 900; // מסלול 3 - עד 8 ילדים ללא מבנה/תכולה
          else if (childrenCountValue === 9) basePremium = 900 + 105; // מסלול 3 - 9 ילדים (ילד אחד נוסף)
          else if (childrenCountValue <= 10) basePremium = 1100; // מסלול 4 - עד 10 ילדים
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
  }

  // הנחות מועדון (לפי המסלול)
  const isMemberCheckbox = document.getElementById('isMember');
  const isMember = isMemberCheckbox && (isMemberCheckbox.checked || isMemberCheckbox.value === "true");
  let totalDiscount = 0;
  let minPremium = basePremium;

  if (isMember) {
    const currentTrack = determinePolicyTrack();

    // מסלול 4+7: 10 ש"ח לילד, מסלול 5+6: 5 ש"ח לילד
    if (currentTrack === 4 || currentTrack === 7) {
      totalDiscount = childrenCountValue * 10;
      minPremium = currentTrack === 4 ? 1100 : 1400;
    } else if (currentTrack === 5 || currentTrack === 6) {
      totalDiscount = childrenCountValue * 5;
      minPremium = currentTrack === 5 ? 1100 : 1400;
    }
  }

  // סכום תוספות שנבחרו
  let addonsTotal = 0;
  document.querySelectorAll('#coverageOptionsContainer .coverage-option').forEach(optionDiv => {
    const optionName = optionDiv.dataset.option;
    const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    if (!optionName || !hiddenInput) return;
    if (hiddenInput.value === 'true') {
      let price = 0;
      try {
        price = getOptionCost(optionName, gardenTypeValue, childrenCountValue, includeContentBuilding);
      } catch (e) {
        price = 0;
      }
      addonsTotal += price;
    }
  });

  // הוספת תוספת תכולה ומבנה אם נבחרה (גם אם אין אופציה כזו ב-coverage options)
  if (includeContentBuilding) {
    const contentBuildingCost = getOptionCost('contentBuilding', gardenTypeValue, childrenCountValue, includeContentBuilding);
    addonsTotal += contentBuildingCost;
  }

  let totalPremium = Math.max(basePremium - totalDiscount, minPremium) + addonsTotal;
  premiumAmount.textContent = totalPremium + ' ₪';
  const discountDisplay = document.getElementById('discountDisplay');
  if (discountDisplay) {
    discountDisplay.textContent = totalDiscount > 0 ? `הנחת מועדון: ${totalDiscount} ש"ח` : '';
  }
}




function getOptionCost(optionName, gardenTypeValue, childrenCountValue, includeContentBuilding) {
  let cost = 0;

  switch (optionName) {
    case 'contentBuilding': {
      // כלול במסלול 7 ו־6
      // if (gardenTypeValue === 'upTo3' || (gardenTypeValue === 'over3' && includeContentBuilding && childrenCountValue <= 17)) {
      //    return 0;
      //   }
      // אם המשתמש לא בחר תכולה ומבנה - אין תוספת
      if (!includeContentBuilding) {
        return 0;
      }

      // ---- תוספת עבור תכולת גן ----
      let contentAddition = 0;
      const contentSum = parseFloat(document.querySelector('.contentSum')?.value.replace(/[^0-9.]/g, '')) || 0;
      if (contentSum > 200000) {
        contentAddition = ((contentSum - 200000) / 40000) * 82;
      }

      // ---- תוספת עבור תכולת חצר ----
      // אם תכולת החצר מעל 20,000 ש"ח, מחשבים תוספת
      let yardAddition = 0;
      const yardSum = parseFloat(document.querySelector('.yardContentSum')?.value.replace(/[^0-9.]/g, '')) || 0;
      if (yardSum > 20000) {
        yardAddition = ((yardSum - 20000) / 40000) * 82;
      }

      // ---- תוספת עבור שטח מבנה ----
      let buildingAddition = 0;
      const buildingSizeValue = document.getElementById('buildingSizeExact')?.value || '';
      const buildingSize = parseFloat(buildingSizeValue.replace(/[^0-9.]/g, '')) || 0;
      if (buildingSize > 70) {
        buildingAddition = (((buildingSize * 7200) - 500000) / 40000) * 82;
      }

      // סכום סופי, מעוגל לש"ח
      cost = (contentAddition + buildingAddition + yardAddition);
      return cost;
    }


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
      const count = document.querySelectorAll('.professional-liability-row').length || 0;
      return count * 500;

    case 'employerLiability': {
      const optionDiv = document.querySelector('.coverage-option[data-option="employerLiability"]');
      const hiddenInput = optionDiv?.querySelector('input[name="insuranceOptions[employerLiability]"]');
      if (!optionDiv || !hiddenInput || hiddenInput.value !== 'true') return 0;
      const employeesCount = parseInt(optionDiv.querySelector('#employerLiabilityEmployeesCount')?.value) || 0;
      return employeesCount * 105;
    }


    case 'cyberInsurance':
      return 450;

    case 'incomeLoss':
      // קח את האלמנטים הרלוונטיים מתוך הדיב של אובדן הכנסות
      const optionDiv = document.querySelector('.coverage-option[data-option="incomeLoss"]');
      if (!optionDiv) return 0;
      const hiddenInput = optionDiv.querySelector('input[name="insuranceOptions[incomeLoss]"]');
      if (!hiddenInput || hiddenInput.value !== 'true') return 0;

      // קריאת ערכים מהשדות החדשים
      const months = parseInt(optionDiv.querySelector('.incomeLossDuration')?.value) || 3;
      const monthlyAmount = parseInt(optionDiv.querySelector('.incomeLossAmount')?.value) || 10000;

      // נוסחת החישוב:
      // 1. מכפילים את הסכום החודשי ב-12
      // 2. מחלקים ב-10,000
      // 3. מכפילים במקדם לפי חודשים
      let multiplier = 40;
      if (months === 6) multiplier = 45;
      if (months === 9) multiplier = 60;
      const result = ((monthlyAmount * 12) / 10000) * multiplier;
      return result;

    case 'birthdayActivities':
      const type = document.querySelector('.birthdayActivitiesType')?.value;
      if (type === 'internal') return 500;
      if (type === 'external') return 2000;
      return 0;


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


function isValidPhoneNumber(phone) {
  // מסיר רווחים, מקפים וסוגריים
  const cleaned = phone.replace(/[\s\-()]/g, "");
  // בדיקה של 9-10 ספרות, מתחיל ב-0 (קו ישראלי רגיל)
  return /^0\d{8,9}$/.test(cleaned);
}


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
      // דילוג – נטפל בהם בנפרד (עובדים נוספים)
    } else {
      payload[name] = el.value;
    }
  });

  // ---------- גננות - תאונות אישיות ----------
  const paNames = Array.from(document.querySelectorAll('input[name="personalAccidentEmployeeName[]"]')).map(e => e.value.trim());
  const paIds = Array.from(document.querySelectorAll('input[name="personalAccidentEmployeeId[]"]')).map(e => e.value.trim());
  const paBirthdates = Array.from(document.querySelectorAll('input[name="personalAccidentEmployeeBirthdate[]"]')).map(e => e.value.trim());
  const paCombined = paNames.map((name, i) => `${name}|${paIds[i]}|${paBirthdates[i]}`).filter(x => x.includes('|')).join(';');
  payload['personalAccidentEmployees'] = paCombined;

  // ---------- גננות - אחריות מקצועית ----------
  const profNames = Array.from(document.querySelectorAll('input[name="professionalLiabilityEmployeeName[]"]')).map(e => e.value.trim());
  const profIds = Array.from(document.querySelectorAll('input[name="professionalLiabilityEmployeeId[]"]')).map(e => e.value.trim());
  const profBirthdates = Array.from(document.querySelectorAll('input[name="professionalLiabilityEmployeeBirthdate[]"]')).map(e => e.value.trim());
  const profCombined = profNames.map((name, i) => `${name}|${profIds[i]}|${profBirthdates[i]}`).filter(x => x.includes('|')).join(';');
  payload['professionalLiabilityEmployees'] = profCombined;

  // ---------- תוספות כיסוי ----------
  document.querySelectorAll('#coverageOptionsContainer .coverage-option').forEach(optionDiv => {
    const optionName = optionDiv.dataset.option;
    const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    const isInterested = hiddenInput && hiddenInput.value === 'true';
    console.log(`collectFormData: option [${optionName}] = ${hiddenInput?.value}`);
    payload[`insuranceOptions[${optionName}]`] = isInterested ? 'true' : 'false';

    if (isInterested) {
      let value = '';
      // ספציפי לכיסוי תאונות אישיות – נשלח את המסלול
      if (optionName === 'teacherAccidents') {
        const coverageSelect = optionDiv.querySelector('.teacherAccidentsCoverage');
        if (coverageSelect) value = coverageSelect.value;
      } else if (optionName === 'employerLiability') {
        const employeesInput = optionDiv.querySelector('#employerLiabilityEmployeesCount');
        if (employeesInput) value = employeesInput.value;
      } else {
        // לאחרים – נשלח את select כללי אם יש
        const genericSelect = optionDiv.querySelector('.conditional-section select');
        if (genericSelect) value = genericSelect.value;
      }

      if (value !== '') {
        payload[`insuranceOptionsDetails[${optionName}]`] = value;
      }
    }

  });

  // --- תוספת: קליטת שני שדות לאובדן הכנסות ---
  const incomeLossDiv = document.querySelector('.coverage-option[data-option="incomeLoss"]');
  if (incomeLossDiv) {
    const isInterested = incomeLossDiv.querySelector('input[name="insuranceOptions[incomeLoss]"]')?.value === 'true';
    if (isInterested) {
      // אורך הכיסוי (חודשים)
      payload['incomeLossDuration'] = incomeLossDiv.querySelector('.incomeLossDuration')?.value || '';
      // סכום פיצוי חודשי
      payload['incomeLossAmount'] = incomeLossDiv.querySelector('.incomeLossAmount')?.value || '';
    } else {
      // אם לא מעוניין, שלח ערכים ריקים (או תוריד שורות אלה אם לא צריך)
      payload['incomeLossDuration'] = '';
      payload['incomeLossAmount'] = '';
    }
  }


  // ---------- button-groups ----------
  document.querySelectorAll('.button-group').forEach(group => {
    let selected = group.querySelector('button.selected');
    if (selected && selected.dataset.value) {
      let groupName = group.closest('[data-option]')?.dataset.option ||
        group.closest('.form-group')?.querySelector('label')?.innerText?.replace(/[^\w]/g, '') ||
        selected.innerText;
      if (groupName) payload[`buttonGroup_${groupName}`] = selected.dataset.value;
    }
  });

  // ---------- מבנה ותכולה ----------
  const hasContentBuilding = document.getElementById('hasContentBuilding');
  if (hasContentBuilding && hasContentBuilding.value === "true") {
    payload['contentBuildingDetails[contentSum]'] = document.querySelector('.contentSum')?.value || '';
    payload['contentBuildingDetails[buildingSum]'] = document.querySelector('.buildingSum')?.value || '';
    payload['contentBuildingDetails[yardContentSum]'] = document.querySelector('.yardContentSum')?.value || '';
    payload['contentBuildingDetails[buildingType]'] = document.querySelector('.buildingType')?.value || '';
    payload['contentBuildingDetails[hasLien]'] = document.querySelector('.hasLien')?.checked ? 'true' : 'false';
    payload['contentBuildingDetails[lienHolder]'] = document.querySelector('.hasLien')?.checked ? (document.querySelector('.lienHolder')?.value || '') : '';
  }

  // ---------- פרמיה, תשלום, חתימה, קבצים ----------
  let premiumText = document.getElementById('premiumAmount').textContent.replace(/[^\d.]/g, '');
  //payload['premium'] = parseFloat(premiumText) || 0;
  payload['premium'] = premiumText;
  payload['paymentMethod'] = window.selectedPaymentMethod || '';

  // ---------- automation מתוך URL ----------
  payload['automation'] = window.formAutomationFlag || 'true';

  // ---------- renewal מתוך URL ----------
  payload['renewal'] = window.formRenewalFlag || 'true';

  // ---------- policyNumber מתוך URL ----------
  payload['policyNumber'] = window.policyNumber || '';

  // ---------- מספר מסלול ----------
  payload['policyTrack'] = determinePolicyTrack();

  // ---------- מחיר תכולה ----------
  payload['contentAdditionCost'] = getContentAdditionCost();

  // ---------- מחיר מבנה ----------
  payload['buildingAdditionCost'] = getBuildingAdditionCost();

  // ---------- האם צריך עריכת ביטוח ----------
  const approvalCheckbox = document.querySelector('.form-section.active .needsApprovalCheckbox');
  payload['needsApproval'] = approvalCheckbox && approvalCheckbox.checked ? 'true' : 'false';

  // ---------- מספר ילדים בצהרון (רק אם שדה קיים) ----------
  const afterSchoolInput = document.querySelector('.afterSchoolChildrenCount');
  if (afterSchoolInput && afterSchoolInput.value) {
    payload['afterSchoolChildrenCount'] = afterSchoolInput.value;
  }



  // ---------- סוג תשלום ----------
  payload['selectedPaymentMethod'] = selectedPaymentMethod;

  console.log('🚀 Sending payload to webhook:', payload);
  return payload;
}

function getBuildingAdditionCost() {
  const includeContentBuilding = document.getElementById('hasContentBuilding')?.checked;
  if (!includeContentBuilding) return 0;
  const buildingSizeValue = document.getElementById('buildingSizeExact')?.value || '';
  const buildingSize = parseFloat(buildingSizeValue.replace(/[^0-9.]/g, '')) || 0;
  if (buildingSize > 70) {
    return (((buildingSize * 7200) - 500000) / 40000) * 82;
  }
  return 0;
}


function getContentAdditionCost() {
  const includeContentBuilding = document.getElementById('hasContentBuilding')?.checked;
  if (!includeContentBuilding) return 0;
  const contentSum = parseFloat(document.querySelector('.contentSum')?.value.replace(/[^0-9.]/g, '')) || 0;
  if (contentSum > 200000) {
    return ((contentSum - 200000) / 40000) * 82;
  }
  return 0;
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
    <input type="text" name="personalAccidentEmployeeName[]" placeholder="שם הגננת" value="${data.name || ''}" style="flex:2" required>
    <input type="text" name="personalAccidentEmployeeId[]" placeholder="ת.ז גננת" value="${data.id || ''}" style="flex:1" required>
    <div style="flex:1">
      <label style="display:block; font-size: 0.85em;">תאריך לידה:</label>
      <input type="date" name="personalAccidentEmployeeBirthdate[]" value="${data.birthdate || ''}" required>
    </div>
    <button type="button" class="removePersonalAccidentEmployee" aria-label="הסר גננת"
      style="background: #e74c3c; color: #fff; border:none; border-radius:6px; padding:6px 10px; margin-right:3px;">X</button>
  `;
  container.appendChild(row);

  // עדכון מחיר גם על שינוי ערך בשדות
  row.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', updateCoverageOptionPrices);
    input.addEventListener('change', updateCoverageOptionPrices);
  });

  row.querySelector('.removePersonalAccidentEmployee').onclick = () => {
    row.remove();
    calculatePremium();
    updateCoverageOptionPrices();
  };
  calculatePremium();
  updateCoverageOptionPrices();
}


function setupProfessionalLiabilityEmployees() {
  document.querySelectorAll('.coverage-option[data-option="professionalLiability"]').forEach(optionDiv => {
    const interestedBtn = optionDiv.querySelector('.interested-button');
    const notInterestedBtn = optionDiv.querySelector('.not-interested-button');
    const condSection = optionDiv.querySelector('.conditional-section');
    const employeesSection = condSection;
    if (!employeesSection) return;

    const rowsContainer = employeesSection.querySelector('#professionalLiabilityEmployeesRows');
    const addButton = employeesSection.querySelector('#addProfessionalLiabilityEmployeeButton');
    if (!rowsContainer || !addButton) return;

    interestedBtn.addEventListener('click', () => {
      employeesSection.style.display = 'block';
      if (rowsContainer.children.length === 0) {
        addProfessionalLiabilityEmployeeRow(rowsContainer);
      }
    });

    notInterestedBtn.addEventListener('click', () => {
      employeesSection.style.display = 'none';
      rowsContainer.innerHTML = '';
      calculatePremium();
    });

    employeesSection.style.display = interestedBtn.classList.contains('selected') ? 'block' : 'none';

    addButton.onclick = () => addProfessionalLiabilityEmployeeRow(rowsContainer);
  });
}

function addProfessionalLiabilityEmployeeRow(container, data = {}) {
  const row = document.createElement('div');
  row.className = 'form-group professional-liability-row';
  row.style.display = 'flex';
  row.style.gap = '8px';
  row.style.alignItems = 'center';
  row.innerHTML = `
    <input type="text" name="professionalLiabilityEmployeeName[]" placeholder="שם הגננת" value="${data.name || ''}" style="flex:2" required>
    <input type="text" name="professionalLiabilityEmployeeId[]" placeholder="ת.ז גננת" value="${data.id || ''}" style="flex:1" required>
    <div style="flex:1">
      <label style="display:block; font-size: 0.85em;">תאריך לידה:</label>
      <input type="date" name="professionalLiabilityEmployeeBirthdate[]" value="${data.birthdate || ''}" required>
    </div>    <button type="button" class="removeProfessionalLiabilityEmployee" aria-label="הסר גננת"
      style="background: #e74c3c; color: #fff; border:none; border-radius:6px; padding:6px 10px; margin-right:3px;">X</button>
  `;
  container.appendChild(row);

  // עדכון מחיר גם על שינוי ערך בשדות
  row.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', updateCoverageOptionPrices);
    input.addEventListener('change', updateCoverageOptionPrices);
  });

  row.querySelector('.removeProfessionalLiabilityEmployee').onclick = () => {
    row.remove();
    calculatePremium();
    updateCoverageOptionPrices();
  };
  calculatePremium();
  updateCoverageOptionPrices();
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
  console.log('Sending data to webhook:', payload);
  const response = await fetch('https://hook.eu2.make.com/767snb13mqqn3q276wb6hhggne7oyjxy', {
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

function selectCoverageOption(optionName, value) {
  const optionDiv = document.querySelector(`.coverage-option[data-option="${optionName}"]`);
  if (!optionDiv) return;

  const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
  const interestedBtn = optionDiv.querySelector('.interested-button');
  const notInterestedBtn = optionDiv.querySelector('.not-interested-button');
  const conditionalSection = optionDiv.querySelector('.conditional-section');

  if (value === 'true') {
    hiddenInput.value = 'true';
    interestedBtn.classList.add('selected');
    notInterestedBtn.classList.remove('selected');
    if (conditionalSection) conditionalSection.style.display = 'block';
  } else {
    hiddenInput.value = 'false';
    interestedBtn.classList.remove('selected');
    notInterestedBtn.classList.add('selected');
    if (conditionalSection) conditionalSection.style.display = 'none';
  }
}


function updateBuildingTypeRequired() {
  const buildingType = document.getElementById('buildingType');
  const hasContentBuilding = document.getElementById('hasContentBuilding');
  const contentBuildingGroup = document.getElementById('contentBuildingGroup');
  if (!buildingType || !hasContentBuilding) return;
  if (hasContentBuilding.value === "true" && contentBuildingGroup.style.display !== 'none') {
    buildingType.required = true;
  } else {
    buildingType.required = false;
    buildingType.value = ""; // לאפס אם מוסתר/לא נדרש
  }
}


function prefillCoverageAddonsFromUrl() {
  if (!urlPrefillData) return;

  // כל רשימת האופציות כפי שהיו אצלך
  const coverageOptions = [
    'deductibleCancellation', 'teacherAccidents', 'professionalLiability',
    'cyberInsurance', 'employerLiability', 'thirdParty', 'incomeLoss', 'afterSchoolProgram'
  ];

  // סימון כיסויים (מעוניין/לא)
  coverageOptions.forEach(optionName => {
    const value = urlPrefillData[optionName] || urlPrefillData[`insuranceOptions[${optionName}]`];
    if (!value) return;
    const optionDiv = document.querySelector(`.coverage-option[data-option="${optionName}"]`);
    if (!optionDiv) return;
    const interestedBtn = optionDiv.querySelector('.interested-button');
    const notInterestedBtn = optionDiv.querySelector('.not-interested-button');
    if (value === 'true' && interestedBtn) interestedBtn.click();
    if (value === 'false' && notInterestedBtn) notInterestedBtn.click();
    // עדכן גם את הערך של ההיידן (שיהיה סנכרון מלא)
    const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    if (hiddenInput) hiddenInput.value = value;
  });

  // בחירות פנימיות של כיסויים
  if (urlPrefillData['teacherAccidentsCoverage']) {
    const sel = document.querySelector('.teacherAccidentsCoverage');
    if (sel) sel.value = urlPrefillData['teacherAccidentsCoverage'];
  }
  if (urlPrefillData['thirdPartyCoverage']) {
    const sel = document.querySelector('.thirdPartyCoverage');
    if (sel) sel.value = urlPrefillData['thirdPartyCoverage'];
  }

  // --- מילוי אוטומטי לאובדן הכנסות ---
  const incomeLossDiv = document.querySelector('.coverage-option[data-option="incomeLoss"]');
  if (incomeLossDiv) {
    // האם לבחור "מעוניין"?
    if (urlPrefillData['insuranceOptions[incomeLoss]'] === 'true' || urlPrefillData['incomeLoss'] === 'true') {
      incomeLossDiv.querySelector('.interested-button')?.click();
      setTimeout(() => {
        if (urlPrefillData['incomeLossDuration']) {
          const sel = incomeLossDiv.querySelector('.incomeLossDuration');
          if (sel) sel.value = urlPrefillData['incomeLossDuration'];
        }
        if (urlPrefillData['incomeLossAmount']) {
          const sel = incomeLossDiv.querySelector('.incomeLossAmount');
          if (sel) sel.value = urlPrefillData['incomeLossAmount'];
        }
        calculatePremium();
      }, 100);
    }
    // אם רוצים לא מעוניין
    if (urlPrefillData['insuranceOptions[incomeLoss]'] === 'false' || urlPrefillData['incomeLossInterested'] === 'false') {
      incomeLossDiv.querySelector('.not-interested-button')?.click();
    }
  }


  // תאונות אישיות לגננת
  if (urlPrefillData['personalAccidentEmployees']) {
    const paList = urlPrefillData['personalAccidentEmployees'].split(';').filter(Boolean);
    const paContainer = document.querySelector('.personal-accident-employees-list');
    if (paContainer) paContainer.innerHTML = '';
    paList.forEach(entry => {
      const [name, id] = entry.split('|');
      addPersonalAccidentEmployeeRow(paContainer, { name, id, birthdate });
    });
  }
  // אחריות מקצועית
  if (urlPrefillData['professionalLiabilityEmployees']) {
    const profList = urlPrefillData['professionalLiabilityEmployees'].split(';').filter(Boolean);
    const profContainer = document.querySelector('.professional-liability-list');
    if (profContainer) profContainer.innerHTML = '';
    profList.forEach(entry => {
      const [name, id] = entry.split('|');
      addProfessionalLiabilityEmployeeRow(profContainer, { name, id, birthdate });
    });
  }

  // birthdayActivities - מהURL
  if (urlPrefillData['birthdayActivities']) {
    const birthdayDiv = document.querySelector('.coverage-option[data-option="birthdayActivities"]');
    if (birthdayDiv) {
      const interestedBtn = birthdayDiv.querySelector('.interested-button');
      const notInterestedBtn = birthdayDiv.querySelector('.not-interested-button');
      const hiddenInput = birthdayDiv.querySelector('input[name="insuranceOptions[birthdayActivities]"]');
      const conditionalSection = birthdayDiv.querySelector('.conditional-section');
      const typeSelect = birthdayDiv.querySelector('.birthdayActivitiesType');
      if (urlPrefillData['birthdayActivities'] === 'true') {
        interestedBtn.click();
        hiddenInput.value = 'true';
        conditionalSection.style.display = 'block';
        if (urlPrefillData['birthdayActivitiesType'] && typeSelect) {
          typeSelect.value = urlPrefillData['birthdayActivitiesType'];
        }
      } else {
        notInterestedBtn.click();
        hiddenInput.value = 'false';
        conditionalSection.style.display = 'none';
      }
    }
  }

}


function prefillFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);

  // --- דגלים כלליים (automation, renewal, policyNumber) ---
  window.formAutomationFlag = urlParams.get('automation') || 'true';
  window.formRenewalFlag = (urlParams.get('renewal') === null || urlParams.get('renewal') === 'true') ? 'true' : 'false';
  window.policyNumber = urlParams.get('policyNumber');

  // --- קודם כל: מילוי שדות בסיסיים (inputs, selects, checkboxes, radios) ---
  urlParams.forEach((value, key) => {
    let el = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
    if (el) {
      if (el.type === 'checkbox') {
        el.checked = (value === 'true' || value === '1');
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (el.type === 'radio') {
        let radio = document.querySelector(`[name="${key}"][value="${value}"]`);
        if (radio) radio.checked = true;
      } else {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });

  // --- טיפול בכפתורי כן/לא (yesno-toggle) ---
  const yesNoFields = [
    'hasOver3Children',
    'isMember', 
    'claimsLastYear',
    'supplementalInsurance',
    'hasContentBuilding',
    'hasLien',
    'waiverCheckbox'
  ];
  
  yesNoFields.forEach(field => {
    const value = urlParams.get(field);
    if (value !== null && value !== undefined) {
      const toggle = document.querySelector(`[data-field="${field}"]`);
      if (toggle) {
        const yesBtn = toggle.querySelector('.yes-btn');
        const noBtn = toggle.querySelector('.no-btn');
        const hiddenInput = toggle.querySelector('input[type="hidden"]');
        
        if (yesBtn && noBtn && hiddenInput) {
          // הסר בחירה קודמת
          yesBtn.classList.remove('selected');
          noBtn.classList.remove('selected');
          
          // בחר לפי הערך מה-URL
          if (value === 'true') {
            yesBtn.classList.add('selected');
            hiddenInput.value = 'true';
          } else if (value === 'false') {
            noBtn.classList.add('selected');
            hiddenInput.value = 'false';
          }
          
          // הפעל אירוע change כדי לעדכן תלויות
          hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  });

  // --- כיסויים (מעוניין/לא מעוניין) ---
  const coverageOptions = [
    'deductibleCancellation', 'teacherAccidents', 'professionalLiability',
    'cyberInsurance', 'employerLiability', 'thirdParty', 'incomeLoss', 'afterSchoolProgram', 'birthdayActivities'
  ];
  coverageOptions.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      const optionDiv = document.querySelector(`.coverage-option[data-option="${key}"]`);
      if (optionDiv) {
        const interestedBtn = optionDiv.querySelector('.interested-button');
        const notInterestedBtn = optionDiv.querySelector('.not-interested-button');
        if (value === 'true' && interestedBtn) interestedBtn.click();
        if (value === 'false' && notInterestedBtn) notInterestedBtn.click();
      }
    }
  });

  // --- גודל מבנה ---
  const buildingSize = urlParams.get('buildingSize');
  if (buildingSize) {
    document.querySelectorAll('.building-size-button').forEach(btn => {
      btn.classList.remove('selected');
      if (btn.dataset.value === buildingSize) btn.classList.add('selected');
    });
    if (buildingSize === 'over100') {
      document.getElementById('buildingSizeExtraInput').style.display = 'block';
      const exact = urlParams.get('buildingSizeExact');
      if (exact) document.getElementById('buildingSizeExact').value = exact;
    }
  }

  // --- סכום תכולה ---
  const contentSum = urlParams.get('contentSum');
  if (contentSum) {
    document.querySelectorAll('.content-value-button').forEach(btn => {
      btn.classList.remove('selected');
      if (btn.dataset.value === contentSum) btn.classList.add('selected');
    });
    if (contentSum === 'over200k') {
      document.getElementById('contentSumExtraInput').style.display = 'block';
      const exact = urlParams.get('contentSumExact');
      if (exact) document.getElementById('contentSumExact').value = exact;
    }
  }

  // --- סכום חצר ---
  const yardContentSum = urlParams.get('yardContentSum');
  if (yardContentSum) {
    document.querySelectorAll('.yard-value-button').forEach(btn => {
      btn.classList.remove('selected');
      if (btn.dataset.value === yardContentSum) btn.classList.add('selected');
    });
    if (yardContentSum === 'over20k') {
      document.getElementById('yardContentSumExtraInput').style.display = 'block';
      const exact = urlParams.get('yardContentSumExact');
      if (exact) document.getElementById('yardContentSumExact').value = exact;
    }
  }

  // --- סוג מבנה (select) ---
  const buildingType = urlParams.get('buildingType');
  if (buildingType) {
    document.getElementById('buildingType').value = buildingType;
  }

  // --- שעבוד ---
  const hasLien = urlParams.get('hasLien');
  if (hasLien === 'true') {
    document.getElementById('hasLien').checked = true;
    document.getElementById('lienTypeSection').style.display = 'block';
    const lienType = urlParams.get('lienType');
    if (lienType) {
      document.querySelectorAll('.lien-type-button').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.type === lienType) btn.classList.add('selected');
      });
      if (lienType === 'bank') {
        document.getElementById('lienDetailsBank').style.display = 'block';
        if (urlParams.get('lienBankName')) document.getElementById('lienBankName').value = urlParams.get('lienBankName');
        if (urlParams.get('lienBankBranch')) document.getElementById('lienBankBranch').value = urlParams.get('lienBankBranch');
        if (urlParams.get('lienBankAddress')) document.getElementById('lienBankAddress').value = urlParams.get('lienBankAddress');
      }
      if (lienType === 'company') {
        document.getElementById('lienDetailsCompany').style.display = 'block';
        if (urlParams.get('lienCompanyName')) document.getElementById('lienCompanyName').value = urlParams.get('lienCompanyName');
        if (urlParams.get('lienCompanyId')) document.getElementById('lienCompanyId').value = urlParams.get('lienCompanyId');
      }
    }
  }

  // --- ויתור שיבוב ---
  const waiverCheckbox = urlParams.get('waiverCheckbox');
  if (waiverCheckbox === 'true') {
    document.getElementById('waiverCheckbox').checked = true;
    document.getElementById('waiverDetails').style.display = 'block';
    if (urlParams.get('propertyOwnerName')) document.getElementById('propertyOwnerName').value = urlParams.get('propertyOwnerName');
    if (urlParams.get('propertyOwnerId')) document.getElementById('propertyOwnerId').value = urlParams.get('propertyOwnerId');
  }

  // --- תוספות/רשימות (גננות, אחריות מקצועית) ---
  const paEmployees = urlParams.get('personalAccidentEmployees');
  if (paEmployees) {
    const paList = paEmployees.split(';').filter(Boolean);
    const paContainer = document.querySelector('.personal-accident-employees-list');
    if (paContainer) paContainer.innerHTML = '';
    paList.forEach(entry => {
      const [name, id, birthdate] = entry.split('|');
      addPersonalAccidentEmployeeRow(paContainer, { name, id, birthdate });
    });
  }
  const profEmployees = urlParams.get('professionalLiabilityEmployees');
  if (profEmployees) {
    const profList = profEmployees.split(';').filter(Boolean);
    const profContainer = document.querySelector('.professional-liability-list');
    if (profContainer) profContainer.innerHTML = '';
    profList.forEach(entry => {
      const [name, id, birthdate] = entry.split('|');
      addProfessionalLiabilityEmployeeRow(profContainer, { name, id, birthdate });
    });
  }
}

function isCanvasBlank(canvas) {
  const context = canvas.getContext('2d');
  const pixelBuffer = new Uint32Array(
    context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );
  return !pixelBuffer.some(color => color !== 0);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌱 DOMContentLoaded התחיל');
  parseUrlParams();
  console.log('🔗 parseUrlParams הסתיים')
  console.log('🔗 urlPrefillData:', urlPrefillData);

  // --- הגבלת מספר ילדים עבור גן תמ"ת ---
  function updateChildrenCountMax() {
    const warning = document.getElementById('childrenCountTamahWarning');
    if (gardenType.value === 'tamah') {
      childrenCount.setAttribute('max', '6');
      if (parseInt(childrenCount.value) > 6) {
        childrenCount.value = 6;
        childrenCount.dispatchEvent(new Event('input'));
        if (warning) warning.style.display = 'block';
      } else {
        if (warning) warning.style.display = 'none';
      }
    } else {
      childrenCount.removeAttribute('max');
      if (warning) warning.style.display = 'none';
    }
  }
  gardenType.addEventListener('change', updateChildrenCountMax);
  childrenCount.addEventListener('input', function () {
    const warning = document.getElementById('childrenCountTamahWarning');
    if (gardenType.value === 'tamah' && parseInt(childrenCount.value) > 6) {
      childrenCount.value = 6;
      childrenCount.dispatchEvent(new Event('input'));
      if (warning) warning.style.display = 'block';
    } else {
      if (warning) warning.style.display = 'none';
    }
  });
  // הפעלה ראשונית
  updateChildrenCountMax();

  // מעבר בין עמודים
  showSection(0);

  // הגדרות לסקשן ביטוח תכולה ומבנה
  console.log('🔧 setup building section');
  setupBuildingSizeButtons();
  setupContentValueButtons();
  setupYardValueButtons();

  // הגדרות לכיסויים דינמיים
  console.log('🔧 setup כיסויים דינמיים');
  setupPersonalAccidentEmployees();
  setupProfessionalLiabilityEmployees();

  // חישוב פרמיה
  console.log('📊 חיבור אירועים לחישוב פרמיה');
  gardenType.addEventListener('change', calculatePremium);
  childrenCount.addEventListener('input', calculatePremium);

  // רק אחרי שהכל מוכן – prefill
  console.log('📥 prefill מה-URL');
  prefillFromUrl();

  // ויתור שיבוב
  const waiverCheckbox = document.getElementById('waiverCheckbox');
  const waiverDetails = document.getElementById('waiverDetails');
  if (waiverCheckbox && waiverDetails) {
    console.log('⚙️ הגדרת waiverCheckbox');
    waiverCheckbox.addEventListener('change', () => {
      waiverDetails.style.display = waiverCheckbox.checked ? 'block' : 'none';
    });
    waiverDetails.style.display = waiverCheckbox.checked ? 'block' : 'none';
  }

  // שעבוד
  const hasLien = document.getElementById("hasLien");
  const lienTypeSection = document.getElementById("lienTypeSection");
  const lienDetailsBank = document.getElementById("lienDetailsBank");
  const lienDetailsCompany = document.getElementById("lienDetailsCompany");
  if (hasLien) {
    console.log('⚙️ הגדרת hasLien');
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

  // ילדים מעל גיל 3
  const hasOver3Checkbox = document.getElementById('hasOver3Children');
  const over3CountGroup = document.getElementById('over3ChildrenCountGroup');
  const over3CountInput = document.getElementById('over3ChildrenCount');
  if (hasOver3Checkbox && over3CountGroup) {
    console.log('⚙️ הגדרת ילדים מעל גיל 3');
    hasOver3Checkbox.addEventListener('change', () => {
      over3CountGroup.style.display = hasOver3Checkbox.checked ? 'block' : 'none';
      if (!hasOver3Checkbox.checked && over3CountInput) over3CountInput.value = '';
    });
    over3CountGroup.style.display = hasOver3Checkbox.checked ? 'block' : 'none';
  }

  // תצוגה לפי תיבות סימון שדורשות אישור
  document.querySelectorAll('.needsApprovalCheckbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const infoDiv = this.closest('.form-group').querySelector('.approval-info-text');
      if (infoDiv) {
        infoDiv.style.display = this.checked ? 'block' : 'none';
      }
    });
  });


  // מצא את כפתור השליחה במסך אשראי
  const creditCardSection = document.getElementById('creditCardSection');
  if (creditCardSection) {
    const submitBtn = creditCardSection.querySelector('.submit-button[type="submit"], #creditCardSubmit');
    if (submitBtn) {
      submitBtn.addEventListener('click', function (e) {
        if (sections[currentSectionIndex].id === 'creditCardSection') {
          const signatureCanvas = document.getElementById('signatureCanvasCredit');
          if (isCanvasBlank(signatureCanvas)) {
            e.preventDefault();
            alert('יש לחתום על הטופס לפני השליחה.');
            signatureCanvas.style.border = "2px solid red";
            setTimeout(() => signatureCanvas.style.border = "", 2000);
            signatureCanvas.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
          }
          // רק אם חתמו ממשיכים:
          const paymentUrl = "https://icom.yaad.net/cgi-bin/yaadpay/yaadpay3ds.pl?Amount=1&Coin=1&FixTash=True&Info=%F4%E5%EC%E9%F1%FA%20%E1%E9%E8%E5%E7%20%EE%F9%F4%E7%FA%E5%EF%2F%E2%EF%20%E9%EC%E3%E9%ED%2F%F6%E4%F8%E5%EF&Masof=4501600320&MoreData=True&PageLang=HEB&Postpone=True&ShowEngTashText=True&Tash=1&UTF8out=True&action=pay&freq=1&sendemail=True&signature=f3de6f68f2cba7605e251da1152f9cbd02c9ef4935cf9a5398a5032a9c38e700";
          window.open(paymentUrl, '_blank');
          setTimeout(() => {
            const thankYouSectionIndex = sections.findIndex(sec => sec.id === 'thankYouSection');
            if (thankYouSectionIndex !== -1) {
              showSection(thankYouSectionIndex);
            }
          }, 100);
        }
      });
    }
  }


  const policyStartDate = document.getElementById('policyStartDate');
  const policyEndDate = document.getElementById('policyEndDate');

  if (policyStartDate && policyEndDate) {
    // שים תמיד disabled
    policyStartDate.disabled = true;
    policyEndDate.disabled = true;

    // בדוק אם הגיע ערך מה-URL
    const urlParams = new URLSearchParams(window.location.search);
    const startValue = urlParams.get('policyStartDate');
    const endValue = urlParams.get('policyEndDate');

    if (startValue) {
      policyStartDate.value = startValue;
    }
    if (endValue) {
      policyEndDate.value = endValue;
    }
  }

  // הגדרה לפי עמודי התשלום
  const payments = [
    { sectionId: 'bankTransferSection', canvasId: 'signatureCanvasBank', buttonSelector: '.submit-button' },
    { sectionId: 'creditCardSection', canvasId: 'signatureCanvasCredit', buttonSelector: '.submit-button' },
    { sectionId: 'debitAuthSection', canvasId: 'signatureCanvasDebit', buttonSelector: '.submit-button' }
  ];

  payments.forEach(({ sectionId, canvasId, buttonSelector }) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // בוחר רק את כפתור השליחה שבתוך הסקשן הרלוונטי!
    const submitBtn = section.querySelector(buttonSelector);
    const signatureCanvas = document.getElementById(canvasId);

    if (submitBtn && signatureCanvas) {
      submitBtn.addEventListener('click', function (e) {
        // נוודא שאכן נמצאים ב-section הנכון (זהירות עם מעבר בין סקשנים)
        if (sections[currentSectionIndex].id !== sectionId) return;

        if (isCanvasBlank(signatureCanvas)) {
          e.preventDefault();
          alert('יש לחתום על הטופס לפני השליחה.');
          signatureCanvas.style.border = "2px solid red";
          setTimeout(() => signatureCanvas.style.border = "", 2000);
          signatureCanvas.scrollIntoView({ behavior: "smooth", block: "center" });
          return false;
        }
        // אחרת ממשיך כרגיל
      });
    }
  });

  // (שים אחרי כל קריאות ה-prefill שלך)
  updateBuildingTypeRequired();
  const hasContentBuilding = document.getElementById('hasContentBuilding');
  if (hasContentBuilding) {
    hasContentBuilding.addEventListener('change', updateBuildingTypeRequired);
  }

  // --- הצגה/הסתרה של צ'קבוקס "האם תרצה לבטח את המבנה ותכולת הגן?" ---
  const hasContentBuildingGroup = document.getElementById('hasContentBuildingGroup');
  const gardenTypeSelect = document.getElementById('gardenType');

  function updateHasContentBuildingVisibility() {
    if (gardenTypeSelect.value === 'tamah' || gardenTypeSelect.value === '') {
      hasContentBuildingGroup.style.display = 'none';
      document.getElementById('hasContentBuilding').checked = false;
    } else {
      hasContentBuildingGroup.style.display = '';
    }
  }

  // קריאה ראשונית
  updateHasContentBuildingVisibility();

  // האזנה לשינויים
  gardenTypeSelect.addEventListener('change', updateHasContentBuildingVisibility);

  document.querySelectorAll('.yesno-toggle').forEach(toggle => {
    const field = toggle.dataset.field;
    const yesBtn = toggle.querySelector('.yes-btn');
    const noBtn = toggle.querySelector('.no-btn');
    const hiddenInput = toggle.querySelector('input[type="hidden"]');

    // פונקציה אחידה
    const setValue = val => {
      hiddenInput.value = val;
      if (val === "true") {
        yesBtn.classList.add('selected');
        noBtn.classList.remove('selected');
      } else if (val === "false") {
        yesBtn.classList.remove('selected');
        noBtn.classList.add('selected');
      } else {
        yesBtn.classList.remove('selected');
        noBtn.classList.remove('selected');
        hiddenInput.value = "";
      }
    };

    yesBtn.onclick = () => setValue("true");
    noBtn.onclick = () => setValue("false");

    // מילוי אוטומטי מה־URL (אם יש)
    if (typeof urlPrefillData !== "undefined" && urlPrefillData[field] !== undefined) {
      setValue(urlPrefillData[field] === "true" ? "true" : "false");
    } else {
      setValue(""); // בלי בחירה
    }
  });

  function setupYesNoDependencies() {
    // 1. האם יש ילדים שמלאו להם 3 בספטמבר של שנת הלימודים של הפוליסה?
    function updateOver3ChildrenGroup() {
      const value = document.getElementById('hasOver3Children').value;
      document.getElementById('over3ChildrenCountGroup').style.display = value === "true" ? "block" : "none";
    }
    updateOver3ChildrenGroup();
    document.querySelectorAll('[data-field="hasOver3Children"] .yes-btn, [data-field="hasOver3Children"] .no-btn').forEach(btn =>
      btn.addEventListener('click', updateOver3ChildrenGroup)
    );

    // 2. האם חבר באחד מארגוני הגנים?
    function updateMembershipSection() {
      const value = document.getElementById('isMember').value;
      document.getElementById('membershipSection').style.display = value === "true" ? "block" : "none";
    }
    updateMembershipSection();
    document.querySelectorAll('[data-field="isMember"] .yes-btn, [data-field="isMember"] .no-btn').forEach(btn =>
      btn.addEventListener('click', updateMembershipSection)
    );

    // 3. האם היו תביעות בשנה האחרונה?  (אין לו סקשן דינמי – אם רק צריך value, לא צריך קוד נוסף)

    // 4. האם ברצונך לרכוש ביטוח משלים לדירה?  (אין לו סקשן דינמי – אם רק צריך value, לא צריך קוד נוסף)

    // 5. האם תרצה לבטח את המבנה ותכולת הגן?
    // לדוג' – אם צריך להפעיל קבוצה/חישוב/הגיון (אם אין סקשן, אפשר להסיר)
    // דוגמה: עדכון חישוב פרמיה/הצגת קבוצות
    function updateContentBuildingLogic() {
      // כאן שים כל לוגיקה שקשורה ל"hasContentBuilding"
      // למשל: חישוב פרמיה/עדכון תצוגה
      calculatePremium();
      // showSection();
      // ... לפי הצורך שלך
    }
    document.querySelectorAll('[data-field="hasContentBuilding"] .yes-btn, [data-field="hasContentBuilding"] .no-btn').forEach(btn =>
      btn.addEventListener('click', updateContentBuildingLogic)
    );
    // אפשר גם להפעיל פעם אחת בטעינה (אם דרוש):
    // updateContentBuildingLogic();
  }
  setupYesNoDependencies();
  
  // הפעל עדכוני תלויות אחרי prefill מה-URL
  function triggerYesNoDependenciesAfterUrlPrefill() {
    // עדכון ילדים מעל גיל 3
    const hasOver3Children = document.getElementById('hasOver3Children');
    if (hasOver3Children && hasOver3Children.value === 'true') {
      document.getElementById('over3ChildrenCountGroup').style.display = 'block';
    }
    
    // עדכון חברות במועדון
    const isMember = document.getElementById('isMember');
    if (isMember && isMember.value === 'true') {
      document.getElementById('membershipSection').style.display = 'block';
    }
    
    // עדכון שעבוד
    const hasLien = document.getElementById('hasLien');
    if (hasLien && hasLien.value === 'true') {
      document.getElementById('lienTypeSection').style.display = 'block';
    }
    
    // עדכון ויתור שיבוב
    const waiverCheckbox = document.getElementById('waiverCheckbox');
    if (waiverCheckbox && waiverCheckbox.value === 'true') {
      document.getElementById('waiverDetails').style.display = 'block';
    }
    
    // עדכון חישוב פרמיה
    calculatePremium();
  }
  
  // הפעל אחרי prefill מה-URL
  setTimeout(triggerYesNoDependenciesAfterUrlPrefill, 100);


  function setupLienAndWaiverLogic() {
    // האם קיים שעבוד?
    function updateLienSections() {
      const hasLien = document.getElementById('hasLien').value;
      const lienTypeSection = document.getElementById('lienTypeSection');
      const lienDetailsBank = document.getElementById('lienDetailsBank');
      const lienDetailsCompany = document.getElementById('lienDetailsCompany');
      // הצג/הסתר בחירה של סוג משעבד
      lienTypeSection.style.display = hasLien === "true" ? "block" : "none";
      // הסתר את שניהם אם אין שעבוד
      if (hasLien !== "true") {
        lienDetailsBank.style.display = "none";
        lienDetailsCompany.style.display = "none";
      }
    }
    updateLienSections();
    document.querySelectorAll('[data-field="hasLien"] .yes-btn, [data-field="hasLien"] .no-btn').forEach(btn =>
      btn.addEventListener('click', updateLienSections)
    );

    // סוג המשעבד (כפתורי "בנק"/"חברה")
    document.querySelectorAll('.lien-type-button').forEach(btn => {
      btn.addEventListener('click', function () {
        // עיצוב נבחר
        document.querySelectorAll('.lien-type-button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        // עדכון value
        document.getElementById('lienType').value = btn.dataset.type;
        // הצגת סקשן מתאים
        document.getElementById('lienDetailsBank').style.display = btn.dataset.type === 'bank' ? 'block' : 'none';
        document.getElementById('lienDetailsCompany').style.display = btn.dataset.type === 'company' ? 'block' : 'none';
      });
    });

    // ויתור זכות שיבוב
    function updateWaiverDetails() {
      const value = document.getElementById('waiverCheckbox').value;
      document.getElementById('waiverDetails').style.display = value === "true" ? "block" : "none";
    }
    updateWaiverDetails();
    document.querySelectorAll('[data-field="waiverCheckbox"] .yes-btn, [data-field="waiverCheckbox"] .no-btn').forEach(btn =>
      btn.addEventListener('click', updateWaiverDetails)
    );
  }
  setupLienAndWaiverLogic();


  console.log('✅ כל ה־setup הסתיים');

  // ברירת מחדל: כל כפתורי כן/לא בעמוד פרטי ביטוח על 'לא'
  function setInsuranceDetailsYesNoDefaults() {
    const yesNoFields = [
      'hasOver3Children',
      'isMember',
      'claimsLastYear',
      'supplementalInsurance',
      'hasContentBuilding'
    ];
    yesNoFields.forEach(field => {
      const group = document.querySelector(`[data-field="${field}"]`);
      if (!group) return;
      const yesBtn = group.querySelector('.yes-btn');
      const noBtn = group.querySelector('.no-btn');
      const hidden = group.querySelector('input[type="hidden"]');
      
      // בדוק אם יש ערך מה-URL
      const urlParams = new URLSearchParams(window.location.search);
      const urlValue = urlParams.get(field);
      
      if (noBtn && yesBtn && hidden) {
        if (urlValue !== null && urlValue !== undefined) {
          // יש ערך מה-URL - השתמש בו
          if (urlValue === 'true') {
            yesBtn.classList.add('selected');
            noBtn.classList.remove('selected');
            hidden.value = 'true';
          } else {
            yesBtn.classList.remove('selected');
            noBtn.classList.add('selected');
            hidden.value = 'false';
          }
        } else {
          // אין ערך מה-URL - השתמש בברירת מחדל
          yesBtn.classList.remove('selected');
          noBtn.classList.add('selected');
          hidden.value = 'false';
        }
      }
    });
  }
  setInsuranceDetailsYesNoDefaults();

  // ... existing code ...
  function updateCoverageOptionPrices() {
    const gardenTypeValue = gardenType.value;
    const childrenCountValue = parseInt(childrenCount.value) || 0;
    const hasContentBuilding = document.getElementById('hasContentBuilding');
    const includeContentBuilding = hasContentBuilding ? (hasContentBuilding.value === "true" || hasContentBuilding.checked) : false;

    document.querySelectorAll('#coverageOptionsContainer .coverage-option').forEach(optionDiv => {
      const optionName = optionDiv.dataset.option;
      const priceSpan = optionDiv.querySelector('.option-cost');
      let price = 0;
      try {
        price = getOptionCost(optionName, gardenTypeValue, childrenCountValue, includeContentBuilding);
      } catch (e) {
        price = 0;
      }
      if (priceSpan) {
        priceSpan.textContent = `מחיר: ₪${price}`;
        console.log('עדכון מחיר עבור', optionName, '->', price);
      } else {
        console.warn('לא נמצא option-cost עבור', optionName);
      }
    });
    updateAddonsTotal();
  }
  window.updateCoverageOptionPrices = updateCoverageOptionPrices;


  function updateAddonsTotal() {
    let total = 0;
    const gardenTypeValue = gardenType.value;
    const childrenCountValue = parseInt(childrenCount.value) || 0;
    const hasContentBuilding = document.getElementById('hasContentBuilding');
    const includeContentBuilding = hasContentBuilding ? (hasContentBuilding.value === "true" || hasContentBuilding.checked) : false;
    document.querySelectorAll('#coverageOptionsContainer .coverage-option').forEach(optionDiv => {
      const optionName = optionDiv.dataset.option;
      const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
      if (!optionName || !hiddenInput) return;
      if (hiddenInput.value === 'true') {
        let price = 0;
        try {
          price = getOptionCost(optionName, gardenTypeValue, childrenCountValue, includeContentBuilding);
        } catch (e) {
          price = 0;
        }
        total += price;
      }
    });
    const totalDisplay = document.getElementById('addonsTotalDisplay');
    if (totalDisplay) totalDisplay.textContent = `סך הכל תוספות: ₪${total}`;
  }

  // קריאה לפונקציה בכל עדכון מחירי תוספות
  const originalUpdateCoverageOptionPrices = updateCoverageOptionPrices;
  updateCoverageOptionPrices = function () {
    ensureOptionCostSpans();
    originalUpdateCoverageOptionPrices.apply(this, arguments);
    updateAddonsTotal();
  };

  // עדכון מחיר מיידי כשמוסיפים/מסירים גננת
  function observePersonalAccidentRows() {
    const container = document.getElementById('personalAccidentEmployeesRows');
    if (!container) return;
    const observer = new MutationObserver(() => {
      calculatePremium();
    });
    observer.observe(container, { childList: true, subtree: false });
  }
  function observeProfessionalLiabilityRows() {
    const container = document.getElementById('professionalLiabilityEmployeesRows');
    if (!container) return;
    const observer = new MutationObserver(() => {
      calculatePremium();
    });
    observer.observe(container, { childList: true, subtree: false });
  }
  // הפעלה אחרי כל עדכון הרחבות
  const originalUpdateCoverageOptions2 = updateCoverageOptions;
  updateCoverageOptions = function () {
    originalUpdateCoverageOptions2.apply(this, arguments);
    setTimeout(() => {
      observePersonalAccidentRows();
      observeProfessionalLiabilityRows();
    }, 0);
  };

  // האזנה לשדות מספריים לעדכון חישוב פרמיה
  function setupNumericInputListeners() {
    const numericFields = [
      'buildingSizeExact',
      'contentSumExact', 
      'yardContentSumExact'
    ];

    numericFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field) return;

      field.addEventListener('input', function() {
        // הפעל חישוב פרמיה כשהערך משתנה
        calculatePremium();
      });
    });
  }

  // הפעל את האזנת השדות המספריים
  setupNumericInputListeners();
});

// חיזוק: ודא שלכל כיסוי יש option-cost
function ensureOptionCostSpans() {
  document.querySelectorAll('#coverageOptionsContainer .coverage-option').forEach(optionDiv => {
    let priceSpan = optionDiv.querySelector('.option-cost');
    if (!priceSpan) {
      // הוסף ליד הכותרת (h4 או h3)
      let header = optionDiv.querySelector('h4, h3, .option-title');
      if (header) {
        priceSpan = document.createElement('span');
        priceSpan.className = 'option-cost';
        priceSpan.style.marginRight = '8px';
        header.appendChild(priceSpan);
        console.log('Created option-cost span for', optionDiv.dataset.option);
      }
    }
  });
}
