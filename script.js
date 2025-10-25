const form = document.getElementById('insuranceForm');
const gardenType = document.getElementById('gardenType');
const childrenCount = document.getElementById('childrenCount');
const premiumAmount = document.getElementById('premiumAmount');
const isMemberCheckbox = document.getElementById('isMember');
const membershipSection = document.getElementById('membershipSection');
let selectedPaymentMethod = '';

// חוסם שליחת טופס עם Enter בכל הטופס (מלבד textarea).
form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag !== 'textarea') {
      e.preventDefault(); // לא עושה כלום בלחיצת Enter
    }
  }
});


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
    'afterSchoolProgram',
    'incomeLoss'
  ],
  'upTo3': [
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'incomeLoss',
    'birthdayActivities',
    'afterSchoolProgram',
  ],
  'over3': [
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'birthdayActivities',
    'afterSchoolProgram',
    'incomeLoss'
  ],
  'afterSchool': [
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'birthdayActivities',
    'cyberInsurance',
    'professionalLiability',
    'incomeLoss'
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

  // טען שמירה קודמת רק אם אין שום ערך ב־URL
  if (Object.keys(urlPrefillData).length === 0) {
    loadFormProgress();
  }

  // בדיקה אם הקישור הוא של נציג
  const isRepresentative = urlParams.get('representative') === 'true';
  const agentBox = document.querySelector('.agent-notes-box');
  const repNameField = document.getElementById('representativeName');

  if (agentBox && repNameField) {
    if (isRepresentative) {
      // נציג → הצג שדות, הפוך את שם הנציג לחובה
      agentBox.style.display = 'block';
      repNameField.setAttribute('data-required', 'true');
    } else {
      // משתמש רגיל → הסתר שדות
      agentBox.style.display = 'none';
      repNameField.removeAttribute('data-required');
      repNameField.value = '';
      document.getElementById('notes1').value = '';
      document.getElementById('notes2').value = '';
    }
  }



  // קריאת פרמטר discount מה-URL (נשמר אצלך כבר)
  const discountParam = urlParams.get('discount');
  if (discountParam) {
    const discountValue = parseInt(discountParam);
    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      dynamicDiscountPercent = discountValue;
      console.log(`🎉 הנחה דינמית נטענה: ${dynamicDiscountPercent}%`);
    } else {
      console.warn(`⚠️ ערך הנחה לא תקין: ${discountParam}. ערך תקין הוא מספר בין 0 ל-100`);
    }
  }

  // טעינת הערות נציג (notes1, notes2) מה-URL אם קיימות
  const notes1Param = urlParams.get('notes1');
  const notes2Param = urlParams.get('notes2');

  if (notes1Param !== null || notes2Param !== null) {
    const agentNotesBox = document.querySelector('.agent-notes-box');
    if (agentNotesBox) agentNotesBox.style.display = 'block';
  }

  if (notes1Param !== null) {
    const notes1Field = document.getElementById('notes1');
    if (notes1Field) {
      notes1Field.value = decodeURIComponent(notes1Param);
      notes1Field.style.display = 'block';
      notes1Field.closest('.form-group').style.display = 'block';
    }
  }

  if (notes2Param !== null) {
    const notes2Field = document.getElementById('notes2');
    if (notes2Field) {
      notes2Field.value = decodeURIComponent(notes2Param);
      notes2Field.style.display = 'block';
      notes2Field.closest('.form-group').style.display = 'block';
    }
  }
}



function resetForm() {
  if (confirm("האם אתה בטוח שברצונך לאפס את הטופס?")) {
    // הסרת שמירה
    localStorage.removeItem("formProgress");

    // ניקוי פרמטרים מה-URL
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    // רענון הדף
    location.reload();
  }
}


function saveFormProgress() {
  const inputs = document.querySelectorAll('input, select, textarea');
  const data = {};
  inputs.forEach(input => {
    const name = input.name || input.id;
    if (!name) return;

    if (input.type === 'radio' || input.type === 'checkbox') {
      data[name] = input.checked;
    } else {
      data[name] = input.value;
    }
  });

  const selectedOptions = {};
  document.querySelectorAll('.coverage-option').forEach(option => {
    const optName = option.dataset.option;
    const input = option.querySelector(`input[name="insuranceOptions[${optName}]"]`);
    if (input) selectedOptions[optName] = input.value;
  });

  data.coverageSelections = selectedOptions;
  localStorage.setItem('formProgress', JSON.stringify(data));
}

function loadFormProgress() {
  const saved = localStorage.getItem('formProgress');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const name = input.name || input.id;
      if (!name || !(name in data)) return;

      if (input.type === 'radio' || input.type === 'checkbox') {
        input.checked = data[name];
      } else {
        input.value = data[name];
      }
    });

    // Restore coverage selections
    const selections = data.coverageSelections || {};
    Object.entries(selections).forEach(([key, val]) => {
      const option = document.querySelector(`.coverage-option[data-option="${key}"]`);
      if (!option) return;

      const input = option.querySelector(`input[name="insuranceOptions[${key}]"]`);
      const interestedBtn = option.querySelector('.interested-button');
      const notInterestedBtn = option.querySelector('.not-interested-button');

      if (val === 'true') {
        interestedBtn?.click();
      } else if (val === 'false') {
        notInterestedBtn?.click();
      }
    });
  } catch (err) {
    console.warn('⚠️ טופס שמור לא תקין בלוקאל סטורג׳:', err);
  }
}


const childrenCountInput = document.getElementById('childrenCount');
const over3ChildrenInput = document.getElementById('over3ChildrenCount');
const hasOver3ChildrenGroup = document.getElementById('hasOver3ChildrenGroup');

if (gardenType && hasOver3ChildrenGroup) {
  const toggleOver3ChildrenField = () => {
    if (gardenType.value === 'over3' || gardenType.value === 'afterSchool') {
      hasOver3ChildrenGroup.style.display = 'none';
      // איפוס הערכים כשמסתירים
      const hasOver3Input = document.getElementById('hasOver3Children');
      if (hasOver3Input) hasOver3Input.value = '';

      const over3Count = document.getElementById('over3ChildrenCount');
      if (over3Count) over3Count.value = '';

      const over3Group = document.getElementById('over3ChildrenCountGroup');
      if (over3Group) over3Group.style.display = 'none';
    } else {
      hasOver3ChildrenGroup.style.display = 'block';
    }
  };

  // הפעלה ראשונית
  toggleOver3ChildrenField();

  // האזנה לשינויים
  gardenType.addEventListener('change', toggleOver3ChildrenField);
}



if (childrenCountInput && over3ChildrenInput) {
  // עדכון מגבלה כשמשנים את מספר הילדים הכללי
  childrenCountInput.addEventListener('input', () => {
    const total = parseInt(childrenCountInput.value) || 0;
    over3ChildrenInput.max = total;
    if (parseInt(over3ChildrenInput.value) > total) {
      over3ChildrenInput.value = total;
    }
  });

  // גם בשינוי בשדה מעל גיל 3 – למנוע חריגה
  over3ChildrenInput.addEventListener('input', () => {
    const total = parseInt(childrenCountInput.value) || 0;
    if (parseInt(over3ChildrenInput.value) > total) {
      over3ChildrenInput.value = total;
    }
  });
}

