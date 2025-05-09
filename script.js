document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('insuranceForm');
  const gardenTypeSelect = document.getElementById('gardenType');
  const childrenCountInput = document.getElementById('childrenCount');
  const checkboxes = document.querySelectorAll('input[name="insuranceOptions"]');
  const premiumAmountSpan = document.getElementById('premiumAmount');
  const sections = {
    contentBuilding: document.getElementById('contentBuildingSection'),
    thirdParty: document.getElementById('thirdPartySection'),
    teacherAccidents: document.getElementById('teacherAccidentsSection'),
    employerLiability: document.getElementById('employerLiabilitySection'),
    incomeLoss: document.getElementById('incomeLossSection'),
    afterSchoolProgram: document.getElementById('afterSchoolProgramSection')
  };
  const hasLienCheckbox = document.getElementById('hasLien');
  const lienSection = document.getElementById('lienSection');
  const thirdPartyCoverageSelect = document.getElementById('thirdPartyCoverage');
  const teacherAccidentsCoverageSelect = document.getElementById('teacherAccidentsCoverage');
  const employerLiabilityCoverageSelect = document.getElementById('employerLiabilityCoverage');
  const incomeLossDurationSelect = document.getElementById('incomeLossDuration');
  const afterSchoolChildrenCountInput = document.getElementById('afterSchoolChildrenCount');

  // Prefill form fields from URL parameters
  const params = new URLSearchParams(window.location.search);
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
    const value = params.get(field);
    if (value) {
      const input = document.getElementById(field);
      if (input) {
        if (input.tagName === 'SELECT') {
          const validOptions = Array.from(input.options).map(option => option.value);
          if (validOptions.includes(value)) {
            input.value = value;
            input.style.backgroundColor = '#bed5ea';
          }
        } else {
          input.value = decodeURIComponent(value);
          input.style.backgroundColor = '#bed5ea';
        }
      }
    }
  });

  checkboxFields.forEach(field => {
    const value = params.get(field);
    if (value) {
      const input = document.getElementById(field) || document.querySelector(`input[name="insuranceOptions"][value="${field}"]`);
      if (input && input.type === 'checkbox') {
        const isChecked = ['true', '1', field].includes(value.toLowerCase());
        input.checked = isChecked;
        input.style.backgroundColor = '#bed5ea';
      }
    }
  });

  // Trigger updates after prefilling
  updateInsuranceOptions();
  if (hasLienCheckbox.checked) {
    toggleSection(lienSection, true);
  }
  Object.keys(sections).forEach(key => {
    const checkbox = document.querySelector(`input[name="insuranceOptions"][value="${key}"]`);
    if (checkbox && checkbox.checked) {
      toggleSection(sections[key], true);
    }
  });
  calculatePremium();

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
    const gardenType = gardenTypeSelect.value;
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

    // Define available options per garden type
    switch (gardenType) {
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
        options.contentBuilding = gardenType === 'over3';
        options.thirdParty = true;
        options.deductibleCancellation = true;
        options.teacherAccidents = true;
        options.professionalLiability = true;
        options.employerLiability = true;
        options.cyberInsurance = true;
        options.afterSchoolProgram = true;
        break;
    }

    // Enable/disable checkboxes
    checkboxes.forEach(checkbox => {
      const isEnabled = options[checkbox.value];
      checkbox.disabled = !isEnabled;
      checkbox.checked = isEnabled ? checkbox.checked : false;
      if (sections[checkbox.value]) {
        toggleSection(sections[checkbox.value], isEnabled && checkbox.checked);
      }
    });
  }

  // Show/hide conditional sections based on checkbox state
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const section = sections[checkbox.value];
      if (section) {
        toggleSection(section, checkbox.checked);
      }
      calculatePremium();
    });
  });

  // Show/hide lien section based on hasLien checkbox
  hasLienCheckbox.addEventListener('change', () => {
    toggleSection(lienSection, hasLienCheckbox.checked);
    calculatePremium();
  });

  // Update options and premium on garden type or children count change
  gardenTypeSelect.addEventListener('change', () => {
    updateInsuranceOptions();
    calculatePremium();
  });
  childrenCountInput.addEventListener('input', calculatePremium);
  thirdPartyCoverageSelect.addEventListener('change', calculatePremium);
  teacherAccidentsCoverageSelect.addEventListener('change', calculatePremium);
  employerLiabilityCoverageSelect.addEventListener('change', calculatePremium);
  incomeLossDurationSelect.addEventListener('change', calculatePremium);
  afterSchoolChildrenCountInput.addEventListener('input', calculatePremium);

  // Tooltip Handling
  document.querySelectorAll('.info-button[data-tooltip]').forEach(button => {
    button.addEventListener('mouseenter', () => {
      const tooltipText = button.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerHTML = tooltipText;
      form.appendChild(tooltip);

      // Position tooltip
      const buttonRect = button.getBoundingClientRect();
      const formRect = form.getBoundingClientRect();
      tooltip.style.left = `${buttonRect.left - formRect.left - 170}px`; // 160px tooltip width + 10px gap
      tooltip.style.top = `${buttonRect.top - formRect.top + buttonRect.height / 2}px`;
      tooltip.style.transform = 'translateY(-50%)';
    });

    button.addEventListener('mouseleave', () => {
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
  });

  // Popup Handling
  const popupOverlay = document.createElement('div');
  popupOverlay.className = 'popup-overlay';
  document.body.appendChild(popupOverlay);

  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-content"></div>
    <button class="popup-close">סגור</button>
  `;
  document.body.appendChild(popup);

  const popupContent = popup.querySelector('.popup-content');
  const popupClose = popup.querySelector('.popup-close');

  document.querySelectorAll('.info-button[data-popup]').forEach(button => {
    button.addEventListener('click', () => {
      const popupText = button.getAttribute('data-popup');
      popupContent.innerHTML = popupText;
      popup.style.display = 'block';
      popupOverlay.style.display = 'block';
    });
  });

  popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
  });

  popupOverlay.addEventListener('click', () => {
    popup.style.display = 'none';
    popupOverlay.style.display = 'none';
  });

  // Function to calculate premium
  function calculatePremium() {
    const gardenType = gardenTypeSelect.value;
    const childrenCount = parseInt(childrenCountInput.value) || 0;
    let premium = 0;

    if (!gardenType || childrenCount < 1) {
      premiumAmountSpan.textContent = '0 שח';
      return;
    }

    // Premium calculation based on track
    switch (gardenType) {
      case 'tamah': // מסלול 1
        if (childrenCount <= 6) premium = 500;
        else if (childrenCount <= 10) premium = 1000;
        else premium = 1000 + (childrenCount - 10) * 100;
        break;
      case 'privateFamily': // מסלול 2, 3, 4
        if (childrenCount <= 6) {
          premium = 650; // מסלול 2
        } else if (childrenCount <= 8) {
          premium = 900; // מסלול 3
        } else if (childrenCount === 9) {
          premium = 900 + 105; // מסלול 3
        } else {
          premium = 1100 + (childrenCount - 10) * 110; // מסלול 4
          const discount = (childrenCount - 10) * 10;
          premium = Math.max(1100, premium - discount);
        }
        break;
      case 'upTo3': // מסלול 7
        premium = 1400;
        if (childrenCount > 12) premium += (childrenCount - 12) * 120;
        const discount7 = childrenCount * 10;
        premium = Math.max(1400, premium - discount7);
        break;
      case 'over3': // מסלול 5 or 6
      case 'afterSchool':
        const hasContentBuilding = document.querySelector('input[value="contentBuilding"]').checked;
        if (hasContentBuilding) { // מסלול 6
          premium = 1400;
          if (childrenCount > 17) premium += (childrenCount - 17) * 80;
          const discount6 = childrenCount * 5;
          premium = Math.max(1400, premium - discount6);
        } else { // מסלול 5
          premium = 1100;
          if (childrenCount > 20) premium += (childrenCount - 20) * 55;
          const discount5 = childrenCount * 5;
          premium = Math.max(1100, premium - discount5);
        }
        break;
    }

    // Add costs for extensions
    if (document.querySelector('input[value="contentBuilding"]').checked) {
      const contentSum = parseFloat(document.getElementById('contentSum').value.replace(/[^0-9.]/g, '')) || 0;
      if (contentSum > 200000) premium += (contentSum - 200000) * 0.001; // Arbitrary rate for excess
    }

    if (document.querySelector('input[value="thirdParty"]').checked) {
      const coverage = document.getElementById('thirdPartyCoverage').value;
      if (childrenCount <= 20) {
        premium += coverage === '5M' ? 200 : coverage === '8M' ? 1000 : 2000;
      } else {
        premium += coverage === '5M' ? 300 : coverage === '8M' ? 1000 : 2000;
      }
    }

    if (document.querySelector('input[value="deductibleCancellation"]').checked) {
      premium += childrenCount <= 20 ? 200 : 300;
    }

    if (document.querySelector('input[value="teacherAccidents"]').checked) {
      const plan = document.getElementById('teacherAccidentsCoverage').value;
      premium += plan === 'A' ? 200 : plan === 'B' ? 600 : 800;
    }

    if (document.querySelector('input[value="professionalLiability"]').checked) {
      premium += 250; // Arbitrary value
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

    premiumAmountSpan.textContent = `${premium.toLocaleString()} שח`;
    return premium;
  }

  // Function to collect form data as JSON
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
      premium: parseInt(premiumAmountSpan.textContent.replace(/[^0-9]/g, '')) || 0
    };

    // Add conditional fields if their sections are visible
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
      formData.thirdPartyDetails = {
        coverage: document.getElementById('thirdPartyCoverage').value
      };
    }

    if (formData.insuranceOptions.teacherAccidents) {
      formData.teacherAccidentsDetails = {
        plan: document.getElementById('teacherAccidentsCoverage').value
      };
    }

    if (formData.insuranceOptions.employerLiability) {
      formData.employerLiabilityDetails = {
        employeeType: document.getElementById('employerLiabilityCoverage').value
      };
    }

    if (formData.insuranceOptions.incomeLoss) {
      formData.incomeLossDetails = {
        duration: document.getElementById('incomeLossDuration').value
      };
    }

    if (formData.insuranceOptions.afterSchoolProgram) {
      formData.afterSchoolProgramDetails = {
        afterSchoolChildrenCount: document.getElementById('afterSchoolChildrenCount').value
      };
    }

    return formData;
  }

  // Function to send POST request to webhook
  async function sendToWebhook(data) {
    try {
      const response = await fetch('https://hook.eu2.make.com/c8jk8qsq7mnwtdg5aevxvxhdg8m3yocw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Error sending to webhook:', error);
      throw error;
    }
  }

  // Form submission validation and webhook submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Check all visible required fields
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
        alert('הטופס נשלח בהצלחה!');
        form.reset();
        // Hide all conditional sections after reset
        Object.values(sections).forEach(section => {
          section.style.display = 'none';
        });
        lienSection.style.display = 'none';
        premiumAmountSpan.textContent = '0 שח';
        updateInsuranceOptions();
        // Hide popup if open
        popup.style.display = 'none';
        popupOverlay.style.display = 'none';
        // Reset background colors
        form.querySelectorAll('input, select').forEach(input => {
          input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
      } catch (error) {
        alert('שגיאה בשליחת הטופס. אנא נסה שוב.');
      }
    } else {
      alert('אנא מלא את כל השדות הנדרשים.');
    }
  });

  // Clear custom validity on input to prevent persistent error messages
  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      input.setCustomValidity('');
      input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
  });

  // Initial premium calculation
  calculatePremium();
});