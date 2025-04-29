document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('insuranceForm');
  const checkboxes = document.querySelectorAll('input[name="insuranceOptions"]');
  const sections = {
    contentBuilding: document.getElementById('contentBuildingSection'),
    thirdParty: document.getElementById('thirdPartySection'),
    teacherAccidents: document.getElementById('teacherAccidentsSection'),
    employerLiability: document.getElementById('employerLiabilitySection')
  };
  const hasLienCheckbox = document.getElementById('hasLien');
  const lienSection = document.getElementById('lienSection');

  // Show/hide conditional sections based on checkbox state
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const section = sections[checkbox.value];
      if (section) {
        section.style.display = checkbox.checked ? 'block' : 'none';
        // Toggle required attribute for inputs in the section
        const inputs = section.querySelectorAll('input');
        inputs.forEach(input => {
          input.required = checkbox.checked;
        });
      }
    });
  });

  // Show/hide lien

  hasLienCheckbox.addEventListener('change', () => {
    lienSection.style.display = hasLienCheckbox.checked ? 'block' : 'none';
    const lienInput = lienSection.querySelector('input');
    lienInput.required = hasLienCheckbox.checked;
  });

  // Function to collect form data as JSON
  function collectFormData() {
    const formData = {
      gardenName: document.getElementById('gardenName').value,
      address: document.getElementById('address').value,
      policyNumber: document.getElementById('policyNumber').value,
      childrenCount: parseInt(document.getElementById('childrenCount').value) || 0,
      policyEndDate: document.getElementById('policyEndDate').value,
      insuranceOptions: {
        contentBuilding: document.querySelector('input[value="contentBuilding"]').checked,
        thirdParty: document.querySelector('input[value="thirdParty"]').checked,
        deductibleCancellation: document.querySelector('input[value="deductibleCancellation"]').checked,
        teacherAccidents: document.querySelector('input[value="teacherAccidents"]').checked,
        professionalLiability: document.querySelector('input[value="professionalLiability"]').checked,
        employerLiability: document.querySelector('input[value="employerLiability"]').checked
      }
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
        coverage: document.getElementById('teacherAccidentsCoverage').value
      };
    }

    if (formData.insuranceOptions.employerLiability) {
      formData.employerLiabilityDetails = {
        coverage: document.getElementById('employerLiabilityCoverage').value
      };
    }

    return formData;
  }

  // Function to send POST request to webhook
  async function sendToWebhook(data) {
    try {
      const response = await fetch('https://hook.eu2.make.com/1wc3bucwe6cbv19s7lhnwdws7tfgk5g3', {
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
    const visibleInputs = form.querySelectorAll('input:required');
    visibleInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'red';
      } else {
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
      } catch (error) {
        alert('שגיאה בשליחת הטופס. אנא נסה שוב.');
      }
    } else {
      alert('אנא מלא את כל השדות הנדרשים.');
    }
  });
});