if (childrenCountInput) enforceMinOne(childrenCountInput);
if (over3ChildrenInput) enforceMinOne(over3ChildrenInput);



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
    saveFormProgress();
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

    const emailInput = document.getElementById('emailAddress');
    if (emailInput && emailInput.closest('.form-section').classList.contains('active')) {
      if (!isValidEmail(emailInput.value)) {
        isValid = false;
        emailInput.style.borderColor = 'red';
        alert('אנא הזן כתובת מייל תקינה.');
        return;
      }
    }

    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput && phoneInput.closest('.form-section').classList.contains('active')) {
      if (!isValidPhoneNumber(phoneInput.value)) {
        isValid = false;
        phoneInput.style.borderColor = 'red';
        alert('אנא הזן מספר טלפון תקין בפורמט ישראלי.');
        return;
      }
    }

    const idNumberInput = document.getElementById('idNumber');
    if (idNumberInput && idNumberInput.closest('.form-section').classList.contains('active')) {
      if (!/^\d+$/.test(idNumberInput.value)) {
        isValid = false;
        idNumberInput.style.borderColor = 'red';
        alert('יש להזין מספרים בלבד בשדה ת.ז / ח.פ / ע.ר');
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


    // וידוא בחירה בכפתורי גודל מבנה
    if (sections[currentSectionIndex].id === 'contentBuildingSection') {
      const buildingSizeButtons = document.querySelectorAll('.building-size-button');
      const hasSelectedBuildingSize = Array.from(buildingSizeButtons).some(btn => btn.classList.contains('selected'));
      if (!hasSelectedBuildingSize) {
        isValid = false;
        alert('אנא בחר גודל מבנה');
        return;
      }

      // וידוא בחירה בכפתורי סוג מבנה
      const buildingTypeButtons = document.querySelectorAll('.buildingType option');
      const hasSelectedBuildingType = document.getElementById('buildingType').value;
      if (!hasSelectedBuildingType) {
        isValid = false;
        alert('אנא בחר סוג מבנה');
        return;
      }

      // אם נבחר "מעל 70 מ"ר" - וידוא שמולא השדה הנוסף
      const over100Button = document.querySelector('.building-size-button[data-value="over100"]');
      if (over100Button && over100Button.classList.contains('selected')) {
        const buildingSizeExact = document.getElementById('buildingSizeExact');
        if (!buildingSizeExact.value.trim()) {
          isValid = false;
          buildingSizeExact.style.borderColor = 'red';
          alert('אנא מלא את גודל המבנה המדויק');
          return;
        }
      }
    }

    // וידוא בחירה בכפתורי סכום ביטוח תכולה
    if (sections[currentSectionIndex].id === 'contentBuildingSection') {
      const contentValueButtons = document.querySelectorAll('.content-value-button');
      const hasSelectedContentValue = Array.from(contentValueButtons).some(btn => btn.classList.contains('selected'));
      if (!hasSelectedContentValue) {
        isValid = false;
        alert('אנא בחר סכום ביטוח תכולה');
        return;
      }

      // אם נבחר "מעל 200,000 ₪" - וידוא שמולא השדה הנוסף
      const over200kButton = document.querySelector('.content-value-button[data-value="over200k"]');
      if (over200kButton && over200kButton.classList.contains('selected')) {
        const contentSumExact = document.getElementById('contentSumExact');
        if (!contentSumExact.value.trim()) {
          isValid = false;
          contentSumExact.style.borderColor = 'red';
          alert('אנא מלא את שווי התכולה המדויק');
          return;
        }
      }
    }

    // וידוא בחירה בכפתורי סכום תכולת חצר
    if (sections[currentSectionIndex].id === 'contentBuildingSection') {
      const yardValueButtons = document.querySelectorAll('.yard-value-button');
      const hasSelectedYardValue = Array.from(yardValueButtons).some(btn => btn.classList.contains('selected'));
      if (!hasSelectedYardValue) {
        isValid = false;
        alert('אנא בחר סכום תכולת חצר');
        return;
      }

      // אם נבחר "מעל 20,000 ₪" - וידוא שמולא השדה הנוסף
      const over20kButton = document.querySelector('.yard-value-button[data-value="over20k"]');
      if (over20kButton && over20kButton.classList.contains('selected')) {
        const yardContentSumExact = document.getElementById('yardContentSumExact');
        if (!yardContentSumExact.value.trim()) {
          isValid = false;
          yardContentSumExact.style.borderColor = 'red';
          alert('אנא מלא את שווי תכולת החצר המדויק');
          return;
        }
      }
    }

    // וידוא בחירה בשאלה "האם קיים שעבוד?"
    if (sections[currentSectionIndex].id === 'contentBuildingSection') {
      const hasLienToggle = document.querySelector('[data-field="hasLien"]');
      if (hasLienToggle) {
        const hiddenInput = hasLienToggle.querySelector('input[type="hidden"]');
        if (!hiddenInput.value) {
          isValid = false;
          alert('אנא בחר האם קיים שעבוד');
          return;
        }

        // אם נבחר "כן" - וידוא שמולאו פרטי השעבוד
        if (hiddenInput.value === 'true') {
          const lienTypeButtons = document.querySelectorAll('.lien-type-button');
          const hasSelectedLienType = Array.from(lienTypeButtons).some(btn => btn.classList.contains('selected'));
          if (!hasSelectedLienType) {
            isValid = false;
            alert('אנא בחר סוג המשעבד');
            return;
          }

          // וידוא שמולאו פרטי הבנק או החברה
          const lienDetailsBank = document.getElementById('lienDetailsBank');
          const lienDetailsCompany = document.getElementById('lienDetailsCompany');

          if (lienDetailsBank && lienDetailsBank.style.display !== 'none') {
            const bankName = document.getElementById('lienBankName');
            const bankBranch = document.getElementById('lienBankBranch');
            const bankAddress = document.getElementById('lienBankAddress');

            if (!bankName.value.trim() || !bankBranch.value.trim() || !bankAddress.value.trim()) {
              isValid = false;
              alert('אנא מלא את כל פרטי הבנק');
              return;
            }
          }

          if (lienDetailsCompany && lienDetailsCompany.style.display !== 'none') {
            const companyName = document.getElementById('lienCompanyName');
            const companyId = document.getElementById('lienCompanyId');

            if (!companyName.value.trim() || !companyId.value.trim()) {
              isValid = false;
              alert('אנא מלא את כל פרטי החברה');
              return;
            }
          }
        }
      }
    }

    // וידוא בחירה בשאלה "ויתור זכות שיבוב"
    if (sections[currentSectionIndex].id === 'contentBuildingSection') {
      const waiverToggle = document.querySelector('[data-field="waiverCheckbox"]');
      if (waiverToggle) {
        const hiddenInput = waiverToggle.querySelector('input[type="hidden"]');
        if (!hiddenInput.value) {
          isValid = false;
          alert('אנא בחר האם יש ויתור זכות שיבוב');
          return;
        }

        // אם נבחר "כן" - וידוא שמולאו פרטי בעל הנכס
        if (hiddenInput.value === 'true') {
          const propertyOwnerName = document.getElementById('propertyOwnerName');
          const propertyOwnerId = document.getElementById('propertyOwnerId');

          if (!propertyOwnerName.value.trim() || !propertyOwnerId.value.trim()) {
            isValid = false;
            alert('אנא מלא את פרטי בעל הנכס');
            return;
          }
        }
      }
    }

    // וידוא בחירה בכפתורי כן/לא בסקשן פרטי ביטוח
    if (sections[currentSectionIndex].id === 'insuranceDetails') {
      // אין לדרוש "hasOver3Children" אם נבחר גן מעל גיל 3 או צהרון בלבד
      const requireHasOver3 = !(gardenType.value === 'over3' || gardenType.value === 'afterSchool');

      const yesNoFields = [
        ...(requireHasOver3 ? ['hasOver3Children'] : []),
        'isMember',
        'claimsLastYear',
        'supplementalInsurance',
        'hasContentBuilding'
      ];

      // בדיקת בחירה בכל שדות ה־כן/לא הנדרשים
      for (const field of yesNoFields) {
        const toggle = document.querySelector(`[data-field="${field}"]`);
        if (!toggle) continue;
        const hiddenInput = toggle.querySelector('input[type="hidden"]');
        if (!hiddenInput || hiddenInput.value === '') {
          isValid = false;
          alert(`אנא בחר ${getFieldDisplayName(field)}`);
          break;
        }
      }

      // שדות תלויים — רק אם השאלה רלוונטית (לא במצבים over3/afterSchool)
      if (requireHasOver3) {
        const hasOver3Hidden = document.querySelector('[data-field="hasOver3Children"] input[type="hidden"]');
        if (hasOver3Hidden && hasOver3Hidden.value === 'true') {
          const over3CountInput = document.getElementById('over3ChildrenCount');
          if (!over3CountInput.value.trim()) {
            isValid = false;
            over3CountInput.style.borderColor = 'red';
            alert('אנא מלא את מספר הילדים מעל גיל 3');
          }
        }
      }

      // דרישת סוג מועדון — רק אם נבחר "כן" בחברות מועדון
      const isMemberHidden = document.querySelector('[data-field="isMember"] input[type="hidden"]');
      if (isMemberHidden && isMemberHidden.value === 'true') {
        const membershipType = document.getElementById('membershipType');
        if (!membershipType.value) {
          isValid = false;
          membershipType.style.borderColor = 'red';
          alert('אנא בחר את סוג המועדון');
        }
      }
    }



    // וידוא שדות חובה נוספים שמופיעים רק כשכפתור לחוץ
    if (sections[currentSectionIndex].id === 'coverageAddons') {
      // וידוא שכל כיסוי נבחר (מעוניין או לא מעוניין)
      const coverageOptions = document.querySelectorAll('#coverageOptionsContainer .coverage-option');
      coverageOptions.forEach(optionDiv => {
        const optionName = optionDiv.dataset.option;
        const interestedBtn = optionDiv.querySelector('.interested-button');
        const notInterestedBtn = optionDiv.querySelector('.not-interested-button');

        if (interestedBtn && notInterestedBtn) {
          const isInterestedSelected = interestedBtn.classList.contains('selected');
          const isNotInterestedSelected = notInterestedBtn.classList.contains('selected');

          if (!isInterestedSelected && !isNotInterestedSelected) {
            isValid = false;
            alert(`אנא בחר מעוניין או לא מעוניין עבור ${getCoverageDisplayName(optionName)}`);
            return;
          }
        }
      });

      // וידוא שדות חובה לכיסויים שנבחרו
      document.querySelectorAll('#coverageOptionsContainer .coverage-option').forEach(optionDiv => {
        const optionName = optionDiv.dataset.option;
        const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);

        if (hiddenInput && hiddenInput.value === 'true') {
          // וידוא שדות חובה לפי סוג הכיסוי
          if (optionName === 'thirdParty') {
            const coverageSelect = optionDiv.querySelector('.thirdPartyCoverage');
            if (!coverageSelect.value) {
              isValid = false;
              coverageSelect.style.borderColor = 'red';
              alert('אנא בחר סכום גבול אחריות');
              return;
            }
          }

          if (optionName === 'afterSchoolProgram') {
            const afterSchoolInput = optionDiv.querySelector('.afterSchoolChildrenCount');
            const val = parseInt(afterSchoolInput?.value || '', 10);
            if (!afterSchoolInput || isNaN(val) || val < 1) {
              isValid = false;
              if (afterSchoolInput) afterSchoolInput.style.borderColor = 'red';
              alert('אנא הזן מספר ילדים בצהרון (מינימום 1)');
              return;
            }
          }

          if (optionName === 'teacherAccidents') {
            const coverageSelect = optionDiv.querySelector('.teacherAccidentsCoverage');
            if (!coverageSelect.value) {
              isValid = false;
              coverageSelect.style.borderColor = 'red';
              alert('אנא בחר מסלול כיסוי');
              return;
            }

            const employeeRows = optionDiv.querySelectorAll('.pa-employee-row');
            if (employeeRows.length === 0) {
              isValid = false;
              alert('אנא הוסף לפחות גננת אחת לכיסוי תאונות אישיות');
              return;
            }

            for (const row of employeeRows) {
              const nameInput = row.querySelector('input[name="personalAccidentEmployeeName[]"]');
              const idInput = row.querySelector('input[name="personalAccidentEmployeeId[]"]');
              const birthdateInput = row.querySelector('input[name="personalAccidentEmployeeBirthdate[]"]');

              if (!nameInput.value.trim() || !idInput.value.trim() || !birthdateInput.value.trim()) {
                isValid = false;
                alert('אנא מלא את כל פרטי הגננת');
                return;
              }
            }
          }

          if (optionName === 'professionalLiability') {
            const employeeRows = optionDiv.querySelectorAll('.professional-liability-row');
            if (employeeRows.length === 0) {
              isValid = false;
              alert('אנא הוסף לפחות גננת אחת לכיסוי אחריות מקצועית');
              return;
            }

            for (const row of employeeRows) {
              const nameInput = row.querySelector('input[name="professionalLiabilityEmployeeName[]"]');
              const idInput = row.querySelector('input[name="professionalLiabilityEmployeeId[]"]');
              const birthdateInput = row.querySelector('input[name="professionalLiabilityEmployeeBirthdate[]"]');

              if (!nameInput.value.trim() || !idInput.value.trim() || !birthdateInput.value.trim()) {
                isValid = false;
                alert('אנא מלא את כל פרטי הגננת');
                return;
              }
            }
          }

          if (optionName === 'employerLiability') {
            const employeesCountInput = optionDiv.querySelector('#employerLiabilityEmployeesCount');
            if (!employeesCountInput.value.trim()) {
              isValid = false;
              employeesCountInput.style.borderColor = 'red';
              alert('אנא מלא את מספר העובדים');
              return;
            }
          }

          if (optionName === 'birthdayActivities') {
            const typeSelect = optionDiv.querySelector('.birthdayActivitiesType');
            if (!typeSelect.value) {
              isValid = false;
              typeSelect.style.borderColor = 'red';
              alert('אנא בחר סוג מפעיל');
              return;
            }
          }

          if (optionName === 'incomeLoss') {
            const durationSelect = optionDiv.querySelector('.incomeLossDuration');
            const amountSelect = optionDiv.querySelector('.incomeLossAmount');
            if (!durationSelect.value || !amountSelect.value) {
              isValid = false;
              alert('אנא בחר משך הכיסוי וסכום הפיצוי החודשי');
              return;
            }
          }
        }
      });
    }

    // וידוא בחירת אמצעי תשלום
    if (sections[currentSectionIndex].id === 'paymentSelection') {
      if (!selectedPaymentMethod) {
        isValid = false;
        alert('אנא בחר אמצעי תשלום');
        return;
      }
    }

    // וידוא חתימה וקבצים לפי אמצעי התשלום
    if (['bankTransferSection', 'creditCardSection', 'debitAuthSection'].includes(sections[currentSectionIndex].id)) {
      // וידוא חתימה
      let canvasId = '';
      if (sections[currentSectionIndex].id === 'bankTransferSection') canvasId = 'signatureCanvasBank';
      if (sections[currentSectionIndex].id === 'creditCardSection') canvasId = 'signatureCanvasCredit';
      if (sections[currentSectionIndex].id === 'debitAuthSection') canvasId = 'signatureCanvasDebit';

      const signatureCanvas = document.getElementById(canvasId);
      if (signatureCanvas && isCanvasBlank(signatureCanvas)) {
        isValid = false;
        alert('אנא חתום על הטופס');
        signatureCanvas.style.border = "2px solid red";
        setTimeout(() => signatureCanvas.style.border = "", 2000);
        signatureCanvas.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // וידוא העלאת קובץ לפי אמצעי התשלום
      if (sections[currentSectionIndex].id === 'bankTransferSection') {
        const bankFile = document.getElementById('bankTransferProof');
        if (!bankFile.files[0]) {
          isValid = false;
          alert('אנא העלה אישור העברה בנקאית');
          return;
        }
      }

      if (sections[currentSectionIndex].id === 'debitAuthSection') {
        const debitFile = document.getElementById('debitAuthUpload');
        if (!debitFile.files[0]) {
          isValid = false;
          alert('אנא העלה טופס חתום ואישור');
          return;
        }
      }
    }

    // בדיקה לשדה שם הנציג רק אם הוא חובה ורק בעמוד תוספות כיסוי
    const repNameField = document.getElementById('representativeName');
    if (
      sections[currentSectionIndex].id === 'coverageAddons' && // רק בעמוד תוספות כיסוי
      repNameField &&
      repNameField.getAttribute('data-required') === 'true'
    ) {
      if (!repNameField.value.trim()) {
        isValid = false;
        repNameField.style.borderColor = 'red';
        alert('אנא מלא את שם הנציג');
        return;
      }
    }




    if (!isValid) {
      //alert('אנא מלא את כל השדות הנדרשים.');
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
    if (option === 'employerLiability' && [4, 5, 6, 7].includes(track)) return;
    if (option === 'incomeLoss' && ![6, 7].includes(track)) return;

    const template = templates.querySelector(`#coverage-${option}`);
    if (template) {
      const clone = template.cloneNode(true);
      clone.dataset.option = option; // מאפשר זיהוי
      container.appendChild(clone);
      addEventListenersToOption(clone);

      // === יצירת תצוגת תוספת פרמיה מתחת לכל כיסוי ===
      const premiumDiv = document.createElement("div");
      premiumDiv.className = "coverage-premium-display";
      premiumDiv.id = `premiumDisplay_${option}`;
      premiumDiv.textContent = "תוספת לפרמיה: ₪0";
      clone.appendChild(premiumDiv);
    }
  });

  calculatePremium();
  setupPersonalAccidentEmployees();
  setupProfessionalLiabilityEmployees();
}



