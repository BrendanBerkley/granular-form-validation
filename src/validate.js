gfv.validateFields = function(fieldsToValidate) {
	var invalidFields = [];
	// If we're only passing in a single element, recast it as an array
	if (!fieldsToValidate.length) {
		var array = [];
		array.push(fieldsToValidate);
		fieldsToValidate = array;
	}

	[].forEach.call(fieldsToValidate, function(field) {
		field.gfvErrors = [];
		var allValidations = field.getAttribute('data-gfv-validate').split(',');

		allValidations.forEach(function(validation) {
			var validate = validation.split(":");
			var error = gfv.checkField(validate, field);
			if (error) {
				field.gfvErrors.push(error);
			}
		});

		if (field.gfvErrors.length > 0) {
			invalidFields.push(field);
		}

	});

	return invalidFields;
};


gfv.checkField = function(check, field) {
	switch(check[0]) {
		case "required":
			console.log('required check for:');
			console.log(field);
			switch(field.type) {
				case 'checkbox':
				case 'radio':
					// if blank name, assume it's solo
					// otherwise check for other fields with that name
					console.log(field.name);
					console.log(field.checked);
					break;
				default:
					if (field.value === "") {
						return "This field is required.";
					}
			}
			break;

		case "emailLite":
			// checking for something, @, something, ., and at least two somethings after that.
			var emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
			if (!emailRegExp.test(field.value)) {
				return "Enter a valid e-mail address.";
			}
			break;

		case "email":
			// As per the HTML5 Specification
			// most technically correct, but many will not see it as practical
			// because it doesn't require a period after the @
			var emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			if (!emailRegExp.test(field.value)) {
				return "Enter a valid e-mail address.";
			}
			break;

		case "minlength":
			if (field.value.length < check[1]) {
				return "Must be at least " + check[1] + " characters.";
			}
			break;
			
		case "maxlength":
			if (field.value.length > check[1]) {
				return "Cannot be more than " + check[1] + " characters.";
			}
			break;

		case "matches":
			var valueToMatch = document.getElementById(check[1]).value;
			if (field.value !== valueToMatch) {
				var label = document.querySelector('label[for='+ check[1] +']').textContent.trim();
				return "Must match " + label + " field.";
			}
			break;
	}
};