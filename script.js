document.addEventListener('DOMContentLoaded', () => {
  // Form Elements
  const form = document.getElementById('insuranceForm');
  const sections = [
    document.getElementById('contactDetails'),
    document.getElementById('insuranceDetails'),
    document.getElementById('coverageAddons'),
    document.getElementById('premiumReview'),
    document.getElementById('thankYouSection')
  ];
  let currentSectionIndex = 0;

  const gardenType = document.getElementById('gardenType');
  const childrenCount = document.getElementById('childrenCount');
  const insuranceOptions = document.querySelectorAll('input[name="insuranceOptions"]');
  const contentBuildingSection = document.getElementById('contentBuildingSection');
  const thirdPartySection = document.getElementById('thirdPartySection');
  const teacherAccidentsSection = document.getElementById('teacherAccidentsSection');
  const employerLiabilitySection = document.getElementById('employerLiabilitySection');
  const incomeLossSection = document.getElementById('incomeLossSection');
  const afterSchoolProgramSection = document.getElementById('afterSchoolProgramSection');
  const hasLienCheckbox = document.getElementById('hasLien');
  const lienSection = document.getElementById('lienSection');
  const premiumAmount = document.getElementById('premiumAmount');

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
      if (backButton) backButton.textContent = backButtonText[index - 1];

      // עדכון פרמיה
      calculatePremium();

      // עדכון בר התקדמות
      const progressFill = document.getElementById('progressBarFill');
      if (progressFill) {
        const totalSteps = 4;
        const percentage = Math.min((index / totalSteps) * 100, 100);
        progressFill.style.width = `${percentage}%`;
      }

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

    if (!gardenTypeValue || childrenCountValue < 1) {
      premiumAmount.textContent = '0 שח';
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
          const discount = (childrenCountValue - 10) * 10;
          premium = Math.max(1100, premium - discount);
        }
        break;
      case 'upTo3': // מסלול 7
        premium = 1400;
        if (childrenCountValue > 12) premium += (childrenCountValue - 12) * 120;
        const discount7 = childrenCountValue * 10;
        premium = Math.max(1400, premium - discount7);
        break;
      case 'over3': // מסלול 5 or 6
      case 'afterSchool':
        const hasContentBuilding = document.querySelector('input[value="contentBuilding"]').checked;
        if (hasContentBuilding) { // מסלול 6
          premium = 1400;
          if (childrenCountValue > 17) premium += (childrenCountValue - 17) * 80;
          const discount6 = childrenCountValue * 5;
          premium = Math.max(1400, premium - discount6);
        } else { // מסלול 5
          premium = 1100;
          if (childrenCountValue > 20) premium += (childrenCountValue - 20) * 55;
          const discount5 = childrenCountValue * 5;
          premium = Math.max(1100, premium - discount5);
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

    premiumAmount.textContent = `${premium.toLocaleString()} שח`;
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
    'policyEndDate',
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
    'afterSchoolChildrenCount'
  ];

  const checkboxFields = [
    'hasLien',
    'contentBuilding',
    'thirdParty',
    'deductibleCancellation',
    'teacherAccidents',
    'professionalLiability',
    'employerLiability',
    'cyberInsurance',
    'incomeLoss',
    'afterSchoolProgram'
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
        tooltip.style.top = `${rect.top + window.scrollY - (tooltipRect.height / 2) + (rect.height / 2)}px`;
        tooltip.style.right = `${window.innerWidth - rect.left + 10}px`;
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
      gardenName: document.getElementById('gardenName').value,
      gardenType: document.getElementById('gardenType').value,
      address: document.getElementById('address').value,
      policyNumber: document.getElementById('policyNumber').value,
      childrenCount: parseInt(document.getElementById('childrenCount').value) || 0,
      policyEndDate: document.getElementById('policyEndDate').value,
      customerName: document.getElementById('customerName').value,
      emailAddress: document.getElementById('emailAddress').value,
      phoneNumber: document.getElementById('phoneNumber').value,
      insuranceOptions: {
        contentBuilding: document.querySelector('input[value="contentBuilding"]').checked,
        thirdParty: document.querySelector('input[value="thirdParty"]').checked,
        deductibleCancellation: document.querySelector('input[value="deductibleCancellation"]').checked,
        teacherAccidents: document.querySelector('input[value="teacherAccidents"]').checked,
        professionalLiability: document.querySelector('input[value="professionalLiability"]').checked,
        employerLiability: document.querySelector('input[value="employerLiability"]').checked,
        cyberInsurance: document.querySelector('input[value="cyberInsurance"]').checked,
        incomeLoss: document.querySelector('input[value="incomeLoss"]').checked,
        afterSchoolProgram: document.querySelector('input[value="afterSchoolProgram"]').checked
      },
      premium: parseInt(premiumAmount.textContent.replace(/[^0-9]/g, '')) || 0
    };

    if (formData.insuranceOptions.contentBuilding) {
      formData.contentBuildingDetails = {
        contentSum: document.getElementById('contentSum').value,
        buildingSum: document.getElementById('buildingSum').value,
        yardContentSum: document.getElementById('yardContentSum').value,
        buildingType: document.getElementById('buildingType').value,
        hasLien: document.getElementById('hasLien').checked,
        lienHolder: document.getElementById('hasLien').checked ? document.getElementById('lienHolder').value : ''
      };
    }
    if (formData.insuranceOptions.thirdParty) {
      formData.thirdPartyDetails = { coverage: document.getElementById('thirdPartyCoverage').value };
    }
    if (formData.insuranceOptions.teacherAccidents) {
      formData.teacherAccidentsDetails = { plan: document.getElementById('teacherAccidentsCoverage').value };
    }
    if (formData.insuranceOptions.employerLiability) {
      formData.employerLiabilityDetails = { employeeType: document.getElementById('employerLiabilityCoverage').value };
    }
    if (formData.insuranceOptions.incomeLoss) {
      formData.incomeLossDetails = { duration: document.getElementById('incomeLossDuration').value };
    }
    if (formData.insuranceOptions.afterSchoolProgram) {
      formData.afterSchoolProgramDetails = { afterSchoolChildrenCount: document.getElementById('afterSchoolChildrenCount').value };
    }
    return formData;
  }

  // Function to send data to webhook
  async function sendToWebhook(data) {
    try {
      const response = await fetch('https://hook.eu2.make.com/c8jk8qsq7mnwtdg5aevxvxhdg8m3yocw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Webhook request failed');
      return await response.ok;
    } catch (error) {
      console.error('Error sending to webhook:', error);
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
        currentSectionIndex = 4;
        showSection(currentSectionIndex);
        Object.values({ contentBuildingSection, thirdPartySection, teacherAccidentsSection, employerLiabilitySection, incomeLossSection, afterSchoolProgramSection }).forEach(section => section.style.display = 'none');
        lienSection.style.display = 'none';
        premiumAmount.textContent = '0 שח';
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

// Listener for the bank transfer popup
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('bank-button')) {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    document.body.appendChild(popupOverlay);

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
          <strong>פרטי העברה בנקאית:</strong><br>
          בנק: 12<br>
          סניף: 345<br>
          חשבון: 567890<br>
          שם המוטב: אשר לוי סוכנות לביטוח
        </div>
        <button class="popup-close">סגור</button>
      `;
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
  }
});