// אוכף ערך מינימלי 1 לשדות מספרים
function enforceMinOne(input) {
  const normalize = () => {
    const v = parseInt(input.value, 10);
    if (isNaN(v) || v < 1) input.value = 1;
  };
  input.addEventListener('input', normalize);
  input.addEventListener('blur', normalize);
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
      const input = optionDiv.querySelector('.afterSchoolChildrenCount');
      if (input) {
        input.required = true;
        input.setAttribute('min', '1');
        enforceMinOne(input);         // ← אכיפת מינימום 1 גם דינמית
      }
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

  newNotInterestedButton.addEventListener('click', () => {
    const hiddenInput = newNotInterestedButton.closest('.coverage-option')
      .querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    hiddenInput.value = 'false';
    newNotInterestedButton.classList.add('selected');
    newInterestedButton.classList.remove('selected');
    if (conditionalSection) {
      // 1) ניקוי ערכים בשדות תנאי
      conditionalSection.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
          if ('checked' in el) el.checked = false;
        } else {
          el.value = '';
        }
        el.required = false;
        // טריגר אירועים כדי לעדכן מחיר/מצב
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });

      // 2) מחיקת שורות דינמיות (גננות) אם יש
      conditionalSection.querySelectorAll('.pa-employee-row, .professional-liability-row').forEach(row => row.remove());

      // 3) דוגמה לשדות ספציפיים:
      const empCount = conditionalSection.querySelector('#employerLiabilityEmployeesCount');
      if (empCount) empCount.value = '';
      conditionalSection.style.display = 'none';
    }

    // מחשוב מחדש
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
  // === שלב 1: קבלת ערכים בסיסיים ===
  const gardenTypeValue = gardenType.value;
  const childrenCountValue = parseInt(childrenCount.value) || 0;
  let basePremium = 0;

  const hasContentBuilding = document.getElementById('hasContentBuilding');
  const includeContentBuilding = hasContentBuilding ? (hasContentBuilding.value === "true" || hasContentBuilding.checked) : false;

  if (!gardenTypeValue || childrenCountValue < 1) {
    premiumAmount.textContent = '0 ₪';
    const discountDisplay = document.getElementById('discountDisplay');
    if (discountDisplay) discountDisplay.textContent = '';
    return;
  }

  // === שלב 2: חישוב פרמיה בסיסית לפי מסלול ===
  const track = determinePolicyTrack();
  let min = 0, perChild = 0;
  switch (track) {
    case 3: min = 900; perChild = 105; break;
    case 4: min = 1100; perChild = 110; break;
    case 5: min = 1100; perChild = 55; break;
    case 6: min = 1400; perChild = 80; break;
    case 7: min = 1400; perChild = 120; break;
  }

  if ([3, 4, 5, 6, 7].includes(track)) {
    basePremium = Math.max(childrenCountValue * perChild, min);
  } else {
    switch (gardenTypeValue) {
      case 'tamah':
        basePremium = childrenCountValue <= 6 ? 500 :
          childrenCountValue <= 10 ? 1000 :
            1000 + (childrenCountValue - 10) * 100;
        break;
      case 'privateFamily':
        if (childrenCountValue <= 6) basePremium = 650;
        else if (childrenCountValue <= 8) basePremium = 900;
        else if (childrenCountValue === 9) basePremium = 1005;
        else if (childrenCountValue <= 10) basePremium = 1100;
        else basePremium = 1100 + (childrenCountValue - 10) * 110;
        break;
      case 'upTo3':
        if (includeContentBuilding) {
          basePremium = childrenCountValue <= 12 ? 1400 : 1400 + (childrenCountValue - 12) * 120;
        } else {
          basePremium = childrenCountValue <= 6 ? 650 :
            childrenCountValue <= 8 ? 900 :
              childrenCountValue === 9 ? 1005 :
                childrenCountValue <= 10 ? 1100 :
                  1100 + (childrenCountValue - 10) * 110;
        }
        break;
      case 'over3':
      case 'afterSchool':
        if (includeContentBuilding) {
          basePremium = childrenCountValue <= 17 ? 1400 : 1400 + (childrenCountValue - 17) * 80;
        } else {
          basePremium = childrenCountValue <= 20 ? 1100 : 1100 + (childrenCountValue - 20) * 55;
        }
        break;
    }
  }

  // === שלב 3: הנחות ===
  const isMember = document.getElementById('isMember')?.value === 'true';
  let clubDiscount = 0;
  let minPremium = min;

  if (isMember) {
    const currentTrack = determinePolicyTrack();
    if ([4, 7].includes(currentTrack)) clubDiscount = childrenCountValue * 10;
    else if ([5, 6].includes(currentTrack)) clubDiscount = childrenCountValue * 5;
  }

  let over3Discount = 0;
  const hasOver3Children = document.getElementById('hasOver3Children')?.value === 'true';
  if (hasOver3Children) {
    const over3ChildrenCount = parseInt(document.getElementById('over3ChildrenCount')?.value) || 0;
    over3Discount = over3ChildrenCount * 40;
  }

  // === שלב 4: חישוב ביטוח מבנה, תכולה וחצר ===
  let buildingPremium = 0;
  let contentPremium = 0;
  let yardPremium = 0;

  // חישוב תוספת מבנה - בדיקה אם נבחר "מעל 70 מ"ר"
  const buildingSizeSelected = document.querySelector('.building-size-button.selected')?.dataset?.value;
  if (buildingSizeSelected === 'over100') {
    const exactSize = parseFloat(document.getElementById('buildingSizeExact')?.value || '0');
    if (exactSize > 70) {
      buildingPremium = 120; // תוספת קבועה למבנים מעל 70 מ"ר
    }
  }

  // חישוב תוספת תכולה - בדיקה אם נבחר "מעל 200,000 ₪"
  const contentValueSelected = document.querySelector('.content-value-button.selected')?.dataset?.value;
  if (contentValueSelected === 'over200k') {
    const contentSum = parseFloat(document.getElementById('contentSumExact')?.value || '0');
    if (contentSum > 200000) {
      contentPremium = Math.round((contentSum - 200000) * 0.0005);
    }
  }

  // חישוב תוספת חצר - בדיקה אם נבחר "מעל 20,000 ₪"
  const yardValueSelected = document.querySelector('.yard-value-button.selected')?.dataset?.value;
  if (yardValueSelected === 'over20k') {
    const yardSum = parseFloat(document.getElementById('yardContentSumExact')?.value || '0');
    if (yardSum > 20000) {
      yardPremium = Math.round((yardSum - 20000) * 0.001);
    }
  }

  // === שלב 5: עדכון תצוגת תוספת לכל רכיב ===
  const buildingDisplay = document.getElementById('buildingPremiumDisplay');
  if (buildingDisplay)
    buildingDisplay.textContent = `תוספת לפרמיה: ₪${buildingPremium.toLocaleString()}`;

  const contentDisplay = document.getElementById('contentPremiumDisplay');
  if (contentDisplay)
    contentDisplay.textContent = `תוספת לפרמיה: ₪${contentPremium.toLocaleString()}`;

  const yardDisplay = document.getElementById('yardPremiumDisplay');
  if (yardDisplay)
    yardDisplay.textContent = `תוספת לפרמיה: ₪${yardPremium.toLocaleString()}`;

  // === שלב 6: סכום כולל ===
  const addonsTotal = buildingPremium + contentPremium + yardPremium;
  let totalDiscounts = clubDiscount + over3Discount;
  let totalPremium = Math.max(basePremium - totalDiscounts, minPremium) + addonsTotal;
  if (totalPremium < minPremium) totalPremium = minPremium;

  premiumAmount.textContent = totalPremium.toLocaleString() + ' ₪';

  // === שלב 7: הצגת הנחות ===
  const discountDisplay = document.getElementById('discountDisplay');
  if (discountDisplay) {
    discountDisplay.textContent = clubDiscount > 0
      ? `הנחת מועדון: ${clubDiscount} ₪`
      : '';
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

    // חדש:
    case 'teacherAccidents': {
      // חשב רק אם הכיסוי מסומן כ"מעוניין"
      const optionDiv = document.querySelector('#coverageOptionsContainer .coverage-option[data-option="teacherAccidents"]');
      if (!optionDiv) return 0;
      const hiddenInput = optionDiv.querySelector('input[name="insuranceOptions[teacherAccidents]"]');
      if (!hiddenInput || hiddenInput.value !== 'true') return 0;

      const plan = optionDiv.querySelector('.teacherAccidentsCoverage')?.value || 'A';
      const basePrice = plan === 'A' ? 200 : plan === 'B' ? 600 : 800;

      // סופרים רק שורות עם נתונים (לפחות שדה אחד מולא)
      const rows = Array.from(optionDiv.querySelectorAll('.pa-employee-row'));
      const paCount = rows.filter(row => {
        const name = row.querySelector('input[name="personalAccidentEmployeeName[]"]')?.value?.trim();
        const id = row.querySelector('input[name="personalAccidentEmployeeId[]"]')?.value?.trim();
        const bd = row.querySelector('input[name="personalAccidentEmployeeBirthdate[]"]')?.value?.trim();
        return !!(name || id || bd);
      }).length;

      return basePrice * paCount;
    }


    // חדש:
    case 'professionalLiability': {
      const optionDiv = document.querySelector('#coverageOptionsContainer .coverage-option[data-option="professionalLiability"]');
      if (!optionDiv) return 0;
      const hiddenInput = optionDiv.querySelector('input[name="insuranceOptions[professionalLiability]"]');
      if (!hiddenInput || hiddenInput.value !== 'true') return 0;

      // סופרים רק שורות עם נתונים
      const rows = Array.from(optionDiv.querySelectorAll('.professional-liability-row'));
      const count = rows.filter(row => {
        const name = row.querySelector('input[name="professionalLiabilityEmployeeName[]"]')?.value?.trim();
        const id = row.querySelector('input[name="professionalLiabilityEmployeeId[]"]')?.value?.trim();
        const bd = row.querySelector('input[name="professionalLiabilityEmployeeBirthdate[]"]')?.value?.trim();
        return !!(name || id || bd);
      }).length;

      return count * 500;
    }


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
      if (type === 'internal') return 2000;
      if (type === 'external') return 500;
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
  // מאפשר שליחה רק בסקשנים ייעודיים
  const activeId = sections[currentSectionIndex]?.id;
  const allowSubmitSections = ['bankTransferSection', 'debitAuthSection', 'creditCardSection'];
  if (!allowSubmitSections.includes(activeId)) {
    e.preventDefault();
    return; // לא שולחים Webhook ולא מציגים "תודה" מחוץ למסכי התשלום הרלוונטיים
  }
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

function isValidEmail(email) {
  // מסיר רווחים מיותרים
  const cleaned = email.trim();
  // בדיקה לפי פורמט בסיסי של כתובת מייל
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned);
}

