const form = document.getElementById('insuranceForm');
const sections = [
  document.getElementById('step1'),
  document.getElementById('step2'),
  document.getElementById('step3'),
  document.getElementById('successSection')
];
let currentSectionIndex = 0;

form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag !== 'textarea') {
      e.preventDefault();
    }
  }
});

// ===== STEPPER HELPERS =====
function updateStepper(index) {
  const steps = document.querySelectorAll('.stepper-step');
  const lines = document.querySelectorAll('.stepper-line');
  const fill = document.getElementById('progressFill');

  steps.forEach((step, i) => {
    const stepNum = i + 1;
    step.classList.remove('active', 'completed');
    if (stepNum < index + 1) {
      step.classList.add('completed');
    } else if (stepNum === index + 1) {
      step.classList.add('active');
    }
  });

  lines.forEach((line, i) => {
    line.classList.remove('completed');
    if (i < index) {
      line.classList.add('completed');
    }
  });

  const totalSteps = 3;
  const percentage = Math.min((index / (totalSteps - 1)) * 100, 100);
  fill.style.width = `${percentage}%`;
}

// ===== SECTION MANAGEMENT =====
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

    if (index === 1) {
      initSignatureCanvas('signatureCanvas1');
      initSignatureCanvas('signatureCanvas2');
    }

    currentSectionIndex = index;
    updateStepper(index);
  }, 400);
}

// ===== SIGNATURE CANVAS =====
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

  canvas.addEventListener('mouseup', () => { drawing = false; });
  canvas.addEventListener('mouseout', () => { drawing = false; });

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    drawing = true;
    const pos = getXY(touch);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!drawing) return;
    const touch = e.touches[0];
    const pos = getXY(touch);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  });

  canvas.addEventListener('touchend', () => { drawing = false; });
}

window.clearSignature = function (num) {
  const canvas = document.getElementById(`signatureCanvas${num}`);
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

function isCanvasBlank(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 0) return false;
  }
  return true;
}

// ===== DISTRIBUTION PREFERENCES =====
document.querySelectorAll('.distribution-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.distribution-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const value = card.dataset.value;
    document.getElementById('distributionPreference').value = value;

    const printedGroup = document.getElementById('printedCopiesGroup');
    if (value === 'mixed') {
      printedGroup.style.display = 'block';
      document.getElementById('printedCopiesCount').required = true;
    } else {
      printedGroup.style.display = 'none';
      document.getElementById('printedCopiesCount').required = false;
      document.getElementById('printedCopiesCount').value = '';
    }
  });
});

// ===== FILE UPLOAD =====
const fileInput = document.getElementById('excelFile');
const fileUploadZone = document.getElementById('fileUploadZone');
const fileInfo = document.getElementById('fileInfo');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const removeFileBtn = document.getElementById('removeFileBtn');
const fileUploadLabel = document.getElementById('fileUploadLabel');

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileNameDisplay.textContent = file.name;
    fileInfo.style.display = 'flex';
    fileUploadLabel.textContent = 'החלף קובץ';
  } else {
    resetFileUpload();
  }
});

removeFileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  resetFileUpload();
});

function resetFileUpload() {
  fileInput.value = '';
  fileInfo.style.display = 'none';
  fileNameDisplay.textContent = '';
  fileUploadLabel.textContent = 'בחרו קובץ';
}

fileUploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileUploadZone.classList.add('dragover');
});

fileUploadZone.addEventListener('dragleave', () => {
  fileUploadZone.classList.remove('dragover');
});

fileUploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  fileUploadZone.classList.remove('dragover');
  if (e.dataTransfer.files.length > 0) {
    fileInput.files = e.dataTransfer.files;
    fileInput.dispatchEvent(new Event('change'));
  }
});

// ===== VALIDATION HELPERS =====
function isValidEmail(email) {
  const cleaned = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned);
}

function isValidPhoneNumber(phone) {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^0\d{8,9}$/.test(cleaned);
}

function markInvalid(el) {
  el.style.borderColor = 'red';
}

function markValid(el) {
  el.style.borderColor = '';
}

function scrollToFirstError(container) {
  const firstError = container.querySelector('input[style*="border-color: red"], select[style*="border-color: red"]');
  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstError.focus();
  }
}

