var gfv = {};

gfv.initialize = function(form, userOptions) {
	var fieldsToValidate = form.querySelectorAll("*[data-gfv-validate]");
	if (fieldsToValidate.length === 0) {
		throw new Error("Validator initialized but no fields to validate were found");
	}

	// Set default options
	gfv.options = {
		'location': 'after',
		'errorListClass': 'error-list',
		'wrapper': '',
		'validateBeforeSubmit': 'afterFirstSubmit', 
		'errorFieldClass': false,
		'scrollToFirstError': 'scroll'
	}

	// Updated with custom options
	for(var property in userOptions) {
		if(userOptions.hasOwnProperty(property)) {
			gfv.options[property] = userOptions[property];
		}
	}

	form.addEventListener('submit', function(event) {
		if (fieldsToValidate.length > 0) {
			[].forEach.call(fieldsToValidate, function(field) {
				if (field.gfvErrorList) {
					if (field.gfvErrorList.parentNode) {
						field.gfvErrorList.parentNode.removeChild(field.gfvErrorList);
					}
				}
				if (typeof gfv.options.errorFieldClass === 'string') {
					field.classList.remove(gfv.options.errorFieldClass);
				}
			});
			var invalidFields = gfv.validateFields(fieldsToValidate);
			if (invalidFields.length > 0) {
				event.preventDefault();
				if (gfv.options.validateBeforeSubmit === 'afterFirstSubmit') {
					form.setAttribute('data-gfv-submitted-once','true');
				}
				gfv.placeErrors(invalidFields);

				if (gfv.options.scrollToFirstError === 'scroll') {
					$('html, body').animate({
						scrollTop: $(invalidFields[0]).offset().top - 50
					}, 500);
				}
			}
		}
	});

	gfv.watchFields(form, fieldsToValidate);
};


gfv.watchFields = function(form, fieldsToValidate) {
	[].forEach.call(fieldsToValidate, function(field) {
		var type = field.type;
		var event = "";

		switch(type) {
			case 'text':
			case 'textarea':
			case 'email':
			case 'password':
				event = 'keyup';
				break;
			case 'checkbox':
				event = 'click';
				break;
			case 'file':
				event = 'change';
				break;
		}

		field.addEventListener(event, function() {
			if (gfv.options.validateBeforeSubmit === 'afterFirstSubmit' && form.getAttribute('data-gfv-submitted-once')) {
				if (field.gfvErrorList) {
					if (field.gfvErrorList.parentNode) {
						field.gfvErrorList.parentNode.removeChild(field.gfvErrorList);
					}
				}
				if (typeof gfv.options.errorFieldClass === 'string') {
					field.classList.remove(gfv.options.errorFieldClass);
				}
				var invalidFields = gfv.validateFields(field);
				gfv.placeErrors(invalidFields);
			}
		});
	});

};