// מסנן תתי-שדות לפי הדגלים כדי למנוע "דליפת" נתונים שלא רלוונטיים
function sanitizeConditionalFields(payload) {
  const isTrue = (v) => String(v).toLowerCase() === 'true';

  // --- מעל 3 ילדים ---
  if (!isTrue(payload.hasOver3Children)) {
    delete payload.over3ChildrenCount;
  }

  // --- חברות/מועדון ---
  if (!isTrue(payload.isMember)) {
    delete payload.membershipType;
  }

  // --- מבנה/תכולה/חצר ---
  if (!isTrue(payload.hasContentBuilding)) {
    delete payload.buildingType;
    delete payload.buildingSizeExact;
    delete payload.contentSumExact;
    delete payload.yardContentSumExact;

    // לפעמים אצלך נשמרים גם תחת contentBuildingDetails[...] – ננקה גם שם:
    delete payload['contentBuildingDetails[contentSum]'];
    delete payload['contentBuildingDetails[buildingSum]'];
    delete payload['contentBuildingDetails[yardContentSum]'];
    delete payload['contentBuildingDetails[buildingType]'];
    delete payload['contentBuildingDetails[hasLien]'];
    delete payload['contentBuildingDetails[lienHolder]'];
  }

  // --- שעבוד / משכנתא ---
  if (!isTrue(payload.hasLien)) {
    delete payload.lienType;
    delete payload.lienBankName;
    delete payload.lienBankBranch;
    delete payload.lienBankAddress;
    delete payload.lienCompanyName;
    delete payload.lienCompanyId;
    delete payload.propertyOwnerName;
    delete payload.propertyOwnerId;
  } else {
    // אם יש שעבוד—נשמור עקביות בין סוגים
    if (payload.lienType === 'bank') {
      delete payload.lienCompanyName;
      delete payload.lienCompanyId;
    } else if (payload.lienType === 'company') {
      delete payload.lienBankName;
      delete payload.lienBankBranch;
      delete payload.lienBankAddress;
    } else {
      // אם סוג לא נבחר – ננקה הכל
      delete payload.lienBankName;
      delete payload.lienBankBranch;
      delete payload.lienBankAddress;
      delete payload.lienCompanyName;
      delete payload.lienCompanyId;
    }
  }

  // --- ויתור על שיבוב ---
  if (!isTrue(payload.waiverCheckbox)) {
    delete payload.propertyOwnerName;
    delete payload.propertyOwnerId;
  }

  // --- כיסויים (insuranceOptions[...]) ותתי-שדות תלויים ---
  const cov = (name) => isTrue(payload[`insuranceOptions[${name}]`]);

  // afterSchoolProgram → afterSchoolChildrenCount
  if (!cov('afterSchoolProgram')) {
    delete payload.afterSchoolChildrenCount;
  }

  // incomeLoss → duration/amount
  if (!cov('incomeLoss')) {
    delete payload.incomeLossDuration;
    delete payload.incomeLossAmount;
  }

  // thirdParty → רמת כיסוי
  if (!cov('thirdParty')) {
    delete payload.thirdPartyCoverage;
  }

  // teacherAccidents → רמת כיסוי + רשימות עובדים
  if (!cov('teacherAccidents')) {
    delete payload.teacherAccidentsCoverage;
    delete payload.personalAccidentEmployees; // אם נשמר כמחרוזת/JSON
  }

  // professionalLiability → רשימות עובדים
  if (!cov('professionalLiability')) {
    delete payload.professionalLiabilityEmployees;
  }

  // employerLiability → ספירת עובדים
  if (!cov('employerLiability')) {
    delete payload.employerLiabilityEmployeesCount;
  }

  // birthdayActivities → סוג פעילות
  if (!cov('birthdayActivities')) {
    delete payload.birthdayActivitiesType;
  }
}