// ===== NAVIGATION — NEXT =====
document.querySelectorAll('.next-button').forEach(button => {
  button.addEventListener('click', () => {
    let isValid = true;

    if (currentSectionIndex === 0) {
      // --- STEP 1 VALIDATION ---
      const step1 = document.getElementById('step1');
      const requiredInputs = step1.querySelectorAll('input:required');
      const distributionVal = document.getElementById('distributionPreference').value;

      requiredInputs.forEach(input => {
        if (input.id === 'printedCopiesCount' && distributionVal !== 'mixed') {
          markValid(input);
          return;
        }
        if (!input.value.trim()) {
          isValid = false;
          markInvalid(input);
        } else {
          markValid(input);
        }
      });

      if (!distributionVal) {
        isValid = false;
        alert('אנא בחר אופציה להפקת והפצת הפוליסות');
        return;
      }

      if (distributionVal === 'mixed') {
        const printedCopies = document.getElementById('printedCopiesCount');
        if (!printedCopies.value.trim() || parseInt(printedCopies.value) < 1) {
          isValid = false;
          markInvalid(printedCopies);
          alert('אנא הזן כמות עותקים מודפסים');
          return;
        }
      }

      // Validate email
      const emailInput = document.getElementById('contactEmail');
      if (emailInput.value.trim() && !isValidEmail(emailInput.value)) {
        isValid = false;
        markInvalid(emailInput);
        alert('אנא הזן כתובת דוא"ל תקינה');
        return;
      }

      // Validate phone
      const phoneInput = document.getElementById('contactPhone');
      if (phoneInput.value.trim() && !isValidPhoneNumber(phoneInput.value)) {
        isValid = false;
        markInvalid(phoneInput);
        alert('אנא הזן מספר טלפון תקין בפורמט ישראלי');
        return;
      }

      const mobileInput = document.getElementById('contactMobile');
      if (mobileInput.value.trim() && !isValidPhoneNumber(mobileInput.value)) {
        isValid = false;
        markInvalid(mobileInput);
        alert('אנא הזן מספר נייד תקין בפורמט ישראלי');
        return;
      }

      // Validate numeric fields
      const studentsCount = document.getElementById('studentsCount3to18');
      const childrenCount = document.getElementById('childrenCount0to3');
      if (studentsCount.value && parseInt(studentsCount.value) < 0) {
        isValid = false;
        markInvalid(studentsCount);
        alert('מספר התלמידים חייב להיות 0 ומעלה');
        return;
      }
      if (childrenCount.value && parseInt(childrenCount.value) < 0) {
        isValid = false;
        markInvalid(childrenCount);
        alert('מספר הילדים חייב להיות 0 ומעלה');
        return;
      }

      if (!isValid) {
        scrollToFirstError(step1);
        alert('אנא מלא את כל שדות החובה');
        return;
      }

      // Navigate to step 2
      const nextIndex = sections.findIndex(sec => sec.id === 'step2');
      if (nextIndex !== -1) {
        currentSectionIndex = nextIndex;
        showSection(currentSectionIndex);
      }
    } else if (currentSectionIndex === 1) {
      // --- STEP 2 VALIDATION ---
      const canvas1 = document.getElementById('signatureCanvas1');
      const canvas2 = document.getElementById('signatureCanvas2');

      if (!canvas1 || isCanvasBlank(canvas1)) {
        isValid = false;
        canvas1.style.border = "2px solid red";
        setTimeout(() => canvas1.style.border = "", 2000);
        alert('אנא חתום על נספח 1');
        canvas1.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (!canvas2 || isCanvasBlank(canvas2)) {
        isValid = false;
        canvas2.style.border = "2px solid red";
        setTimeout(() => canvas2.style.border = "", 2000);
        alert('אנא חתום על נספח 2');
        canvas2.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Navigate to step 3
      const nextIndex = sections.findIndex(sec => sec.id === 'step3');
      if (nextIndex !== -1) {
        currentSectionIndex = nextIndex;
        showSection(currentSectionIndex);
      }
    }
  });
});

// ===== NAVIGATION — BACK =====
document.querySelectorAll('.back-button').forEach(button => {
  button.addEventListener('click', () => {
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
      showSection(currentSectionIndex);
    }
  });
});

// ===== FORM SUBMIT =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Must be on step 3
  if (sections[currentSectionIndex]?.id !== 'step3') {
    return;
  }

  // Validate privacy consent
  const privacyCb = document.getElementById('privacyConsent');
  if (!privacyCb.checked) {
    alert('אנא אשר/י את הצהרת הפרטיות לפני השליחה.');
    privacyCb.focus();
    return;
  }

  // Validate file upload
  if (!fileInput.files[0]) {
    alert('אנא העלה קובץ אקסל עם רשימת הילדים');
    fileUploadZone.style.borderColor = 'red';
    setTimeout(() => fileUploadZone.style.borderColor = '', 2000);
    return;
  }

  // Validate file extension
  const fileName = fileInput.files[0].name;
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext !== 'xlsx' && ext !== 'xls') {
    alert('אנא העלה קובץ אקסל בלבד (סיומות .xlsx או .xls)');
    return;
  }

  try {
    const formData = collectFormData();
    await sendToWebhook(formData);
    const successIndex = sections.findIndex(sec => sec.id === 'successSection');
    if (successIndex !== -1) {
      currentSectionIndex = successIndex;
      showSection(currentSectionIndex);
    }
  } catch (error) {
    alert('שגיאה בשליחת הטופס. אנא נסה שוב.');
    console.error('Submit error:', error);
  }
});