function formatCurrency(value) {
  const num = parseFloat(value) || 0;
  return num.toFixed(2);
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
      } else if (optionName === 'birthdayActivities') {
        // ספציפי להפעלות ימי הולדת – נשלח את סוג המפעיל
        const birthdayTypeSelect = optionDiv.querySelector('.birthdayActivitiesType');
        if (birthdayTypeSelect) value = birthdayTypeSelect.value;
      } else {
        // לאחרים – נשלח את select כללי אם יש
        const genericSelect = optionDiv.querySelector('.conditional-section select');
        if (genericSelect) value = genericSelect.value;
      }

      if (value !== '') {
        payload[`insuranceOptionsDetails[${optionName}]`] = value;
      } else if (optionName === 'birthdayActivities') {
        // תמיד שלח את השדה birthdayActivitiesType, גם אם הוא ריק
        payload['birthdayActivitiesType'] = value;
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
      let groupName = group.getAttribute('data-key');
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

  // מבנה: חישוב סכום ביטוח מבנה
  const buildingSizeSelected = document.querySelector('.building-size-button.selected')?.dataset?.value;
  let insuredBuildingAmount = 0;

  if (buildingSizeSelected === 'under100') {
    insuredBuildingAmount = 500000;
  } else if (buildingSizeSelected === 'over100') {
    const exactSizeInput = document.getElementById('buildingSizeExact');
    const exactSize = parseFloat(exactSizeInput?.value || '0');
    insuredBuildingAmount = exactSize > 0 ? Math.round(exactSize * 7200) : 0;
  }

  // הוספת השדה לוובהוק
  payload.insuredBuildingAmount = formatCurrency(insuredBuildingAmount);


  // ---------- פרמיה, תשלום, חתימה, קבצים ----------
  let premiumText = document.getElementById('premiumAmount').textContent.replace(/[^\d.]/g, '');
  payload['premium'] = formatCurrency(premiumText);

  // ---------- automation מתוך URL ----------
  payload['automation'] = window.formAutomationFlag || 'true';

  // ---------- representative מתוך URL ----------
  payload['representative'] = window.formRepresentativeFlag || 'false';

  // ---------- renewal מתוך URL ----------
  payload['renewal'] = window.formRenewalFlag || 'true';

  // ---------- agent מתוך URL ----------
  payload['agent'] = window.formAgentFlag || '';

  // ---------- recIdFlag מתוך URL ----------
  payload['airtableRecId'] = window.formRecIdFlag || '';

  // ---------- policyNumber מתוך URL ----------
  payload['policyNumber'] = window.policyNumber || '';

  // ---------- מספר מסלול ----------
  payload['policyTrack'] = determinePolicyTrack();

  // ---------- מחיר תכולה ----------
  const contentCost = formatCurrency(getContentAdditionCost());
  payload['contentAdditionCost'] = contentCost;
  console.log('contentAdditionCost:', contentCost);

  // ---------- מחיר מבנה ----------
  const buildingCost = formatCurrency(getBuildingAdditionCost());
  payload['buildingAdditionCost'] = buildingCost;
  console.log('buildingAdditionCost:', buildingCost);

  // ---------- מחיר חצר ----------
  const yardCost = formatCurrency(getYardAdditionCost());
  payload['yardAdditionCost'] = yardCost;
  console.log('yardAdditionCost:', yardCost);

  // ---------- האם צריך עריכת ביטוח ----------
  const approvalCheckbox = document.querySelector('.form-section.active .needsApprovalCheckbox');
  payload['needsApproval'] = approvalCheckbox && approvalCheckbox.checked ? 'true' : 'false';

  // ---------- מספר ילדים בצהרון (רק אם שדה קיים) ----------
  const afterSchoolInput = document.querySelector('.afterSchoolChildrenCount');
  if (afterSchoolInput && afterSchoolInput.value) {
    payload['afterSchoolChildrenCount'] = afterSchoolInput.value;
  }

  // ---------- סוג מפעיל הפעלות ימי הולדת (תמיד נשלח) ----------
  const birthdayActivitiesTypeSelect = document.querySelector('.birthdayActivitiesType');
  if (birthdayActivitiesTypeSelect) {
    payload['birthdayActivitiesType'] = birthdayActivitiesTypeSelect.value || '';
  } else {
    payload['birthdayActivitiesType'] = '';
  }



  // ---------- סוג תשלום ----------
  payload['selectedPaymentMethod'] = selectedPaymentMethod;

  const cov = (name) => (document.querySelector(`input[name="insuranceOptions[${name}]"]`)?.value === 'true');

  // כיסויים ותתי־שדות תלוים:
  if (!cov('thirdParty')) {
    delete payload.thirdPartyCoverage;
  }
  if (!cov('afterSchoolProgram')) {
    delete payload.afterSchoolChildrenCount;
  }
  if (!cov('teacherAccidents')) {
    delete payload.teacherAccidentsCoverage;
    payload.personalAccidentEmployees = ''; // לרוקן לגמרי
  }
  if (!cov('professionalLiability')) {
    payload.professionalLiabilityEmployees = '';
  }
  if (!cov('employerLiability')) {
    delete payload.employerLiabilityEmployeesCount;
  }
  if (!cov('birthdayActivities')) {
    delete payload.birthdayActivitiesType;
  }
  if (!cov('incomeLoss')) {
    delete payload.incomeLossDuration;
    delete payload.incomeLossAmount;
  }

  sanitizeConditionalFields(payload);
  console.log('🚀 Sending payload to webhook:', payload);
  return payload;
}


// מחשב את סכום הכיסוי הגולמי למבנה לפי הלוגיקה שנשלחת לוובהוק
function computeInsuredBuildingAmountRaw() {
  const selected = document.querySelector('.building-size-button.selected')?.dataset?.value;

  let amount = 0;
  if (selected === 'under100') {
    amount = 500000;
  } else if (selected === 'over100') {
    const exact = parseFloat(document.getElementById('buildingSizeExact')?.value || '0');
    amount = exact > 0 ? Math.round(exact * 7200) : 0;
  }

  // תמיד לפחות 500,000
  return Math.max(amount, 500000);
}


// מעדכן את הטקסט מתחת ל"גודל המבנה"
function updateInsuredBuildingAmountDisplay() {
  const span = document.getElementById('insuredBuildingAmountText');
  if (!span) return;
  const amount = computeInsuredBuildingAmountRaw();
  // תצוגה ידידותית עם אלפי מפרידים וש"ח בסוף
  span.textContent = `${(amount || 0).toLocaleString('he-IL')} ₪`;
}


function getBuildingAdditionCost() {
  const includeContentBuilding = document.getElementById('hasContentBuilding')?.value === "true";
  console.log('getBuildingAdditionCost - includeContentBuilding:', includeContentBuilding);
  if (!includeContentBuilding) return 0;
  const buildingSizeValue = document.getElementById('buildingSizeExact')?.value || '';
  const buildingSize = parseFloat(buildingSizeValue.replace(/[^0-9.]/g, '')) || 0;
  console.log('getBuildingAdditionCost - buildingSize:', buildingSize);
  if (buildingSize > 70) {
    const cost = (((buildingSize * 7200) - 500000) / 40000) * 82;
    console.log('getBuildingAdditionCost - calculated cost:', cost);
    return cost;
  }
  return 0;
}


function getContentAdditionCost() {
  const includeContentBuilding = document.getElementById('hasContentBuilding')?.value === "true";
  console.log('getContentAdditionCost - includeContentBuilding:', includeContentBuilding);
  if (!includeContentBuilding) return 0;
  const contentSum = parseFloat(document.getElementById('contentSumExact')?.value.replace(/[^0-9.]/g, '')) || 0;
  console.log('getContentAdditionCost - contentSum:', contentSum);
  if (contentSum > 200000) {
    const cost = ((contentSum - 200000) / 40000) * 82;
    console.log('getContentAdditionCost - calculated cost:', cost);
    return cost;
  }
  return 0;
}

function getYardAdditionCost() {
  const includeContentBuilding = document.getElementById('hasContentBuilding')?.value === "true";
  console.log('getYardAdditionCost - includeContentBuilding:', includeContentBuilding);
  if (!includeContentBuilding) return 0;
  const yardSum = parseFloat(document.getElementById('yardContentSumExact')?.value.replace(/[^0-9.]/g, '')) || 0;
  console.log('getYardAdditionCost - yardSum:', yardSum);
  if (yardSum > 20000) {
    const cost = ((yardSum - 20000) / 40000) * 82;
    console.log('getYardAdditionCost - calculated cost:', cost);
    return cost;
  }
  return 0;
}