// ===== COLLECT FORM DATA =====
function collectFormData() {
  const fd = new FormData();

  // --- Step 1: Text fields ---
  const textFields = {
    orderingEntityName: document.getElementById('orderingEntityName'),
    formDate: document.getElementById('formDate'),
    insuredName: document.getElementById('insuredName'),
    companyId: document.getElementById('companyId'),
    companyAddress: document.getElementById('companyAddress'),
    studentsCount3to18: document.getElementById('studentsCount3to18'),
    childrenCount0to3: document.getElementById('childrenCount0to3'),
    distributionPreference: document.getElementById('distributionPreference'),
    printedCopiesCount: document.getElementById('printedCopiesCount'),
    contactFullName: document.getElementById('contactFullName'),
    contactPhone: document.getElementById('contactPhone'),
    contactRole: document.getElementById('contactRole'),
    contactMobile: document.getElementById('contactMobile'),
    contactEmail: document.getElementById('contactEmail'),
    contactAddress: document.getElementById('contactAddress'),
    signeeHeadAuthority: document.getElementById('signeeHeadAuthority'),
    signeeTreasurer: document.getElementById('signeeTreasurer'),
    signeeEducationDirector: document.getElementById('signeeEducationDirector')
  };

  for (const [key, el] of Object.entries(textFields)) {
    if (el) {
      fd.append(key, el.value || '');
    }
  }

  // --- Step 2: Signature blobs ---
  const canvas1 = document.getElementById('signatureCanvas1');
  const canvas2 = document.getElementById('signatureCanvas2');

  if (canvas1) {
    const blob1 = dataURItoBlob(canvas1.toDataURL('image/png'));
    fd.append('signatureAppendix1', blob1, 'signature_appendix1.png');
  }

  if (canvas2) {
    const blob2 = dataURItoBlob(canvas2.toDataURL('image/png'));
    fd.append('signatureAppendix2', blob2, 'signature_appendix2.png');
  }

  // --- Step 3: Excel file ---
  if (fileInput.files[0]) {
    fd.append('childrenRosterFile', fileInput.files[0]);
  }

  // --- Metadata ---
  const now = new Date();
  fd.append('submittedAt', now.toISOString());
  fd.append('formType', 'studentAccidentInsuranceAppendices');

  return fd;
}

// ===== DATA URI TO BLOB =====
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// ===== SEND TO WEBHOOK =====
async function sendToWebhook(formData) {
  console.log('Sending form data to webhook...');
  for (let [key, value] of formData.entries()) {
    const valInfo = value instanceof Blob ? `[Blob: ${value.type}, ${value.size} bytes]` : value;
    console.log(`  ${key}: ${valInfo}`);
  }

  const response = await fetch('https://hook.eu2.make.com/noaphqor8k2kt1oedgwjyldocgbokgns', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${errorText}`);
  }

  const responseText = await response.text();
  console.log('Webhook response:', responseText);
  return responseText;
}