function updateCoverageOptionPrices() {
  ensureOptionCostSpans();
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

function updateAddonsTotal() {
  let total = 0;
  const gardenTypeValue = gardenType.value;
  const childrenCountValue = parseInt(childrenCount.value) || 0;
  const hasContentBuilding = document.getElementById('hasContentBuilding');
  const includeContentBuilding = hasContentBuilding ? (hasContentBuilding.value === "true" || hasContentBuilding.checked) : false;
  document.querySelectorAll('#coverageOptionsContainer .coverage-option').forEach(optionDiv => {
    const optionName = optionDiv.dataset.option;
    const hiddenInput = optionDiv.querySelector(`input[name="insuranceOptions[${optionName}]"]`);
    if (!optionName) return;
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
  // Add null check for container
  if (!container) {
    console.warn('Container is null for addPersonalAccidentEmployeeRow');
    return;
  }

  const row = document.createElement('div');
  row.className = 'form-group pa-employee-row';
  row.style.display = 'flex';
  row.style.gap = '8px';
  row.style.alignItems = 'center';
  row.innerHTML = `
    <input type="text" name="personalAccidentEmployeeName[]" placeholder="שם הגננת" value="${data.name || ''}" style="flex:2" >
    <input type="number" name="personalAccidentEmployeeId[]" placeholder="ת.ז גננת" value="${data.id || ''}" style="flex:1" >
    <div style="flex:1">
      <label style="display:block; font-size: 0.85em;">תאריך לידה:</label>
      <input type="date" name="personalAccidentEmployeeBirthdate[]" value="${data.birthdate || ''}" >
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
  // Add null check for container
  if (!container) {
    console.warn('Container is null for addProfessionalLiabilityEmployeeRow');
    return;
  }

  const row = document.createElement('div');
  row.className = 'form-group professional-liability-row';
  row.style.display = 'flex';
  row.style.gap = '8px';
  row.style.alignItems = 'center';
  row.innerHTML = `
    <input type="text" name="professionalLiabilityEmployeeName[]" placeholder="שם הגננת" value="${data.name || ''}" style="flex:2" >
    <input type="number" name="professionalLiabilityEmployeeId[]" placeholder="ת.ז גננת" value="${data.id || ''}" style="flex:1" >
    <div style="flex:1">
      <label style="display:block; font-size: 0.85em;">תאריך לידה:</label>
      <input type="date" name="professionalLiabilityEmployeeBirthdate[]" value="${data.birthdate || ''}" >
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
  try {
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
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch('https://hook.eu2.make.com/767snb13mqqn3q276wb6hhggne7oyjxy', {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Webhook success response:', responseText);

  } catch (error) {
    console.error('Webhook error details:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
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
      updateInsuredBuildingAmountDisplay();

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

  // --- תאונות אישיות לגננת ---
  if (urlPrefillData['personalAccidentEmployees']) {
    const teacherDiv = document.querySelector('#coverageOptionsContainer .coverage-option[data-option="teacherAccidents"]');
    const paContainer = teacherDiv?.querySelector('#personalAccidentEmployeesRows');
    if (paContainer) {
      paContainer.innerHTML = '';
      const paList = urlPrefillData['personalAccidentEmployees'].split(';').filter(Boolean);
      paList.forEach(entry => {
        const [name, id, birthdate] = entry.split('|');
        addPersonalAccidentEmployeeRow(paContainer, { name, id, birthdate });
      });
    }
  }

  // --- אחריות מקצועית ---
  if (urlPrefillData['professionalLiabilityEmployees']) {
    const plDiv = document.querySelector('#coverageOptionsContainer .coverage-option[data-option="professionalLiability"]');
    const profContainer = plDiv?.querySelector('#professionalLiabilityEmployeesRows');
    if (profContainer) {
      profContainer.innerHTML = '';
      const profList = urlPrefillData['professionalLiabilityEmployees'].split(';').filter(Boolean);
      profList.forEach(entry => {
        const [name, id, birthdate] = entry.split('|');
        addProfessionalLiabilityEmployeeRow(profContainer, { name, id, birthdate });
      });
    }
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

  // Prefill מספר עובדים לכיסוי חבות מעבידים, אם קיים employeesCount ב-URL
  if (urlPrefillData['employeesCount']) {
    const employerCountInput = document.querySelector('#employerLiabilityEmployeesCount');
    if (employerCountInput) {
      employerCountInput.value = urlPrefillData.employeesCount;
      employerCountInput.dispatchEvent(new Event('input'));
    }
  }

  // Prefill מספר ילדים בצהרון אם יש פרמטר כזה ב-URL
  if (urlPrefillData['afterSchoolChildrenCount']) {
    const afterSchoolInput = document.querySelector('.afterSchoolChildrenCount');
    if (afterSchoolInput) {
      afterSchoolInput.value = urlPrefillData.afterSchoolChildrenCount;
      afterSchoolInput.dispatchEvent(new Event('input'));
    }
  }

  // סוג מפעיל לימי הולדת
  if (urlPrefillData['birthdayActivitiesType']) {
    const birthdayTypeInput = document.querySelector('.birthdayActivitiesType');
    if (birthdayTypeInput) {
      birthdayTypeInput.value = urlPrefillData.birthdayActivitiesType;
      birthdayTypeInput.dispatchEvent(new Event('change'));
    }
  }

}


function prefillFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);

  // --- דגלים כלליים (automation, renewal, agent, policyNumber, representative) ---
  window.formAutomationFlag = urlParams.get('automation') || 'true';
  window.formRepresentativeFlag = urlParams.get('representative') || 'false';
  window.formRenewalFlag = (urlParams.get('renewal') === null || urlParams.get('renewal') === 'true') ? 'true' : 'false';
  window.formAgentFlag = urlParams.get('agent');
  window.formRecIdFlag = urlParams.get('airtableRecId');
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

  updateInsuredBuildingAmountDisplay();


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
      submitBtn.addEventListener('click', async function (e) {
        // פועלים רק אם הסקשן הנוכחי הוא של אשראי
        if (sections[currentSectionIndex]?.id !== 'creditCardSection') return;
        e.preventDefault();

        // 1) בדיקת חתימה
        const signatureCanvas = document.getElementById('signatureCanvasCredit');
        if (!signatureCanvas || isCanvasBlank(signatureCanvas)) {
          alert('יש לחתום על הטופס לפני השליחה.');
          if (signatureCanvas) {
            signatureCanvas.style.border = '2px solid red';
            setTimeout(() => (signatureCanvas.style.border = ''), 2000);
            signatureCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        // 2) ReturnValue: policyNumber מה-URL, ואם אין — idNumber מהטופס
        const urlParams = new URLSearchParams(window.location.search);
        const policyNumberFromUrl = urlParams.get('policyNumber');
        const idNumberFromForm = document.getElementById('idNumber')?.value || '';
        const returnValue = policyNumberFromUrl || idNumberFromForm || '';

        // 3) גוף הבקשה כ-application/x-www-form-urlencoded (URL-Encode מלא)
        const bodyParams = new URLSearchParams({
          Operation: '3',
          TerminalNumber: '173413',
          UserName: 'asherlevi',
          SumToBill: '1',
          CoinId: '1',
          Language: 'he',
          ProductName: 'ביטוח גנים',
          APILevel: '10',
          Codepage: '65001',
          SuccessRedirectUrl: 'https://secure.cardcom.solutions/SuccessAndFailDealPage/Success.aspx',
          ErrorRedirectUrl: 'https://secure.cardcom.solutions/SuccessAndFailDealPage/Fail.aspx',
          IndicatorUrl: 'https://hook.eu2.make.com/35cyd2c1gwlw6bfc7dpqxyz9udfunwlr',
          ReturnValue: returnValue
        });

        // מניעת לחיצות כפולות
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;

        try {
          // 4) POST ל-Cardcom
          const response = await fetch('https://secure.cardcom.solutions/Interface/LowProfile.aspx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: bodyParams.toString()
          });

          if (!response.ok) {
            const errText = await response.text().catch(() => '');
            console.error('Cardcom HTTP error:', response.status, errText);
            alert('לא ניתן היה להתחבר למערכת הסליקה. נא לנסות שוב.');
            return;
          }

          // 5) תשובה כ-query string: ResponseCode=...&url=...
          const rawText = await response.text();
          // יש שרשורים שמכילים HTML מינימלי — שולפים רק את הקו הראשון אם צריך
          const line = rawText.split(/\r?\n/)[0] || rawText;

          const qs = new URLSearchParams(line);
          // חיפוש case-insensitive של 'url'
          let urlParam = '';
          for (const [k, v] of qs.entries()) {
            if (k.toLowerCase() === 'url') {
              urlParam = v;
              break;
            }
          }

          if (urlParam) {
            const payUrl = decodeURIComponent(urlParam);
            try {
              const payload = collectFormData();
              payload['selectedPaymentMethod'] = 'credit'; // לעקביות עם השדה הקיים
              payload['payUrl'] = payUrl;

              await sendToWebhook(payload);
            } catch (err) {
              console.error('Webhook send failed (credit flow):', err);
              // ממשיכים בכל מקרה לפתיחת דף התשלום
            }
            window.open(payUrl, '_blank');
            // גיבוי למקרה חריג שבו הניווט נחסם
            setTimeout(() => {
              const thankYouSectionIndex = sections.findIndex(sec => sec.id === 'thankYouSection');
              if (thankYouSectionIndex !== -1) showSection(thankYouSectionIndex);
            }, 150);
          } else {
            console.error('Missing url parameter in Cardcom response:', line);
            alert('לא התקבלה כתובת תשלום מהסולק. נא לנסות שוב.');
          }
        } catch (networkErr) {
          console.error('Network error to Cardcom:', networkErr);
          alert('שגיאת רשת בעת ניסיון התחברות למערכת הסליקה. נא לנסות שוב.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
      });
    }
  }

  // --- Offer (quote) button ---
  // תופס את הכפתור בכל הסקשנים (לא תלוי ב-#paymentSelection)
  document.querySelectorAll('.offer-button').forEach((offerBtn) => {
    offerBtn.addEventListener('click', async () => {
      try {
        selectedPaymentMethod = 'offer';
        const payload = collectFormData();
        payload.paymentMethod = 'offer';
        payload.selectedPaymentMethod = 'offer';
        await sendToWebhook(payload);
        const thankYouSectionIndex = sections.findIndex(sec => sec.id === 'thankYouSection');
        if (thankYouSectionIndex !== -1) showSection(thankYouSectionIndex);
      } catch (err) {
        console.error('Failed sending offer webhook:', err);
        alert('אירעה שגיאה בשליחת הבקשה להצעת מחיר. נסו שוב.');
      }
    });
  });






  const policyStartDate = document.getElementById('policyStartDate');
  const policyEndDate = document.getElementById('policyEndDate');

  if (policyStartDate && policyEndDate) {
    // קריאת פרמטרים מה-URL
    const urlParams = new URLSearchParams(window.location.search);
    const renewalRaw = urlParams.get('renewal');

    // שמירה על התאימות: ברירת מחדל renewal=true אם לא נשלח
    const isRenewal = (renewalRaw === 'true');

    // Prefill אם הגיעו תאריכים מה-URL
    const startValue = urlParams.get('policyStartDate');
    const endValue = urlParams.get('policyEndDate');
    if (startValue) policyStartDate.value = startValue;
    if (endValue) policyEndDate.value = endValue;

    // פונקציה שמייצרת תאריך סיום: שנה קדימה פחות יום
    const calcEndDate = (startStr) => {
      if (!startStr) return '';
      const start = new Date(startStr);
      if (isNaN(start)) return '';
      const end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
      end.setDate(end.getDate() - 1);
      const y = end.getFullYear();
      const m = String(end.getMonth() + 1).padStart(2, '0');
      const d = String(end.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    if (isRenewal) {
      // מצב חידוש: שניהם נעולים (כמו שהיה)
      policyStartDate.disabled = true;
      policyEndDate.disabled = true;
    } else {
      // לא חידוש: פותחים תאריך התחלה, תאריך סיום מחושב ונעול
      policyStartDate.disabled = false;
      policyEndDate.disabled = true;

      // אם כבר קיים start (מ-URL/דיפולט) – חשב מיד את הסיום
      if (policyStartDate.value && !policyEndDate.value) {
        policyEndDate.value = calcEndDate(policyStartDate.value);
      }

      // חישוב אוטומטי בעת שינוי
      policyStartDate.addEventListener('change', () => {
        policyEndDate.value = calcEndDate(policyStartDate.value);
      });
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

  const idNumberInput = document.getElementById('idNumber');
  if (idNumberInput) {
    idNumberInput.addEventListener('input', function (e) {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  }


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

      field.addEventListener('input', function () {
        // הפעל חישוב פרמיה כשהערך משתנה
        calculatePremium();
        updateInsuredBuildingAmountDisplay();
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

function getFieldDisplayName(fieldName) {
  const fieldNames = {
    'hasOver3Children': 'האם יש ילדים מעל גיל 3',
    'isMember': 'האם חבר באחד מארגוני הגנים',
    'claimsLastYear': 'האם היו תביעות בשנה האחרונה',
    'supplementalInsurance': 'האם ברצונך לרכוש ביטוח משלים לדירה',
    'hasContentBuilding': 'האם תרצה לבטח את המבנה ותכולת הגן'
  };
  return fieldNames[fieldName] || fieldName;
}

function getCoverageDisplayName(coverageName) {
  const coverageNames = {
    'thirdParty': 'הגדלת גבולות אחריות',
    'deductibleCancellation': 'ביטול השתתפות עצמית',
    'teacherAccidents': 'תאונות אישיות לגננת',
    'professionalLiability': 'אחריות מקצועית',
    'employerLiability': 'חבות מעבידים',
    'cyberInsurance': 'תוספת ביטוח סייבר',
    'incomeLoss': 'אובדן הכנסות',
    'birthdayActivities': 'הפעלות ימי הולדת / חוגים בגן',
    'afterSchoolProgram': 'תוספת צהרון לפוליסת הגן'
  };
  return coverageNames[coverageName] || coverageName;
}

// ===== URL Sync =====
(function () {
  // דיבאונס כדי להריץ אחרי שכל הלוגיקה של הכפתור/הטופס סיימה לעדכן ערכים
  let urlSyncTimer = null;
  function scheduleUpdateUrlFromForm() {
    clearTimeout(urlSyncTimer);
    urlSyncTimer = setTimeout(updateUrlFromForm, 100); // מעט דיליי כדי שה-UI יספיק לעדכן hidden inputs
  }

  // אוסף ערכים משמעותיים ומעדכן את ה-URL
  // אוסף ערכים משמעותיים ומעדכן את ה-URL
  function updateUrlFromForm() {
    const params = new URLSearchParams(window.location.search);

    // ===== עזרונים =====
    const get = (sel) => document.querySelector(sel);
    const getById = (id) => document.getElementById(id);
    const isOn = (name) => get(`input[name="insuranceOptions[${name}]"]`)?.value === 'true';
    const setOrDelete = (key, val) => {
      if (val !== undefined && val !== null && `${val}`.trim() !== '') params.set(key, `${val}`.trim());
      else params.delete(key);
    };

    // ===== פרטי לקוח / בעל פוליסה =====
    const mapById = [
      'customerName',
      'emailAddress',
      'phoneNumber',
      'gardenName',
      'address',
      'idNumber',
      'policyHolderName',
      'policyHolderDate', // date
    ];
    mapById.forEach(id => setOrDelete(id, getById(id)?.value || ''));

    // ===== פרטי פוליסה =====
    ['policyStartDate', 'policyEndDate'].forEach(id => setOrDelete(id, getById(id)?.value || ''));

    // ===== מאפייני גן / ילדים / חברות =====
    setOrDelete('gardenType', getById('gardenType')?.value || '');
    setOrDelete('childrenCount', getById('childrenCount')?.value || '');

    // מעל 3 ילדים (דגל + ספירה רק אם הדגל פעיל)
    const hasOver3Children = getById('hasOver3Children')?.value === 'true';
    setOrDelete('hasOver3Children', hasOver3Children ? 'true' : 'false');
    if (hasOver3Children) {
      setOrDelete('over3ChildrenCount', getById('over3ChildrenCount')?.value);
    } else {
      params.delete('over3ChildrenCount');
    }

    // חברות / מועדון (דגל + סוג רק אם הדגל פעיל)
    const isMember = getById('isMember')?.value === 'true';
    setOrDelete('isMember', isMember ? 'true' : 'false');
    if (isMember) {
      setOrDelete('membershipType', getById('membershipType')?.value);
    } else {
      params.delete('membershipType');
    }

    // ===== מבנה / תכולה / חצר =====
    // נכניס תתי-שדות רק אם באמת מבטחים מבנה+תכולה
    const hasContentBuilding = getById('hasContentBuilding')?.value === 'true';
    setOrDelete('hasContentBuilding', hasContentBuilding ? 'true' : 'false');

    if (hasContentBuilding) {
      setOrDelete('buildingType', getById('buildingType')?.value);
      setOrDelete('buildingSizeExact', getById('buildingSizeExact')?.value);
      setOrDelete('contentSumExact', getById('contentSumExact')?.value);
      setOrDelete('yardContentSumExact', getById('yardContentSumExact')?.value);
      // בחירות בטווחים (select עם class)
      setOrDelete('buildingSum', get('.buildingSum')?.value);
      setOrDelete('contentSum', get('.contentSum')?.value);
      setOrDelete('yardContentSum', get('.yardContentSum')?.value);
    } else {
      ['buildingType', 'buildingSizeExact', 'contentSumExact', 'yardContentSumExact',
        'buildingSum', 'contentSum', 'yardContentSum'
      ].forEach(k => params.delete(k));
    }

    // ===== תביעות / מסמכים כלליים =====
    setOrDelete('claimsLastYear', getById('claimsLastYear')?.value || '');

    // ויתור על שיבוב / ביטוח משלים (דגלים)
    const waiverOn = getById('waiverCheckbox')?.value === 'true';
    setOrDelete('waiverCheckbox', waiverOn ? 'true' : 'false');

    const supplementalOn = getById('supplementalInsurance')?.value === 'true';
    setOrDelete('supplementalInsurance', supplementalOn ? 'true' : 'false');

    // ===== שעבוד / משכנתא =====
    const hasLien = getById('hasLien')?.value === 'true';
    setOrDelete('hasLien', hasLien ? 'true' : 'false');

    if (hasLien) {
      const lienType = getById('lienType')?.value || '';
      setOrDelete('lienType', lienType);

      // פרטי בנק משעבד (רק אם lienType = bank)
      if (lienType === 'bank') {
        setOrDelete('lienBankName', getById('lienBankName')?.value);
        setOrDelete('lienBankBranch', getById('lienBankBranch')?.value);
        setOrDelete('lienBankAddress', getById('lienBankAddress')?.value);
        // מחיקה של פרטי חברה אם הוחלף לסוג בנק
        ['lienCompanyName', 'lienCompanyId'].forEach(k => params.delete(k));
      }
      // פרטי חברה משעבדת (רק אם lienType = company)
      else if (lienType === 'company') {
        setOrDelete('lienCompanyName', getById('lienCompanyName')?.value);
        setOrDelete('lienCompanyId', getById('lienCompanyId')?.value);
        // מחיקה של פרטי בנק אם הוחלף לסוג חברה
        ['lienBankName', 'lienBankBranch', 'lienBankAddress'].forEach(k => params.delete(k));
      } else {
        // אם סוג לא נבחר—ננקה את כולם
        ['lienBankName', 'lienBankBranch', 'lienBankAddress', 'lienCompanyName', 'lienCompanyId'].forEach(k => params.delete(k));
      }

      // פרטי בעל הנכס רלוונטיים כשיש ויתור/שעבוד—נשמור אותם אם מולאו
      setOrDelete('propertyOwnerName', getById('propertyOwnerName')?.value);
      setOrDelete('propertyOwnerId', getById('propertyOwnerId')?.value);
    } else {
      ['lienType', 'lienBankName', 'lienBankBranch', 'lienBankAddress',
        'lienCompanyName', 'lienCompanyId', 'propertyOwnerName', 'propertyOwnerId'
      ].forEach(k => params.delete(k));
    }

    // אם אין ויתור על שיבוב—ננקה בעל נכס (למניעת דליפה)
    if (!waiverOn) {
      ['propertyOwnerName', 'propertyOwnerId'].forEach(k => params.delete(k));
    }

    // ===== חבות מעבידים / עובדים =====
    // הכנסה רק אם כיסוי חבות מעבידים פעיל
    if (isOn('employerLiability')) {
      setOrDelete('employerLiabilityEmployeesCount', getById('employerLiabilityEmployeesCount')?.value);
    } else {
      params.delete('employerLiabilityEmployeesCount');
    }

    // ===== כיסויי ביטוח (דגלים) =====
    const coverageFlags = [
      'thirdParty',
      'deductibleCancellation',
      'teacherAccidents',
      'professionalLiability',
      'employerLiability',
      'cyberInsurance',
      'incomeLoss',
      'birthdayActivities',
      'afterSchoolProgram'
    ];
    coverageFlags.forEach(name => setOrDelete(name, isOn(name) ? 'true' : 'false'));

    // ===== תתי-שדות תלויי כיסוי =====
    // אובדן הכנסות
    if (isOn('incomeLoss')) {
      setOrDelete('incomeLossDuration', get('.incomeLossDuration')?.value);
      setOrDelete('incomeLossAmount', get('.incomeLossAmount')?.value);
    } else {
      params.delete('incomeLossDuration');
      params.delete('incomeLossAmount');
    }

    // אחריות צד ג'
    if (isOn('thirdParty')) {
      setOrDelete('thirdPartyCoverage', get('.thirdPartyCoverage')?.value);
    } else {
      params.delete('thirdPartyCoverage');
    }

    // תאונות סגל/מורים
    if (isOn('teacherAccidents')) {
      setOrDelete('teacherAccidentsCoverage', get('.teacherAccidentsCoverage')?.value);
    } else {
      params.delete('teacherAccidentsCoverage');
    }

    // פעילויות ימי הולדת
    if (isOn('birthdayActivities')) {
      setOrDelete('birthdayActivitiesType', get('.birthdayActivitiesType')?.value);
    } else {
      params.delete('birthdayActivitiesType');
    }

    // צהרון — מספר ילדים
    if (isOn('afterSchoolProgram')) {
      setOrDelete('afterSchoolChildrenCount', get('.afterSchoolChildrenCount')?.value);
    } else {
      params.delete('afterSchoolChildrenCount');
    }

    // ===== עדכון ה-URL (ללא רענון דף) =====
    const qs = params.toString();
    const newUrl = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;

    // מחליפים רק כשיש שינוי בפועל
    if (newUrl !== (window.location.pathname + window.location.search + window.location.hash)) {
      history.replaceState(null, '', newUrl);
    }
  }

  const fieldsToWatch = [
    'buildingSizeExact',
    'contentSumExact',
    'yardContentSumExact'
  ];

  fieldsToWatch.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculatePremium);
  });

  calculatePremium();


  // === האזנות כלליות ===
  // 1) קלטים "רגילים"
  document.addEventListener('change', scheduleUpdateUrlFromForm, true);
  document.addEventListener('input', scheduleUpdateUrlFromForm, true);

  // 2) כפתורי בחירה (מעוניין/לא) וכפתורי קבוצות – מאזין לקליקים ודן-דליי
  document.addEventListener('click', (e) => {
    // נתפוס גם כפתורי interested/not וגם button-group-ים
    if (e.target.closest('.interested-button, .not-interested-button, .button-group button')) {
      scheduleUpdateUrlFromForm();
    }
  }, true);

  // 3) לרוץ גם בטעינה ראשונה כדי לסנכרן מה שיש כרגע
  // (אם נטענת עם פרמטרים קיימים – יישארו; אם אין – יימחקו)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleUpdateUrlFromForm);
  } else {
    scheduleUpdateUrlFromForm();
  }
})();
